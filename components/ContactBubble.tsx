'use client'
import { useState } from 'react'

export default function ContactBubble() {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, marginBottom: 40 }}>
      <a
        href="mailto:panluting.cn@gmail.com?subject=关于Nomadic"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          background: '#f0ebe0',
          borderRadius: 14,
          padding: '10px 16px',
          maxWidth: 280,
          cursor: 'pointer',
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 150ms ease',
          boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
          textDecoration: 'none',
          display: 'block',
        }}
      >
        {/* Bubble tail (left side) */}
        <div style={{
          position: 'absolute',
          left: -7,
          top: 14,
          width: 0,
          height: 0,
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderRight: '8px solid #f0ebe0',
        }} />
        <div style={{
          fontSize: 11,
          color: '#b8a98a',
          lineHeight: 1.6,
          textAlign: 'center',
        }}>
          <span style={{ fontWeight: 600, color: '#9a8a6a' }}>共创Nomadic</span><br />
          有建议、故事或合作意向？<br />
          欢迎来信✉️
        </div>
      </a>
    </div>
  )
}
