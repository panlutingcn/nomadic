'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface Particle {
  id: number
  x: number        // px from emoji horizontal center
  y: number        // px from emoji vertical center
  vx: number
  vy: number
  life: number     // 0→1 starts at 1, decreases
  decay: number
  type: 'spark' | 'lava' | 'smoke'
  size: number
  grounded: boolean  // lava has reached the base and is flowing outward
}

let _pid = 0

function lavaColor(life: number, type: Particle['type']): string {
  if (type === 'smoke') return `rgba(160,140,120,${(life * 0.45).toFixed(2)})`
  if (type === 'spark') {
    if (life > 0.75) return '#ffffc0'
    if (life > 0.55) return '#ffd700'
    if (life > 0.35) return '#ff8c00'
    return '#ff4500'
  }
  // lava blob — cools visibly
  if (life > 0.78) return '#fff4a0'
  if (life > 0.58) return '#ff9500'
  if (life > 0.38) return '#ff3e00'
  if (life > 0.18) return '#c01200'
  return '#700800'
}

function VolcanoIcon({ erupting }: { erupting: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const rafRef = useRef<number>(0)

  const spawnBatch = useCallback((): Particle[] => {
    const batch: Particle[] = []

    // Sparks — shoot upward, scatter wide, fast fade
    for (let i = 0; i < 5; i++) {
      batch.push({
        id: _pid++, x: (Math.random() - 0.5) * 2, y: -7,
        vx: (Math.random() - 0.5) * 4.5,
        vy: -(Math.random() * 3.5 + 2.5),
        life: 1, decay: 0.042 + Math.random() * 0.022,
        type: 'spark', size: 1.5 + Math.random() * 1.5, grounded: false,
      })
    }

    // Lava blobs — erupt upward, arc back, ground at base and flow outward
    for (let i = 0; i < 4; i++) {
      const dir = i % 2 === 0 ? 1 : -1
      batch.push({
        id: _pid++, x: (Math.random() - 0.5) * 3, y: -7,
        vx: dir * (Math.random() * 1.8 + 0.4),
        vy: -(Math.random() * 2.2 + 1.4),
        life: 1, decay: 0.020 + Math.random() * 0.010,
        type: 'lava', size: 3.5 + Math.random() * 2.5, grounded: false,
      })
    }

    // Smoke — drift upward slowly
    for (let i = 0; i < 2; i++) {
      batch.push({
        id: _pid++, x: (Math.random() - 0.5) * 4, y: -9,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.9 + 0.3),
        life: 0.85, decay: 0.016,
        type: 'smoke', size: 5 + Math.random() * 3, grounded: false,
      })
    }

    return batch
  }, [])

  // Spawn new batches continuously while erupting
  useEffect(() => {
    if (!erupting) { if (intervalRef.current) clearInterval(intervalRef.current); return }
    setParticles(prev => [...prev, ...spawnBatch()])
    intervalRef.current = setInterval(() => {
      setParticles(prev => [...prev, ...spawnBatch()])
    }, 110)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [erupting, spawnBatch])

  // Physics loop
  useEffect(() => {
    if (particles.length === 0) return
    rafRef.current = requestAnimationFrame(() => {
      setParticles(prev =>
        prev
          .map(p => {
            let { x, y, vx, vy, grounded } = p
            const gravity = p.type === 'smoke' ? -0.01 : (p.type === 'spark' ? 0.22 : 0.20)
            vy += gravity

            // Lava hits the volcano base (~y=6) → ground it and spread outward
            if (p.type === 'lava' && !grounded && y > 6) {
              grounded = true
              vy = 0.08
              vx *= 1.5  // splash outward
            }

            // Grounded lava flows with slight gravity on the plain, friction slows it
            if (grounded) { vy += 0.015; vx *= 0.96 }

            x += vx; y += vy
            return { ...p, x, y, vx, vy, life: p.life - p.decay, grounded }
          })
          .filter(p => p.life > 0 && p.y < 22)
      )
    })
    return () => cancelAnimationFrame(rafRef.current)
  }, [particles])

  // Drain remaining particles after eruption ends
  useEffect(() => {
    if (erupting) return
    const t = setTimeout(() => setParticles([]), 1600)
    return () => clearTimeout(t)
  }, [erupting])

  return (
    <span
      className={erupting ? 'volcano-erupting' : ''}
      style={{ position: 'relative', display: 'inline-block', fontSize: 20, lineHeight: 1, overflow: 'visible' }}
    >
      🌋
      {particles.map(p => {
        const color = lavaColor(p.life, p.type)
        const isHot = p.life > 0.5 && p.type !== 'smoke'
        return (
          <span
            key={p.id}
            style={{
              position: 'absolute',
              left: `calc(50% + ${p.x}px)`,
              top: `calc(50% + ${p.y}px)`,
              width: p.type === 'lava' && p.grounded ? p.size * 1.6 : p.size,
              height: p.type === 'lava' && p.grounded ? p.size * 0.55 : p.size,
              borderRadius: p.type === 'smoke' ? '50%' : (p.grounded ? '40%' : '50%'),
              background: color,
              opacity: p.type === 'smoke' ? 1 : p.life,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              filter: p.type === 'smoke' ? 'blur(2px)' : (isHot ? 'blur(0.4px)' : 'none'),
              boxShadow: isHot ? `0 0 ${p.size + 1}px ${color}` : 'none',
            }}
          />
        )
      })}
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
    setTimeout(() => setErupting(false), 1800)
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
    overflow: 'visible',
  }

  const niStyle = (): React.CSSProperties => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 2, flex: 1, cursor: 'pointer', background: 'none', border: 'none',
    overflow: 'visible',
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
