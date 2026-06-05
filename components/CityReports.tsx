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
    <div style={{
      background: 'var(--bg-card-2)',
      borderRadius: 10,
      padding: '1rem 1.1rem',
      marginBottom: 11,
      position: 'relative',
    }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(45,36,24,0.85)', color: '#fff',
          fontSize: 12, padding: '6px 14px', borderRadius: 20,
          whiteSpace: 'nowrap', zIndex: 10, pointerEvents: 'none',
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>城市深度报告</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>针对具体议题的付费深度内容</div>
        </div>
        <span style={{
          background: '#FAECE7',
          color: '#993C1D',
          fontSize: 10,
          padding: '2px 9px',
          borderRadius: 20,
          whiteSpace: 'nowrap',
          flexShrink: 0,
          marginLeft: 8,
          alignSelf: 'center',
        }}>
          付费解锁
        </span>
      </div>

      {/* Report list */}
      <div>
        {REPORTS.map((report, i) => (
          <div
            key={report.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              padding: '10px 0',
              borderTop: i > 0 ? '0.5px solid var(--border-light)' : 'none',
              opacity: report.status === 'coming-soon' ? 0.55 : 1,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>
                {report.title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{report.tags}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {report.status === 'available' ? (
                <>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#1D9E75' }}>{report.price}</span>
                  <button
                    onClick={() => handleUnlock(report)}
                    style={{
                      background: '#1D9E75',
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
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>即将上线</span>
                  <button
                    onClick={() => handleWaitlist(report)}
                    style={{
                      background: 'transparent',
                      color: '#1D9E75',
                      border: '0.5px solid #1D9E75',
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

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTop: '0.5px solid var(--border-light)',
      }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>
          查看全部 {REPORTS.length} 报告 →
        </span>
      </div>
    </div>
  )
}
