'use client'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'

export default function VaultPage() {
  const router = useRouter()
  const { savedCities, imprints, setSelectedCity } = useApp()
  const cityZh: Record<string, string> = { Berlin: '柏林', Amsterdam: '阿姆斯特丹', Lisbon: '里斯本', Prague: '布拉格', Tallinn: '塔林' }

  const handleViewInsights = (cityName: string) => {
    setSelectedCity(cityName)
    router.push('/insights')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '14px 16px 10px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 14, padding: '12px 14px', marginBottom: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 500, color: 'var(--accent)', flexShrink: 0 }}>N</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Nomadic 用户</div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 3 }}>{savedCities.length} 个城市 · {imprints.length} 个印迹</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>收藏夹</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{savedCities.length} 个城市</span>
        </div>
        {savedCities.length === 0 ? (
          <div onClick={() => router.push('/')} style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0', cursor: 'pointer' }}>还没有收藏的城市，去探索吧 ›</div>
        ) : (
          <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '10px 12px', marginBottom: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>我的城市收藏</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {savedCities.map(city => (
                <button key={city.name} onClick={() => handleViewInsights(city.name)} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 8, background: 'var(--accent-dim)', color: 'var(--accent-text)', border: '0.5px solid var(--accent-border)', cursor: 'pointer' }}>{cityZh[city.name] ?? city.name}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{ height: '0.5px', background: 'var(--border)', margin: '10px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>我的印迹</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{imprints.length} 个 · 最新在前</span>
        </div>
        {imprints.length === 0 ? (
          <div onClick={() => router.push('/story')} style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0', cursor: 'pointer' }}>还没有留下印迹，按下快门开始吧 ›</div>
        ) : imprints.map(imp => (
          <div key={imp.id} onClick={() => router.push(`/imprint/${imp.id}`)} style={{ display: 'flex', gap: 10, background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.03)', cursor: 'pointer' }}>
            <div style={{ width: 72, height: 64, background: 'var(--bg-card-2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {imp.photo
                ? <img src={imp.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 9, color: '#c8bfaa' }}>照片</span>
              }
            </div>
            <div style={{ padding: '8px 10px 8px 0', flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 6, fontWeight: 500, background: imp.isPublic ? 'rgba(29,158,117,0.1)' : '#f0ebe2', color: imp.isPublic ? 'var(--accent-text)' : 'var(--text-secondary)', border: `0.5px solid ${imp.isPublic ? 'rgba(29,158,117,0.2)' : 'var(--border-light)'}` }}>
                  {imp.isPublic ? '公开' : '私藏'}
                </span>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{cityZh[imp.city] ?? imp.city}</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>{imp.title}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.45 }}>{imp.narrative?.slice(0, 30)}…</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'right', marginTop: 3 }}>{imp.createdAt}</div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  )
}
