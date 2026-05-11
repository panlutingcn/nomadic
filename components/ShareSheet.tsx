'use client'
import { useState, RefObject } from 'react'
import { generateCardPreview } from '@/lib/generateCardImage'

type Phase = 'menu' | 'generating' | 'preview'
type SaveStatus = 'idle' | 'saving' | 'saved'

interface ShareSheetProps {
  anchorRect: DOMRect | null
  onClose: () => void
  cardRef: RefObject<HTMLDivElement | null>
  showCopyLink?: boolean
  copyUrl?: string
}

export default function ShareSheet({ anchorRect, onClose, cardRef, showCopyLink = false, copyUrl }: ShareSheetProps) {
  const [phase, setPhase] = useState<Phase>('menu')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')
  const [previewData, setPreviewData] = useState<{ dataUrl: string; file: File; blobUrl: string } | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

  if (!anchorRect) return null

  const handleClose = () => {
    if (previewData?.blobUrl) URL.revokeObjectURL(previewData.blobUrl)
    setPhase('menu')
    setPreviewData(null)
    setCopyStatus('idle')
    setSaveStatus('idle')
    onClose()
  }

  const handleSharePage = async () => {
    if (!copyUrl) return
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: 'Nomadic 此时此地', url: copyUrl })
      } else {
        await navigator.clipboard.writeText(copyUrl)
        setCopyStatus('copied')
        setTimeout(() => { setCopyStatus('idle'); handleClose() }, 1200)
        return
      }
    } catch { /* user cancelled */ }
    handleClose()
  }

  const handleCopyLink = async () => {
    if (!copyUrl) return
    try {
      await navigator.clipboard.writeText(copyUrl)
      setCopyStatus('copied')
      setTimeout(() => { setCopyStatus('idle'); handleClose() }, 1200)
    } catch {
      handleClose()
    }
  }

  const handleGenerateCard = async () => {
    if (!cardRef.current) return
    setPhase('generating')
    try {
      const data = await generateCardPreview(cardRef.current)
      const blobUrl = URL.createObjectURL(data.file)
      setPreviewData({ ...data, blobUrl })
      setPhase('preview')
    } catch (err) {
      console.error('Card generation failed:', err)
      setPhase('menu')
    }
  }

  const handleDownloadClick = () => {
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus('idle'), 2500)
  }

  const handleForward = async () => {
    if (!previewData) return

    // Attempt image file share first (works in most mobile browsers)
    try {
      if (
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [previewData.file] })
      ) {
        await navigator.share({ files: [previewData.file], title: 'Nomadic 此时此地' })
        return
      }
    } catch (err) {
      // AbortError = user cancelled, stop here
      if (err instanceof Error && err.name === 'AbortError') return
      // Other errors (e.g. WeChat iOS crashes on file shares) — fall through to URL-only share
    }

    // Fallback: share page URL — WeChat and other apps handle links reliably
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({
          title: 'Nomadic 此时此地',
          text: '探索你的游牧生活方式',
          url: copyUrl || 'https://nomadictree.io',
        })
      } else if (previewData?.blobUrl) {
        const a = document.createElement('a')
        a.href = previewData.blobUrl
        a.download = 'nomadic-card.png'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch { /* user cancelled */ }
  }

  // Card preview overlay
  if (phase === 'preview' && previewData) {
    return (
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}
        onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
      >
        <div style={{ width: '100%', maxWidth: 375 }}>
          <img
            src={previewData.dataUrl}
            alt="分享卡片"
            style={{ width: '100%', borderRadius: 16, display: 'block', boxShadow: '0 12px 48px rgba(0,0,0,0.5)' }}
          />

          {saveStatus === 'saved' && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 10 }}>
              已保存 ✓
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: saveStatus === 'saved' ? 8 : 16 }}>
            <a
              href={previewData.blobUrl}
              download="nomadic-card.png"
              onClick={handleDownloadClick}
              style={{
                flex: 1, padding: '13px', borderRadius: 12,
                background: '#f0c040', border: 'none',
                fontSize: 14, color: '#3d2c0a', cursor: 'pointer', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              保存
            </a>
            <button
              onClick={handleForward}
              style={{
                flex: 1, padding: '13px', borderRadius: 12,
                background: '#166b4c', border: 'none',
                fontSize: 14, color: '#fff', cursor: 'pointer', fontWeight: 600,
              }}
            >
              分享
            </button>
            <button
              onClick={handleClose}
              style={{
                flex: 1, padding: '13px', borderRadius: 12,
                background: 'rgba(255,255,255,0.12)', border: '0.5px solid rgba(255,255,255,0.25)',
                fontSize: 14, color: '#fff', cursor: 'pointer',
              }}
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Popover menu — below trigger button, right-edge aligned
  const top = anchorRect.bottom + 8
  const right = window.innerWidth - anchorRect.right

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 299 }} onClick={handleClose} />
      <div style={{
        position: 'fixed',
        top,
        right,
        width: 'max-content',
        minWidth: 120,
        zIndex: 300,
        background: 'var(--bg-page)',
        borderRadius: 14,
        boxShadow: '0 4px 24px rgba(0,0,0,0.16)',
        border: '0.5px solid var(--border-light)',
        overflow: 'hidden',
      }}>
        <button
          onClick={handleGenerateCard}
          disabled={phase === 'generating'}
          style={{
            width: '100%', padding: '11px 24px',
            background: 'none', border: 'none',
            borderBottom: showCopyLink ? '0.5px solid var(--border)' : 'none',
            fontSize: 13, color: 'var(--text-primary)',
            cursor: phase === 'generating' ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
            whiteSpace: 'nowrap', opacity: phase === 'generating' ? 0.55 : 1,
          }}
        >
          <span style={{ fontSize: 15 }}>🖼️</span>
          <span>{phase === 'generating' ? '生成中…' : '生成卡片'}</span>
        </button>
        {showCopyLink && (
          <button
            onClick={handleCopyLink}
            style={{
              width: '100%', padding: '11px 24px',
              background: 'none', border: 'none',
              fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: 15 }}>🔗</span>
            <span>{copyStatus === 'copied' ? '已复制 ✓' : '复制链接'}</span>
          </button>
        )}
      </div>
    </>
  )
}
