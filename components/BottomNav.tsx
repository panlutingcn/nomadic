'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)

  return (
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
      <button onClick={() => router.push('/')} onMouseEnter={() => setHoveredNav('/')} onMouseLeave={() => setHoveredNav(null)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1, background: 'none', border: 'none', cursor: 'pointer', transform: hoveredNav === '/' ? 'scale(1.08)' : 'scale(1)', transition: 'transform 120ms ease' }}>
        <span style={{ fontSize: 18 }}>🏠</span>
        <span style={{ fontSize: 10, color: isActive('/') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive('/') ? 500 : 400 }}>主页</span>
        {isActive('/') && <div style={{ height: 2, width: 18, background: 'var(--accent)', borderRadius: 1 }} />}
      </button>

      <button onClick={() => router.push('/insights')} onMouseEnter={() => setHoveredNav('/insights')} onMouseLeave={() => setHoveredNav(null)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1, background: 'none', border: 'none', cursor: 'pointer', transform: hoveredNav === '/insights' ? 'scale(1.08)' : 'scale(1)', transition: 'transform 120ms ease' }}>
        <span style={{ fontSize: 18 }}>🧭</span>
        <span style={{ fontSize: 10, color: isActive('/insights') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive('/insights') ? 500 : 400 }}>洞察</span>
        {isActive('/insights') && <div style={{ height: 2, width: 18, background: 'var(--accent)', borderRadius: 1 }} />}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
        <button
          onClick={() => router.push('/story')}
          onMouseEnter={() => setHoveredNav('/story')}
          onMouseLeave={() => setHoveredNav(null)}
          style={{
            width: 48, height: 48, borderRadius: '50%',
            border: isActive('/story') ? '1.5px solid var(--accent)' : '1.5px solid #c8bfaa',
            background: 'var(--bg-page)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: -10, cursor: 'pointer',
            boxShadow: isActive('/story') ? '0 2px 8px rgba(29,158,117,0.2)' : '0 2px 8px rgba(0,0,0,0.09)',
            transform: hoveredNav === '/story' ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 120ms ease',
          }}
        >
          <div style={{ width: 34, height: 34, borderRadius: '50%', border: isActive('/story') ? '0.5px solid rgba(29,158,117,0.35)' : '0.5px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: isActive('/story') ? 'rgba(29,158,117,0.18)' : 'rgba(0,0,0,0.08)' }} />
          </div>
        </button>
        <span style={{ fontSize: 10, color: isActive('/story') ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: isActive('/story') ? 500 : 400, marginTop: 2 }}>印迹</span>
      </div>

      <button onClick={() => router.push('/meet')} onMouseEnter={() => setHoveredNav('/meet')} onMouseLeave={() => setHoveredNav(null)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1, background: 'none', border: 'none', cursor: 'pointer', transform: hoveredNav === '/meet' ? 'scale(1.08)' : 'scale(1)', transition: 'transform 120ms ease' }}>
        <span style={{ fontSize: 18 }}>✨</span>
        <span style={{ fontSize: 10, color: isActive('/meet') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive('/meet') ? 500 : 400 }}>遇见</span>
        {isActive('/meet') && <div style={{ height: 2, width: 18, background: 'var(--accent)', borderRadius: 1 }} />}
      </button>

      <button onClick={() => router.push('/vault')} onMouseEnter={() => setHoveredNav('/vault')} onMouseLeave={() => setHoveredNav(null)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1, background: 'none', border: 'none', cursor: 'pointer', transform: hoveredNav === '/vault' ? 'scale(1.08)' : 'scale(1)', transition: 'transform 120ms ease' }}>
        <span style={{ fontSize: 18 }}>🗺️</span>
        <span style={{ fontSize: 10, color: isActive('/vault') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive('/vault') ? 500 : 400 }}>领地</span>
        {isActive('/vault') && <div style={{ height: 2, width: 18, background: 'var(--accent)', borderRadius: 1 }} />}
      </button>
    </nav>
  )
}
