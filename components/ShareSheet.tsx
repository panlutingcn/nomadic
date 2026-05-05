'use client'
import { useState, RefObject } from 'react'
import { generateCardPreview } from '@/lib/generateCardImage'

type Phase = 'menu' | 'generating' | 'preview'

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
  const [previewData, setPreviewData] = useState<{ dataUrl: string; file: File } | null>(null)

  if (!anchorRect) return null

  const handleClose = () => {
    setPhase('menu')
    setPreviewData(null)
    setCopyStatus('idle')
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
      setPreviewData(data)
      setPhase('preview')
    } catch (err) {
      console.error('Card generation failed:', err)
      setPhase('menu')
    }
  }

  const handleDownload = () => {
    if (!previewData) return
    const a = document.createElement('a')
    a.href = previewData.dataUrl
    a.download = 'nomadic-card.png'
    a.click()
  }

  const handleShare = async () => {
    if (!previewData) return
    const canShare = typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [previewData.file] })
    if (canShare) {
      await navigator.share({ files: [previewData.file], title: 'Nomadic 此时此地' }).catch(() => {})
    } else {
      handleDownload()
    }
  }

  // Card preview overlay
  if (phase === 'preview' && previewData) {
    return (
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}
        onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
      >
        <div style={{ position: 'relative', width: '100%', maxWidth: 375 }}>
          <button
            onClick={handleClose}
            aria-label="关闭"
            style={{ position: 'absolute', top: -40, right: 0, background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 26, cursor: 'pointer', lineHeight: 1 }}
          >×</button>
          <img
            src={previewData.dataUrl}
            alt="分享卡片"
            style={{ width: '100%', borderRadius: 16, display: 'block', boxShadow: '0 12px 48px rgba(0,0,0,0.5)' }}
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button
              onClick={handleDownload}
              style={{ flex: 1, padding: '13px', borderRadius: 12, background: 'rgba(255,255,255,0.12)', border: '0.5px solid rgba(255,255,255,0.25)', fontSize: 14, color: '#fff', cursor: 'pointer' }}
            >⬇ 下载</button>
            <button
              onClick={handleShare}
              style={{ flex: 1, padding: '13px', borderRadius: 12, background: '#1D9E75', border: 'none', fontSize: 14, color: '#fff', cursor: 'pointer', fontWeight: 600 }}
            >↗ 转发</button>
          </div>
        </div>
      </div>
    )
  }

  // Popover menu — right-aligned below the trigger button
  const top = anchorRect.bottom + 8
  const left = Math.max(8, anchorRect.right - 220)

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 299 }} onClick={handleClose} />
      <div style={{
        position: 'fixed', top, left, width: 220, zIndex: 300,
        background: 'var(--bg-page)',
        borderRadius: 14,
        boxShadow: '0 4px 24px rgba(0,0,0,0.16)',
        border: '0.5px solid var(--border-light)',
        overflow: 'hidden',
      }}>
        {showCopyLink && (
          <button
            onClick={handleSharePage}
            style={{ width: '100%', padding: '11px 14px', background: 'none', border: 'none', borderBottom: '0.5px solid var(--border)', fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, textAlign: 'left' as const }}
          >
            <span style={{ fontSize: 15 }}>🌐</span>
            <span>分享页面</span>
          </button>
        )}
        <button
          onClick={handleGenerateCard}
          disabled={phase === 'generating'}
          style={{ width: '100%', padding: '11px 14px', background: 'none', border: 'none', borderBottom: '0.5px solid var(--border)', fontSize: 13, color: 'var(--text-primary)', cursor: phase === 'generating' ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 9, textAlign: 'left' as const, opacity: phase === 'generating' ? 0.55 : 1 }}
        >
          <span style={{ fontSize: 15 }}>🖼️</span>
          <span>{phase === 'generating' ? '生成中…' : '生成卡片'}</span>
        </button>
        {showCopyLink && (
          <button
            onClick={handleCopyLink}
            style={{ width: '100%', padding: '11px 14px', background: 'none', border: 'none', fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, textAlign: 'left' as const }}
          >
            <span style={{ fontSize: 15 }}>🔗</span>
            <span>{copyStatus === 'copied' ? '已复制 ✓' : '复制链接'}</span>
          </button>
        )}
      </div>
    </>
  )
}
