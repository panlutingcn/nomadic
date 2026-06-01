'use client'
export const runtime = 'edge'
import { useParams, useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useState, useRef, useEffect } from 'react'
import ShareSheet from '@/components/ShareSheet'
import ImprintCard from '@/components/cards/ImprintCard'
import LoginModal from '@/components/LoginModal'
import { CITIES } from '@/data/cities'
import { getBodyText, getDisplayTitle } from '@/lib/imprintUtils'
import { useUserProfile } from '@/hooks/useUserProfile'

const CITY_NAME_MAP: Record<string, string> = {
  Berlin: '柏林',
  Amsterdam: '阿姆斯特丹',
  Lisbon: '里斯本',
  Prague: '布拉格',
  Tallinn: '塔林',
}

const PHOTO_BG: Record<string, string> = {
  Berlin: '#ede8df',
  Amsterdam: '#e8edf0',
  Lisbon: '#e8e2d8',
  Prague: '#e8e8ed',
}

export default function ImprintDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { allPublicImprints, imprints, deleteImprint, likeImprint } = useApp()
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState<{ id: string; userId: string; author: string; content: string; createdAt: string }[]>([])
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingCommentText, setEditingCommentText] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [shareAnchor, setShareAnchor] = useState<DOMRect | null>(null)
  const [pageUrl, setPageUrl] = useState('')
  const imprintCardRef = useRef<HTMLDivElement>(null)
  const { nickname: profileNickname, avatarUrl: profileAvatar } = useUserProfile()
  const [cachedCityMeta, setCachedCityMeta] = useState<{ nameZh: string; countryZh: string; flag: string } | null>(null)

  const allImprints = [...imprints, ...allPublicImprints.filter(i => !imprints.some(u => u.id === i.id))]
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  useEffect(() => {
    setPageUrl(window.location.href)
  }, [])

  useEffect(() => {
    if (!user || !id) return
    setLiked(localStorage.getItem(`liked_${user.id}_${id}`) === '1')
  }, [user?.id, id])

  useEffect(() => {
    if (!id || id.startsWith('sample')) return
    supabase.from('comments')
      .select('id, user_id, author, content, created_at')
      .eq('imprint_id', id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setComments(data.map(c => ({
          id: c.id,
          userId: c.user_id,
          author: c.author,
          content: c.content,
          createdAt: new Date(c.created_at).toLocaleDateString('zh-CN').replace(/\//g, '.'),
        })))
      })
  }, [id])

  // Fetch flag + country from city_cache for cities not in static CITIES data
  useEffect(() => {
    if (!id) return
    const cityKey = Array.isArray(params.id) ? params.id[0] : params.id
    const imp = [...imprints, ...allPublicImprints].find(i => i.id === cityKey)
    if (!imp || imp.city in CITIES) return
    supabase.from('city_cache')
      .select('data')
      .or(`city_name.ilike.${imp.city},city_name_zh.eq.${imp.city}`)
      .maybeSingle()
      .then(({ data }) => {
        if (!data?.data) return
        const d = data.data as { cityNameZh?: string; countryZh?: string; flag?: string }
        setCachedCityMeta({
          nameZh: d.cityNameZh ?? imp.city,
          countryZh: d.countryZh ?? '',
          flag: d.flag ?? '',
        })
      })
  }, [id])

  if (!id) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 20 }}>印迹不存在</div>
        <button onClick={() => router.back()} style={{ padding: '10px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
          返回
        </button>
      </div>
    )
  }

  const imprint = allImprints.find(i => i.id === id)

  if (!imprint) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 20 }}>印迹不存在</div>
        <button
          onClick={() => router.back()}
          style={{
            padding: '10px 24px',
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          返回
        </button>
      </div>
    )
  }

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !user || submitting || id.startsWith('sample')) return
    setSubmitting(true)
    setCommentError(null)
    const { data, error } = await supabase.from('comments').insert({
      imprint_id: id,
      user_id: user.id,
      author: profileNickname ?? '探索者',
      content: commentText.trim(),
    }).select('id, created_at').single()
    setSubmitting(false)
    if (error) {
      setCommentError(`发送失败：${error.message}`)
      return
    }
    if (data) {
      setComments(prev => [...prev, {
        id: data.id,
        userId: user.id,
        author: profileNickname ?? '探索者',
        content: commentText.trim(),
        createdAt: new Date(data.created_at).toLocaleDateString('zh-CN').replace(/\//g, '.'),
      }])
      setCommentText('')
    }
  }

  const handleEditComment = (c: { id: string; content: string }) => {
    setEditingCommentId(c.id)
    setEditingCommentText(c.content)
  }

  const handleSaveEditComment = async (commentId: string) => {
    const text = editingCommentText.trim()
    if (!text) return
    const { error } = await supabase.from('comments').update({ content: text }).eq('id', commentId)
    if (!error) {
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: text } : c))
      setEditingCommentId(null)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId)
    if (!error) setComments(prev => prev.filter(c => c.id !== commentId))
  }

  const handleLike = () => {
    if (!imprint.isPublic) return
    if (!user) {
      setShowLoginModal(true)
      return
    }
    setLiked(prev => !prev)
    likeImprint(id)
  }

  const handleDelete = () => {
    deleteImprint(id)
    setShowDeleteConfirm(false)
    router.push('/mine')
  }

  const isMyImprint = imprints.some(i => i.id === id)
  const cityEntry = CITIES[imprint.city]
  const cityNameZh = CITY_NAME_MAP[imprint.city] || cityEntry?.nameZh || cachedCityMeta?.nameZh || imprint.city
  const imprintCountryZh = cityEntry?.countryZh ?? cachedCityMeta?.countryZh ?? ''
  const imprintFlag = cityEntry?.flag ?? cachedCityMeta?.flag ?? ''
  const CITY_BG: Record<string, string> = {
    Berlin: '#ede8df', Amsterdam: '#e8edf0', Lisbon: '#e8e2d8', Prague: '#e8e8ed',
  }
  const cityBg = CITY_BG[imprint.city] ?? '#ede8df'

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Top Nav — sticky 全宽，内容跟随 desktop-search-wrap 居中限宽 */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(18px) saturate(180%)', WebkitBackdropFilter: 'blur(18px) saturate(180%)', borderBottom: '0.5px solid rgba(255,255,255,0.60)' }}>
        <div className="page-inner" style={{ padding: '0 16px' }}>
          <div className="desktop-search-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <button aria-label="返回" onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-primary)' }}>←</button>
            <button aria-label="分享" onClick={(e) => setShareAnchor(e.currentTarget.getBoundingClientRect())} style={{ width: 32, height: 30, border: '0.5px solid var(--border-light)', borderRadius: 8, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: 'var(--text-secondary)', cursor: 'pointer' }}>⤴</button>
          </div>
        </div>
      </div>

      {/* 整体内容板块 — 宽度与首页搜索框一致 */}
      <div className="page-inner" style={{ padding: '0 16px' }}>
      <div className="desktop-search-wrap">

      {/* Photo / Gallery */}
      {(() => {
        const bg = PHOTO_BG[imprint.city] || '#ede8df'
        const allPhotos = imprint.photos ?? (imprint.photo ? [imprint.photo] : [])
        if (allPhotos.length === 0) return (
          <div style={{ margin: '12px 0 0', padding: 4, background: 'var(--bg-card)', borderRadius: 18, border: '0.5px solid var(--border-light)', boxShadow: '0 3px 18px rgba(0,0,0,0.07)' }}>
            <div style={{ borderRadius: 14, background: bg, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'rgba(0,0,0,0.25)' }}>
              [ 照片 ]
            </div>
          </div>
        )
        if (allPhotos.length === 1) return (
          <div style={{ margin: '12px 0 0', padding: 4, background: 'var(--bg-card)', borderRadius: 18, border: '0.5px solid var(--border-light)', boxShadow: '0 3px 18px rgba(0,0,0,0.07)' }}>
            <div style={{ borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
              <img src={allPhotos[0]} alt={imprint.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
              <div style={{ position: 'absolute', top: 10, left: 12, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', color: 'white', padding: '3px 9px', borderRadius: 6, fontSize: 11 }}>
                {cityNameZh}
              </div>
            </div>
          </div>
        )
        // Multiple photos — swipeable gallery
        return (
          <div style={{ margin: '12px 0 0', padding: 4, background: 'var(--bg-card)', borderRadius: 18, border: '0.5px solid var(--border-light)', boxShadow: '0 3px 18px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', gap: 0, borderRadius: 14, overflow: 'hidden', scrollbarWidth: 'none' }}>
              {allPhotos.map((src, idx) => (
                <div key={idx} style={{ flexShrink: 0, width: '100%', scrollSnapAlign: 'start', position: 'relative' }}>
                  <img src={src} alt={`${imprint.title} ${idx + 1}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  {idx === 0 && (
                    <div style={{ position: 'absolute', top: 10, left: 12, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', color: 'white', padding: '3px 9px', borderRadius: 6, fontSize: 11 }}>
                      {cityNameZh}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Dot indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 8, marginBottom: 2 }}>
              {allPhotos.map((_, idx) => (
                <div key={idx} style={{ width: 5, height: 5, borderRadius: '50%', background: idx === 0 ? 'var(--accent)' : 'rgba(0,0,0,0.15)' }} />
              ))}
            </div>
          </div>
        )
      })()}

      {/* Content */}
      <div style={{ padding: '20px 0' }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 16, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getDisplayTitle(imprint.narrative, imprint.title, imprint.city)}</h1>

        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--accent-text)', fontWeight: 600 }}>
            {(isMyImprint ? profileNickname : imprint.author)?.[0]?.toUpperCase() ?? 'N'}
          </div>
          <div>
            <div
              onClick={() => !isMyImprint && imprint.userId && router.push(`/user/${imprint.userId}`)}
              style={{ fontSize: 14, color: 'var(--text-primary)', cursor: (!isMyImprint && imprint.userId) ? 'pointer' : 'default' }}
            >{isMyImprint ? (profileNickname ?? '我') : (imprint.author ?? '游民')}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{imprint.createdAt}</div>
          </div>
        </div>

        {/* Narrative */}
        <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: 20, whiteSpace: 'pre-wrap' }}>
          {getBodyText(imprint.narrative, imprint.title)}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {imprint.tags.map((tag) => (
            <span key={tag} style={{ padding: '4px 10px', background: 'var(--bg-card-2)', borderRadius: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {imprint.isPublic && (
            <button
              onClick={handleLike}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                background: liked ? 'var(--accent-dim)' : 'var(--bg-card-2)',
                border: liked ? '1px solid var(--accent-border)' : '1px solid var(--border)',
                borderRadius: 8,
                fontSize: 14,
                cursor: 'pointer',
                color: liked ? 'var(--accent-text)' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              <span>{liked ? '❤️' : '🤍'}</span>
              <span>{imprint.likes ?? 0}</span>
            </button>
          )}
          <button
            onClick={(e) => setShareAnchor(e.currentTarget.getBoundingClientRect())}
            style={{
              padding: '8px 14px',
              background: 'var(--bg-card-2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 14,
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            分享
          </button>
          {isMyImprint && (
            <>
              <button
                onClick={() => router.push(`/story/edit/${id}`)}
                style={{
                  padding: '8px 14px',
                  background: 'var(--bg-card-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                编辑
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  padding: '8px 14px',
                  background: 'none',
                  border: '1px solid #f0c4c4',
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: 'pointer',
                  color: '#c04040',
                }}
              >
                删除
              </button>
            </>
          )}
        </div>

        {/* Comments */}
        {imprint.isPublic && !id.startsWith('sample') && (
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 14 }}>评论 {comments.length > 0 ? `(${comments.length})` : ''}</div>
            {comments.length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>还没有评论，来第一个留言吧</div>
            )}
            {comments.map(c => {
              const isMyComment = c.userId === user?.id
              const displayName = isMyComment ? (profileNickname ?? c.author) : c.author
              const isEditing = editingCommentId === c.id
              return (
                <div key={c.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--accent-text)', flexShrink: 0 }}>
                      {displayName[0]?.toUpperCase() ?? 'N'}
                    </div>
                    <span
                      onClick={() => c.userId && router.push(`/user/${c.userId}`)}
                      style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer' }}
                    >{displayName}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{c.createdAt}</span>
                    {isMyComment && !isEditing && (
                      <>
                        <button onClick={() => handleEditComment(c)} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer', padding: '0 2px' }}>编辑</button>
                        <button onClick={() => handleDeleteComment(c.id)} style={{ background: 'none', border: 'none', fontSize: 11, color: '#c04040', cursor: 'pointer', padding: '0 2px' }}>删除</button>
                      </>
                    )}
                  </div>
                  {isEditing ? (
                    <div style={{ paddingLeft: 34, display: 'flex', gap: 6 }}>
                      <input
                        value={editingCommentText}
                        onChange={e => setEditingCommentText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveEditComment(c.id)}
                        style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: '0.5px solid var(--border-light)', background: 'var(--bg-card)', fontSize: 13, color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }}
                        autoFocus
                      />
                      <button onClick={() => handleSaveEditComment(c.id)} style={{ padding: '7px 12px', borderRadius: 8, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>保存</button>
                      <button onClick={() => setEditingCommentId(null)} style={{ padding: '7px 10px', borderRadius: 8, background: 'var(--bg-card-2)', border: '0.5px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0 }}>取消</button>
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: 34 }}>{c.content}</div>
                  )}
                </div>
              )
            })}
            {user ? (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={commentText}
                    onChange={e => { setCommentText(e.target.value); setCommentError(null) }}
                    onKeyDown={e => e.key === 'Enter' && handleSubmitComment()}
                    placeholder="写下你的想法…"
                    style={{ flex: 1, padding: '9px 12px', borderRadius: 10, border: '0.5px solid var(--border-light)', background: 'var(--bg-card)', fontSize: 13, color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }}
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || submitting}
                    style={{ padding: '9px 16px', borderRadius: 10, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: (!commentText.trim() || submitting) ? 'not-allowed' : 'pointer', opacity: (!commentText.trim() || submitting) ? 0.5 : 1, fontFamily: 'inherit', flexShrink: 0 }}
                  >
                    {submitting ? '发送中…' : '发送'}
                  </button>
                </div>
                {commentError && (
                  <div style={{ fontSize: 12, color: '#c04040', marginTop: 6 }}>{commentError}</div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>登录后参与评论</div>
            )}
          </div>
        )}

        {/* Bottom Section */}
        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => router.push(imprint.isPublic ? '/meet' : '/vault')}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {imprint.isPublic ? '查看更多来自社区的印迹 →' : '返回我的领地 →'}
          </button>
        </div>
      </div>

      <div style={{ height: 32 }} />
      </div>{/* /desktop-search-wrap */}
      </div>{/* /page-inner */}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
          <div style={{ position: 'relative', background: '#f0ebe0', borderRadius: 14, padding: '16px 20px', maxWidth: 320, width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            {/* Speech bubble tail */}
            <div style={{
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid #f0ebe0',
            }} />

            <div style={{ fontSize: 14, fontWeight: 500, color: '#3d3020', marginBottom: 6, textAlign: 'center' }}>确认删除印迹？</div>
            <div style={{ fontSize: 11, color: '#7a6a50', marginBottom: 16, textAlign: 'center', lineHeight: 1.5 }}>删除后三天内可在垃圾桶里找回</div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                取消
              </button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: '#f0c4c4', border: '0.5px solid #c04040', color: '#c04040', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal — 未登录点赞时弹出 */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false)
            // 登录成功后自动执行点赞
            setLiked(true)
            likeImprint(id)
          }}
          redirectPath={`/imprint/${id}`}
        />
      )}

      {/* Hidden imprint card for html2canvas capture */}
      <div style={{ position: 'absolute', left: -9999, top: 0, pointerEvents: 'none' }}>
        <div ref={imprintCardRef}>
          <ImprintCard
            nickname={profileNickname ?? ''}
            avatarUrl={profileAvatar}
            photo={imprint.photo}
            title={imprint.title}
            narrative={getBodyText(imprint.narrative, imprint.title)}
            cityNameZh={cityNameZh}
            countryZh={imprintCountryZh}
            flag={imprintFlag}
            cityBgColor={cityBg}
            qrValue={`https://nomadictree.io/imprint/${id}`}
          />
        </div>
      </div>

      <ShareSheet
        anchorRect={shareAnchor}
        onClose={() => setShareAnchor(null)}
        cardRef={imprintCardRef}
        autoGenerate={true}
        copyUrl={pageUrl}
      />
    </div>
  )
}
