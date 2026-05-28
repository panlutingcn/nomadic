'use client'
export const dynamic = 'force-static'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import nextDynamic from 'next/dynamic'
import BottomNav from '@/components/BottomNav'
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
  const searchBoxRef = useRef<SearchBoxHandle>(null)

  useEffect(() => {
    const allCities = [...PINNED_CITIES, ...NOMAD_CITY_POOL].filter(c => !!CITIES[c.en])
    setRandomCities(shuffle(NOMAD_CITY_POOL).slice(0, RANDOM_COUNT))
    setInsightCities(shuffle(allCities).slice(0, 5))
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

        {/* Hero */}
        <div style={{ position: 'relative', height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 12, overflow: 'hidden' }}>
          {/* Rotating globe background — 1.5x larger */}
          <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1, pointerEvents: 'none', opacity: 0.28 }}>
            <HeroGlobe size={285} />
          </div>
          <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
            {/* Transparent-background logo image */}
            <img
              src="/logo-nomadic-t.png"
              alt="Nomadic"
              style={{ height: 53, width: 'auto', display: 'block', margin: '0 auto' }}
            />
            <div style={{ fontSize: 14, fontWeight: 500, color: '#3d3020', marginTop: 4, lineHeight: 1.45 }}>为旅居者打造的城市深度平台</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>在世界各地扎根，而不只是路过。</div>
          </div>
        </div>

        {/* 搜索框：桌面端限宽居中 */}
        <div className="desktop-search-wrap">
          <SearchBox ref={searchBoxRef} onError={setErrorMessage} />
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 8 }}>—— 你想去哪里 ——</div>
        {/* 城市标签：桌面端限宽居中 */}
        <div className="desktop-tags-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12, justifyContent: 'center' }}>
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
                  {/* 行一：flag · 城市名 · 国家 · 一句话简介 */}
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 17, lineHeight: 1, flexShrink: 0 }}>{cityData.flag}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', flexShrink: 0 }}>{cityData.nameZh}</span>
                    <span style={{ color: 'var(--border)', flexShrink: 0 }}>·</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>{cityData.countryZh}</span>
                    <span style={{ color: 'var(--border)', flexShrink: 0 }}>·</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cityData.soul.headline}</span>
                  </div>
                  {/* 行二：四象限徽章（可换行）+ 探索详情 */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
                    {([
                      { emoji: '🌍', label: '城市灵魂', bg: '#fde4a0', color: '#633806', border: '#c8a830' },
                      { emoji: '🌿', label: '生存基准', bg: '#d4ede0', color: '#085041', border: '#9fd4b8' },
                      { emoji: '💼', label: '商业机会', bg: '#c8dcf0', color: '#0c447c', border: '#84b8d8' },
                      { emoji: '👥', label: '本地圈子', bg: '#dbd2f0', color: '#3c3489', border: '#b8a8e0' },
                    ] as const).map(q => (
                      <div key={q.label} style={{ background: q.bg, border: `0.5px solid ${q.border}`, borderRadius: 6, padding: '3px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{ fontSize: 9 }}>{q.emoji}</span>
                        <span style={{ fontSize: 9, fontWeight: 600, color: q.color }}>{q.label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 500 }}>
                      <span className="hide-mobile">探索详情 </span>→
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 遇见社区 */}
        <div className="desktop-search-wrap" style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 10 }}>—— 遇见社区 ——</div>
        {/* 印迹预览：自然高度，与手机端相同单列排版 */}
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
        </div>{/* /desktop-search-wrap preview */}

        {/* ── 页脚 ── */}
        <footer style={{ marginTop: 24, borderTop: '0.5px solid var(--border)', paddingTop: 24, paddingBottom: 8 }}>
          {/* 品牌 + 简介 */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <img src="/logo-nomadic-t.png" alt="Nomadic" style={{ height: 30, width: 'auto', display: 'block', margin: '0 auto 8px' }} />
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 600 }}>
              The Deep-Dive Platform for Global Residents
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Rooted in the world, never just passing by.
            </div>
          </div>

          {/* 版权 */}
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8 }}>
            <div>© 2026 Nomadic · nomadictree.io</div>
          </div>
        </footer>

      </div>

      <div className="nav-spacer-mobile" style={{ height: 32 }} />
      <BottomNav />
      {errorMessage && <ErrorToast onClose={() => setErrorMessage('')} />}
    </div>
  )
}
