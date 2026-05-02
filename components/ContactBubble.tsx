'use client'
import { useState } from 'react'
import ContactModal from './ContactModal'

export default function ContactBubble() {
  const [showModal, setShowModal] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, marginBottom: 40 }}>
        <div
          onClick={() => setShowModal(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '0.5px solid rgba(200,191,170,0.5)',
            borderRadius: 14,
            padding: '10px 14px',
            width: 220,
            cursor: 'pointer',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 150ms ease',
          }}
        >
          <span style={{ fontSize: 16, flexShrink: 0 }}>📮</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#3d3020', marginBottom: 2 }}>联系共创 Nomadic ✦</div>
            <div style={{ fontSize: 10, color: '#7a6a50' }}>期待听到你的想法与故事</div>
          </div>
        </div>
      </div>
      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </>
  )
}
