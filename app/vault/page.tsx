'use client'
export const dynamic = 'force-static'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { CITIES } from '@/data/cities'
import BottomNav from '@/components/BottomNav'

function daysLeft(deletedAt: string): number {
  const ms = 3 * 24 * 60 * 60 * 1000 - (Date.now() - new Date(deletedAt).getTime())
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)))
}

export default function VaultPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { trashedImprints, restoreImprint, permanentlyDeleteImprint } = useApp()

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '14px 16px 12px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button onClick={() => router.back()}
            style={{ fontSize: 11, color: '#8a7a62', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            ← 返回
          </button>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#2d2418' }}>垃圾桶</span>
          <div style={{ width: 40 }} />
        </div>

        <div style={{ fontSize: 11, color: '#b8a98a', marginBottom: 16, textAlign: 'center' }}>
          印迹删除后 3 天内可恢复，之后将永久清除
        </div>

        {!user ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#b8a98a', fontSize: 13 }}>
            登录后查看已删除的印迹
          </div>
        ) : trashedImprints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🗑️</div>
            <div style={{ fontSize: 13, color: '#b8a98a' }}>垃圾桶是空的</div>
          </div>
        ) : (
          trashedImprints.map(imp => {
            const remaining = daysLeft(imp.deletedAt!)
            return (
              <div key={imp.id} style={{ background: '#fff', border: '0.5px solid #e2d9c8', borderRadius: 12, overflow: 'hidden', marginBottom: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: 68, flexShrink: 0, background: '#ede8df', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 60 }}>
                    {imp.photo
                      ? <img src={imp.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 9, color: '#c8bfaa' }}>图片</span>}
                  </div>
                  <div style={{ padding: '9px 11px', flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#2d2418', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3 }}>
                      {imp.title}
                    </div>
                    <div style={{ fontSize: 10, color: '#b8a98a', marginBottom: 3 }}>
                      {CITIES[imp.city]?.nameZh || imp.city} · {imp.createdAt}
                    </div>
                    <div style={{ fontSize: 10, color: remaining <= 1 ? '#c04040' : '#b8952a' }}>
                      {remaining <= 0 ? '即将永久删除' : `还剩 ${remaining} 天自动清除`}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', borderTop: '0.5px solid #f0ebe2' }}>
                  <button
                    onClick={() => restoreImprint(imp.id)}
                    style={{ flex: 1, padding: '10px 0', background: 'none', border: 'none', fontSize: 12, color: '#1D9E75', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                    恢复
                  </button>
                  <div style={{ width: '0.5px', background: '#f0ebe2' }} />
                  <button
                    onClick={() => permanentlyDeleteImprint(imp.id)}
                    style={{ flex: 1, padding: '10px 0', background: 'none', border: 'none', fontSize: 12, color: '#c04040', cursor: 'pointer', fontFamily: 'inherit' }}>
                    彻底删除
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div style={{ height: 32 }} />
      <BottomNav />
    </div>
  )
}
