'use client'
export const dynamic = 'force-static'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { CITIES } from '@/data/cities'
import { getBodyText } from '@/lib/imprintUtils'
import BottomNav from '@/components/BottomNav'

const CITY_FILTERS = [
  { en: '全部', zh: '全部' },
  { en: 'Berlin', zh: '柏林' },
  { en: 'Lisbon', zh: '里斯本' },
  { en: 'Prague', zh: '布拉格' },
  { en: 'Amsterdam', zh: '阿姆斯特丹' },
  { en: 'Florence', zh: '佛罗伦萨' },
]

const photoBg: Record<string, string> = { Berlin: '#dde8d8', Lisbon: '#e8e2d8', Amsterdam: '#d8e0e8', Prague: '#e8e8ed', Florence: '#ede2d8' }

export default function MeetPage() {
  const router = useRouter()
  const { allPublicImprints } = useApp()
  const [activeCity, setActiveCity] = useState('全部')

  const filtered = activeCity === '全部'
    ? allPublicImprints
    : allPublicImprints.filter(i => i.city === activeCity)

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8' }}>
      <div style={{ padding: '16px 16px 0', textAlign: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 500, color: '#2d2418' }}>遇见社区</div>
        <div style={{ fontSize: 12, color: '#b8a98a', marginTop: 4 }}>来自世界各地游民的印迹</div>
      </div>

      {/* 城市筛选（中文） */}
      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '0 16px 14px', scrollbarWidth: 'none' }}>
        {CITY_FILTERS.map(city => (
          <button key={city.en} onClick={() => setActiveCity(city.en)}
            style={{ fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 20, whiteSpace: 'nowrap', cursor: 'pointer', background: activeCity === city.en ? '#1D9E75' : '#fff', color: activeCity === city.en ? '#fff' : '#8a7a62', border: activeCity === city.en ? 'none' : '0.5px solid #e2d9c8', flexShrink: 0 }}>
            {city.zh}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px 80px' }}>
        {filtered.map(imp => (
          <div key={imp.id} onClick={() => router.push(`/imprint/${imp.id}`)} style={{ background: '#fff', border: '0.5px solid #e2d9c8', borderRadius: 16, overflow: 'hidden', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', cursor: 'pointer' }}>
            <div style={{ height: 130, background: photoBg[imp.city] ?? '#ede8df', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {imp.photo ? <img src={imp.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 11, color: '#c8bfaa' }}>[ 照片 ]</span>}
              {/* 城市标签使用中文 */}
              <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(245,240,232,0.92)', color: '#3d3020', fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 8 }}>
                {CITIES[imp.city]?.nameZh || imp.city}
              </span>
            </div>
            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#e8dfd0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#8a7a62' }}>{(imp.author?.replace(/^@/, '') ?? 'N')[0].toUpperCase()}</div>
                <span style={{ fontSize: 11, color: '#8a7a62' }}>{imp.author ? (imp.author.startsWith('@') ? imp.author : `@${imp.author}`) : '@Nomadic 用户'}</span>
                <span style={{ fontSize: 11, color: '#b8a98a', marginLeft: 'auto' }}>{imp.createdAt}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#2d2418', lineHeight: 1.4, marginBottom: 6 }}>{imp.title}</div>
              <div style={{ fontSize: 12, color: '#8a7a62', lineHeight: 1.6 }}>{getBodyText(imp.narrative ?? '', imp.title).slice(0, 60)}…</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 8, borderTop: '0.5px solid #f0ebe2' }}>
                {imp.tags?.slice(0, 3).map(tag => (
                  <span key={tag} style={{ fontSize: 11, background: '#f5f0e8', color: '#8a7a62', border: '0.5px solid #e2d9c8', padding: '2px 8px', borderRadius: 6 }}>{tag}</span>
                ))}
                <span style={{ fontSize: 11, color: '#b8a98a', marginLeft: 'auto' }}>♡ {imp.likes ?? 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 32 }} />
      <BottomNav />
    </div>
  )
}
