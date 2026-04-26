# Globe Map, Hover Fix & Search Prompts Redesign — Design Spec
Date: 2026-04-27

## Overview

Three focused improvements to the Nomadic homepage:
1. Replace the flat SVG world map with a slowly rotating pseudo-3D globe
2. Fix hover effects (city tags + nav buttons) using React state instead of CSS classes
3. Redesign search prompts as structured 3-line sets (city + 2 nomad questions), all European cities

---

## 1. GlobeMap Component

**New file:** `components/GlobeMap.tsx` (replaces `components/WorldMap.tsx` in page.tsx)

**Projection:** `geoOrthographic` from react-simple-maps

**Rotation animation:**
- `useRef` stores `lon` (current longitude, 0–360)
- `requestAnimationFrame` loop increments `lon` by 0.08 per frame (~80s full rotation at 60fps)
- `useState` for `rotate: [number, number, number]` drives `projectionConfig={{ rotate: [lon, -20, 0] }}`
- `onMouseEnter` pauses rotation, `onMouseLeave` resumes

**Visual:**
- Ocean background: a filled `<circle>` behind the geographies, color `#e8f4f0` (soft teal-white)
- Land fill: `#f0ebe0`, stroke `#d8cdb8` at 0.5px
- City dots: `var(--accent)` (#1D9E75), r=4 with glow ring r=8 opacity 0.15
- City labels: Chinese name, fontSize 6, below dot (y=12), only rendered when city is on visible hemisphere (react-simple-maps clips automatically)
- Cursor: pointer on city dots

**Props:** same as WorldMap — `{ cities: string[], onCityClick: (city: string) => void }`

**Container height:** 160px (up from 72px) in `app/page.tsx`

**Page.tsx map card changes:**
- Container height: 160px
- Header row: remove "点击展开 ›" link, replace right side with stats (see section 2)
- Keep bottom hint text: "点击发光点 · 进入该城市印迹"

---

## 2. Stats Row

In the map card header, replace `<span onClick={() => router.push('/vault')}>点击展开 ›</span>` with:

```
走过 X 个国家 · X 个城市
```

- Countries: `new Set(savedCities.map(c => c.country)).size`
- Cities: `new Set(imprints.map(i => i.city)).size`
- Style: `fontSize: 10, color: var(--text-muted)`
- No click handler

---

## 3. Hover Effects Fix

**Root cause:** React inline `style` props have higher specificity than CSS class rules. The CSS `.city-tag:hover` and `.nav-btn:hover` rules are overridden by inline styles in some cases, and Tailwind v4's CSS layer ordering can further suppress them.

**Fix:** Use React `onMouseEnter`/`onMouseLeave` with inline style overrides. CSS classes in globals.css are kept but no longer relied upon.

### City tags (app/page.tsx)
Add `hoveredCity: string | null` state. On each city tag button:
```tsx
onMouseEnter={() => setHoveredCity(city.en)}
onMouseLeave={() => setHoveredCity(null)}
style={{
  fontSize: 11,
  padding: '5px 11px',
  borderRadius: 8,
  background: 'var(--accent-dim)',
  color: 'var(--accent-text)',
  border: `${hoveredCity === city.en ? '1.5px' : '0.5px'} solid var(--accent-border)`,
  cursor: 'pointer',
  fontWeight: hoveredCity === city.en ? 600 : 500,
  transform: hoveredCity === city.en ? 'scale(1.06)' : 'scale(1)',
  transition: 'all 120ms ease',
}}
```
Remove `className="city-tag"`.

### Nav buttons (components/BottomNav.tsx)
Add `hoveredNav: string | null` state. On each button:
```tsx
onMouseEnter={() => setHoveredNav(id)}
onMouseLeave={() => setHoveredNav(null)}
style={{
  ...existingStyle,
  transform: hoveredNav === id ? 'scale(1.08)' : 'scale(1)',
  transition: 'transform 120ms ease',
}}
```
Remove `className="nav-btn"`.

---

## 4. Search Prompts Redesign

### Data structure

**Replace** `data/searchPrompts.ts` with a new structure:

```typescript
export interface SearchPrompt {
  city: string   // line 1: European city name
  line2: string  // line 2: nomad/travel question
  line3: string  // line 3: nomad/travel question
}

export const SEARCH_PROMPTS: SearchPrompt[] = [ ... ]
```

### Content — 40 prompts, all European cities

```
{ city: '柏林', line2: '我想找佛罗伦萨画廊的工作', line3: '欧洲哪个地方适合安静地写作？' }
{ city: '里斯本', line2: '葡萄牙的数字游民签证好申请吗？', line3: '哪里的咖啡馆适合长时间工作？' }
{ city: '巴塞罗那', line2: '西班牙自雇签证需要哪些材料？', line3: '欧洲哪个城市的创意社群最活跃？' }
{ city: '布拉格', line2: '捷克的生活成本和柏林比怎么样？', line3: '哪里适合独立开发者长住？' }
{ city: '阿姆斯特丹', line2: '荷兰的创业签证适合我吗？', line3: '欧洲哪个城市的设计氛围最好？' }
{ city: '维也纳', line2: '奥地利对自由职业者友好吗？', line3: '哪里的古典音乐和现代创意结合得最好？' }
{ city: '波尔图', line2: '葡萄牙北部和里斯本哪个更适合定居？', line3: '欧洲哪里的租金最低又有活力？' }
{ city: '塔林', line2: '爱沙尼亚的电子居留是什么？', line3: '波罗的海三国哪个最适合数字游民？' }
{ city: '布达佩斯', line2: '匈牙利的签证政策对非欧盟公民友好吗？', line3: '欧洲哪个城市的夜生活和工作氛围并存？' }
{ city: '都柏林', line2: '爱尔兰的科技公司好找工作吗？', line3: '英语环境的欧洲城市还有哪些选择？' }
{ city: '马德里', line2: '西班牙的气候和工作节奏适合我吗？', line3: '欧洲哪里的户外生活方式最丰富？' }
{ city: '斯德哥尔摩', line2: '北欧的生活成本值得吗？', line3: '哪里的工作与生活平衡做得最好？' }
{ city: '哥本哈根', line2: '丹麦对外国自由职业者开放吗？', line3: '欧洲哪个城市的可持续生活方式最成熟？' }
{ city: '佛罗伦萨', line2: '意大利的艺术行业好进入吗？', line3: '哪里适合做创意类工作的人长住？' }
{ city: '罗马', line2: '意大利的自雇签证流程是怎样的？', line3: '欧洲哪个城市的历史感和现代感结合得最好？' }
{ city: '雅典', line2: '希腊的数字游民签证有哪些条件？', line3: '南欧哪里的生活成本最低？' }
{ city: '巴黎', line2: '法国的自由职业签证适合哪类人？', line3: '欧洲哪里的时尚和设计行业机会最多？' }
{ city: '苏黎世', line2: '瑞士的生活成本和薪资水平匹配吗？', line3: '哪里适合金融或科技背景的游民？' }
{ city: '爱丁堡', line2: '英国脱欧后对欧洲人的影响大吗？', line3: '哪里的文学和艺术氛围最浓厚？' }
{ city: '里加', line2: '拉脱维亚的生活成本在欧洲算低吗？', line3: '波罗的海地区适合长期定居吗？' }
{ city: '萨格勒布', line2: '克罗地亚的数字游民签证怎么申请？', line3: '巴尔干地区哪个城市最值得探索？' }
{ city: '布鲁塞尔', line2: '比利时对欧盟外的自由职业者开放吗？', line3: '欧洲哪里的国际化程度最高？' }
{ city: '赫尔辛基', line2: '芬兰的创业生态对外国人友好吗？', line3: '北欧哪个城市最适合科技从业者？' }
{ city: '奥斯陆', line2: '挪威的工作签证好申请吗？', line3: '北欧的自然环境和城市生活怎么平衡？' }
{ city: '华沙', line2: '波兰的生活成本和发展机会怎么样？', line3: '中东欧哪个城市的科技行业发展最快？' }
{ city: '贝尔格莱德', line2: '塞尔维亚对数字游民有什么政策？', line3: '巴尔干地区的生活节奏是什么感觉？' }
{ city: '第比利斯', line2: '格鲁吉亚的免签政策对中国人友好吗？', line3: '高加索地区适合长期定居吗？' }
{ city: '米兰', line2: '意大利的时尚行业对外国人开放吗？', line3: '欧洲哪里的设计和商业结合得最好？' }
{ city: '瓦伦西亚', line2: '西班牙的海滨城市和首都比哪个更适合定居？', line3: '欧洲哪里的生活节奏最舒适？' }
{ city: '维尔纽斯', line2: '立陶宛的创业环境怎么样？', line3: '波罗的海三国中哪个城市最有活力？' }
{ city: '布拉迪斯拉发', line2: '斯洛伐克和捷克哪个更适合定居？', line3: '中欧小国的生活成本有多低？' }
{ city: '萨拉热窝', line2: '波黑的签证政策对亚洲人友好吗？', line3: '巴尔干地区的文化多样性是什么体验？' }
{ city: '杜布罗夫尼克', line2: '克罗地亚的旅游旺季对长住者影响大吗？', line3: '欧洲哪里的海岸线最适合工作度假？' }
{ city: '马拉加', line2: '西班牙南部的数字游民社群活跃吗？', line3: '欧洲哪里全年阳光最充足？' }
{ city: '卢布尔雅那', line2: '斯洛文尼亚的自然环境和城市生活怎么结合？', line3: '小而精的欧洲城市有哪些值得关注？' }
{ city: '塞维利亚', line2: '安达卢西亚的生活方式适合长期定居吗？', line3: '欧洲哪里的弗拉门戈和创意文化最浓？' }
{ city: '克拉科夫', line2: '波兰的历史名城和现代创业氛围并存吗？', line3: '中欧哪里的艺术和文化场景最丰富？' }
{ city: '根特', line2: '比利时的小城市和布鲁塞尔比哪个更宜居？', line3: '欧洲哪里的大学城氛围最好？' }
{ city: '洛桑', line2: '瑞士的法语区和德语区生活有什么不同？', line3: '欧洲哪里的湖景和城市生活结合得最好？' }
{ city: '雷克雅未克', line2: '冰岛的生活成本真的那么高吗？', line3: '极北地区的极昼极夜生活是什么体验？' }
```

### Typewriter animation update (SearchBox.tsx)

- `getDailyPrompt()` returns a `SearchPrompt` object (not a string)
- localStorage key: `nomadic_daily_prompt_v2` (avoid conflict with old string format)
- The full placeholder string is: `prompt.city + '\n' + prompt.line2 + '\n' + prompt.line3`
- Restore `LINE_PAUSE = 400` between lines (was removed in previous iteration)
- Typewriter logic: same character-by-character animation, `\n` triggers LINE_PAUSE

---

## Files Changed

| File | Change |
|------|--------|
| `components/GlobeMap.tsx` | New — rotating globe component |
| `components/WorldMap.tsx` | Kept (not deleted), but no longer used in page.tsx |
| `app/page.tsx` | Use GlobeMap, 160px container, stats row, remove "点击展开", hoveredCity state |
| `components/BottomNav.tsx` | hoveredNav state for hover effects |
| `data/searchPrompts.ts` | Replace with SearchPrompt[] interface + 40 three-line prompts |
| `components/SearchBox.tsx` | Update getDailyPrompt to return SearchPrompt, restore LINE_PAUSE logic |
