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
            background: 'linear-gradient(135deg, #e8f5ee 0%, #f5faf7 100%)',
            border: '0.5px solid rgba(29,158,117,0.2)',
            borderRadius: 14,
            padding: '10px 14px',
            cursor: 'pointer',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 150ms ease',
            textAlign: 'center',
            width: 220,
          }}
        >
          <div style={{ fontSize: 16, marginBottom: 4 }}>📮</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1a5c3a', marginBottom: 2 }}>联系共创 Nomadic ✦</div>
          <div style={{ fontSize: 10, color: '#4a8c6a' }}>期待听到你的想法与故事</div>
        </div>
      </div>
      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </>
  )
}
