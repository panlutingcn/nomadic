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

  const finishOnboarding = () => {
    localStorage.setItem('nomadic_persona', personaKey)
    localStorage.setItem('nomadic_onboarded', 'true')
    router.replace('/')
  }

  const skipOnboarding = () => {
    localStorage.setItem('nomadic_onboarded', 'true')
    router.replace('/')
  }

  const persona = PERSONAS[personaKey]
  const progress = (currentQ / QUIZ_QUESTIONS.length) * 100
  const q = QUIZ_QUESTIONS[currentQ]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>

      {/* ── 欢迎页 ── */}
      {step === 'welcome' && (
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <svg width="110" height="130" viewBox="0 0 110 130">
              <line x1="55" y1="110" x2="38" y2="126" stroke="#6b4420" strokeWidth="2" strokeLinecap="round"/>
              <line x1="55" y1="110" x2="72" y2="126" stroke="#6b4420" strokeWidth="2" strokeLinecap="round"/>
              <line x1="55" y1="118" x2="55" y2="130" stroke="#6b4420" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M 47 110 C 45 85 46 60 49 30 L 61 30 C 64 60 65 85 63 110 Z" fill="#6b4420"/>
              <path d="M 49 65 C 38 65 22 60 16 66 C 22 62 38 68 49 70 Z" fill="#6b4420"/>
              <ellipse cx="12" cy="58" rx="11" ry="19" fill="#1D9E75" transform="rotate(-40 12 58)"/>
              <ellipse cx="22" cy="34" rx="10" ry="18" fill="#1D9E75" transform="rotate(-20 22 34)"/>
              <ellipse cx="38" cy="16" rx="9" ry="17" fill="#1D9E75" transform="rotate(-10 38 16)"/>
              <ellipse cx="55" cy="8"  rx="9" ry="17" fill="#1D9E75"/>
              <ellipse cx="72" cy="16" rx="9" ry="17" fill="#1D9E75" transform="rotate(10 72 16)"/>
              <ellipse cx="86" cy="34" rx="10" ry="18" fill="#1D9E75" transform="rotate(20 86 34)"/>
              <ellipse cx="92" cy="58" rx="11" ry="19" fill="#1D9E75" transform="rotate(40 92 58)"/>
            </svg>
          </div>
          <div style={{ fontSize: 26, fontWeight: 500, color: '#2d2418', letterSpacing: '0.04em', marginBottom: 6 }}>Nomadic</div>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: '#b8a98a' }}>Q{currentQ + 1} / {QUIZ_QUESTIONS.length}</span>
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
          <button
            onClick={() => {
              if (!user) { setShowLogin(true); return }
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({ title: `我是${persona.name}`, text: `${personaKey} · ${persona.description}`, url: window.location.origin })
              }
            }}
            style={{ width: '100%', padding: '12px 0', borderRadius: 12, background: '#f0c040', border: 'none', color: '#3d2c0a', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 10 }}
          >
            分享我的旅行人格 →
          </button>
          <button
            onClick={finishOnboarding}
            style={{ width: '100%', padding: '13px 0', borderRadius: 12, background: '#1D9E75', border: 'none', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}
          >
            进入 Nomadic
          </button>
        </div>
      )}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false)
            if (typeof navigator !== 'undefined' && navigator.share && persona) {
              navigator.share({ title: `我是${persona.name}`, text: `${personaKey} · ${persona.description}`, url: window.location.origin })
            }
          }}
          redirectPath="/onboarding"
        />
      )}
      <div style={{ height: 32 }} />
    </div>
  )
}
