'use client'
export const runtime = 'edge'
import { useParams, useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { useState, useRef, useEffect } from 'react'

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
  const { allPublicImprints, imprints, deleteImprint } = useApp()
  const [showToast, setShowToast] = useState(false)
  const [liked, setLiked] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  const allImprints = [...imprints, ...allPublicImprints.filter(i => !imprints.some(u => u.id === i.id))]
  const id = Array.isArray(params.id) ? params.id[0] : params.id

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

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: imprint.title, url })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setShowToast(true)
        toastTimer.current = setTimeout(() => setShowToast(false), 3000)
      } catch (err) {
        // Non-HTTPS or clipboard access denied
      }
    }
  }

  const handleLike = () => {
    if (imprint.isPublic) {
      setLiked(!liked)
    }
  }

  const handleDelete = () => {
    deleteImprint(id)
    setShowDeleteConfirm(false)
    router.push('/vault')
  }

  const isMyImprint = imprints.some(i => i.id === id)
  const cityNameZh = CITY_NAME_MAP[imprint.city] || imprint.city

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Top Nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-page)', borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button aria-label="返回" onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-primary)' }}>←</button>
        <button aria-label="分享" onClick={handleShare} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-primary)' }}>⤴</button>
      </div>

      {/* Photo */}
      {(() => {
        const bg = PHOTO_BG[imprint.city] || '#ede8df'
        return (
          <div style={{ position: 'relative', height: 240, overflow: 'hidden', background: bg }}>
            {imprint.photo ? (
              <img src={imprint.photo} alt={imprint.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'rgba(0,0,0,0.3)' }}>
                [ 照片 ]
              </div>
            )}
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px', borderRadius: 6, fontSize: 12 }}>
              {cityNameZh}
            </div>
          </div>
        )
      })()}

      {/* Content */}
      <div style={{ padding: '20px 16px' }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 16, color: 'var(--text-primary)' }}>{imprint.title}</h1>

        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--accent-text)' }}>
            {imprint.author?.[1] ?? 'N'}
          </div>
          <div>
            <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{imprint.author || '我'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{imprint.createdAt}</div>
          </div>
        </div>

        {/* Narrative */}
        <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: 20, whiteSpace: 'pre-wrap' }}>
          {imprint.narrative}
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
              <span>{(imprint.likes || 0) + (liked ? 1 : 0)}</span>
            </button>
          )}
          <button
            onClick={handleShare}
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

      {/* Toast */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: 8,
          fontSize: 14,
          zIndex: 1000,
        }}>
          链接已复制
        </div>
      )}

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
    </div>
  )
}
