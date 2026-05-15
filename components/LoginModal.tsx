'use client'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

interface LoginModalProps {
  onClose: () => void
  onSuccess?: () => void
}

type Screen = 'email' | 'forgot'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '0.5px solid #c8bfaa',
  background: 'rgba(255,255,255,0.6)',
  fontSize: 13,
  color: '#3d3020',
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: 'inherit',
  marginBottom: 10,
}

export default function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const { loginWithEmail, resetPassword } = useAuth()
  const [show, setShow] = useState(true)
  const [screen, setScreen] = useState<Screen>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current) }
  }, [])

  const handleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setShow(false)
    closeTimerRef.current = setTimeout(onClose, 200)
  }

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) { setError('请填写邮箱和密码'); return }
    if (password.length < 6 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('密码至少 6 位，需包含字母和数字'); return
    }
    setLoading(true)
    setError(null)
    const { error: err, needsConfirmation } = await loginWithEmail(email.trim(), password)
    setLoading(false)
    if (err) { setError(err); return }
    if (needsConfirmation) { setEmailSent(true); return }
    onSuccess?.()
    handleClose()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
        opacity: show ? 1 : 0,
        transition: 'opacity 200ms ease',
        padding: '0 20px',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          position: 'relative',
          background: '#f0ebe0',
          borderRadius: 20,
          padding: '24px 20px 20px',
          maxWidth: 420, width: '100%',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          transform: show ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 200ms ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header row: 返回 | 登录 Nomadic | × */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          {screen === 'forgot' ? (
            <button
              onClick={() => { setScreen('email'); setError(null); setResetSent(false) }}
              style={{ background: 'none', border: 'none', color: '#7a6a50', fontSize: 12, cursor: 'pointer', padding: 0, minWidth: 40 }}
            >← 返回</button>
          ) : (
            <div style={{ minWidth: 40 }} />
          )}
          <div style={{ fontSize: 15, fontWeight: 600, color: '#3d3020' }}>登录 Nomadic</div>
          <button
            onClick={handleClose}
            style={{ background: 'none', border: 'none', fontSize: 20, color: '#9a8a6a', cursor: 'pointer', padding: 4, lineHeight: 1, minWidth: 40, textAlign: 'right' }}
            aria-label="关闭"
          >×</button>
        </div>

        {screen === 'email' && (
          <>
            {emailSent ? (
              <div style={{ textAlign: 'center', paddingTop: 4 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>✉️</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3020', marginBottom: 8 }}>确认邮件已发送</div>
                <div style={{ fontSize: 12, color: '#7a6a50', lineHeight: 1.6 }}>
                  请前往 <span style={{ fontWeight: 500, color: '#3d3020' }}>{email}</span> 点击完成登录。
                </div>
                <div style={{ height: 16 }} />
              </div>
            ) : (
              <>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="邮箱地址" style={inputStyle} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleEmailLogin() }}
                  placeholder="密码"
                  style={inputStyle}
                />
                <div style={{ fontSize: 10, color: password.length === 0 ? '#b8a98a' : (password.length >= 6 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password) ? '#1D9E75' : '#c04040'), marginBottom: 8, transition: 'color 200ms ease' }}>
                  密码至少 6 位，需包含字母和数字
                </div>
                {error && <div style={{ fontSize: 11, color: '#c04040', marginBottom: 8 }}>{error}</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 10, color: '#9a8a6a' }}>没有账号？填写后自动创建</span>
                  <button
                    onClick={() => { setScreen('forgot'); setError(null) }}
                    style={{ background: 'none', border: 'none', fontSize: 10, color: 'var(--accent)', cursor: 'pointer', padding: 0 }}
                  >忘记密码？</button>
                </div>
                <button
                  onClick={handleEmailLogin}
                  disabled={loading}
                  style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? '登录中…' : '登录 / 注册'}
                </button>
              </>
            )}
          </>
        )}

        {screen === 'forgot' && (
          <>
            {resetSent ? (
              <div style={{ textAlign: 'center', paddingTop: 4 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>📬</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3020', marginBottom: 8 }}>重置邮件已发送</div>
                <div style={{ fontSize: 12, color: '#7a6a50', lineHeight: 1.6 }}>
                  请前往 <span style={{ fontWeight: 500, color: '#3d3020' }}>{email}</span> 点击链接重置密码。
                </div>
                <div style={{ height: 16 }} />
              </div>
            ) : (
              <>
                <div style={{ fontSize: 12, color: '#7a6a50', marginBottom: 14 }}>输入注册邮箱，我们将发送重置链接。</div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="邮箱地址"
                  style={inputStyle}
                />
                {error && <div style={{ fontSize: 11, color: '#c04040', marginBottom: 8 }}>{error}</div>}
                <button
                  onClick={async () => {
                    if (!email.trim()) { setError('请填写邮箱'); return }
                    setLoading(true); setError(null)
                    const { error: err } = await resetPassword(email.trim())
                    setLoading(false)
                    if (err) { setError(err); return }
                    setResetSent(true)
                  }}
                  disabled={loading}
                  style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? '发送中…' : '发送重置邮件'}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
