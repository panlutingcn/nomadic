'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'

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

export default function StoryPage() {
  const router = useRouter()
  const { addImprint } = useApp()
  const [city, setCity] = useState('')
  const [editingCity, setEditingCity] = useState(false)
  const [photo, setPhoto] = useState<string | undefined>(undefined)
  const fileRef = useRef<HTMLInputElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone')
  const [loginPhone, setLoginPhone] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [pendingPublish, setPendingPublish] = useState<boolean | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const [narrative, setNarrative] = useState('')
  const [generating, setGenerating] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [flashCity, setFlashCity] = useState(false)
  const [flashTags, setFlashTags] = useState(false)
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
          { headers: { 'Accept-Language': 'en' } }
        )
          .then(r => r.json())
          .then(data => {
            const addr = data.address || {}
            const cityEn: string = addr.city || addr.town || addr.village || addr.county || ''
            const cityZh = CITY_NAME_MAP[cityEn] ?? cityEn
            if (cityZh) {
              const year = String(new Date(gpsData.timestamp).getFullYear())
              setCity(cityZh)
              setTags([cityZh, year])
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
    if (!photo.startsWith('blob:')) return photo
    try {
      const res = await fetch(photo)
      const blob = await res.blob()
      return new Promise<string>(resolve => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })
    } catch {
      return photo
    }
  }

  const handleConfirmCity = () => {
    setEditingCity(false)
    const trimmed = city.trim()
    if (!trimmed) return
    const year = String(new Date().getFullYear())
    setTags(prev => {
      const withoutOldCity = prevCityRef.current ? prev.filter(t => t !== prevCityRef.current) : prev
      const withCity = withoutOldCity.includes(trimmed) ? withoutOldCity : [trimmed, ...withoutOldCity]
      return withCity.includes(year) ? withCity : [...withCity, year]
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

  const triggerFlash = (field: 'city' | 'tags') => {
    if (field === 'city') {
      setEditingCity(false)
      setFlashCity(true)
      setTimeout(() => setFlashCity(false), 900)
    } else {
      setFlashTags(true)
      setTimeout(() => setFlashTags(false), 900)
    }
  }

  const handlePublish = async (isPublic: boolean) => {
    const trimmedCity = city.trim()
    if (!trimmedCity) {
      triggerFlash('city')
      return
    }
    if (!tags.includes(trimmedCity)) {
      triggerFlash('tags')
      return
    }
    if (!isLoggedIn) {
      setPendingPublish(isPublic)
      setShowLogin(true)
      return
    }
    const photoUrl = await getPhotoDataUrl()
    addImprint({ city: trimmedCity, title: `${trimmedCity} 的印迹`, narrative, tags, isPublic, photo: photoUrl })
    router.push(isPublic ? '/meet' : '/vault')
  }

  const handleLoginConfirm = async () => {
    setIsLoggedIn(true)
    setShowLogin(false)
    if (pendingPublish !== null) {
      if (!city.trim() || !tags.includes(city.trim())) return
      const photoUrl = await getPhotoDataUrl()
      addImprint({ city: city.trim(), title: `${city.trim()} 的印迹`, narrative, tags, isPublic: pendingPublish, photo: photoUrl })
      router.push(pendingPublish ? '/meet' : '/vault')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '14px 16px 12px' }}>

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

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>城市归属 <span style={{ color: '#c04040' }}>*</span></span>
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
          <button onClick={handleConfirmCity} style={{ background: 'var(--bg-card-2)', border: '0.5px solid var(--border-light)', borderRadius: 8, padding: '8px 10px', fontSize: 10, color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>确认城市</button>
        </div>
        <div style={{ fontSize: 9, color: '#c8bfaa', marginBottom: 12 }}>若拍摄地与当前位置不同，可手动调整</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>印迹故事</span>
          <button onClick={generateWithAI} disabled={generating} style={{ fontSize: 10, color: generating ? 'var(--text-muted)' : 'var(--accent)', background: 'none', border: 'none', cursor: generating ? 'default' : 'pointer', padding: 0 }}>
            {generating ? '生成中…' : 'AI 生成 ✦'}
          </button>
        </div>
        <textarea
          value={narrative}
          onChange={e => setNarrative(e.target.value)}
          rows={4}
          className={generating ? 'ai-glow' : ''}
          style={{ width: '100%', background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '10px 12px', marginBottom: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.03)', fontSize: 11, color: '#3d3020', lineHeight: 1.65, resize: 'vertical', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
        />
        <div style={{ fontSize: 10, color: generating ? 'var(--text-muted)' : 'var(--text-muted)', textAlign: 'right', marginBottom: 10, cursor: generating ? 'default' : 'pointer' }} onClick={generating ? undefined : generateWithAI}>
          {generating ? '生成中…' : '重新生成 ↺'}
        </div>

        <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6 }}>标签 <span style={{ color: '#c04040' }}>*</span></div>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <button onClick={() => handlePublish(true)} style={{ padding: '11px 10px', borderRadius: 12, background: '#fff5f0', border: '0.5px solid #f0c4a8', cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#7a3010' }}>发布到社区</div>
            <div style={{ fontSize: 9, color: '#b87050', marginTop: 2 }}>公开 · 所有人可见</div>
          </button>
          <button onClick={() => handlePublish(false)} style={{ padding: '11px 10px', borderRadius: 12, background: '#f0ebe2', border: '0.5px solid var(--border-light)', cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>存入我的领地</div>
            <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 2 }}>私藏 · 仅自己可见</div>
          </button>
        </div>
        <div style={{ fontSize: 9, color: '#c8bfaa', textAlign: 'center' }}>完成后自动跳转至「我的印迹」</div>
      </div>
      <BottomNav />

      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
          <div style={{ position: 'relative', background: '#f0ebe0', borderRadius: 14, padding: '20px 20px 16px', maxWidth: 320, width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            {/* Speech bubble tail */}
            <div style={{
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid #f0ebe0',
            }} />

            <div style={{ fontSize: 14, fontWeight: 500, color: '#3d3020', marginBottom: 4, textAlign: 'center' }}>登录后发布印迹</div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button
                onClick={() => setLoginMethod('phone')}
                style={{ flex: 1, padding: '7px', borderRadius: 8, border: `0.5px solid ${loginMethod === 'phone' ? 'var(--accent)' : '#c8bfaa'}`, background: loginMethod === 'phone' ? 'var(--accent-dim)' : 'transparent', fontSize: 12, color: loginMethod === 'phone' ? 'var(--accent-text)' : '#7a6a50', cursor: 'pointer' }}
              >
                手机号登录
              </button>
              <button
                onClick={() => setLoginMethod('email')}
                style={{ flex: 1, padding: '7px', borderRadius: 8, border: `0.5px solid ${loginMethod === 'email' ? 'var(--accent)' : '#c8bfaa'}`, background: loginMethod === 'email' ? 'var(--accent-dim)' : 'transparent', fontSize: 12, color: loginMethod === 'email' ? 'var(--accent-text)' : '#7a6a50', cursor: 'pointer' }}
              >
                邮箱登录
              </button>
            </div>

            {loginMethod === 'phone' ? (
              <input
                value={loginPhone}
                onChange={e => setLoginPhone(e.target.value)}
                placeholder="输入你的手机号"
                type="tel"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid #c8bfaa', background: 'rgba(255,255,255,0.6)', fontSize: 12, color: '#3d3020', boxSizing: 'border-box', outline: 'none', marginBottom: 10 }}
              />
            ) : (
              <input
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="输入你的邮箱"
                type="email"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid #c8bfaa', background: 'rgba(255,255,255,0.6)', fontSize: 12, color: '#3d3020', boxSizing: 'border-box', outline: 'none', marginBottom: 10 }}
              />
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowLogin(false)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'transparent', border: '0.5px solid #c8bfaa', fontSize: 12, color: '#7a6a50', cursor: 'pointer' }}
              >
                取消
              </button>
              <button
                onClick={handleLoginConfirm}
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
              >
                确认登录
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
