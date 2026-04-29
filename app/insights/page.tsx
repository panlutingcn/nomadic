'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import FocusTrap from 'focus-trap-react'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'
import { CITIES, GLOBAL_COMMUNITIES } from '@/data/cities'

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
  const { selectedCity, isCitySaved, toggleSaveCity, searchContext, setSearchContext } = useApp()

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

  const [showShare, setShowShare] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [showLogin, setShowLogin] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'wechat' | 'email'>('wechat')
  const [loginEmail, setLoginEmail] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [pageUrl, setPageUrl] = useState('')
  const [showSoulModal, setShowSoulModal] = useState(false)
  const [showBaseModal, setShowBaseModal] = useState(false)

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    const path = window.location.pathname + window.location.search
    setPageUrl(baseUrl + path)
  }, [])

  // Stable callback references for escape key handling
  const closeShare = useCallback(() => setShowShare(false), [])
  const closeSoulModal = useCallback(() => setShowSoulModal(false), [])
  const closeBaseModal = useCallback(() => setShowBaseModal(false), [])

  // Use custom hook for Escape key handling
  useEscapeKey(showShare, closeShare)
  useEscapeKey(showSoulModal, closeSoulModal)
  useEscapeKey(showBaseModal, closeBaseModal)

  // Body scroll lock when SOUL modal is open
  useEffect(() => {
    if (showSoulModal) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [showSoulModal])

  // Body scroll lock when BASE modal is open
  useEffect(() => {
    if (showBaseModal) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [showBaseModal])

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

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <button onClick={handleBack} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 8 }}>← 返回</button>
            <div style={{ height: '0.5px', background: 'var(--border)', marginBottom: 10 }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-primary)' }}>{city.name} {city.nameZh}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>{city.flag} {city.country} {city.countryZh}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 32 }}>
            <button onClick={handleSave} style={{ width: 30, height: 28, border: '0.5px solid var(--border-light)', borderRadius: 7, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: isCitySaved(city.name) ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer' }}>
              {isCitySaved(city.name) ? '♥' : '♡'}
            </button>
            <button onClick={() => setShowShare(true)} style={{ width: 30, height: 28, border: '0.5px solid var(--border-light)', borderRadius: 7, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer' }}>⤴</button>
          </div>
        </div>

        <div style={{ height: '0.5px', background: 'var(--border)', margin: '10px 0' }} />

        {searchContext && (
          <div style={{ background: 'linear-gradient(135deg, #e8f5ee 0%, #e8f0f5 100%)', border: '0.5px solid #9fd4b8', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: '#085041', marginBottom: 4 }}>✨ AI 为你找到了</div>
            <div style={{ fontSize: 11, color: '#0c447c', lineHeight: 1.5 }}>{searchContext.aiInsight}</div>
          </div>
        )}

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 6, paddingBottom: 5, borderBottom: '0.5px solid var(--border)' }}>🌍 SOUL 城市灵魂</div>
          <div onClick={() => setShowSoulModal(true)} style={{ cursor: 'pointer' }}>
            <div style={{ background: '#faeeda', border: '0.5px solid #e8c98a', borderRadius: 10, padding: '9px 11px' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#3d2010', marginBottom: 2 }}>{city.soul.headline}</div>
              {'body' in city.soul && city.soul.body && (
                <div style={{ fontSize: 10, color: '#3d2010', lineHeight: 1.55, marginTop: 5 }}>{city.soul.body}</div>
              )}
            </div>
            <div style={{ fontSize: 10, color: '#854f0b', marginTop: 5, textAlign: 'center' }}>
              <div>文化性格｜经济支柱｜节庆活动｜代表人物</div>
              <div style={{ marginTop: 2 }}>点击展开详情 →</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 6, paddingBottom: 5, borderBottom: '0.5px solid var(--border)' }}>🌿 BASE 生存基准</div>
          <div onClick={() => setShowBaseModal(true)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
              {[
                { num: city.base.wifi, label: 'WiFi' },
                { num: city.base.cost, label: '物价' },
                { num: ('visaDays' in city.base && city.base.visaDays) ? city.base.visaDays : city.base.visa, label: '签证' },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 8, padding: '7px 6px', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{item.num}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>{item.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 7, padding: '7px 10px', marginTop: 5 }}>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{city.base.welfare}</span>
            </div>
            <div style={{ fontSize: 10, color: '#6b8e23', marginTop: 5, textAlign: 'center' }}>
              <div>签证政策｜每日花销｜治安安全｜社会运转</div>
              <div style={{ marginTop: 2 }}>点击展开详情 →</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 6, paddingBottom: 5, borderBottom: '0.5px solid var(--border)' }}>💼 CHANCE 商业机会</div>
          <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 10, padding: '9px 11px' }}>
            <div style={{ fontSize: 10, color: '#3d3020', lineHeight: 1.55, marginBottom: 10 }}>{city.chance.paragraph}</div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 5 }}>📋 政策环境</div>
              <a href={city.chance.policy.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#fff8e8', border: '0.5px solid #e8d5a0', textDecoration: 'none' }}>
                <span style={{ fontSize: 11, color: '#8b6914' }}>
                  {city.chance.policy.label}
                  {'desc' in city.chance.policy && city.chance.policy.desc && <span style={{ color: '#b8922a', fontWeight: 400 }}> | {city.chance.policy.desc}</span>}
                </span>
                <span style={{ fontSize: 11, color: '#8b6914', flexShrink: 0, marginLeft: 6 }}>›</span>
              </a>
            </div>

            {city.chance.localJobs.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 5 }}>🏢 本地招聘平台</div>
                {city.chance.localJobs.map(j => (
                  <a key={j.name} href={j.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#fff8e8', border: '0.5px solid #e8d5a0', marginBottom: 5, textDecoration: 'none' }}>
                    <span style={{ fontSize: 11, color: '#8b6914' }}>
                      {j.name}
                      {'desc' in j && j.desc && <span style={{ color: '#b8922a', fontWeight: 400 }}> | {j.desc}</span>}
                    </span>
                    <span style={{ fontSize: 11, color: '#8b6914', flexShrink: 0, marginLeft: 6 }}>›</span>
                  </a>
                ))}
              </div>
            )}

            {city.chance.remoteJobs.length > 0 && (
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 5 }}>🌐 全球远程平台</div>
                {city.chance.remoteJobs.map(j => (
                  <a key={j.name} href={j.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#fff8e8', border: '0.5px solid #e8d5a0', marginBottom: 5, textDecoration: 'none' }}>
                    <span style={{ fontSize: 11, color: '#8b6914' }}>
                      {j.name}
                      {'desc' in j && j.desc && <span style={{ color: '#b8922a', fontWeight: 400 }}> | {j.desc}</span>}
                    </span>
                    <span style={{ fontSize: 11, color: '#8b6914', flexShrink: 0, marginLeft: 6 }}>›</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 6, paddingBottom: 5, borderBottom: '0.5px solid var(--border)' }}>👥 LOCAL 本地圈子</div>
          <div style={{ background: '#f0edf8', border: '0.5px solid #cdc5e8', borderRadius: 10, padding: '9px 11px' }}>
            {'paragraph' in city.local && city.local.paragraph && (
              <div style={{ fontSize: 10, color: '#3d3020', lineHeight: 1.55, marginBottom: 10 }}>{city.local.paragraph}</div>
            )}
            {city.local.platforms.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: '#3c3489', marginBottom: 5 }}>📍 本地社群平台</div>
                {city.local.platforms.map(p => (
                  <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#ede9f8', border: '0.5px solid #cdc5e8', marginBottom: 5, textDecoration: 'none' }}>
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
                  <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: '#ede9f8', border: '0.5px solid #cdc5e8', marginBottom: 5, textDecoration: 'none' }}>
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

      {showShare && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowShare(false)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            style={{ width: '100%', background: 'var(--bg-page)', borderRadius: '18px 18px 0 0', padding: '24px 20px 36px' }}
          >
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4, textAlign: 'center' }}>
              分享 {city.name}{city.nameZh && ` ${city.nameZh}`}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
              <QRCodeSVG value={pageUrl} size={160} />
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(pageUrl)
                  .then(() => {
                    setCopyStatus('copied')
                    setTimeout(() => setCopyStatus('idle'), 2000)
                  })
                  .catch(() => {
                    setCopyStatus('failed')
                    setTimeout(() => setCopyStatus('idle'), 2000)
                  })
              }}
              style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginBottom: 10 }}
            >
              {copyStatus === 'copied' ? '已复制' : copyStatus === 'failed' ? '复制失败' : '复制链接'}
            </button>
            <button onClick={() => setShowShare(false)} style={{ width: '100%', padding: '10px', borderRadius: 12, background: 'none', border: '0.5px solid var(--border-light)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>关闭</button>
          </div>
        </div>
      )}

      {showSoulModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSoulModal(false)
          }}
        >
          <FocusTrap active={showSoulModal} focusTrapOptions={{ escapeDeactivates: false }}>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="soul-modal-title"
              style={{ position: 'relative', width: '100%', maxWidth: 500, maxHeight: '80vh', background: '#faeeda', border: '0.5px solid #e8c98a', borderRadius: 16, padding: '20px', overflow: 'auto' }}
            >
            <button
              onClick={() => setShowSoulModal(false)}
              aria-label="关闭"
              style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, border: 'none', background: 'rgba(61, 32, 16, 0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#3d2010', cursor: 'pointer', lineHeight: 1 }}
            >
              ×
            </button>

            <div id="soul-modal-title" style={{ fontSize: 16, fontWeight: 500, color: '#3d2010', marginBottom: 16, paddingRight: 40 }}>
              🌍 {city.name}{city.nameZh && ` ${city.nameZh}`} 的灵魂
            </div>

            {('personality' in city.soul && city.soul.personality) || ('economy' in city.soul && city.soul.economy) || ('festivals' in city.soul && city.soul.festivals) || ('figures' in city.soul && city.soul.figures) ? (
              <>
                {'personality' in city.soul && city.soul.personality && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#854f0b', marginBottom: 6 }}>文化性格</div>
                    <div style={{ fontSize: 11, color: '#3d2010', lineHeight: 1.6 }}>{city.soul.personality}</div>
                  </div>
                )}

                {'economy' in city.soul && city.soul.economy && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#854f0b', marginBottom: 6 }}>经济支柱</div>
                    <div style={{ fontSize: 11, color: '#3d2010', lineHeight: 1.6 }}>{city.soul.economy}</div>
                  </div>
                )}

                {'festivals' in city.soul && city.soul.festivals && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#854f0b', marginBottom: 6 }}>节庆活动</div>
                    <div style={{ fontSize: 11, color: '#3d2010', lineHeight: 1.6 }}>{city.soul.festivals}</div>
                  </div>
                )}

                {'figures' in city.soul && city.soul.figures && (
                  <div style={{ marginBottom: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#854f0b', marginBottom: 6 }}>代表人物</div>
                    <div style={{ fontSize: 11, color: '#3d2010', lineHeight: 1.6 }}>{city.soul.figures}</div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize: 11, color: '#3d2010', lineHeight: 1.6 }}>
                <div style={{ marginBottom: 8 }}>{city.soul.headline}</div>
                {'body' in city.soul && city.soul.body && (
                  <div style={{ color: '#854f0b', marginTop: 8 }}>{city.soul.body}</div>
                )}
              </div>
            )}
          </div>
          </FocusTrap>
        </div>
      )}

      {showBaseModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowBaseModal(false)
          }}
        >
          <FocusTrap active={showBaseModal} focusTrapOptions={{ escapeDeactivates: false }}>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="base-modal-title"
              style={{ position: 'relative', width: '100%', maxWidth: 500, maxHeight: '80vh', background: '#f0f8f0', border: '0.5px solid #a8d5a8', borderRadius: 16, padding: '20px', overflow: 'auto' }}
            >
              <button
                onClick={() => setShowBaseModal(false)}
                aria-label="关闭"
                style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, border: 'none', background: 'rgba(107, 142, 35, 0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#6b8e23', cursor: 'pointer', lineHeight: 1 }}
              >
                ×
              </button>

              <div id="base-modal-title" style={{ fontSize: 16, fontWeight: 500, color: '#2d5016', marginBottom: 16, paddingRight: 40 }}>
                🌿 {city.name}{city.nameZh && ` ${city.nameZh}`} 的生存基准
              </div>

              {('safety' in city.base && city.base.safety) || ('dailyCost' in city.base && city.base.dailyCost) || ('visaDetail' in city.base && city.base.visaDetail) || ('society' in city.base && city.base.society) ? (
                <>
                  {'visaDetail' in city.base && city.base.visaDetail && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#6b8e23', marginBottom: 6 }}>签证政策</div>
                      <div style={{ fontSize: 11, color: '#2d5016', lineHeight: 1.6 }}>{city.base.visaDetail}</div>
                    </div>
                  )}

                  {'dailyCost' in city.base && city.base.dailyCost && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#6b8e23', marginBottom: 6 }}>每日花销</div>
                      <div style={{ fontSize: 11, color: '#2d5016', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{city.base.dailyCost}</div>
                    </div>
                  )}

                  {'safety' in city.base && city.base.safety && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#6b8e23', marginBottom: 6 }}>治安与安全</div>
                      <div style={{ fontSize: 11, color: '#2d5016', lineHeight: 1.6 }}>{city.base.safety}</div>
                    </div>
                  )}

                  {'society' in city.base && city.base.society && (
                    <div style={{ marginBottom: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#6b8e23', marginBottom: 6 }}>社会运转</div>
                      <div style={{ fontSize: 11, color: '#2d5016', lineHeight: 1.6 }}>{city.base.society}</div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 11, color: '#2d5016', lineHeight: 1.6 }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#6b8e23', marginBottom: 6 }}>签证政策</div>
                    <div>{city.base.visa}</div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#6b8e23', marginBottom: 6 }}>每日花销</div>
                    <div>{city.base.cost}</div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#6b8e23', marginBottom: 6 }}>治安安全</div>
                    <div>{city.base.safety}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#6b8e23', marginBottom: 6 }}>社会运转</div>
                    <div>{city.base.society}</div>
                  </div>
                </div>
              )}
            </div>
          </FocusTrap>
        </div>
      )}

    </div>
  )
}
