'use client'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

interface LoginModalProps {
  onClose: () => void
  onSuccess?: () => void
  redirectPath?: string
}

type Screen = 'method' | 'email' | 'wechat'

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
  const { loginWithEmail, loginWithGoogle, loginWithWeChat } = useAuth()
  const [show, setShow] = useState(true)
  const [screen, setScreen] = useState<Screen>('method')
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [wechatOption, setWechatOption] = useState<'wechat' | 'custom'>('wechat')
  const [customNickname, setCustomNickname] = useState('')
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
    setLoading(true)
    setError(null)
    const { error: err } = await loginWithEmail(email.trim(), password, nickname.trim() || undefined)
    setLoading(false)
    if (err) { setError(err); return }
    onSuccess?.()
    handleClose()
  }

  const handleWechatLogin = () => {
    if (wechatOption === 'custom' && customNickname.trim()) {
      sessionStorage.setItem('nomadic_pending_nickname', customNickname.trim())
    }
    loginWithWeChat(redirectPath)
  }

  const methodCardStyle = (green = false): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 11,
    border: green ? 'none' : '1px solid #e0d8cc',
    background: green ? '#07C160' : '#fff',
    cursor: 'pointer',
    transition: 'transform 150ms ease',
    marginBottom: 8,
  })

  const wechatOptionStyle = (selected: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 11,
    border: selected ? '1.5px solid #1D9E75' : '1px solid #e0d8cc',
    background: '#fff',
    cursor: 'pointer',
    transition: 'transform 150ms ease',
    marginBottom: 8,
  })

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
              style={methodCardStyle()}
            >
              <span style={{ fontSize: 20 }}>✉</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3020' }}>邮箱登录</div>
                <div style={{ fontSize: 11, color: '#9a8a6a' }}>邮箱 + 昵称 + 密码</div>
              </div>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => loginWithGoogle(redirectPath)}
              onKeyDown={e => e.key === 'Enter' && loginWithGoogle(redirectPath)}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              style={methodCardStyle()}
            >
              <span style={{ fontSize: 20, color: '#4285F4', fontWeight: 700, fontFamily: 'sans-serif' }}>G</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3020' }}>Gmail 登录</div>
                <div style={{ fontSize: 11, color: '#9a8a6a' }}>使用 Google 账号一键登录</div>
              </div>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => setScreen('wechat')}
              onKeyDown={e => e.key === 'Enter' && setScreen('wechat')}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              style={methodCardStyle(true)}
            >
              <span style={{ fontSize: 20 }}>💬</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>微信登录</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>自动导入昵称与头像</div>
              </div>
            </div>
          </>
        )}

        {screen === 'email' && (
          <>
            <button
              onClick={() => { setScreen('method'); setError(null) }}
              style={{ background: 'none', border: 'none', color: '#7a6a50', fontSize: 12, cursor: 'pointer', marginBottom: 14, padding: 0 }}
            >← 返回</button>
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

        {screen === 'wechat' && (
          <>
            <button
              onClick={() => { setScreen('method'); setError(null) }}
              style={{ background: 'none', border: 'none', color: '#7a6a50', fontSize: 12, cursor: 'pointer', marginBottom: 14, padding: 0 }}
            >← 返回</button>

            <div
              role="button"
              tabIndex={0}
              onClick={() => setWechatOption('wechat')}
              onKeyDown={e => e.key === 'Enter' && setWechatOption('wechat')}
              style={wechatOptionStyle(wechatOption === 'wechat')}
            >
              <span style={{ fontSize: 18 }}>💬</span>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3020' }}>使用微信昵称与头像</div>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => setWechatOption('custom')}
              onKeyDown={e => e.key === 'Enter' && setWechatOption('custom')}
              style={wechatOptionStyle(wechatOption === 'custom')}
            >
              <span style={{ fontSize: 18 }}>✏️</span>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3020' }}>自定义 Nomadic 昵称</div>
            </div>

            {wechatOption === 'custom' && (
              <input
                type="text"
                value={customNickname}
                onChange={e => setCustomNickname(e.target.value)}
                placeholder="输入你的昵称"
                style={{ ...inputStyle, marginTop: 4 }}
              />
            )}

            <button
              onClick={handleWechatLogin}
              style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#07C160', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8 }}
            >
              微信登录
            </button>
          </>
        )}
      </div>
    </div>
  )
}
