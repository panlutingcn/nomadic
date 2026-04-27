'use client'
import { useState } from 'react'
import ContactModal from './ContactModal'

export default function ContactBubble() {
  const [showModal, setShowModal] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <>
      {/* Chat bubble entry point */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, marginBottom: 32 }}>
        <div
          onClick={() => setShowModal(true)}
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
            这是旅行者Luna用代码写给自己的情书。<br />
            如果它也触动了你，欢迎来信交流 ✉️
          </div>
        </div>
      </div>

      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </>
  )
}
