'use client'
export const dynamic = 'force-static'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useUserProfile } from '@/hooks/useUserProfile'
import BottomNav from '@/components/BottomNav'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '0.5px solid #ddd4c0',
  background: '#fff',
  fontSize: 13,
  color: '#2d2418',
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: 'inherit',
}

export default function AccountPage() {
  const router = useRouter()
  const { user, loading: authLoading, updateProfile, updateEmail, resetPassword, deleteAccount, logout } = useAuth()
  const { nickname: profileNickname, avatarUrl: profileAvatar } = useUserProfile()

  const [nickname, setNickname] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [savingNickname, setSavingNickname] = useState(false)
  const [nicknameSaved, setNicknameSaved] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setNickname(profileNickname || '')
  }, [profileNickname])

  if (authLoading) return null
  if (!user) {
    router.replace('/mine')
    return null
  }

  const handleSaveNickname = async () => {
    if (!nickname.trim()) return
    setSavingNickname(true)
    setError(null)
    const { error: err } = await updateProfile({ nickname: nickname.trim() })
    setSavingNickname(false)
    if (err) { setError(err); return }
    setNicknameSaved(true)
    setTimeout(() => setNicknameSaved(false), 2000)
  }

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) return
    setError(null)
    const { error: err } = await updateEmail(newEmail.trim())
    if (err) { setError(err); return }
    setEmailSent(true)
  }

  const handleResetPassword = async () => {
    if (!user.email) return
    setError(null)
    const { error: err } = await resetPassword(user.email)
    if (err) { setError(err); return }
    setResetSent(true)
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    const { error: err } = await deleteAccount()
    setDeleting(false)
    if (err) { setError(err); return }
    router.replace('/')
  }

  const sectionTitle = (text: string) => (
    <div style={{ fontSize: 12, fontWeight: 500, color: '#8a7a62', marginBottom: 8, marginTop: 18 }}>{text}</div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '14px 16px 12px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button onClick={() => router.back()}
            style={{ fontSize: 11, color: '#8a7a62', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            ← 返回
          </button>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#2d2418' }}>账号与信息</span>
          <div style={{ width: 40 }} />
        </div>

        {/* 头像 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(29,158,117,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#1D9E75', overflow: 'hidden', marginBottom: 8 }}>
            {profileAvatar
              ? <img src={profileAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontWeight: 600 }}>{(nickname[0] || 'N').toUpperCase()}</span>
            }
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(192,64,64,0.08)', border: '0.5px solid rgba(192,64,64,0.3)', borderRadius: 10, padding: '10px 12px', marginBottom: 12, fontSize: 12, color: '#c04040' }}>
            {error}
          </div>
        )}

        {/* 昵称 */}
        {sectionTitle('昵称')}
        <div style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 12, padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="你的昵称"
            style={{ ...inputStyle, border: 'none', padding: 0, flex: 1 }}
          />
          <button
            onClick={handleSaveNickname}
            disabled={savingNickname}
            style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, background: nicknameSaved ? '#e8f5ee' : '#1D9E75', color: nicknameSaved ? '#085041' : '#fff', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          >
            {nicknameSaved ? '✓ 已保存' : savingNickname ? '保存中…' : '保存'}
          </button>
        </div>

        {/* 当前邮箱 */}
        {sectionTitle('邮箱')}
        <div style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 12, padding: '10px 13px', marginBottom: 6 }}>
          <div style={{ fontSize: 13, color: '#8a7a62' }}>{user.email ?? '未设置邮箱'}</div>
        </div>
        {!emailSent ? (
          <div style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 12, padding: '10px 13px', display: 'flex', gap: 8, marginBottom: 4 }}>
            <input
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="输入新邮箱地址"
              type="email"
              style={{ ...inputStyle, border: 'none', padding: 0, flex: 1 }}
            />
            <button
              onClick={handleUpdateEmail}
              style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, background: '#f0ebe2', color: '#4a3c28', border: '0.5px solid #ddd4c0', cursor: 'pointer', flexShrink: 0 }}
            >
              更换
            </button>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: '#1D9E75', padding: '4px 0' }}>✓ 确认邮件已发送至新邮箱，请点击链接完成更换</div>
        )}

        {/* 密码重置 */}
        {sectionTitle('密码')}
        {!resetSent ? (
          <div
            onClick={handleResetPassword}
            style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 12, padding: '12px 13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 4 }}
          >
            <span style={{ fontSize: 13, color: '#2d2418' }}>发送密码重置邮件</span>
            <span style={{ fontSize: 14, color: '#c8bfaa' }}>›</span>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: '#1D9E75', padding: '8px 0' }}>✓ 重置邮件已发送至 {user.email}</div>
        )}

        {/* 退出登录 */}
        {sectionTitle('登录状态')}
        <div
          onClick={async () => { await logout(); router.replace('/') }}
          style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 12, padding: '12px 13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 4 }}
        >
          <span style={{ fontSize: 13, color: '#2d2418' }}>退出登录</span>
          <span style={{ fontSize: 14, color: '#c8bfaa' }}>›</span>
        </div>

        {/* 删除账号 */}
        {sectionTitle('危险操作')}
        {!showDeleteConfirm ? (
          <div
            onClick={() => setShowDeleteConfirm(true)}
            style={{ background: '#fff', border: '0.5px solid #e8ccc8', borderRadius: 12, padding: '12px 13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <span style={{ fontSize: 13, color: '#c04040' }}>删除账号</span>
            <span style={{ fontSize: 14, color: '#e8ccc8' }}>›</span>
          </div>
        ) : (
          <div style={{ background: '#fff5f5', border: '0.5px solid #e8ccc8', borderRadius: 12, padding: '14px 13px' }}>
            <div style={{ fontSize: 13, color: '#2d2418', marginBottom: 8, fontWeight: 500 }}>确认删除账号？</div>
            <div style={{ fontSize: 12, color: '#8a7a62', marginBottom: 14, lineHeight: 1.6 }}>
              此操作不可撤销。你的所有印迹、收藏夹数据将被永久删除。
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{ flex: 1, padding: '10px 0', borderRadius: 10, background: '#f0ebe2', border: '0.5px solid #ddd4c0', fontSize: 13, color: '#4a3c28', cursor: 'pointer' }}
              >
                取消
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                style={{ flex: 1, padding: '10px 0', borderRadius: 10, background: '#c04040', border: 'none', fontSize: 13, color: '#fff', fontWeight: 500, cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}
              >
                {deleting ? '删除中…' : '确认删除'}
              </button>
            </div>
          </div>
        )}

        <div style={{ height: 16 }} />
      </div>

      <div style={{ height: 32 }} />
      <BottomNav />
    </div>
  )
}
