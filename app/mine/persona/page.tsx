'use client'
export const dynamic = 'force-static'
import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { PERSONAS } from '@/data/travelPersona'
import { selectCities, getRandomGlobalCities, getRandomEuroCities, getEuroCityReason, CONTINENT_ORDER } from '@/data/personaCities'
import { CITY_GLOBAL_INFO } from '@/data/cityInfo'
import { generateCardImage } from '@/lib/generateCardImage'
import { CITIES } from '@/data/cities'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import BottomNav from '@/components/BottomNav'
import PersonaCard from '@/components/cards/PersonaCard'

const AXIS_META: Record<string, { label: string; desc: string }> = {
  S: { label: '定居型', desc: '倾向深度驻留，把一座城市磨透再离开' },
  D: { label: '漂流型', desc: '喜欢不断移动，每站都是新的开始' },
  C: { label: '文化型', desc: '被历史、艺术和人文故事驱动' },
  V: { label: '活力型', desc: '被自然、身体体验和感官刺激驱动' },
  L: { label: '独行型', desc: '享受独处，与自己相处是旅行的核心' },
  T: { label: '部落型', desc: '通过连接他人来理解世界' },
  P: { label: '计划型', desc: '出发前有完整方案，安全感来自掌控' },
  F: { label: '即兴型', desc: '随机应变，最好的事总在计划之外' },
}

const AXIS_DIMENSION: Record<string, string> = {
  S: '节奏轴', D: '节奏轴', C: '动力轴', V: '动力轴',
  L: '社交轴', T: '社交轴', P: '决策轴', F: '决策轴',
}

const AXIS_OPPOSITE: Record<string, string> = {
  S: 'D', D: 'S', C: 'V', V: 'C', L: 'T', T: 'L', P: 'F', F: 'P',
}

// Map Chinese city name → English key in CITIES
function findCityKey(nameZh: string): string | null {
  const entry = Object.values(CITIES).find(c => c.nameZh === nameZh)
  return entry ? entry.name : null
}

function PersonaDetailContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { nickname: profileNickname, avatarUrl: profileAvatar } = useUserProfile()
  const { user, loading: authLoading } = useAuth()
  const { setSearchContext, setSelectedCity } = useApp()
  const [personaKey, setPersonaKey] = useState('')
  const [storedScores, setStoredScores] = useState<Record<string, number>>({})
  const [globalCities, setGlobalCities] = useState<Record<string, string>>({})
  const [euroRandomCities, setEuroRandomCities] = useState<{ name: string; reason: string }[] | null>(null)
  const [loadingCity, setLoadingCity] = useState<string | null>(null)
  const [cardSaving, setCardSaving] = useState(false)
  const personaCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (authLoading) return
    const urlKey = params.get('key')
    if (urlKey && PERSONAS[urlKey]) {
      setPersonaKey(urlKey)
    } else {
      const uid = user?.id
      const storageKey = uid ? `nomadic_persona_${uid}` : 'nomadic_persona'
      const scoresKey = uid ? `nomadic_persona_scores_${uid}` : 'nomadic_persona_scores'
      setPersonaKey(localStorage.getItem(storageKey) ?? '')
      try {
        const raw = localStorage.getItem(scoresKey)
        if (raw) setStoredScores(JSON.parse(raw))
      } catch { /* ignore */ }
    }
  }, [params, user?.id, authLoading])

  useEffect(() => {
    if (personaKey) {
      setGlobalCities(getRandomGlobalCities(personaKey))
      setEuroRandomCities(null) // reset to axis-score selection on persona load
    }
  }, [personaKey])

  // Show persona only when: coming from a shared URL (?key=), or user is logged in with own result
  const urlKey = params.get('key')
  const persona = (urlKey || user) ? PERSONAS[personaKey] : undefined

  const handleRetake = () => {
    const storageKey = user ? `nomadic_persona_${user.id}` : 'nomadic_persona'
    localStorage.removeItem(storageKey)
    router.push('/onboarding')
  }

  const handleSaveCard = async () => {
    if (cardSaving || !personaCardRef.current) return
    setCardSaving(true)
    try {
      const file = await generateCardImage(personaCardRef.current)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (isMobile && typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'nomadic-persona' }).catch(() => {})
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if (!isMobile && typeof (window as any).showSaveFilePicker === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handle = await (window as any).showSaveFilePicker({ suggestedName: 'nomadic-persona.png', types: [{ description: 'PNG 图片', accept: { 'image/png': ['.png'] } }] })
        const writable = await handle.createWritable()
        await writable.write(file)
        await writable.close()
      } else {
        const url = URL.createObjectURL(file)
        const a = document.createElement('a')
        a.href = url
        a.download = 'nomadic-persona.png'
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') console.error(err)
    } finally {
      setCardSaving(false)
    }
  }

  const handleCityClick = async (cityZh: string) => {
    if (cityZh === '随机城市' || loadingCity) return
    // Layer 1: exact match in static DB
    const key = findCityKey(cityZh)
    if (key) {
      setSelectedCity(key)
      router.push(`/insights?city=${encodeURIComponent(key)}`)
      return
    }
    // Layer 2 & 3: not in static DB → call /api/search (fuzzy + AI + cache)
    setLoadingCity(cityZh)
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: cityZh }),
      })
      const { result } = await res.json()
      if (result) {
        setSearchContext(result)
        setSelectedCity(result.cityName)
        router.push('/insights')
      }
    } catch {
      router.push(`/search?q=${encodeURIComponent(cityZh)}`)
    } finally {
      setLoadingCity(null)
    }
  }

  const hasDynamicScores = Object.keys(storedScores).length > 0
  const dynamicCities = hasDynamicScores
    ? selectCities(personaKey, storedScores)
    : persona?.cities.map(name => ({ name, reason: persona.cityReasons[name] ?? '' })) ?? []
  const cityNames = dynamicCities.map(c => c.name)
  const cityReasons = Object.fromEntries(dynamicCities.map(c => [c.name, c.reason]))

  if (!persona) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🧭</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: '#2d2418', marginBottom: 8 }}>还没有旅行人格</div>
        <div style={{ fontSize: 13, color: '#8a7a62', marginBottom: 24 }}>完成 16 道题，解锁你的专属旅行者标签</div>
        <button onClick={() => router.push('/onboarding')}
          style={{ padding: '12px 28px', borderRadius: 12, background: '#1D9E75', border: 'none', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          开始测试
        </button>
      </div>
    )
  }

  const axisChars = personaKey.split('')

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '14px 16px 12px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button onClick={() => router.back()}
            style={{ fontSize: 11, color: '#8a7a62', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            ← 返回
          </button>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#2d2418' }}>旅行人格详情</span>
          <div style={{ width: 40 }} />
        </div>

        {/* 人格主卡 */}
        <div style={{ background: '#faeeda', border: '0.5px solid #e8c98a', borderRadius: 20, padding: '24px 20px', marginBottom: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 14, lineHeight: 1, textAlign: 'center' }}>{persona.emoji}</div>
          <div style={{ fontSize: 11, color: '#854f0b', letterSpacing: '0.08em', marginBottom: 6 }}>你的旅行人格</div>
          <div style={{ fontSize: 26, fontWeight: 500, color: '#633806', marginBottom: 4 }}>{persona.name}</div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: '#b8952a', background: 'rgba(184,149,42,0.12)', padding: '2px 10px', borderRadius: 6 }}>{personaKey}</span>
            {persona.tags.split('·').map(t => (
              <span key={t} style={{ fontSize: 12, color: '#b8952a' }}>· {t.trim()}</span>
            ))}
          </div>
          <div style={{ fontSize: 13, color: '#633806', lineHeight: 1.7, textAlign: 'left', background: 'rgba(255,255,255,0.5)', borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
            {persona.description}
          </div>
          <div style={{ fontSize: 12, color: '#7a5a2a', lineHeight: 1.75, textAlign: 'left', background: 'rgba(255,255,255,0.3)', borderRadius: 10, padding: '10px 14px' }}>
            {persona.overview}
          </div>
        </div>

        {/* 四维人格分析 */}
        <div style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 16, padding: '14px 16px', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#2d2418', marginBottom: 12 }}>四维人格分析</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {axisChars.map((char, i) => {
              const meta = AXIS_META[char]
              const dimension = AXIS_DIMENSION[char]
              const opposite = AXIS_META[AXIS_OPPOSITE[char]]
              const bgColors = ['#fde4a0', '#d4ede0', '#dbd2f0', '#c8dcf0']
              const textColors = ['#854f0b', '#085041', '#3c3489', '#0c447c']
              const borderColors = ['#c8a830', '#9fd4b8', '#b8a8e0', '#84b8d8']
              return (
                <div key={char} style={{ background: bgColors[i], border: `0.5px solid ${borderColors[i]}`, borderRadius: 12, padding: '11px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'stretch', gap: 12 }}>
                    <span style={{ fontSize: 28, fontWeight: 700, color: textColors[i], fontFamily: 'monospace', background: 'rgba(255,255,255,0.5)', width: 38, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {char}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: textColors[i], opacity: 0.65 }}>{dimension}：</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: textColors[i] }}>{meta.label}</span>
                        <span style={{ fontSize: 13, color: textColors[i], opacity: 0.4, margin: '0 4px' }}>｜</span>
                        <span style={{ fontSize: 13, color: textColors[i], opacity: 0.5 }}>{opposite.label}</span>
                      </div>
                      <div style={{ fontSize: 11, color: textColors[i], opacity: 0.85, lineHeight: 1.5 }}>{meta.desc}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 推荐城市 — 点击跳转城市洞察 */}
        <div style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 16, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#2d2418' }}>为你推荐的欧洲城市</div>
            <button
              onClick={() => setEuroRandomCities(getRandomEuroCities(personaKey))}
              style={{ fontSize: 11, color: '#1D9E75', background: 'rgba(29,158,117,0.08)', border: '0.5px solid rgba(29,158,117,0.25)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              🎲 惊喜随机掉落
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(euroRandomCities ?? dynamicCities).map(({ name: city, reason }) => {
              const isLoading = loadingCity === city
              const isDisabled = city === '随机城市'
              return (
                <div key={city}
                  onClick={() => handleCityClick(city)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, background: isLoading ? 'rgba(29,158,117,0.12)' : 'rgba(29,158,117,0.06)', border: '0.5px solid rgba(29,158,117,0.2)', borderRadius: 11, padding: '10px 13px', cursor: isDisabled ? 'default' : 'pointer', opacity: isDisabled ? 0.5 : 1, transition: 'background 150ms' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{isLoading ? '⏳' : '📍'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#2d2418', marginBottom: 2 }}>{city}</div>
                    {reason && (
                      <div style={{ fontSize: 11, color: '#6a8a6a', lineHeight: 1.4 }}>{isLoading ? 'AI 正在生成城市数据…' : reason}</div>
                    )}
                  </div>
                  <span style={{ fontSize: 14, color: '#1D9E75', flexShrink: 0 }}>{isLoading ? '' : '›'}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 五大洲推荐城市 */}
        <div style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 16, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#2d2418' }}>五大洲推荐城市</div>
            <button
              onClick={() => setGlobalCities(getRandomGlobalCities(personaKey))}
              style={{ fontSize: 11, color: '#1D9E75', background: 'rgba(29,158,117,0.08)', border: '0.5px solid rgba(29,158,117,0.25)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              🎲 惊喜随机掉落
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CONTINENT_ORDER.map(continent => {
              const city = globalCities[continent]
              if (!city) return null
              const isLoading = loadingCity === city
              const continentEmoji: Record<string, string> = { 亚洲: '🌏', 欧洲: '🌍', 美洲: '🌎', 非洲: '🌍', 大洋洲: '🌏' }
              const desc = continent === '欧洲'
                ? getEuroCityReason(personaKey, city)
                : (CITY_GLOBAL_INFO[city]?.desc ?? '')
              return (
                <div key={continent}
                  onClick={() => handleCityClick(city)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, background: isLoading ? 'rgba(29,158,117,0.12)' : 'rgba(29,158,117,0.06)', border: '0.5px solid rgba(29,158,117,0.2)', borderRadius: 11, padding: '10px 13px', cursor: 'pointer', transition: 'background 150ms' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{isLoading ? '⏳' : continentEmoji[continent]}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#2d2418', marginBottom: 2 }}>
                      <span style={{ fontWeight: 400, color: '#1D9E75' }}>{continent}｜</span>
                      {isLoading ? 'AI 生成中…' : city}
                    </div>
                    {desc && !isLoading && (
                      <div style={{ fontSize: 11, color: '#6a8a6a', lineHeight: 1.4 }}>{desc}</div>
                    )}
                    {isLoading && <div style={{ fontSize: 11, color: '#6a8a6a', lineHeight: 1.4 }}>AI 正在生成城市数据…</div>}
                  </div>
                  <span style={{ fontSize: 14, color: '#1D9E75', flexShrink: 0 }}>{isLoading ? '' : '›'}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 操作按钮 */}
        <button onClick={handleSaveCard} disabled={cardSaving}
          style={{ width: '100%', padding: '13px 0', borderRadius: 12, background: '#f0c040', border: 'none', color: '#3d2c0a', fontSize: 14, fontWeight: 500, cursor: cardSaving ? 'default' : 'pointer', opacity: cardSaving ? 0.7 : 1, marginBottom: 10 }}>
          {cardSaving ? '生成中…' : '保存旅行人格卡片'}
        </button>
        <button onClick={handleRetake}
          style={{ width: '100%', padding: '12px 0', borderRadius: 12, background: 'transparent', border: '0.5px solid #ddd4c0', color: '#8a7a62', fontSize: 13, cursor: 'pointer' }}>
          重新测试
        </button>

        {/* 底部空白 */}
        <div style={{ height: 32 }} />
      </div>

      <div style={{ height: 32 }} />
      <BottomNav />

      {/* 隐藏的 PersonaCard，用于 html2canvas */}
      <div style={{ position: 'absolute', left: -9999, top: 0, pointerEvents: 'none' }}>
        <div ref={personaCardRef}>
          <PersonaCard
            nickname={profileNickname ?? ''}
            avatarUrl={profileAvatar}
            personaKey={personaKey}
            personaName={persona.name}
            personaEmoji={persona.emoji}
            personaTags={persona.tags}
            personaDescription={persona.description}
            personaOverview={persona.overview}
            cities={cityNames}
            cityReasons={cityReasons}
            qrUrl="https://nomadictree.io"
          />
        </div>
      </div>

    </div>
  )
}

export default function PersonaDetailPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, color: '#b8a98a' }}>加载中……</span>
      </div>
    }>
      <PersonaDetailContent />
    </Suspense>
  )
}
