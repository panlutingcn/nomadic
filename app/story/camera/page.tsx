'use client'
export const runtime = 'edge'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CameraPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [cameraAvailable, setCameraAvailable] = useState(true)

  useEffect(() => {
    let active = true
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (!active) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      })
      .catch(() => setCameraAvailable(false))
    return () => {
      active = false
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      if (!blob) return
      setPreview(URL.createObjectURL(blob))
    }, 'image/jpeg', 0.9)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleRetake = () => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleConfirm = () => {
    if (!preview) return
    sessionStorage.setItem('pendingPhoto', preview)

    if (!navigator.geolocation) {
      router.push('/story')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sessionStorage.setItem('pendingGPS', JSON.stringify({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          timestamp: Date.now(),
        }))
        router.push('/story')
      },
      () => router.push('/story'),
      { timeout: 3000, maximumAge: 60000 }
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* 顶部导航 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <button
          onClick={() => router.back()}
          aria-label="关闭"
          style={{ fontSize: 22, color: '#fff', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
        >
          ✕
        </button>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>印迹</span>
        <span style={{ width: 22 }} />
      </div>

      {/* 取景框 / 预览区 */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {preview ? (
          <img src={preview} alt="预览" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : cameraAvailable ? (
          <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 36, color: '#555' }}>📷</span>
            <span style={{ fontSize: 12, color: '#666' }}>相机不可用，请从相册选择</span>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />

      {/* 底部操作栏 */}
      <div style={{ background: '#111', padding: '20px 40px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {preview ? (
          <>
            {/* 重拍 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button
                onClick={handleRetake}
                aria-label="重拍"
                style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid #666', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 22, color: '#fff' }}>✕</span>
              </button>
              <span style={{ fontSize: 10, color: '#aaa' }}>重拍</span>
            </div>
            {/* 使用 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button
                onClick={handleConfirm}
                aria-label="使用此照片"
                style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid #1d9e75', background: 'rgba(29,158,117,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 22, color: '#1d9e75' }}>✓</span>
              </button>
              <span style={{ fontSize: 10, color: '#1d9e75' }}>使用</span>
            </div>
          </>
        ) : (
          <>
            {/* 相册 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => fileRef.current?.click()}
                aria-label="从相册选择"
                style={{ width: 44, height: 44, borderRadius: 10, background: '#333', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 20 }}>🖼️</span>
              </button>
              <span style={{ fontSize: 10, color: '#aaa' }}>相册</span>
            </div>
            {/* 快门 */}
            <button
              onClick={handleCapture}
              disabled={!cameraAvailable}
              aria-label="拍照"
              style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid #fff', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: cameraAvailable ? 'pointer' : 'default', opacity: cameraAvailable ? 1 : 0.3 }}
            >
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff' }} />
            </button>
            {/* 占位 */}
            <span style={{ width: 44 }} />
          </>
        )}
      </div>
    </div>
  )
}
