# Homepage Phase 2 Polish — Design Spec
Date: 2026-04-27

## Overview

A set of focused UI polish tasks for the Nomadic homepage and global components. No new pages or data models. All changes are confined to existing files plus one new map component.

---

## 1. Page Title

`app/layout.tsx` metadata already has `title: 'Nomadic 像种树一样生活'`. Verify it renders correctly in the browser tab — no code change needed unless it's missing.

---

## 2. Quadrant Section Label

Add `—— 洞察四个象限 ——` above the 2×2 quadrant grid in `app/page.tsx`, using the same style as the existing `—— 你想去哪里 ——` divider:

```
fontSize: 11, color: var(--text-muted), textAlign: 'center', marginBottom: 8
```

Quadrant click behavior is already correct (`pulse()` on the search box). No change needed there.

---

## 3. Real World Map (react-simple-maps)

Replace the placeholder "我的全球版图" map area with a real SVG world map.

**Library:** `react-simple-maps` (no API key required, lightweight SVG)

**New file:** `components/WorldMap.tsx`

**Props:**
```ts
interface WorldMapProps {
  cities: string[]  // city English names from imprints
}
```

**City coordinates:** A `CITY_COORDS` record in `data/cityCoords.ts` mapping English city name → `[longitude, latitude]`. Cover all cities in `NOMAD_CITY_POOL` + `PINNED_CITIES` plus common imprint cities (Berlin, Amsterdam, Lisbon, Prague, Tallinn, Bangkok, etc.).

**Visual style:**
- Map background: transparent (inherits `var(--bg-page)`)
- Ocean: transparent
- Land fill: `#f0ebe0` (warm off-white, matches app palette)
- Country borders: `#d8cdb8` at 0.5px
- City dots: `var(--accent)` (#1D9E75), radius 3px, with a soft glow ring (`box-shadow` equivalent via SVG `filter`)
- City label: Chinese name, `fontSize: 7`, `color: var(--accent)`, positioned below dot
- First imprint city gets a slightly larger dot (r=4) and bolder label

**Map projection:** `"geoNaturalEarth1"` — visually balanced, familiar world shape

**Height:** Keep the same 72px container height as current placeholder, but allow the SVG to fill it fully. Use `projectionConfig` to center and scale appropriately.

**Interaction:** Clicking a city dot navigates to `/insights` with that city selected (same behavior as current dots).

---

## 4. Hover & Click Effects

All hover effects use CSS classes in `globals.css` to avoid per-element React state.

### City Tags (`.city-tag`)
- Default: current style
- Hover: `transform: scale(1.06)`, `border-width: 1.5px`, `font-weight: 600`
- Active/click: `transform: scale(1.04)`, `font-weight: 700`
- Transition: `all 120ms ease`

### Bottom Nav Buttons (`.nav-btn`)
- Hover: `transform: scale(1.08)`
- Transition: `transform 120ms ease`

### General hoverable cards/links (`.hover-lift`)
- Hover: `transform: scale(1.02)`, border thickens by 0.5px
- Transition: `all 150ms ease`

Apply `.city-tag` to city tag buttons in `app/page.tsx`. Apply `.nav-btn` to nav buttons in `components/BottomNav.tsx`.

---

## 5. Daily Random Search Placeholder

Replace the hardcoded `PLACEHOLDER_LINES` in `SearchBox.tsx` with a daily-refreshed random prompt.

**Prompt pool:** `data/searchPrompts.ts` — 20 prompts, one per line, covering: design, writing, remote dev, food/restaurant, education, art, finance, healthcare, architecture, sustainability, music, film, fashion, legal, consulting, photography, yoga/wellness, publishing, gaming, social enterprise. All positive and forward-looking.

Examples:
- `我想在欧洲找一个适合开独立咖啡馆的城市`
- `哪里的设计师社群最活跃？`
- `我是一名自由摄影师，想找租金低、光线好的城市`
- `适合做可持续时尚品牌的欧洲城市`

**Daily refresh logic** (in `SearchBox.tsx`):
```ts
function getDailyPrompt(): string {
  const today = new Date().toISOString().slice(0, 10) // "2026-04-27"
  const stored = localStorage.getItem('nomadic_daily_prompt')
  if (stored) {
    const { date, index } = JSON.parse(stored)
    if (date === today) return SEARCH_PROMPTS[index]
  }
  const index = Math.floor(Math.random() * SEARCH_PROMPTS.length)
  localStorage.setItem('nomadic_daily_prompt', JSON.stringify({ date: today, index }))
  return SEARCH_PROMPTS[index]
}
```

The typewriter animation runs on this single prompt string (no multi-line join needed).

---

## 6. Error Toast Redesign

**Trigger:** `SearchBox.tsx` sets `error: true` when `result.success === false` or `confidence < 0.3`. Currently this only turns the border red with no text.

**New behavior:**
1. On error, show a toast overlay with text `"哎呀没有理解你"`
2. Toast appears instantly at full opacity
3. After 1000ms, fades out over 300ms, then unmounts

**Toast style** (update `ErrorToast.tsx`):
- `background: rgba(255, 255, 255, 0.72)`
- `backdropFilter: blur(12px)`
- `border: 1px solid rgba(0,0,0,0.08)`
- `color: var(--text-primary)`
- `borderRadius: 14px`
- `padding: 14px 22px`
- `fontSize: 13px`, `fontWeight: 500`
- Centered on screen, `zIndex: 9999`
- Shadow: `0 4px 20px rgba(0,0,0,0.12)`

**Wiring:** In `SearchBox.tsx`, when error occurs, call a new `onError` prop OR manage the toast state internally. Since `ErrorToast` is already a separate component imported in `app/page.tsx`, the cleanest approach is to lift the error message up: `SearchBox` accepts an `onError: (msg: string) => void` prop, calls `onError('哎呀没有理解你')` instead of `setError(true)`. `app/page.tsx` already has `errorMessage` state and renders `<ErrorToast>`.

The red border on the search box is removed (error state no longer changes border color).

---

## Files Changed

| File | Change |
|------|--------|
| `app/layout.tsx` | Verify title (likely no change) |
| `app/page.tsx` | Add quadrant label, apply CSS classes, wire `onError` to SearchBox, update map section |
| `components/SearchBox.tsx` | Daily prompt logic, `onError` prop, remove red-border error state |
| `components/ErrorToast.tsx` | Frosted glass style, hardcode "哎呀没有理解你" |
| `components/WorldMap.tsx` | New — react-simple-maps world map |
| `components/BottomNav.tsx` | Add `.nav-btn` class |
| `data/searchPrompts.ts` | New — 20 daily prompt strings |
| `data/cityCoords.ts` | New — city name → [lng, lat] coords |
| `app/globals.css` | Add `.city-tag`, `.nav-btn`, `.hover-lift` CSS classes |
| `package.json` | Add `react-simple-maps` + `@types/react-simple-maps` |
