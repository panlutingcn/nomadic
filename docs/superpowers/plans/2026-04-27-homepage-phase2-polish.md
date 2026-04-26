# Homepage Phase 2 Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the Nomadic homepage with a real SVG world map, daily rotating search prompts, hover effects, frosted-glass error toast, and minor copy/label fixes.

**Architecture:** All changes are confined to existing files plus two new data files and one new component. No new pages, no new API routes. The world map uses react-simple-maps (SVG, no API key). Hover effects are CSS-only via globals.css classes.

**Tech Stack:** Next.js 16, React 19, TypeScript, react-simple-maps v3, CSS custom properties

---

### Task 1: Install react-simple-maps

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
cd /Users/alicepan/Desktop/FemAI/nomadic-app
npm install react-simple-maps
```

Expected output: `added N packages` with no errors.

- [ ] **Step 2: Verify TypeScript types are included**

```bash
ls node_modules/react-simple-maps/dist/index.d.ts
```

Expected: file exists (types are bundled in v3, no `@types/` package needed).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-simple-maps"
```

---

### Task 2: Create data/cityCoords.ts

**Files:**
- Create: `data/cityCoords.ts`

- [ ] **Step 1: Create the file**

```typescript
// [longitude, latitude] — covers all cities in NOMAD_CITY_POOL + PINNED_CITIES + common imprint cities
export const CITY_COORDS: Record<string, [number, number]> = {
  Lisbon:        [-9.1393,  38.7223],
  Berlin:        [13.4050,  52.5200],
  Barcelona:     [ 2.1734,  41.3851],
  Amsterdam:     [ 4.9041,  52.3676],
  Prague:        [14.4378,  50.0755],
  Vienna:        [16.3738,  48.2082],
  Paris:         [ 2.3522,  48.8566],
  Porto:         [-8.6291,  41.1579],
  Dublin:        [-6.2603,  53.3498],
  Florence:      [11.2558,  43.7696],
  Tallinn:       [24.7536,  59.4370],
  Budapest:      [19.0402,  47.4979],
  Warsaw:        [21.0122,  52.2297],
  Krakow:        [19.9450,  50.0647],
  Bucharest:     [26.1025,  44.4268],
  Sofia:         [23.3219,  42.6977],
  Athens:        [23.7275,  37.9838],
  Thessaloniki:  [22.9444,  40.6401],
  Valencia:      [-0.3763,  39.4699],
  Seville:       [-5.9845,  37.3891],
  Malaga:        [-4.4214,  36.7213],
  Madrid:        [-3.7038,  40.4168],
  Milan:         [ 9.1900,  45.4654],
  Rome:          [12.4964,  41.9028],
  Bologna:       [11.3426,  44.4949],
  Turin:         [ 7.6869,  45.0703],
  Tbilisi:       [44.8271,  41.6938],
  Yerevan:       [44.5152,  40.1872],
  Baku:          [49.8671,  40.4093],
  Riga:          [24.1052,  56.9496],
  Vilnius:       [25.2797,  54.6872],
  Bratislava:    [17.1077,  48.1486],
  Ljubljana:     [14.5058,  46.0569],
  Zagreb:        [15.9819,  45.8150],
  Split:         [16.4402,  43.5081],
  Dubrovnik:     [18.0944,  42.6507],
  Kotor:         [18.7714,  42.4247],
  Tirana:        [19.8189,  41.3275],
  Skopje:        [21.4314,  41.9981],
  Belgrade:      [20.4612,  44.8176],
  'Novi Sad':    [19.8335,  45.2671],
  Sarajevo:      [18.4131,  43.8563],
  Copenhagen:    [12.5683,  55.6761],
  Stockholm:     [18.0686,  59.3293],
  Helsinki:      [24.9384,  60.1699],
  Oslo:          [10.7522,  59.9139],
  Reykjavik:     [-21.9426, 64.1466],
  Edinburgh:     [-3.1883,  55.9533],
  London:        [-0.1276,  51.5074],
  Manchester:    [-2.2426,  53.4808],
  Brussels:      [ 4.3517,  50.8503],
  Ghent:         [ 3.7174,  51.0543],
  Zurich:        [ 8.5417,  47.3769],
  Geneva:        [ 6.1432,  46.2044],
  Bern:          [ 7.4474,  46.9480],
  Lausanne:      [ 6.6323,  46.5197],
  Nicosia:       [33.3823,  35.1856],
  Valletta:      [14.5146,  35.8997],
  Funchal:       [-16.9039, 32.6669],
  'Las Palmas':  [-15.4128, 28.1235],
  'Chiang Mai':  [98.9853,  18.7883],
  Bangkok:       [100.5018, 13.7563],
}
```

- [ ] **Step 2: Commit**

```bash
git add data/cityCoords.ts
git commit -m "feat: add city coordinate data for world map"
```

---

### Task 3: Create data/searchPrompts.ts

**Files:**
- Create: `data/searchPrompts.ts`

- [ ] **Step 1: Create the file**

```typescript
export const SEARCH_PROMPTS: string[] = [
  '我想在欧洲找一个适合开独立咖啡馆的城市',
  '哪里的设计师社群最活跃？',
  '我是自由摄影师，想找租金低、光线好的城市',
  '适合做可持续时尚品牌的欧洲城市',
  '我想在海边城市做瑜伽教练',
  '哪个城市的科技创业生态最适合独立开发者？',
  '我是建筑师，想找有历史感又有创意氛围的城市',
  '适合安静写作的欧洲小城',
  '我想在当地开一家有机餐厅',
  '哪里的音乐现场最丰富？',
  '我是教育工作者，想找国际化程度高的城市',
  '适合做社会企业的城市',
  '我想找一个适合拍电影的欧洲城市',
  '哪里的法律环境对自由职业者最友好？',
  '我是游戏开发者，想找有活跃独立游戏社区的城市',
  '适合做健康食品品牌的城市',
  '我想在当地做独立出版或书店',
  '哪个城市的金融科技生态最成熟？',
  '我是医疗从业者，想了解哪里的医疗创业机会最多',
  '适合做绿色建筑咨询的欧洲城市',
]
```

- [ ] **Step 2: Commit**

```bash
git add data/searchPrompts.ts
git commit -m "feat: add daily search prompt pool"
```

---

### Task 4: Create components/WorldMap.tsx

**Files:**
- Create: `components/WorldMap.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { CITY_COORDS } from '@/data/cityCoords'
import { NOMAD_CITY_POOL, PINNED_CITIES } from '@/data/nomadCities'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const CITY_ZH: Record<string, string> = Object.fromEntries(
  [...PINNED_CITIES, ...NOMAD_CITY_POOL].map(c => [c.en, c.zh])
)
CITY_ZH['Bangkok'] = '曼谷'

interface WorldMapProps {
  cities: string[]
  onCityClick: (city: string) => void
}

export default function WorldMap({ cities, onCityClick }: WorldMapProps) {
  const dots = cities
    .map((en, i) => ({ en, zh: CITY_ZH[en] ?? en, coords: CITY_COORDS[en], isFirst: i === 0 }))
    .filter(d => d.coords != null)

  return (
    <ComposableMap
      projection="geoNaturalEarth1"
      projectionConfig={{ scale: 120, center: [20, 40] }}
      style={{ width: '100%', height: '100%' }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map(geo => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#f0ebe0"
              stroke="#d8cdb8"
              strokeWidth={0.5}
              style={{
                default: { outline: 'none' },
                hover:   { outline: 'none', fill: '#ede8df' },
                pressed: { outline: 'none' },
              }}
            />
          ))
        }
      </Geographies>
      {dots.map(({ en, zh, coords, isFirst }) => (
        <Marker
          key={en}
          coordinates={coords}
          onClick={() => onCityClick(en)}
          style={{ cursor: 'pointer' }}
        >
          <circle r={isFirst ? 4 : 3} fill="#1D9E75" opacity={0.9} />
          <circle r={isFirst ? 9 : 6} fill="#1D9E75" opacity={0.12} />
          <text
            textAnchor="middle"
            y={11}
            style={{ fontSize: 5, fill: '#1D9E75', fontWeight: isFirst ? 600 : 400, pointerEvents: 'none' }}
          >
            {zh}
          </text>
        </Marker>
      ))}
    </ComposableMap>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/WorldMap.tsx
git commit -m "feat: add WorldMap component with react-simple-maps"
```

---

### Task 5: Add hover CSS classes to globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Append hover classes at the end of globals.css**

Add after the last line of `app/globals.css`:

```css
.city-tag {
  transition: transform 120ms ease, border-width 120ms ease, font-weight 120ms ease;
}
.city-tag:hover {
  transform: scale(1.06);
  border-width: 1.5px !important;
  font-weight: 600 !important;
}
.city-tag:active {
  transform: scale(1.04);
  font-weight: 700 !important;
}

.nav-btn {
  transition: transform 120ms ease;
}
.nav-btn:hover {
  transform: scale(1.08);
}

.hover-lift {
  transition: transform 150ms ease, border-width 150ms ease;
}
.hover-lift:hover {
  transform: scale(1.02);
  border-width: 1px !important;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat: add hover scale CSS classes"
```

---

### Task 6: Update SearchBox.tsx

**Files:**
- Modify: `components/SearchBox.tsx`

Changes: replace hardcoded placeholder with daily-refreshed prompt; add `onError` prop; remove red-border error state.

- [ ] **Step 1: Replace the full file content**

```tsx
'use client'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { SEARCH_PROMPTS } from '@/data/searchPrompts'

const CHAR_DELAY = 60

export interface SearchBoxHandle {
  fill: (text: string) => void
  pulse: () => void
}

interface SearchBoxProps {
  onError?: (msg: string) => void
}

function getDailyPrompt(): string {
  const today = new Date().toISOString().slice(0, 10)
  try {
    const stored = localStorage.getItem('nomadic_daily_prompt')
    if (stored) {
      const { date, index } = JSON.parse(stored)
      if (date === today) return SEARCH_PROMPTS[index]
    }
    const index = Math.floor(Math.random() * SEARCH_PROMPTS.length)
    localStorage.setItem('nomadic_daily_prompt', JSON.stringify({ date: today, index }))
    return SEARCH_PROMPTS[index]
  } catch {
    return SEARCH_PROMPTS[0]
  }
}

const SearchBox = forwardRef<SearchBoxHandle, SearchBoxProps>(({ onError }, ref) => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [placeholder, setPlaceholder] = useState('')
  const [pulsing, setPulsing] = useState(false)
  const router = useRouter()
  const { setSelectedCity, setSearchContext } = useApp()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(ref, () => ({
    fill: (text: string) => {
      setQuery(text)
      textareaRef.current?.focus()
    },
    pulse: () => {
      setPulsing(true)
      setTimeout(() => setPulsing(false), 700)
    },
  }))

  useEffect(() => {
    const prompt = getDailyPrompt()
    let i = 0
    let timeout: ReturnType<typeof setTimeout>

    const type = () => {
      if (i <= prompt.length) {
        setPlaceholder(prompt.slice(0, i))
        i++
        timeout = setTimeout(type, CHAR_DELAY)
      }
    }

    timeout = setTimeout(type, 300)
    return () => clearTimeout(timeout)
  }, [])

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() })
      })

      const result = await res.json()

      if (!result.success || result.confidence < 0.3) {
        onError?.('哎呀没有理解你')
        setLoading(false)
        return
      }

      setSearchContext({
        cityName: result.cityName,
        cityNameZh: result.cityNameZh,
        country: result.country,
        countryZh: result.countryZh,
        flag: result.flag,
        confidence: result.confidence,
        userIntent: result.userIntent,
        relevantSections: result.relevantSections,
        aiInsight: result.aiInsight,
        soulHeadline: result.soulHeadline,
        wifiSpeed: result.wifiSpeed,
        costLevel: result.costLevel,
        visaInfo: result.visaInfo,
        chanceParagraph: result.chanceParagraph,
      })

      setSelectedCity(result.cityName)
      router.push('/insights')
    } catch {
      onError?.('哎呀没有理解你')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const borderColor = pulsing ? 'var(--accent)' : 'var(--border-light)'
  const boxShadow = pulsing ? '0 0 0 4px rgba(29,158,117,0.2)' : '0 2px 6px rgba(0,0,0,0.06)'

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `2.5px solid ${borderColor}`,
      borderRadius: '12px',
      padding: '12px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      margin: '14px 0 4px',
      boxShadow,
      transition: 'border-color 200ms ease, box-shadow 200ms ease'
    }}>
      <textarea
        ref={textareaRef}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        style={{
          fontSize: '12px',
          color: 'var(--text-primary)',
          lineHeight: 1.6,
          background: 'none',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontFamily: 'inherit'
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          style={{
            background: loading ? 'var(--text-muted)' : 'var(--accent)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: !query.trim() ? 0.5 : 1
          }}
        >
          {loading ? '搜索中...' : 'GO'}
        </button>
      </div>
    </div>
  )
})

SearchBox.displayName = 'SearchBox'
export default SearchBox
```

- [ ] **Step 2: Commit**

```bash
git add components/SearchBox.tsx
git commit -m "feat: daily rotating search prompt, onError prop, remove red-border error"
```

---

### Task 7: Update ErrorToast.tsx

**Files:**
- Modify: `components/ErrorToast.tsx`

Change: frosted glass style, hardcode "哎呀没有理解你" text.

- [ ] **Step 1: Replace the full file content**

```tsx
'use client'
import { useEffect, useState } from 'react'

interface ErrorToastProps {
  onClose: () => void
}

export default function ErrorToast({ onClose }: ErrorToastProps) {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0)
      setTimeout(onClose, 300)
    }, 1000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(255, 255, 255, 0.72)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(0,0,0,0.08)',
      color: 'var(--text-primary)',
      padding: '14px 22px',
      borderRadius: '14px',
      fontSize: '13px',
      fontWeight: 500,
      zIndex: 9999,
      opacity,
      transition: 'opacity 300ms ease',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      pointerEvents: 'none',
    }}>
      哎呀没有理解你
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ErrorToast.tsx
git commit -m "feat: frosted glass error toast with new copy"
```

---

### Task 8: Update app/page.tsx

**Files:**
- Modify: `app/page.tsx`

Changes:
1. Add `—— 洞察四个象限 ——` label above quadrant grid
2. Apply `.city-tag` class to city tag buttons
3. Wire `onError={setErrorMessage}` to `<SearchBox>`
4. Remove `message` prop from `<ErrorToast>` (it's now hardcoded)
5. Replace placeholder map div with `<WorldMap>`

- [ ] **Step 1: Add the WorldMap import and update imports at top of file**

Replace the existing import block (lines 1–12) with:

```tsx
'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import SearchBox, { SearchBoxHandle } from '@/components/SearchBox'
import GuideModal from '@/components/GuideModal'
import ErrorToast from '@/components/ErrorToast'
import WorldMap from '@/components/WorldMap'
import { useApp } from '@/context/AppContext'
import { CITIES } from '@/data/cities'
import { PINNED_CITIES, NOMAD_CITY_POOL, NomadCity } from '@/data/nomadCities'
import { shuffle } from '@/utils/shuffle'
```

- [ ] **Step 2: Wire onError to SearchBox**

Find:
```tsx
<SearchBox ref={searchBoxRef} />
```

Replace with:
```tsx
<SearchBox ref={searchBoxRef} onError={setErrorMessage} />
```

- [ ] **Step 3: Add quadrant section label**

Find:
```tsx
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 12 }}>
```

Replace with:
```tsx
<div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 8 }}>—— 洞察四个象限 ——</div>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 12 }}>
```

- [ ] **Step 4: Apply .city-tag class to city tag buttons**

Find the city tag button style block:
```tsx
style={{
  fontSize: 11, fontWeight: 500, padding: '5px 11px', borderRadius: 8,
  background: 'var(--accent-dim)', color: 'var(--accent-text)',
  border: '0.5px solid var(--accent-border)', cursor: 'pointer',
  transform: isPressed ? 'scale(0.96)' : 'scale(1)',
  transition: 'transform 100ms ease',
}}
```

Replace with:
```tsx
className="city-tag"
style={{
  fontSize: 11, fontWeight: 500, padding: '5px 11px', borderRadius: 8,
  background: 'var(--accent-dim)', color: 'var(--accent-text)',
  border: '0.5px solid var(--accent-border)', cursor: 'pointer',
}}
```

Also remove the `pressedCity` state and its handlers (`onMouseDown`, `onMouseUp`, `onMouseLeave`) from the button — the CSS `:active` handles the press effect now. Remove:
```tsx
const [pressedCity, setPressedCity] = useState<string | null>(null)
```
And remove `onMouseDown`, `onMouseUp`, `onMouseLeave` props from the button.

- [ ] **Step 5: Replace the placeholder map div with WorldMap**

Find the inner map div (the 72px height div with hardcoded city dots):
```tsx
<div style={{ height: 72, position: 'relative', background: 'var(--bg-page)', borderRadius: 8, overflow: 'hidden' }}>
  {imprintCities.map((city, i) => {
    ...
  })}
</div>
```

Replace with:
```tsx
<div style={{ height: 72, position: 'relative', background: 'var(--bg-page)', borderRadius: 8, overflow: 'hidden' }}>
  <WorldMap
    cities={imprintCities}
    onCityClick={(city) => {
      setSelectedCity(city in CITIES ? city : 'Berlin')
      router.push('/insights')
    }}
  />
</div>
```

- [ ] **Step 6: Remove message prop from ErrorToast**

Find:
```tsx
{errorMessage && <ErrorToast message={errorMessage} onClose={() => setErrorMessage('')} />}
```

Replace with:
```tsx
{errorMessage && <ErrorToast onClose={() => setErrorMessage('')} />}
```

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx
git commit -m "feat: quadrant label, city-tag hover, WorldMap, wire error toast"
```

---

### Task 9: Update BottomNav.tsx

**Files:**
- Modify: `components/BottomNav.tsx`

Add `.nav-btn` class to all nav buttons.

- [ ] **Step 1: Add className="nav-btn" to each of the four nav buttons**

There are 4 `<button>` elements in BottomNav. Add `className="nav-btn"` to each one. Example for the first:

```tsx
<button
  className="nav-btn"
  onClick={() => router.push('/')}
  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1, background: 'none', border: 'none', cursor: 'pointer' }}
>
```

Apply the same `className="nav-btn"` to the remaining three buttons (insights, meet, vault). The center story button is a `<button>` inside a `<div>` — add `className="nav-btn"` to that inner button too.

- [ ] **Step 2: Commit**

```bash
git add components/BottomNav.tsx
git commit -m "feat: nav button hover scale effect"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Page title — already correct in layout.tsx, no task needed (noted in spec)
- ✅ `—— 洞察四个象限 ——` label — Task 8 Step 3
- ✅ Quadrant click → pulse search box — already implemented, no change needed
- ✅ Real world map with react-simple-maps — Tasks 1, 2, 4, 8 Step 5
- ✅ City dots at real coordinates — Task 2 (coords), Task 4 (WorldMap renders them)
- ✅ Hover effects on city tags — Tasks 5 + 8 Step 4
- ✅ Click city tag → bold + navigate to insights — CSS `:active` in Task 5, existing `handleCityClick` handles navigation
- ✅ Nav hover effects — Tasks 5 + 9
- ✅ Daily rotating search prompts — Tasks 3 + 6
- ✅ Error copy changed to "哎呀没有理解你" — Task 7
- ✅ Frosted glass error toast, 1s then fade — Task 7
- ✅ `onError` prop wiring — Tasks 6 + 8 Step 2 + 8 Step 6

**Placeholder scan:** None found.

**Type consistency:**
- `SearchBoxProps.onError: (msg: string) => void` — defined Task 6, used Task 8 Step 2 ✅
- `ErrorToast` no longer takes `message` prop — removed Task 7, updated Task 8 Step 6 ✅
- `WorldMapProps.cities: string[]` + `onCityClick: (city: string) => void` — defined Task 4, used Task 8 Step 5 ✅
- `CITY_COORDS: Record<string, [number, number]>` — defined Task 2, used Task 4 ✅
- `SEARCH_PROMPTS: string[]` — defined Task 3, used Task 6 ✅
