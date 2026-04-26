'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'
import { CITIES, GLOBAL_COMMUNITIES } from '@/data/cities'

export default function InsightsPage() {
  const router = useRouter()
  const { selectedCity, isCitySaved, toggleSaveCity, searchContext, setSearchContext } = useApp()
  const city = CITIES[selectedCity] ?? {
    ...CITIES['Berlin'],
    name: selectedCity, nameZh: selectedCity,
    country: 'Unknown', countryZh: '未知地区', flag: '🌍', match: 75,
  }

  const [showLogin, setShowLogin] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'wechat' | 'email'>('wechat')
  const [loginEmail, setLoginEmail] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const relevant = searchContext?.relevantSections ?? []
  const isHighlighted = (section: string) => relevant.length > 0 && relevant.includes(section)

  const handleSave = () => {
    if (!isLoggedIn) { setShowLogin(true); return }
    toggleSaveCity(city.name, city.country)
  }

  const handleLoginConfirm = () => {
    setIsLoggedIn(true)
    setShowLogin(false)
    toggleSaveCity(city.name, city.country)
  }

  const handleBack = () => {
    setSearchContext(null)
    router.back()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '14px 16px 10px' }}>

        {searchContext && (
          <div style={{ background: 'linear-gradient(135deg, #e8f5ee 0%, #e8f0f5 100%)', border: '0.5px solid #9fd4b8', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: '#085041', marginBottom: 4 }}>✨ AI 为你找到了</div>
            <div style={{ fontSize: 11, color: '#0c447c', lineHeight: 1.5 }}>{searchContext.aiInsight}</div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <button onClick={handleBack} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 4 }}>← 返回</button>
            <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-primary)' }}>{city.name} {city.nameZh}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>{city.flag} {city.country} {city.countryZh}</div>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <button onClick={handleSave} style={{ width: 30, height: 28, border: '0.5px solid var(--border-light)', borderRadius: 7, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: isCitySaved(city.name) ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer' }}>
              {isCitySaved(city.name) ? '♥' : '♡'}
            </button>
            <button style={{ width: 30, height: 28, border: '0.5px solid var(--border-light)', borderRadius: 7, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer' }}>⤴</button>
          </div>
        </div>

        <div style={{ height: '0.5px', background: 'var(--border)', margin: '10px 0' }} />

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 6, paddingBottom: 5, borderBottom: '0.5px solid var(--border)' }}>🌍 SOUL 城市灵魂</div>
          <div style={{ background: isHighlighted('soul') ? '#e8f5ee' : '#faeeda', border: `0.5px solid ${isHighlighted('soul') ? '#9fd4b8' : '#e8c98a'}`, borderRadius: 10, padding: '9px 11px', boxShadow: isHighlighted('soul') ? '0 0 0 2px rgba(29,158,117,0.15)' : 'none' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#3d2010', marginBottom: 2 }}>{city.soul.headline}</div>
            <div style={{ fontSize: 10, color: '#854f0b' }}>{city.soul.sub} → 展开</div>
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 6, paddingBottom: 5, borderBottom: '0.5px solid var(--border)' }}>🌿 BASE 生存基准</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, boxShadow: isHighlighted('base') ? '0 0 0 2px rgba(29,158,117,0.15)' : 'none', borderRadius: 8 }}>
            {[
              { num: city.base.wifi, label: 'WiFi' },
              { num: city.base.cost, label: '物价' },
              { num: city.base.visa.split('天')[0] + (city.base.visa.includes('天') ? 'd' : ''), unit: city.base.visa.includes('申根') ? '申根' : city.base.visa.includes('落地') ? '落地签' : '', label: '签证' },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 8, padding: '7px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{item.num}</div>
                {'unit' in item && <div style={{ fontSize: 9, color: 'var(--text-secondary)' }}>{item.unit}</div>}
                <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 7, padding: '7px 10px', marginTop: 5 }}>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{city.base.welfare}</span>
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 6, paddingBottom: 5, borderBottom: '0.5px solid var(--border)' }}>💼 CHANCE 商业机会</div>
          <div style={{ background: isHighlighted('chance') ? '#e8f5ee' : 'var(--bg-card)', border: `0.5px solid ${isHighlighted('chance') ? '#9fd4b8' : 'var(--border-light)'}`, borderRadius: 10, padding: '9px 11px', boxShadow: isHighlighted('chance') ? '0 0 0 2px rgba(29,158,117,0.15)' : 'none' }}>
            <div style={{ fontSize: 10, color: '#3d3020', lineHeight: 1.55, marginBottom: 6 }}>{city.chance.paragraph}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', margin: '5px 0 3px' }}>📋 政策环境</div>
            <a href={city.chance.policy.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: 6, background: 'var(--bg-page)', border: '0.5px solid var(--border)', marginBottom: 6, textDecoration: 'none' }}>
              <span style={{ fontSize: 10, color: 'var(--accent-text)' }}>{city.chance.policy.label}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>›</span>
            </a>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', margin: '5px 0 3px' }}>🏢 本地招聘平台</div>
            {city.chance.localJobs.map(j => (
              <a key={j.name} href={j.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: 6, background: 'var(--bg-page)', border: '0.5px solid var(--border)', marginBottom: 3, textDecoration: 'none' }}>
                <span style={{ fontSize: 10, color: 'var(--accent-text)' }}>{j.name}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>›</span>
              </a>
            ))}
            <div style={{ fontSize: 9, color: 'var(--text-muted)', margin: '5px 0 3px' }}>🌐 全球远程平台</div>
            {city.chance.remoteJobs.map(j => (
              <a key={j.name} href={j.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: 6, background: 'var(--bg-page)', border: '0.5px solid var(--border)', marginBottom: 3, textDecoration: 'none' }}>
                <span style={{ fontSize: 10, color: 'var(--accent-text)' }}>{j.name}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>›</span>
              </a>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 6, paddingBottom: 5, borderBottom: '0.5px solid var(--border)' }}>👥 LOCAL 本地圈子</div>
          <div style={{ background: isHighlighted('local') ? '#e8f5ee' : '#f0edf8', border: `0.5px solid ${isHighlighted('local') ? '#9fd4b8' : '#cdc5e8'}`, borderRadius: 10, padding: '9px 11px', boxShadow: isHighlighted('local') ? '0 0 0 2px rgba(29,158,117,0.15)' : 'none' }}>
            <div style={{ fontSize: 9, color: '#3c3489', marginBottom: 3 }}>📍 本地社群平台</div>
            {city.local.platforms.map(p => (
              <a key={p.name} href={p.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: 6, background: '#ede9f8', border: '0.5px solid #cdc5e8', marginBottom: 3, textDecoration: 'none' }}>
                <span style={{ fontSize: 10, color: '#3c3489' }}>{p.name}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>›</span>
              </a>
            ))}
            <div style={{ fontSize: 9, color: '#3c3489', margin: '5px 0 3px' }}>🌍 全球游民社群</div>
            {GLOBAL_COMMUNITIES.map(c => (
              <a key={c.name} href={c.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: 6, background: '#ede9f8', border: '0.5px solid #cdc5e8', marginBottom: 3, textDecoration: 'none' }}>
                <span style={{ fontSize: 10, color: '#3c3489' }}>{c.name}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>›</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />

      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: 'var(--bg-page)', borderRadius: '18px 18px 0 0', padding: '24px 20px 36px' }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>登录后收藏城市</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button onClick={() => setLoginMethod('wechat')} style={{ flex: 1, padding: '7px', borderRadius: 8, border: `0.5px solid ${loginMethod === 'wechat' ? '#07C160' : 'var(--border-light)'}`, background: loginMethod === 'wechat' ? 'rgba(7,193,96,0.08)' : 'var(--bg-card)', fontSize: 12, color: loginMethod === 'wechat' ? '#07C160' : 'var(--text-secondary)', cursor: 'pointer' }}>微信登录</button>
              <button onClick={() => setLoginMethod('email')} style={{ flex: 1, padding: '7px', borderRadius: 8, border: `0.5px solid ${loginMethod === 'email' ? 'var(--accent)' : 'var(--border-light)'}`, background: loginMethod === 'email' ? 'var(--accent-dim)' : 'var(--bg-card)', fontSize: 12, color: loginMethod === 'email' ? 'var(--accent-text)' : 'var(--text-secondary)', cursor: 'pointer' }}>邮箱登录</button>
            </div>
            {loginMethod === 'wechat' ? (
              <button onClick={handleLoginConfirm} style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#07C160', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginBottom: 12 }}>微信一键登录</button>
            ) : (
              <>
                <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="输入你的邮箱" type="email"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid var(--border)', background: 'var(--bg-card)', fontSize: 12, color: 'var(--text-primary)', boxSizing: 'border-box', outline: 'none', marginBottom: 8 }} />
                <button onClick={handleLoginConfirm} style={{ width: '100%', padding: '11px', borderRadius: 12, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginBottom: 12 }}>确认登录</button>
              </>
            )}
            <button onClick={() => setShowLogin(false)} style={{ width: '100%', padding: '10px', borderRadius: 12, background: 'none', border: '0.5px solid var(--border-light)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>取消</button>
          </div>
        </div>
      )}
    </div>
  )
}
