'use client'
export const dynamic = 'force-static'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QUIZ_QUESTIONS, calcPersona, computeAxisScores, PERSONAS } from '@/data/travelPersona'
import { selectCities } from '@/data/personaCities'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import LoginModal from '@/components/LoginModal'
import PersonaCard from '@/components/cards/PersonaCard'
import { generateCardImage, generateCardDataUrl, dataUrlToFile } from '@/lib/generateCardImage'

type Step = 'welcome' | 'quiz' | 'result'

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState<Step>('welcome')
  const [showLogin, setShowLogin] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string[]>>({})
  const [currentQ, setCurrentQ] = useState(0)
  const [personaKey, setPersonaKey] = useState('')
  const [axisScores, setAxisScores] = useState<Record<string, number>>({})
  const [cardSaving, setCardSaving] = useState(false)
  const [prebuiltDataUrl, setPrebuiltDataUrl] = useState<string | null>(null)
  const personaCardRef = useRef<HTMLDivElement>(null)

  // Restore result state if user navigated back from an OAuth redirect
  useEffect(() => {
    const backup = sessionStorage.getItem('nomadic_result_backup')
    if (backup) {
      try {
        const { personaKey: pk, axisScores: ax } = JSON.parse(backup) as { personaKey: string; axisScores: Record<string, number> }
        if (pk) { setPersonaKey(pk); setAxisScores(ax); setStep('result') }
      } catch { /* ignore */ }
      sessionStorage.removeItem('nomadic_result_backup')
    }
  }, [])

  useEffect(() => {
    if (step !== 'result' || !personaKey) return
    setPrebuiltDataUrl(null)
    const timer = setTimeout(async () => {
      if (!personaCardRef.current) return
      try { setPrebuiltDataUrl(await generateCardDataUrl(personaCardRef.current)) } catch { /* silent */ }
    }, 600)
    return () => clearTimeout(timer)
  }, [step, personaKey])

  const advanceOrFinish = (newAnswers: Record<number, string[]>) => {
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 280)
    } else {
      const scores = computeAxisScores(newAnswers)
      const key = calcPersona(newAnswers)
      setAxisScores(scores)
      setPersonaKey(key)
      setTimeout(() => setStep('result'), 300)
    }
  }

  const handleSingleSelect = (optionId: string) => {
    const newAnswers = { ...answers, [currentQ]: [optionId] }
    setAnswers(newAnswers)
    advanceOrFinish(newAnswers)
  }

  const handleMultiToggle = (optionId: string) => {
    const current = answers[currentQ] ?? []
    const max = QUIZ_QUESTIONS[currentQ].maxSelect ?? 2
    const next = current.includes(optionId)
      ? current.filter(id => id !== optionId)
      : current.length < max ? [...current, optionId] : current
    setAnswers({ ...answers, [currentQ]: next })
  }

  const handleMultiConfirm = () => {
    if ((answers[currentQ] ?? []).length === 0) return
    advanceOrFinish(answers)
  }

  const savePersona = () => {
    if (personaKey) {
      const uid = user?.id
      const storageKey = uid ? `nomadic_persona_${uid}` : 'nomadic_persona'
      const scoresKey = uid ? `nomadic_persona_scores_${uid}` : 'nomadic_persona_scores'
      localStorage.setItem(storageKey, personaKey)
      localStorage.setItem(scoresKey, JSON.stringify(axisScores))
      localStorage.setItem('nomadic_onboarded', 'true')
      if (uid) {
        supabase.from('profiles').update({ persona_key: personaKey }).eq('id', uid).then(() => {})
      }
    }
  }

  const finishOnboarding = () => {
    savePersona()
    router.replace('/')
  }

  const handleSaveCard = async () => {
    if (cardSaving) return
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (prebuiltDataUrl) {
      savePersona()
      if (isMobile) {
        // Synchronous base64 → File: no await before navigator.share, user gesture intact on iOS
        const file = dataUrlToFile(prebuiltDataUrl, 'nomadic-persona.png')
        const canShare = typeof navigator.share === 'function' &&
          typeof navigator.canShare === 'function' &&
          navigator.canShare({ files: [file] })
        if (canShare) {
          await navigator.share({ files: [file], title: 'nomadic-persona' }).catch(() => {})
          return
        }
        // Mobile without Web Share API → object-URL download
        const url = URL.createObjectURL(file)
        const a = document.createElement('a')
        a.href = url
        a.download = 'nomadic-persona.png'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        return
      }
      // Desktop: synchronous data-URL download
      const a = document.createElement('a')
      a.href = prebuiltDataUrl
      a.download = 'nomadic-persona.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      return
    }
    // Pre-build not ready yet: generate on click (rare, < 600 ms after result renders)
    if (!personaCardRef.current) return
    setCardSaving(true)
    savePersona()
    try {
      const file = await generateCardImage(personaCardRef.current)
      if (isMobile && typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'nomadic-persona' }).catch(() => {})
      } else {
        const url = URL.createObjectURL(file)
        const a = document.createElement('a')
        a.href = url
        a.download = 'nomadic-persona.png'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error(err)
        alert('卡片生成失败，请重试。如持续失败，可截图保存。')
      }
    } finally {
      setCardSaving(false)
    }
  }

  const skipOnboarding = () => {
    sessionStorage.setItem('nomadic_skip_remind_session', 'true')
    localStorage.setItem('nomadic_onboarded', 'true')
    router.replace('/')
  }

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ(q => q - 1)
  }

  const persona = PERSONAS[personaKey]
  const progress = (currentQ / QUIZ_QUESTIONS.length) * 100
  const q = QUIZ_QUESTIONS[currentQ]

  const dynamicCities = personaKey && Object.keys(axisScores).length > 0
    ? selectCities(personaKey, axisScores)
    : persona?.cities.map(name => ({ name, reason: persona.cityReasons[name] ?? '' })) ?? []
  const cityNames = dynamicCities.map(c => c.name)
  const cityReasons = Object.fromEntries(dynamicCities.map(c => [c.name, c.reason]))

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: step === 'result' ? 'flex-start' : 'center', padding: step === 'result' ? '28px 24px 40px' : '0 24px' }}>

      {/* ── 欢迎页 ── */}
      {step === 'welcome' && (
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <img src="/globe-icon.png" alt="globe" style={{ width: 100, height: 100, objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
            <img src="/logo-nomadic-t.png" alt="Nomadic" style={{ height: 36, width: 'auto' }} />
          </div>
          <div style={{ fontSize: 13, color: '#4a3c28', marginBottom: 4 }}>在世界各地扎根，而不只是路过。</div>
          <div style={{ height: 0.5, background: '#e2d9c8', margin: '16px 0' }} />
          <div style={{ fontSize: 13, color: '#5a4a30', lineHeight: 1.7, marginBottom: 28, textAlign: 'center' }}>
            花 1 分钟认识一下你是哪种旅行者——<br/>我们为你推荐最匹配的城市。
          </div>
          <button
            onClick={() => setStep('quiz')}
            style={{ width: '100%', padding: '13px 0', borderRadius: 12, background: '#1D9E75', border: 'none', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer', marginBottom: 10 }}
          >
            开始旅行人格测试
          </button>
          <button
            onClick={skipOnboarding}
            style={{ width: '100%', padding: '12px 0', borderRadius: 12, background: 'transparent', border: '0.5px solid #ddd4c0', color: '#8a7a62', fontSize: 14, cursor: 'pointer' }}
          >
            稍后再说，先看看
          </button>
        </div>
      )}

      {/* ── 测试题页 ── */}
      {step === 'quiz' && q && (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ height: 3, background: '#e2d9c8', borderRadius: 2, marginBottom: 24 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#1D9E75', borderRadius: 2, transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {currentQ > 0 ? (
                <button onClick={handleBack} style={{ fontSize: 12, color: '#8a7a62', background: 'none', border: '0.5px solid #ddd4c0', borderRadius: 7, padding: '3px 10px', cursor: 'pointer' }}>← 上一题</button>
              ) : (
                <span style={{ fontSize: 12, color: '#b8a98a' }}>Q{currentQ + 1} / {QUIZ_QUESTIONS.length}</span>
              )}
              {currentQ > 0 && <span style={{ fontSize: 12, color: '#b8a98a' }}>Q{currentQ + 1} / {QUIZ_QUESTIONS.length}</span>}
            </div>
            <button onClick={skipOnboarding} style={{ fontSize: 12, color: '#b8a98a', background: 'none', border: 'none', cursor: 'pointer' }}>稍后完成</button>
          </div>

          {/* 维度标签 + 多选提示 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <div style={{ display: 'inline-block', fontSize: 11, color: '#1D9E75', fontWeight: 500, background: 'rgba(29,158,117,0.1)', padding: '3px 10px', borderRadius: 6 }}>
              {q.dimension}
            </div>
            {q.type === 'multi' && (
              <div style={{ fontSize: 11, color: '#b8952a', background: 'rgba(184,149,42,0.1)', padding: '3px 10px', borderRadius: 6 }}>
                多选 · 最多 {q.maxSelect} 项
              </div>
            )}
          </div>

          <div style={{ fontSize: 16, fontWeight: 500, color: '#2d2418', lineHeight: 1.55, marginBottom: 20 }}>
            {q.question}
          </div>

          {/* 选项 */}
          {q.options.map(option => {
            const selected = answers[currentQ] ?? []
            const isSelected = selected.includes(option.id)
            const maxReached = q.type === 'multi' && selected.length >= (q.maxSelect ?? 2) && !isSelected
            return (
              <button
                key={option.id}
                onClick={() => q.type === 'single' ? handleSingleSelect(option.id) : (!maxReached && handleMultiToggle(option.id))}
                style={{
                  width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '13px 14px',
                  background: isSelected ? 'rgba(29,158,117,0.06)' : '#fff',
                  border: `0.5px solid ${isSelected ? '#1D9E75' : '#ddd4c0'}`,
                  borderRadius: 12, cursor: maxReached ? 'default' : 'pointer',
                  marginBottom: 9, opacity: maxReached ? 0.45 : 1,
                  transition: 'opacity 150ms, border-color 150ms, background 150ms',
                }}
              >
                {/* 单选：圆形radio  多选：方形checkbox */}
                {q.type === 'single' ? (
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    border: `1.5px solid ${isSelected ? '#1D9E75' : '#ddd4c0'}`,
                    background: isSelected ? '#1D9E75' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isSelected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                ) : (
                  <div style={{
                    width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                    border: `1.5px solid ${isSelected ? '#1D9E75' : '#ddd4c0'}`,
                    background: isSelected ? '#1D9E75' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isSelected && <span style={{ fontSize: 11, color: '#fff', lineHeight: 1 }}>✓</span>}
                  </div>
                )}
                <span style={{ fontSize: 14, color: '#3d3020', lineHeight: 1.5, textAlign: 'left' }}>
                  {option.text}
                </span>
              </button>
            )
          })}

          {/* 多选确认按钮 / 单选提示 */}
          {q.type === 'multi' ? (
            <button
              onClick={handleMultiConfirm}
              disabled={(answers[currentQ] ?? []).length === 0}
              style={{
                width: '100%', padding: '12px 0', marginTop: 4,
                borderRadius: 12, border: 'none',
                background: (answers[currentQ] ?? []).length > 0 ? '#1D9E75' : '#ddd4c0',
                color: '#fff', fontSize: 14, fontWeight: 500,
                cursor: (answers[currentQ] ?? []).length > 0 ? 'pointer' : 'default',
                transition: 'background 200ms',
              }}
            >
              {(answers[currentQ] ?? []).length > 0
                ? `已选 ${(answers[currentQ] ?? []).length} 项，确认下一题 →`
                : '请至少选择 1 项'}
            </button>
          ) : (
            <div style={{ fontSize: 11, color: '#b8a98a', textAlign: 'center', marginTop: 4 }}>选择后自动进入下一题</div>
          )}
        </div>
      )}

      {/* ── 结果页 ── */}
      {step === 'result' && persona && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* PersonaCard scaled to fit mobile */}
          <div style={{ transform: 'scale(0.88)', transformOrigin: 'top center', marginBottom: -80, flexShrink: 0 }}>
            <PersonaCard
              nickname=""
              avatarUrl={null}
              personaKey={personaKey}
              personaName={persona.name}
              personaEmoji={persona.emoji}
              personaTags={persona.tags}
              personaDescription={persona.description}
              personaOverview={persona.overview}
              cities={cityNames}
              cityReasons={cityReasons}
            />
          </div>
          {/* Buttons */}
          <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            <button
              onClick={handleSaveCard}
              disabled={cardSaving}
              style={{ width: '100%', padding: '13px 0', borderRadius: 12, background: '#f0c040', border: 'none', color: '#3d2800', fontSize: 15, fontWeight: 500, cursor: cardSaving ? 'default' : 'pointer', opacity: cardSaving ? 0.7 : 1 }}
            >
              {cardSaving ? '生成中…' : '保存旅行人格卡片'}
            </button>
            <button
              onClick={() => {
                savePersona()
                if (user) {
                  router.replace('/mine/persona')
                } else {
                  sessionStorage.setItem('nomadic_result_backup', JSON.stringify({ personaKey, axisScores }))
                  setShowLogin(true)
                }
              }}
              style={{ width: '100%', padding: '13px 0', borderRadius: 12, background: '#1D9E75', border: 'none', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}
            >
              {user ? '查看人格详情' : '登录解锁五大洲推荐城市'}
            </button>
          </div>
        </div>
      )}
      {/* 隐藏的 PersonaCard，供 html2canvas 截图 */}
      {step === 'result' && persona && (
        <div style={{ position: 'absolute', left: -9999, top: 0, pointerEvents: 'none' }}>
          <div ref={personaCardRef}>
            <PersonaCard
              nickname=""
              avatarUrl={null}
              personaKey={personaKey}
              personaName={persona.name}
              personaEmoji={persona.emoji}
              personaTags={persona.tags}
              personaDescription={persona.description}
              personaOverview={persona.overview}
              cities={cityNames}
              cityReasons={cityReasons}
            />
          </div>
        </div>
      )}

      {showLogin && (
        <LoginModal
          redirectPath="/mine/persona"
          onClose={() => setShowLogin(false)}
          onSuccess={async () => {
            setShowLogin(false)
            if (personaKey) {
              const { data: { session } } = await supabase.auth.getSession()
              const u = session?.user
              if (u) {
                localStorage.setItem(`nomadic_persona_${u.id}`, personaKey)
                localStorage.setItem(`nomadic_persona_scores_${u.id}`, JSON.stringify(axisScores))
                localStorage.removeItem('nomadic_persona')
                localStorage.removeItem('nomadic_persona_scores')
                localStorage.setItem('nomadic_onboarded', 'true')
                supabase.from('profiles').update({ persona_key: personaKey }).eq('id', u.id).then(() => {})
              }
            }
            router.replace('/mine/persona')
          }}
        />
      )}
    </div>
  )
}
