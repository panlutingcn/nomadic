'use client'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

interface LoginModalProps {
  onClose: () => void
  onSuccess?: () => void
  redirectPath?: string
}

type Screen = 'method' | 'email'

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

export default function LoginModal({ onClose, onSuccess, redirectPath = '/vault' }: LoginModalProps) {
  const { loginWithEmail, loginWithGoogle } = useAuth()
  const [show, setShow] = useState(true)
  const [screen, setScreen] = useState<Screen>('method')
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
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
    const { error: err, needsConfirmation } = await loginWithEmail(email.trim(), password, nickname.trim() || undefined)
    setLoading(false)
    if (err) { setError(err); return }
    if (needsConfirmation) { setEmailSent(true); return }
    onSuccess?.()
    handleClose()
  }

  const methodCardStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px',
    borderRadius: 11,
    border: '1px solid #e0d8cc',
    background: '#fff',
    cursor: 'pointer',
    transition: 'transform 150ms ease',
    marginBottom: 8,
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
        <button
          onClick={handleClose}
          style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 20, color: '#9a8a6a', cursor: 'pointer', padding: 4, lineHeight: 1 }}
          aria-label="关闭"
        >×</button>

        <div style={{ fontSize: 15, fontWeight: 600, color: '#3d3020', textAlign: 'center', marginBottom: 18 }}>
          登录 Nomadic
        </div>

        {screen === 'method' && (
          <>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setScreen('email')}
              onKeyDown={e => e.key === 'Enter' && setScreen('email')}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              style={methodCardStyle}
            >
              <span style={{ fontSize: 18 }}>📧</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#3d3020' }}>邮箱登录</span>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => loginWithGoogle(redirectPath)}
              onKeyDown={e => e.key === 'Enter' && loginWithGoogle(redirectPath)}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              style={methodCardStyle}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#3d3020' }}>Gmail 一键登录</span>
            </div>
          </>
        )}

        {screen === 'email' && (
          <>
            <button
              onClick={() => { setScreen('method'); setError(null); setEmailSent(false) }}
              style={{ background: 'none', border: 'none', color: '#7a6a50', fontSize: 12, cursor: 'pointer', marginBottom: 14, padding: 0 }}
            >← 返回</button>

            {emailSent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>✉️</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3020', marginBottom: 8 }}>确认邮件已发送</div>
                <div style={{ fontSize: 12, color: '#7a6a50', lineHeight: 1.6 }}>
                  请前往 <span style={{ fontWeight: 500, color: '#3d3020' }}>{email}</span> 点击邮件中的确认链接，完成登录。
                </div>
              </div>
            ) : (
              <>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="邮箱地址" style={inputStyle} />
                <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="昵称" style={inputStyle} />
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
                <div style={{ fontSize: 10, color: '#9a8a6a', marginBottom: 12 }}>没有账号？填写后自动创建</div>
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
      </div>
    </div>
  )
}
