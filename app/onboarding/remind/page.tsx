'use client'
export const dynamic = 'force-static'
import { useRouter } from 'next/navigation'

export default function RemindPage() {
  const router = useRouter()

  const goTest = () => router.push('/onboarding')
  const goLater = () => {
    sessionStorage.setItem('nomadic_skip_remind_session', 'true')
    router.replace('/')
  }
  const neverRemind = () => {
    localStorage.setItem('nomadic_never_remind', 'true')
    router.replace('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🧭</div>
        <div style={{ fontSize: 20, fontWeight: 500, color: '#2d2418', marginBottom: 8 }}>还没完成旅行人格测试</div>
        <div style={{ fontSize: 13, color: '#8a7a62', lineHeight: 1.7, marginBottom: 28 }}>
          完成 16 道题，解锁专属城市推荐<br/>和你在 Nomadic 社区的旅行者身份标签。
        </div>
        <button onClick={goTest} style={{ width: '100%', padding: '13px 0', borderRadius: 12, background: '#1D9E75', border: 'none', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer', marginBottom: 10 }}>
          现在去完成测试
        </button>
        <button onClick={goLater} style={{ width: '100%', padding: '12px 0', borderRadius: 12, background: 'transparent', border: '0.5px solid #ddd4c0', color: '#8a7a62', fontSize: 14, cursor: 'pointer', marginBottom: 14 }}>
          稍后再说
        </button>
        <button onClick={neverRemind} style={{ background: 'none', border: 'none', fontSize: 13, color: '#b8a98a', textDecoration: 'underline', cursor: 'pointer' }}>
          以后不再提醒
        </button>
        <div style={{ height: 0.5, background: '#e2d9c8', margin: '20px 0 14px' }} />
        <div style={{ fontSize: 12, color: '#b8a98a', marginBottom: 10 }}>或者先看看这些城市</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['里斯本', '柏林', '布拉格', '塔林'].map(city => (
            <button key={city} onClick={goLater} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, background: '#fff', color: '#2d2418', border: '0.5px solid #ddd4c0', cursor: 'pointer' }}>
              {city}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: 32 }} />
    </div>
  )
}
