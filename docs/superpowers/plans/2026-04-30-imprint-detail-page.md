# 印迹详情页实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为遇见和领地页面的印迹卡片添加点击跳转到详情页的功能，支持查看完整内容和分享

**Architecture:** 创建统一的动态路由 `/app/imprint/[id]/page.tsx`，从 AppContext 获取数据，遇见和领地页面添加点击事件导航到详情页

**Tech Stack:** Next.js 16 App Router, React, TypeScript, Web Share API

---

## File Structure

**New files:**
- `app/imprint/[id]/page.tsx` — 印迹详情页，显示完整内容、作者信息、标签、互动功能

**Modified files:**
- `app/meet/page.tsx` — 给卡片添加 onClick 导航
- `app/vault/page.tsx` — 给卡片添加 onClick 导航

---

## Task 1: 创建印迹详情页

**Files:**
- Create: `app/imprint/[id]/page.tsx`

- [ ] **Step 1: 创建详情页文件结构**

```tsx
'use client'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { useState } from 'react'

export default function ImprintDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { allPublicImprints, imprints } = useApp()
  const [liked, setLiked] = useState(false)
  const [showToast, setShowToast] = useState(false)
  
  const allImprints = [...allPublicImprints, ...imprints.filter(i => !i.isPublic)]
  const imprint = allImprints.find(i => i.id === params.id)
  
  const cityZh: Record<string, string> = { 
    Berlin: '柏林', 
    Amsterdam: '阿姆斯特丹', 
    Lisbon: '里斯本', 
    Prague: '布拉格', 
    Tallinn: '塔林' 
  }
  
  if (!imprint) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>印迹不存在</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20 }}>该印迹可能已被删除或不存在</div>
        <button onClick={() => router.back()} style={{ fontSize: 13, fontWeight: 500, padding: '10px 24px', borderRadius: 10, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer' }}>返回</button>
      </div>
    )
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: imprint.title, url })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      await navigator.clipboard.writeText(url)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const handleLike = () => {
    setLiked(!liked)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: 20 }}>
      {/* 顶部导航栏 */}
      <div style={{ position: 'sticky', top: 0, background: 'var(--bg-page)', borderBottom: '0.5px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-primary)' }}>←</button>
        <button onClick={handleShare} style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>↗</button>
      </div>

      {/* 照片区域 */}
      <div style={{ height: 240, background: imprint.photo ? 'transparent' : '#ede8df', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {imprint.photo ? (
          <img src={imprint.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: 12, color: '#c8bfaa' }}>[ 照片 ]</span>
        )}
        <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(245,240,232,0.92)', color: '#3d3020', fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 8 }}>
          {cityZh[imprint.city] ?? imprint.city}
        </span>
      </div>

      {/* 内容区域 */}
      <div style={{ padding: '16px' }}>
        {/* 标题 */}
        <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.4 }}>
          {imprint.title}
        </div>

        {/* 作者信息 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 16, borderBottom: '0.5px solid var(--border)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e8dfd0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
            {imprint.author?.[1] ?? 'N'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
              {imprint.author ?? 'Nomadic 用户'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
              {imprint.createdAt}
            </div>
          </div>
        </div>

        {/* 完整叙述 */}
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
          {imprint.narrative}
        </div>

        {/* 标签列表 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {imprint.tags?.map(tag => (
            <span key={tag} style={{ fontSize: 11, background: 'var(--bg-page)', color: 'var(--text-secondary)', border: '0.5px solid var(--border)', padding: '4px 10px', borderRadius: 8 }}>
              {tag}
            </span>
          ))}
        </div>

        {/* 互动区域 */}
        {imprint.isPublic && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 16, borderTop: '0.5px solid var(--border)' }}>
            <button onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: 18, transition: 'transform 0.2s', transform: liked ? 'scale(1.2)' : 'scale(1)' }}>
                {liked ? '❤️' : '♡'}
              </span>
              <span>{(imprint.likes ?? 0) + (liked ? 1 : 0)}</span>
            </button>
            <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: 16 }}>↗</span>
              <span>分享</span>
            </button>
          </div>
        )}

        {/* 底部导航 */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '0.5px solid var(--border)' }}>
          {imprint.isPublic ? (
            <button onClick={() => router.push('/meet')} style={{ width: '100%', fontSize: 13, fontWeight: 500, padding: '12px', borderRadius: 10, background: 'var(--bg-card)', color: 'var(--text-primary)', border: '0.5px solid var(--border)', cursor: 'pointer' }}>
              查看更多来自社区的印迹 →
            </button>
          ) : (
            <button onClick={() => router.push('/vault')} style={{ width: '100%', fontSize: 13, fontWeight: 500, padding: '12px', borderRadius: 10, background: 'var(--bg-card)', color: 'var(--text-primary)', border: '0.5px solid var(--border)', cursor: 'pointer' }}>
              返回我的领地 →
            </button>
          )}
        </div>
      </div>

      {/* Toast 提示 */}
      {showToast && (
        <div style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', background: 'rgba(45,36,24,0.9)', color: '#fff', fontSize: 12, padding: '10px 20px', borderRadius: 8, zIndex: 100 }}>
          链接已复制
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 验证文件创建**

Run: `ls -la app/imprint/[id]/page.tsx`
Expected: 文件存在

- [ ] **Step 3: 提交详情页**

```bash
git add app/imprint/[id]/page.tsx
git commit -m "$(cat <<'EOF'
feat: add imprint detail page with full content view

- Create dynamic route /imprint/[id]
- Display full narrative, all tags, author info
- Add like and share functionality
- Handle 404 for non-existent imprints

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: 修改遇见页面添加点击跳转

**Files:**
- Modify: `app/meet/page.tsx:6-7,36-60`

- [ ] **Step 1: 添加 useRouter 导入**

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { useApp } from '@/context/AppContext'

export default function MeetPage() {
  const router = useRouter()
  const { allPublicImprints } = useApp()
```

- [ ] **Step 2: 给卡片添加 onClick 事件**

在第 36 行的卡片 div 上添加 onClick 和 cursor 样式：

```tsx
          {filtered.map(imp => (
            <div 
              key={imp.id} 
              onClick={() => router.push(`/imprint/${imp.id}`)}
              style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', cursor: 'pointer' }}
            >
```

- [ ] **Step 3: 验证修改**

Run: `grep -n "router.push" app/meet/page.tsx`
Expected: 显示包含 router.push 的行

- [ ] **Step 4: 提交遇见页面修改**

```bash
git add app/meet/page.tsx
git commit -m "$(cat <<'EOF'
feat: add click navigation to imprint detail in meet page

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: 修改领地页面添加点击跳转

**Files:**
- Modify: `app/vault/page.tsx:53-72`

- [ ] **Step 1: 给卡片添加 onClick 事件**

在第 53 行的卡片 div 上添加 onClick 和 cursor 样式：

```tsx
        ) : imprints.map(imp => (
          <div 
            key={imp.id} 
            onClick={() => router.push(`/imprint/${imp.id}`)}
            style={{ display: 'flex', gap: 10, background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.03)', cursor: 'pointer' }}
          >
```

- [ ] **Step 2: 验证修改**

Run: `grep -n "router.push.*imprint" app/vault/page.tsx`
Expected: 显示包含 router.push 到 imprint 的行

- [ ] **Step 3: 提交领地页面修改**

```bash
git add app/vault/page.tsx
git commit -m "$(cat <<'EOF'
feat: add click navigation to imprint detail in vault page

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: 测试功能

**Files:**
- Test: Manual testing in browser

- [ ] **Step 1: 启动开发服务器**

Run: `npm run dev`
Expected: Server starts on http://localhost:3000

- [ ] **Step 2: 测试遇见页面跳转**

1. 访问 http://localhost:3000/meet
2. 点击任意印迹卡片
3. 验证跳转到详情页
4. 验证显示完整内容、所有标签、作者信息
5. 验证返回按钮工作正常

- [ ] **Step 3: 测试领地页面跳转**

1. 访问 http://localhost:3000/vault
2. 点击任意印迹卡片
3. 验证跳转到详情页
4. 验证显示完整内容
5. 验证返回按钮工作正常

- [ ] **Step 4: 测试分享功能**

1. 在详情页点击分享按钮
2. 如果浏览器支持 Web Share API，验证系统分享面板弹出
3. 如果不支持，验证 toast 提示"链接已复制"显示

- [ ] **Step 5: 测试点赞功能**

1. 在公开印迹详情页点击点赞按钮
2. 验证点赞数 +1
3. 验证心形图标变化和动画效果

- [ ] **Step 6: 测试 404 页面**

1. 访问 http://localhost:3000/imprint/non-existent-id
2. 验证显示"印迹不存在"提示
3. 验证返回按钮工作正常

- [ ] **Step 7: 测试完成后停止服务器**

Run: `pkill -f "next dev"` or Ctrl+C
Expected: Server stops

---

## 验证清单

完成所有任务后，验证以下功能：

- [ ] 遇见页面卡片可点击跳转到详情页
- [ ] 领地页面卡片可点击跳转到详情页
- [ ] 详情页显示完整叙述文本
- [ ] 详情页显示所有标签
- [ ] 详情页显示作者信息和头像
- [ ] 公开印迹显示点赞功能
- [ ] 分享功能正常工作（Web Share API 或复制链接）
- [ ] 返回按钮正常工作
- [ ] 不存在的印迹 ID 显示 404 页面
- [ ] 所有页面样式与现有页面保持一致
