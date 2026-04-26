'use client'
import { useEffect, useState } from 'react'

interface ErrorToastProps {
  onClose: () => void
}

export default function ErrorToast({ onClose }: ErrorToastProps) {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0)
      setTimeout(onClose, 300)
    }, 1000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(255, 255, 255, 0.72)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(0,0,0,0.08)',
      color: 'var(--text-primary)',
      padding: '14px 22px',
      borderRadius: '14px',
      fontSize: '13px',
      fontWeight: 500,
      zIndex: 9999,
      opacity,
      transition: 'opacity 300ms ease',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      pointerEvents: 'none',
    }}>
      哎呀没有理解你
    </div>
  )
}
