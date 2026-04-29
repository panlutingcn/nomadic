# 印迹拍照入口页 & 标签限制 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 点击底部导航"印迹"按钮进入全屏拍照页，支持拍照/相册选图并确认后跳转编辑页；编辑页标签支持增删，上限 10 个

**Architecture:** 新建 `app/story/camera/page.tsx` 作为拍照入口，通过 `sessionStorage` 将图片 URL 传递给现有编辑页 `app/story/page.tsx`；BottomNav 印迹按钮改为跳转 `/story/camera`；编辑页新增标签 state 管理逻辑

**Tech Stack:** Next.js 16 App Router, React, TypeScript, Web MediaDevices API, sessionStorage

---

## File Structure

**New files:**
- `app/story/camera/page.tsx` — 全屏拍照入口页（两种状态：待拍摄 / 预览确认）

**Modified files:**
- `app/story/page.tsx` — 读取 sessionStorage pendingPhoto，替换硬编码标签为 state，添加标签增删 UI
- `components/BottomNav.tsx` — 印迹按钮跳转改为 `/story/camera`

---

## Task 1: 修改 BottomNav 印迹按钮跳转

**Files:**
- Modify: `components/BottomNav.tsx`

- [ ] **Step 1: 修改跳转路径**

将印迹按钮的 `onClick` 从 `/story` 改为 `/story/camera`：

```tsx
// components/BottomNav.tsx — 找到印迹按钮的 onClick，改为：
onClick={() => router.push('/story/camera')}
```

当前代码（约第 40 行）：
```tsx
<button
  onClick={() => router.push('/story')}
```

改为：
```tsx
<button
  onClick={() => router.push('/story/camera')}
```

`isActive` 判断也需要同步更新，让 `/story/camera` 和 `/story` 都能激活印迹按钮：

```tsx
// 找到 isActive('/story') 的所有引用，改为：
isActive('/story/camera') || isActive('/story')
```

- [ ] **Step 2: 验证修改**

Run: `grep -n "story" components/BottomNav.tsx`
Expected: 显示 `/story/camera` 和 `isActive('/story/camera') || isActive('/story')`

- [ ] **Step 3: TypeScript 检查**

Run: `npx tsc --noEmit`
Expected: 无错误输出

- [ ] **Step 4: 提交**

```bash
git add components/BottomNav.tsx
git commit -m "$(cat <<'EOF'
feat: update BottomNav imprint button to navigate to camera page

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: 创建拍照入口页

**Files:**
- Create: `app/story/camera/page.tsx`

- [ ] **Step 1: 创建文件**

```tsx
'use client'
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
    router.push('/story')
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
```

- [ ] **Step 2: 验证文件存在**

Run: `ls -la app/story/camera/page.tsx`
Expected: 文件存在

- [ ] **Step 3: TypeScript 检查**

Run: `npx tsc --noEmit`
Expected: 无错误输出

- [ ] **Step 4: 提交**

```bash
git add app/story/camera/page.tsx
git commit -m "$(cat <<'EOF'
feat: add camera entry page at /story/camera

- Full-screen camera view with shutter and album buttons
- Preview state with retake (✕) and confirm (✓) buttons
- Passes photo to /story via sessionStorage pendingPhoto
- Graceful fallback when camera unavailable

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: 修改编辑页读取图片 & 完善标签逻辑

**Files:**
- Modify: `app/story/page.tsx`

- [ ] **Step 1: 添加 useEffect 读取 pendingPhoto**

在 `app/story/page.tsx` 顶部 import 中确认已有 `useEffect`（当前只有 `useState, useRef`），添加 `useEffect`：

```tsx
import { useState, useRef, useEffect } from 'react'
```

在组件内 state 声明之后（`const [photo, setPhoto]` 之后）添加：

```tsx
useEffect(() => {
  const pending = sessionStorage.getItem('pendingPhoto')
  if (pending) {
    setPhoto(pending)
    sessionStorage.removeItem('pendingPhoto')
  }
}, [])
```

- [ ] **Step 2: 添加标签 state**

在组件内现有 state 声明区域添加：

```tsx
const [tags, setTags] = useState<string[]>([city])
const [tagInput, setTagInput] = useState('')
const [showTagInput, setShowTagInput] = useState(false)
const TAG_LIMIT = 10
```

- [ ] **Step 3: 添加标签操作函数**

在 `handlePhoto` 函数之后添加：

```tsx
const handleAddTag = () => {
  const trimmed = tagInput.trim()
  if (!trimmed || tags.includes(trimmed)) {
    setTagInput('')
    setShowTagInput(false)
    return
  }
  if (tags.length >= TAG_LIMIT) return
  setTags(prev => [...prev, trimmed])
  setTagInput('')
  setShowTagInput(false)
}

const handleRemoveTag = (tag: string) => {
  setTags(prev => prev.filter(t => t !== tag))
}
```

- [ ] **Step 4: 替换标签 UI**

找到现有标签区域（约第 138-144 行）：

```tsx
        <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6 }}>标签</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {[city, '2025'].map(tag => (
            <span key={tag} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 8, background: 'var(--bg-card-2)', color: 'var(--text-secondary)', border: '0.5px solid var(--border-light)' }}>{tag}</span>
          ))}
          <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 8, color: 'var(--text-muted)', border: '0.5px dashed var(--border-light)', cursor: 'pointer' }}>+ 添加</span>
        </div>
```

替换为：

```tsx
        <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6 }}>标签</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {tags.map(tag => (
            <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, padding: '3px 7px 3px 9px', borderRadius: 8, background: 'var(--bg-card-2)', color: 'var(--text-secondary)', border: '0.5px solid var(--border-light)' }}>
              {tag}
              <button onClick={() => handleRemoveTag(tag)} style={{ fontSize: 9, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>✕</button>
            </span>
          ))}
          {showTagInput ? (
            <input
              autoFocus
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddTag() }}
              onBlur={handleAddTag}
              placeholder="输入标签"
              style={{ fontSize: 10, padding: '3px 9px', borderRadius: 8, border: '0.5px solid var(--accent)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', width: 80 }}
            />
          ) : tags.length >= TAG_LIMIT ? (
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>最多添加 10 个标签</span>
          ) : (
            <span onClick={() => setShowTagInput(true)} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 8, color: 'var(--text-muted)', border: '0.5px dashed var(--border-light)', cursor: 'pointer' }}>+ 添加</span>
          )}
        </div>
```

- [ ] **Step 5: 更新 handlePublish 和 handleLoginConfirm 使用 tags state**

找到 `handlePublish`（约第 69 行）中的 `tags: [city, '2025']`，改为 `tags`：

```tsx
addImprint({ city, title: `${city} 的印迹`, narrative, tags, isPublic, photo })
```

找到 `handleLoginConfirm`（约第 83 行）中的 `tags: [city, '2025']`，同样改为 `tags`：

```tsx
addImprint({ city, title: `${city} 的印迹`, narrative, tags, isPublic: pendingPublish, photo })
```

- [ ] **Step 6: TypeScript 检查**

Run: `npx tsc --noEmit`
Expected: 无错误输出

- [ ] **Step 7: 提交**

```bash
git add app/story/page.tsx
git commit -m "$(cat <<'EOF'
feat: read pendingPhoto from sessionStorage and add tag management

- Auto-fill photo from camera page via sessionStorage
- Tags are now stateful with add/remove support
- Tag limit of 10 with inline warning message

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: 测试功能

- [ ] **Step 1: 启动开发服务器**

Run: `npm run dev`
Expected: Server starts on http://localhost:3000

- [ ] **Step 2: 测试拍照入口流程**

1. 访问 http://localhost:3000
2. 点击底部导航"印迹"按钮
3. 验证跳转到 `/story/camera`（全屏深色页面）
4. 点击相册按钮，选择一张图片
5. 验证图片预览显示，底部切换为 ✕ / ✓ 按钮
6. 点击 ✕，验证回到待拍摄状态
7. 再次选图，点击 ✓
8. 验证跳转到 `/story`，图片已自动填入

- [ ] **Step 3: 测试标签功能**

1. 在编辑页验证初始标签为城市名（无 '2025'）
2. 点击"+ 添加"，输入标签文字，回车确认
3. 验证标签出现，带 ✕ 删除按钮
4. 点击标签的 ✕，验证标签被删除
5. 添加标签至 10 个，验证"+ 添加"消失，显示"最多添加 10 个标签"
6. 删除一个标签，验证"+ 添加"重新出现

- [ ] **Step 4: 停止服务器**

Run: `pkill -f "next dev"` 或 Ctrl+C

---

## 验证清单

- [ ] 点击底部"印迹"按钮跳转到 `/story/camera`
- [ ] 拍照页显示相机取景框（或相机不可用时的降级提示）
- [ ] 相册按钮可选图，选图后显示预览
- [ ] 预览状态底部显示 ✕（重拍）和 ✓（使用）
- [ ] 点 ✕ 回到待拍摄状态
- [ ] 点 ✓ 跳转到 `/story`，图片自动填入
- [ ] 编辑页标签可添加（回车或失焦确认）
- [ ] 编辑页标签可删除（点 ✕）
- [ ] 标签达到 10 个时显示"最多添加 10 个标签"
- [ ] 发布时使用 state 中的标签数组
