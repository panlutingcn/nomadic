# Smart Search & Homepage Optimization - Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add intelligent natural language search using Deepseek AI, optimize homepage UI with enhanced search box, random city display, guide modal, error toast, and page transitions.

**Architecture:** Backend API route calls Deepseek to parse user queries and extract city/intent. Frontend components handle UI enhancements. AppContext extended to store search results. URL params pass search context to insights page.

**Tech Stack:** Next.js 14, React, TypeScript, Deepseek API, CSS animations

---

## File Structure

**New files:**
- `app/api/search/route.ts` - Deepseek search API endpoint
- `components/SearchBox.tsx` - Enhanced multi-line search component
- `components/GuideModal.tsx` - First-time user guide overlay
- `components/ErrorToast.tsx` - Error notification toast
- `data/genericInsights.ts` - Default insights for no-city state
- `utils/shuffle.ts` - Array shuffle utility
- `lib/deepseek.ts` - Deepseek API client

**Modified files:**
- `app/page.tsx` - Integrate new search box, random cities, guide modal
- `app/insights/page.tsx` - Handle search context, show AI insights, generic state
- `context/AppContext.tsx` - Add search result state
- `data/cities.ts` - Add city coordinates for map (future)

---

### Task 1: Deepseek API Client

**Files:**
- Create: `lib/deepseek.ts`
- Test: Manual test via curl

- [ ] **Step 1: Write Deepseek client module**

```typescript
// lib/deepseek.ts
export interface SearchResult {
  cityName: string
  cityNameZh: string
  confidence: number
  userIntent: string
  relevantSections: ('soul' | 'base' | 'chance' | 'local')[]
  aiInsight: string
  fallbackCity: string | null
}

const SYSTEM_PROMPT = `你是一个城市搜索助手。用户会输入关于城市的查询，你需要：

1. 识别城市名称（支持中文、英文、大小写不敏感）
2. 提取用户意图和关键信息
3. 判断相关的信息板块（soul/base/chance/local）
4. 生成针对性的描述（50-100字）

可用城市列表：
Berlin(柏林), Amsterdam(阿姆斯特丹), Lisbon(里斯本), Bangkok(曼谷), 
Prague(布拉格), Vienna(维也纳), Paris(巴黎), Barcelona(巴塞罗那), 
Porto(波尔图), Dublin(都柏林), Dubrovnik(杜布罗夫尼克), 
Florence(佛罗伦萨), Tallinn(塔林)

如果用户输入的城市不在列表中，根据用户的完整描述推荐最匹配的城市。

请以 JSON 格式返回：
{
  "cityName": "英文城市名",
  "cityNameZh": "中文城市名",
  "confidence": 0.0-1.0,
  "userIntent": "用户意图摘要",
  "relevantSections": ["相关板块数组"],
  "aiInsight": "针对性描述",
  "fallbackCity": "如果是推荐城市则填写，否则null"
}`

export async function searchCity(query: string): Promise<SearchResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY not configured')
  }

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })
  })

  if (!response.ok) {
    throw new Error(`Deepseek API error: ${response.status}`)
  }

  const data = await response.json()
  const result = JSON.parse(data.choices[0].message.content)
  
  return result as SearchResult
}
```

- [ ] **Step 2: Verify API key is set**

Check `.env.local` exists and has DEEPSEEK_API_KEY:

```bash
grep DEEPSEEK_API_KEY .env.local
```

Expected: `DEEPSEEK_API_KEY=sk-...`

If missing, create `.env.local` with the key.

- [ ] **Step 3: Commit**

```bash
git add lib/deepseek.ts
git commit -m "feat: add Deepseek API client for city search

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Search API Route

**Files:**
- Create: `app/api/search/route.ts`
- Test: `curl -X POST http://localhost:3000/api/search -d '{"query":"柏林"}'`

- [ ] **Step 1: Write search API route**

```typescript
// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { searchCity } from '@/lib/deepseek'

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()
    
    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const result = await searchCity(query.trim())
    
    return NextResponse.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Search failed'
      },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: Test API route locally**

Start dev server in background:

```bash
npm run dev
```

Wait 5 seconds for server to start, then test:

```bash
sleep 5 && curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"柏林"}' | jq
```

Expected: JSON with `success: true`, `cityName: "Berlin"`, `confidence > 0.8`

- [ ] **Step 3: Commit**

```bash
git add app/api/search/route.ts
git commit -m "feat: add search API route with Deepseek integration

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Generic Insights Data

**Files:**
- Create: `data/genericInsights.ts`

- [ ] **Step 1: Write generic insights constants**

```typescript
// data/genericInsights.ts
export const GENERIC_INSIGHTS = {
  soul: {
    headline: '每座城市都有自己的灵魂',
    sub: '等待你去发现它的文化内核与独特气质'
  },
  base: {
    description: '了解一座城市的生存基准：网络、物价、签证、医疗'
  },
  chance: {
    description: '探索当地的商业机会与职业发展可能性'
  },
  local: {
    description: '找到志同道合的人，融入本地社群'
  }
}

export const GENERIC_CITY = {
  name: '世界上的某座城市',
  nameZh: '世界上的某座城市',
  country: '世界上的某个国家',
  countryZh: '世界上的某个国家',
  flag: '🌍',
  match: 0
}
```

- [ ] **Step 2: Commit**

```bash
git add data/genericInsights.ts
git commit -m "feat: add generic insights for no-city state

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Utility Functions

**Files:**
- Create: `utils/shuffle.ts`

- [ ] **Step 1: Write shuffle utility**

```typescript
// utils/shuffle.ts
export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
```

- [ ] **Step 2: Commit**

```bash
git add utils/shuffle.ts
git commit -m "feat: add array shuffle utility

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 5: AppContext Extension

**Files:**
- Modify: `context/AppContext.tsx`

- [ ] **Step 1: Add search result state to AppContext**

```typescript
// Add to AppContext.tsx interface
export interface SearchContext {
  cityName: string
  userIntent: string
  relevantSections: string[]
  aiInsight: string
}

interface AppState {
  // ... existing fields
  searchContext: SearchContext | null
  setSearchContext: (context: SearchContext | null) => void
}
```

- [ ] **Step 2: Add state and provider implementation**

```typescript
// In AppProvider component, add:
const [searchContext, setSearchContext] = useState<SearchContext | null>(null)

// Add to context value:
return (
  <AppContext.Provider value={{
    // ... existing values
    searchContext,
    setSearchContext,
  }}>
    {children}
  </AppContext.Provider>
)
```

- [ ] **Step 3: Commit**

```bash
git add context/AppContext.tsx
git commit -m "feat: add search context to AppContext

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 6: Error Toast Component

**Files:**
- Create: `components/ErrorToast.tsx`

- [ ] **Step 1: Write ErrorToast component**

```typescript
// components/ErrorToast.tsx
'use client'
import { useEffect, useState } from 'react'

interface ErrorToastProps {
  message: string
  onClose: () => void
}

export default function ErrorToast({ message, onClose }: ErrorToastProps) {
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
      background: 'rgba(0, 0, 0, 0.85)',
      color: '#fff',
      padding: '16px 24px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 500,
      zIndex: 9999,
      opacity,
      transition: 'opacity 300ms ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      {message}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ErrorToast.tsx
git commit -m "feat: add error toast component

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 7: Guide Modal Component

**Files:**
- Create: `components/GuideModal.tsx`

- [ ] **Step 1: Write GuideModal component**

```typescript
// components/GuideModal.tsx
'use client'
import { useEffect, useState } from 'react'

interface GuideModalProps {
  onClose: () => void
}

export default function GuideModal({ onClose }: GuideModalProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      localStorage.setItem('hasSeenGuide', 'true')
      onClose()
    }, 200)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9998,
      opacity: show ? 1 : 0,
      transition: 'opacity 200ms ease'
    }} onClick={handleClose}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '320px',
        width: '90%',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        position: 'relative',
        transform: show ? 'scale(1)' : 'scale(0.95)',
        transition: 'transform 200ms ease'
      }} onClick={e => e.stopPropagation()}>
        <button onClick={handleClose} style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          fontSize: '20px',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          padding: '4px',
          lineHeight: 1
        }}>×</button>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '12px' }}>
            欢迎来到 Nomadic 🌍
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            在搜索框输入你想去的城市，<br/>
            或描述你的旅居想法，<br/>
            我们会为你找到最合适的目的地。
          </div>
          <button onClick={handleClose} style={{
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            知道了
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/GuideModal.tsx
git commit -m "feat: add first-time guide modal

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 8: Enhanced Search Box Component

**Files:**
- Create: `components/SearchBox.tsx`

- [ ] **Step 1: Write SearchBox component**

```typescript
// components/SearchBox.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const router = useRouter()
  const { setSelectedCity, setSearchContext } = useApp()

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setLoading(true)
    setError(false)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() })
      })

      const result = await res.json()

      if (!result.success || result.confidence < 0.3) {
        setError(true)
        setLoading(false)
        return
      }

      setSearchContext({
        cityName: result.cityName,
        userIntent: result.userIntent,
        relevantSections: result.relevantSections,
        aiInsight: result.aiInsight
      })

      setSelectedCity(result.cityName)
      router.push('/insights')
    } catch (err) {
      console.error('Search error:', err)
      setError(true)
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

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `2.5px solid ${error ? '#e07050' : 'var(--border-light)'}`,
      borderRadius: '12px',
      padding: '12px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      margin: '14px 0 4px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
      transition: 'border-color 200ms ease'
    }}>
      <textarea
        value={query}
        onChange={e => { setQuery(e.target.value); setError(false) }}
        onKeyDown={handleKeyDown}
        placeholder="柏林&#10;我想去佛罗伦萨的画廊工作&#10;欧洲哪里适合一个人安静写作？"
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
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SearchBox.tsx
git commit -m "feat: add enhanced search box with Deepseek integration

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 9: Homepage Integration

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Import new components and utilities**

Add imports at top of `app/page.tsx`:

```typescript
import SearchBox from '@/components/SearchBox'
import GuideModal from '@/components/GuideModal'
import ErrorToast from '@/components/ErrorToast'
import { shuffle } from '@/utils/shuffle'
```

- [ ] **Step 2: Add state for guide modal and error toast**

In HomePage component, add after existing useState:

```typescript
const [showGuide, setShowGuide] = useState(false)
const [showError, setShowError] = useState(false)
const [randomCities, setRandomCities] = useState<string[]>([])

useEffect(() => {
  const hasSeenGuide = localStorage.getItem('hasSeenGuide')
  if (!hasSeenGuide) {
    setShowGuide(true)
  }

  const allCities = ['Berlin', 'Paris', 'Amsterdam', 'Lisbon', 'Barcelona', 
    'Prague', 'Vienna', 'Tallinn', 'Porto', 'Dublin', 'Dubrovnik', 'Florence']
  const shuffled = shuffle(allCities)
  setRandomCities(shuffled.slice(0, 9))
}, [])
```

- [ ] **Step 3: Replace old search box with SearchBox component**

Replace the existing search input section (lines ~177-190) with:

```typescript
<SearchBox />
```

- [ ] **Step 4: Update city tags to use random cities**

Replace the city buttons section (lines ~193-198) with:

```typescript
<div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '8px' }}>—— 你想去哪里 ——</div>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
  {randomCities.map(city => (
    <button 
      key={city} 
      onClick={() => handleCityClick(city)} 
      style={{ 
        fontSize: '11px', 
        fontWeight: 500, 
        padding: '5px 11px', 
        borderRadius: '8px', 
        background: 'var(--accent-dim)', 
        color: 'var(--accent-text)', 
        border: '0.5px solid var(--accent-border)', 
        cursor: 'pointer',
        transition: 'all 150ms ease'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.04)'
        e.currentTarget.style.borderWidth = '1.5px'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.borderWidth = '0.5px'
      }}
      onMouseDown={e => {
        e.currentTarget.style.transform = 'scale(1.06)'
        e.currentTarget.style.fontWeight = '600'
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform = 'scale(1.04)'
        e.currentTarget.style.fontWeight = '500'
      }}
    >
      {city}
    </button>
  ))}
  <button 
    onClick={() => {
      const allCities = Object.keys(CITIES)
      const randomCity = allCities[Math.floor(Math.random() * allCities.length)]
      handleCityClick(randomCity)
    }}
    style={{ 
      fontSize: '11px', 
      fontWeight: 500, 
      padding: '5px 11px', 
      borderRadius: '8px', 
      background: 'var(--bg-card-2)', 
      color: 'var(--text-secondary)', 
      border: '0.5px solid var(--border-light)', 
      cursor: 'pointer' 
    }}
  >
    随机探索
  </button>
</div>
```

- [ ] **Step 5: Add section title above quadrants**

Before the quadrants grid (line ~202), add:

```typescript
<div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px' }}>
  —— 洞察四个象限 ——
</div>
```

- [ ] **Step 6: Add modals at end of component**

Before closing `</div>` and `<BottomNav />`, add:

```typescript
{showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
{showError && <ErrorToast message="哎呀我没理解" onClose={() => setShowError(false)} />}
```

- [ ] **Step 7: Remove old search error handling**

Remove the old searchError state and its display (lines ~21, 187-190).

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx
git commit -m "feat: integrate enhanced search, random cities, and guide modal

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 10: Insights Page Enhancement

**Files:**
- Modify: `app/insights/page.tsx`

- [ ] **Step 1: Import generic insights**

Add import at top:

```typescript
import { GENERIC_INSIGHTS, GENERIC_CITY } from '@/data/genericInsights'
```

- [ ] **Step 2: Get search context from AppContext**

In InsightsPage component, add after existing useApp destructuring:

```typescript
const { selectedCity, isCitySaved, toggleSaveCity, searchContext } = useApp()
```

- [ ] **Step 3: Handle generic city state**

Replace the city lookup logic (lines ~10-14) with:

```typescript
const hasCity = selectedCity && selectedCity in CITIES
const city = hasCity 
  ? CITIES[selectedCity]
  : {
      ...GENERIC_CITY,
      soul: GENERIC_INSIGHTS.soul,
      base: { 
        wifi: '-', 
        cost: '-', 
        visa: '-', 
        welfare: GENERIC_INSIGHTS.base.description 
      },
      chance: { 
        paragraph: GENERIC_INSIGHTS.chance.description,
        policy: { label: '', url: '' },
        localJobs: [],
        remoteJobs: []
      },
      local: { 
        paragraph: GENERIC_INSIGHTS.local.description,
        communities: []
      }
    }
```

- [ ] **Step 4: Add AI insight card for search context**

After the city header section (after line ~60), add:

```typescript
{searchContext && searchContext.aiInsight && (
  <div style={{ 
    background: '#f0f9ff', 
    border: '1.5px solid #7dd3fc', 
    borderRadius: '10px', 
    padding: '10px 12px', 
    marginBottom: '12px',
    borderLeft: '4px solid var(--accent)'
  }}>
    <div style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 500, marginBottom: '4px' }}>
      💡 根据你的搜索
    </div>
    <div style={{ fontSize: '11px', color: '#0c4a6e', lineHeight: 1.5 }}>
      {searchContext.aiInsight}
    </div>
  </div>
)}
```

- [ ] **Step 5: Add highlight for relevant sections**

Wrap each section (soul, base, chance, local) with conditional highlighting:

```typescript
const isRelevant = (section: string) => 
  searchContext?.relevantSections.includes(section as any)

// Then for each section, add to the container style:
style={{ 
  // ... existing styles
  border: isRelevant('soul') ? '2px solid var(--accent)' : '0.5px solid #e8c98a',
  background: isRelevant('soul') ? '#f0fdf4' : '#faeeda'
}}
```

Apply this pattern to all four sections (soul, base, chance, local).

- [ ] **Step 6: Commit**

```bash
git add app/insights/page.tsx
git commit -m "feat: add AI insights display and generic city state

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 11: Testing & Verification

**Files:**
- Test: All components

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test search functionality**

Open http://localhost:3000 in browser and test:
1. First visit shows guide modal
2. Search "柏林" → jumps to Berlin insights
3. Search "我想去佛罗伦萨找画廊工作" → shows Florence with AI insight
4. Search "tokyo" → shows error toast
5. Click random city → works
6. Click "随机探索" → jumps to random city

- [ ] **Step 3: Test insights page states**

1. Direct visit to /insights → shows generic city
2. Search with intent → shows AI insight card
3. Relevant sections are highlighted

- [ ] **Step 4: Verify localStorage**

Check browser console:
```javascript
localStorage.getItem('hasSeenGuide')
```
Should be 'true' after closing guide.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "test: verify all phase 1 features working

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Spec Coverage Review

✅ **Intelligent search** - Task 1-2, 8
✅ **Enhanced search box** - Task 8
✅ **Random city display** - Task 9
✅ **Guide modal** - Task 7, 9
✅ **Error toast** - Task 6, 9
✅ **Generic insights** - Task 3, 10
✅ **AI insight display** - Task 10
✅ **Section highlighting** - Task 10

## Notes

- Page transition animations deferred to future iteration
- World map SVG deferred to future iteration
- Country search deferred to future iteration
- All core search and UI enhancements completed
