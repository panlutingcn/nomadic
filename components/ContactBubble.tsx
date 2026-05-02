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
            position: 'relative',
            width: 180,
            background: 'linear-gradient(135deg, #f0ebe0 0%, #e8e0d0 100%)',
            border: '1.5px solid #c8bfaa',
            borderRadius: 20,
            boxShadow: '0 4px 16px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.5)',
            padding: '12px 14px',
            cursor: 'pointer',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 150ms ease',
          }}
        >
          <div style={{ position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: '50%', background: 'rgba(29,158,117,0.5)' }} />
          <div style={{ position: 'absolute', top: 14, right: 22, width: 5, height: 5, borderRadius: '50%', background: 'rgba(29,158,117,0.3)' }} />
          <div style={{ fontSize: 12, fontWeight: 600, color: '#3d3020', marginBottom: 4 }}>联系共创 ✦</div>
          <div style={{ fontSize: 10, color: '#7a6a50', marginBottom: 8, lineHeight: 1.5 }}>期待听到你的想法与故事</div>
          <div style={{ fontSize: 11, color: '#1D9E75', fontWeight: 500 }}>给主创 Luna 写信 →</div>
        </div>
      </div>
      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </>
  )
}
