'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATIONS = [
  {
    numeral: 'I',
    numeralSize: 26,
    name: '出发之前',
    title: '旅行人格测试',
    subtitle: '测出你的旅居人格，找到真正属于你的城市',
    english: 'Discover your nomad type, find your city',
    href: '/onboarding',
  },
  {
    numeral: 'II',
    numeralSize: 22,
    name: '洞察城市',
    title: '一座城市，四个象限',
    subtitle: '四个维度深度解读城市，连接在地向导咨询',
    english: 'Four lenses, one city — consult real locals',
    href: '/insights?q=柏林',
  },
  {
    numeral: 'III',
    numeralSize: 19,
    name: '到达之后',
    title: '旅行印迹社区',
    subtitle: '发布旅居印迹，找到同频的人',
    english: 'Share your journey, find your people',
    href: '/meet',
  },
  {
    numeral: 'IV',
    numeralSize: 18,
    name: '旅行版图',
    title: '全球旅行版图',
    subtitle: '用地图记录每一段旅居坐标与人生轨迹',
    english: 'Map every chapter of your nomadic life',
    href: '/mine',
  },
]

export default function NomadJourney() {
  const router = useRouter()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleClick = (station: typeof STATIONS[number]) => {
    if (station.href) router.push(station.href)
  }

  return (
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      padding: '2rem 1.5rem',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
        <div style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          letterSpacing: '0.14em',
          fontWeight: 500,
          lineHeight: 1,
        }}>
          YOUR NOMADIC JOURNEY
        </div>
        <div style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          marginTop: 6,
        }}>
          从认识自己，到扎根城市
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {STATIONS.map((station, i) => {
          const hovered = hoveredIndex === i
          return (
            <div key={station.name} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontWeight: 500,
                  color: '#178f68',
                  fontSize: station.numeralSize,
                  lineHeight: 1,
                  marginBottom: 3,
                }}>
                  {station.numeral}
                </div>
                <div style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.03em',
                }}>
                  {station.name}
                </div>
              </div>

              <button
                onClick={() => handleClick(station)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={!hovered ? 'journey-card-pulse' : undefined}
                style={{
                  width: '100%',
                  background: hovered
                    ? 'rgba(255,255,255,0.78)'
                    : 'rgba(255,255,255,0.60)',
                  backdropFilter: 'blur(14px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                  border: `0.5px solid ${hovered ? '#178f68' : 'rgba(23,143,104,0.28)'}`,
                  borderRadius: 12,
                  padding: '1.25rem 1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: hovered
                    ? '0 8px 32px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.06), inset 0 1.5px 0 rgba(255,255,255,1)'
                    : undefined,
                  animationDelay: `${i * 0.75}s`,
                  transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
                }}
              >
                <div style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#178f68',
                  marginBottom: 8,
                }}>
                  {station.title}
                </div>
                <div style={{
                  fontSize: 12.5,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: 7,
                }}>
                  {station.subtitle}
                </div>
                <div style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                }}>
                  {station.english}
                </div>
              </button>

              {i < STATIONS.length - 1 && (
                <div style={{
                  width: 1,
                  height: 20,
                  background: 'var(--border)',
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
