'use client'
export const dynamic = 'force-static'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { CITIES, GLOBAL_COMMUNITIES } from '@/data/cities'
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
      body: '选择一座城市，开始探索它的灵魂、生存基准、商业机会和本地圈子。',
      sub: '文化 · 生活 · 工作',
      personality: '选择具体城市查看文化性格。',
      economy: '选择具体城市查看经济支柱。',
      festivals: '选择具体城市查看节庆活动。',
      figures: '选择具体城市查看代表人物。',
    },
    base: {
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
    local: {
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
        base: {
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
        local: {
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
    toggleSaveCity(city.name, city.country)
  }

  const handleLoginConfirm = () => {
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

        {/* 返回行 */}
        <div style={{ marginBottom: 8 }}>
          <button onClick={handleBack} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>← 返回</button>
        </div>

        {/* 城市信息框 + 操作按钮（同一行，信息框在左，按钮在右） */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 12, padding: '10px 13px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-primary)' }}>{city.name} {city.nameZh}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>{city.flag} {city.country} {city.countryZh}</div>
          </div>
          <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
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

        {searchContext && (
          <div style={{ background: 'linear-gradient(135deg, #e8f5ee 0%, #e8f0f5 100%)', border: '0.5px solid #9fd4b8', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: '#085041', marginBottom: 4 }}>✨ AI 为你找到了</div>
            <div style={{ fontSize: 11, color: '#0c447c', lineHeight: 1.5 }}>{searchContext.aiInsight}</div>
          </div>
        )}

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, padding: '10px 10px', borderRadius: 7, background: '#fde4a0', border: '0.5px solid #c8a830', color: '#633806' }}>🌍 SOUL 城市灵魂</div>
          <div style={{ background: '#fde4a0', border: '0.5px solid #c8a830', borderRadius: 10, padding: '9px 11px', marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#3d2010', marginBottom: 2 }}>{city.soul.headline}</div>
            {'body' in city.soul && city.soul.body && (
              <div style={{ fontSize: 10, color: '#3d2010', lineHeight: 1.55, marginTop: 5 }}>{city.soul.body}</div>
            )}
          </div>
          <div style={{ background: '#fde4a0', border: '0.5px solid #c8a830', borderRadius: 10, padding: '10px 11px' }}>
            {'personality' in city.soul && city.soul.personality && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#854f0b', marginBottom: 4 }}>文化性格</div>
                <div style={{ fontSize: 10, color: '#3d2010', lineHeight: 1.6 }}>{city.soul.personality}</div>
              </div>
            )}
            {'economy' in city.soul && city.soul.economy && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#854f0b', marginBottom: 4 }}>经济支柱</div>
                <div style={{ fontSize: 10, color: '#3d2010', lineHeight: 1.6 }}>{city.soul.economy}</div>
              </div>
            )}
            {'festivals' in city.soul && city.soul.festivals && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#854f0b', marginBottom: 4 }}>节庆活动</div>
                <div style={{ fontSize: 10, color: '#3d2010', lineHeight: 1.6 }}>{city.soul.festivals}</div>
              </div>
            )}
            {'figures' in city.soul && city.soul.figures && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#854f0b', marginBottom: 4 }}>代表人物</div>
                <div style={{ fontSize: 10, color: '#3d2010', lineHeight: 1.6 }}>{city.soul.figures}</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, padding: '10px 10px', borderRadius: 7, background: '#d4ede0', border: '0.5px solid #9fd4b8', color: '#085041' }}>🌿 BASE 生存基准</div>
          {'wifi' in city.base && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, marginBottom: 5 }}>
                {[
                  { num: city.base.wifi, label: 'WiFi' },
                  { num: city.base.cost, label: '物价' },
                  { num: ('visaDays' in city.base && city.base.visaDays) ? city.base.visaDays : city.base.visa, label: '签证' },
                ].map(item => (
                  <div key={item.label} style={{ background: '#d4ede0', border: '0.5px solid #9fd4b8', borderRadius: 8, padding: '7px 6px', textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#085041' }}>{item.num}</div>
                    <div style={{ fontSize: 9, color: '#3a8a64', marginTop: 1 }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#d4ede0', border: '0.5px solid #9fd4b8', borderRadius: 7, padding: '7px 10px', marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: '#085041', lineHeight: 1.5 }}>{city.base.welfare}</span>
              </div>
            </>
          )}
          <div style={{ background: '#d4ede0', border: '0.5px solid #9fd4b8', borderRadius: 10, padding: '10px 11px' }}>
            {'visaDetail' in city.base && city.base.visaDetail && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#085041', marginBottom: 4 }}>签证政策</div>
                <div style={{ fontSize: 10, color: '#085041', lineHeight: 1.6 }}>{city.base.visaDetail}</div>
              </div>
            )}
            {'dailyCost' in city.base && city.base.dailyCost && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#085041', marginBottom: 4 }}>每日花销</div>
                <div style={{ fontSize: 10, color: '#085041', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{city.base.dailyCost}</div>
              </div>
            )}
            {'safety' in city.base && city.base.safety && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#085041', marginBottom: 4 }}>治安与安全</div>
                <div style={{ fontSize: 10, color: '#085041', lineHeight: 1.6 }}>{city.base.safety}</div>
              </div>
            )}
            {'society' in city.base && city.base.society && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#085041', marginBottom: 4 }}>社会运转</div>
                <div style={{ fontSize: 10, color: '#085041', lineHeight: 1.6 }}>{city.base.society}</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, padding: '10px 10px', borderRadius: 7, background: '#c8dcf0', border: '0.5px solid #84b8d8', color: '#0c447c' }}>💼 CHANCE 商业机会</div>
          <div style={{ background: '#c8dcf0', border: '0.5px solid #84b8d8', borderRadius: 10, padding: '9px 11px' }}>
            <div style={{ fontSize: 10, color: '#0c447c', lineHeight: 1.55, marginBottom: 10 }}>{city.chance.paragraph}</div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: '#0c447c', marginBottom: 5 }}>📋 政策环境</div>
              <a href={city.chance.policy.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#ddeaf8', border: '0.5px solid #84b8d8', textDecoration: 'none' }}>
                <span style={{ fontSize: 11, color: '#185fa5' }}>
                  {city.chance.policy.label}
                  {'desc' in city.chance.policy && city.chance.policy.desc && <span style={{ color: '#3a7fc0', fontWeight: 400 }}> | {city.chance.policy.desc}</span>}
                </span>
                <span style={{ fontSize: 11, color: '#185fa5', flexShrink: 0, marginLeft: 6 }}>›</span>
              </a>
            </div>

            {city.chance.localJobs.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: '#0c447c', marginBottom: 5 }}>🏢 本地招聘平台</div>
                {city.chance.localJobs.map(j => (
                  <a key={j.name} href={j.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#ddeaf8', border: '0.5px solid #84b8d8', marginBottom: 5, textDecoration: 'none' }}>
                    <span style={{ fontSize: 11, color: '#185fa5' }}>
                      {j.name}
                      {'desc' in j && j.desc && <span style={{ color: '#3a7fc0', fontWeight: 400 }}> | {j.desc}</span>}
                    </span>
                    <span style={{ fontSize: 11, color: '#185fa5', flexShrink: 0, marginLeft: 6 }}>›</span>
                  </a>
                ))}
              </div>
            )}

            {city.chance.remoteJobs.length > 0 && (
              <div>
                <div style={{ fontSize: 10, color: '#0c447c', marginBottom: 5 }}>🌐 全球远程平台</div>
                {city.chance.remoteJobs.map(j => (
                  <a key={j.name} href={j.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#ddeaf8', border: '0.5px solid #84b8d8', marginBottom: 5, textDecoration: 'none' }}>
                    <span style={{ fontSize: 11, color: '#185fa5' }}>
                      {j.name}
                      {'desc' in j && j.desc && <span style={{ color: '#3a7fc0', fontWeight: 400 }}> | {j.desc}</span>}
                    </span>
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
            {'paragraph' in city.local && city.local.paragraph && (
              <div style={{ fontSize: 10, color: '#3d3020', lineHeight: 1.55, marginBottom: 10 }}>{city.local.paragraph}</div>
            )}
            {city.local.platforms.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: '#3c3489', marginBottom: 5 }}>📍 本地社群平台</div>
                {city.local.platforms.map(p => (
                  <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#ece8f8', border: '0.5px solid #b8a8e0', marginBottom: 5, textDecoration: 'none' }}>
                    <span style={{ fontSize: 11, color: '#6b5bb5' }}>
                      {p.name}
                      {'desc' in p && p.desc && <span style={{ color: '#8b7bc8', fontWeight: 400 }}> | {p.desc}</span>}
                    </span>
                    <span style={{ fontSize: 11, color: '#6b5bb5', flexShrink: 0, marginLeft: 6 }}>›</span>
                  </a>
                ))}
              </div>
            )}
            {GLOBAL_COMMUNITIES.length > 0 && (
              <div>
                <div style={{ fontSize: 10, color: '#3c3489', marginBottom: 5 }}>🌍 全球游民社群</div>
                {GLOBAL_COMMUNITIES.map(c => (
                  <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#ece8f8', border: '0.5px solid #b8a8e0', marginBottom: 5, textDecoration: 'none' }}>
                    <span style={{ fontSize: 11, color: '#6b5bb5' }}>
                      {c.name}
                      {c.desc && <span style={{ color: '#8b7bc8', fontWeight: 400 }}> | {c.desc}</span>}
                    </span>
                    <span style={{ fontSize: 11, color: '#6b5bb5', flexShrink: 0, marginLeft: 6 }}>›</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ height: 32 }} />
      <BottomNav />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginConfirm}
          redirectPath="/insights"
        />
      )}

      {/* Hidden city card for html2canvas capture */}
      <div style={{ position: 'absolute', left: -9999, top: 0, pointerEvents: 'none' }}>
        <div ref={cityCardRef}>
          <CityCard
            nickname={profileNickname}
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
        showCopyLink={true}
        copyUrl={cityQrUrl || pageUrl}
      />

    </div>
  )
}
