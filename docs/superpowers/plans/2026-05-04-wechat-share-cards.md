# WeChat Share Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a share flow to the homepage, insights page, and imprint detail page that generates a branded PNG card the user can save or share to WeChat or any other app; the insights page also supports a "copy link" option that renders as a rich WeChat preview via OG meta tags.

**Architecture:** Each page gets a `ShareSheet` bottom drawer (two options: copy link / generate card). Card generation renders a hidden DOM element → `html2canvas` → PNG → `navigator.share` or download fallback. All three card types share `CardShell` (top + bottom zones); only the middle "content zone" differs per page.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, `html2canvas` (new), `qrcode.react` (already installed), Supabase for profile data.

---

## File Map

**New files:**
- `components/cards/CardShell.tsx` — shared top zone (logo + "此时此地" + user avatar/nickname) and bottom zone (taglines + URL + QR code); accepts `children` for the content zone
- `components/cards/BrandCard.tsx` — homepage card: wraps `CardShell` with 4 quadrant rows
- `components/cards/CityCard.tsx` — insights card: wraps `CardShell` with city name + country + flag + AI description
- `components/cards/ImprintCard.tsx` — imprint card: wraps `CardShell` with photo + text excerpt + city/country/flag
- `components/ShareSheet.tsx` — bottom drawer with "复制链接" (optional) and "生成分享卡片" buttons; accepts a card `ref` and a `showCopyLink` prop
- `lib/generateCardImage.ts` — `html2canvas` wrapper: accepts a `HTMLElement` ref → returns a `File` (PNG)
- `app/insights/layout.tsx` — server component that exports `generateMetadata` with OG tags for WeChat link preview
- `public/og-default.png` — 1200×630 static brand image for OG meta (create manually or use a placeholder)

**Modified files:**
- `app/page.tsx` — add share button + `ShareSheet` + hidden `BrandCard`
- `app/insights/page.tsx` — replace inline `showShare` modal with `ShareSheet` + hidden `CityCard`
- `app/imprint/[id]/page.tsx` — replace `handleShare` with `ShareSheet` + hidden `ImprintCard`

---

## Task 1: Install html2canvas

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
cd /Users/alicepan/Desktop/FemAI/nomadic-app
npm install html2canvas@^1.4.1
```

Expected: `html2canvas` appears in `package.json` dependencies.

- [ ] **Step 2: Verify types are available**

```bash
grep "html2canvas" package.json
```

Expected output includes `"html2canvas": "^1.4.1"`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install html2canvas for PNG card generation"
```

---

## Task 2: Create `generateCardImage` utility

**Files:**
- Create: `lib/generateCardImage.ts`

- [ ] **Step 1: Create the file**

```typescript
// lib/generateCardImage.ts
import html2canvas from 'html2canvas'

export async function generateCardImage(element: HTMLElement): Promise<File> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  })
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error('canvas.toBlob returned null')); return }
      resolve(new File([blob], 'nomadic-card.png', { type: 'image/png' }))
    }, 'image/png')
  })
}

export async function shareOrDownloadCard(element: HTMLElement): Promise<void> {
  const file = await generateCardImage(element)
  const canShare = typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  if (canShare) {
    await navigator.share({ files: [file], title: 'Nomadic 此时此地' })
  } else {
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = 'nomadic-card.png'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/generateCardImage.ts
git commit -m "feat: add generateCardImage html2canvas utility"
```

---

## Task 3: Create `CardShell` — shared card wrapper

**Files:**
- Create: `components/cards/CardShell.tsx`

This component renders the top zone (logo + user info) and bottom zone (taglines + URL + QR code). It is 375px wide and designed for `html2canvas` capture — no Tailwind classes that rely on CSS variables, use inline styles only (html2canvas renders inline styles reliably).

- [ ] **Step 1: Create the file**

```typescript
// components/cards/CardShell.tsx
import { QRCodeSVG } from 'qrcode.react'

interface CardShellProps {
  nickname: string
  avatarUrl: string | null
  children: React.ReactNode
}

export default function CardShell({ nickname, avatarUrl, children }: CardShellProps) {
  return (
    <div style={{
      width: 375,
      background: 'linear-gradient(160deg, #f5f0e8 0%, #ede4d4 100%)',
      borderRadius: 16,
      overflow: 'hidden',
      fontFamily: "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif",
      boxShadow: '0 8px 32px rgba(61,48,32,0.18)',
    }}>
      {/* Top zone */}
      <div style={{
        padding: '18px 20px 14px',
        borderBottom: '0.5px solid rgba(61,48,32,0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🌳</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#3d3020', lineHeight: 1.2 }}>Nomadic</div>
            <div style={{ fontSize: 11, color: '#8a7560', lineHeight: 1.2 }}>此时此地</div>
          </div>
        </div>
        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 12, color: '#5a4a38', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {nickname}
          </div>
          {avatarUrl ? (
            <img src={avatarUrl} alt={nickname} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} crossOrigin="anonymous" />
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', fontWeight: 600 }}>
              {(nickname[0] ?? 'N').toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Content zone */}
      <div style={{ padding: '20px 20px 16px' }}>
        {children}
      </div>

      {/* Bottom zone */}
      <div style={{
        padding: '14px 20px 20px',
        borderTop: '0.5px solid rgba(61,48,32,0.12)',
        background: 'rgba(255,255,255,0.35)',
      }}>
        <div style={{ fontSize: 12, color: '#8a7560', lineHeight: 1.7, marginBottom: 12 }}>
          <div>在世界各地扎根，而不只是路过。</div>
          <div>一个给数字游民的灵感与商机社区。</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: '#1D9E75', fontWeight: 600, letterSpacing: 0.3 }}>nomadictree.io</div>
          <QRCodeSVG value="https://nomadictree.io" size={64} bgColor="transparent" fgColor="#3d3020" />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/cards/CardShell.tsx
git commit -m "feat: add CardShell shared card wrapper component"
```

---

## Task 4: Create `BrandCard` — homepage card

**Files:**
- Create: `components/cards/BrandCard.tsx`

- [ ] **Step 1: Create the file**

```typescript
// components/cards/BrandCard.tsx
import CardShell from './CardShell'

interface BrandCardProps {
  nickname: string
  avatarUrl: string | null
}

const QUADRANTS = [
  { icon: '🌿', label: '城市灵魂', desc: '文化氛围、生活节奏、社区性格' },
  { icon: '🏠', label: '生存基准', desc: '住房、消费、签证、基础设施' },
  { icon: '💡', label: '商业机会', desc: '创业环境、行业生态、远程工作资源' },
  { icon: '🤝', label: '本地圈子', desc: '社群、活动、找到同频的探索者' },
]

export default function BrandCard({ nickname, avatarUrl }: BrandCardProps) {
  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl}>
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#3d3020', marginBottom: 14, letterSpacing: 0.3 }}>探索每座城市的四个维度</div>
        {QUADRANTS.map((q) => (
          <div key={q.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 18, lineHeight: 1.3 }}>{q.icon}</span>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#3d3020' }}>{q.label}</span>
              <span style={{ fontSize: 12, color: '#8a7560', marginLeft: 6 }}>— {q.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/cards/BrandCard.tsx
git commit -m "feat: add BrandCard component for homepage sharing"
```

---

## Task 5: Create `CityCard` — insights card

**Files:**
- Create: `components/cards/CityCard.tsx`

- [ ] **Step 1: Create the file**

```typescript
// components/cards/CityCard.tsx
import CardShell from './CardShell'

interface CityCardProps {
  nickname: string
  avatarUrl: string | null
  cityNameZh: string
  cityNameEn: string
  countryZh: string
  flag: string
  description: string
}

export default function CityCard({ nickname, avatarUrl, cityNameZh, cityNameEn, countryZh, flag, description }: CityCardProps) {
  const truncated = description.length > 100 ? description.slice(0, 100) + '…' : description

  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl}>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#3d3020', lineHeight: 1.2 }}>{cityNameZh || cityNameEn}</span>
          {cityNameZh && cityNameEn && cityNameZh !== cityNameEn && (
            <span style={{ fontSize: 14, color: '#8a7560' }}>{cityNameEn}</span>
          )}
        </div>
        <div style={{ fontSize: 14, color: '#5a4a38', marginBottom: 14 }}>
          {flag} {countryZh}
        </div>
        <div style={{ height: '0.5px', background: 'rgba(61,48,32,0.15)', marginBottom: 14 }} />
        <div style={{ fontSize: 13, color: '#5a4a38', lineHeight: 1.8 }}>{truncated}</div>
      </div>
    </CardShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/cards/CityCard.tsx
git commit -m "feat: add CityCard component for insights page sharing"
```

---

## Task 6: Create `ImprintCard` — imprint detail card

**Files:**
- Create: `components/cards/ImprintCard.tsx`

- [ ] **Step 1: Create the file**

```typescript
// components/cards/ImprintCard.tsx
import CardShell from './CardShell'

interface ImprintCardProps {
  nickname: string
  avatarUrl: string | null
  photo: string | undefined
  narrative: string
  cityNameZh: string
  countryZh: string
  flag: string
  cityBgColor?: string
}

export default function ImprintCard({
  nickname, avatarUrl, photo, narrative, cityNameZh, countryZh, flag, cityBgColor = '#ede8df'
}: ImprintCardProps) {
  const excerpt = narrative.length > 80 ? narrative.slice(0, 80) + '…' : narrative

  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl}>
      <div>
        {/* Photo or placeholder */}
        <div style={{ width: '100%', height: 160, borderRadius: 10, overflow: 'hidden', marginBottom: 14, background: cityBgColor, position: 'relative' }}>
          {photo ? (
            <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'rgba(61,48,32,0.4)' }}>
              {cityNameZh}
            </div>
          )}
        </div>
        {/* Text excerpt */}
        <div style={{ fontSize: 13, color: '#5a4a38', lineHeight: 1.8, marginBottom: 12 }}>{excerpt}</div>
        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8a7560' }}>
          <span>📍</span>
          <span>{cityNameZh}{countryZh ? ` · ${flag} ${countryZh}` : ''}</span>
        </div>
      </div>
    </CardShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/cards/ImprintCard.tsx
git commit -m "feat: add ImprintCard component for imprint sharing"
```

---

## Task 7: Create `ShareSheet` component

**Files:**
- Create: `components/ShareSheet.tsx`

This is a bottom drawer that slides up over the page. It accepts a `cardRef` pointing to the hidden card DOM element (for capture), a `showCopyLink` flag (true only on insights page), and the current URL for copy.

- [ ] **Step 1: Create the file**

```typescript
// components/ShareSheet.tsx
'use client'
import { useState, RefObject } from 'react'
import { shareOrDownloadCard } from '@/lib/generateCardImage'

interface ShareSheetProps {
  isOpen: boolean
  onClose: () => void
  cardRef: RefObject<HTMLDivElement | null>
  showCopyLink?: boolean
  copyUrl?: string
}

export default function ShareSheet({ isOpen, onClose, cardRef, showCopyLink = false, copyUrl }: ShareSheetProps) {
  const [generating, setGenerating] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  if (!isOpen) return null

  const handleCopyLink = async () => {
    if (!copyUrl) return
    try {
      await navigator.clipboard.writeText(copyUrl)
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch {
      setCopyStatus('failed')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }

  const handleGenerateCard = async () => {
    if (!cardRef.current || generating) return
    setGenerating(true)
    try {
      await shareOrDownloadCard(cardRef.current)
    } catch (err) {
      console.error('Card generation failed:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{ width: '100%', background: 'var(--bg-page)', borderRadius: '18px 18px 0 0', padding: '24px 20px 40px' }}
      >
        <div style={{ width: 36, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 20px' }} />

        {showCopyLink && (
          <button
            onClick={handleCopyLink}
            style={{ width: '100%', padding: '13px', borderRadius: 12, background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', fontSize: 14, color: 'var(--text-primary)', cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <span>🔗</span>
            <span>{copyStatus === 'copied' ? '链接已复制！' : copyStatus === 'failed' ? '复制失败' : '复制链接'}</span>
          </button>
        )}

        <button
          onClick={handleGenerateCard}
          disabled={generating}
          style={{ width: '100%', padding: '13px', borderRadius: 12, background: 'var(--accent)', border: 'none', fontSize: 14, color: '#fff', cursor: generating ? 'default' : 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: generating ? 0.75 : 1 }}
        >
          <span>🖼️</span>
          <span>{generating ? '生成中…' : '生成分享卡片'}</span>
        </button>

        <button
          onClick={onClose}
          style={{ width: '100%', padding: '11px', borderRadius: 12, background: 'none', border: '0.5px solid var(--border-light)', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          关闭
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ShareSheet.tsx
git commit -m "feat: add ShareSheet bottom drawer component"
```

---

## Task 8: Wire share flow into homepage

**Files:**
- Modify: `app/page.tsx`

The homepage needs: (1) a share button added to the top nav area, (2) state for `showShareSheet`, (3) a `cardRef`, (4) a hidden `BrandCard`, (5) user profile fetch for nickname/avatarUrl.

- [ ] **Step 1: Read the current top nav section of the homepage**

Read `app/page.tsx` lines 1–100 to understand the imports and top-level structure before editing.

- [ ] **Step 2: Add imports and state**

At the top of `app/page.tsx`, add these imports after the existing ones:

```typescript
import ShareSheet from '@/components/ShareSheet'
import BrandCard from '@/components/cards/BrandCard'
import { supabase } from '@/lib/supabase'
```

Inside `HomePage`, add these state variables and the profile fetch (place after the existing `const { user } = useAuth()` line):

```typescript
const [showShareSheet, setShowShareSheet] = useState(false)
const brandCardRef = useRef<HTMLDivElement>(null)
const [profileNickname, setProfileNickname] = useState<string>('探索者')
const [profileAvatar, setProfileAvatar] = useState<string | null>(null)

useEffect(() => {
  if (!user) { setProfileNickname('探索者'); setProfileAvatar(null); return }
  supabase.from('profiles').select('nickname, avatar_url').eq('id', user.id).single()
    .then(({ data }) => {
      if (data) {
        setProfileNickname(data.nickname ?? user.user_metadata?.nickname ?? '探索者')
        setProfileAvatar(data.avatar_url ?? null)
      }
    })
}, [user?.id])
```

- [ ] **Step 3: Add share button to the top nav**

Find the tree logo / title section in the JSX (around the decorative tree SVG area) and add a share button. Look for the area that has the title "Nomadic 此时此地" — add a share button nearby. The exact placement depends on the current layout; add it as an absolutely-positioned button in the top-right corner of the page:

```typescript
{/* Share button — top right */}
<button
  onClick={() => setShowShareSheet(true)}
  aria-label="分享"
  style={{ position: 'fixed', top: 16, right: 16, zIndex: 10, width: 34, height: 32, border: '0.5px solid var(--border-light)', borderRadius: 8, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: 'var(--text-secondary)', cursor: 'pointer' }}
>
  ⤴
</button>
```

- [ ] **Step 4: Add hidden BrandCard and ShareSheet to JSX**

Before the closing `</div>` of the root element, add:

```typescript
{/* Hidden card for capture */}
<div style={{ position: 'absolute', left: -9999, top: 0, pointerEvents: 'none' }}>
  <div ref={brandCardRef}>
    <BrandCard nickname={profileNickname} avatarUrl={profileAvatar} />
  </div>
</div>

<ShareSheet
  isOpen={showShareSheet}
  onClose={() => setShowShareSheet(false)}
  cardRef={brandCardRef}
  showCopyLink={false}
/>
```

- [ ] **Step 5: Verify it renders**

```bash
npm run dev
```

Open `http://localhost:3000` in browser. Verify share button appears top-right. Click it — ShareSheet slides up with "生成分享卡片" button. Click "生成分享卡片" — should generate and download/share a PNG.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add share button and brand card to homepage"
```

---

## Task 9: Wire share flow into insights page

**Files:**
- Modify: `app/insights/page.tsx`

The insights page already has a `showShare` state and `⤴` button. Replace the existing inline share modal with `ShareSheet` + `CityCard`.

- [ ] **Step 1: Add imports**

Add at the top of `app/insights/page.tsx`:

```typescript
import ShareSheet from '@/components/ShareSheet'
import CityCard from '@/components/cards/CityCard'
import { supabase } from '@/lib/supabase'
```

- [ ] **Step 2: Add profile state and card ref**

Inside `InsightsPage`, after the existing `const { user } = useAuth()` (or add `useAuth` import if missing), add:

```typescript
const { user } = useAuth()
const cityCardRef = useRef<HTMLDivElement>(null)
const [profileNickname, setProfileNickname] = useState<string>('探索者')
const [profileAvatar, setProfileAvatar] = useState<string | null>(null)

useEffect(() => {
  if (!user) { setProfileNickname('探索者'); setProfileAvatar(null); return }
  supabase.from('profiles').select('nickname, avatar_url').eq('id', user.id).single()
    .then(({ data }) => {
      if (data) {
        setProfileNickname(data.nickname ?? user.user_metadata?.nickname ?? '探索者')
        setProfileAvatar(data.avatar_url ?? null)
      }
    })
}, [user?.id])
```

Note: check if `useAuth` is already imported in insights/page.tsx. If not, add `import { useAuth } from '@/context/AuthContext'` to the imports.

- [ ] **Step 3: Remove the existing inline share modal, add ShareSheet**

Find and delete the entire `{showShare && ( ... )}` block (lines ~363–400 in the current file). Replace it with:

```typescript
{/* Hidden city card for capture */}
<div style={{ position: 'absolute', left: -9999, top: 0, pointerEvents: 'none' }}>
  <div ref={cityCardRef}>
    <CityCard
      nickname={profileNickname}
      avatarUrl={profileAvatar}
      cityNameZh={city.nameZh || ''}
      cityNameEn={city.name}
      countryZh={city.countryZh || searchContext?.countryZh || ''}
      flag={city.flag || searchContext?.flag || '🌍'}
      description={city.soul.body || searchContext?.soulBody || ''}
    />
  </div>
</div>

<ShareSheet
  isOpen={showShare}
  onClose={closeShare}
  cardRef={cityCardRef}
  showCopyLink={true}
  copyUrl={pageUrl}
/>
```

- [ ] **Step 4: Remove `copyStatus` state if it's no longer used**

The old share modal used `copyStatus` state. After removing the modal, check if `copyStatus` is still referenced anywhere in the file. If not, remove the state declaration `const [copyStatus, setCopyStatus] = useState<...>` to avoid lint warnings.

- [ ] **Step 5: Verify**

```bash
npm run dev
```

Open insights page with a city selected. Click `⤴` — ShareSheet appears with "复制链接" and "生成分享卡片". Test both buttons.

- [ ] **Step 6: Commit**

```bash
git add app/insights/page.tsx
git commit -m "feat: replace insights share modal with ShareSheet + CityCard"
```

---

## Task 10: Wire share flow into imprint detail page

**Files:**
- Modify: `app/imprint/[id]/page.tsx`

The imprint detail page has an existing `handleShare` function and `⤴` button. Replace with `ShareSheet` + `ImprintCard`.

- [ ] **Step 1: Add imports**

Add at the top of `app/imprint/[id]/page.tsx`:

```typescript
import ShareSheet from '@/components/ShareSheet'
import ImprintCard from '@/components/cards/ImprintCard'
import { useAuth } from '@/context/AuthContext'
import { CITIES } from '@/data/cities'
import { supabase } from '@/lib/supabase'
```

- [ ] **Step 2: Add state inside `ImprintDetailPage`**

After `const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)`, add:

```typescript
const { user } = useAuth()
const [showShareSheet, setShowShareSheet] = useState(false)
const imprintCardRef = useRef<HTMLDivElement>(null)
const [profileNickname, setProfileNickname] = useState<string>('探索者')
const [profileAvatar, setProfileAvatar] = useState<string | null>(null)

useEffect(() => {
  if (!user) { setProfileNickname('探索者'); setProfileAvatar(null); return }
  supabase.from('profiles').select('nickname, avatar_url').eq('id', user.id).single()
    .then(({ data }) => {
      if (data) {
        setProfileNickname(data.nickname ?? user.user_metadata?.nickname ?? '探索者')
        setProfileAvatar(data.avatar_url ?? null)
      }
    })
}, [user?.id])
```

- [ ] **Step 3: Replace `handleShare` button with ShareSheet trigger**

Find line 110:
```typescript
<button aria-label="分享" onClick={handleShare} ...>⤴</button>
```

Change to:
```typescript
<button aria-label="分享" onClick={() => setShowShareSheet(true)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-primary)' }}>⤴</button>
```

Remove the `handleShare` function entirely (lines 71–88).

- [ ] **Step 4: Derive city/country/flag for ImprintCard**

After the `const cityNameZh = CITY_NAME_MAP[imprint.city] || imprint.city` line, add:

```typescript
const cityEntry = CITIES[imprint.city]
const imprintCountryZh = cityEntry?.countryZh ?? ''
const imprintFlag = cityEntry?.flag ?? ''
const CITY_BG: Record<string, string> = {
  Berlin: '#ede8df', Amsterdam: '#e8edf0', Lisbon: '#e8e2d8', Prague: '#e8e8ed',
}
const cityBg = CITY_BG[imprint.city] ?? '#ede8df'
```

- [ ] **Step 5: Add hidden ImprintCard and ShareSheet to JSX**

Before the closing root `</div>`, add:

```typescript
{/* Hidden imprint card for capture */}
<div style={{ position: 'absolute', left: -9999, top: 0, pointerEvents: 'none' }}>
  <div ref={imprintCardRef}>
    <ImprintCard
      nickname={profileNickname}
      avatarUrl={profileAvatar}
      photo={imprint.photo}
      narrative={imprint.narrative}
      cityNameZh={cityNameZh}
      countryZh={imprintCountryZh}
      flag={imprintFlag}
      cityBgColor={cityBg}
    />
  </div>
</div>

<ShareSheet
  isOpen={showShareSheet}
  onClose={() => setShowShareSheet(false)}
  cardRef={imprintCardRef}
  showCopyLink={false}
/>
```

- [ ] **Step 6: Remove unused `showToast` and toast timer if no longer needed**

After removing `handleShare`, check if `showToast`, `setShowToast`, and `toastTimer` are still used elsewhere in the file. If the toast was only used for the share copy confirmation, remove those state declarations and the cleanup `useEffect`.

- [ ] **Step 7: Verify**

```bash
npm run dev
```

Navigate to an imprint detail page. Click `⤴` — ShareSheet appears. Click "生成分享卡片" — card downloads/shares with imprint photo, text excerpt, and location.

- [ ] **Step 8: Commit**

```bash
git add "app/imprint/[id]/page.tsx"
git commit -m "feat: replace imprint share handler with ShareSheet + ImprintCard"
```

---

## Task 11: Add OG meta tags for insights page

**Files:**
- Create: `app/insights/layout.tsx`

A server component layout that provides static OG meta for the `/insights` route. When the URL is shared in WeChat, WeChat fetches these tags and shows a rich link card.

- [ ] **Step 1: Create the layout file**

```typescript
// app/insights/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nomadic 城市洞察 | 此时此地',
  description: '四维城市洞察：城市灵魂、生存基准、商业机会、本地圈子。探索你的下一座城市。',
  openGraph: {
    title: 'Nomadic 城市洞察 | 此时此地',
    description: '四维城市洞察：城市灵魂、生存基准、商业机会、本地圈子。探索你的下一座城市。',
    url: 'https://nomadictree.io/insights',
    siteName: 'Nomadic',
    images: [
      {
        url: 'https://nomadictree.io/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Nomadic 城市洞察',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
}

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 2: Create a placeholder OG image**

The OG image at `/public/og-default.png` should be 1200×630px. For now, use any placeholder. The simplest approach is to create a minimal HTML file and screenshot it, or use an online tool to generate a 1200×630 PNG with the Nomadic tree logo and tagline text, saved as `public/og-default.png`.

If you want to skip creating the image for now, add a note in the layout that the image URL will 404 until the asset is created — WeChat will still show the title and description, just without the cover image.

- [ ] **Step 3: Verify OG tags render**

```bash
npm run build && npm run start
```

Then use a browser extension or `curl` to check the meta tags:
```bash
curl -s http://localhost:3000/insights | grep "og:"
```

Expected output includes `og:title`, `og:description`, `og:image`.

- [ ] **Step 4: Commit**

```bash
git add app/insights/layout.tsx public/og-default.png
git commit -m "feat: add OG meta tags to insights page for WeChat link preview"
```

---

## Task 12: Create a reusable `useUserProfile` hook (DRY)

The same profile-fetching logic is repeated in three pages (Tasks 8, 9, 10). Extract it into a hook to avoid the repetition.

**Files:**
- Create: `hooks/useUserProfile.ts`
- Modify: `app/page.tsx`, `app/insights/page.tsx`, `app/imprint/[id]/page.tsx`

- [ ] **Step 1: Create the hook**

```typescript
// hooks/useUserProfile.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

interface UserProfile {
  nickname: string
  avatarUrl: string | null
}

export function useUserProfile(): UserProfile {
  const { user } = useAuth()
  const [nickname, setNickname] = useState<string>('探索者')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setNickname('探索者'); setAvatarUrl(null); return }
    supabase.from('profiles').select('nickname, avatar_url').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setNickname(data.nickname ?? (user.user_metadata?.nickname as string | undefined) ?? '探索者')
          setAvatarUrl(data.avatar_url ?? null)
        }
      })
  }, [user?.id])

  return { nickname, avatarUrl }
}
```

- [ ] **Step 2: Replace repeated profile logic in all three pages**

In `app/page.tsx`, `app/insights/page.tsx`, and `app/imprint/[id]/page.tsx`:
- Remove the `profileNickname`, `profileAvatar` state declarations and the `useEffect` that fetches them
- Remove the `supabase` import if it was added only for profile fetching (check if it's used elsewhere first)
- Add `import { useUserProfile } from '@/hooks/useUserProfile'`
- Replace with `const { nickname: profileNickname, avatarUrl: profileAvatar } = useUserProfile()`

- [ ] **Step 3: Verify all three pages still work**

```bash
npm run dev
```

Test share button on homepage, insights, and imprint pages. All three should show the correct nickname and avatar in the generated card.

- [ ] **Step 4: Commit**

```bash
git add hooks/useUserProfile.ts app/page.tsx app/insights/page.tsx "app/imprint/[id]/page.tsx"
git commit -m "refactor: extract useUserProfile hook to remove duplicated profile fetch logic"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Three card types (BrandCard, CityCard, ImprintCard) — Tasks 4, 5, 6
- ✅ Shared CardShell with top zone (logo + 此时此地 + avatar/nickname) and bottom zone (taglines + URL + QR) — Task 3
- ✅ ShareSheet bottom drawer with copy link + generate card — Task 7
- ✅ Copy link on insights page only — Task 9 (`showCopyLink={true}`)
- ✅ html2canvas → PNG → navigator.share / download fallback — Tasks 1, 2
- ✅ Homepage wired — Task 8
- ✅ Insights page wired (existing modal replaced) — Task 9
- ✅ Imprint page wired — Task 10
- ✅ OG meta for insights page WeChat link preview — Task 11
- ✅ DRY: profile fetch extracted to hook — Task 12
- ✅ Edge cases: no photo (ImprintCard shows placeholder), no login (shows "探索者"), no flag (omitted), short description (no truncation marker)

**Type consistency check:**
- `CardShell` props: `nickname: string, avatarUrl: string | null, children: ReactNode` — used consistently in BrandCard, CityCard, ImprintCard ✅
- `ShareSheet` props: `isOpen, onClose, cardRef: RefObject<HTMLDivElement | null>, showCopyLink?, copyUrl?` — used consistently in all three pages ✅
- `ImprintCard` uses `narrative` (matches `Imprint.narrative` from AppContext) — not `content` ✅
- `generateCardImage` returns `File`; `shareOrDownloadCard` accepts `HTMLElement` ✅
