'use client'
import { useEffect, useState } from 'react'

interface GuideModalProps {
  onClose: () => void
}

export default function GuideModal({ onClose }: GuideModalProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      localStorage.setItem('hasSeenGuide', 'true')
      onClose()
    }, 200)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9998,
      opacity: show ? 1 : 0,
      transition: 'opacity 200ms ease'
    }} onClick={handleClose}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '320px',
        width: '90%',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        position: 'relative',
        transform: show ? 'scale(1)' : 'scale(0.95)',
        transition: 'transform 200ms ease'
      }} onClick={e => e.stopPropagation()}>
        <button onClick={handleClose} style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          fontSize: '20px',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          padding: '4px',
          lineHeight: 1
        }}>×</button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '12px' }}>
            欢迎来到 Nomadic 🌍
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            在搜索框输入你想去的城市，<br/>
            或描述你的旅居想法，<br/>
            我们会为你找到最合适的目的地。
          </div>
          <button onClick={handleClose} style={{
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            知道了
          </button>
        </div>
      </div>
    </div>
  )
}
