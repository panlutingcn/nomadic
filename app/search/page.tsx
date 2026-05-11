'use client'
export const runtime = 'edge'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { useUserProfile } from '@/hooks/useUserProfile'
import { CITIES, GLOBAL_COMMUNITIES, CityData } from '@/data/cities'
import { localSearch } from '@/lib/search'
import ShareSheet from '@/components/ShareSheet'
import CityCard from '@/components/cards/CityCard'
import LoginModal from '@/components/LoginModal'

type Phase = 'loading' | 'fuzzy' | 'ai-loading' | 'ai-done' | 'result' | 'error'

function SearchContent() {
  const params = useSearchParams()
  const router = useRouter()
  const { setSelectedCity, allPublicImprints, isCitySaved, toggleSaveCity } = useApp()
  const { user } = useAuth()
  const { nickname: profileNickname, avatarUrl: profileAvatar } = useUserProfile()
  const q = params.get('q') ?? ''

  const [phase, setPhase] = useState<Phase>('loading')
  const [cityData, setCityData] = useState<CityData | null>(null)
  const [fuzzySuggestions, setFuzzySuggestions] = useState<CityData[]>([])
  const [aiResults, setAiResults] = useState<{ city: string; reason: string }[]>([])
  const [activeTab, setActiveTab] = useState<'insights' | 'imprints'>('insights')
  const [shareAnchor, setShareAnchor] = useState<DOMRect | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const cityCardRef = useRef<HTMLDivElement>(null)

  const handleSave = () => {
    if (!cityData) return
    if (!user) { setShowLogin(true); return }
    toggleSaveCity(cityData.name, cityData.country)
  }

  useEffect(() => {
    if (!q) { setPhase('error'); return }
    setPhase('loading')
    setCityData(null)

    const local = localSearch(q)
    if (local !== null) {
      if (local.length === 0) { setPhase('error'); return }
      const top = local[0]
      if (top.confidence === 'exact') {
        setCityData(CITIES[top.city.name])
        setSelectedCity(top.city.name)
        setPhase('result')
      } else {
        setFuzzySuggestions(local.slice(0, 3).map(r => CITIES[r.city.name]).filter(Boolean))
        setPhase('fuzzy')
      }
      return
    }

    // AI search
    setPhase('ai-loading')
    fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q, cityList: Object.keys(CITIES) }),
    })
      .then(r => r.json())
      .then(data => {
        const recs = data.recommendations ?? []
        setAiResults(recs)
        if (recs[0]?.city && CITIES[recs[0].city]) {
          setCityData(CITIES[recs[0].city])
          setSelectedCity(recs[0].city)
          setPhase('result')
        } else {
          setPhase('ai-done')
        }
      })
      .catch(() => setPhase('error'))
  }, [q])

  const confirmCity = (city: CityData) => {
    setCityData(city)
    setSelectedCity(city.name)
    setPhase('result')
  }

  const relatedImprints = allPublicImprints.filter(i =>
    i.city.toLowerCase().includes(q.toLowerCase()) ||
    (cityData && i.city === cityData.name) ||
    i.title.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '12px 16px 10px' }}>

        {/* 搜索栏 + 收藏/分享按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <button onClick={() => router.back()} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>← 返回</button>
          <div style={{ flex: 1, background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 10, padding: '8px 12px', fontSize: 13, color: 'var(--text-primary)' }}>{q}</div>
          {phase === 'result' && cityData && (
            <>
              <button onClick={handleSave} style={{ width: 30, height: 30, border: '0.5px solid var(--border-light)', borderRadius: 7, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: isCitySaved(cityData.name) ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0 }}>
                {isCitySaved(cityData.name) ? '♥' : '♡'}
              </button>
              <button onClick={(e) => setShareAnchor(e.currentTarget.getBoundingClientRect())} aria-label="分享" style={{ width: 32, height: 30, border: '0.5px solid var(--border-light)', borderRadius: 8, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0 }}>⤴</button>
            </>
          )}
        </div>

        {/* 加载中 */}
        {(phase === 'loading' || phase === 'ai-loading') && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            {phase === 'ai-loading' ? '正在为你寻找最合适的城市……' : '搜索中…'}
          </div>
        )}

        {/* 模糊匹配 */}
        {phase === 'fuzzy' && (
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>你是否在找：</div>
            {fuzzySuggestions.map(city => (
              <button key={city.name} onClick={() => confirmCity(city)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 12, padding: '12px 14px', cursor: 'pointer', marginBottom: 8, textAlign: 'left' }}>
                <span style={{ fontSize: 20 }}>{city.flag}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{city.nameZh} · {city.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{city.countryZh}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* AI 推荐列表（多个结果时） */}
        {phase === 'ai-done' && (
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>AI 为你推荐</div>
            {aiResults.length > 0 ? aiResults.map(r => (
              <button key={r.city} onClick={() => CITIES[r.city] && confirmCity(CITIES[r.city])}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 12, padding: '12px 14px', cursor: 'pointer', marginBottom: 8, textAlign: 'left' }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{CITIES[r.city]?.nameZh || r.city}</span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 8 }}>{r.reason}</span>
              </button>
            )) : (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>暂未找到匹配城市，试试其他关键词</div>
            )}
          </div>
        )}

        {/* 错误 */}
        {phase === 'error' && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            暂未找到匹配结果，请换个说法试试
          </div>
        )}

        {/* 完整城市洞察 */}
        {phase === 'result' && cityData && (
          <>
            {/* 城市 header */}
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-primary)' }}>{cityData.name} {cityData.nameZh}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>{cityData.flag} {cityData.country} {cityData.countryZh}</div>
            </div>

            {/* Tab 切换 */}
            <div style={{ display: 'flex', borderBottom: '0.5px solid var(--border)', marginBottom: 14 }}>
              {[
                { key: 'insights' as const, label: '城市洞察' },
                { key: 'imprints' as const, label: `游民印迹（${relatedImprints.length}）` },
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  style={{
                    flex: 1, padding: '9px 0', fontSize: 13, fontWeight: 500,
                    color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-secondary)',
                    background: 'none', border: 'none',
                    borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
                    cursor: 'pointer',
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 城市洞察完整内容 */}
            {activeTab === 'insights' && (
              <>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, padding: '10px 10px', borderRadius: 7, background: '#fde4a0', border: '0.5px solid #c8a830', color: '#633806' }}>🌍 SOUL 城市灵魂</div>
                  <div style={{ background: '#fde4a0', border: '0.5px solid #c8a830', borderRadius: 10, padding: '9px 11px', marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#3d2010', marginBottom: 2 }}>{cityData.soul.headline}</div>
                    {'body' in cityData.soul && cityData.soul.body && (
                      <div style={{ fontSize: 10, color: '#3d2010', lineHeight: 1.55, marginTop: 5 }}>{cityData.soul.body}</div>
                    )}
                  </div>
                  <div style={{ background: '#fde4a0', border: '0.5px solid #c8a830', borderRadius: 10, padding: '10px 11px' }}>
                    {['personality', 'economy', 'festivals', 'figures'].map(key => {
                      const val = (cityData.soul as Record<string, string | undefined>)[key]
                      const labels: Record<string, string> = { personality: '文化性格', economy: '经济支柱', festivals: '节庆活动', figures: '代表人物' }
                      return val ? (
                        <div key={key} style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 500, color: '#854f0b', marginBottom: 4 }}>{labels[key]}</div>
                          <div style={{ fontSize: 10, color: '#3d2010', lineHeight: 1.6 }}>{val}</div>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, padding: '10px 10px', borderRadius: 7, background: '#d4ede0', border: '0.5px solid #9fd4b8', color: '#085041' }}>🌿 BASE 生存基准</div>
                  {'wifi' in cityData.base && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, marginBottom: 5 }}>
                        {[
                          { num: cityData.base.wifi, label: 'WiFi' },
                          { num: cityData.base.cost, label: '物价' },
                          { num: ('visaDays' in cityData.base && cityData.base.visaDays) ? cityData.base.visaDays : cityData.base.visa, label: '签证' },
                        ].map(item => (
                          <div key={item.label} style={{ background: '#d4ede0', border: '0.5px solid #9fd4b8', borderRadius: 8, padding: '7px 6px', textAlign: 'center' }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: '#085041' }}>{item.num}</div>
                            <div style={{ fontSize: 9, color: '#3a8a64', marginTop: 1 }}>{item.label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: '#d4ede0', border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '7px 10px', marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: '#085041', lineHeight: 1.5 }}>{cityData.base.welfare}</span>
                      </div>
                    </>
                  )}
                  <div style={{ background: '#d4ede0', border: '0.5px solid #9fd4b8', borderRadius: 10, padding: '10px 11px' }}>
                    {['visaDetail', 'dailyCost', 'safety', 'society'].map(key => {
                      const val = (cityData.base as Record<string, string | undefined>)[key]
                      const labels: Record<string, string> = { visaDetail: '签证政策', dailyCost: '每日花销', safety: '治安与安全', society: '社会运转' }
                      return val ? (
                        <div key={key} style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 500, color: '#085041', marginBottom: 4 }}>{labels[key]}</div>
                          <div style={{ fontSize: 10, color: '#085041', lineHeight: 1.6, whiteSpace: key === 'dailyCost' ? 'pre-line' : 'normal' }}>{val}</div>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, padding: '10px 10px', borderRadius: 7, background: '#c8dcf0', border: '0.5px solid #84b8d8', color: '#0c447c' }}>💼 CHANCE 商业机会</div>
                  <div style={{ background: '#c8dcf0', border: '0.5px solid #84b8d8', borderRadius: 10, padding: '9px 11px' }}>
                    <div style={{ fontSize: 10, color: '#0c447c', lineHeight: 1.55, marginBottom: 10 }}>{cityData.chance.paragraph}</div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: '#0c447c', marginBottom: 5 }}>📋 政策环境</div>
                      <a href={cityData.chance.policy.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#ddeaf8', border: '0.5px solid #84b8d8', textDecoration: 'none' }}>
                        <span style={{ fontSize: 11, color: '#185fa5' }}>{cityData.chance.policy.label}</span>
                        <span style={{ fontSize: 11, color: '#185fa5', flexShrink: 0, marginLeft: 6 }}>›</span>
                      </a>
                    </div>
                    {cityData.chance.localJobs.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 10, color: '#0c447c', marginBottom: 5 }}>🏢 本地招聘平台</div>
                        {cityData.chance.localJobs.map(j => (
                          <a key={j.name} href={j.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#ddeaf8', border: '0.5px solid #84b8d8', marginBottom: 5, textDecoration: 'none' }}>
                            <span style={{ fontSize: 11, color: '#185fa5' }}>{j.name}{'desc' in j && j.desc && <span style={{ color: '#3a7fc0', fontWeight: 400 }}> | {j.desc}</span>}</span>
                            <span style={{ fontSize: 11, color: '#185fa5', flexShrink: 0, marginLeft: 6 }}>›</span>
                          </a>
                        ))}
                      </div>
                    )}
                    {cityData.chance.remoteJobs.length > 0 && (
                      <div>
                        <div style={{ fontSize: 10, color: '#0c447c', marginBottom: 5 }}>🌐 全球远程平台</div>
                        {cityData.chance.remoteJobs.map(j => (
                          <a key={j.name} href={j.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#ddeaf8', border: '0.5px solid #84b8d8', marginBottom: 5, textDecoration: 'none' }}>
                            <span style={{ fontSize: 11, color: '#185fa5' }}>{j.name}</span>
                            <span style={{ fontSize: 11, color: '#185fa5', flexShrink: 0, marginLeft: 6 }}>›</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, padding: '10px 10px', borderRadius: 7, background: '#dbd2f0', border: '0.5px solid #b8a8e0', color: '#3c3489' }}>👥 LOCAL 本地圈子</div>
                  <div style={{ background: '#dbd2f0', border: '0.5px solid #b8a8e0', borderRadius: 10, padding: '9px 11px' }}>
                    {'paragraph' in cityData.local && cityData.local.paragraph && (
                      <div style={{ fontSize: 10, color: '#3d3020', lineHeight: 1.55, marginBottom: 10 }}>{cityData.local.paragraph}</div>
                    )}
                    {cityData.local.platforms.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 10, color: '#3c3489', marginBottom: 5 }}>📍 本地社群平台</div>
                        {cityData.local.platforms.map(p => (
                          <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#ece8f8', border: '0.5px solid #b8a8e0', marginBottom: 5, textDecoration: 'none' }}>
                            <span style={{ fontSize: 11, color: '#6b5bb5' }}>{p.name}{'desc' in p && p.desc && <span style={{ color: '#8b7bc8', fontWeight: 400 }}> | {p.desc}</span>}</span>
                            <span style={{ fontSize: 11, color: '#6b5bb5', flexShrink: 0, marginLeft: 6 }}>›</span>
                          </a>
                        ))}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: 10, color: '#3c3489', marginBottom: 5 }}>🌍 全球游民社群</div>
                      {GLOBAL_COMMUNITIES.map(c => (
                        <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#ece8f8', border: '0.5px solid #b8a8e0', marginBottom: 5, textDecoration: 'none' }}>
                          <span style={{ fontSize: 11, color: '#6b5bb5' }}>{c.name}{c.desc && <span style={{ color: '#8b7bc8', fontWeight: 400 }}> | {c.desc}</span>}</span>
                          <span style={{ fontSize: 11, color: '#6b5bb5', flexShrink: 0, marginLeft: 6 }}>›</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 游民印迹 Tab */}
            {activeTab === 'imprints' && (
              relatedImprints.length > 0
                ? relatedImprints.map(imp => (
                    <div key={imp.id} style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 12, padding: '11px 13px', marginBottom: 8 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>{CITIES[imp.city]?.nameZh || imp.city} · {imp.author ?? 'Nomadic 用户'}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{imp.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{imp.narrative?.slice(0, 60)}…</div>
                    </div>
                  ))
                : <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                    暂无 {cityData.nameZh} 的相关印迹
                  </div>
            )}
          </>
        )}
      </div>
      <div style={{ height: 32 }} />
      <BottomNav />

      {/* Hidden CityCard for share screenshot */}
      <div style={{ position: 'absolute', left: -9999, top: 0, pointerEvents: 'none' }}>
        <div ref={cityCardRef}>
          {phase === 'result' && cityData && (
            <CityCard
              nickname={profileNickname}
              avatarUrl={profileAvatar}
              cityNameZh={cityData.nameZh || ''}
              cityNameEn={cityData.name}
              countryZh={cityData.countryZh || ''}
              flag={cityData.flag || '🌍'}
              description={cityData.soul.body || ''}
              personality={'personality' in cityData.soul ? cityData.soul.personality : undefined}
              economy={'economy' in cityData.soul ? cityData.soul.economy : undefined}
              cityKey={cityData.name}
              qrValue={`https://nomadictree.io/search?q=${encodeURIComponent(cityData.nameZh || cityData.name)}`}
            />
          )}
        </div>
      </div>

      <ShareSheet
        anchorRect={shareAnchor}
        onClose={() => setShareAnchor(null)}
        cardRef={cityCardRef}
        showCopyLink={true}
        copyUrl={`https://nomadictree.io/search?q=${encodeURIComponent(q)}`}
      />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => { setShowLogin(false); if (cityData) toggleSaveCity(cityData.name, cityData.country) }}
          redirectPath={`/search?q=${encodeURIComponent(q)}`}
        />
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>加载中……</span>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
