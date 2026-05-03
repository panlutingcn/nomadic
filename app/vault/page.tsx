'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { CITIES } from '@/data/cities'
import LoginModal from '@/components/LoginModal'
import WelcomeModal from '@/components/WelcomeModal'

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000

export default function VaultPage() {
  const router = useRouter()
  const { savedCities, imprints, setSelectedCity, trashedImprints, restoreImprint, permanentlyDeleteImprint } = useApp()
  const cityZh: Record<string, string> = { Berlin: '柏林', Amsterdam: '阿姆斯特丹', Lisbon: '里斯本', Prague: '布拉格', Tallinn: '塔林' }
  const { user, updateProfile, updateEmail, deleteAccount, logout } = useAuth()

  const [showLogin, setShowLogin] = useState(false)
  const [nickname, setNickname] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editNickname, setEditNickname] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [hoverAvatar, setHoverAvatar] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) return
    const pendingNickname = sessionStorage.getItem('nomadic_pending_nickname')

    supabase.from('profiles').select('nickname, avatar_url').eq('id', user.id).single().then(async ({ data, error }) => {
      if (error || !data) {
        // Verify session is still valid server-side (catches stale session after account deletion)
        const { data: { user: validUser } } = await supabase.auth.getUser()
        if (!validUser) {
          await supabase.auth.signOut()
          return
        }
        // New user — auto-generate nickname and create profile
        const autoNickname = pendingNickname?.trim() || user.email?.split('@')[0] || 'Nomadic 用户'
        if (pendingNickname) sessionStorage.removeItem('nomadic_pending_nickname')
        await supabase.from('profiles').insert({ id: user.id, nickname: autoNickname })
        setNickname(autoNickname)
        // Send welcome email
        if (user.email) {
          fetch('/api/auth/welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, nickname: autoNickname }),
          }).catch(() => {})
        }
        // Always show welcome for new users (no localStorage dependency)
        setShowWelcome(true)
        return
      }

      // Returning user — load profile, no welcome modal
      if (pendingNickname) sessionStorage.removeItem('nomadic_pending_nickname')
      setNickname(data.nickname ?? null)
      setAvatarUrl(data.avatar_url ?? null)
    })
  }, [user?.id])

  useEffect(() => {
    if (!user) { setNickname(null); return }
  }, [user])

  useEffect(() => {
    const now = Date.now()
    trashedImprints.forEach(imp => {
      if (imp.deletedAt && now - new Date(imp.deletedAt).getTime() >= THREE_DAYS_MS) {
        permanentlyDeleteImprint(imp.id)
      }
    })
  }, [])

  const handleViewInsights = (cityName: string) => {
    setSelectedCity(cityName)
    router.push('/insights')
  }

  const handleAvatarUpload = async (file: File) => {
    if (!user) return
    setUploading(true)
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${user.id}.${ext}`
    await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    await updateProfile({ avatarUrl: publicUrl })
    setAvatarUrl(publicUrl)
    setUploading(false)
  }

  const handleSave = async () => {
    await updateProfile({ nickname: editNickname })
    setNickname(editNickname)
    setEditOpen(false)
  }

  const handleEmailBlur = async () => {
    if (editEmail && editEmail !== user?.email) {
      await updateEmail(editEmail)
      setEmailSent(true)
    }
  }

  const displayName = nickname ?? user?.user_metadata?.nickname ?? 'Nomadic 用户'
  const avatarInitial = ((nickname || user?.user_metadata?.nickname || 'N')[0] ?? 'N').toUpperCase()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '14px 16px 10px', display: 'flex', flexDirection: 'column' }}>

        {/* User info card — always shown */}
        <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 14, padding: '12px 14px', marginBottom: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          {user ? (
            <>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Avatar */}
                <div
                  style={{ position: 'relative', width: 42, height: 42, borderRadius: '50%', background: 'rgba(29,158,117,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 500, color: 'var(--accent)', flexShrink: 0, cursor: editOpen ? 'pointer' : 'default', overflow: 'hidden' }}
                  onMouseEnter={() => editOpen && setHoverAvatar(true)}
                  onMouseLeave={() => setHoverAvatar(false)}
                  onClick={() => editOpen && fileInputRef.current?.click()}
                >
                  {avatarUrl
                    ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : avatarInitial
                  }
                  {editOpen && hoverAvatar && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      📷
                    </div>
                  )}
                  {uploading && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>
                      …
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f) }}
                />

                {/* Name + stats */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}的领地</div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{savedCities.length} 个城市 · {imprints.length} 个印迹</div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => {
                      if (editOpen) {
                        setEditOpen(false)
                      } else {
                        setEditNickname(nickname ?? '')
                        setEditEmail(user?.email ?? '')
                        setEmailSent(false)
                        setDeleteConfirm(false)
                        setDeleteInput('')
                        setEditOpen(true)
                      }
                    }}
                    style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(29,158,117,0.1)', color: '#1D9E75', border: '0.5px solid rgba(29,158,117,0.3)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    {editOpen ? '收起' : '编辑'}
                  </button>
                  <button
                    onClick={() => logout()}
                    style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--bg-card-2)', color: 'var(--text-secondary)', border: '0.5px solid var(--border)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    退出
                  </button>
                </div>
              </div>

              {/* Expand panel */}
              <div style={{ maxHeight: editOpen ? 500 : 0, overflow: 'hidden', transition: 'max-height 300ms ease' }}>
                <div style={{ paddingTop: 14 }}>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>昵称</div>
                    <input
                      type="text"
                      value={editNickname}
                      onChange={e => setEditNickname(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '0.5px solid #c8bfaa', background: 'rgba(255,255,255,0.6)', fontSize: 12, color: '#3d3020', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
                    />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>邮箱</div>
                    <input
                      type="text"
                      value={editEmail}
                      onChange={e => { setEditEmail(e.target.value); setEmailSent(false) }}
                      onBlur={handleEmailBlur}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '0.5px solid #c8bfaa', background: 'rgba(255,255,255,0.6)', fontSize: 12, color: '#3d3020', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
                    />
                    {emailSent && (
                      <div style={{ fontSize: 10, color: '#1D9E75', marginTop: 4 }}>确认邮件已发送至新邮箱，点击链接后生效</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => { setEditNickname(nickname ?? ''); setEditEmail(user?.email ?? ''); setEmailSent(false); setEditOpen(false) }}
                      style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'var(--bg-card-2)', border: '0.5px solid var(--border)', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSave}
                      style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(29,158,117,0.1)', border: '0.5px solid rgba(29,158,117,0.3)', color: '#1D9E75', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
                    >
                      确认保存
                    </button>
                  </div>
                  <div style={{ marginTop: 16, paddingTop: 12, borderTop: '0.5px solid var(--border)' }}>
                    {!deleteConfirm ? (
                      <button onClick={() => setDeleteConfirm(true)} style={{ background: 'none', border: 'none', color: '#c8bfaa', fontSize: 11, cursor: 'pointer', padding: 0 }}>
                        删除账号
                      </button>
                    ) : (
                      <div>
                        <div style={{ fontSize: 11, color: '#c04040', marginBottom: 8 }}>此操作不可撤销，将永久删除你的账号与所有数据。</div>
                        <input
                          type="text"
                          value={deleteInput}
                          onChange={e => setDeleteInput(e.target.value)}
                          placeholder="输入 DELETE 确认"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '0.5px solid #c8bfaa', background: 'rgba(255,255,255,0.6)', fontSize: 12, color: '#3d3020', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', marginBottom: 8 }}
                        />
                        {deleting && deleteInput !== '__done__' && (
                          <div style={{ fontSize: 11, color: '#c04040', marginBottom: 8, textAlign: 'center' }}>账号删除中，请稍候…</div>
                        )}
                        {deleteInput === '__done__' && (
                          <div style={{ fontSize: 11, color: '#1D9E75', marginBottom: 8, textAlign: 'center', fontWeight: 500 }}>账号已删除！</div>
                        )}
                        <button
                          onClick={async () => {
                            if (deleteInput !== 'DELETE') return
                            setDeleting(true)
                            const { error } = await deleteAccount()
                            if (error) {
                              setDeleting(false)
                              return
                            }
                            setDeleteInput('__done__')
                            setTimeout(() => router.push('/'), 1500)
                          }}
                          disabled={deleteInput !== 'DELETE' || deleting}
                          style={{ width: '100%', padding: '8px', borderRadius: 8, background: deleteInput === 'DELETE' ? '#c04040' : '#f0ebe0', border: '0.5px solid #c8bfaa', color: deleteInput === 'DELETE' ? '#fff' : '#c8bfaa', fontSize: 12, cursor: (deleteInput === 'DELETE' && !deleting) ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: deleting ? 0.7 : 1 }}
                        >
                          {deleting ? '删除中…' : '确认删除'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Guest placeholder */
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--bg-card-2)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                👤
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>我的领地</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>2 个城市 · 2 个印迹</div>
              </div>
            </div>
          )}
        </div>

        {/* 收藏夹 — always shown */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>收藏夹</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{user ? savedCities.length : 2} 个城市</span>
        </div>
        {user ? (
          savedCities.length > 0 ? (
            <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '10px 12px', marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>我的城市收藏</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {savedCities.map(city => (
                  <button key={city.name} onClick={() => handleViewInsights(city.name)} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 8, background: 'var(--accent-dim)', color: 'var(--accent-text)', border: '0.5px solid var(--accent-border)', cursor: 'pointer' }}>{cityZh[city.name] ?? city.name}</button>
                ))}
              </div>
            </div>
          ) : (
            <div
              onClick={() => {
                const keys = Object.keys(CITIES)
                const city = keys[Math.floor(Math.random() * keys.length)]
                setSelectedCity(city)
                router.push('/insights')
              }}
              style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0', cursor: 'pointer' }}
            >还没有收藏的城市，去探索吧 ›</div>
          )
        ) : (
          <div style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '10px 12px', marginBottom: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>我的城市收藏</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              <button onClick={() => handleViewInsights('Berlin')} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 8, background: 'var(--accent-dim)', color: 'var(--accent-text)', border: '0.5px solid var(--accent-border)', cursor: 'pointer' }}>柏林</button>
              <button onClick={() => handleViewInsights('Amsterdam')} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 8, background: 'var(--accent-dim)', color: 'var(--accent-text)', border: '0.5px solid var(--accent-border)', cursor: 'pointer' }}>阿姆斯特丹</button>
            </div>
          </div>
        )}

        <div style={{ height: '0.5px', background: 'var(--border)', margin: '10px 0' }} />

        {/* 我的印迹 — always shown */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>我的印迹</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{user ? `${imprints.length} 个 · 最新在前` : '2 个 · 最新在前'}</span>
        </div>
        {user && imprints.length === 0 && (
          <div onClick={() => router.push('/story/camera')} style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0', cursor: 'pointer' }}>还没有发布的印迹，去探索吧 ›</div>
        )}
        {(user ? imprints : imprints.slice(0, 2)).map(imp => (
          <div key={imp.id} onClick={() => router.push(`/imprint/${imp.id}`)} style={{ display: 'flex', gap: 10, background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.03)', cursor: 'pointer' }}>
            <div style={{ width: 72, height: 64, background: 'var(--bg-card-2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {imp.photo
                ? <img src={imp.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 9, color: '#c8bfaa' }}>照片</span>
              }
            </div>
            <div style={{ padding: '8px 10px 8px 0', flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 6, fontWeight: 500, background: imp.isPublic ? 'rgba(29,158,117,0.1)' : '#f0ebe2', color: imp.isPublic ? 'var(--accent-text)' : 'var(--text-secondary)', border: `0.5px solid ${imp.isPublic ? 'rgba(29,158,117,0.2)' : 'var(--border-light)'}` }}>
                  {imp.isPublic ? '公开' : '私藏'}
                </span>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{cityZh[imp.city] ?? imp.city}</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>{imp.title}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.45 }}>{imp.narrative?.slice(0, 30)}…</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'right', marginTop: 3 }}>{imp.createdAt}</div>
            </div>
          </div>
        ))}

        {/* 垃圾桶 — only when logged in */}
        {user && trashedImprints.length > 0 && (
          <>
            <div style={{ height: '0.5px', background: 'var(--border)', margin: '16px 0 10px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>🗑️ 垃圾桶</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{trashedImprints.length} 个 · 三天后彻底删除</span>
            </div>
            {trashedImprints.map(imp => {
              const deletedTime = imp.deletedAt ? new Date(imp.deletedAt).getTime() : 0
              const remainingMs = THREE_DAYS_MS - (Date.now() - deletedTime)
              const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000))
              return (
                <div key={imp.id} style={{ display: 'flex', gap: 10, background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.03)', opacity: 0.7 }}>
                  <div style={{ width: 72, height: 64, background: 'var(--bg-card-2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {imp.photo
                      ? <img src={imp.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(50%)' }} />
                      : <span style={{ fontSize: 9, color: '#c8bfaa' }}>照片</span>
                    }
                  </div>
                  <div style={{ padding: '8px 10px 8px 0', flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                      <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 6, fontWeight: 500, background: '#f5f5f5', color: '#999', border: '0.5px solid #ddd' }}>已删除</span>
                      <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{cityZh[imp.city] ?? imp.city}</span>
                      <span style={{ fontSize: 9, color: '#c04040', marginLeft: 'auto' }}>剩余 {remainingDays} 天</span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>{imp.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.45 }}>{imp.narrative?.slice(0, 30)}…</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); restoreImprint(imp.id) }}
                        style={{ flex: 1, padding: '5px 8px', borderRadius: 6, background: 'var(--accent-dim)', border: '0.5px solid var(--accent-border)', color: 'var(--accent-text)', fontSize: 10, cursor: 'pointer', fontWeight: 500 }}
                      >
                        恢复印迹
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (confirm('确认彻底删除？此操作无法撤销')) { permanentlyDeleteImprint(imp.id) } }}
                        style={{ flex: 1, padding: '5px 8px', borderRadius: 6, background: 'none', border: '0.5px solid #f0c4c4', color: '#c04040', fontSize: 10, cursor: 'pointer' }}
                      >
                        彻底删除
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}

        {/* Login bubble — shown at bottom when not logged in, vertically centered in remaining space */}
        {!user && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <style>{`
              @keyframes border-pulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(200, 191, 170, 0); }
                50% { box-shadow: 0 0 0 4px rgba(200, 191, 170, 0.6); }
              }
            `}</style>
            <div
              onClick={() => setShowLogin(true)}
              style={{
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '0.5px solid rgba(200,191,170,0.5)',
                borderRadius: 14,
                padding: '10px 14px',
                width: 220,
                cursor: 'pointer',
                textAlign: 'center' as const,
                transition: 'transform 150ms ease',
                animation: 'border-pulse 2.6s ease-in-out infinite',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)' }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: '#3d3020', marginBottom: 2 }}>🔑 登录账号 ✦</div>
              <div style={{ fontSize: 10, color: '#7a6a50' }}>保存你的城市与印迹</div>
            </div>
          </div>
        )}
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} redirectPath="/vault" />}
      {showWelcome && (
        <WelcomeModal
          nickname={nickname ?? undefined}
          onClose={() => setShowWelcome(false)}
        />
      )}
      <BottomNav />
    </div>
  )
}
