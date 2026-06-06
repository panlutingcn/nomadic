'use client'
export const dynamic = 'force-static'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  const [showQR, setShowQR] = useState(false)
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
    <div style={{ minHeight: '100vh', background: 'transparent', display: 'flex', flexDirection: 'column' }}>
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
              style={{ fontSize: 12, fontWeight: 500, color: '#178f68', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', padding: 0, opacity: verifyState === 'sending' ? 0.6 : 1 }}
            >
              {verifyState === 'sending' ? '发送中…' : '立即验证 →'}
            </button>
          )}
        </div>
      )}
      <div className="page-inner" style={{ padding: '12px 16px 0', flex: 1 }}>
        <div className="desktop-page-inner-wrap">

        {/* 用户信息栏 */}
        <div className="crystal-card" style={{ borderRadius: 16, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, transition: 'transform 150ms ease, box-shadow 150ms ease' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(23,143,104,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 500, color: '#178f68', flexShrink: 0, overflow: 'hidden' }}>
            {profileAvatar
              ? <img src={profileAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (profileNickname?.[0] ?? 'N').toUpperCase()
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#2d2418', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profileNickname ?? '世界公民'}
            </div>
            <div style={{ fontSize: 11, color: '#8a7a62', marginTop: 2 }}>{savedCities.length} 个收藏 · {imprints.length} 个印迹</div>
          </div>
          <span
            onClick={() => user ? router.push('/mine/account') : setShowLogin(true)}
            style={{ fontSize: 20, color: '#c8bfaa', cursor: 'pointer', flexShrink: 0, padding: '4px 6px', lineHeight: 1 }}>
            ›
          </span>
        </div>

        {/* 旅行人格卡片 */}
        {persona ? (
          <div onClick={() => router.push('/mine/persona')}
            className="hover-lift"
            style={{ background: '#faeeda', border: '0.5px solid #e8c98a', borderRadius: 13, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 20, transition: 'transform 150ms ease, box-shadow 150ms ease' }}>
            <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{persona.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#854f0b', marginBottom: 2 }}>你的旅行人格</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#633806' }}>{persona.name}</div>
              <div style={{ fontSize: 11, color: '#b8952a', marginTop: 1 }}>{personaKey} · {persona.tags}</div>
            </div>
            <span style={{ fontSize: 16, color: '#c8a870' }}>›</span>
          </div>
        ) : null}

        {/* 全球版图 — 容器 160px，地球 5× */}
        <div className="crystal-card" style={{ borderRadius: 13, overflow: 'hidden', marginBottom: 20, transition: 'transform 150ms ease, box-shadow 150ms ease' }}>
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

        {/* 我的印迹 */}
        <div className="mine-bottom-cols" style={{ marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#2d2418' }}>我的印迹</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#8a7a62' }}>{imprints.length} 个</span>
                <span onClick={() => router.push('/vault')}
                  style={{ fontSize: 11, color: '#178f68', cursor: 'pointer', fontWeight: 500 }}>
                  管理 ›
                </span>
              </div>
            </div>

            {imprints.slice(0, 5).map(imp => (
              <div key={imp.id} onClick={() => router.push(`/imprint/${imp.id}`)} className="crystal-card" style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', marginBottom: 8, cursor: 'pointer', transition: 'transform 150ms ease, box-shadow 150ms ease' }}>
                <div style={{ width: 68, background: '#ede8df', flexShrink: 0, alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {imp.photo ? <img src={imp.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 9, color: '#c8bfaa' }}>图片</span>}
                </div>
                <div style={{ padding: '8px 10px', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 5, fontWeight: 500, background: imp.isPublic ? 'rgba(23,143,104,0.1)' : '#f0ebe2', color: imp.isPublic ? '#085041' : '#8a7a62', border: `0.5px solid ${imp.isPublic ? 'rgba(23,143,104,0.2)' : '#ddd4c0'}` }}>
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
          </div>
        </div>

        {/* 收藏夹 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#2d2418' }}>收藏夹</span>
            <span style={{ fontSize: 12, color: '#178f68', cursor: 'pointer' }}>管理 ›</span>
          </div>
          <div className="crystal-card" style={{ borderRadius: 12, padding: '10px 13px' }}>
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
                    style={{ fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 8, background: 'rgba(23,143,104,0.1)', color: '#0f6e56', border: '0.5px solid rgba(23,143,104,0.25)', cursor: 'pointer' }}>
                    {label}
                  </button>
                )
              })}
              {savedCities.length === 0 && <span style={{ fontSize: 12, color: '#b8a98a' }}>还没有收藏的城市</span>}
            </div>
          </div>
        </div>

        {/* 联系共创 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#2d2418' }}>联系共创</span>
        </div>
        <div onClick={() => setShowContact(true)}
          className="crystal-card"
          style={{ borderRadius: 12, padding: '12px 14px', marginBottom: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'transform 150ms ease, box-shadow 150ms ease' }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>📮</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#2d2418' }}>有建议、故事或合作意向？</div>
          </div>
          <span style={{ fontSize: 13, color: '#178f68', fontWeight: 500, flexShrink: 0 }}>欢迎来信 →</span>
        </div>
        {/* 加入全球社群 */}
        <div onClick={() => setShowQR(true)}
          className="crystal-card"
          style={{ borderRadius: 13, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 12, transition: 'transform 150ms ease, box-shadow 150ms ease' }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>💬</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#2d2418' }}>加入Nomadic在线全球社群</div>
          </div>
          <span style={{ fontSize: 13, color: '#178f68', fontWeight: 500, flexShrink: 0 }}>扫码加入 →</span>
        </div>

        <div style={{ height: 12 }} />
        </div>{/* /desktop-page-inner-wrap */}
      </div>

      {/* ── 页脚 ── */}
      <footer style={{ marginTop: 8, borderTop: '0.5px solid var(--border)', paddingTop: 24, paddingBottom: 8 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img src="/logo-nomadic-t.png" alt="Nomadic" style={{ height: 30, width: 'auto', display: 'block', margin: '0 auto 8px', filter: 'brightness(0) saturate(100%) invert(44%) sepia(63%) saturate(500%) hue-rotate(121deg) brightness(72%)' }} />
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 600 }}>
            The Deep-Dive Platform for Global Wanderers
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Rooted in the world, never just passing by.
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8 }}>
          <div>© 2026 Nomadic · nomadictree.io</div>
        </div>
      </footer>
      <div style={{ height: 32 }} />

      {showLogin && (
        <LoginModal
          redirectPath="/mine/persona"
          onClose={() => setShowLogin(false)}
          onSuccess={() => { setShowLogin(false); router.replace('/mine/persona') }}
        />
      )}
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}

      {/* 微信二维码弹窗 */}
      {showQR && (
        <div
          onClick={() => setShowQR(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 20, padding: '28px 28px 24px',
              maxWidth: 300, width: '88vw', textAlign: 'center',
              boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600, color: '#2d2418', marginBottom: 4 }}>加入 Nomadic 社群</div>
            <div style={{ fontSize: 12, color: '#8a7a62', marginBottom: 16 }}>扫码添加微信，进入游民社区</div>
            <img
              src="/wechat-qr.jpg"
              alt="微信二维码"
              style={{ width: '100%', borderRadius: 12, display: 'block' }}
            />
            <button
              onClick={() => setShowQR(false)}
              style={{
                marginTop: 18, fontSize: 13, color: '#8a7a62',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
