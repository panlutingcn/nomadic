# WeChat Share Cards — Design Spec
Date: 2026-05-04

## Overview

Add a share flow to three pages (homepage, insights, imprint detail) that lets users generate and save/share a branded PNG card via WeChat or any other app. The insights page additionally supports a "copy link" option that renders as a rich preview card when pasted into WeChat chat (via Open Graph meta tags — no WeChat JSSDK or official account required).

## Scope

Three trigger points → one `ShareSheet` bottom drawer → two actions per sheet → three distinct card types, all sharing the same visual shell.

| Page | Share trigger | Card type |
|------|--------------|-----------|
| `/` (homepage) | New share icon (top right or bottom area) | **Brand card** — 4-quadrant highlights |
| `/insights` | Existing top-right share button (extend) | **City card** — city name + country + flag + AI description |
| `/imprint/[id]` | Existing top-right `⤴` button (replace) | **Imprint card** — photo + text excerpt + city/country/flag |

## Card Visual Structure

All three cards share the same outer shell. Only the middle "content zone" differs.

```
┌─────────────────────────────────┐
│  TOP ZONE                       │
│  🌳 Nomadic  此时此地            │
│  [avatar]  nickname             │
├─────────────────────────────────┤
│  CONTENT ZONE (varies per card) │
├─────────────────────────────────┤
│  BOTTOM ZONE                    │
│  在世界各地扎根，而不只是路过。   │
│  一个给数字游民的灵感与商机社区。 │
│  nomadictree.io     [QR code]   │
└─────────────────────────────────┘
```

### Visual Style

- **Background**: warm off-white gradient (`#f5f0e8` → `#ede4d4`), subtle paper texture feel
- **Accent**: `#1D9E75` (green) for borders, icons, highlights
- **Typography**: PingFang SC / system Chinese fonts; bold for headings, regular for body
- **Card size**: 375 × 667px (portrait, mobile-first), 2× pixel density
- **Corners**: 16px border radius
- **Shadow**: soft drop shadow on card container for screenshot aesthetics
- No "游民" in copy — use 数字游民 only in the tagline where established

### Top Zone (all cards)

Left side: 🌳 logo glyph + "Nomadic" wordmark (16px bold) + "此时此地" (12px, muted)
Right side: user avatar (32px circle) + nickname (14px)
If user is not logged in: show placeholder avatar + "探索者"

### Content Zone — Brand Card (homepage)

Four rows, each with an emoji icon + bold label + short description:

1. 🌿 **城市灵魂** — 文化氛围、生活节奏、社区性格
2. 🏠 **生存基准** — 住房、消费、签证、基础设施
3. 💡 **商业机会** — 创业环境、行业生态、远程工作资源
4. 🤝 **本地圈子** — 社群、活动、找到同频的探索者

### Content Zone — City Card (insights page)

- City name (28px bold) + country name (16px) + country flag emoji — on one line
- Horizontal divider
- AI-generated city description, first 100 characters, truncated with "…"

Content sourced from `searchContext` / `CITIES[selectedCity]`:
- City name: `city.nameZh || city.name`
- Country: `city.countryZh || city.country`
- Flag: `city.flag`
- Description: `city.soul.body` (first 100 chars)

### Content Zone — Imprint Card (imprint detail page)

- Photo: first uploaded image at 100% width, max-height 160px, object-fit cover. If no photo: city-toned color block with city name centered.
- Text excerpt: `imprint.content` first 80 characters + "…"
- Location line: city name (zh) + country name + flag emoji. Lookup strategy: check `CITIES[imprint.city]` first (gives `countryZh` + `flag`); fall back to a small inline map for cities not in `CITIES`; if neither matches, show city name only with no flag.

### Bottom Zone (all cards)

Line 1: "在世界各地扎根，而不只是路过。" (14px, muted)
Line 2: "一个给数字游民的灵感与商机社区。" (13px, muted)
Separator line
Row: "nomadictree.io" text (left, 13px accent color) + QR code of `https://nomadictree.io` (right, 64×64px)

## ShareSheet Component

A bottom drawer (fixed, slides up from bottom, backdrop overlay) with two buttons:

**For insights page:**
- "🔗 复制链接" — copies current URL to clipboard, shows toast "链接已复制"
- "🖼️ 生成分享卡片" — triggers card generation flow

**For homepage and imprint pages:**
- "🖼️ 生成分享卡片" — triggers card generation flow
- (No copy-link option on these pages; homepage URL is trivial, imprint already had copy-link)

Card generation flow:
1. Render the appropriate card component into a hidden off-screen `div` (position absolute, left: -9999px)
2. Call `html2canvas(ref.current, { scale: 2, useCORS: true })` → returns `HTMLCanvasElement`
3. Convert to blob via `canvas.toBlob('image/png')`
4. Try `navigator.share({ files: [new File([blob], 'nomadic-card.png', { type: 'image/png' })] })` — works in WeChat browser and modern mobile Safari/Chrome
5. If `navigator.canShare({ files })` returns false or throws: trigger `<a download>` link instead

Show a loading spinner on the button during generation (typically 0.5–1.5s).

## Dynamic OG Meta — Insights Page

Add `generateMetadata` to `/app/insights/page.tsx` (requires converting from pure `'use client'` — use a wrapper layout or route segment config).

Strategy: make the insights route a server component wrapper that passes search params to a client child. The server wrapper exports `generateMetadata`.

```
og:title     → "{城市中文名} — Nomadic 城市洞察"
og:description → city.soul.body (first 120 chars)
og:image     → /og/insights?city={citySlug} (static brand image fallback if no city)
og:url       → https://nomadictree.io/insights?city={citySlug}
```

For the fallback OG image: a static `/public/og-default.png` (1200×630) with the Nomadic tree logo and tagline. No server-side image generation needed.

When a user pastes the insights URL into WeChat chat, WeChat fetches OG tags and renders a rich link card with title + description + image.

## New Files

```
/components/ShareSheet.tsx          # bottom drawer, 2 buttons
/components/cards/SharedCardShell.tsx   # top + bottom zones, accepts children
/components/cards/BrandCard.tsx     # homepage card (4 quadrant rows)
/components/cards/CityCard.tsx      # insights card (city + AI description)
/components/cards/ImprintCard.tsx   # imprint card (photo + excerpt + location)
/lib/generateCardImage.ts           # html2canvas wrapper → File
/public/og-default.png              # static OG fallback image (1200×630)
```

## Modified Files

```
/app/page.tsx                        # add share button + ShareSheet + BrandCard
/app/insights/page.tsx               # extend share button → ShareSheet + CityCard + OG meta
/app/insights/layout.tsx             # NEW: server layout for generateMetadata
/app/imprint/[id]/page.tsx           # replace handleShare → ShareSheet + ImprintCard
```

## Dependencies

- `html2canvas` — add to package.json (`^1.4.1`)
- `qrcode.react` — already installed

## Edge Cases

- **No photo on imprint**: show city-colored placeholder block, no broken image
- **Very short AI description**: show full text without truncation marker
- **User not logged in**: top zone shows placeholder avatar + "探索者"
- **navigator.share not available** (desktop, non-HTTPS): always fall back to download link
- **Long city/nickname**: truncate with ellipsis, single line
- **Imprint city not in CITIES dict**: fall back to `imprint.city` raw string, omit country and flag
