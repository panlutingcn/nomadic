# Insights Page Optimization Design

## Overview
Enhance the insights page with improved layout, expandable detail views for each quadrant, platform descriptions, and share functionality.

---

## Layout Changes

### Header
- **City/Country names**: Center-aligned
- **Horizontal line**: Add above city name (separates from back button area)
- **Right corner**: Keep heart (save) + share (⤴) buttons

### Four Quadrants
- **Section titles**: Increase from `fontSize: 10` to `fontSize: 13, fontWeight: 700`
- Creates clear visual hierarchy for the four-module structure

---

## SOUL 城市灵魂

### Main Card
- **headline**: Current bold title
- **body**: New field — one paragraph introduction (50-80 words)
- **Footer**: `sub标签 … 展开 ›` (展开 aligned right)
- Click anywhere on card → opens full-screen modal

### Expanded View (Full-screen Modal)
Four sections with rich content:

**城市性格** — 这座城市的文化气质和生活哲学  
**经济支柱** — 这里的钱从哪里来  
**节日庆典** — 一年中的仪式感时刻  
**历史人物** — 从这里走出去的人

Each section: 2-3 paragraphs, informative but not verbose.

---

## BASE 生存基准

### Main Card
- **Three metrics**: WiFi / 物价 / 签证 (current grid layout)
- **Welfare text**: Keep current format
- **Footer**: `展开 ›` button (bottom-right)
- Click → opens full-screen modal

### Expanded View (Full-screen Modal)
Four sections:

**治安与安全** — 街头、夜晚、独行的真实感受  
**每日花销** — 吃住行一天大概多少美金  
**签证政策** — 能待多久，怎么续  
**社会运转** — 福利、医疗、养老,这个社会如何照顾人

**Data source for 每日花销**: Reference Numbeo (https://www.numbeo.com/cost-of-living/) for realistic estimates.

---

## CHANCE 商业机会 & LOCAL 本地圈子

### Platform Descriptions
Each link now includes:
- **Name** (current)
- **Description** (new): One-line official platform intro, gray text below name

Example:
```
LinkedIn Jobs
全球最大职业社交平台的招聘板块
```

### Link Validation
Remove dead links before displaying:
- **Remove from GLOBAL_COMMUNITIES**: Remote Year, Couchsurfing
- Future: Add validation check before rendering (optional enhancement)

---

## Share Functionality (⤴ Button)

### Share Modal
Clicking ⤴ opens a modal with:

**Content**:
- City name (EN + ZH)
- Country + flag
- `soul.headline` as city tagline
- Nomadic brand text: "Nomadic — 为数字游民而生的城市指南"
- QR code pointing to: `https://nomadictree.netlify.app/`

**Actions**:
- 「复制链接」button (copies current page URL)
- 「生成卡片」button (future: generates image card for WeChat/social sharing)

---

## Data Structure Changes

### cities.ts Updates

```typescript
export interface CityData {
  // ... existing fields
  soul: {
    headline: string
    body: string  // NEW: paragraph intro for main card
    sub: string
    // Expanded view content:
    personality: string  // 城市性格
    economy: string      // 经济支柱
    festivals: string    // 节日庆典
    figures: string      // 历史人物
  }
  base: {
    // ... existing fields
    // Expanded view content:
    safety: string       // 治安与安全
    dailyCost: string    // 每日花销
    visaDetail: string   // 签证政策
    society: string      // 社会运转
  }
  chance: {
    paragraph: string
    policy: { label: string; url: string; desc: string }  // NEW: desc
    localJobs: { name: string; url: string; desc: string }[]  // NEW: desc
    remoteJobs: { name: string; url: string; desc: string }[]  // NEW: desc
  }
  local: {
    platforms: { name: string; url: string; desc: string }[]  // NEW: desc
  }
}
```

### GLOBAL_COMMUNITIES Cleanup
Remove:
- Remote Year
- Couchsurfing Hangouts

---

## Implementation Approach

### Component Structure
- **Main page**: `app/insights/page.tsx` (current)
- **New modals**:
  - `SoulExpandModal.tsx` — full-screen soul details
  - `BaseExpandModal.tsx` — full-screen base details
  - `ShareModal.tsx` — share card + QR code

### Modal Behavior
- Full-screen overlay (z-index: 100)
- Slide-up animation
- Close: X button (top-right) or swipe down gesture
- Scroll within modal for long content

### QR Code Generation
Use `qrcode` npm package:
```bash
npm install qrcode @types/qrcode
```

Generate QR pointing to `https://nomadictree.netlify.app/insights?city={cityName}`

---

## Why This Design

**Expandable quadrants**: Keeps main page scannable while allowing deep dives  
**Platform descriptions**: Helps users understand what each link offers before clicking  
**Share with QR**: Makes it easy to share discoveries via WeChat/social  
**Centered headers**: Improves visual balance and hierarchy  
**Bold section titles**: Creates clear four-module structure at a glance

---

## Out of Scope (Future)
- Community comments section (最近3个月评论) — deferred
- Link validation automation — manual cleanup for now
- Image card generation for sharing — start with link copy only
