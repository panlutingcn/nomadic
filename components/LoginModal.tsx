'use client'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

interface LoginModalProps {
  onClose: () => void
  onSuccess?: () => void
  redirectPath?: string
}

type Tab = 'email' | 'wechat'

export default function LoginModal({ onClose, onSuccess, redirectPath = '/' }: LoginModalProps) {
  const { sendEmailOTP, loginWithWeChat } = useAuth()
  const [show, setShow] = useState(true)
  const [tab, setTab] = useState<Tab>('wechat')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current) }
  }, [])

  const handleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setShow(false)
    closeTimerRef.current = setTimeout(onClose, 200)
  }

  const handleSendEmail = async () => {
    const trimmed = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('请输入有效的邮箱地址')
      return
    }
    setError(null)
    setLoading(true)
    const { error: err } = await sendEmailOTP(trimmed, `${window.location.origin}${redirectPath}`)
    setLoading(false)
    if (err) { setError(err); return }
    setSent(true)
  }

  const handleWechatLogin = () => {
    loginWithWeChat(redirectPath)
  }

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

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
          maxWidth: 420,
          width: '100%',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          transform: show ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 200ms ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Speech bubble tail pointing down */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          bottom: -9,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '9px solid transparent',
          borderRight: '9px solid transparent',
          borderTop: '9px solid #f0ebe0',
        }} />

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'none', border: 'none',
            fontSize: 20, color: '#9a8a6a',
            cursor: 'pointer', padding: 4, lineHeight: 1,
          }}
        >×</button>

        <div style={{ fontSize: 15, fontWeight: 600, color: '#3d3020', textAlign: 'center', marginBottom: 18 }}>
          登录 Nomadic
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {(['wechat', 'email'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); setSent(false) }}
              style={{
                flex: 1,
                padding: '7px',
                borderRadius: 8,
                border: 'none',
                background: tab === t ? 'rgba(255,255,255,0.7)' : 'transparent',
                fontSize: 12,
                color: tab === t ? '#3d3020' : '#9a8a6a',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: tab === t ? 600 : 400,
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 150ms ease',
              }}
            >
              {t === 'wechat' ? '微信登录' : '邮箱登录'}
            </button>
          ))}
        </div>

        {/* WeChat tab */}
        {tab === 'wechat' && (
          <>
            <div style={{ fontSize: 12, color: '#7a6a50', textAlign: 'center', marginBottom: 16, lineHeight: 1.6 }}>
              使用微信扫码或在微信内一键登录<br />
              <span style={{ fontSize: 11, color: '#b8a98a' }}>登录后自动导入微信昵称与头像</span>
            </div>
            <button
              onClick={handleWechatLogin}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 12,
                background: '#07C160',
                border: 'none',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path d="M7.5 3C4.46 3 2 5.24 2 8c0 1.57.77 2.97 1.97 3.9L3.5 13.5l1.8-.9c.68.19 1.43.4 2.2.4.18 0 .36 0 .54-.02A4.5 4.5 0 0 1 8 12c0-2.49 2.24-4.5 5-4.5.19 0 .37.01.55.03C12.9 5.29 10.42 3 7.5 3zm-1.5 3.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm3 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zM13 9c-2.21 0-4 1.57-4 3.5S10.79 16 13 16c.6 0 1.18-.13 1.7-.35l1.3.85-.35-1.3A3.33 3.33 0 0 0 17 12.5C17 10.57 15.21 9 13 9zm-1 2.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm2 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/>
              </svg>
              微信登录
            </button>
            <div style={{ fontSize: 10, color: '#c8bfaa', textAlign: 'center', marginTop: 10 }}>
              将跳转至微信授权页面
            </div>
          </>
        )}

        {/* Email tab */}
        {tab === 'email' && (
          <>
            {sent ? (
              <>
                <div style={{ textAlign: 'center', padding: '8px 0 16px', fontSize: 13, color: '#5a4a30', lineHeight: 1.6 }}>
                  验证邮件已发送至<br />
                  <span style={{ fontWeight: 600, color: '#3d3020' }}>{email}</span><br />
                  请点击邮件中的链接完成登录
                </div>
                <div style={{ fontSize: 11, color: '#9a8a6a', textAlign: 'center', marginBottom: 16 }}>
                  登录成功后页面会自动刷新
                </div>
                <button
                  onClick={handleClose}
                  style={{ width: '100%', padding: '9px', borderRadius: 10, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  好的，去查邮箱
                </button>
              </>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendEmail() }}
                  placeholder="输入你的邮箱"
                  style={inputStyle}
                />
                {error && <div style={{ fontSize: 11, color: '#c04040', marginBottom: 8 }}>{error}</div>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleClose}
                    style={{ flex: 1, padding: '9px', borderRadius: 10, background: 'transparent', border: '0.5px solid #c8bfaa', fontSize: 12, color: '#7a6a50', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={loading}
                    style={{ flex: 1, padding: '9px', borderRadius: 10, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? '发送中…' : '发送验证邮件'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
