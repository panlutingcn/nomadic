'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ContactModal from './ContactModal'
import LoginModal from './LoginModal'

export default function BottomBubbles() {
  const router = useRouter()
  const { user } = useAuth()
  const [showContact, setShowContact] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [hoveredLeft, setHoveredLeft] = useState(false)
  const [hoveredRight, setHoveredRight] = useState(false)

  const bubbleBase: React.CSSProperties = {
    flex: 1,
    position: 'relative',
    background: '#ede8df',
    borderRadius: 14,
    padding: '10px 14px',
    cursor: 'pointer',
    transition: 'transform 150ms ease, box-shadow 150ms ease',
    border: '1px solid #ddd5c5',
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 10, padding: '32px 16px 40px' }}>
        {/* Left bubble: contact */}
        <div
          onClick={() => setShowContact(true)}
          onMouseEnter={() => setHoveredLeft(true)}
          onMouseLeave={() => setHoveredLeft(false)}
          style={{
            ...bubbleBase,
            transform: hoveredLeft ? 'scale(1.03)' : 'scale(1)',
            boxShadow: hoveredLeft ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          <div style={{
            position: 'absolute', left: -7, top: 14,
            width: 0, height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderRight: '7px solid #ede8df',
          }} />
          <div style={{ fontSize: 11, fontWeight: 600, color: '#7a6a50', marginBottom: 3 }}>联系共创</div>
          <div style={{ fontSize: 10, color: '#b8a98a', lineHeight: 1.5 }}>期待听到你的声音</div>
        </div>

        {/* Right bubble: login / user */}
        <div
          onClick={() => user ? router.push('/vault') : setShowLogin(true)}
          onMouseEnter={() => setHoveredRight(true)}
          onMouseLeave={() => setHoveredRight(false)}
          style={{
            ...bubbleBase,
            transform: hoveredRight ? 'scale(1.03)' : 'scale(1)',
            boxShadow: hoveredRight ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          <div style={{
            position: 'absolute', right: -7, top: 14,
            width: 0, height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '7px solid #ede8df',
          }} />
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>
                  {((user.user_metadata?.nickname || user.email || '?')[0] ?? '?').toUpperCase()}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#7a6a50' }}>我的领地</div>
              </div>
              <div style={{ fontSize: 10, color: '#b8a98a', lineHeight: 1.5, marginTop: 3 }}>查看你的全球版图</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#7a6a50', marginBottom: 3 }}>登录账号</div>
              <div style={{ fontSize: 10, color: '#b8a98a', lineHeight: 1.5 }}>解锁你的全球版图</div>
            </>
          )}
        </div>
      </div>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} redirectPath="/" />}
    </>
  )
}
