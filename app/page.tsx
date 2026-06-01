'use client'
export const dynamic = 'force-static'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import nextDynamic from 'next/dynamic'
import SearchBox, { SearchBoxHandle } from '@/components/SearchBox'
import ErrorToast from '@/components/ErrorToast'
import { PINNED_CITIES, NOMAD_CITY_POOL, NomadCity } from '@/data/nomadCities'
import { shuffle } from '@/utils/shuffle'

const HeroGlobe = nextDynamic(() => import('@/components/HeroGlobe'), { ssr: false })

const RANDOM_COUNT = 9

const CARD_W = 173
const CARD_H = 240

const QUADRANTS = [
  {
    id: 'landing',
    name: 'LANDING',
    tagline: '落地指南',
    image: '/cards/landing.png',
    frontColor: '#1a1200',
    backBg: 'linear-gradient(145deg, #F5C200 0%, #D49000 100%)',
    backColor: 'rgba(30,20,0,0.90)',
    description: '签证攻略 · 住房指南\n医疗保险 · 生活成本\n\n搜索一座城市\n获取专属落地手册',
  },
  {
    id: 'soul',
    name: 'SOUL',
    tagline: '文化内核',
    image: '/cards/soul.png',
    frontColor: '#ffffff',
    backBg: 'linear-gradient(145deg, #E8789A 0%, #C05070 100%)',
    backColor: 'rgba(255,240,246,0.95)',
    description: '文化气质 · 历史底蕴\n创意氛围 · 城市性格\n\n搜索一座城市\n读懂它真正的灵魂',
  },
  {
    id: 'community',
    name: 'COMMUNITY',
    tagline: '本地圈子',
    image: '/cards/community.png',
    frontColor: '#ffffff',
    backBg: 'linear-gradient(145deg, #2E7A48 0%, #1A5230 100%)',
    backColor: 'rgba(220,255,230,0.95)',
    description: '华人社群 · 共创空间\n本地活动 · 社交网络\n\n搜索一座城市\n找到你的同频圈子',
  },
  {
    id: 'chance',
    name: 'CHANCE',
    tagline: '商业机遇',
    image: '/cards/chance.png',
    frontColor: '#ffffff',
    backBg: 'linear-gradient(145deg, #2255CC 0%, #0A2A8A 100%)',
    backColor: 'rgba(220,235,255,0.95)',
    description: '创业环境 · 税务政策\n远程机会 · 市场洞察\n\n搜索一座城市\n发现你的下一个商机',
  },
]

export default function ExplorePage() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const [randomCities, setRandomCities] = useState<NomadCity[]>([])
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [hoveredPersona, setHoveredPersona] = useState(false)
  const [globeSize, setGlobeSize] = useState(440)
  const [flippedCard, setFlippedCard] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const searchBoxRef = useRef<SearchBoxHandle>(null)

  useEffect(() => {
    setRandomCities(shuffle(NOMAD_CITY_POOL).slice(0, RANDOM_COUNT))
  }, [])

  useEffect(() => {
    const update = () => {
      const desktop = window.innerWidth >= 1024
      setIsDesktop(desktop)
      setGlobeSize(desktop ? 560 : Math.min(440, window.innerWidth - 20))
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

  const toggleFlip = (id: string) => {
    setFlippedCard(prev => prev === id ? null : id)
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
              style={{ height: 50, width: 'auto', display: 'block', margin: '0 auto 4px' }}
            />
            <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3020', marginBottom: 2, textAlign: 'center' }}>
              为旅居者打造的城市深度平台
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

        {/* ── 旅行人格测试入口 ── */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button
            onClick={() => router.push('/onboarding')}
            onMouseEnter={() => setHoveredPersona(true)}
            onMouseLeave={() => setHoveredPersona(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: hoveredPersona ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.58)',
              backdropFilter: 'blur(14px) saturate(160%)',
              WebkitBackdropFilter: 'blur(14px) saturate(160%)',
              border: `0.5px solid ${hoveredPersona ? 'rgba(29,158,117,0.38)' : 'rgba(255,255,255,0.80)'}`,
              borderRadius: 28, padding: '11px 24px',
              cursor: 'pointer',
              boxShadow: hoveredPersona
                ? '0 6px 24px rgba(0,0,0,0.09), inset 0 1.5px 0 rgba(255,255,255,1)'
                : '0 3px 16px rgba(0,0,0,0.06), inset 0 1.5px 0 rgba(255,255,255,0.96)',
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

        {/* ── 四象限卡片 ── */}
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 14, letterSpacing: '0.06em' }}>
          —— 城市洞察四象限 ——
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? `repeat(4, ${CARD_W}px)` : `repeat(2, ${CARD_W}px)`,
          gap: isDesktop ? 16 : 12,
          justifyContent: 'center',
          marginBottom: 32,
        }}>
          {QUADRANTS.map(q => {
            const flipped = isDesktop ? hoveredCard === q.id : flippedCard === q.id
            return (
              <div
                key={q.id}
                onClick={() => !isDesktop && toggleFlip(q.id)}
                onMouseEnter={() => isDesktop && setHoveredCard(q.id)}
                onMouseLeave={() => isDesktop && setHoveredCard(null)}
                style={{ width: CARD_W, height: CARD_H, perspective: '1000px', cursor: 'pointer', flexShrink: 0 }}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transition: 'transform 560ms cubic-bezier(0.45, 0, 0.55, 1)',
                }}>

                  {/* ── 正面 ── */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                    borderRadius: 14, overflow: 'hidden',
                    boxShadow: '0 10px 32px rgba(0,0,0,0.22), 0 3px 8px rgba(0,0,0,0.14)',
                  }}>
                    {/* 图片背景 */}
                    <img
                      src={q.image}
                      alt={q.name}
                      style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 30%',
                      }}
                    />
                    {/* 文字：中文第一行，英文第二行，居中 */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      gap: 5, textAlign: 'center', padding: '14px',
                    }}>
                      <div style={{
                        fontSize: 17, fontWeight: 900,
                        color: q.frontColor,
                        letterSpacing: '0.06em',
                        lineHeight: 1.1,
                        textShadow: '0 1px 8px rgba(0,0,0,0.22)',
                      }}>{q.tagline}</div>
                      <div style={{
                        fontSize: q.id === 'community' ? 9 : 10,
                        fontWeight: 600,
                        color: q.frontColor,
                        letterSpacing: q.id === 'community' ? '0.10em' : '0.16em',
                        opacity: 0.82,
                        textShadow: '0 1px 4px rgba(0,0,0,0.18)',
                      }}>{q.name}</div>
                    </div>
                  </div>

                  {/* ── 背面 ── */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderRadius: 14, overflow: 'hidden',
                    background: q.backBg,
                    boxShadow: '0 10px 32px rgba(0,0,0,0.25), 0 3px 8px rgba(0,0,0,0.16)',
                  }}>
                    {/* 背面文字 */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      padding: '18px 16px 14px',
                      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    }}>
                      <div>
                        <div style={{
                          fontSize: 11, fontWeight: 800,
                          color: q.backColor, letterSpacing: '0.08em',
                          marginBottom: 10,
                        }}>{q.name}</div>
                        <div style={{
                          fontSize: 10.5, lineHeight: 1.65,
                          color: q.backColor, opacity: 0.85,
                          whiteSpace: 'pre-line',
                        }}>{q.description}</div>
                      </div>
                      <div style={{
                        fontSize: 9.5, fontWeight: 600,
                        color: q.backColor, opacity: 0.55,
                        letterSpacing: '0.03em',
                      }}>↑ 在搜索框输入城市探索</div>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>

        {/* ── 页脚 ── */}
        <footer style={{ marginTop: 8, borderTop: '0.5px solid var(--border)', paddingTop: 24, paddingBottom: 8 }}>
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
