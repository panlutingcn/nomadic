'use client'
import { useState } from 'react'

interface Report {
  id: string
  title: string
  tags: string
  price: string
  status: 'available' | 'coming-soon'
}

const REPORTS: Report[] = [
  {
    id: '1',
    title: '2026年在柏林开咖啡馆的真实成本',
    tags: '租金 · 执照 · 人力 · 盈利周期 · 避坑指南',
    price: '¥98',
    status: 'available',
  },
  {
    id: '2',
    title: '慕尼黑自由职业者税务结构完全指南',
    tags: '注册 · 报税 · 扣除项 · 实际到手收入',
    price: '¥88',
    status: 'available',
  },
  {
    id: '3',
    title: '柏林科技圈求职：2026年最新岗位生态',
    tags: '即将上线 · 加入候补名单',
    price: '',
    status: 'coming-soon',
  },
]

interface CityReportsProps {
  city: string
}

export default function CityReports({ city: _city }: CityReportsProps) {
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  const handleUnlock = (report: Report) => {
    console.log('unlock report:', report.id)
    showToast('功能即将上线，敬请期待')
  }

  const handleWaitlist = (report: Report) => {
    console.log('waitlist report:', report.id)
    showToast('已记录候补，上线时第一时间通知')
  }

  return (
    <div style={{ position: 'relative' }}>
      {toast && (
        <div style={{
          position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(45,36,24,0.85)', color: '#fff',
          fontSize: 12, padding: '6px 14px', borderRadius: 20,
          whiteSpace: 'nowrap', zIndex: 10, pointerEvents: 'none',
        }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {REPORTS.map((report) => (
          <div
            key={report.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.92)',
              borderRadius: 8,
              opacity: report.status === 'coming-soon' ? 0.65 : 1,
              transition: 'transform 150ms ease, box-shadow 150ms ease, background 150ms ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(-2px)'
              el.style.background = 'rgba(255,255,255,1)'
              el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(0)'
              el.style.background = 'rgba(255,255,255,0.92)'
              el.style.boxShadow = 'none'
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#0d2e1c', marginBottom: 3 }}>
                {report.title}
              </div>
              <div style={{ fontSize: 11, color: '#4a7a5e' }}>{report.tags}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {report.status === 'available' ? (
                <>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#178f68' }}>{report.price}</span>
                  <button
                    onClick={() => handleUnlock(report)}
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
                    }}
                  >
                    解锁
                  </button>
                </>
              ) : (
                <>
                  <span style={{ fontSize: 12, color: '#4a7a5e' }}>即将上线</span>
                  <button
                    onClick={() => handleWaitlist(report)}
                    className="insights-outline-btn"
                    style={{
                      background: 'transparent',
                      color: '#fff',
                      border: '0.5px solid rgba(255,255,255,0.55)',
                      borderRadius: 8,
                      padding: '8px 18px',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    候补
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
          查看全部 {REPORTS.length} 报告 →
        </span>
      </div>
    </div>
  )
}
