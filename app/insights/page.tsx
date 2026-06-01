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
      paragraph: '',
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

        {/* 返回 + 收藏/分享按钮同行 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <button onClick={handleBack} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>← 返回</button>
          <div style={{ display: 'flex', gap: 5 }}>
            <button onClick={handleSave} style={{ width: 30, height: 28, border: '0.5px solid var(--border-light)', borderRadius: 7, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: isCitySaved(city.name) ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer' }}>
              {isCitySaved(city.name) ? '♥' : '♡'}
            </button>
            <button
              onClick={(e) => { if (selectedCity) setShareAnchor(e.currentTarget.getBoundingClientRect()) }}
              aria-label="分享"
              style={{ width: 32, height: 30, border: '0.5px solid var(--border-light)', borderRadius: 8, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: selectedCity ? 'var(--text-secondary)' : 'var(--border)', cursor: selectedCity ? 'pointer' : 'default' }}
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

        {/* LANDING 落地指南 */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, padding: '11px 12px', borderRadius: 7, background: '#d4ede0', border: '0.5px solid #9fd4b8', color: '#085041' }}>🌿 LANDING 落地指南</div>
          {'wifi' in city.landing && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, marginBottom: 5 }}>
                {[
                  { num: city.landing.wifi, label: 'WiFi' },
                  { num: city.landing.cost, label: '物价' },
                  { num: ('visaDays' in city.landing && city.landing.visaDays) ? city.landing.visaDays : city.landing.visa, label: '签证' },
                ].map(item => (
                  <div key={item.label} style={{ background: '#d4ede0', border: '0.5px solid #9fd4b8', borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#085041' }}>{item.num}</div>
                    <div style={{ fontSize: 10, color: '#3a8a64', marginTop: 2 }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#d4ede0', border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '8px 11px', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#085041', lineHeight: 1.55 }}>{city.landing.welfare}</span>
              </div>
            </>
          )}
          <div style={{ background: '#d4ede0', border: '0.5px solid #9fd4b8', borderRadius: 10, padding: '11px 12px' }}>
            {'visaDetail' in city.landing && city.landing.visaDetail && (
              <div style={{ marginBottom: 11 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#085041', marginBottom: 5 }}>签证政策</div>
                <div style={{ fontSize: 12, color: '#085041', lineHeight: 1.65 }}>{city.landing.visaDetail}</div>
              </div>
            )}
            {'dailyCost' in city.landing && city.landing.dailyCost && (
              <div style={{ marginBottom: 11 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#085041', marginBottom: 5 }}>每日花销</div>
                <div style={{ fontSize: 12, color: '#085041', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{city.landing.dailyCost}</div>
              </div>
            )}
            {'safety' in city.landing && city.landing.safety && (
              <div style={{ marginBottom: 11 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#085041', marginBottom: 5 }}>治安与安全</div>
                <div style={{ fontSize: 12, color: '#085041', lineHeight: 1.65 }}>{city.landing.safety}</div>
              </div>
            )}
            {'society' in city.landing && city.landing.society && (
              <div style={{ marginBottom: 11 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#085041', marginBottom: 5 }}>社会运转</div>
                <div style={{ fontSize: 12, color: '#085041', lineHeight: 1.65 }}>{city.landing.society}</div>
              </div>
            )}
            {'housing' in city.landing && city.landing.housing && (
              <div style={{ marginBottom: 11 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#085041', marginBottom: 5 }}>🏠 住房与租房</div>
                <div style={{ fontSize: 12, color: '#085041', lineHeight: 1.65, marginBottom: city.landing.housingLinks?.length ? 8 : 0 }}>{city.landing.housing}</div>
                {city.landing.housingLinks?.map(link => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: '#c2e0ce', border: '0.5px solid #9fd4b8', marginBottom: 5, textDecoration: 'none' }}>
                    <span style={{ fontSize: 12, color: '#085041' }}>
                      {link.name}
                      {'desc' in link && link.desc && <span style={{ color: '#3a8a64', fontWeight: 400 }}> | {link.desc}</span>}
                    </span>
                    <span style={{ fontSize: 12, color: '#085041', flexShrink: 0, marginLeft: 6 }}>›</span>
                  </a>
                ))}
              </div>
            )}
            {selectedCity && CITY_SAFETY_LINKS[selectedCity] && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#085041', marginBottom: 5 }}>🛡️ 安全守护</div>
                {CITY_SAFETY_LINKS[selectedCity].map(link => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: '#c2e0ce', border: '0.5px solid #9fd4b8', marginBottom: 5, textDecoration: 'none' }}>
                    <span style={{ fontSize: 12, color: '#085041' }}>
                      {link.name}
                      <span style={{ color: '#3a8a64', fontWeight: 400 }}> | {link.desc}</span>
                    </span>
                    <span style={{ fontSize: 12, color: '#085041', flexShrink: 0, marginLeft: 6 }}>›</span>
                  </a>
                ))}
                <div style={{ fontSize: 10, color: '#3a8a64', lineHeight: 1.5, marginTop: 6, padding: '6px 8px', background: 'rgba(9,80,65,0.06)', borderRadius: 6 }}>
                  免责声明：以上信息仅供参考，实际情况请以当地官方渠道为准。医疗建议请遵从专业医生意见。
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SOUL 文化内核 */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, padding: '11px 12px', borderRadius: 7, background: '#fde4a0', border: '0.5px solid #c8a830', color: '#633806' }}>🌍 SOUL 文化内核</div>
          <div style={{ background: '#fde4a0', border: '0.5px solid #c8a830', borderRadius: 10, padding: '10px 12px', marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#3d2010', marginBottom: 2 }}>{city.soul.headline}</div>
            {'body' in city.soul && city.soul.body && (
              <div style={{ fontSize: 12, color: '#3d2010', lineHeight: 1.6, marginTop: 5 }}>{city.soul.body}</div>
            )}
          </div>
          <div style={{ background: '#fde4a0', border: '0.5px solid #c8a830', borderRadius: 10, padding: '11px 12px' }}>
            {'personality' in city.soul && city.soul.personality && (
              <div style={{ marginBottom: 11 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#854f0b', marginBottom: 5 }}>文化性格</div>
                <div style={{ fontSize: 12, color: '#3d2010', lineHeight: 1.65 }}>{city.soul.personality}</div>
              </div>
            )}
            {'economy' in city.soul && city.soul.economy && (
              <div style={{ marginBottom: 11 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#854f0b', marginBottom: 5 }}>经济支柱</div>
                <div style={{ fontSize: 12, color: '#3d2010', lineHeight: 1.65 }}>{city.soul.economy}</div>
              </div>
            )}
            {'festivals' in city.soul && city.soul.festivals && (
              <div style={{ marginBottom: 11 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#854f0b', marginBottom: 5 }}>节庆活动</div>
                <div style={{ fontSize: 12, color: '#3d2010', lineHeight: 1.65 }}>{city.soul.festivals}</div>
              </div>
            )}
            {'figures' in city.soul && city.soul.figures && (
              <div style={{ marginBottom: selectedCity && CITY_EXPERIENCE_LINKS[selectedCity] ? 11 : 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#854f0b', marginBottom: 5 }}>代表人物</div>
                <div style={{ fontSize: 12, color: '#3d2010', lineHeight: 1.65 }}>{city.soul.figures}</div>
              </div>
            )}
            {selectedCity && CITY_EXPERIENCE_LINKS[selectedCity] && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#854f0b', marginBottom: 8 }}>🎨 文化体验入口</div>
                {CITY_EXPERIENCE_LINKS[selectedCity].map(link => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: '#fef0c0', border: '0.5px solid #c8a830', marginBottom: 5, textDecoration: 'none' }}>
                    <span style={{ fontSize: 12, color: '#633806' }}>
                      {link.name}
                      <span style={{ color: '#9a6b1a', fontWeight: 400 }}> | {link.desc}</span>
                    </span>
                    <span style={{ fontSize: 12, color: '#633806', flexShrink: 0, marginLeft: 6 }}>›</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COMMUNITY 本地社区 */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, padding: '11px 12px', borderRadius: 7, background: '#dbd2f0', border: '0.5px solid #b8a8e0', color: '#3c3489' }}>👥 COMMUNITY 本地社区</div>
          <div style={{ background: '#dbd2f0', border: '0.5px solid #b8a8e0', borderRadius: 10, padding: '10px 12px' }}>
            {'paragraph' in city.community && city.community.paragraph && (
              <div style={{ fontSize: 12, color: '#3c3489', lineHeight: 1.6, marginBottom: 11 }}>{city.community.paragraph}</div>
            )}
            {city.community.platforms.length > 0 && (
              <div style={{ marginBottom: 11 }}>
                <div style={{ fontSize: 12, color: '#3c3489', marginBottom: 6 }}>📍 本地社群平台</div>
                {city.community.platforms.map(p => (
                  <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: '#ece8f8', border: '0.5px solid #b8a8e0', marginBottom: 5, textDecoration: 'none' }}>
                    <span style={{ fontSize: 12, color: '#6b5bb5' }}>
                      {p.name}
                      {'desc' in p && p.desc && <span style={{ color: '#8b7bc8', fontWeight: 400 }}> | {p.desc}</span>}
                    </span>
                    <span style={{ fontSize: 12, color: '#6b5bb5', flexShrink: 0, marginLeft: 6 }}>›</span>
                  </a>
                ))}
              </div>
            )}
            {GLOBAL_COMMUNITIES.length > 0 && (
              <div style={{ marginBottom: 'zhCommunity' in city.community && city.community.zhCommunity ? 11 : 0 }}>
                <div style={{ fontSize: 12, color: '#3c3489', marginBottom: 6 }}>🌍 全球游民社群</div>
                {GLOBAL_COMMUNITIES.map(c => (
                  <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: '#ece8f8', border: '0.5px solid #b8a8e0', marginBottom: 5, textDecoration: 'none' }}>
                    <span style={{ fontSize: 12, color: '#6b5bb5' }}>
                      {c.name}
                      {c.desc && <span style={{ color: '#8b7bc8', fontWeight: 400 }}> | {c.desc}</span>}
                    </span>
                    <span style={{ fontSize: 12, color: '#6b5bb5', flexShrink: 0, marginLeft: 6 }}>›</span>
                  </a>
                ))}
              </div>
            )}
            {'zhCommunity' in city.community && city.community.zhCommunity && (
              <div>
                <div style={{ fontSize: 12, color: '#6b5bb5', fontWeight: 500, marginBottom: 6 }}>🀄 华人旅居圈</div>
                <div style={{ fontSize: 12, color: '#3c3489', lineHeight: 1.65, marginBottom: city.community.zhCommunityLinks?.length ? 8 : 0 }}>{city.community.zhCommunity}</div>
                {city.community.zhCommunityLinks?.map(link => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: '#ece8f8', border: '0.5px solid #b8a8e0', marginBottom: 5, textDecoration: 'none' }}>
                    <span style={{ fontSize: 12, color: '#6b5bb5' }}>{link.name}</span>
                    <span style={{ fontSize: 12, color: '#6b5bb5', flexShrink: 0, marginLeft: 6 }}>›</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CHANCE 商业机会 */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, padding: '11px 12px', borderRadius: 7, background: '#c8dcf0', border: '0.5px solid #84b8d8', color: '#0c447c' }}>💼 CHANCE 商业机会</div>
          <div style={{ background: '#c8dcf0', border: '0.5px solid #84b8d8', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 12, color: '#0c447c', lineHeight: 1.6, marginBottom: 11 }}>{city.chance.paragraph}</div>

            <div style={{ marginBottom: 11 }}>
              <div style={{ fontSize: 12, color: '#0c447c', marginBottom: 6 }}>📋 政策环境</div>
              <a href={city.chance.policy.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: '#ddeaf8', border: '0.5px solid #84b8d8', textDecoration: 'none' }}>
                <span style={{ fontSize: 12, color: '#185fa5' }}>
                  {city.chance.policy.label}
                  {'desc' in city.chance.policy && city.chance.policy.desc && <span style={{ color: '#3a7fc0', fontWeight: 400 }}> | {city.chance.policy.desc}</span>}
                </span>
                <span style={{ fontSize: 12, color: '#185fa5', flexShrink: 0, marginLeft: 6 }}>›</span>
              </a>
            </div>

            {city.chance.localJobs.length > 0 && (
              <div style={{ marginBottom: 11 }}>
                <div style={{ fontSize: 12, color: '#0c447c', marginBottom: 6 }}>🏢 本地招聘平台</div>
                {city.chance.localJobs.map(j => (
                  <a key={j.name} href={j.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: '#ddeaf8', border: '0.5px solid #84b8d8', marginBottom: 5, textDecoration: 'none' }}>
                    <span style={{ fontSize: 12, color: '#185fa5' }}>
                      {j.name}
                      {'desc' in j && j.desc && <span style={{ color: '#3a7fc0', fontWeight: 400 }}> | {j.desc}</span>}
                    </span>
                    <span style={{ fontSize: 12, color: '#185fa5', flexShrink: 0, marginLeft: 6 }}>›</span>
                  </a>
                ))}
              </div>
            )}

            {city.chance.remoteJobs.length > 0 && (
              <div>
                <div style={{ fontSize: 12, color: '#0c447c', marginBottom: 6 }}>🌐 全球远程平台</div>
                {city.chance.remoteJobs.map(j => (
                  <a key={j.name} href={j.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: '#ddeaf8', border: '0.5px solid #84b8d8', marginBottom: 5, textDecoration: 'none' }}>
                    <span style={{ fontSize: 12, color: '#185fa5' }}>
                      {j.name}
                      {'desc' in j && j.desc && <span style={{ color: '#3a7fc0', fontWeight: 400 }}> | {j.desc}</span>}
                    </span>
                    <span style={{ fontSize: 12, color: '#185fa5', flexShrink: 0, marginLeft: 6 }}>›</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 分享按钮 — 城市卡片 */}
        {selectedCity && (
          <button
            onClick={(e) => setShareAnchor(e.currentTarget.getBoundingClientRect())}
            style={{ width: '100%', padding: '13px 0', borderRadius: 12, background: '#f0c040', border: 'none', color: '#3d2c0a', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 10 }}
          >
            分享城市洞察 →
          </button>
        )}
      </div>{/* /desktop-search-wrap */}
      </div>{/* /page-inner */}
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
