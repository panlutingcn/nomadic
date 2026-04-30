# GPS城市识别、AI故事生成与登录卡片 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为印迹发布流程添加GPS自动识别城市、AI自动生成故事（支持用户输入作为素材）、发布验证、以及登录弹窗speech bubble卡片重设计。

**Architecture:** 相机页在用户确认照片时捕获GPS坐标存入sessionStorage；印迹页读取坐标调用Nominatim反向地理编码获取中文城市名，自动生成城市+年份标签并触发AI生成故事；AI API新增userInput参数支持以用户内容为素材丰富故事；登录弹窗改为居中speech bubble卡片。

**Tech Stack:** Next.js 16 App Router, React hooks, OpenStreetMap Nominatim API (free, no key), Anthropic claude-sonnet-4-6, CSS keyframes animation

---

## File Map

- Modify: `app/story/camera/page.tsx` — 新增GPS捕获逻辑
- Modify: `app/story/page.tsx` — 反向地理编码、自动标签、自动AI生成、验证、登录弹窗重设计
- Modify: `app/api/generate-narrative/route.ts` — 新增userInput参数

---

### Task 1: 更新AI生成API支持userInput

**Files:**
- Modify: `app/api/generate-narrative/route.ts`

- [ ] **Step 1: 替换 route.ts 完整内容**

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { city, imageBase64, userInput } = await req.json()

  const content: Anthropic.MessageParam['content'] = []

  if (imageBase64) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
    })
  }

  let promptText: string
  if (userInput && userInput.trim()) {
    promptText = `你是一位擅长城市文化叙事的作家。请以下面的内容为素材，进行丰富和完善，写一段100字左右的印迹故事。

用户提供的素材：
${userInput}

城市：${city}
${imageBase64 ? '请同时参考照片中的场景。' : ''}

要求：
- 保留用户素材的核心意图和情感
- 融入该城市的历史文化特色
- 第一人称，有温度，有细节
- 只输出故事正文，不要标题或解释`
  } else {
    promptText = `你是一位擅长城市文化叙事的作家。请根据${imageBase64 ? '这张照片和' : ''}城市"${city}"，写一段100字左右的印迹故事。
要求：
- 融入该城市的历史文化特色
- 第一人称，有温度，有细节
- 不要泛泛而谈，要有具体的城市意象
- 只输出故事正文，不要标题或解释`
  }

  content.push({ type: 'text', text: promptText })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [{ role: 'user', content }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return NextResponse.json({ narrative: text })
}

export const runtime = 'edge'
```

- [ ] **Step 2: 验证TypeScript编译通过**

```bash
npx tsc --noEmit
```

Expected: 无错误输出

- [ ] **Step 3: Commit**

```bash
git add app/api/generate-narrative/route.ts
git commit -m "feat: add userInput support to generate-narrative API"
```

---

### Task 2: 相机页添加GPS捕获

**Files:**
- Modify: `app/story/camera/page.tsx`

- [ ] **Step 1: 替换 handleConfirm 函数**

找到当前的 `handleConfirm`（约第57-61行）：
```typescript
const handleConfirm = () => {
  if (!preview) return
  sessionStorage.setItem('pendingPhoto', preview)
  router.push('/story')
}
```

替换为：
```typescript
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
```

- [ ] **Step 2: 验证TypeScript编译通过**

```bash
npx tsc --noEmit
```

Expected: 无错误输出

- [ ] **Step 3: Commit**

```bash
git add "app/story/camera/page.tsx"
git commit -m "feat: capture GPS coordinates on photo confirm"
```

---

### Task 3: 印迹页重构（GPS读取、反向地理编码、自动标签、自动AI生成）

**Files:**
- Modify: `app/story/page.tsx`

- [ ] **Step 1: 替换文件顶部常量和imports**

将文件开头（第1-13行）替换为：
```typescript
'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'

const CITY_NAME_MAP: Record<string, string> = {
  Berlin: '柏林',
  Amsterdam: '阿姆斯特丹',
  Lisbon: '里斯本',
  Prague: '布拉格',
  Tallinn: '塔林',
  Hamburg: '汉堡',
  Munich: '慕尼黑',
  Vienna: '维也纳',
  Zurich: '苏黎世',
  Barcelona: '巴塞罗那',
  Madrid: '马德里',
  Paris: '巴黎',
  London: '伦敦',
  Rome: '罗马',
  Milan: '米兰',
  Budapest: '布达佩斯',
  Warsaw: '华沙',
  Stockholm: '斯德哥尔摩',
  Copenhagen: '哥本哈根',
  Helsinki: '赫尔辛基',
  Oslo: '奥斯陆',
  Riga: '里加',
  Vilnius: '维尔纽斯',
  Bangkok: '曼谷',
  Singapore: '新加坡',
  Tokyo: '东京',
  Seoul: '首尔',
  Taipei: '台北',
  Shanghai: '上海',
  Beijing: '北京',
  Chengdu: '成都',
  Dubai: '迪拜',
}
```

- [ ] **Step 2: 替换组件状态声明（第15-32行）**

将 `export default function StoryPage()` 开头的状态声明替换为：
```typescript
export default function StoryPage() {
  const router = useRouter()
  const { addImprint } = useApp()
  const [city, setCity] = useState('')
  const [editingCity, setEditingCity] = useState(false)
  const [photo, setPhoto] = useState<string | undefined>(undefined)
  const fileRef = useRef<HTMLInputElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone')
  const [loginPhone, setLoginPhone] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [pendingPublish, setPendingPublish] = useState<boolean | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const [narrative, setNarrative] = useState('')
  const [generating, setGenerating] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [flashCity, setFlashCity] = useState(false)
  const [flashTags, setFlashTags] = useState(false)
  const TAG_LIMIT = 10
  const prevCityRef = useRef('')
  const gpsDetectedRef = useRef(false)
```

- [ ] **Step 3: 替换所有 useEffect 和函数（第34-90行）**

删除现有的所有 useEffect、`narrativeBase`、`narrativeVariants`、`cycleNarrative`、`generateWithAI`，替换为：

```typescript
  // 读取 sessionStorage 中的照片和GPS数据
  useEffect(() => {
    const pending = sessionStorage.getItem('pendingPhoto')
    if (pending) {
      setPhoto(pending)
      sessionStorage.removeItem('pendingPhoto')
    }

    const gpsRaw = sessionStorage.getItem('pendingGPS')
    if (gpsRaw) {
      sessionStorage.removeItem('pendingGPS')
      try {
        const gpsData = JSON.parse(gpsRaw) as { lat: number; lon: number; timestamp: number }
        setGpsLoading(true)
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${gpsData.lat}&lon=${gpsData.lon}`,
          { headers: { 'Accept-Language': 'en' } }
        )
          .then(r => r.json())
          .then(data => {
            const addr = data.address || {}
            const cityEn: string = addr.city || addr.town || addr.village || addr.county || ''
            const cityZh = CITY_NAME_MAP[cityEn] ?? cityEn
            if (cityZh) {
              const year = String(new Date(gpsData.timestamp).getFullYear())
              setCity(cityZh)
              setTags([cityZh, year])
              prevCityRef.current = cityZh
              gpsDetectedRef.current = true
            }
          })
          .catch(() => {})
          .finally(() => setGpsLoading(false))
      } catch {
        setGpsLoading(false)
      }
    }
  }, [])

  // 城市变化时同步更新标签中的城市标签
  useEffect(() => {
    if (prevCityRef.current !== city && prevCityRef.current !== '') {
      const oldCity = prevCityRef.current
      setTags(prev => {
        if (prev.includes(oldCity)) return prev.map(t => t === oldCity ? city : t)
        if (!prev.includes(city)) return [...prev, city]
        return prev
      })
      prevCityRef.current = city
    }
  }, [city])

  // GPS识别城市后自动触发AI生成
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (gpsDetectedRef.current && city) {
      gpsDetectedRef.current = false
      generateWithAI()
    }
  }, [city])

  // 清理 blob URL
  useEffect(() => {
    return () => {
      if (photo && photo.startsWith('blob:')) URL.revokeObjectURL(photo)
    }
  }, [photo])

  const generateWithAI = async () => {
    setGenerating(true)
    try {
      let imageBase64: string | undefined
      if (photo) {
        const res = await fetch(photo)
        const blob = await res.blob()
        imageBase64 = await new Promise<string>(resolve => {
          const reader = new FileReader()
          reader.onload = () => resolve((reader.result as string).split(',')[1])
          reader.readAsDataURL(blob)
        })
      }
      const res = await fetch('/api/generate-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city,
          imageBase64,
          userInput: narrative.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (data.narrative) setNarrative(data.narrative)
    } finally {
      setGenerating(false)
    }
  }
```

- [ ] **Step 4: 验证TypeScript编译通过**

```bash
npx tsc --noEmit
```

Expected: 无错误输出

- [ ] **Step 5: Commit**

```bash
git add "app/story/page.tsx"
git commit -m "feat: GPS geocoding, auto-tags, auto-AI generation on story page"
```

---

### Task 4: 印迹页发布验证、城市显示、登录弹窗重设计

**Files:**
- Modify: `app/story/page.tsx`

- [ ] **Step 1: 替换 handlePhoto、handleAddTag、handleRemoveTag、handlePublish、handleLoginConfirm 函数**

找到并替换这些函数（约第92-136行）：

```typescript
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (photo && photo.startsWith('blob:')) URL.revokeObjectURL(photo)
      setPhoto(URL.createObjectURL(file))
    }
  }

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

  const triggerFlash = (field: 'city' | 'tags') => {
    if (field === 'city') {
      setFlashCity(true)
      setTimeout(() => setFlashCity(false), 900)
    } else {
      setFlashTags(true)
      setTimeout(() => setFlashTags(false), 900)
    }
  }

  const handlePublish = (isPublic: boolean) => {
    if (!city.trim()) {
      triggerFlash('city')
      return
    }
    if (!tags.includes(city)) {
      triggerFlash('tags')
      return
    }
    if (!isLoggedIn) {
      setPendingPublish(isPublic)
      setShowLogin(true)
      return
    }
    addImprint({ city, title: `${city} 的印迹`, narrative, tags, isPublic, photo })
    router.push(isPublic ? '/meet' : '/vault')
  }

  const handleLoginConfirm = () => {
    setIsLoggedIn(true)
    setShowLogin(false)
    if (pendingPublish !== null) {
      addImprint({ city, title: `${city} 的印迹`, narrative, tags, isPublic: pendingPublish, photo })
      router.push(pendingPublish ? '/meet' : '/vault')
    }
  }
```

- [ ] **Step 2: 替换 JSX return 中的城市归属区域**

找到城市归属区域（约第159-170行）：
```tsx
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>城市归属</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>GPS 自动识别</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
          {editingCity
            ? <input autoFocus value={city} onChange={e => setCity(e.target.value)} onBlur={() => setEditingCity(false)} style={{ flex: 1, background: 'var(--bg-card)', border: '0.5px solid var(--accent)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: 'var(--text-primary)' }} />
            : <div style={{ flex: 1, background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: 'var(--text-primary)' }}>{city}, {city === 'Berlin' ? 'Germany' : city === 'Bangkok' ? 'Thailand' : city === 'Lisbon' ? 'Portugal' : city === 'Amsterdam' ? 'Netherlands' : 'Europe'}</div>
          }
          <button onClick={() => setEditingCity(true)} style={{ background: 'var(--bg-card-2)', border: '0.5px solid var(--border-light)', borderRadius: 8, padding: '8px 10px', fontSize: 10, color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>修改城市</button>
        </div>
        <div style={{ fontSize: 9, color: '#c8bfaa', marginBottom: 12 }}>若拍摄地与当前位置不同，可手动调整</div>
```

替换为：
```tsx
        <style>{`
          @keyframes borderFlash {
            0%, 100% { border-color: var(--border); }
            50% { border-color: #c04040; }
          }
          .flash-border { animation: borderFlash 0.45s ease 2; }
        `}</style>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>城市归属 <span style={{ color: '#c04040' }}>*</span></span>
          <span style={{ fontSize: 10, color: gpsLoading ? 'var(--accent)' : 'var(--text-muted)' }}>
            {gpsLoading ? 'GPS 识别中…' : 'GPS 自动识别'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
          {editingCity
            ? <input
                autoFocus
                value={city}
                onChange={e => setCity(e.target.value)}
                onBlur={() => setEditingCity(false)}
                style={{ flex: 1, background: 'var(--bg-card)', border: '0.5px solid var(--accent)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: 'var(--text-primary)' }}
              />
            : <div
                className={flashCity ? 'flash-border' : ''}
                style={{ flex: 1, background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: city ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                {city || '等待GPS识别或手动输入…'}
              </div>
          }
          <button onClick={() => setEditingCity(true)} style={{ background: 'var(--bg-card-2)', border: '0.5px solid var(--border-light)', borderRadius: 8, padding: '8px 10px', fontSize: 10, color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>修改城市</button>
        </div>
        <div style={{ fontSize: 9, color: '#c8bfaa', marginBottom: 12 }}>若拍摄地与当前位置不同，可手动调整</div>
```

- [ ] **Step 3: 替换标签区域，添加 flashTags 动画**

找到标签区域外层 div（约第188-211行）：
```tsx
        <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6 }}>标签</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
```

替换为：
```tsx
        <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6 }}>标签 <span style={{ color: '#c04040' }}>*</span></div>
        <div className={flashTags ? 'flash-border' : ''} style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14, border: '0.5px solid transparent', borderRadius: 8, padding: '2px 0' }}>
```

- [ ] **Step 4: 替换登录弹窗（showLogin modal）**

找到 `{showLogin && (` 区块（约第227-255行），完整替换为：

```tsx
      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
          <div style={{ position: 'relative', background: '#f0ebe0', borderRadius: 14, padding: '20px 20px 16px', maxWidth: 320, width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
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

            <div style={{ fontSize: 14, fontWeight: 500, color: '#3d3020', marginBottom: 4, textAlign: 'center' }}>登录后发布印迹</div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button
                onClick={() => setLoginMethod('phone')}
                style={{ flex: 1, padding: '7px', borderRadius: 8, border: `0.5px solid ${loginMethod === 'phone' ? 'var(--accent)' : '#c8bfaa'}`, background: loginMethod === 'phone' ? 'var(--accent-dim)' : 'transparent', fontSize: 12, color: loginMethod === 'phone' ? 'var(--accent-text)' : '#7a6a50', cursor: 'pointer' }}
              >
                手机号登录
              </button>
              <button
                onClick={() => setLoginMethod('email')}
                style={{ flex: 1, padding: '7px', borderRadius: 8, border: `0.5px solid ${loginMethod === 'email' ? 'var(--accent)' : '#c8bfaa'}`, background: loginMethod === 'email' ? 'var(--accent-dim)' : 'transparent', fontSize: 12, color: loginMethod === 'email' ? 'var(--accent-text)' : '#7a6a50', cursor: 'pointer' }}
              >
                邮箱登录
              </button>
            </div>

            {loginMethod === 'phone' ? (
              <input
                value={loginPhone}
                onChange={e => setLoginPhone(e.target.value)}
                placeholder="输入你的手机号"
                type="tel"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid #c8bfaa', background: 'rgba(255,255,255,0.6)', fontSize: 12, color: '#3d3020', boxSizing: 'border-box', outline: 'none', marginBottom: 10 }}
              />
            ) : (
              <input
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="输入你的邮箱"
                type="email"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid #c8bfaa', background: 'rgba(255,255,255,0.6)', fontSize: 12, color: '#3d3020', boxSizing: 'border-box', outline: 'none', marginBottom: 10 }}
              />
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowLogin(false)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'transparent', border: '0.5px solid #c8bfaa', fontSize: 12, color: '#7a6a50', cursor: 'pointer' }}
              >
                取消
              </button>
              <button
                onClick={handleLoginConfirm}
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
              >
                确认登录
              </button>
            </div>
          </div>
        </div>
      )}
```

- [ ] **Step 5: 验证TypeScript编译通过**

```bash
npx tsc --noEmit
```

Expected: 无错误输出

- [ ] **Step 6: 手动测试流程**

1. 打开 http://localhost:3000（或3001）
2. 点击底部导航相机按钮 → 进入相机页
3. 拍照或选择照片 → 点击"使用" → 确认GPS权限弹窗
4. 进入印迹发布页：
   - 城市归属应显示"GPS 识别中…"，识别完成后显示中文城市名
   - 标签应自动出现城市中文名和年份（如"柏林"、"2026"）
   - 印迹故事应自动开始生成
5. 清空故事文本，手动输入一些内容，点击"AI 生成 ✦" → 应以用户内容为素材生成
6. 清空城市归属，点击"发布到社区" → 城市字段应红框闪烁
7. 填入城市但删除城市标签，点击发布 → 标签区域应红框闪烁
8. 点击发布 → 登录弹窗应为居中speech bubble卡片，有手机号/邮箱选项

- [ ] **Step 7: Commit**

```bash
git add "app/story/page.tsx"
git commit -m "feat: publish validation, flash animation, login speech bubble card"
```
