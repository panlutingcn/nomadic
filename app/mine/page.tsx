'use client'
export const dynamic = 'force-static'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { PERSONAS } from '@/data/travelPersona'
import { CITIES } from '@/data/cities'
import { CITY_COORDS } from '@/data/cityCoords'
import LoginModal from '@/components/LoginModal'
import ContactModal from '@/components/ContactModal'
import { useUserProfile } from '@/hooks/useUserProfile'
import dynamicImport from 'next/dynamic'
import { getDisplayTitle } from '@/lib/imprintUtils'

const GlobeMap = dynamicImport(() => import('@/components/GlobeMap'), { ssr: false })

export default function MinePage() {
  const router = useRouter()
  const { savedCities, imprints, trashedImprints, setSelectedCity } = useApp()
  const { user, loading: authLoading } = useAuth()
  const { nickname: profileNickname, avatarUrl: profileAvatar } = useUserProfile()
  const [personaKey, setPersonaKey] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [verifyState, setVerifyState] = useState<'idle' | 'sending' | 'sent'>('idle')
  useEffect(() => {
    if (authLoading) return
    const storageKey = user ? `nomadic_persona_${user.id}` : 'nomadic_persona'
    setPersonaKey(localStorage.getItem(storageKey) ?? '')
  }, [user?.id, authLoading])

  const persona = user ? PERSONAS[personaKey] : undefined

  // Build Chinese→English lookup so cities stored in Chinese still light up on globe
  const zhToEn: Record<string, string> = {}
  Object.entries(CITIES).forEach(([en, data]) => { if (data.nameZh) zhToEn[data.nameZh] = en })

  const resolveGlobeKey = (city: string) => {
    if (CITY_COORDS[city]) return city
    const en = zhToEn[city]
    return en && CITY_COORDS[en] ? en : city
  }

  const imprintCities = Array.from(new Set(imprints.map(i => resolveGlobeKey(i.city))))
  const uniqueCountries = Array.from(new Set(imprints.map(i => CITIES[i.city]?.country || CITIES[zhToEn[i.city] ?? '']?.country || i.city))).length

  const emailUnverified = !!user && !user.email_confirmed_at

  const handleResendVerification = async () => {
    if (!user?.email || verifyState !== 'idle') return
    setVerifyState('sending')
    await supabase.auth.resend({ type: 'signup', email: user.email })
    setVerifyState('sent')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', flexDirection: 'column' }}>
      {/* 邮箱未验证横条 */}
      {emailUnverified && (
        <div style={{ background: '#fffbe6', borderBottom: '0.5px solid #f0c040', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#7a5a00', lineHeight: 1.4 }}>
            {verifyState === 'sent' ? '✅ 验证邮件已发送，请查收（含垃圾邮件箱）' : '你的邮箱尚未验证，部分功能受限'}
          </span>
          {verifyState !== 'sent' && (
            <button
              onClick={handleResendVerification}
              disabled={verifyState === 'sending'}
              style={{ fontSize: 12, fontWeight: 500, color: '#1D9E75', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', padding: 0, opacity: verifyState === 'sending' ? 0.6 : 1 }}
            >
              {verifyState === 'sending' ? '发送中…' : '立即验证 →'}
            </button>
          )}
        </div>
      )}
      <div style={{ padding: '12px 16px 0', flex: 1 }}>

        {/* 用户信息栏 */}
        <div style={{ background: '#fff', border: '0.5px solid #e2d9c8', borderRadius: 16, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(29,158,117,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 500, color: '#1D9E75', flexShrink: 0, overflow: 'hidden' }}>
            {profileAvatar
              ? <img src={profileAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (profileNickname?.[0] ?? 'N').toUpperCase()
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#2d2418', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profileNickname ?? '世界旅人'}
            </div>
            <div style={{ fontSize: 11, color: '#8a7a62', marginTop: 2 }}>{savedCities.length} 个收藏 · {imprints.length} 个印迹</div>
          </div>
          {user ? (
            <div style={{ fontSize: 11, color: '#8a7a62', cursor: 'pointer', flexShrink: 0, padding: '4px 8px' }}
              onClick={() => router.push('/mine/account')}>
              账号 ›
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)}
              style={{ fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 9, background: '#1D9E75', color: '#fff', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              登录
            </button>
          )}
        </div>

        {/* 旅行人格卡片 */}
        {persona ? (
          <div onClick={() => router.push('/mine/persona')}
            style={{ background: '#faeeda', border: '0.5px solid #e8c98a', borderRadius: 13, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 12 }}>
            <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{persona.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#854f0b', marginBottom: 2 }}>你的旅行人格</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#633806' }}>{persona.name}</div>
              <div style={{ fontSize: 11, color: '#b8952a', marginTop: 1 }}>{personaKey} · {persona.tags}</div>
            </div>
            <span style={{ fontSize: 16, color: '#c8a870' }}>›</span>
          </div>
        ) : (
          <div onClick={() => router.push('/onboarding')}
            style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 13, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 12 }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>🧭</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#2d2418' }}>发现你的旅行人格</div>
              <div style={{ fontSize: 11, color: '#8a7a62', marginTop: 2 }}>16 道题 · 约 1 分钟</div>
            </div>
            <span style={{ fontSize: 13, color: '#1D9E75', fontWeight: 500 }}>开始测试 →</span>
          </div>
        )}

        {/* 全球版图 — 容器 160px，地球 5× */}
        <div style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 13, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 13px 7px' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#2d2418' }}>我的全球版图</span>
            <span style={{ fontSize: 11, color: '#8a7a62' }}>{imprintCities.length} 座城市 · {uniqueCountries} 个国家</span>
          </div>
          <div style={{ height: 160, position: 'relative', background: '#dceef8', overflow: 'hidden' }}>
            <GlobeMap
              cities={imprintCities}
              onCityClick={(city) => {
                setSelectedCity(city in CITIES ? city : 'Berlin')
                router.push('/insights')
              }}
            />
          </div>
          <div style={{ fontSize: 10, color: '#8a7a62', textAlign: 'center', padding: '7px 0 9px' }}>点击发光点 · 进入该城市印迹</div>
        </div>

        {/* 收藏夹 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#2d2418' }}>收藏夹</span>
          <span style={{ fontSize: 12, color: '#1D9E75', cursor: 'pointer' }}>管理 ›</span>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 12, padding: '10px 13px', marginBottom: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {savedCities.map(city => {
              const inCities = city.name in CITIES
              const label = CITIES[city.name]?.nameZh || city.nameZh || city.name
              return (
                <button key={city.name}
                  onClick={() => {
                    setSelectedCity(city.name)
                    if (inCities) {
                      router.push('/insights')
                    } else {
                      router.push(`/search?q=${encodeURIComponent(city.nameZh || city.name)}`)
                    }
                  }}
                  style={{ fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 8, background: 'rgba(29,158,117,0.1)', color: '#0f6e56', border: '0.5px solid rgba(29,158,117,0.25)', cursor: 'pointer' }}>
                  {label}
                </button>
              )
            })}
            {savedCities.length === 0 && <span style={{ fontSize: 12, color: '#b8a98a' }}>还没有收藏的城市</span>}
          </div>
        </div>

        {/* 我的印迹 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#2d2418' }}>我的印迹</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: '#8a7a62' }}>{imprints.length} 个 · 最新在前</span>
            {user && (
              <span onClick={() => router.push('/vault')}
                style={{ fontSize: 11, color: trashedImprints.length > 0 ? '#c04040' : '#b8a98a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                🗑️ {trashedImprints.length > 0 && `${trashedImprints.length}`}
              </span>
            )}
          </div>
        </div>
        {user && imprints.length === 0 && (
          <div onClick={() => router.push('/story')}
            style={{ background: '#fff', border: '0.5px dashed #ddd4c0', borderRadius: 12, height: 64, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: 12, color: '#b8a98a' }}>+ 记录你的城市印迹</span>
          </div>
        )}
        {imprints.map(imp => (
          <div key={imp.id} onClick={() => router.push(`/imprint/${imp.id}`)} style={{ display: 'flex', background: '#fff', border: '0.5px solid #e2d9c8', borderRadius: 12, overflow: 'hidden', marginBottom: 8, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ width: 68, background: '#ede8df', flexShrink: 0, alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {imp.photo ? <img src={imp.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 9, color: '#c8bfaa' }}>图片</span>}
            </div>
            <div style={{ padding: '8px 10px', flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 5, fontWeight: 500, background: imp.isPublic ? 'rgba(29,158,117,0.1)' : '#f0ebe2', color: imp.isPublic ? '#085041' : '#8a7a62', border: `0.5px solid ${imp.isPublic ? 'rgba(29,158,117,0.2)' : '#ddd4c0'}` }}>
                  {imp.isPublic ? '公开' : '私藏'}
                </span>
                <span style={{ fontSize: 10, color: '#b8a98a' }}>
                  {CITIES[imp.city]?.nameZh || imp.city}
                </span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#2d2418', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getDisplayTitle(imp.narrative, imp.title, imp.city)}</div>
              <div style={{ fontSize: 10, color: '#b8a98a', marginTop: 3, textAlign: 'right' }}>{imp.createdAt}</div>
            </div>
          </div>
        ))}

        {/* 联系共创 */}
        <div style={{ height: 8 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#2d2418' }}>联系共创</span>
        </div>
        <div onClick={() => setShowContact(true)}
          style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 12, padding: '14px 15px', marginBottom: 12, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, color: '#2d2418', lineHeight: 1.6 }}>期待听到你的想法或故事 →</div>
        </div>
        <div style={{ height: 12 }} />
      </div>

      <div style={{ height: 32 }} />
      <BottomNav />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </div>
  )
}
