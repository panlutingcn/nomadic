'use client'
// insights page
export const dynamic = 'force-static'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { CITIES, GLOBAL_COMMUNITIES } from '@/data/cities'
import { CITY_SAFETY_LINKS } from '@/data/safetyData'
import { CITY_EXPERIENCE_LINKS } from '@/data/experienceData'
import ShareSheet from '@/components/ShareSheet'
import LoginModal from '@/components/LoginModal'
import CityCard from '@/components/cards/CityCard'
import { useUserProfile } from '@/hooks/useUserProfile'
import CityReports from '@/components/CityReports'
import LocalGuides from '@/components/LocalGuides'
import { localSearch } from '@/lib/search'
import { SearchContext } from '@/context/AppContext'

// Custom hook for Escape key handling with stable callback reference
function useEscapeKey(isOpen: boolean, onClose: () => void) {
  const callbackRef = useRef(onClose)

  useEffect(() => {
    callbackRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') callbackRef.current()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])
}

export default function InsightsPage() {
  const router = useRouter()
  const { selectedCity, setSelectedCity, isCitySaved, toggleSaveCity, searchContext, setSearchContext } = useApp()

  // Generic placeholder when no city selected
  const PLACEHOLDER_CITY = {
    name: '世界上的某个城市',
    nameZh: '',
    country: '世界上的某个国家',
    countryZh: '',
    flag: '🌍',
    match: 0,
    soul: {
      headline: '每座城市都有自己的故事。',
      body: '选择一座城市，开始探索它的落地指南、文化内核、本地社区和商业机会。',
      sub: '文化 · 生活 · 工作',
      personality: '选择具体城市查看文化性格。',
      economy: '选择具体城市查看经济支柱。',
      festivals: '选择具体城市查看节庆活动。',
      figures: '选择具体城市查看代表人物。',
    },
    landing: {
      visaDetail: '选择具体城市查看签证政策。',
      dailyCost: '选择具体城市查看每日花销。',
      housing: '选择具体城市查看住房租房信息。',
      safety: '选择具体城市查看治安安全信息。',
      society: '选择具体城市查看社会运转情况。'
    },
    chance: {
      paragraph: '每座城市都有独特的商业生态和机会。',
      policy: { label: '选择城市查看商业支持政策', url: '#' },
      localJobs: [],
      remoteJobs: []
    },
    community: {
      paragraph: '无论你选择哪座城市，都能找到志同道合的旅居者与社群网络。',
      platforms: []
    }
  }

  // Three scenarios logic
  const hasSelection = selectedCity && (selectedCity in CITIES || searchContext)
  const city = hasSelection
    ? (CITIES[selectedCity] ?? {
        name: selectedCity,
        nameZh: searchContext?.cityNameZh || selectedCity,
        country: searchContext?.country || 'Unknown',
        countryZh: searchContext?.countryZh || '未知地区',
        flag: searchContext?.flag || '🌍',
        match: Math.round((searchContext?.confidence || 0.75) * 100),
        soul: {
          headline: searchContext?.soulHeadline || '探索这座城市的独特魅力。',
          body: searchContext?.soulBody || '',
          sub: '文化 · 生活 · 工作',
          personality: searchContext?.soulPersonality || '',
          economy: searchContext?.soulEconomy || '',
          festivals: searchContext?.soulFestivals || '',
          figures: searchContext?.soulFigures || '',
        },
        landing: {
          wifi: searchContext?.wifiSpeed || '未知',
          cost: searchContext?.costLevel || '$$',
          visa: searchContext?.visaInfo || '请查询当地签证政策',
          visaDays: searchContext?.baseVisaDays || '',
          visaDesc: searchContext?.baseVisaDesc || '',
          welfare: '🏥 建议出行前购买国际医疗保险。',
          safety: searchContext?.baseSafety || '',
          dailyCost: searchContext?.baseDailyCost || '',
          visaDetail: searchContext?.baseVisaDetail || '',
          society: searchContext?.baseSociety || '',
        },
        chance: {
          paragraph: searchContext?.chanceParagraph || '该城市提供多样化的远程工作机会。',
          policy: searchContext?.chancePolicy || { label: '选择城市查看商业支持政策', url: '#' },
          localJobs: [{ name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' }],
          remoteJobs: [
            { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
            { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
          ]
        },
        community: {
          paragraph: searchContext?.localParagraph || '',
          platforms: [
            { name: 'Meetup', url: `https://www.meetup.com/find/?location=${encodeURIComponent(selectedCity)}`, desc: '本地兴趣小组活动平台，覆盖各类社群' },
            { name: 'Eventbrite', url: `https://www.eventbrite.com/d/${selectedCity.toLowerCase()}/events/`, desc: '活动票务与发现平台，涵盖各类线下活动' },
          ]
        }
      })
    : PLACEHOLDER_CITY

  const { user } = useAuth()
  const cityCardRef = useRef<HTMLDivElement>(null)
  const { nickname: profileNickname, avatarUrl: profileAvatar } = useUserProfile()

  const [shareAnchor, setShareAnchor] = useState<DOMRect | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [pageUrl, setPageUrl] = useState('')
  const [searchPhase, setSearchPhase] = useState<'idle' | 'loading' | 'ai-loading'>('idle')
  const [expandedQuadrant, setExpandedQuadrant] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const handleCardToggle = (key: string) => {
    if (expandedQuadrant === key) {
      setExpandedQuadrant(null)
    } else {
      setExpandedQuadrant(key)
      if (key !== 'landing') {
        setTimeout(() => {
          const el = cardRefs.current[key]
          if (!el) return
          const top = el.getBoundingClientRect().top + window.scrollY - 64
          window.scrollTo({ top, behavior: 'smooth' })
        }, 60)
      }
    }
  }

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    const path = window.location.pathname + window.location.search
    setPageUrl(baseUrl + path)
  }, [])

  // Synchronously derived — NEXT_PUBLIC_BASE_URL is a compile-time constant,
  // selectedCity is already in context, no effect needed
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://nomadictree.io'
  const cityQrUrl = selectedCity
    ? `${base}/insights?city=${encodeURIComponent(selectedCity)}`
    : 'https://nomadictree.io/insights'

  // Restore city selection from URL param when a QR code is scanned
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cityFromUrl = params.get('city')
    if (cityFromUrl && !selectedCity) {
      setSelectedCity(cityFromUrl)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle ?q= param: run search and populate city data
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (!q) return
    setSearchPhase('loading')
    const local = localSearch(q)
    if (local !== null && local.length > 0 && local[0].confidence === 'exact') {
      setSelectedCity(local[0].city.name)
      setSearchPhase('idle')
      return
    }
    setSearchPhase('ai-loading')
    fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q }),
    })
      .then(r => r.json())
      .then(data => {
        if (!data.success || !data.result?.cityName) { setSearchPhase('idle'); return }
        const r = data.result
        const ctx: SearchContext = {
          cityName: r.cityName, cityNameZh: r.cityNameZh,
          country: r.country, countryZh: r.countryZh, flag: r.flag,
          lat: r.lat ?? undefined, lon: r.lon ?? undefined,
          confidence: r.confidence, userIntent: r.userIntent,
          relevantSections: r.relevantSections, aiInsight: r.aiInsight,
          soulHeadline: r.soulHeadline, soulBody: r.soulBody,
          soulPersonality: r.soulPersonality, soulEconomy: r.soulEconomy,
          soulFestivals: r.soulFestivals, soulFigures: r.soulFigures,
          wifiSpeed: r.wifiSpeed, costLevel: r.costLevel, visaInfo: r.visaInfo,
          baseVisaDays: r.baseVisaDays, baseVisaDesc: r.baseVisaDesc,
          baseSafety: r.baseSafety, baseDailyCost: r.baseDailyCost,
          baseVisaDetail: r.baseVisaDetail, baseSociety: r.baseSociety,
          chanceParagraph: r.chanceParagraph, chancePolicy: r.chancePolicy,
          localParagraph: r.localParagraph,
        }
        setSearchContext(ctx)
        setSelectedCity(r.cityName)
        setSearchPhase('idle')
      })
      .catch(() => setSearchPhase('idle'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Stable callback references for escape key handling
  const closeShare = useCallback(() => setShareAnchor(null), [])

  useEscapeKey(!!shareAnchor, closeShare)

  const handleSave = () => {
    if (!user) { setShowLogin(true); return }
    toggleSaveCity(city.name, city.country, city.nameZh || undefined)
  }

  const handleLoginConfirm = () => {
    setShowLogin(false)
    toggleSaveCity(city.name, city.country, city.nameZh || undefined)
  }

  const handleBack = () => {
    setSearchContext(null)
    router.back()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', display: 'flex', flexDirection: 'column' }}>
      <div className="page-inner" style={{ flex: 1, padding: '14px 16px 10px' }}>
      <div className="desktop-search-wrap">

        {searchPhase !== 'idle' && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            {searchPhase === 'ai-loading' ? 'AI 正在实时生成城市洞察，请稍候……' : '搜索中…'}
          </div>
        )}

        {searchPhase === 'idle' && (
        <>
        {/* 返回 + 收藏/分享按钮同行 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <button onClick={handleBack} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>← 返回</button>
          <div style={{ display: 'flex', gap: 5 }}>
            <button onClick={handleSave} style={{ width: 30, height: 28, border: 'none', borderRadius: 7, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
              {isCitySaved(city.name) ? '♥' : '♡'}
            </button>
            <button
              onClick={(e) => { if (selectedCity) setShareAnchor(e.currentTarget.getBoundingClientRect()) }}
              aria-label="分享"
              style={{ width: 30, height: 28, border: 'none', borderRadius: 7, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer' }}
            >⤴</button>
          </div>
        </div>

        {/* 城市信息框 */}
        <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 12, padding: '10px 13px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--text-primary)' }}>{city.name} {city.nameZh}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>{city.flag} {city.country} {city.countryZh}</div>
        </div>

        {searchContext && (
          <div style={{ background: 'linear-gradient(135deg, #e8f5ee 0%, #e8f0f5 100%)', border: '0.5px solid #9fd4b8', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: '#085041', marginBottom: 4 }}>✨ AI 为你找到了</div>
            <div style={{ fontSize: 11, color: '#0c447c', lineHeight: 1.5 }}>{searchContext.aiInsight}</div>
          </div>
        )}

        {/* 四象限折叠卡片 */}
        {[
          {
            key: 'landing',
            emoji: '🪂', label: '落地指南 LANDING',
            points: '签证政策 · 每日花销 · 社会运转 · 住房租房 · 安全守护',
            color: '#085041', bg: '#d4ede0', border: '#9fd4b8',
          },
          {
            key: 'soul',
            emoji: '🏺', label: '文化内核 SOUL',
            points: '文化性格 · 经济支柱 · 节庆活动 · 代表人物 · 体验入口',
            color: '#633806', bg: '#fde4a0', border: '#c8a830',
          },
          {
            key: 'community',
            emoji: '🌳', label: '本地社区 COMMUNITY',
            points: '本地社群 · 全球游民社区 · 华人旅居圈',
            color: '#3c3489', bg: '#dbd2f0', border: '#b8a8e0',
          },
          {
            key: 'chance',
            emoji: '💸', label: '商业机会 CHANCE',
            points: '政策环境 · 本地招聘 · 全球远程机会',
            color: '#0c447c', bg: '#c8dcf0', border: '#84b8d8',
          },
        ].map((q) => {
          const isOpen = expandedQuadrant === q.key
          return (
            <div key={q.key} ref={(el: HTMLDivElement | null) => { cardRefs.current[q.key] = el }} style={{ background: isOpen ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.62)', backdropFilter: 'blur(14px) saturate(160%)', WebkitBackdropFilter: 'blur(14px) saturate(160%)', border: `0.5px solid ${isOpen ? '#1D9E75' : 'rgba(29,158,117,0.28)'}`, borderRadius: 12, marginBottom: 8, overflow: 'hidden', boxShadow: isOpen ? '0 8px 32px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.05)', transition: 'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease' }}>
              <button
                onClick={() => handleCardToggle(q.key)}
                style={{
                  width: '100%', background: 'transparent', border: 'none',
                  borderBottom: isOpen ? '0.5px solid rgba(29,158,117,0.28)' : 'none',
                  padding: '1.25rem 1.5rem', textAlign: 'left', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--accent-text)', marginBottom: 8 }}>
                  {q.emoji} {q.label}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 7 }}>
                  {q.points}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {isOpen ? '收起 ▴' : '点击展开详情 ▾'}
                </div>
              </button>

              {isOpen && q.key === 'landing' && (
                <div style={{ padding: '11px 1.5rem' }}>
                  {'wifi' in city.landing && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, marginBottom: 5 }}>
                        {[
                          { num: city.landing.wifi, label: 'WiFi' },
                          { num: city.landing.cost, label: '物价' },
                          { num: ('visaDays' in city.landing && city.landing.visaDays) ? city.landing.visaDays : city.landing.visa, label: '签证' },
                        ].map(item => (
                          <div key={item.label} style={{ background: 'transparent', border: '0.5px solid #9fd4b8', borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
                            <div style={{ fontSize: 15, fontWeight: 500, color: '#3a8a64' }}>{item.num}</div>
                            <div style={{ fontSize: 10, color: '#3a8a64', marginTop: 2 }}>{item.label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: 'transparent', border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.55 }}>{city.landing.welfare}</span>
                      </div>
                    </>
                  )}
                  {'visaDetail' in city.landing && city.landing.visaDetail && (
                    <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: 11 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-text)', marginBottom: 5 }}>签证政策</div>
                      <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>{city.landing.visaDetail}</div>
                    </div>
                  )}
                  {'dailyCost' in city.landing && city.landing.dailyCost && (
                    <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: 11 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-text)', marginBottom: 5 }}>每日花销</div>
                      <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{city.landing.dailyCost}</div>
                    </div>
                  )}
                  {'society' in city.landing && city.landing.society && (
                    <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: 11 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-text)', marginBottom: 5 }}>社会运转</div>
                      <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>{city.landing.society}</div>
                    </div>
                  )}
                  {'housing' in city.landing && city.landing.housing && (
                    <div style={{ marginBottom: 11 }}>
                      <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: ('housingLinks' in city.landing && (city.landing as { housingLinks?: unknown[] }).housingLinks?.length) ? 8 : 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-text)', marginBottom: 5 }}>🏠 住房租房</div>
                        <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>{city.landing.housing}</div>
                      </div>
                      {'housingLinks' in city.landing && city.landing.housingLinks?.map(link => (
                        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: 'rgba(212,237,224,0.65)', border: '0.5px solid rgba(29,158,117,0.25)', marginBottom: 5, textDecoration: 'none' }}>
                          <span style={{ fontSize: 12, color: '#3a8a64' }}>
                            {link.name}
                            {'desc' in link && link.desc && <span style={{ color: '#3a8a64', fontWeight: 400 }}> | {link.desc}</span>}
                          </span>
                          <span style={{ fontSize: 12, color: '#3a8a64', flexShrink: 0, marginLeft: 6 }}>›</span>
                        </a>
                      ))}
                    </div>
                  )}
                  {(('safety' in city.landing && city.landing.safety) || (selectedCity && CITY_SAFETY_LINKS[selectedCity])) && (
                    <div>
                      <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: selectedCity && CITY_SAFETY_LINKS[selectedCity] ? 8 : 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-text)', marginBottom: 'safety' in city.landing && city.landing.safety ? 5 : 0 }}>🛡️ 安全守护</div>
                        {'safety' in city.landing && city.landing.safety && (
                          <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>{city.landing.safety}</div>
                        )}
                      </div>
                      {selectedCity && CITY_SAFETY_LINKS[selectedCity] && (
                        <>
                          {CITY_SAFETY_LINKS[selectedCity].map(link => (
                            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: 'rgba(212,237,224,0.65)', border: '0.5px solid rgba(29,158,117,0.25)', marginBottom: 5, textDecoration: 'none' }}>
                              <span style={{ fontSize: 12, color: '#3a8a64' }}>
                                {link.name}
                                <span style={{ color: '#3a8a64', fontWeight: 400 }}> | {link.desc}</span>
                              </span>
                              <span style={{ fontSize: 12, color: '#3a8a64', flexShrink: 0, marginLeft: 6 }}>›</span>
                            </a>
                          ))}
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 6 }}>
                            免责声明：以上信息仅供参考，实际情况请以当地官方渠道为准。医疗建议请遵从专业医生意见。
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {isOpen && q.key === 'soul' && (
                <div style={{ padding: '11px 1.5rem' }}>
                  <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#3a8a64', marginBottom: 2 }}>{city.soul.headline}</div>
                    {'body' in city.soul && city.soul.body && (
                      <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.6, marginTop: 5 }}>{city.soul.body}</div>
                    )}
                  </div>
                  {'personality' in city.soul && city.soul.personality && (
                    <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: 11 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-text)', marginBottom: 5 }}>文化性格</div>
                      <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>{city.soul.personality}</div>
                    </div>
                  )}
                  {'economy' in city.soul && city.soul.economy && (
                    <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: 11 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-text)', marginBottom: 5 }}>经济支柱</div>
                      <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>{city.soul.economy}</div>
                    </div>
                  )}
                  {'festivals' in city.soul && city.soul.festivals && (
                    <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: 11 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-text)', marginBottom: 5 }}>节庆活动</div>
                      <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>{city.soul.festivals}</div>
                    </div>
                  )}
                  {'figures' in city.soul && city.soul.figures && (
                    <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: 11 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-text)', marginBottom: 5 }}>代表人物</div>
                      <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>{city.soul.figures}</div>
                    </div>
                  )}
                  <div>
                    <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: selectedCity && CITY_EXPERIENCE_LINKS[selectedCity] ? 8 : 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-text)', marginBottom: !(selectedCity && CITY_EXPERIENCE_LINKS[selectedCity]) ? 5 : 0 }}>🎨 体验入口</div>
                      {!(selectedCity && CITY_EXPERIENCE_LINKS[selectedCity]) && (
                        <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>选择具体城市查看体验入口与活动资源。</div>
                      )}
                    </div>
                    {selectedCity && CITY_EXPERIENCE_LINKS[selectedCity] && (
                      CITY_EXPERIENCE_LINKS[selectedCity].map(link => (
                        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: 'rgba(212,237,224,0.65)', border: '0.5px solid rgba(29,158,117,0.25)', marginBottom: 5, textDecoration: 'none' }}>
                          <span style={{ fontSize: 12, color: '#3a8a64' }}>
                            {link.name}
                            <span style={{ color: '#3a8a64', fontWeight: 400 }}> | {link.desc}</span>
                          </span>
                          <span style={{ fontSize: 12, color: '#3a8a64', flexShrink: 0, marginLeft: 6 }}>›</span>
                        </a>
                      ))
                    )}
                  </div>
                </div>
              )}

              {isOpen && q.key === 'community' && (
                <div style={{ padding: '11px 1.5rem' }}>
                  {'paragraph' in city.community && city.community.paragraph && (
                    <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.6, marginBottom: 11 }}>{city.community.paragraph}</div>
                  )}
                  <div style={{ marginBottom: 11 }}>
                    <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: city.community.platforms.length > 0 ? 8 : 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-text)', marginBottom: city.community.platforms.length === 0 ? 5 : 0 }}>📍 本地社群平台</div>
                      {city.community.platforms.length === 0 && (
                        <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>选择具体城市查看本地社群平台与活动资源。</div>
                      )}
                    </div>
                    {city.community.platforms.map(p => (
                      <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: 'rgba(212,237,224,0.65)', border: '0.5px solid rgba(29,158,117,0.25)', marginBottom: 5, textDecoration: 'none' }}>
                        <span style={{ fontSize: 12, color: '#3a8a64' }}>
                          {p.name}
                          {'desc' in p && p.desc && <span style={{ color: '#3a8a64', fontWeight: 400 }}> | {p.desc}</span>}
                        </span>
                        <span style={{ fontSize: 12, color: '#3a8a64', flexShrink: 0, marginLeft: 6 }}>›</span>
                      </a>
                    ))}
                  </div>
                  <div style={{ marginBottom: 11 }}>
                    <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: selectedCity ? 8 : 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-text)', marginBottom: !selectedCity ? 5 : 0 }}>🌍 全球游民社群</div>
                      {!selectedCity && (
                        <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>选择具体城市查看全球游民社群资源与连接方式。</div>
                      )}
                    </div>
                    {selectedCity && GLOBAL_COMMUNITIES.map(c => (
                      <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: 'rgba(212,237,224,0.65)', border: '0.5px solid rgba(29,158,117,0.25)', marginBottom: 5, textDecoration: 'none' }}>
                        <span style={{ fontSize: 12, color: '#3a8a64' }}>
                          {c.name}
                          {c.desc && <span style={{ color: '#3a8a64', fontWeight: 400 }}> | {c.desc}</span>}
                        </span>
                        <span style={{ fontSize: 12, color: '#3a8a64', flexShrink: 0, marginLeft: 6 }}>›</span>
                      </a>
                    ))}
                  </div>
                  <div>
                    {'zhCommunity' in city.community && city.community.zhCommunity ? (
                      <>
                        <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: city.community.zhCommunityLinks?.length ? 8 : 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-text)', marginBottom: 5 }}>🀄 华人旅居圈</div>
                          <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>{city.community.zhCommunity}</div>
                        </div>
                        {city.community.zhCommunityLinks?.map(link => (
                          <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: 'rgba(212,237,224,0.65)', border: '0.5px solid rgba(29,158,117,0.25)', marginBottom: 5, textDecoration: 'none' }}>
                            <span style={{ fontSize: 12, color: '#3a8a64' }}>{link.name}</span>
                            <span style={{ fontSize: 12, color: '#3a8a64', flexShrink: 0, marginLeft: 6 }}>›</span>
                          </a>
                        ))}
                      </>
                    ) : (
                      <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-text)', marginBottom: 5 }}>🀄 华人旅居圈</div>
                        <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>选择具体城市查看华人旅居圈与中文社群资源。</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isOpen && q.key === 'chance' && (
                <div style={{ padding: '11px 1.5rem' }}>
                  <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.6, marginBottom: 11 }}>{city.chance.paragraph}</div>
                  <div style={{ marginBottom: 11 }}>
                    <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: city.chance.policy.url !== '#' ? 8 : 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-text)', marginBottom: city.chance.policy.url === '#' ? 5 : 0 }}>📋 政策环境</div>
                      {city.chance.policy.url === '#' && (
                        <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>选择具体城市查看当地政策环境与商业支持条件。</div>
                      )}
                    </div>
                    {city.chance.policy.url !== '#' && (
                      <a href={city.chance.policy.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: 'rgba(212,237,224,0.65)', border: '0.5px solid rgba(29,158,117,0.25)', textDecoration: 'none' }}>
                        <span style={{ fontSize: 12, color: '#3a8a64' }}>
                          {city.chance.policy.label}
                          {'desc' in city.chance.policy && city.chance.policy.desc && <span style={{ color: '#3a8a64', fontWeight: 400 }}> | {city.chance.policy.desc}</span>}
                        </span>
                        <span style={{ fontSize: 12, color: '#3a8a64', flexShrink: 0, marginLeft: 6 }}>›</span>
                      </a>
                    )}
                  </div>
                  <div style={{ marginBottom: 11 }}>
                    <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: city.chance.localJobs.length > 0 ? 8 : 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-text)', marginBottom: city.chance.localJobs.length === 0 ? 5 : 0 }}>🏢 本地招聘平台</div>
                      {city.chance.localJobs.length === 0 && (
                        <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>选择具体城市查看本地招聘平台与就业机会。</div>
                      )}
                    </div>
                    {city.chance.localJobs.map(j => (
                      <a key={j.name} href={j.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: 'rgba(212,237,224,0.65)', border: '0.5px solid rgba(29,158,117,0.25)', marginBottom: 5, textDecoration: 'none' }}>
                        <span style={{ fontSize: 12, color: '#3a8a64' }}>
                          {j.name}
                          {'desc' in j && j.desc && <span style={{ color: '#3a8a64', fontWeight: 400 }}> | {j.desc}</span>}
                        </span>
                        <span style={{ fontSize: 12, color: '#3a8a64', flexShrink: 0, marginLeft: 6 }}>›</span>
                      </a>
                    ))}
                  </div>
                  <div>
                    <div style={{ border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: city.chance.remoteJobs.length > 0 ? 8 : 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-text)', marginBottom: city.chance.remoteJobs.length === 0 ? 5 : 0 }}>🌐 全球远程平台</div>
                      {city.chance.remoteJobs.length === 0 && (
                        <div style={{ fontSize: 12, color: '#3a8a64', lineHeight: 1.65 }}>选择具体城市查看全球远程工作平台资源。</div>
                      )}
                    </div>
                    {city.chance.remoteJobs.map(j => (
                      <a key={j.name} href={j.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: 'rgba(212,237,224,0.65)', border: '0.5px solid rgba(29,158,117,0.25)', marginBottom: 5, textDecoration: 'none' }}>
                        <span style={{ fontSize: 12, color: '#3a8a64' }}>
                          {j.name}
                          {'desc' in j && j.desc && <span style={{ color: '#3a8a64', fontWeight: 400 }}> | {j.desc}</span>}
                        </span>
                        <span style={{ fontSize: 12, color: '#3a8a64', flexShrink: 0, marginLeft: 6 }}>›</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* 城市深度报告 */}
        <div style={{ background: '#1D9E75', borderRadius: 12, marginBottom: 10, padding: '1.25rem 1.5rem 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>⚓️ 城市深度报告 REPORTS</div>
            <span style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: 10, padding: '2px 9px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 8 }}>付费解锁</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 12, lineHeight: 1.5 }}>针对具体议题的付费深度内容</div>
          <CityReports city={city.nameZh || city.name} />
        </div>

        {/* 在地专业咨询 */}
        <div style={{ background: '#1D9E75', borderRadius: 12, marginBottom: 10, padding: '1.25rem 1.5rem 1rem' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>🎯 在地专业咨询 CONSULT</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 12, lineHeight: 1.5 }}>与真正在当地生活的人对话——掌握攻略里找不到的一手信息</div>
          <LocalGuides city={city.nameZh || city.name} />
        </div>
        </>
        )}{/* /searchPhase idle */}
      </div>{/* /desktop-search-wrap */}
      </div>{/* /page-inner */}
      {/* ── 页脚 ── */}
      <footer style={{ marginTop: 8, borderTop: '0.5px solid var(--border)', paddingTop: 24, paddingBottom: 8 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img src="/logo-nomadic-t.png" alt="Nomadic" style={{ height: 30, width: 'auto', display: 'block', margin: '0 auto 8px' }} />
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 600 }}>
            The Deep-Dive Platform for Global Wanderers
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Rooted in the world, never just passing by.
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8 }}>
          <div>© 2026 Nomadic · nomadictree.io</div>
        </div>
      </footer>
      <div style={{ height: 32 }} />
      <BottomNav />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginConfirm}
        />
      )}

      {/* Hidden city card for html2canvas capture */}
      <div style={{ position: 'absolute', left: -9999, top: 0, pointerEvents: 'none' }}>
        <div ref={cityCardRef}>
          <CityCard
            nickname={profileNickname ?? ''}
            avatarUrl={profileAvatar}
            cityNameZh={city.nameZh || ''}
            cityNameEn={city.name}
            countryZh={city.countryZh || searchContext?.countryZh || ''}
            flag={city.flag || searchContext?.flag || '🌍'}
            description={city.soul.body || searchContext?.soulBody || ''}
            personality={'personality' in city.soul ? city.soul.personality : undefined}
            economy={'economy' in city.soul ? city.soul.economy : undefined}
            cityKey={selectedCity || undefined}
            qrValue={cityQrUrl || 'https://nomadictree.io/insights'}
          />
        </div>
      </div>

      <ShareSheet
        anchorRect={shareAnchor}
        onClose={closeShare}
        cardRef={cityCardRef}
        autoGenerate={true}
        copyUrl={cityQrUrl || pageUrl}
      />

    </div>
  )
}
