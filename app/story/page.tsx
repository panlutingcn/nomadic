'use client'
export const dynamic = 'force-static'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { CITIES } from '@/data/cities'
import { useUserProfile } from '@/hooks/useUserProfile'
import LoginModal from '@/components/LoginModal'
import { extractTitle } from '@/lib/imprintUtils'

const CITY_NAME_MAP: Record<string, string> = {
  Berlin: '柏林',
  Amsterdam: '阿姆斯特丹',
  Lisbon: '里斯本',
  Prague: '布拉格',
  Tallinn: '塔林',
  Hamburg: '汉堡',
  Munich: '慕尼黑',
  Vienna: '维也纳',
  Zurich: '苏黎世',
  Barcelona: '巴塞罗那',
  Madrid: '马德里',
  Paris: '巴黎',
  London: '伦敦',
  Rome: '罗马',
  Milan: '米兰',
  Budapest: '布达佩斯',
  Warsaw: '华沙',
  Stockholm: '斯德哥尔摩',
  Copenhagen: '哥本哈根',
  Helsinki: '赫尔辛基',
  Oslo: '奥斯陆',
  Riga: '里加',
  Vilnius: '维尔纽斯',
  Bangkok: '曼谷',
  Singapore: '新加坡',
  Tokyo: '东京',
  Seoul: '首尔',
  Taipei: '台北',
  Shanghai: '上海',
  Beijing: '北京',
  Chengdu: '成都',
  Dubai: '迪拜',
}

function cityTags(cityInput: string): string[] {
  const entry = Object.values(CITIES).find(
    c => c.nameZh === cityInput || c.name.toLowerCase() === cityInput.toLowerCase()
  )
  return entry ? [entry.nameZh, entry.countryZh] : [cityInput]
}


export default function StoryPage() {
  const router = useRouter()
  const { addImprint } = useApp()
  const { user } = useAuth()
  const { nickname } = useUserProfile()
  const [city, setCity] = useState('')
  const [editingCity, setEditingCity] = useState(false)
  const [photo, setPhoto] = useState<string | undefined>(undefined)
  const fileRef = useRef<HTMLInputElement>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showVerifyPrompt, setShowVerifyPrompt] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const [title, setTitle] = useState('')
  const [narrative, setNarrative] = useState('')
  const [generating, setGenerating] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [flashTitle, setFlashTitle] = useState(false)
  const [flashCity, setFlashCity] = useState(false)
  const [flashTags, setFlashTags] = useState(false)
  const [visibility, setVisibility] = useState<'public' | 'nomad' | 'private'>('public')
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const TAG_LIMIT = 10
  const prevCityRef = useRef('')
  const gpsDetectedRef = useRef(false)

  // 读取 sessionStorage 中的照片和GPS数据
  useEffect(() => {
    const pending = sessionStorage.getItem('pendingPhoto')
    if (pending) {
      setPhoto(pending)
      sessionStorage.removeItem('pendingPhoto')
    }

    const gpsRaw = sessionStorage.getItem('pendingGPS')
    if (gpsRaw) {
      sessionStorage.removeItem('pendingGPS')
      try {
        const gpsData = JSON.parse(gpsRaw) as { lat: number; lon: number; timestamp: number }
        setGpsLoading(true)
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${gpsData.lat}&lon=${gpsData.lon}`,
          { headers: { 'Accept-Language': 'zh' } }
        )
          .then(r => r.json())
          .then(data => {
            const addr = data.address || {}
            // Prefer city (市级) over county/district (区/县级), then strip admin suffixes
            const raw: string = addr.city || addr.town || addr.village || addr.county || ''
            const cityZh = raw.replace(/[市区县镇乡]$/, '')
            if (cityZh) {
              const country: string = addr.country ?? ''
              const localTags = cityTags(cityZh)
              // If local DB found country, use it; else use Nominatim country
              const resolvedTags = localTags.length >= 2
                ? localTags
                : (country ? [cityZh, country] : localTags)
              setCity(cityZh)
              setTags(resolvedTags)
              prevCityRef.current = cityZh
              gpsDetectedRef.current = true
            }
          })
          .catch(() => {})
          .finally(() => setGpsLoading(false))
      } catch {
        setGpsLoading(false)
      }
    }
  }, [])

  // GPS识别城市后自动触发AI生成
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (gpsDetectedRef.current && city) {
      gpsDetectedRef.current = false
      generateWithAI()
    }
  }, [city])

  // 清理 blob URL
  useEffect(() => {
    return () => {
      if (photo && photo.startsWith('blob:')) URL.revokeObjectURL(photo)
    }
  }, [photo])

  // Restore and auto-publish after OAuth redirect
  useEffect(() => {
    if (!user) return
    const pending = sessionStorage.getItem('pendingImprint')
    if (!pending) return
    sessionStorage.removeItem('pendingImprint')
    ;(async () => {
      try {
        const data = JSON.parse(pending) as { city: string; narrative: string; tags: string[]; isPublic: boolean; photo?: string }
        await addImprint({ city: data.city, title: extractTitle(data.narrative, data.city), narrative: data.narrative, tags: data.tags, isPublic: data.isPublic, photo: data.photo, author: nickname ?? undefined })
        router.push(data.isPublic ? '/meet' : '/mine')
      } catch {
        // ignore malformed sessionStorage data
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const generateWithAI = async () => {
    setGenerating(true)
    try {
      let imageBase64: string | undefined
      if (photo) {
        const res = await fetch(photo)
        const blob = await res.blob()
        imageBase64 = await new Promise<string>(resolve => {
          const reader = new FileReader()
          reader.onload = () => resolve((reader.result as string).split(',')[1])
          reader.readAsDataURL(blob)
        })
      }
      const res = await fetch('/api/generate-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city,
          imageBase64,
          userInput: narrative.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (data.narrative) setNarrative(data.narrative)
    } finally {
      setGenerating(false)
    }
  }

  const getPhotoDataUrl = async (): Promise<string | undefined> => {
    if (!photo) return undefined
    try {
      return await new Promise<string>((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          const MAX = 800
          const scale = Math.min(1, MAX / Math.max(img.width, img.height))
          const w = Math.round(img.width * scale)
          const h = Math.round(img.height * scale)
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          if (!ctx) { reject(new Error('no canvas')); return }
          ctx.drawImage(img, 0, 0, w, h)
          resolve(canvas.toDataURL('image/jpeg', 0.82))
        }
        img.onerror = reject
        img.src = photo
      })
    } catch {
      return photo
    }
  }

  const handleConfirmCity = async () => {
    setEditingCity(false)
    const trimmed = city.trim()
    if (!trimmed) return
    let newCityTags = cityTags(trimmed)
    // City not in local DB — query Nominatim for country
    if (newCityTags.length === 1) {
      try {
        const res = await fetch('/api/city-country', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: trimmed }),
        })
        const data = await res.json()
        if (data.country) newCityTags = [trimmed, data.country]
      } catch { /* keep single tag */ }
    }
    setTags(prev => {
      const oldTags = prevCityRef.current ? cityTags(prevCityRef.current) : []
      const kept = prev.filter(t => !oldTags.includes(t) && !newCityTags.includes(t))
      return [...newCityTags, ...kept]
    })
    prevCityRef.current = trimmed
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (photo && photo.startsWith('blob:')) URL.revokeObjectURL(photo)
      setPhoto(URL.createObjectURL(file))
    }
  }

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed || tags.includes(trimmed)) {
      setTagInput('')
      setShowTagInput(false)
      return
    }
    if (tags.length >= TAG_LIMIT) return
    setTags(prev => [...prev, trimmed])
    setTagInput('')
    setShowTagInput(false)
  }

  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }

  const triggerFlash = (field: 'title' | 'city' | 'tags') => {
    if (field === 'title') {
      setFlashTitle(true)
      setTimeout(() => setFlashTitle(false), 900)
    } else if (field === 'city') {
      setEditingCity(false)
      setFlashCity(true)
      setTimeout(() => setFlashCity(false), 900)
    } else {
      setFlashTags(true)
      setTimeout(() => setFlashTags(false), 900)
    }
  }

  const handlePublish = async () => {
    if (publishing) return
    const isPublic = visibility === 'public'
    if (!title.trim()) {
      triggerFlash('title')
      return
    }
    const trimmedCity = city.trim()
    if (!trimmedCity) {
      triggerFlash('city')
      return
    }

    // 公开发布需要已验证邮箱
    if (isPublic && user && !user.email_confirmed_at) {
      setShowVerifyPrompt(true)
      return
    }

    if (!user) {
      const photoUrl = await getPhotoDataUrl()
      const payload = JSON.stringify({ city: trimmedCity, narrative, tags, isPublic, photo: photoUrl })
      try {
        sessionStorage.setItem('pendingImprint', payload)
      } catch {
        try {
          sessionStorage.setItem('pendingImprint', JSON.stringify({ city: trimmedCity, narrative, tags, isPublic }))
        } catch {
          // sessionStorage unavailable; publish will not auto-resume after login
        }
      }
      setShowLogin(true)
      return
    }
    setPublishing(true)
    try {
      const photoUrl = await getPhotoDataUrl()
      const finalTitle = title.trim()
      const id = await addImprint({ city: trimmedCity, title: finalTitle, narrative, tags, isPublic, photo: photoUrl, author: nickname ?? undefined })
      // Auto-cache city insights for cities not in static CITIES data
      if (!(trimmedCity in CITIES)) {
        fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: trimmedCity }),
        }).catch(() => {})
      }
      setPublished(true)
      setTimeout(() => router.push(`/imprint/${id}`), 800)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-inner" style={{ flex: 1, padding: '14px 16px 12px' }}>
        <div className="desktop-page-inner-wrap">

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button onClick={() => router.back()} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>✕ 取消</button>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>新的印迹</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>草稿</span>
        </div>

        <input ref={fileRef} type="file" accept="image/*" style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }} onChange={handlePhoto} />
        <div onClick={() => fileRef.current?.click()} style={{ background: 'var(--bg-card)', border: '0.5px dashed #c8bfaa', borderRadius: 14, height: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 14, cursor: 'pointer', overflow: 'hidden' }}>
          {photo
            ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <>
                <span style={{ fontSize: 22, color: '#c8bfaa' }}>⊙</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>点击选择照片 或 直接拍摄</span>
              </>
          }
        </div>

        <style>{`
          @keyframes borderFlash {
            0%, 100% { border-color: var(--border); }
            50% { border-color: #c04040; }
          }
          .flash-border { animation: borderFlash 0.45s ease 2; }
          @keyframes gpsPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          .gps-pulse { animation: gpsPulse 0.8s ease-in-out infinite; }
          @keyframes aiGlow {
            0%, 100% { border-color: var(--border); box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
            50% { border-color: #1d9e75; box-shadow: 0 0 0 3px rgba(29,158,117,0.1); }
          }
          .ai-glow { animation: aiGlow 1.4s ease-in-out infinite; }
        `}</style>

        {/* 标题 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>标题 <span style={{ color: '#c04040' }}>*</span></span>
          <span style={{ fontSize: 10, color: title.length > 20 ? '#c04040' : 'var(--text-muted)' }}>{title.length}/20</span>
        </div>
        <input
          value={title}
          onChange={e => { if (e.target.value.length <= 20) setTitle(e.target.value) }}
          placeholder="为这条印迹起个标题"
          className={flashTitle ? 'flash-border' : ''}
          style={{ width: '100%', background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 10, padding: '10px 12px', fontSize: 11, color: '#3d3020', lineHeight: 1.65, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', marginBottom: 12 }}
        />

        {/* 印迹 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>印迹</span>
          <button onClick={generateWithAI} disabled={generating} style={{ fontSize: 10, color: generating ? 'var(--text-muted)' : 'var(--accent)', background: 'none', border: 'none', cursor: generating ? 'default' : 'pointer', padding: 0 }}>
            {generating ? '生成中…' : 'AI 生成'}
          </button>
        </div>
        <div className={generating ? 'ai-glow' : ''} style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '10px 12px', marginBottom: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          {narrative ? (
            <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 500, marginBottom: 6 }}>✦ AI 生成</div>
          ) : null}
          <textarea
            value={narrative}
            onChange={e => setNarrative(e.target.value)}
            rows={4}
            style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: 11, color: '#3d3020', lineHeight: 1.65, resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
            placeholder="写下你在这座城市的故事，或点击右上角 AI 生成……"
          />
        </div>
        <div style={{ fontSize: 10, color: generating ? 'var(--text-muted)' : 'var(--accent)', textAlign: 'right', marginBottom: 10, cursor: generating ? 'default' : 'pointer' }} onClick={generating ? undefined : generateWithAI}>
          {generating ? '生成中…' : '重新生成 ↺'}
        </div>

        {/* 城市 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>城市 <span style={{ color: '#c04040' }}>*</span></span>
          <span className={gpsLoading ? 'gps-pulse' : ''} style={{ fontSize: 10, color: gpsLoading ? 'var(--accent)' : 'var(--text-muted)' }}>
            {gpsLoading ? 'GPS 识别中…' : 'GPS 自动识别'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
          {editingCity
            ? <input
                autoFocus
                value={city}
                onChange={e => setCity(e.target.value)}
                onBlur={handleConfirmCity}
                onKeyDown={e => { if (e.key === 'Enter') handleConfirmCity() }}
                style={{ flex: 1, background: 'var(--bg-card)', border: '0.5px solid var(--accent)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: 'var(--text-primary)' }}
              />
            : <div
                className={flashCity ? 'flash-border' : ''}
                onClick={() => setEditingCity(true)}
                style={{ flex: 1, background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: city ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'text' }}
              >
                {city || '等待GPS识别或手动输入…'}
              </div>
          }
          <button onClick={handleConfirmCity} style={{ background: '#f0ebe2', border: '0.5px solid #ddd4c0', borderRadius: 8, padding: '8px 12px', fontSize: 10, color: '#4a3c28', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 500 }}>修改城市</button>
        </div>
        <div style={{ fontSize: 9, color: '#c8bfaa', marginBottom: 12 }}>若拍摄地与当前位置不同，可手动调整</div>

        {/* 标签 */}
        <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6 }}>标签</div>
        <div className={flashTags ? 'flash-border' : ''} style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14, border: '0.5px solid transparent', borderRadius: 8, padding: '2px 0' }}>
          {tags.map(tag => (
            <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, padding: '3px 7px 3px 9px', borderRadius: 8, background: 'var(--bg-card-2)', color: 'var(--text-secondary)', border: '0.5px solid var(--border-light)' }}>
              {tag}
              <button onClick={() => handleRemoveTag(tag)} style={{ fontSize: 9, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>✕</button>
            </span>
          ))}
          {showTagInput ? (
            <input
              autoFocus
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddTag() }}
              onBlur={handleAddTag}
              placeholder="输入标签"
              style={{ fontSize: 10, padding: '3px 9px', borderRadius: 8, border: '0.5px solid var(--accent)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', width: 80 }}
            />
          ) : tags.length >= TAG_LIMIT ? (
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>最多添加 10 个标签</span>
          ) : (
            <span onClick={() => setShowTagInput(true)} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 8, color: 'var(--text-muted)', border: '0.5px dashed var(--border-light)', cursor: 'pointer' }}>+ 添加</span>
          )}
        </div>

        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>谁可以看到这条印迹</div>
        {[
          { key: 'public' as const, label: '公开', desc: '出现在社区探索流', icon: '🌍' },
          { key: 'private' as const, label: '仅自己', desc: '私藏，只存在我的领地', icon: '🔒' },
        ].map(opt => (
          <button key={opt.key} onClick={() => setVisibility(opt.key)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 14px', borderRadius: 12, background: visibility === opt.key ? 'rgba(29,158,117,0.06)' : 'var(--bg-card)', border: `${visibility === opt.key ? '1.5px solid var(--accent)' : '0.5px solid var(--border-light)'}`, cursor: 'pointer', marginBottom: 8, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${visibility === opt.key ? 'var(--accent)' : '#ddd4c0'}`, background: visibility === opt.key ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {visibility === opt.key && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{opt.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 1 }}>{opt.desc}</div>
              </div>
            </div>
            <span style={{ fontSize: 18 }}>{opt.icon}</span>
          </button>
        ))}

        <button onClick={handlePublish} disabled={publishing || published} style={{ width: '100%', padding: '15px 0', borderRadius: 14, background: published ? '#e8f5ee' : 'var(--accent)', border: published ? '1px solid #1D9E75' : 'none', color: published ? '#085041' : '#fff', fontSize: 16, fontWeight: 500, cursor: (publishing || published) ? 'not-allowed' : 'pointer', opacity: publishing ? 0.7 : 1, marginTop: 4, transition: 'all 0.3s' }}>
          {published ? '✓ 已发布' : publishing ? '发布中…' : '发布印迹'}
        </button>
        </div>{/* /desktop-page-inner-wrap */}
      </div>
      <div style={{ height: 32 }} />
      <BottomNav />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* 邮箱未验证弹窗 */}
      {showVerifyPrompt && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '0 24px' }}
          onClick={() => setShowVerifyPrompt(false)}
        >
          <div
            style={{ background: '#f0ebe0', borderRadius: 20, padding: '28px 22px 22px', maxWidth: 380, width: '100%', boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>📧</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#2d2418', textAlign: 'center', marginBottom: 8 }}>公开发布需要验证邮箱</div>
            <div style={{ fontSize: 13, color: '#7a6a50', lineHeight: 1.65, textAlign: 'center', marginBottom: 20 }}>
              验证邮箱后才能将印迹公开到社区，防止垃圾内容。你可以先保存为私藏，验证后再公开。
            </div>
            <button
              onClick={() => { setShowVerifyPrompt(false); router.push('/mine') }}
              style={{ width: '100%', padding: '12px 0', borderRadius: 12, background: '#1D9E75', border: 'none', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 10 }}
            >
              去「我的」页面验证邮箱
            </button>
            <button
              onClick={() => setShowVerifyPrompt(false)}
              style={{ width: '100%', padding: '11px 0', borderRadius: 12, background: 'transparent', border: 'none', color: '#8a7a62', fontSize: 13, cursor: 'pointer' }}
            >
              先保存为私藏
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
