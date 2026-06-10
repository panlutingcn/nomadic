'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import LoginModal from '@/components/LoginModal'

const TABS = [
  {
    path: '/',
    label: '出发',
    match: (p: string) => p === '/' || p.startsWith('/search'),
  },
  {
    path: '/insights',
    label: '洞察',
    match: (p: string) => p.startsWith('/insights'),
  },
  {
    path: '/meet',
    label: '到达',
    match: (p: string) => p === '/meet' || p.startsWith('/imprint') || p === '/story' || p.startsWith('/story/'),
  },
  {
    path: '/mine',
    label: '版图',
    match: (p: string) => p === '/mine' || p.startsWith('/mine/'),
  },
]

export default function TopNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profileNickname } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [hoveredLogin, setHoveredLogin] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 500,
        height: 56,
        background: scrolled ? 'rgba(255,253,249,0.68)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '0.5px solid rgba(255,248,228,0.70)' : 'none',
        boxShadow: scrolled ? '0 1px 16px rgba(180,150,90,0.08), inset 0 -1px 0 rgba(255,255,255,0.55)' : 'none',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        transition: 'background 300ms ease, backdrop-filter 300ms ease, border-bottom 300ms ease, box-shadow 300ms ease',
      }}>
        {/* Logo 侧 — flex:1 占位，手机端 logo 隐藏但占位保留，保证中间 tab 居中 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div
            onClick={() => router.push('/')}
            className="top-nav-logo"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <img src="/logo-nomadic-t.png" alt="Nomadic" style={{ height: 'clamp(18px, calc(28px * 100vw / 592px), 28px)', width: 'auto', display: 'block', filter: 'brightness(0) saturate(100%) invert(44%) sepia(63%) saturate(500%) hue-rotate(121deg) brightness(72%)' }} />
          </div>
        </div>

        {/* Tabs — 自然宽度，两侧 flex:1 等宽，旅行印迹永远对齐页面中心 */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
          {TABS.map(tab => {
            const active = tab.match(pathname)
            const hovered = hoveredTab === tab.path
            return (
              <button
                key={tab.path}
                onClick={() => router.push(tab.path)}
                onMouseEnter={() => setHoveredTab(tab.path)}
                onMouseLeave={() => setHoveredTab(null)}
                style={{
                  background: 'transparent',
                  backdropFilter: 'none',
                  WebkitBackdropFilter: 'none',
                  boxShadow: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? '#178f68' : hovered ? 'var(--text-primary)' : 'rgba(45,36,24,0.75)',
                  padding: '6px 14px',
                  borderRadius: 10,
                  position: 'relative',
                  transform: hovered ? 'scale(1.10)' : 'scale(1)',
                  transition: 'color 150ms ease, transform 150ms ease',
                  lineHeight: 1.5,
                }}
              >
                {tab.label}
                {active && (
                  <span style={{
                    position: 'absolute',
                    bottom: 2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 18,
                    height: 2,
                    background: 'var(--accent)',
                    borderRadius: 1,
                    display: 'block',
                  }} />
                )}
              </button>
            )
          })}
        </nav>

        {/* Login 侧 — flex:1 占位，内容靠右 */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {user ? (
            <button
              onClick={() => router.push('/mine')}
              onMouseEnter={() => setHoveredLogin(true)}
              onMouseLeave={() => setHoveredLogin(false)}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--accent)', border: 'none',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 13, color: '#fff', fontWeight: 600,
                transform: hoveredLogin ? 'scale(1.10)' : 'scale(1)',
                boxShadow: hoveredLogin ? '0 4px 14px rgba(23,143,104,0.40)' : '0 2px 6px rgba(23,143,104,0.25)',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
              }}
            >
              {(profileNickname ?? user.email ?? '我')[0].toUpperCase()}
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              onMouseEnter={() => setHoveredLogin(true)}
              onMouseLeave={() => setHoveredLogin(false)}
              style={{
                background: hoveredLogin
                  ? 'linear-gradient(135deg, #2ec990 0%, #178f68 100%)'
                  : 'var(--accent)',
                border: 'none',
                borderRadius: 18, padding: '6px 16px',
                cursor: 'pointer', fontSize: 13,
                color: '#fff', fontWeight: 500,
                whiteSpace: 'nowrap',
                transform: hoveredLogin ? 'scale(1.05) translateY(-1px)' : 'scale(1)',
                boxShadow: hoveredLogin
                  ? '0 6px 18px rgba(23,143,104,0.40), inset 0 1px 0 rgba(255,255,255,0.25)'
                  : '0 2px 8px rgba(23,143,104,0.28)',
                transition: 'transform 150ms ease, box-shadow 150ms ease, background 150ms ease',
              }}
            >
              登录
            </button>
          )}
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}
