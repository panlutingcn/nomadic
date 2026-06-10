'use client'
export const dynamic = 'force-static'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import nextDynamic from 'next/dynamic'
import SearchBox, { SearchBoxHandle } from '@/components/SearchBox'
import NomadJourney from '@/components/NomadJourney'
import ErrorToast from '@/components/ErrorToast'
import { PINNED_CITIES, NOMAD_CITY_POOL, NomadCity } from '@/data/nomadCities'
import { shuffle } from '@/utils/shuffle'

const HeroGlobe = nextDynamic(() => import('@/components/HeroGlobe'), { ssr: false })

const RANDOM_COUNT = 9
const HERO_WIDTH = 400
const GLOBE_SIZE = 560


export default function ExplorePage() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const [randomCities, setRandomCities] = useState<NomadCity[]>([])
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [heroScale, setHeroScale] = useState(1)
  const searchBoxRef = useRef<SearchBoxHandle>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRandomCities(shuffle(NOMAD_CITY_POOL).slice(0, RANDOM_COUNT))
  }, [])

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const update = () => {
      setHeroScale(Math.min(1, el.clientWidth / GLOBE_SIZE))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleCityClick = (city: NomadCity) => {
    router.push(`/insights?q=${encodeURIComponent(city.zh)}`)
  }

  const handleRandomExplore = () => {
    const all = [...PINNED_CITIES, ...NOMAD_CITY_POOL]
    const pick = all[Math.floor(Math.random() * all.length)]
    searchBoxRef.current?.fill(pick.zh)
  }

  const displayCities: NomadCity[] = [...PINNED_CITIES, ...randomCities]

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', display: 'flex', flexDirection: 'column' }}>
      <div className="page-inner" style={{ flex: 1, padding: '64px 16px 10px' }}>

        {/* ── Hero Globe ── */}
        <div ref={heroRef} style={{
          width: '100%',
          height: GLOBE_SIZE * heroScale,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}>
        <div style={{
          position: 'relative',
          width: HERO_WIDTH,
          height: GLOBE_SIZE,
          flexShrink: 0,
          transform: `scale(${heroScale})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            pointerEvents: 'none',
            width: GLOBE_SIZE * 0.92,
            height: GLOBE_SIZE * 0.92,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.10) 65%, rgba(255,255,255,0) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ opacity: 0.65 }}>
              <HeroGlobe size={GLOBE_SIZE} />
            </div>
          </div>

          <div style={{
            position: 'relative',
            zIndex: 3,
            width: '100%',
            maxWidth: HERO_WIDTH,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 16px',
          }}>
            <div style={{
              marginBottom: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}>
              <div style={{ fontFamily: "'HYYaKuHeiJ', '汉仪琥珀体简', 'PingFang SC', 'Heiti SC', sans-serif", fontSize: 38, fontWeight: 900, color: 'var(--accent-text)', letterSpacing: '1px', marginBottom: 4, textAlign: 'center', lineHeight: 1.5, textShadow: '0 1px 6px rgba(255,255,255,0.6)' }}>
                在世界各地扎根<br />而不只是路过
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2, textAlign: 'center', textShadow: '0 1px 4px rgba(255,255,255,0.6)' }}>
                环球旅居者的城市深度洞察平台
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '1px', textAlign: 'center', textShadow: '0 1px 4px rgba(255,255,255,0.6)' }}>
                The Deep-Dive Platform for Global Wanderers
              </div>
            </div>

            <div style={{ width: '100%' }}>
              <SearchBox ref={searchBoxRef} onError={setErrorMessage} />
            </div>

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
        </div>

        {/* ── 用户旅程 ── */}
        <NomadJourney />


        {/* ── 页脚 ── */}
        <footer style={{ marginTop: 8, borderTop: '0.5px solid var(--border)', paddingTop: 24, paddingBottom: 8 }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <img src="/logo-nomadic-t.png" alt="Nomadic" style={{ height: 30, width: 'auto', display: 'block', margin: '0 auto 8px', filter: 'brightness(0) saturate(100%) invert(44%) sepia(63%) saturate(500%) hue-rotate(121deg) brightness(72%)' }} />
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 600 }}>
              在世界各地扎根，而不只是路过。
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
