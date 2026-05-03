'use client'
import { useState, RefObject } from 'react'
import { shareOrDownloadCard } from '@/lib/generateCardImage'

interface ShareSheetProps {
  isOpen: boolean
  onClose: () => void
  cardRef: RefObject<HTMLDivElement | null>
  showCopyLink?: boolean
  copyUrl?: string
}

export default function ShareSheet({ isOpen, onClose, cardRef, showCopyLink = false, copyUrl }: ShareSheetProps) {
  const [generating, setGenerating] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  if (!isOpen) return null

  const handleCopyLink = async () => {
    if (!copyUrl) return
    try {
      await navigator.clipboard.writeText(copyUrl)
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch {
      setCopyStatus('failed')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }

  const handleGenerateCard = async () => {
    if (!cardRef.current || generating) return
    setGenerating(true)
    try {
      await shareOrDownloadCard(cardRef.current)
    } catch (err) {
      console.error('Card generation failed:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{ width: '100%', background: 'var(--bg-page)', borderRadius: '18px 18px 0 0', padding: '24px 20px 40px' }}
      >
        <div style={{ width: 36, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 20px' }} />

        {showCopyLink && (
          <button
            onClick={handleCopyLink}
            style={{ width: '100%', padding: '13px', borderRadius: 12, background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', fontSize: 14, color: 'var(--text-primary)', cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <span>🔗</span>
            <span>{copyStatus === 'copied' ? '链接已复制！' : copyStatus === 'failed' ? '复制失败' : '复制链接'}</span>
          </button>
        )}

        <button
          onClick={handleGenerateCard}
          disabled={generating}
          style={{ width: '100%', padding: '13px', borderRadius: 12, background: 'var(--accent)', border: 'none', fontSize: 14, color: '#fff', cursor: generating ? 'default' : 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: generating ? 0.75 : 1 }}
        >
          <span>🖼️</span>
          <span>{generating ? '生成中…' : '生成分享卡片'}</span>
        </button>

        <button
          onClick={onClose}
          style={{ width: '100%', padding: '11px', borderRadius: 12, background: 'none', border: '0.5px solid var(--border-light)', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          关闭
        </button>
      </div>
    </div>
  )
}
