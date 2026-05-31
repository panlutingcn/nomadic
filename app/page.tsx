'use client'
export const dynamic = 'force-static'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import nextDynamic from 'next/dynamic'
import SearchBox, { SearchBoxHandle } from '@/components/SearchBox'
import ErrorToast from '@/components/ErrorToast'
import { useApp } from '@/context/AppContext'
import { CITIES } from '@/data/cities'
import { getBodyText, getDisplayTitle } from '@/lib/imprintUtils'
import { PINNED_CITIES, NOMAD_CITY_POOL, NomadCity } from '@/data/nomadCities'
import { shuffle } from '@/utils/shuffle'

const HeroGlobe = nextDynamic(() => import('@/components/HeroGlobe'), { ssr: false })

const RANDOM_COUNT = 9

export default function ExplorePage() {
  const router = useRouter()
  const { allPublicImprints, setSelectedCity } = useApp()
  const [errorMessage, setErrorMessage] = useState('')
  const [randomCities, setRandomCities] = useState<NomadCity[]>([])
  const [insightCities, setInsightCities] = useState<NomadCity[]>([])
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [hoveredPersona, setHoveredPersona] = useState(false)
  const [globeSize, setGlobeSize] = useState(440)
  const searchBoxRef = useRef<SearchBoxHandle>(null)

  useEffect(() => {
    const allCities = [...PINNED_CITIES, ...NOMAD_CITY_POOL].filter(c => !!CITIES[c.en])
    setRandomCities(shuffle(NOMAD_CITY_POOL).slice(0, RANDOM_COUNT))
    setInsightCities(shuffle(allCities).slice(0, 5))
  }, [])

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) {
        setGlobeSize(560)
      } else {
        setGlobeSize(Math.min(440, window.innerWidth - 20))
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const handleCityClick = (city: NomadCity) => {
    router.push(`/search?q=${encodeURIComponent(city.zh)}`)
  }

  const handleRandomExplore = () => {
    const all = [...PINNED_CITIES, ...NOMAD_CITY_POOL]
    const pick = all[Math.floor(Math.random() * all.length)]
    searchBoxRef.current?.fill(pick.zh)
  }

  const displayCities: NomadCity[] = [...PINNED_CITIES, ...randomCities]
  const previewImprints = allPublicImprints.slice(0, 5)
  const photoBg: Record<string, string> = { Berlin: '#dde8d8', Lisbon: '#e8e2d8', Amsterdam: '#d8e0e8', Prague: '#e8e8ed', Florence: '#ede2d8' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-inner" style={{ flex: 1, padding: '0 16px 10px' }}>

        {/* ── Hero Globe：搜索框 + 城市标签都在地球内 ── */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: globeSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}>
          {/* Rotating globe background */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            pointerEvents: 'none',
            opacity: 0.20,
          }}>
            <HeroGlobe size={globeSize} />
          </div>

          {/* Foreground content */}
          <div style={{
            position: 'relative',
            zIndex: 3,
            width: '100%',
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 16px',
          }}>
            {/* Logo */}
            <img
              src="/logo-nomadic-t.png"
              alt="Nomadic"
              style={{ height: 50, width: 'auto', display: 'block', margin: '0 auto 4px' }}
            />
            <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3020', marginBottom: 2, textAlign: 'center' }}>
              为旅居者打造的城市深度平台
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 14, textAlign: 'center' }}>
              在世界各地扎根，而不只是路过。
            </div>

            {/* Search box */}
            <div style={{ width: '100%' }}>
              <SearchBox ref={searchBoxRef} onError={setErrorMessage} />
            </div>

            {/* City tags */}
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', margin: '4px 0 8px' }}>
              —— 你想去哪里 ——
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center' }}>
              {displayCities.map(city => (
                <button
                  key={city.en}
                  onClick={() => handleCityClick(city)}
                  onMouseEnter={() => setHoveredCity(city.en)}
                  onMouseLeave={() => setHoveredCity(null)}
                  className="crystal-tag"
                  style={{
                    fontSize: 11,
                    padding: '5px 11px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: hoveredCity === city.en ? 600 : 500,
                    transform: hoveredCity === city.en ? 'scale(1.06)' : 'scale(1)',
                    transition: 'all 120ms ease',
                  }}
                >
                  {city.zh}
                </button>
              ))}
              <button
                onClick={handleRandomExplore}
                onMouseEnter={() => setHoveredCity('__random__')}
                onMouseLeave={() => setHoveredCity(null)}
                className="crystal-tag"
                style={{
                  fontSize: 11, padding: '5px 11px', borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: hoveredCity === '__random__' ? 600 : 500,
                  transform: hoveredCity === '__random__' ? 'scale(1.06)' : 'scale(1)',
                  transition: 'all 120ms ease',
                  animation: hoveredCity === '__random__' ? 'none' : 'pulse-random 2.4s ease-in-out infinite',
                }}
              >
                随机 🎲
              </button>
            </div>
          </div>
        </div>

        {/* ── 旅行人格测试入口 ── */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button
            onClick={() => router.push('/onboarding')}
            onMouseEnter={() => setHoveredPersona(true)}
            onMouseLeave={() => setHoveredPersona(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: hoveredPersona ? 'rgba(29,158,117,0.10)' : 'rgba(29,158,117,0.05)',
              border: `0.5px solid ${hoveredPersona ? 'rgba(29,158,117,0.40)' : 'rgba(29,158,117,0.22)'}`,
              borderRadius: 28, padding: '11px 24px',
              cursor: 'pointer',
              transform: hoveredPersona ? 'scale(1.03)' : 'scale(1)',
              transition: 'all 150ms ease',
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>🧭</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-text)', lineHeight: 1.3 }}>
                测测你的旅行人格
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                发现最适合你的城市类型
              </div>
            </div>
            <span style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>→</span>
          </button>
        </div>

        {/* ── 城市洞察预览卡片 ── */}
        <div className="desktop-search-wrap" style={{ marginBottom: 4 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 8 }}>—— 城市洞察 ——</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {insightCities.map(city => {
              const cityData = CITIES[city.en]
              if (!cityData) return null
              return (
                <div
                  key={city.en}
                  onClick={() => { setSelectedCity(city.en); router.push('/insights') }}
                  style={{
                    background: 'var(--bg-card)', border: '0.5px solid var(--border-light)',
                    borderRadius: 12, padding: '10px 13px', cursor: 'pointer',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                    transition: 'transform 140ms ease, box-shadow 140ms ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.012)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 14px rgba(0,0,0,0.09)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)' }}
                >
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 17, lineHeight: 1, flexShrink: 0 }}>{cityData.flag}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', flexShrink: 0 }}>{cityData.nameZh}</span>
                    <span style={{ color: 'var(--border)', flexShrink: 0 }}>·</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>{cityData.countryZh}</span>
                    <span style={{ color: 'var(--border)', flexShrink: 0 }}>·</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cityData.soul.headline}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, flex: 1 }}>
                      {([
                        { emoji: '🌿', label: '落地指南', bg: '#d4ede0', color: '#085041', border: '#9fd4b8' },
                        { emoji: '🌍', label: '文化内核', bg: '#fde4a0', color: '#633806', border: '#c8a830' },
                        { emoji: '👥', label: '本地社区', bg: '#dbd2f0', color: '#3c3489', border: '#b8a8e0' },
                        { emoji: '💼', label: '商业机会', bg: '#c8dcf0', color: '#0c447c', border: '#84b8d8' },
                      ] as const).map(q => (
                        <div key={q.label} style={{ background: q.bg, border: `0.5px solid ${q.border}`, borderRadius: 6, padding: '3px 7px', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <span style={{ fontSize: 11 }}>{q.emoji}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: q.color }}>{q.label}</span>
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 500, flexShrink: 0 }}>
                      <span className="hide-mobile">探索详情 </span>→
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── 遇见社区 ── */}
        <div className="desktop-search-wrap" style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 10 }}>—— 遇见社区 ——</div>
          <div>
            {previewImprints.map(imp => (
              <div key={imp.id} onClick={() => router.push('/meet')}
                className="home-preview-card home-preview-card--hover"
                style={{ display: 'flex', background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 12, overflow: 'hidden', marginBottom: 8, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ aspectRatio: '1 / 1', background: photoBg[imp.city] ?? '#dde8d8', flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' }}>
                  {imp.photo
                    ? <img src={imp.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    : <span style={{ fontSize: 9, color: '#8a9870' }}>[ 图片 ]</span>
                  }
                  <span style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(245,240,232,0.9)', color: '#3d3020', fontSize: 9, fontWeight: 500, padding: '2px 6px', borderRadius: 5 }}>
                    {CITIES[imp.city]?.nameZh || imp.city}
                  </span>
                </div>
                <div style={{ padding: '8px 12px', flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3 }}>{getDisplayTitle(imp.narrative ?? '', imp.title)}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.45, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{getBodyText(imp.narrative ?? '', imp.title).slice(0, 60)}…</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{imp.author ? (imp.author.startsWith('@') ? imp.author : `@${imp.author}`) : '@Nomadic 用户'}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>♡ {imp.likes ?? 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 页脚 ── */}
        <footer style={{ marginTop: 24, borderTop: '0.5px solid var(--border)', paddingTop: 24, paddingBottom: 8 }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <img src="/logo-nomadic-t.png" alt="Nomadic" style={{ height: 30, width: 'auto', display: 'block', margin: '0 auto 8px' }} />
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 600 }}>
              The Deep-Dive Platform for Global Residents
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Rooted in the world, never just passing by.
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8 }}>
            <div>© 2026 Nomadic · nomadictree.io</div>
          </div>
        </footer>

      </div>

      {errorMessage && <ErrorToast onClose={() => setErrorMessage('')} />}
    </div>
  )
}
