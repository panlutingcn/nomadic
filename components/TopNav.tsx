'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import LoginModal from '@/components/LoginModal'

const TABS = [
  {
    path: '/',
    label: '探索世界',
    match: (p: string) => p === '/' || p.startsWith('/search') || p.startsWith('/insights'),
  },
  {
    path: '/meet',
    label: '旅行印迹',
    match: (p: string) => p === '/meet' || p.startsWith('/imprint') || p === '/story' || p.startsWith('/story/'),
  },
  {
    path: '/mine',
    label: '我的版图',
    match: (p: string) => p === '/mine' || p.startsWith('/mine/'),
  },
]

export default function TopNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profileNickname } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 500,
        height: 56,
        background: 'rgba(237,229,216,0.95)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '0.5px solid #d8cdb8',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
      }}>
        {/* Logo 侧 — flex:1 占位，手机端 logo 隐藏但占位保留，保证中间 tab 居中 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div
            onClick={() => router.push('/')}
            className="top-nav-logo"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <img src="/logo-nomadic-t.png" alt="Nomadic" style={{ height: 28, width: 'auto', display: 'block' }} />
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
                  background: hovered && !active ? 'rgba(45,36,24,0.04)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--accent-text)' : hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '6px 14px',
                  borderRadius: 8,
                  position: 'relative',
                  transition: 'color 150ms ease, background 150ms ease',
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
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--accent)', border: 'none',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 13, color: '#fff', fontWeight: 600,
              }}
            >
              {(profileNickname ?? user.email ?? '我')[0].toUpperCase()}
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              style={{
                background: 'var(--accent)', border: 'none',
                borderRadius: 18, padding: '6px 16px',
                cursor: 'pointer', fontSize: 13,
                color: '#fff', fontWeight: 500,
                whiteSpace: 'nowrap',
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
