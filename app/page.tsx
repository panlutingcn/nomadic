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


export default function ExplorePage() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const [randomCities, setRandomCities] = useState<NomadCity[]>([])
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [globeSize, setGlobeSize] = useState(440)
  const searchBoxRef = useRef<SearchBoxHandle>(null)

  useEffect(() => {
    setRandomCities(shuffle(NOMAD_CITY_POOL).slice(0, RANDOM_COUNT))
  }, [])

  useEffect(() => {
    const update = () => {
      setGlobeSize(window.innerWidth >= 1024 ? 560 : Math.min(440, window.innerWidth - 20))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
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
      <div className="page-inner" style={{ flex: 1, padding: '0 16px 10px' }}>

        {/* ── Hero Globe ── */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: globeSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}>
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
            <img
              src="/logo-nomadic-t.png"
              alt="Nomadic"
              style={{ height: 50, width: 'auto', display: 'block', margin: '0 auto 4px', filter: 'brightness(0) saturate(100%) invert(52%) sepia(57%) saturate(447%) hue-rotate(117deg) brightness(87%)' }}
            />
            <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3020', marginBottom: 2, textAlign: 'center' }}>
              旅居者的城市深度洞察平台
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 14, textAlign: 'center' }}>
              在世界各地扎根，而不只是路过。
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

        {/* ── 用户旅程 ── */}
        <NomadJourney />


        {/* ── 页脚 ── */}
        <footer style={{ marginTop: 8, borderTop: '0.5px solid var(--border)', paddingTop: 24, paddingBottom: 8 }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <img src="/logo-nomadic-t.png" alt="Nomadic" style={{ height: 30, width: 'auto', display: 'block', margin: '0 auto 8px', filter: 'brightness(0) saturate(100%) invert(52%) sepia(57%) saturate(447%) hue-rotate(117deg) brightness(87%)' }} />
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

      </div>

      {errorMessage && <ErrorToast onClose={() => setErrorMessage('')} />}
    </div>
  )
}
