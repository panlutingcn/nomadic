# 主页细节优化 — 设计文档

**日期**: 2026-04-27
**范围**: 主页交互效果、搜索引导语、报错提示、四象限标题、世界地图、联系开发者、搜索登录限制

---

## 概述

对主页进行 8 项细节优化，提升交互质感和用户体验。不涉及新页面，主要改动集中在 `app/page.tsx`、`components/SearchBox.tsx`、`components/BottomNav.tsx`，以及新增 `components/WorldMap.tsx`、`components/ContactBubble.tsx`、`app/api/contact/route.ts`。

---

## 1. 交互效果 — 城市标签 + 导航栏

### 城市标签

**Hover 效果**:
```css
transform: scale(1.04);
border: 1.5px solid var(--accent-border);
transition: all 150ms ease;
```

**Click 效果**（按下瞬间）:
```css
transform: scale(1.06);
font-weight: 600;
transition: all 100ms ease;
```

**点击行为**:
- 已知城市（在 `CITIES` 中）：直接 `setSelectedCity` + `router.push('/insights')`
- 未知城市：触发 `/api/search` → 成功后 `setSearchContext` + `setSelectedCity` + 跳转洞察页（与搜索框逻辑一致）
- 「随机 🎲」按钮：保持现有行为（填入搜索框）

### 导航栏按钮

**Hover 效果**:
```css
/* 图标 */
transform: scale(1.1);
/* 文字 */
color: var(--text-primary);
transition: all 150ms ease;
```

用 CSS `:hover` 伪类实现（需在 globals.css 或内联 style + onMouseEnter/Leave）。

---

## 2. 搜索框引导语每日轮换

### 数据

新建 `data/searchPlaceholders.ts`，预设 31 条引导语，覆盖设计、写作、科技、餐饮、教育、摄影、手工艺、咨询等行业，风格积极正向。示例：

```typescript
export const SEARCH_PLACEHOLDERS = [
  "里斯本的阳光，适合写你一直想写的那本书",
  "在曼谷开一家小咖啡馆，月租可能比你想的便宜",
  "柏林的设计师社群，正在等一个像你这样的人",
  "布拉格的咖啡馆，是远程工作者的天堂",
  "阿姆斯特丹的创业生态，对独立开发者很友好",
  // ... 共 31 条
]
```

### 轮换逻辑

```typescript
// 按当月日期取对应条目，同一天始终显示同一条
const today = new Date()
const dayOfMonth = today.getDate() // 1-31
const idx = (dayOfMonth - 1) % SEARCH_PLACEHOLDERS.length
const todayPlaceholder = SEARCH_PLACEHOLDERS[idx]
```

每月 1 号自动从头开始，部分内容可重复出现。

### 打字机动画

保留现有打字机效果，对每日引导语同样逐字播放。

---

## 3. 报错提示

### 问题

`SearchBox` 内部的 `setError(true)` 目前只改边框颜色，未触发父组件的 `ErrorToast`。

### 修复方案

给 `SearchBox` 添加 `onError?: () => void` prop，在 `setError(true)` 时同时调用 `onError()`。

```typescript
// SearchBox props
interface SearchBoxProps {
  onError?: () => void
}

// 触发时
setError(true)
onError?.()
```

父组件 `page.tsx` 传入：
```tsx
<SearchBox ref={searchBoxRef} onError={() => setErrorMessage('哎呀没有理解')} />
```

`ErrorToast` 显示文案统一改为 **"哎呀没有理解"**。

---

## 4. 四象限标题

在四象限 `grid` 上方添加一行标题，样式与现有 `—— 你想去哪里 ——` 保持一致：

```tsx
<div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 8 }}>
  —— 洞察四个象限 ——
</div>
```

四象限点击行为保持不变（高亮搜索框，不跳转）。

---

## 5. 世界地图（react-simple-maps）

### 依赖

```bash
npm install react-simple-maps
```

### 组件：`components/WorldMap.tsx`

使用 `ComposableMap` + `Geographies` + `Marker` 渲染真实世界地图。

**地图数据**: 使用 `react-simple-maps` 内置的 `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json`（公开 CDN，无需本地文件）。

**城市坐标**（真实经纬度）:
```typescript
const CITY_MARKERS = [
  { name: 'Berlin',     nameZh: '柏林',      coordinates: [13.405, 52.52]  },
  { name: 'Amsterdam',  nameZh: '阿姆斯特丹', coordinates: [4.9041, 52.3676] },
  { name: 'Lisbon',     nameZh: '里斯本',     coordinates: [-9.1393, 38.7223] },
  { name: 'Bangkok',    nameZh: '曼谷',       coordinates: [100.5018, 13.7563] },
  { name: 'Prague',     nameZh: '布拉格',     coordinates: [14.4378, 50.0755] },
  { name: 'Vienna',     nameZh: '维也纳',     coordinates: [16.3738, 48.2082] },
  { name: 'Paris',      nameZh: '巴黎',       coordinates: [2.3522, 48.8566] },
  { name: 'Barcelona',  nameZh: '巴塞罗那',   coordinates: [2.1734, 41.3851] },
  { name: 'Porto',      nameZh: '波尔图',     coordinates: [-8.6291, 41.1579] },
  { name: 'Dublin',     nameZh: '都柏林',     coordinates: [-6.2603, 53.3498] },
  { name: 'Dubrovnik',  nameZh: '杜布罗夫尼克', coordinates: [18.0944, 42.6507] },
  { name: 'Florence',   nameZh: '佛罗伦萨',   coordinates: [11.2558, 43.7696] },
  { name: 'Tallinn',    nameZh: '塔林',       coordinates: [24.7536, 59.4370] },
]
```

**视觉设计**:
- 地图陆地：`fill: #f0ebe2`，描边：`stroke: #d8cdb8 strokeWidth: 0.5`（与项目暖色调一致）
- 城市圆点：`fill: var(--accent)`，半径 3px
- 用户有印迹的城市：半径 5px + 光晕动画（`box-shadow` 脉冲）
- Hover 城市圆点：显示城市中文名 tooltip
- 点击城市圆点：`setSelectedCity` + `router.push('/insights')`
- 地图投影：`geoMercator`，聚焦欧洲+亚洲区域（`center: [20, 45]`，`scale: 120`）

**替换位置**: 替换 `page.tsx` 中「我的全球版图」卡片内的假地图 div。

---

## 6. 网页标题

已完成 ✓ — `app/layout.tsx` 第 6 行已设置为 `"Nomadic 像种树一样生活"`。

---

## 7. 联系开发者气泡

### 入口

BottomNav 上方，页面底部添加一个气泡按钮：

```
「联系 Luna · 共创 Nomadic」
```

样式：小圆角胶囊，淡色背景，细边框，字体淡灰色。

### 弹出抽屉

点击后从底部滑出抽屉（`position: fixed, bottom: 0`），内容：

```
这是 Luna 以自己为用户画像做的产品
欢迎分享你的使用体验，一起共创 ✦

发送至：panluting.cn@gmail.com

你的邮箱  [_______________]
内容      [_______________]
          [_______________]

          [发送]  [取消]
```

- 显示收件邮箱 `panluting.cn@gmail.com`（用户可见）
- 发送时邮件主题固定为 **"Nomadic用户来信"**
- 发送成功后显示「已发送 ✓」并关闭抽屉

### 后端：`app/api/contact/route.ts`

```typescript
POST /api/contact
Body: { fromEmail: string, content: string }

// 使用 Resend 发送邮件
// 主题固定: "Nomadic用户来信"
// 收件人: panluting.cn@gmail.com
// 正文: 包含用户邮箱 + 内容
```

**环境变量**: `RESEND_API_KEY`（需在 Vercel/本地 `.env.local` 配置）

**依赖**: `npm install resend`

### 组件：`components/ContactBubble.tsx`

独立组件，在 `page.tsx` 中引入，放在 `<BottomNav />` 上方。

---

## 8. 搜索 10 次后要求登录

### 计数逻辑

```typescript
// localStorage key: 'searchCount'
// 每次搜索成功后 +1
// 达到 10 次时弹出登录弹窗
// 登录成功后重置为 0
```

### 登录弹窗

复用 `story/page.tsx` 中已有的登录 UI，提取为独立组件 `components/LoginModal.tsx`。

**登录流程**:

微信登录：
1. 点击「微信一键登录」
2. 弹出选择：「使用微信昵称」或「自定义名字」
3. 若选自定义，显示输入框
4. 确认后完成登录

邮箱登录：
1. 输入邮箱
2. 输入名字
3. 点击确认登录

登录后将用户名存入 `AppContext`（新增 `userName` 字段），供后续 Supabase 接入使用。

---

## 文件变更清单

| 文件 | 操作 |
|------|------|
| `app/page.tsx` | 修改：hover 效果、四象限标题、联系气泡入口、搜索计数、错误回调 |
| `components/SearchBox.tsx` | 修改：添加 `onError` prop、每日引导语逻辑 |
| `components/BottomNav.tsx` | 修改：hover 效果 |
| `components/WorldMap.tsx` | 新增：react-simple-maps 世界地图 |
| `components/ContactBubble.tsx` | 新增：联系开发者气泡 + 表单 |
| `components/LoginModal.tsx` | 新增：从 story/page.tsx 提取并扩展 |
| `app/api/contact/route.ts` | 新增：邮件发送 API |
| `data/searchPlaceholders.ts` | 新增：31 条每日引导语 |
| `context/AppContext.tsx` | 修改：新增 `userName` 字段 |

---

## 边界情况

- 邮件发送失败：显示「发送失败，请稍后重试」，不关闭抽屉
- 用户邮箱格式错误：发送按钮禁用，提示「请输入有效邮箱」
- 内容为空：发送按钮禁用
- 搜索计数在 localStorage，清除浏览器数据后重置（可接受）
- 未知城市点击标签触发搜索失败：显示「哎呀没有理解」toast，不跳转
