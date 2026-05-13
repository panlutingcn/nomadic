'use client'
import { useState, useEffect, useRef, RefObject } from 'react'
import { generateCardPreview } from '@/lib/generateCardImage'

type Phase = 'menu' | 'generating' | 'preview'
type SaveStatus = 'idle' | 'saving' | 'saved' | 'blocked' | 'picker-stuck'

// Module-level lock: survives component unmount/remount so only one
// showSaveFilePicker dialog can ever be open at a time across the entire page.
let pickerActive = false

interface ShareSheetProps {
  anchorRect: DOMRect | null
  onClose: () => void
  cardRef: RefObject<HTMLDivElement | null>
  showCopyLink?: boolean
  copyUrl?: string
  autoGenerate?: boolean
}

export default function ShareSheet({ anchorRect, onClose, cardRef, showCopyLink = false, copyUrl, autoGenerate = false }: ShareSheetProps) {
  const [phase, setPhase] = useState<Phase>('menu')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')
  const [previewData, setPreviewData] = useState<{ dataUrl: string; file: File; blobUrl: string } | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  // Prevent double-click from calling showSaveFilePicker while dialog is already open
  const savingRef = useRef(false)

  useEffect(() => {
    if (autoGenerate && anchorRect) {
      handleGenerateCard()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorRect, autoGenerate])

  if (!anchorRect) return null

  const handleClose = () => {
    if (previewData?.blobUrl) URL.revokeObjectURL(previewData.blobUrl)
    setPhase('menu')
    setPreviewData(null)
    setCopyStatus('idle')
    setSaveStatus('idle' as SaveStatus)
    savingRef.current = false
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

  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  // Trigger a direct <a download> — works in all browsers, no user gesture needed after this point
  const triggerDirectDownload = (data: { blobUrl: string }) => {
    const a = document.createElement('a')
    a.href = data.blobUrl
    a.download = 'nomadic-card.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus('idle'), 2500)
  }

  const handleSaveClick = async () => {
    if (!previewData || savingRef.current) return
    savingRef.current = true

    try {
      // Mobile: native share sheet → fallback to direct download
      if (isMobile) {
        if (
          typeof navigator.share === 'function' &&
          typeof navigator.canShare === 'function' &&
          navigator.canShare({ files: [previewData.file] })
        ) {
          try {
            await navigator.share({ files: [previewData.file], title: 'nomadic-card' })
            setSaveStatus('saved')
            setTimeout(() => setSaveStatus('idle'), 2500)
          } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
              triggerDirectDownload(previewData)
            }
          }
        } else {
          triggerDirectDownload(previewData)
        }
        return
      }

      // Desktop: showSaveFilePicker is not supported (Safari/Firefox) → direct download
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (window as any).showSaveFilePicker !== 'function') {
        triggerDirectDownload(previewData)
        return
      }

      // Desktop Chrome/Edge: showSaveFilePicker → folder picker dialog
      // Guard against multiple dialogs accumulating in the background.
      if (pickerActive) {
        setSaveStatus('picker-stuck')
        return
      }
      pickerActive = true
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: 'nomadic-card.png',
          types: [{ description: 'PNG 图片', accept: { 'image/png': ['.png'] } }],
        })
        setSaveStatus('saving')
        const writable = await fileHandle.createWritable()
        await writable.write(previewData.file)
        await writable.close()
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2500)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // User cancelled the dialog — that's fine, just reset.
          return
        }
        console.error('[save] showSaveFilePicker failed:', err)
        setSaveStatus('blocked')
      } finally {
        pickerActive = false
      }
    } finally {
      savingRef.current = false
    }
  }

  const handleForward = async () => {
    if (!previewData) return

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
      if (err instanceof Error && err.name === 'AbortError') return
    }

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({
          title: 'Nomadic 此时此地',
          text: '探索你的游牧生活方式',
          url: copyUrl || 'https://nomadictree.io',
        })
      } else if (previewData?.blobUrl) {
        triggerDirectDownload(previewData)
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

          {saveStatus === 'picker-stuck' && (
            <div style={{ textAlign: 'center', color: '#f0c040', fontSize: 12, marginTop: 10, lineHeight: 1.6 }}>
              有一个选择窗口隐藏在浏览器后面，请按 <strong>Esc</strong> 或切换窗口找到它并关闭，再点保存重试
            </div>
          )}

          {saveStatus === 'blocked' && (
            <a
              href={previewData.blobUrl}
              download="nomadic-card.png"
              onClick={() => { setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2500) }}
              style={{
                display: 'block', textAlign: 'center', marginTop: 10,
                color: '#f0c040', fontSize: 13, cursor: 'pointer',
              }}
            >
              浏览器阻止了自动保存，请点击这里下载 ↓
            </a>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: (saveStatus === 'saved' || saveStatus === 'blocked' || saveStatus === 'picker-stuck') ? 8 : 16 }}>
            <button
              onClick={() => { setSaveStatus('idle'); handleSaveClick() }}
              disabled={saveStatus === 'saving' || saveStatus === 'blocked'}
              style={{
                flex: 1, padding: '13px', borderRadius: 12,
                background: '#f0c040', border: 'none',
                fontSize: 14, color: '#3d2c0a',
                cursor: (saveStatus === 'saving' || saveStatus === 'blocked') ? 'default' : 'pointer',
                fontWeight: 600, opacity: (saveStatus === 'saving' || saveStatus === 'blocked') ? 0.65 : 1,
              }}
            >
              {saveStatus === 'saving' ? '保存中…' : saveStatus === 'picker-stuck' ? '重试' : '保存'}
            </button>
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

  // When auto-generating, show a full-screen loader instead of the popover menu
  if (autoGenerate && (phase === 'menu' || phase === 'generating')) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>生成中…</div>
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
