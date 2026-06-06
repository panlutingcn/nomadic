'use client'
export const runtime = 'edge'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'

const AI_NARRATIVES: Record<string, string> = {
  Berlin: '这是你在柏林扎下的第一个根。这座城市的理性气质，正悄悄渗透你的品牌叙事方式——少一点修辞，多一点锋芒。Mittelstand 的务实美学，或许正是你下一个项目的起点。',
  Amsterdam: '阿姆斯特丹不会让你停下来，但它会让你思考为什么出发。运河边的每一个清晨，都藏着一种温柔的自由主义，那是这座城市送给游民最好的礼物。',
  Lisbon: '里斯本的光线是全欧洲最温柔的。你在这里慢下来，不是因为懒惰，而是因为这座城市告诉你，扎根不需要急。',
  Bangkok: '曼谷不会让你安静，但它会让你兴奋。这里的商业节奏快而直接，每一个街角都藏着一个正在运转的生意。来这里，是为了被激活。',
  default: '这是你在这座城市留下的印迹。每一座城市都是一段未完成的句子，而你正在续写它，一个坐标一个坐标地，构建属于自己的世界版图。',
}

export default function EditImprintPage() {
  const router = useRouter()
  const params = useParams()
  const { imprints, updateImprint } = useApp()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const imprint = imprints.find(i => i.id === id)

  const [city, setCity] = useState(imprint?.city || 'Berlin')
  const [editingCity, setEditingCity] = useState(false)
  const [photo, setPhoto] = useState<string | undefined>(imprint?.photo)
  const fileRef = useRef<HTMLInputElement>(null)
  const [tags, setTags] = useState<string[]>(imprint?.tags || [city])
  const [tagInput, setTagInput] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const TAG_LIMIT = 10
  const prevCityRef = useRef(city)

  const [title, setTitle] = useState(imprint?.title || '')
  const [narrative, setNarrative] = useState(imprint?.narrative || '')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    return () => {
      if (photo && photo.startsWith('blob:')) {
        URL.revokeObjectURL(photo)
      }
    }
  }, [photo])

  if (!imprint) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 20 }}>印迹不存在</div>
          <button onClick={() => router.back()} style={{ padding: '10px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
            返回
          </button>
        </div>
      </div>
    )
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
      if (photo && photo.startsWith('blob:')) {
        URL.revokeObjectURL(photo)
      }
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

  const handleSave = () => {
    if (!id || !imprint) return
    updateImprint(id, { city, title: title.trim() || narrative.trim().match(/^(.+?)[。！？!?\n]/)?.[1]?.trim() || `${city} 的印迹`, narrative, tags, photo, isPublic: imprint.isPublic })
    router.push(`/imprint/${id}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '14px 16px 12px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button onClick={() => router.back()} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>✕ 取消</button>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>编辑印迹</span>
          <button onClick={handleSave} style={{ fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>保存</button>
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
          @keyframes aiGlow {
            0%, 100% { border-color: var(--border); box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
            50% { border-color: #178f68; box-shadow: 0 0 0 3px rgba(23,143,104,0.1); }
          }
          .ai-glow { animation: aiGlow 1.4s ease-in-out infinite; }
        `}</style>

        {/* 标题 */}
        <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6 }}>标题</div>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="留空则自动取第一句话"
          style={{ width: '100%', background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 10, padding: '10px 12px', fontSize: 11, color: '#3d3020', lineHeight: 1.65, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', marginBottom: 12 }}
        />

        {/* 印迹 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>印迹</span>
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
        <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right', marginBottom: 10, cursor: generating ? 'default' : 'pointer' }} onClick={generating ? undefined : generateWithAI}>
          {generating ? '生成中…' : '重新生成 ↺'}
        </div>

        {/* 标签 */}
        <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6 }}>标签</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
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

        {/* 城市 */}
        <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6 }}>城市</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {editingCity
            ? <input autoFocus value={city} onChange={e => setCity(e.target.value)} onBlur={handleConfirmCity} onKeyDown={e => { if (e.key === 'Enter') handleConfirmCity() }} style={{ flex: 1, background: 'var(--bg-card)', border: '0.5px solid var(--accent)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: 'var(--text-primary)' }} />
            : <div onClick={() => setEditingCity(true)} style={{ flex: 1, background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: 'var(--text-primary)', cursor: 'text' }}>{city}</div>
          }
          <button onClick={handleConfirmCity} style={{ background: 'var(--bg-card-2)', border: '0.5px solid var(--border-light)', borderRadius: 8, padding: '8px 10px', fontSize: 10, color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>确认城市</button>
        </div>

        <button onClick={handleSave} style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginBottom: 8 }}>
          保存修改
        </button>
        <div style={{ fontSize: 9, color: '#c8bfaa', textAlign: 'center' }}>保存后自动返回印迹详情</div>
      </div>
      <div style={{ height: 32 }} />
      <BottomNav />
    </div>
  )
}
