# Login & Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Supabase Auth into Nomadic so users can log in via email Magic Link or WeChat OAuth, with their data persisted in Supabase and loaded on login.

**Architecture:** `AuthContext` wraps `AppContext` in the layout; it listens to Supabase auth state and exposes login/logout methods. `AppContext` reads the current user from `AuthContext` and switches between sample data (guest) and live Supabase data (logged in). `LoginModal` is a standalone component (email Magic Link tab + WeChat button) used everywhere login is needed. `BottomBubbles` replaces `ContactBubble` on the home page.

WeChat login uses a server-side redirect OAuth flow: browser → `/api/auth/wechat` → WeChat OAuth → `/api/auth/wechat/callback` → Supabase generates magic link → session established.

**Tech Stack:** `@supabase/supabase-js`, Supabase Auth (email Magic Link + custom WeChat OAuth), Supabase PostgreSQL with RLS, WeChat Open Platform (网页应用)

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `lib/supabase.ts` | Singleton Supabase browser client |
| Create | `lib/supabaseAdmin.ts` | Admin client (service role, server-only) |
| Create | `context/AuthContext.tsx` | Auth session state, login/logout methods |
| Create | `components/LoginModal.tsx` | 2-tab login: email Magic Link + WeChat OAuth |
| Create | `components/BottomBubbles.tsx` | Dual bubble: contact left, login/user right |
| Create | `app/api/auth/wechat/route.ts` | Redirect to WeChat OAuth URL |
| Create | `app/api/auth/wechat/callback/route.ts` | Exchange code → openid → Supabase session → redirect |
| Modify | `app/layout.tsx` | Add `AuthProvider` wrapping `AppProvider` |
| Modify | `app/page.tsx` | Replace `ContactBubble` with `BottomBubbles` |
| Modify | `context/AppContext.tsx` | Fetch from Supabase when logged in, sample data when guest |
| Modify | `app/vault/page.tsx` | Show login banner for guests; show real profile for users |
| Modify | `app/story/page.tsx` | Replace inline login state with `AuthContext` + `LoginModal` |

---

## Task 0: Supabase Console Setup + WeChat Open Platform (Manual, Before Coding)

This is a manual task that must be completed before the code can connect to any backend.

**0a. Create Supabase project**
1. Go to supabase.com → New Project
2. Note the **Project URL**, **anon/public key**, and **service_role key** from Settings → API

**0b. Run this SQL in the Supabase SQL Editor:**

```sql
create extension if not exists "pgcrypto";

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  avatar_url text,
  wechat_openid text unique,
  created_at timestamptz default now()
);

create table imprints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city text not null,
  title text not null,
  narrative text,
  tags text[] default '{}',
  is_public boolean default false,
  likes integer default 0,
  photo_url text,
  deleted_at timestamptz,
  created_at timestamptz default now()
);

create table saved_cities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city_name text not null,
  country text not null,
  saved_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "users can read own profile"
  on profiles for select using (auth.uid() = id);
create policy "users can insert own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "users can update own profile"
  on profiles for update using (auth.uid() = id);

alter table imprints enable row level security;
create policy "users can manage own imprints"
  on imprints for all using (auth.uid() = user_id);
create policy "public imprints are readable by all"
  on imprints for select using (is_public = true and deleted_at is null);

alter table saved_cities enable row level security;
create policy "users can manage own saved cities"
  on saved_cities for all using (auth.uid() = user_id);
```

**0c. Configure Supabase Auth:**
- Authentication → Providers → Email: enable, turn OFF "Confirm email" (magic link handles this)
- Authentication → URL Configuration → Site URL: `https://nomadictree.io`
- Redirect URLs: add `https://nomadictree.io/**` and `http://localhost:3000/**`

**0d. Configure WeChat Open Platform (微信开放平台):**
1. Register at open.weixin.qq.com (requires company/personal real-name verification)
2. Create a **网站应用** (Website Application)
3. Note the **AppID** and **AppSecret**
4. Add authorized domain: `nomadictree.io` (and `localhost` for dev via ngrok)
5. Set callback domain whitelist to include your domain

> **Note:** WeChat Open Platform 网站应用 requires ICP filing (备案) for Chinese domains. If using localhost for dev, use ngrok to get a public HTTPS URL and add it to WeChat's whitelist.

---

## Task 1: Install Supabase SDK + Environment Variables

**Files:**
- Modify: `package.json` (via npm install)
- Create: `lib/supabase.ts`
- Create: `lib/supabaseAdmin.ts`
- Modify: `.env.local`
- Modify: `.env.example`

- [ ] **Step 1: Install @supabase/supabase-js**

```bash
npm install @supabase/supabase-js
```

Expected output: `added X packages`

- [ ] **Step 2: Add all env vars to .env.local**

Open `.env.local` and append:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
WECHAT_APP_ID=wx_your_appid
WECHAT_APP_SECRET=your_appsecret
NEXT_PUBLIC_BASE_URL=https://nomadictree.io
```

Replace values with your actual keys. For local dev, set `NEXT_PUBLIC_BASE_URL=http://localhost:3000` (override in `.env.local`).

- [ ] **Step 3: Update .env.example**

Open `.env.example` and append:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# WeChat Open Platform (网站应用)
WECHAT_APP_ID=wx_your_appid
WECHAT_APP_SECRET=your_appsecret
```

- [ ] **Step 4: Create lib/supabase.ts**

```typescript
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)
```

- [ ] **Step 5: Create lib/supabaseAdmin.ts**

```typescript
import { createClient } from '@supabase/supabase-js'

// Server-only: never import this in client components
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add lib/supabase.ts lib/supabaseAdmin.ts .env.example package.json package-lock.json
git commit -m "feat: install supabase sdk and create browser + admin clients"
```

---

## Task 2: Create WeChat OAuth API Routes

**Files:**
- Create: `app/api/auth/wechat/route.ts`
- Create: `app/api/auth/wechat/callback/route.ts`

### Flow
```
LoginModal "微信登录" button
  → GET /api/auth/wechat?redirect=/story
  → 302 to WeChat OAuth (open.weixin.qq.com)
  → WeChat 302 to /api/auth/wechat/callback?code=xxx&state=xxx
  → Server: exchange code → openid + userinfo
  → Server: find/create Supabase user by wechat_openid
  → Server: admin.generateLink(magiclink, email) → get action_link
  → 302 user to action_link
  → Supabase verifies → 302 to app with session tokens in URL hash
  → AuthContext.onAuthStateChange fires → user is logged in
```

- [ ] **Step 1: Create app/api/auth/wechat/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const redirect = searchParams.get('redirect') ?? '/'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  const appId = process.env.WECHAT_APP_ID!

  const callbackUrl = encodeURIComponent(`${baseUrl}/api/auth/wechat/callback`)
  const state = encodeURIComponent(redirect)

  const wechatUrl =
    `https://open.weixin.qq.com/connect/qrconnect` +
    `?appid=${appId}` +
    `&redirect_uri=${callbackUrl}` +
    `&response_type=code` +
    `&scope=snsapi_login` +
    `&state=${state}` +
    `#wechat_redirect`

  return NextResponse.redirect(wechatUrl)
}
```

- [ ] **Step 2: Create app/api/auth/wechat/callback/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') ?? '/'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  const appId = process.env.WECHAT_APP_ID!
  const appSecret = process.env.WECHAT_APP_SECRET!

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=wechat_cancelled`)
  }

  // 1. Exchange code for access_token + openid
  const tokenRes = await fetch(
    `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`
  )
  const tokenData = await tokenRes.json()

  if (tokenData.errcode) {
    console.error('[wechat callback] token error:', tokenData)
    return NextResponse.redirect(`${baseUrl}/?auth_error=wechat_token`)
  }

  const { access_token, openid } = tokenData as { access_token: string; openid: string }

  // 2. Fetch WeChat user info (nickname + avatar)
  const infoRes = await fetch(
    `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
  )
  const userInfo = await infoRes.json() as { nickname: string; headimgurl: string }

  // 3. Find existing Supabase user by wechat_openid in profiles
  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('id, nickname')
    .eq('wechat_openid', openid)
    .single()

  let userId: string
  let userEmail: string
  let isNewUser = false

  if (existingProfile) {
    userId = existingProfile.id
    userEmail = `${openid}@wx.nomadic.placeholder`
  } else {
    // 4a. Create new Supabase auth user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: `${openid}@wx.nomadic.placeholder`,
      email_confirm: true,
      user_metadata: {
        wechat_openid: openid,
        nickname: userInfo.nickname,
        avatar_url: userInfo.headimgurl,
      },
    })
    if (createError || !newUser.user) {
      console.error('[wechat callback] createUser error:', createError)
      return NextResponse.redirect(`${baseUrl}/?auth_error=create_user`)
    }
    userId = newUser.user.id
    userEmail = `${openid}@wx.nomadic.placeholder`
    isNewUser = true

    // 4b. Insert profile row
    await supabaseAdmin.from('profiles').insert({
      id: userId,
      nickname: userInfo.nickname || 'Nomadic 用户',
      avatar_url: userInfo.headimgurl || null,
      wechat_openid: openid,
    })
  }

  // 5. Generate a one-time magic link to sign in this user
  const redirectTo = `${baseUrl}${decodeURIComponent(state)}`
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: userEmail,
    options: { redirectTo },
  })

  if (linkError || !linkData.properties.action_link) {
    console.error('[wechat callback] generateLink error:', linkError)
    return NextResponse.redirect(`${baseUrl}/?auth_error=link`)
  }

  return NextResponse.redirect(linkData.properties.action_link)
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/api/auth/wechat/route.ts app/api/auth/wechat/callback/route.ts
git commit -m "feat: add WeChat OAuth API routes (initiate + callback)"
```

---

## Task 3: Create context/AuthContext.tsx

**Files:**
- Create: `context/AuthContext.tsx`

- [ ] **Step 1: Create context/AuthContext.tsx**

```typescript
'use client'
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  sendEmailOTP: (email: string) => Promise<{ error: string | null }>
  loginWithWeChat: (redirectPath?: string) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const sendEmailOTP = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    })
    return { error: error?.message ?? null }
  }, [])

  const loginWithWeChat = useCallback((redirectPath = '/') => {
    window.location.href = `/api/auth/wechat?redirect=${encodeURIComponent(redirectPath)}`
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, sendEmailOTP, loginWithWeChat, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add context/AuthContext.tsx
git commit -m "feat: add AuthContext with email Magic Link and WeChat OAuth support"
```

---

## Task 4: Update app/layout.tsx

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Wrap AppProvider with AuthProvider**

Replace the full file content of `app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'Nomadic 此时此地',
  description: '在世界各地扎根，而不只是路过。',
  icons: { icon: '/icon.svg' },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <AuthProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: wrap app with AuthProvider"
```

---

## Task 5: Create components/LoginModal.tsx

**Files:**
- Create: `components/LoginModal.tsx`

Two tabs:
- **邮箱登录**: enter email → send magic link → show "check your inbox" message
- **微信登录**: single button → redirects to WeChat OAuth (no OTP step, browser navigates away)

No Step 3 (nickname) in this modal — WeChat flow sets nickname automatically from WeChat profile during callback. Email new-users will have `Nomadic 用户` as default and can change later.

- [ ] **Step 1: Create components/LoginModal.tsx**

```typescript
'use client'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

interface LoginModalProps {
  onClose: () => void
  onSuccess?: () => void
  redirectPath?: string
}

type Tab = 'email' | 'wechat'

export default function LoginModal({ onClose, onSuccess, redirectPath = '/' }: LoginModalProps) {
  const { sendEmailOTP, loginWithWeChat } = useAuth()
  const [show, setShow] = useState(true)
  const [tab, setTab] = useState<Tab>('wechat')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current) }
  }, [])

  const handleClose = () => {
    setShow(false)
    closeTimerRef.current = setTimeout(onClose, 200)
  }

  const handleSendEmail = async () => {
    const trimmed = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('请输入有效的邮箱地址')
      return
    }
    setError(null)
    setLoading(true)
    const { error: err } = await sendEmailOTP(trimmed)
    setLoading(false)
    if (err) { setError(err); return }
    setSent(true)
  }

  const handleWechatLogin = () => {
    loginWithWeChat(redirectPath)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    border: '0.5px solid #c8bfaa',
    background: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    color: '#3d3020',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
    marginBottom: 10,
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: show ? 1 : 0,
        transition: 'opacity 200ms ease',
        padding: '0 20px',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          position: 'relative',
          background: '#f0ebe0',
          borderRadius: 20,
          padding: '24px 20px 20px',
          maxWidth: 420,
          width: '100%',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          transform: show ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 200ms ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Speech bubble tail pointing down */}
        <div style={{
          position: 'absolute',
          bottom: -9,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '9px solid transparent',
          borderRight: '9px solid transparent',
          borderTop: '9px solid #f0ebe0',
        }} />

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'none', border: 'none',
            fontSize: 20, color: '#9a8a6a',
            cursor: 'pointer', padding: 4, lineHeight: 1,
          }}
        >×</button>

        <div style={{ fontSize: 15, fontWeight: 600, color: '#3d3020', textAlign: 'center', marginBottom: 18 }}>
          登录 Nomadic
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {(['wechat', 'email'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); setSent(false) }}
              style={{
                flex: 1,
                padding: '7px',
                borderRadius: 8,
                border: 'none',
                background: tab === t ? 'rgba(255,255,255,0.7)' : 'transparent',
                fontSize: 12,
                color: tab === t ? '#3d3020' : '#9a8a6a',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: tab === t ? 600 : 400,
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 150ms ease',
              }}
            >
              {t === 'wechat' ? '微信登录' : '邮箱登录'}
            </button>
          ))}
        </div>

        {/* WeChat tab */}
        {tab === 'wechat' && (
          <>
            <div style={{ fontSize: 12, color: '#7a6a50', textAlign: 'center', marginBottom: 16, lineHeight: 1.6 }}>
              使用微信扫码或在微信内一键登录<br />
              <span style={{ fontSize: 11, color: '#b8a98a' }}>登录后自动导入微信昵称与头像</span>
            </div>
            <button
              onClick={handleWechatLogin}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 12,
                background: '#07C160',
                border: 'none',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                <path d="M7.5 3C4.46 3 2 5.24 2 8c0 1.57.77 2.97 1.97 3.9L3.5 13.5l1.8-.9c.68.19 1.43.4 2.2.4.18 0 .36 0 .54-.02A4.5 4.5 0 0 1 8 12c0-2.49 2.24-4.5 5-4.5.19 0 .37.01.55.03C12.9 5.29 10.42 3 7.5 3zm-1.5 3.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm3 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zM13 9c-2.21 0-4 1.57-4 3.5S10.79 16 13 16c.6 0 1.18-.13 1.7-.35l1.3.85-.35-1.3A3.33 3.33 0 0 0 17 12.5C17 10.57 15.21 9 13 9zm-1 2.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm2 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/>
              </svg>
              微信登录
            </button>
            <div style={{ fontSize: 10, color: '#c8bfaa', textAlign: 'center', marginTop: 10 }}>
              将跳转至微信授权页面
            </div>
          </>
        )}

        {/* Email tab */}
        {tab === 'email' && (
          <>
            {sent ? (
              <>
                <div style={{ textAlign: 'center', padding: '8px 0 16px', fontSize: 13, color: '#5a4a30', lineHeight: 1.6 }}>
                  验证邮件已发送至<br />
                  <span style={{ fontWeight: 600, color: '#3d3020' }}>{email}</span><br />
                  请点击邮件中的链接完成登录
                </div>
                <div style={{ fontSize: 11, color: '#9a8a6a', textAlign: 'center', marginBottom: 16 }}>
                  登录成功后页面会自动刷新
                </div>
                <button
                  onClick={handleClose}
                  style={{ width: '100%', padding: '9px', borderRadius: 10, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  好的，去查邮箱
                </button>
              </>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendEmail() }}
                  placeholder="输入你的邮箱"
                  style={inputStyle}
                />
                {error && <div style={{ fontSize: 11, color: '#c04040', marginBottom: 8 }}>{error}</div>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleClose}
                    style={{ flex: 1, padding: '9px', borderRadius: 10, background: 'transparent', border: '0.5px solid #c8bfaa', fontSize: 12, color: '#7a6a50', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={loading}
                    style={{ flex: 1, padding: '9px', borderRadius: 10, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? '发送中…' : '发送验证邮件'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/LoginModal.tsx
git commit -m "feat: add LoginModal with WeChat OAuth and email Magic Link tabs"
```

---

## Task 6: Create components/BottomBubbles.tsx

**Files:**
- Create: `components/BottomBubbles.tsx`

- [ ] **Step 1: Create components/BottomBubbles.tsx**

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ContactModal from './ContactModal'
import LoginModal from './LoginModal'

export default function BottomBubbles() {
  const router = useRouter()
  const { user } = useAuth()
  const [showContact, setShowContact] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [hoveredLeft, setHoveredLeft] = useState(false)
  const [hoveredRight, setHoveredRight] = useState(false)

  const bubbleBase: React.CSSProperties = {
    flex: 1,
    position: 'relative',
    background: '#ede8df',
    borderRadius: 14,
    padding: '10px 14px',
    cursor: 'pointer',
    transition: 'transform 150ms ease, box-shadow 150ms ease',
    border: '1px solid #ddd5c5',
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 10, padding: '32px 16px 40px' }}>
        {/* Left bubble: contact */}
        <div
          onClick={() => setShowContact(true)}
          onMouseEnter={() => setHoveredLeft(true)}
          onMouseLeave={() => setHoveredLeft(false)}
          style={{
            ...bubbleBase,
            transform: hoveredLeft ? 'scale(1.03)' : 'scale(1)',
            boxShadow: hoveredLeft ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          <div style={{
            position: 'absolute', left: -7, top: 14,
            width: 0, height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderRight: '7px solid #ede8df',
          }} />
          <div style={{ fontSize: 11, fontWeight: 600, color: '#7a6a50', marginBottom: 3 }}>联系共创</div>
          <div style={{ fontSize: 10, color: '#b8a98a', lineHeight: 1.5 }}>期待听到你的声音</div>
        </div>

        {/* Right bubble: login / user */}
        <div
          onClick={() => user ? router.push('/vault') : setShowLogin(true)}
          onMouseEnter={() => setHoveredRight(true)}
          onMouseLeave={() => setHoveredRight(false)}
          style={{
            ...bubbleBase,
            transform: hoveredRight ? 'scale(1.03)' : 'scale(1)',
            boxShadow: hoveredRight ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          <div style={{
            position: 'absolute', right: -7, top: 14,
            width: 0, height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '7px solid #ede8df',
          }} />
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>
                  {(user.user_metadata?.nickname ?? user.email ?? '?')[0].toUpperCase()}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#7a6a50' }}>我的领地</div>
              </div>
              <div style={{ fontSize: 10, color: '#b8a98a', lineHeight: 1.5, marginTop: 3 }}>查看你的全球版图</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#7a6a50', marginBottom: 3 }}>登录账号</div>
              <div style={{ fontSize: 10, color: '#b8a98a', lineHeight: 1.5 }}>解锁你的全球版图</div>
            </>
          )}
        </div>
      </div>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} redirectPath="/" />}
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/BottomBubbles.tsx
git commit -m "feat: add BottomBubbles with contact and login/user bubbles"
```

---

## Task 7: Update app/page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace ContactBubble with BottomBubbles**

Change the import line:
```typescript
// Remove:
import ContactBubble from '@/components/ContactBubble'
// Add:
import BottomBubbles from '@/components/BottomBubbles'
```

Change the JSX:
```typescript
// Remove:
<ContactBubble />
// Add:
<BottomBubbles />
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: replace ContactBubble with BottomBubbles on home page"
```

---

## Task 8: Update context/AppContext.tsx

**Files:**
- Modify: `context/AppContext.tsx`

- [ ] **Step 1: Replace full AppContext.tsx with Supabase-aware version**

```typescript
'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { SAMPLE_IMPRINTS } from '@/data/sampleImprints'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export interface SavedCity {
  name: string
  country: string
  savedAt: string
}

export interface Imprint {
  id: string
  city: string
  author?: string
  title: string
  narrative: string
  tags: string[]
  isPublic: boolean
  likes?: number
  createdAt: string
  photo?: string
  deletedAt?: string
}

export interface SearchContext {
  cityName: string
  cityNameZh: string
  country: string
  countryZh: string
  flag: string
  confidence: number
  userIntent: string
  relevantSections: string[]
  aiInsight: string
  soulHeadline: string
  soulBody: string
  soulPersonality: string
  soulEconomy: string
  soulFestivals: string
  soulFigures: string
  wifiSpeed: string
  costLevel: string
  visaInfo: string
  baseVisaDays: string
  baseVisaDesc: string
  baseSafety: string
  baseDailyCost: string
  baseVisaDetail: string
  baseSociety: string
  chanceParagraph: string
  chancePolicy: { label: string; url: string; desc: string }
  localParagraph: string
}

interface AppState {
  selectedCity: string
  setSelectedCity: (city: string) => void
  savedCities: SavedCity[]
  toggleSaveCity: (name: string, country: string) => void
  isCitySaved: (name: string) => boolean
  imprints: Imprint[]
  addImprint: (imprint: Omit<Imprint, 'id' | 'createdAt'>) => void
  updateImprint: (id: string, updates: Partial<Omit<Imprint, 'id' | 'createdAt'>>) => void
  deleteImprint: (id: string) => void
  restoreImprint: (id: string) => void
  permanentlyDeleteImprint: (id: string) => void
  trashedImprints: Imprint[]
  allPublicImprints: Imprint[]
  searchContext: SearchContext | null
  setSearchContext: (context: SearchContext | null) => void
}

const SAMPLE_SAVED_CITIES: SavedCity[] = [
  { name: 'Berlin', country: 'Germany', savedAt: '2025.01.14' },
  { name: 'Amsterdam', country: 'Netherlands', savedAt: '2025.01.08' },
  { name: 'Lisbon', country: 'Portugal', savedAt: '2024.12.30' },
]

const SAMPLE_USER_IMPRINTS: Imprint[] = [
  { id: 'my-1', city: 'Berlin', title: 'Markthalle IX 的一个下午', narrative: '柏林人对空间再利用的想象力让我重新思考创意的边界。', tags: ['柏林', '创意'], isPublic: true, likes: 12, createdAt: '2026.03.18', photo: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=600&q=80' },
  { id: 'my-2', city: 'Amsterdam', title: '约旦区的周六早市', narrative: '阿姆斯特丹人把生活过得像一门手艺，每一个摊位背后都是一个认真经营的小世界。', tags: ['阿姆斯特丹', '生活方式'], isPublic: false, createdAt: '2026.02.05', photo: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=600&q=80' },
  { id: 'my-3', city: 'Lisbon', title: '里斯本的第一杯 Ginjinha', narrative: '在阿尔法玛区迷路的那个傍晚，我突然明白为什么这么多人选择留下来。', tags: ['里斯本', '慢生活'], isPublic: true, likes: 8, createdAt: '2026.01.30', photo: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=600&q=80' },
  { id: 'my-4', city: 'Prague', title: '布拉格的咖啡馆工作日', narrative: '一杯咖啡，三小时，窗外是中世纪的屋顶。效率反而比在办公室高了三倍。', tags: ['布拉格', '远程工作'], isPublic: false, createdAt: '2025.12.10', photo: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=600&q=80' },
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('zh-CN').replace(/\//g, '.')
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [selectedCity, setSelectedCity] = useState('')
  const [searchContext, setSearchContext] = useState<SearchContext | null>(null)
  const [savedCities, setSavedCities] = useState<SavedCity[]>(SAMPLE_SAVED_CITIES)
  const [imprints, setImprints] = useState<Imprint[]>(SAMPLE_USER_IMPRINTS)

  useEffect(() => {
    if (!user) {
      setImprints(SAMPLE_USER_IMPRINTS)
      setSavedCities(SAMPLE_SAVED_CITIES)
      return
    }

    Promise.all([
      supabase.from('imprints').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('saved_cities').select('*').eq('user_id', user.id).order('saved_at', { ascending: false }),
    ]).then(([{ data: impData }, { data: cityData }]) => {
      if (impData) {
        setImprints(impData.map(r => ({
          id: r.id,
          city: r.city,
          title: r.title,
          narrative: r.narrative ?? '',
          tags: r.tags ?? [],
          isPublic: r.is_public,
          likes: r.likes,
          createdAt: formatDate(r.created_at),
          photo: r.photo_url ?? undefined,
          deletedAt: r.deleted_at ?? undefined,
        })))
      }
      if (cityData) {
        setSavedCities(cityData.map(r => ({
          name: r.city_name,
          country: r.country,
          savedAt: formatDate(r.saved_at),
        })))
      }
    })
  }, [user?.id])

  const toggleSaveCity = (name: string, country: string) => {
    setSavedCities(prev => {
      const exists = prev.find(c => c.name === name)
      if (exists) {
        if (user) supabase.from('saved_cities').delete().eq('user_id', user.id).eq('city_name', name).then(() => {})
        return prev.filter(c => c.name !== name)
      }
      const savedAt = new Date().toLocaleDateString('zh-CN').replace(/\//g, '.')
      if (user) supabase.from('saved_cities').insert({ user_id: user.id, city_name: name, country }).then(() => {})
      return [{ name, country, savedAt }, ...prev]
    })
  }

  const isCitySaved = (name: string) => savedCities.some(c => c.name === name)

  const addImprint = (imprint: Omit<Imprint, 'id' | 'createdAt'>) => {
    const newImprint: Imprint = {
      ...imprint,
      id: `imprint-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('zh-CN').replace(/\//g, '.'),
    }
    setImprints(prev => [newImprint, ...prev])
    if (user) {
      supabase.from('imprints').insert({
        user_id: user.id,
        city: imprint.city,
        title: imprint.title,
        narrative: imprint.narrative,
        tags: imprint.tags,
        is_public: imprint.isPublic,
        photo_url: imprint.photo ?? null,
      }).then(() => {})
    }
  }

  const updateImprint = (id: string, updates: Partial<Omit<Imprint, 'id' | 'createdAt'>>) => {
    setImprints(prev => prev.map(imp => imp.id === id ? { ...imp, ...updates } : imp))
    if (user) {
      const patch: Record<string, unknown> = {}
      if (updates.city !== undefined) patch.city = updates.city
      if (updates.title !== undefined) patch.title = updates.title
      if (updates.narrative !== undefined) patch.narrative = updates.narrative
      if (updates.tags !== undefined) patch.tags = updates.tags
      if (updates.isPublic !== undefined) patch.is_public = updates.isPublic
      if (updates.photo !== undefined) patch.photo_url = updates.photo
      supabase.from('imprints').update(patch).eq('id', id).then(() => {})
    }
  }

  const deleteImprint = (id: string) => {
    const now = new Date().toISOString()
    setImprints(prev => prev.map(imp => imp.id === id ? { ...imp, deletedAt: now } : imp))
    if (user) supabase.from('imprints').update({ deleted_at: now }).eq('id', id).then(() => {})
  }

  const restoreImprint = (id: string) => {
    setImprints(prev => prev.map(imp => imp.id === id ? { ...imp, deletedAt: undefined } : imp))
    if (user) supabase.from('imprints').update({ deleted_at: null }).eq('id', id).then(() => {})
  }

  const permanentlyDeleteImprint = (id: string) => {
    setImprints(prev => prev.filter(imp => imp.id !== id))
    if (user) supabase.from('imprints').delete().eq('id', id).then(() => {})
  }

  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000
  const now = Date.now()
  const activeImprints = imprints.filter(i => !i.deletedAt)
  const trashedImprints = imprints.filter(i => i.deletedAt && now - new Date(i.deletedAt).getTime() < THREE_DAYS_MS)

  const samplePublic: Imprint[] = SAMPLE_IMPRINTS.map(s => ({ ...s, author: s.author, likes: s.likes }))
  const allPublicImprints = [
    ...activeImprints.filter(i => i.isPublic),
    ...samplePublic,
  ]

  return (
    <AppContext.Provider value={{
      selectedCity, setSelectedCity,
      savedCities, toggleSaveCity, isCitySaved,
      imprints: activeImprints, addImprint, updateImprint, deleteImprint, restoreImprint, permanentlyDeleteImprint,
      trashedImprints,
      allPublicImprints,
      searchContext, setSearchContext,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add context/AppContext.tsx
git commit -m "feat: AppContext fetches real data from Supabase when logged in"
```

---

## Task 9: Update app/vault/page.tsx

**Files:**
- Modify: `app/vault/page.tsx`

- [ ] **Step 1: Add auth-aware profile header and guest login banner**

Add these imports at the top of the file:
```typescript
import { useState, useEffect } from 'react'  // add useState, useEffect to existing import
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import LoginModal from '@/components/LoginModal'
```

Inside `VaultPage`, add after the existing hooks:
```typescript
const { user } = useAuth()
const [nickname, setNickname] = useState<string | null>(null)
const [showLogin, setShowLogin] = useState(false)

useEffect(() => {
  if (!user) return
  supabase.from('profiles').select('nickname').eq('id', user.id).single().then(({ data }) => {
    if (data) setNickname(data.nickname)
  })
}, [user?.id])
```

Replace the profile header `<div>` (the one starting with `display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)'` at the top of the page) with:

```typescript
{!user ? (
  <div
    onClick={() => setShowLogin(true)}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: 'var(--accent-dim)',
      border: '0.5px solid var(--accent-border)',
      borderRadius: 14,
      padding: '12px 14px',
      marginBottom: 14,
      cursor: 'pointer',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}
  >
    <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(29,158,117,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🔑</div>
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent-text)' }}>登录解锁你的全球领地</div>
      <div style={{ fontSize: 10, color: 'var(--accent)', marginTop: 3 }}>点击登录 · 保存你的城市与印迹 →</div>
    </div>
  </div>
) : (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 14, padding: '12px 14px', marginBottom: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
    <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 500, color: 'var(--accent)', flexShrink: 0 }}>
      {(nickname ?? user.user_metadata?.nickname ?? 'N')[0].toUpperCase()}
    </div>
    <div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
        {nickname ?? user.user_metadata?.nickname ?? 'Nomadic 用户'}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 3 }}>{savedCities.length} 个城市 · {imprints.length} 个印迹</div>
    </div>
  </div>
)}
```

Add the LoginModal just before `<BottomNav />`:
```typescript
{showLogin && <LoginModal onClose={() => setShowLogin(false)} redirectPath="/vault" />}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/vault/page.tsx
git commit -m "feat: vault page shows login banner for guests and real profile for users"
```

---

## Task 10: Update app/story/page.tsx

**Files:**
- Modify: `app/story/page.tsx`

- [ ] **Step 1: Replace inline login UI with AuthContext + LoginModal**

Add imports at top:
```typescript
import { useAuth } from '@/context/AuthContext'
import LoginModal from '@/components/LoginModal'
```

Inside `StoryPage`, add:
```typescript
const { user } = useAuth()
```

Remove these state declarations (they are no longer needed):
```typescript
// DELETE:
const [isLoggedIn, setIsLoggedIn] = useState(false)
const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone')
const [loginPhone, setLoginPhone] = useState('')
const [loginEmail, setLoginEmail] = useState('')
```

Change `handlePublish` — replace `if (!isLoggedIn)` with `if (!user)`:
```typescript
const handlePublish = async (isPublic: boolean) => {
  const trimmedCity = city.trim()
  if (!trimmedCity) {
    triggerFlash('city')
    return
  }
  if (!tags.includes(trimmedCity)) {
    triggerFlash('tags')
    return
  }
  if (!user) {
    setPendingPublish(isPublic)
    setShowLogin(true)
    return
  }
  const photoUrl = await getPhotoDataUrl()
  addImprint({ city: trimmedCity, title: `${trimmedCity} 的印迹`, narrative, tags, isPublic, photo: photoUrl })
  router.push(isPublic ? '/meet' : '/vault')
}
```

Replace `handleLoginConfirm` with:
```typescript
const handleLoginSuccess = async () => {
  setShowLogin(false)
  if (pendingPublish !== null) {
    const trimmedCity = city.trim()
    if (!trimmedCity || !tags.includes(trimmedCity)) return
    const photoUrl = await getPhotoDataUrl()
    addImprint({ city: trimmedCity, title: `${trimmedCity} 的印迹`, narrative, tags, isPublic: pendingPublish, photo: photoUrl })
    router.push(pendingPublish ? '/meet' : '/vault')
  }
}
```

Replace the entire inline `{showLogin && (...)}` block at the bottom of the JSX with:
```typescript
{showLogin && (
  <LoginModal
    onClose={() => setShowLogin(false)}
    onSuccess={handleLoginSuccess}
    redirectPath="/story"
  />
)}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/story/page.tsx
git commit -m "feat: story page uses AuthContext + LoginModal instead of inline login"
```

---

## Task 11: Manual Verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test guest experience**
  - Home page: BottomBubbles visible — left "联系共创", right "登录账号"
  - Vault page: green login banner visible, sample data shown
  - Story page: tapping "发布到社区" without login → LoginModal opens

- [ ] **Step 3: Test email Magic Link**
  - Click "登录账号" → LoginModal, switch to "邮箱登录" tab
  - Enter real email → "发送验证邮件" → "sent" state shown
  - Click link in email → browser redirects back → user logged in
  - BottomBubbles right bubble shows "我的领地"

- [ ] **Step 4: Test WeChat login** (requires WeChat Open Platform app approved + ngrok for local)
  - Click "登录账号" → LoginModal shows "微信登录" tab by default
  - Click green "微信登录" button → browser navigates to `/api/auth/wechat`
  - WeChat OAuth page shows → user scans QR / authorizes
  - Redirects to `/api/auth/wechat/callback` → server creates user → redirects to Supabase magic link → app session established
  - User profile shows WeChat nickname and avatar initial

- [ ] **Step 5: Test publish after WeChat login**
  - Not logged in → fill story → "发布到社区" → LoginModal
  - Complete WeChat auth → redirect back to `/story` → imprint published

- [ ] **Step 6: Verify data persistence**
  - Logged in → save a city → refresh → city still in vault
  - Check Supabase Dashboard → row visible in `saved_cities`

---

## Self-Review

**Spec coverage:**
- ✅ Email Magic Link — Tasks 3, 5
- ✅ WeChat OAuth (replaces phone OTP) — Tasks 2, 3, 5
- ✅ DB tables + RLS + `wechat_openid` on profiles — Task 0
- ✅ `lib/supabase.ts` + `lib/supabaseAdmin.ts` — Task 1
- ✅ AuthContext — Task 3
- ✅ `app/layout.tsx` wraps AuthProvider — Task 4
- ✅ LoginModal (2-tab: WeChat + email) — Task 5
- ✅ BottomBubbles — Task 6
- ✅ `app/page.tsx` uses BottomBubbles — Task 7
- ✅ AppContext fetches Supabase data when logged in — Task 8
- ✅ Vault login banner — Task 9
- ✅ Story page uses LoginModal — Task 10

**WeChat Mini Program future note:**
When building the mini program, auth uses `wx.login()` → code → your server → WeChat API → openid. The server-side logic in `/api/auth/wechat/callback` can be reused (same `openid` → same `wechat_openid` in `profiles`), so users who log in via the mini program will find the same account as their web login.

**Type consistency:**
- `useAuth()` defined in Task 3 → called in Tasks 5, 6, 8, 9, 10: consistent
- `LoginModal` props `{ onClose, onSuccess?, redirectPath? }` defined in Task 5, called in Tasks 6, 9, 10: consistent
- `supabaseAdmin` used only in `app/api/auth/wechat/callback/route.ts` (server-only): consistent
- `Imprint` type unchanged across Tasks 8, 10: consistent
