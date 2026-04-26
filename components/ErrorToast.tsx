'use client'
import { useEffect, useState } from 'react'

interface ErrorToastProps {
  message: string
  onClose: () => void
}

export default function ErrorToast({ message, onClose }: ErrorToastProps) {
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
      background: 'rgba(0, 0, 0, 0.85)',
      color: '#fff',
      padding: '16px 24px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 500,
      zIndex: 9999,
      opacity,
      transition: 'opacity 300ms ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      {message}
    </div>
  )
}
