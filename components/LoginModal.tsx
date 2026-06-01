'use client'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

interface LoginModalProps {
  onClose: () => void
  onSuccess?: () => void
  redirectPath?: string
}

type Screen = 'login' | 'signup' | 'forgot' | 'verify'

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

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

const WeChatIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.295.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.601-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18z" fill="#07C160"/>
    <path d="M23.547 15.9c0-3.396-3.203-6.148-7.157-6.148-4.007 0-7.21 2.75-7.21 6.148 0 3.397 3.203 6.145 7.21 6.145.826 0 1.622-.12 2.37-.33a.717.717 0 0 1 .588.08l1.556.907a.267.267 0 0 0 .137.046.243.243 0 0 0 .241-.241c0-.06-.023-.12-.04-.176l-.318-1.21a.482.482 0 0 1 .174-.544c1.493-1.101 2.449-2.748 2.449-4.677zm-9.598-.48a.959.959 0 0 1-.953-.967.96.96 0 0 1 .953-.966.96.96 0 0 1 .952.966.959.959 0 0 1-.952.967zm4.785 0a.959.959 0 0 1-.953-.967.96.96 0 0 1 .953-.966.96.96 0 0 1 .952.966.959.959 0 0 1-.952.967z" fill="#07C160"/>
  </svg>
)

const Divider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0' }}>
    <div style={{ flex: 1, height: '0.5px', background: '#d8cebc' }} />
    <span style={{ fontSize: 11, color: '#b8a98a' }}>或</span>
    <div style={{ flex: 1, height: '0.5px', background: '#d8cebc' }} />
  </div>
)

const oauthBtnStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '9px 12px',
  borderRadius: 10,
  border: '0.5px solid #c8bfaa',
  background: 'rgba(255,255,255,0.6)',
  fontSize: 13,
  color: '#3d3020',
  cursor: 'pointer',
  fontFamily: 'inherit',
  marginBottom: 8,
}

const TITLES: Record<Screen, string> = {
  login: '登录 Nomadic',
  signup: '注册 Nomadic',
  forgot: '找回密码',
  verify: '验证邮箱',
}

export default function LoginModal({ onClose, onSuccess, redirectPath = '/' }: LoginModalProps) {
  const { loginWithEmail, registerWithEmail, resendVerificationEmail, resetPassword, loginWithGoogle, loginWithWeChat } = useAuth()
  const [show, setShow] = useState(true)
  const [screen, setScreen] = useState<Screen>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authError = params.get('auth_error')
    if (authError) {
      const messages: Record<string, string> = {
        wechat_not_configured: '微信登录暂未开放，请使用邮箱或 Google 登录',
        wechat_cancelled: '微信授权已取消',
        wechat_token: '微信授权失败，请重试',
        wechat_userinfo: '获取微信用户信息失败，请重试',
        config: '第三方登录配置错误，请联系管理员',
        network: '网络错误，请重试',
        create_user: '账号创建失败，请重试',
        link: '登录链接生成失败，请重试',
      }
      setError(messages[authError] ?? '登录时出现错误，请重试')
      // Clean the URL without triggering a navigation
      const clean = new URL(window.location.href)
      clean.searchParams.delete('auth_error')
      window.history.replaceState(null, '', clean.toString())
    }
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      if (cooldownRef.current) clearInterval(cooldownRef.current)
    }
  }, [])

  const handleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setShow(false)
    closeTimerRef.current = setTimeout(onClose, 200)
  }

  const goTo = (s: Screen) => {
    setScreen(s)
    setError(null)
    setResetSent(false)
  }

  const startCooldown = () => {
    setResendCooldown(60)
    cooldownRef.current = setInterval(() => {
      setResendCooldown(n => {
        if (n <= 1) { clearInterval(cooldownRef.current!); return 0 }
        return n - 1
      })
    }, 1000)
  }

  const isValidPassword = (p: string) =>
    p.length >= 6 && /[a-zA-Z]/.test(p) && /[0-9]/.test(p)

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { setError('请填写邮箱和密码'); return }
    setLoading(true); setError(null)
    const { error: err, needsConfirmation } = await loginWithEmail(email.trim(), password)
    setLoading(false)
    if (err) { setError(err); return }
    if (needsConfirmation) { startCooldown(); goTo('verify'); return }
    onSuccess?.()
    handleClose()
  }

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) { setError('请填写邮箱和密码'); return }
    if (!isValidPassword(password)) { setError('密码至少 6 位，需包含字母和数字'); return }
    setLoading(true); setError(null)
    const { error: err } = await registerWithEmail(email.trim(), password)
    setLoading(false)
    if (err) { setError(err); return }
    startCooldown()
    goTo('verify')
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return
    setLoading(true)
    await resendVerificationEmail(email.trim())
    setLoading(false)
    startCooldown()
  }

  const handleForgot = async () => {
    if (!email.trim()) { setError('请填写邮箱'); return }
    setLoading(true); setError(null)
    const { error: err } = await resetPassword(email.trim())
    setLoading(false)
    if (err) { setError(err); return }
    setResetSent(true)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.22)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
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
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: '0.5px solid rgba(255,255,255,0.88)',
          borderRadius: 20,
          padding: '24px 20px 20px',
          maxWidth: 420, width: '100%',
          boxShadow: '0 12px 48px rgba(0,0,0,0.16), inset 0 1.5px 0 rgba(255,255,255,0.95)',
          transform: show ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 200ms ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          {screen !== 'login' ? (
            <button
              onClick={() => goTo('login')}
              style={{ background: 'none', border: 'none', color: '#7a6a50', fontSize: 12, cursor: 'pointer', padding: 0, minWidth: 40 }}
            >← 返回</button>
          ) : (
            <div style={{ minWidth: 40 }} />
          )}
          <div style={{ fontSize: 15, fontWeight: 600, color: '#3d3020' }}>{TITLES[screen]}</div>
          <button
            onClick={handleClose}
            style={{ background: 'none', border: 'none', fontSize: 20, color: '#9a8a6a', cursor: 'pointer', padding: 4, lineHeight: 1, minWidth: 40, textAlign: 'right' }}
            aria-label="关闭"
          >×</button>
        </div>

        {/* ── Login ── */}
        {screen === 'login' && (
          <>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="邮箱地址" style={inputStyle} />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
              placeholder="密码"
              style={inputStyle}
            />
            {error && <div style={{ fontSize: 11, color: '#c04040', marginBottom: 8 }}>{error}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button
                onClick={() => goTo('forgot')}
                style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--accent)', cursor: 'pointer', padding: 0 }}
              >忘记密码？</button>
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, marginBottom: 12 }}
            >
              {loading ? '登录中…' : '登录'}
            </button>
            <div style={{ textAlign: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#9a8a6a' }}>还没有账号？</span>
              <button
                onClick={() => goTo('signup')}
                style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--accent)', cursor: 'pointer', padding: '0 0 0 4px', fontFamily: 'inherit', fontWeight: 500 }}
              >立即注册</button>
            </div>
            <Divider />
            <button onClick={() => loginWithGoogle(redirectPath)} style={{ ...oauthBtnStyle, marginBottom: 0 }}>
              <GoogleIcon /><span>Google 登录</span>
            </button>
          </>
        )}

        {/* ── Signup ── */}
        {screen === 'signup' && (
          <>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="邮箱地址" style={inputStyle} />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleRegister() }}
              placeholder="密码"
              style={inputStyle}
            />
            <div style={{
              fontSize: 10, marginBottom: 10, transition: 'color 200ms ease',
              color: password.length === 0 ? '#b8a98a' : (isValidPassword(password) ? '#1D9E75' : '#c04040'),
            }}>
              密码至少 6 位，需包含字母和数字
            </div>
            {error && <div style={{ fontSize: 11, color: '#c04040', marginBottom: 8 }}>{error}</div>}
            <button
              onClick={handleRegister}
              disabled={loading}
              style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, marginBottom: 12 }}
            >
              {loading ? '注册中…' : '注册'}
            </button>
            <div style={{ textAlign: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#9a8a6a' }}>已有账号？</span>
              <button
                onClick={() => goTo('login')}
                style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--accent)', cursor: 'pointer', padding: '0 0 0 4px', fontFamily: 'inherit', fontWeight: 500 }}
              >去登录</button>
            </div>
            <Divider />
            <button onClick={() => loginWithGoogle(redirectPath)} style={{ ...oauthBtnStyle, marginBottom: 0 }}>
              <GoogleIcon /><span>Google 登录</span>
            </button>
          </>
        )}

        {/* ── Verify ── */}
        {screen === 'verify' && (
          <div style={{ textAlign: 'center', paddingTop: 4 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✉️</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3020', marginBottom: 8 }}>请验证你的邮箱</div>
            <div style={{ fontSize: 12, color: '#7a6a50', lineHeight: 1.7, marginBottom: 6 }}>
              确认邮件已发送至<br />
              <span style={{ fontWeight: 500, color: '#3d3020' }}>{email}</span>
            </div>
            <div style={{ fontSize: 12, color: '#7a6a50', marginBottom: 20 }}>
              点击邮件中的链接即可完成验证并登录。<br />
              <span style={{ fontSize: 11, color: '#b8a98a' }}>没收到？请检查垃圾邮件箱。</span>
            </div>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              style={{
                background: 'none',
                border: '0.5px solid #c8bfaa',
                borderRadius: 8,
                padding: '8px 18px',
                fontSize: 12,
                color: resendCooldown > 0 ? '#9a8a6a' : 'var(--accent)',
                cursor: resendCooldown > 0 || loading ? 'default' : 'pointer',
                fontFamily: 'inherit',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? '发送中…' : resendCooldown > 0 ? `重新发送（${resendCooldown}s）` : '重新发送验证邮件'}
            </button>
          </div>
        )}

        {/* ── Forgot ── */}
        {screen === 'forgot' && (
          resetSent ? (
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
                onKeyDown={e => { if (e.key === 'Enter') handleForgot() }}
                placeholder="邮箱地址"
                style={inputStyle}
              />
              {error && <div style={{ fontSize: 11, color: '#c04040', marginBottom: 8 }}>{error}</div>}
              <button
                onClick={handleForgot}
                disabled={loading}
                style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? '发送中…' : '发送重置邮件'}
              </button>
            </>
          )
        )}
      </div>
    </div>
  )
}
