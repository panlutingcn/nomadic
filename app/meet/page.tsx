'use client'
export const dynamic = 'force-static'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'

export default function MeetPage() {
  const router = useRouter()
  const { allPublicImprints } = useApp()
  const [activeCity, setActiveCity] = useState('全部')
  const cities = ['全部', 'Berlin', 'Amsterdam', 'Lisbon', 'Prague']
  const cityZh: Record<string, string> = { Berlin: '柏林', Amsterdam: '阿姆斯特丹', Lisbon: '里斯本', Prague: '布拉格', Tallinn: '塔林' }

  const filtered = (activeCity === '全部'
    ? allPublicImprints
    : allPublicImprints.filter(i => i.city === activeCity)
  ).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const photoBg: Record<string, string> = { Berlin: '#ede8df', Amsterdam: '#e8edf0', Lisbon: '#e8e2d8', Prague: '#e8e8ed' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '14px 0 10px' }}>
        <div style={{ textAlign: 'center', marginBottom: 14, padding: '0 16px' }}>
          <div style={{ fontSize: 17, fontWeight: 500, color: 'var(--text-primary)' }}>遇见</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>来自世界各地游民的印迹</div>
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 16px 12px', scrollbarWidth: 'none' }}>
          {cities.map(city => (
            <button key={city} onClick={() => setActiveCity(city)} style={{ fontSize: 11, fontWeight: 500, padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap', cursor: 'pointer', background: activeCity === city ? 'var(--accent)' : 'var(--bg-card)', color: activeCity === city ? '#fff' : 'var(--text-secondary)', border: activeCity === city ? 'none' : '0.5px solid var(--border-light)' }}>
              {city === '全部' ? '全部' : cityZh[city]}
            </button>
          ))}
          <button style={{ fontSize: 11, fontWeight: 500, padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap', cursor: 'pointer', background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '0.5px solid var(--border-light)' }}>更多</button>
        </div>

        <div style={{ padding: '0 16px' }}>
          {filtered.map(imp => (
            <div key={imp.id} onClick={() => router.push(`/imprint/${imp.id}`)} style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', cursor: 'pointer' }}>
              <div style={{ height: 110, background: photoBg[imp.city] ?? '#ede8df', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {imp.photo
                  ? <img src={imp.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 10, color: '#c8bfaa' }}>[ 照片 ]</span>
                }
                <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(245,240,232,0.92)', color: '#3d3020', fontSize: 10, fontWeight: 500, padding: '3px 9px', borderRadius: 8 }}>{cityZh[imp.city] ?? imp.city}</span>
              </div>
              <div style={{ padding: '11px 13px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#e8dfd0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 500, color: 'var(--text-secondary)' }}>{imp.author?.[1] ?? 'N'}</div>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{imp.author ?? 'Nomadic 用户'}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>{imp.createdAt}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 5, lineHeight: 1.4 }}>{imp.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{imp.narrative?.slice(0, 60)}…</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 8, borderTop: '0.5px solid #f0ebe2' }}>
                  {imp.tags?.slice(0, 2).map(tag => (
                    <span key={tag} style={{ fontSize: 10, background: 'var(--bg-page)', color: 'var(--text-secondary)', border: '0.5px solid var(--border)', padding: '2px 8px', borderRadius: 6 }}>{tag}</span>
                  ))}
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>♡ {imp.likes ?? 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
