'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface WelcomeModalProps {
  nickname?: string
  onClose: () => void
}

export default function WelcomeModal({ nickname, onClose }: WelcomeModalProps) {
  const [userCount, setUserCount] = useState<number | null>(null)
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (window.location.hostname === 'localhost') return
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setUserCount(count))
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(onClose, 200)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10000,
        opacity: show ? 1 : 0,
        transition: 'opacity 200ms ease',
        padding: '0 20px',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(160deg, #f0ebe0 0%, #e8f5ee 100%)',
          borderRadius: 20,
          padding: '28px 24px',
          maxWidth: 340, width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          textAlign: 'center',
          transform: show ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 200ms ease',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 16 }}>🌍</div>
        <div style={{ fontSize: 14, color: '#3d3020', lineHeight: 1.8, marginBottom: 20 }}>
          {nickname ? <>Hi {nickname}，<br /></> : null}
          欢迎来到 Nomadic 此时此地！<br />
          {userCount !== null && (
            <>你是这里的第 <strong style={{ color: '#1D9E75' }}>{userCount}</strong> 位大旅行家。<br /></>
          )}
          我们一起探索这个世界吧！
        </div>
        <button
          onClick={handleClose}
          style={{ padding: '10px 24px', borderRadius: 10, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          开始探索 →
        </button>
      </div>
    </div>
  )
}
