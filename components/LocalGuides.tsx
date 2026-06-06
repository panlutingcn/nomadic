'use client'
import { useState } from 'react'

interface Guide {
  id: string
  name: string
  city: string
  identity: string
  description: string
  tags: string[]
  price: string
  avatarBg: string
  avatarColor: string
}

const GUIDES: Guide[] = [
  {
    id: '1',
    name: '李明远',
    city: '柏林',
    identity: '餐饮创业者 · 在德7年',
    description: '开过两家餐厅，熟悉选址、执照、供应链',
    tags: ['餐饮创业', '德语环境', '签证'],
    price: '¥320 / 小时',
    avatarBg: '#E1F5EE',
    avatarColor: '#085041',
  },
  {
    id: '2',
    name: '王晓晴',
    city: '慕尼黑',
    identity: '自由职业设计师 · 在德5年',
    description: '专注远程工作落地，熟悉税务与社保',
    tags: ['自由职业', '税务规划', '远程工作'],
    price: '¥280 / 小时',
    avatarBg: '#EEEDF8',
    avatarColor: '#3C3489',
  },
]

interface LocalGuidesProps {
  city: string
}

export default function LocalGuides({ city: _city }: LocalGuidesProps) {
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  const handleBook = (guide: Guide) => {
    console.log('book guide:', guide.id)
    showToast('功能即将上线，敬请期待')
  }

  const handleApply = () => {
    console.log('apply as guide')
    showToast('申请通道即将开放，敬请期待')
  }

  return (
    <div style={{ position: 'relative' }}>
      {toast && (
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(45,36,24,0.85)', color: '#fff',
          fontSize: 12, padding: '6px 14px', borderRadius: 20,
          whiteSpace: 'nowrap', zIndex: 10, pointerEvents: 'none',
        }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {GUIDES.map(guide => (
          <GuideCard key={guide.id} guide={guide} onBook={handleBook} />
        ))}

        <div
          style={{
            background: 'rgba(255,255,255,0.3)',
            border: '0.5px solid rgba(255,255,255,0.5)',
            borderRadius: 12,
            padding: '1rem 1.1rem',
            display: 'flex',
            gap: 12,
            opacity: 0.7,
            transition: 'background 150ms ease, border-color 150ms ease, transform 150ms ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLDivElement
            el.style.background = 'rgba(255,255,255,0.42)'
            el.style.borderColor = 'rgba(255,255,255,0.75)'
            el.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLDivElement
            el.style.background = 'rgba(255,255,255,0.3)'
            el.style.borderColor = 'rgba(255,255,255,0.5)'
            el.style.transform = 'translateY(0)'
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#fff',
            flexShrink: 0,
          }}>
            +
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>更多在地向导即将上线</div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 10,
          padding: '0.875rem 1.1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
          transition: 'background 150ms ease, transform 150ms ease',
          cursor: 'default',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.background = 'rgba(255,255,255,0.20)'
          el.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.background = 'rgba(255,255,255,0.12)'
          el.style.transform = 'translateY(0)'
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#fff', marginBottom: 2 }}>
            想成为在地向导？
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>分享你的在地经验，接受付费咨询</div>
        </div>
        <button
          onClick={handleApply}
          className="insights-outline-btn"
          style={{
            background: 'transparent',
            border: '0.5px solid rgba(255,255,255,0.55)',
            color: '#fff',
            borderRadius: 8,
            padding: '8px 18px',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            flexShrink: 0,
            marginLeft: 12,
          }}
        >
          申请加入
        </button>
      </div>
    </div>
  )
}

function GuideCard({ guide, onBook }: { guide: Guide; onBook: (g: Guide) => void }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.92)',
        border: '0.5px solid rgba(255,255,255,0.8)',
        borderRadius: 12,
        padding: '1rem 1.1rem',
        display: 'flex',
        gap: 12,
        cursor: 'pointer',
        transition: 'border-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = '#178f68'
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(255,255,255,0.8)'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: guide.avatarBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, fontWeight: 500,
        color: guide.avatarColor,
        flexShrink: 0,
      }}>
        {guide.name[0]}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
          {guide.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>
          {guide.city} · {guide.identity}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
          {guide.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 10,
              background: 'var(--bg-card-2)',
              color: 'var(--text-secondary)',
              padding: '2px 8px',
              borderRadius: 4,
            }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#178f68' }}>{guide.price}</div>
      </div>

      <button
        onClick={e => { e.stopPropagation(); onBook(guide) }}
        className="insights-action-btn"
        style={{
          background: '#178f68',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '8px 18px',
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          alignSelf: 'center',
          flexShrink: 0,
        }}
      >
        预约
      </button>
    </div>
  )
}
