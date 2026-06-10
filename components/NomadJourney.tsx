'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATIONS = [
  {
    numeral: 'I',
    name: '出发之前',
    title: '旅行人格测试',
    subtitle: '测出旅行风格，匹配理想城市',
    english: 'Discover your nomad type, find your city',
    href: '/onboarding',
  },
  {
    numeral: 'II',
    name: '洞察城市',
    title: '一座城市，四个象限',
    subtitle: '深度解读城市，连接真实在地人',
    english: 'Four lenses, one city — consult real locals',
    href: '/insights?q=柏林',
  },
  {
    numeral: 'III',
    name: '到达之后',
    title: '旅行印迹社区',
    subtitle: '发布旅居印迹，找到同频的人',
    english: 'Share your journey, find your people',
    href: '/meet',
  },
  {
    numeral: 'IV',
    name: '旅行版图',
    title: '全球旅行版图',
    subtitle: '用地图记录每一段旅居坐标与人生轨迹',
    english: 'Map every chapter of your nomadic life',
    href: '/mine',
  },
]

const ROW_HEIGHT = 190
const CIRCLE = 130

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
      <div className="crystal-card" style={{
        textAlign: 'center',
        marginBottom: '2.5rem',
        borderRadius: 14,
        padding: '14px 20px',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}>
        <div style={{
          fontSize: 10,
          color: 'var(--text-secondary)',
          letterSpacing: '0.14em',
          fontWeight: 500,
          lineHeight: 1,
        }}>
          YOUR NOMADIC JOURNEY
        </div>
        <div style={{
          fontSize: 14,
          color: 'var(--text-primary)',
          marginTop: 6,
        }}>
          从认识自己，到扎根城市
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {/* ── 漫画风脚印小径 ── */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          {STATIONS.slice(0, -1).map((_, g) => {
            const CONTENT_WIDTH = 432 // 480 - 2 * 24px padding
            const fromX = g % 2 === 0 ? 22 : 78
            const toX = g % 2 === 0 ? 78 : 22
            const fromY = g * ROW_HEIGHT + ROW_HEIGHT * 0.78
            const toY = (g + 1) * ROW_HEIGHT + ROW_HEIGHT * 0.22
            const dxPx = (toX - fromX) / 100 * CONTENT_WIDTH
            const dyPx = toY - fromY
            const len = Math.hypot(dxPx, dyPx)
            const perpX = -dyPx / len
            const perpY = dxPx / len
            // 脚尖朝向行进方向：足迹emoji默认朝上(-90°)，旋转到行进角度
            const rotate = Math.atan2(dyPx, dxPx) * 180 / Math.PI + 90
            return [1, 2, 3].map((k) => {
              const t = k / 4
              const baseX = fromX + (toX - fromX) * t
              const baseY = fromY + (toY - fromY) * t
              const sideOffset = k % 2 === 0 ? 9 : -9 // 左右脚交替
              const x = baseX + (perpX * sideOffset) / CONTENT_WIDTH * 100
              const y = baseY + perpY * sideOffset
              return (
                <span
                  key={`${g}-${k}`}
                  style={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: y,
                    transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
                    fontSize: 22,
                    opacity: 0.4 + t * 0.15,
                    filter: 'grayscale(0.15) sepia(0.25) saturate(1.4) hue-rotate(70deg)',
                  }}
                >
                  👣
                </span>
              )
            })
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
          {STATIONS.map((station, i) => {
            const hovered = hoveredIndex === i
            const reversed = i % 2 === 1
            return (
              <button
                key={station.name}
                onClick={() => handleClick(station)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  display: 'flex',
                  flexDirection: reversed ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: '1.25rem',
                  width: '100%',
                  minHeight: ROW_HEIGHT,
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  textAlign: reversed ? 'right' : 'left',
                }}
              >
                {/* 圆形信息标 */}
                <div
                  className={!hovered ? 'journey-card-pulse' : undefined}
                  style={{
                    flexShrink: 0,
                    width: CIRCLE,
                    height: CIRCLE,
                    borderRadius: '50%',
                    background: '#178f68',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: hovered
                      ? '0 8px 24px rgba(23,143,104,0.35)'
                      : '0 4px 16px rgba(0,0,0,0.10)',
                    transform: hovered ? 'scale(1.06)' : 'scale(1)',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                  }}
                >
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                    {station.numeral}
                  </div>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>
                    {station.name}
                  </div>
                </div>

                {/* 文字内容 */}
                <div className="crystal-card" style={{ flex: 1, minWidth: 0, borderRadius: 14, padding: '12px 16px' }}>
                  <div style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: hovered ? '#178f68' : 'var(--text-primary)',
                    marginBottom: 5,
                    transition: 'color 0.18s ease',
                  }}>
                    {station.title}
                  </div>
                  <div style={{
                    fontSize: 12.5,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: 5,
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
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
