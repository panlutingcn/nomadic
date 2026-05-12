'use client'
export const dynamic = 'force-static'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QUIZ_QUESTIONS, calcPersona, PERSONAS } from '@/data/travelPersona'
import { useAuth } from '@/context/AuthContext'
import LoginModal from '@/components/LoginModal'

type Step = 'welcome' | 'quiz' | 'result'

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState<Step>('welcome')
  const [showLogin, setShowLogin] = useState(false)
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({})
  const [currentQ, setCurrentQ] = useState(0)
  const [personaKey, setPersonaKey] = useState('')

  const handleAnswer = (choice: 'A' | 'B') => {
    const newAnswers = { ...answers, [currentQ]: choice }
    setAnswers(newAnswers)
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 280)
    } else {
      const key = calcPersona(newAnswers)
      setPersonaKey(key)
      setTimeout(() => setStep('result'), 300)
    }
  }

  const savePersona = () => {
    if (personaKey) {
      const storageKey = user ? `nomadic_persona_${user.id}` : 'nomadic_persona'
      localStorage.setItem(storageKey, personaKey)
      localStorage.setItem('nomadic_onboarded', 'true')
    }
  }

  const finishOnboarding = () => {
    savePersona()
    router.replace('/')
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

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>

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
            花 2 分钟认识一下你是哪种旅行者——<br/>我们为你推荐最匹配的城市。
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
          <div style={{ display: 'inline-block', fontSize: 11, color: '#1D9E75', fontWeight: 500, background: 'rgba(29,158,117,0.1)', padding: '3px 10px', borderRadius: 6, marginBottom: 14 }}>
            {q.dimension}
          </div>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#2d2418', lineHeight: 1.55, marginBottom: 24 }}>
            {q.question}
          </div>
          {(['A', 'B'] as const).map(choice => (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              style={{
                width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '14px 16px',
                background: answers[currentQ] === choice ? 'rgba(29,158,117,0.06)' : '#fff',
                border: `0.5px solid ${answers[currentQ] === choice ? '#1D9E75' : '#ddd4c0'}`,
                borderRadius: 12, cursor: 'pointer', marginBottom: 10,
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                border: `1.5px solid ${answers[currentQ] === choice ? '#1D9E75' : '#ddd4c0'}`,
                background: answers[currentQ] === choice ? '#1D9E75' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {answers[currentQ] === choice && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
              </div>
              <span style={{ fontSize: 14, color: '#3d3020', lineHeight: 1.5, textAlign: 'left' }}>
                {choice === 'A' ? q.optionA : q.optionB}
              </span>
            </button>
          ))}
          <div style={{ fontSize: 11, color: '#b8a98a', textAlign: 'center', marginTop: 8 }}>选择后自动进入下一题</div>
        </div>
      )}

      {/* ── 结果页 ── */}
      {step === 'result' && persona && (
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 12, lineHeight: 1, textAlign: 'center' }}>{persona.emoji}</div>
          <div style={{ fontSize: 12, color: '#854f0b', letterSpacing: '0.05em', marginBottom: 4 }}>你的旅行人格</div>
          <div style={{ fontSize: 24, fontWeight: 500, color: '#633806', marginBottom: 4 }}>{persona.name}</div>
          <div style={{ fontSize: 12, color: '#b8952a', marginBottom: 16 }}>{personaKey} · {persona.tags}</div>
          <div style={{ background: '#faeeda', border: '0.5px solid #e8c98a', borderRadius: 14, padding: '14px 16px', marginBottom: 20, textAlign: 'left' }}>
            <div style={{ fontSize: 13, color: '#633806', lineHeight: 1.7 }}>{persona.description}</div>
          </div>
          <div style={{ fontSize: 12, color: '#8a7a62', marginBottom: 10, textAlign: 'left' }}>根据你的人格，推荐探索这些城市</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {persona.cities.map((city: string) => (
              <span key={city} style={{ fontSize: 13, fontWeight: 500, padding: '5px 14px', borderRadius: 9, background: '#fff', color: '#1D9E75', border: '0.5px solid rgba(29,158,117,0.3)', cursor: 'pointer' }}>
                {city}
              </span>
            ))}
          </div>
          {user ? (
            <button
              onClick={() => { savePersona(); router.replace('/mine/persona') }}
              style={{ width: '100%', padding: '13px 0', borderRadius: 12, background: '#1D9E75', border: 'none', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}
            >
              查看我的旅行人格卡片 →
            </button>
          ) : (
            <>
              <button
                onClick={() => { savePersona(); setShowLogin(true) }}
                style={{ width: '100%', padding: '13px 0', borderRadius: 12, background: '#1D9E75', border: 'none', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer', marginBottom: 10 }}
              >
                登录并生成旅行人格卡片
              </button>
              <button
                onClick={finishOnboarding}
                style={{ width: '100%', padding: '11px 0', borderRadius: 12, background: 'transparent', border: 'none', color: '#8a7a62', fontSize: 13, cursor: 'pointer' }}
              >
                先逛逛，稍后保存
              </button>
            </>
          )}
        </div>
      )}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false)
            router.replace('/mine/persona')
          }}
          redirectPath="/mine/persona"
        />
      )}
      <div style={{ height: 32 }} />
    </div>
  )
}
