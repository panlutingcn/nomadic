'use client'
export const dynamic = 'force-static'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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

export default function ResetPasswordPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = setTimeout(() => setTimedOut(true), 6000)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        if (timer) { clearTimeout(timer); timer = null }
        setReady(true)
      }
    })
    return () => { subscription.unsubscribe(); if (timer) clearTimeout(timer) }
  }, [])

  const handleSubmit = async () => {
    if (password.length < 6 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('密码至少 6 位，需包含字母和数字'); return
    }
    if (password !== confirm) {
      setError('两次密码输入不一致'); return
    }
    setLoading(true); setError(null)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setDone(true)
    setTimeout(() => router.push('/mine'), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', fontFamily: '-apple-system, PingFang SC, Microsoft YaHei, sans-serif' }}>
      <div style={{ background: '#f0ebe0', borderRadius: 20, padding: '28px 24px', maxWidth: 360, width: '100%', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <button
            onClick={() => router.push('/mine')}
            style={{ background: 'none', border: 'none', color: '#7a6a50', fontSize: 12, cursor: 'pointer', padding: 0, marginRight: 'auto' }}
          >← 返回</button>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#3d3020', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            重置密码
          </div>
          <div style={{ width: 40 }} />
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3020', marginBottom: 6 }}>密码已更新</div>
            <div style={{ fontSize: 12, color: '#7a6a50' }}>正在跳转至「我的」页面…</div>
          </div>
        ) : !ready ? (
          timedOut ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>⚠️</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#3d3020', marginBottom: 8 }}>链接已失效</div>
              <div style={{ fontSize: 12, color: '#7a6a50', lineHeight: 1.6, marginBottom: 20 }}>
                重置链接只能使用一次，或已过期。<br />请重新申请。
              </div>
              <button
                onClick={() => router.push('/')}
                style={{ padding: '8px 20px', borderRadius: 8, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
              >返回首页重新申请</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 13, color: '#7a6a50' }}>正在验证链接…</div>
            </div>
          )
        ) : (
          <>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="新密码"
              style={inputStyle}
            />
            <div style={{ fontSize: 10, color: password.length === 0 ? '#b8a98a' : (password.length >= 6 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password) ? '#1D9E75' : '#c04040'), marginBottom: 10, transition: 'color 200ms ease' }}>
              密码至少 6 位，需包含字母和数字
            </div>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
              placeholder="确认新密码"
              style={inputStyle}
            />
            {error && <div style={{ fontSize: 11, color: '#c04040', marginBottom: 8 }}>{error}</div>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#1D9E75', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, marginTop: 4 }}
            >
              {loading ? '更新中…' : '确认更新密码'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
