'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

interface NicknamePromptProps {
  userId: string
  onComplete: (nickname: string) => void
}

export default function NicknamePrompt({ userId, onComplete }: NicknamePromptProps) {
  const { updateProfile } = useAuth()
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    const trimmed = nickname.trim()
    if (!trimmed) { setError('请输入昵称'); return }
    setLoading(true)
    await supabase.from('profiles').insert({ id: userId, nickname: trimmed })
    await updateProfile({ nickname: trimmed })
    setLoading(false)
    onComplete(trimmed)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10000,
        padding: '0 20px',
      }}
    >
      <div
        style={{
          background: '#f0ebe0',
          borderRadius: 20,
          padding: '28px 24px',
          maxWidth: 340, width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: '#3d3020', marginBottom: 6 }}>设置你的昵称</div>
        <div style={{ fontSize: 11, color: '#9a8a6a', marginBottom: 16 }}>登录成功！请设置一个昵称来完成注册。</div>
        <input
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleConfirm() }}
          placeholder="你的昵称"
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 10,
            border: '0.5px solid #c8bfaa', background: 'rgba(255,255,255,0.6)',
            fontSize: 13, color: '#3d3020', boxSizing: 'border-box',
            outline: 'none', fontFamily: 'inherit', marginBottom: 10,
          }}
        />
        {error && <div style={{ fontSize: 11, color: '#c04040', marginBottom: 8 }}>{error}</div>}
        <button
          onClick={handleConfirm}
          disabled={loading}
          style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '保存中…' : '确认'}
        </button>
      </div>
    </div>
  )
}
