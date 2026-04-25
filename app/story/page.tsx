'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'

const AI_NARRATIVES: Record<string, string> = {
  Berlin: '这是你在柏林扎下的第一个根。这座城市的理性气质，正悄悄渗透你的品牌叙事方式——少一点修辞，多一点锋芒。Mittelstand 的务实美学，或许正是你下一个项目的起点。',
  Amsterdam: '阿姆斯特丹不会让你停下来，但它会让你思考为什么出发。运河边的每一个清晨，都藏着一种温柔的自由主义，那是这座城市送给游民最好的礼物。',
  Lisbon: '里斯本的光线是全欧洲最温柔的。你在这里慢下来，不是因为懒惰，而是因为这座城市告诉你，扎根不需要急。',
  Bangkok: '曼谷不会让你安静，但它会让你兴奋。这里的商业节奏快而直接，每一个街角都藏着一个正在运转的生意。来这里，是为了被激活。',
  default: '这是你在这座城市留下的印迹。每一座城市都是一段未完成的句子，而你正在续写它，一个坐标一个坐标地，构建属于自己的世界版图。',
}

export default function StoryPage() {
  const router = useRouter()
  const { selectedCity, addImprint } = useApp()
  const [city, setCity] = useState(selectedCity || 'Berlin')
  const [editingCity, setEditingCity] = useState(false)
  const [photo, setPhoto] = useState<string | undefined>(undefined)
  const [narrativeIdx, setNarrativeIdx] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'wechat' | 'email'>('wechat')
  const [loginEmail, setLoginEmail] = useState('')
  const [pendingPublish, setPendingPublish] = useState<boolean | null>(null)

  const narrativeBase = AI_NARRATIVES[city] ?? AI_NARRATIVES['default']
  const narrativeVariants = [narrativeBase, narrativeBase.split('。').reverse().join('。') + '。']
  const [narrative, setNarrative] = useState(narrativeVariants[0])
  const [generating, setGenerating] = useState(false)

  const cycleNarrative = () => {
    setNarrativeIdx(i => i + 1)
    setNarrative(narrativeVariants[(narrativeIdx + 1) % 2])
  }

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
        body: JSON.stringify({ city, imageBase64 }),
      })
      const data = await res.json()
      if (data.narrative) setNarrative(data.narrative)
    } finally {
      setGenerating(false)
    }
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPhoto(URL.createObjectURL(file))
  }

  const handlePublish = (isPublic: boolean) => {
    if (!isLoggedIn) {
      setPendingPublish(isPublic)
      setShowLogin(true)
      return
    }
    addImprint({ city, title: `${city} 的印迹`, narrative, tags: [city, '2025'], isPublic, photo })
    router.push(isPublic ? '/meet' : '/vault')
  }

  const handleLoginConfirm = () => {
    setIsLoggedIn(true)
    setShowLogin(false)
    if (pendingPublish !== null) {
      addImprint({ city, title: `${city} 的印迹`, narrative, tags: [city, '2025'], isPublic: pendingPublish, photo })
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

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>城市归属</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>GPS 自动识别</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
          {editingCity
            ? <input autoFocus value={city} onChange={e => setCity(e.target.value)} onBlur={() => setEditingCity(false)} style={{ flex: 1, background: 'var(--bg-card)', border: '0.5px solid var(--accent)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: 'var(--text-primary)' }} />
            : <div style={{ flex: 1, background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: 'var(--text-primary)' }}>{city}, {city === 'Berlin' ? 'Germany' : city === 'Bangkok' ? 'Thailand' : city === 'Lisbon' ? 'Portugal' : city === 'Amsterdam' ? 'Netherlands' : 'Europe'}</div>
          }
          <button onClick={() => setEditingCity(true)} style={{ background: 'var(--bg-card-2)', border: '0.5px solid var(--border-light)', borderRadius: 8, padding: '8px 10px', fontSize: 10, color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>修改城市</button>
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
          style={{ width: '100%', background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '10px 12px', marginBottom: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.03)', fontSize: 11, color: '#3d3020', lineHeight: 1.65, resize: 'vertical', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
        />
        <div style={{ fontSize: 10, color: generating ? 'var(--text-muted)' : 'var(--text-muted)', textAlign: 'right', marginBottom: 10, cursor: generating ? 'default' : 'pointer' }} onClick={generating ? undefined : generateWithAI}>
          {generating ? '生成中…' : '重新生成 ↺'}
        </div>

        <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6 }}>标签</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {[city, '2025'].map(tag => (
            <span key={tag} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 8, background: 'var(--bg-card-2)', color: 'var(--text-secondary)', border: '0.5px solid var(--border-light)' }}>{tag}</span>
          ))}
          <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 8, color: 'var(--text-muted)', border: '0.5px dashed var(--border-light)', cursor: 'pointer' }}>+ 添加</span>
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: 'var(--bg-page)', borderRadius: '18px 18px 0 0', padding: '24px 20px 36px' }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>登录后发布印迹</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button onClick={() => setLoginMethod('wechat')} style={{ flex: 1, padding: '7px', borderRadius: 8, border: `0.5px solid ${loginMethod === 'wechat' ? '#07C160' : 'var(--border-light)'}`, background: loginMethod === 'wechat' ? 'rgba(7,193,96,0.08)' : 'var(--bg-card)', fontSize: 12, color: loginMethod === 'wechat' ? '#07C160' : 'var(--text-secondary)', cursor: 'pointer' }}>微信登录</button>
              <button onClick={() => setLoginMethod('email')} style={{ flex: 1, padding: '7px', borderRadius: 8, border: `0.5px solid ${loginMethod === 'email' ? 'var(--accent)' : 'var(--border-light)'}`, background: loginMethod === 'email' ? 'var(--accent-dim)' : 'var(--bg-card)', fontSize: 12, color: loginMethod === 'email' ? 'var(--accent-text)' : 'var(--text-secondary)', cursor: 'pointer' }}>邮箱登录</button>
            </div>

            {loginMethod === 'wechat' ? (
              <button onClick={handleLoginConfirm} style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#07C160', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginBottom: 12 }}>
                微信一键登录
              </button>
            ) : (
              <>
                <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="输入你的邮箱" type="email"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid var(--border)', background: 'var(--bg-card)', fontSize: 12, color: 'var(--text-primary)', boxSizing: 'border-box', outline: 'none', marginBottom: 8 }} />
                <button onClick={handleLoginConfirm} style={{ width: '100%', padding: '11px', borderRadius: 12, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginBottom: 12 }}>
                  确认登录
                </button>
              </>
            )}

            <button onClick={() => setShowLogin(false)} style={{ width: '100%', padding: '10px', borderRadius: 12, background: 'none', border: '0.5px solid var(--border-light)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
