'use client'
export const dynamic = 'force-static'
import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { PERSONAS } from '@/data/travelPersona'
import { CITIES } from '@/data/cities'
import { useUserProfile } from '@/hooks/useUserProfile'
import BottomNav from '@/components/BottomNav'
import PersonaCard from '@/components/cards/PersonaCard'
import ShareSheet from '@/components/ShareSheet'

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

// Map Chinese city name → English key in CITIES
function findCityKey(nameZh: string): string | null {
  const entry = Object.values(CITIES).find(c => c.nameZh === nameZh)
  return entry ? entry.name : null
}

function PersonaDetailContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { nickname: profileNickname, avatarUrl: profileAvatar } = useUserProfile()
  const [personaKey, setPersonaKey] = useState('')
  const [shareAnchor, setShareAnchor] = useState<DOMRect | null>(null)
  const personaCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Support ?key=XXXX from QR code scans
    const urlKey = params.get('key')
    if (urlKey && PERSONAS[urlKey]) {
      setPersonaKey(urlKey)
    } else {
      setPersonaKey(localStorage.getItem('nomadic_persona') ?? '')
    }
  }, [params])

  const persona = PERSONAS[personaKey]

  const handleRetake = () => {
    localStorage.removeItem('nomadic_persona')
    router.push('/onboarding')
  }

  const handleCityClick = (cityZh: string) => {
    const key = findCityKey(cityZh)
    if (key) {
      // Navigate to insights with city pre-selected
      router.push(`/insights?city=${encodeURIComponent(key)}`)
    }
  }

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
              const bgColors = ['#fde4a0', '#d4ede0', '#dbd2f0', '#c8dcf0']
              const textColors = ['#854f0b', '#085041', '#3c3489', '#0c447c']
              const borderColors = ['#c8a830', '#9fd4b8', '#b8a8e0', '#84b8d8']
              return (
                <div key={char} style={{ background: bgColors[i], border: `0.5px solid ${borderColors[i]}`, borderRadius: 12, padding: '11px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: textColors[i], fontFamily: 'monospace', background: 'rgba(255,255,255,0.5)', width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {char}
                    </span>
                    <div>
                      <div style={{ fontSize: 10, color: textColors[i], opacity: 0.7 }}>{dimension}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: textColors[i] }}>{meta.label}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: textColors[i], opacity: 0.85, lineHeight: 1.5 }}>{meta.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 推荐城市 — 点击跳转城市洞察 */}
        <div style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 16, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#2d2418', marginBottom: 12 }}>为你推荐的城市</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {persona.cities.map(city => (
              <div key={city}
                onClick={() => handleCityClick(city)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(29,158,117,0.06)', border: '0.5px solid rgba(29,158,117,0.2)', borderRadius: 11, padding: '10px 13px', cursor: 'pointer' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>📍</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#2d2418', marginBottom: 2 }}>{city}</div>
                  {persona.cityReasons[city] && (
                    <div style={{ fontSize: 11, color: '#6a8a6a', lineHeight: 1.4 }}>{persona.cityReasons[city]}</div>
                  )}
                </div>
                <span style={{ fontSize: 14, color: '#1D9E75', flexShrink: 0 }}>›</span>
              </div>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <button onClick={e => setShareAnchor(e.currentTarget.getBoundingClientRect())}
          style={{ width: '100%', padding: '13px 0', borderRadius: 12, background: '#f0c040', border: 'none', color: '#3d2c0a', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 10 }}>
          分享我的旅行人格 →
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
            nickname={profileNickname}
            avatarUrl={profileAvatar}
            personaKey={personaKey}
            personaName={persona.name}
            personaEmoji={persona.emoji}
            personaTags={persona.tags}
            personaDescription={persona.description}
            personaOverview={persona.overview}
            cities={persona.cities}
            cityReasons={persona.cityReasons}
            qrUrl="https://nomadictree.io"
          />
        </div>
      </div>

      <ShareSheet
        anchorRect={shareAnchor}
        onClose={() => setShareAnchor(null)}
        cardRef={personaCardRef}
        showCopyLink={true}
        copyUrl="https://nomadictree.io"
      />
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
