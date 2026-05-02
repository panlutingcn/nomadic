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
            borderRadius: 12,
            padding: '8px 12px',
            cursor: 'pointer',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 150ms ease',
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0 }}>📮</span>
          <span style={{ fontSize: 11, color: '#5a4a30', whiteSpace: 'nowrap' }}>联系共创Nomadic ✦</span>
        </div>
      </div>
      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </>
  )
}
