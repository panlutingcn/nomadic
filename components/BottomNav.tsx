'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface Bubble {
  id: number
  x: number
  startY: number
  size: number
  duration: number
  delay: number
  drift: number
}

let uid = 0

function spawnBatch(cx: number, cy: number): Bubble[] {
  return Array.from({ length: 5 }, () => ({
    id: ++uid,
    x: cx + (Math.random() - 0.5) * 28,
    startY: cy,
    size: 10 + Math.random() * 16,
    duration: 1.8 + Math.random() * 1.8,
    delay: Math.random() * 0.3,
    drift: (Math.random() - 0.5) * 50,
  }))
}

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleNav = useCallback((path: string, e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top

    if (intervalRef.current) clearInterval(intervalRef.current)

    const addBatch = () => {
      const batch = spawnBatch(cx, cy)
      setBubbles(prev => [...prev, ...batch])
      setTimeout(() => {
        setBubbles(prev => prev.filter(b => !batch.some(nb => nb.id === b.id)))
      }, 4000)
    }

    addBatch()

    // 同页面只冒一批，跨页面持续冒泡直到导航完成
    if (pathname !== path) {
      intervalRef.current = setInterval(addBatch, 300)
    }

    router.push(path)
  }, [router, pathname])

  return (
    <>
      <style>{`
        @keyframes bubble-rise {
          0%   { transform: translateY(0px) translateX(0px) scale(1);    opacity: 0.85; }
          50%  { transform: translateY(calc(var(--travel) * -0.5)) translateX(calc(var(--drift) * 0.6)) scale(1.1); opacity: 0.55; }
          100% { transform: translateY(calc(var(--travel) * -1))   translateX(var(--drift)) scale(0.7); opacity: 0; }
        }
      `}</style>

      {bubbles.map(b => (
        <div
          key={b.id}
          style={{
            position: 'fixed',
            left: b.x - b.size / 2,
            top: b.startY - b.size / 2,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1.5px solid rgba(255,255,255,0.55)',
            boxShadow: 'inset 0 -2px 4px rgba(255,255,255,0.2), inset 2px 2px 4px rgba(255,255,255,0.3)',
            pointerEvents: 'none',
            zIndex: 9999,
            ['--drift' as string]: `${b.drift}px`,
            ['--travel' as string]: `${b.startY + b.size}px`,
            animation: `bubble-rise ${b.duration}s ease-out ${b.delay}s forwards`,
          }}
        />
      ))}

      <nav style={{
        background: 'var(--bg-nav)',
        borderTop: '0.5px solid #d8cdb8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 4px 20px',
        position: 'sticky',
        bottom: 0,
      }}>
        <button
          onClick={e => handleNav('/', e)}
          onMouseEnter={() => setHoveredNav('/')}
          onMouseLeave={() => setHoveredNav(null)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1, background: 'none', border: 'none', cursor: 'pointer', transform: hoveredNav === '/' ? 'scale(1.18)' : 'scale(1)', transition: 'transform 120ms ease' }}
        >
          <span style={{ fontSize: 18 }}>🏠</span>
          <span style={{ fontSize: 10, color: isActive('/') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive('/') ? 500 : 400 }}>主页</span>
          {isActive('/') && <div style={{ height: 2, width: 18, background: 'var(--accent)', borderRadius: 1 }} />}
        </button>

        <button
          onClick={e => handleNav('/insights', e)}
          onMouseEnter={() => setHoveredNav('/insights')}
          onMouseLeave={() => setHoveredNav(null)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1, background: 'none', border: 'none', cursor: 'pointer', transform: hoveredNav === '/insights' ? 'scale(1.18)' : 'scale(1)', transition: 'transform 120ms ease' }}
        >
          <span style={{ fontSize: 18 }}>🧭</span>
          <span style={{ fontSize: 10, color: isActive('/insights') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive('/insights') ? 500 : 400 }}>洞察</span>
          {isActive('/insights') && <div style={{ height: 2, width: 18, background: 'var(--accent)', borderRadius: 1 }} />}
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
          <button
            onClick={e => handleNav('/story/camera', e)}
            onMouseEnter={() => setHoveredNav('/story')}
            onMouseLeave={() => setHoveredNav(null)}
            style={{
              width: 48, height: 48, borderRadius: '50%',
              border: (isActive('/story/camera') || isActive('/story')) ? '1.5px solid var(--accent)' : '1.5px solid #c8bfaa',
              background: 'var(--bg-page)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: -10, cursor: 'pointer',
              boxShadow: (isActive('/story/camera') || isActive('/story')) ? '0 2px 8px rgba(29,158,117,0.2)' : '0 2px 8px rgba(0,0,0,0.09)',
              transform: hoveredNav === '/story' ? 'scale(1.18)' : 'scale(1)',
              transition: 'transform 120ms ease',
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: '50%', border: (isActive('/story/camera') || isActive('/story')) ? '0.5px solid rgba(29,158,117,0.35)' : '0.5px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: (isActive('/story/camera') || isActive('/story')) ? 'rgba(29,158,117,0.18)' : 'rgba(0,0,0,0.08)' }} />
            </div>
          </button>
          <span style={{ fontSize: 10, color: (isActive('/story/camera') || isActive('/story')) ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: (isActive('/story/camera') || isActive('/story')) ? 500 : 400, marginTop: 2 }}>印迹</span>
        </div>

        <button
          onClick={e => handleNav('/meet', e)}
          onMouseEnter={() => setHoveredNav('/meet')}
          onMouseLeave={() => setHoveredNav(null)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1, background: 'none', border: 'none', cursor: 'pointer', transform: hoveredNav === '/meet' ? 'scale(1.18)' : 'scale(1)', transition: 'transform 120ms ease' }}
        >
          <span style={{ fontSize: 18 }}>✨</span>
          <span style={{ fontSize: 10, color: isActive('/meet') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive('/meet') ? 500 : 400 }}>遇见</span>
          {isActive('/meet') && <div style={{ height: 2, width: 18, background: 'var(--accent)', borderRadius: 1 }} />}
        </button>

        <button
          onClick={e => handleNav('/vault', e)}
          onMouseEnter={() => setHoveredNav('/vault')}
          onMouseLeave={() => setHoveredNav(null)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1, background: 'none', border: 'none', cursor: 'pointer', transform: hoveredNav === '/vault' ? 'scale(1.18)' : 'scale(1)', transition: 'transform 120ms ease' }}
        >
          <span style={{ fontSize: 18 }}>🗺️</span>
          <span style={{ fontSize: 10, color: isActive('/vault') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive('/vault') ? 500 : 400 }}>领地</span>
          {isActive('/vault') && <div style={{ height: 2, width: 18, background: 'var(--accent)', borderRadius: 1 }} />}
        </button>
      </nav>
    </>
  )
}
