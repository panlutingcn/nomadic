'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// Volcano eruption particle
interface Particle {
  id: number
  x: number   // relative to icon center, px
  y: number
  vx: number
  vy: number
  life: number  // 0-1, decreasing
  type: 'spark' | 'lava'
  color: string
}

function VolcanoIcon({ erupting }: { erupting: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!erupting) return

    // Spawn particles once
    const sparks: Particle[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: 0, y: 0,
      vx: (Math.random() - 0.5) * 3.2,
      vy: -(Math.random() * 3 + 2),
      life: 1,
      type: 'spark',
      color: Math.random() > 0.5 ? '#ff8c00' : '#ffd700',
    }))
    const lava: Particle[] = Array.from({ length: 6 }, (_, i) => ({
      id: 10 + i,
      x: 0, y: 0,
      vx: (i % 2 === 0 ? 1 : -1) * (Math.random() * 1.5 + 0.8),
      vy: Math.random() * 0.5,
      life: 1,
      type: 'lava',
      color: i % 3 === 0 ? '#ff4500' : '#ff6a00',
    }))
    setParticles([...sparks, ...lava])
    setFrame(0)
  }, [erupting])

  useEffect(() => {
    if (particles.length === 0) return
    const raf = requestAnimationFrame(() => {
      setFrame(f => f + 1)
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy + (p.type === 'spark' ? 0.18 : 0.1),  // gravity
            life: p.life - (p.type === 'spark' ? 0.045 : 0.035),
          }))
          .filter(p => p.life > 0)
      )
    })
    return () => cancelAnimationFrame(raf)
  }, [particles, frame])

  return (
    <span style={{ position: 'relative', display: 'inline-block', fontSize: 20, lineHeight: 1 }}>
      🌋
      {particles.map(p => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `calc(50% + ${p.x}px)`,
            top: `calc(30% + ${p.y}px)`,
            width: p.type === 'spark' ? 3 : 4,
            height: p.type === 'spark' ? 3 : 4,
            borderRadius: '50%',
            background: p.color,
            opacity: p.life,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            boxShadow: p.type === 'spark' ? `0 0 3px ${p.color}` : 'none',
          }}
        />
      ))}
    </span>
  )
}

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')
  const [erupting, setErupting] = useState(false)

  const handleExplore = () => {
    router.push('/')
    setErupting(true)
    setTimeout(() => setErupting(false), 1200)
  }

  const navStyle: React.CSSProperties = {
    height: 70,
    background: '#ede5d8',
    borderTop: '0.5px solid #d8cdb8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '0 8px 12px',
    position: 'sticky',
    bottom: 0,
    zIndex: 100,
  }

  const niStyle = (): React.CSSProperties => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 2, flex: 1, cursor: 'pointer', background: 'none', border: 'none',
  })

  const isHome = isActive('/') && pathname === '/'
  const isMine = isActive('/mine')
  const isStory = isActive('/story')

  return (
    <nav style={navStyle}>
      {/* 探索 */}
      <button onClick={handleExplore} style={niStyle()}>
        <VolcanoIcon erupting={erupting} />
        <span style={{ fontSize: 10, color: isHome ? '#2d2418' : '#8a7a62', fontWeight: isHome ? 500 : 400 }}>探索</span>
        {isHome && <div style={{ height: 2, width: 18, background: '#1D9E75', borderRadius: 1, marginTop: 1 }} />}
      </button>

      {/* 印迹快门（居中） */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1 }}>
        <button
          onClick={() => router.push('/story')}
          style={{
            width: 50, height: 50, borderRadius: '50%',
            border: isStory ? '1.5px solid #1D9E75' : '1.5px solid #c8bfaa',
            background: '#ede5d8', marginTop: -14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isStory ? '0 2px 8px rgba(29,158,117,0.25)' : '0 2px 8px rgba(0,0,0,0.09)',
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: isStory ? '0.5px solid rgba(29,158,117,0.4)' : '0.5px solid #ddd4c0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 21, height: 21, borderRadius: '50%',
              background: isStory ? 'rgba(29,158,117,0.2)' : 'rgba(0,0,0,0.08)',
            }} />
          </div>
        </button>
        <span style={{ fontSize: 10, color: isStory ? '#1D9E75' : '#8a7a62', fontWeight: isStory ? 500 : 400, marginTop: 2 }}>印迹</span>
      </div>

      {/* 我的 */}
      <button onClick={() => router.push('/mine')} style={niStyle()}>
        <span style={{ fontSize: 20 }}>🗺️</span>
        <span style={{ fontSize: 10, color: isMine ? '#2d2418' : '#8a7a62', fontWeight: isMine ? 500 : 400 }}>我的</span>
        {isMine && <div style={{ height: 2, width: 18, background: '#1D9E75', borderRadius: 1, marginTop: 1 }} />}
      </button>
    </nav>
  )
}
