'use client'
export const dynamic = 'force-static'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { CITIES } from '@/data/cities'
import { getBodyText, getDisplayTitle } from '@/lib/imprintUtils'
import LoginModal from '@/components/LoginModal'

const CITY_FILTERS = [
  { en: '全部', zh: '全部' },
  { en: 'Berlin', zh: '柏林' },
  { en: 'Lisbon', zh: '里斯本' },
  { en: 'Prague', zh: '布拉格' },
  { en: 'Amsterdam', zh: '阿姆斯特丹' },
  { en: 'Florence', zh: '佛罗伦萨' },
]

const photoBg: Record<string, string> = { Berlin: '#dde8d8', Lisbon: '#e8e2d8', Amsterdam: '#d8e0e8', Prague: '#e8e8ed', Florence: '#ede2d8' }

export default function MeetPage() {
  const router = useRouter()
  const { allPublicImprints, likeImprint } = useApp()
  const { user } = useAuth()
  const [activeCity, setActiveCity] = useState('全部')
  const [showLogin, setShowLogin] = useState(false)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user) { setLikedIds(new Set()); return }
    const liked = new Set<string>()
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(`liked_${user.id}_`) && localStorage.getItem(key) === '1') {
        liked.add(key.replace(`liked_${user.id}_`, ''))
      }
    }
    setLikedIds(liked)
  }, [user?.id])

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!user) { setShowLogin(true); return }
    likeImprint(id)
    setLikedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handlePublish = () => {
    if (!user) { setShowLogin(true); return }
    router.push('/story')
  }

  const filtered = activeCity === '全部'
    ? allPublicImprints
    : allPublicImprints.filter(i => i.city === activeCity)

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>

      {/* 发布按钮 */}
      <div className="page-inner" style={{ padding: '16px 16px 0' }}>
        <div className="meet-content-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handlePublish}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #34d899 0%, #1D9E75 50%, #15896a 100%)',
              border: 'none', borderRadius: 32,
              padding: '13px 36px',
              cursor: 'pointer', fontSize: 15, fontWeight: 600, color: '#fff',
              letterSpacing: '0.02em',
              boxShadow: '0 6px 24px rgba(29,158,117,0.45), 0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.25)',
              transition: 'transform 150ms ease, box-shadow 150ms ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04) translateY(-1px)'
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 32px rgba(29,158,117,0.55), 0 3px 10px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.28)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(29,158,117,0.45), 0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.25)'
            }}
          >
            <span style={{ fontSize: 17 }}>✏️</span>
            发布印迹
          </button>
        </div>
      </div>

      {/* 城市筛选 */}
      <div className="page-inner" style={{ padding: '0 16px' }}>
        <div className="meet-content-wrap" style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '16px 0 14px', scrollbarWidth: 'none' }}>
        {CITY_FILTERS.map(city => (
          <button key={city.en} onClick={() => setActiveCity(city.en)}
            style={{ fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 20, whiteSpace: 'nowrap', cursor: 'pointer', background: activeCity === city.en ? '#1D9E75' : '#fff', color: activeCity === city.en ? '#fff' : '#8a7a62', border: activeCity === city.en ? 'none' : '0.5px solid #e2d9c8', flexShrink: 0 }}>
            {city.zh}
          </button>
        ))}
        </div>
      </div>

      {/* 卡片列表 */}
      <div className="page-inner desktop-2col-centered" style={{ padding: '0 16px 40px' }}>
        {filtered.map(imp => {
          const liked = likedIds.has(imp.id)
          return (
            <div key={imp.id} onClick={() => router.push(`/imprint/${imp.id}`)} className="crystal-card" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 12, cursor: 'pointer', transition: 'transform 150ms ease, box-shadow 150ms ease' }}>
              <div className="meet-card-photo" style={{ height: 130, background: photoBg[imp.city] ?? '#ede8df', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {imp.photo ? <img src={imp.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 11, color: '#c8bfaa' }}>[ 照片 ]</span>}
                <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(245,240,232,0.92)', color: '#3d3020', fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 8 }}>
                  {CITIES[imp.city]?.nameZh || imp.city}
                </span>
              </div>
              <div style={{ padding: '12px 14px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#e8dfd0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#8a7a62' }}>{(imp.author?.replace(/^@/, '') ?? 'N')[0].toUpperCase()}</div>
                  <span style={{ fontSize: 11, color: '#8a7a62' }}>{imp.author ? (imp.author.startsWith('@') ? imp.author : `@${imp.author}`) : '@Nomadic 用户'}</span>
                  <span style={{ fontSize: 11, color: '#b8a98a', marginLeft: 'auto' }}>{imp.createdAt}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#2d2418', lineHeight: 1.4, marginBottom: 6 }}>{getDisplayTitle(imp.narrative ?? '', imp.title)}</div>
                <div style={{ fontSize: 12, color: '#8a7a62', lineHeight: 1.6 }}>{getBodyText(imp.narrative ?? '', imp.title).slice(0, 60)}…</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 8, borderTop: '0.5px solid #f0ebe2' }}>
                  {imp.tags?.slice(0, 3).map(tag => (
                    <span key={tag} style={{ fontSize: 11, background: '#f5f0e8', color: '#8a7a62', border: '0.5px solid #e2d9c8', padding: '2px 8px', borderRadius: 6 }}>{tag}</span>
                  ))}
                  <button
                    onClick={(e) => handleLike(e, imp.id)}
                    style={{
                      marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3,
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '2px 6px', borderRadius: 6, fontSize: 12,
                      color: liked ? '#e05a5a' : '#b8a98a',
                      transition: 'color 150ms ease',
                    }}
                    aria-label="点赞"
                  >
                    <span style={{ fontSize: 13, lineHeight: 1 }}>{liked ? '♥' : '♡'}</span>
                    <span>{imp.likes ?? 0}</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => setShowLogin(false)}
          redirectPath="/meet"
        />
      )}
    </div>
  )
}
