# Auth UI Redesign — Design Spec

**Date:** 2026-05-02
**Scope:** Home page contact bubble, Vault login entry, LoginModal rewrite, profile card with in-place edit, welcome popup, email change confirmation.

---

## 1. Home Page — Contact Bubble

### What changes
`BottomBubbles` is replaced by a single centered `ContactBubble` component. The login bubble is removed entirely from the home page.

### Visual design
- Background: `linear-gradient(135deg, #f0ebe0 0%, #e8e0d0 100%)`
- Border: `1.5px solid #c8bfaa` (solid, not dashed)
- Border-radius: `20px`
- Box-shadow: `0 4px 16px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.5)`
- Two decorative green dots top-right (8px + 5px, `#1D9E75` at 50%/30% opacity)
- Hover: `scale(1.03)` with `150ms ease`
- Width: `180px`, centered via `display:flex; justify-content:center`

### Copy
- Title: `联系共创 ✦`
- Subtitle: `期待听到你的想法与故事`
- CTA: `给主创 Luna 写信 →`

### ContactModal copy changes
- Header title: `给主创Luna写信`
- Message textarea placeholder: `任何你的想法与故事......`

### File changes
- Delete: `components/BottomBubbles.tsx`
- Create: `components/ContactBubble.tsx` (new single-bubble component)
- Modify: `components/ContactModal.tsx` (copy changes only)
- Modify: `app/page.tsx` (replace `<BottomBubbles />` with `<ContactBubble />`)

---

## 2. Vault Page — Login Entry (Guest State)

### What changes
The green accent banner at the top of vault is removed. Instead, a login bubble appears **below the 印迹 list**, separated by a `0.5px` divider line with `16px` margin above it.

### Login bubble design
Same visual style as the home contact bubble:
- `linear-gradient(135deg, #f0ebe0 0%, #e8e0d0 100%)` background
- `1.5px solid #c8bfaa` border, `border-radius: 20px`
- Two decorative green dots top-right
- Hover: `scale(1.03)`

### Copy
- Title: `登录账号 ✦`
- Subtitle: `保存你的城市与印迹`
- CTA: `点击登录 →`

### Placement
After the imprints list (including the empty-state row), before `<BottomNav />`. Only shown when `!user`.

---

## 3. LoginModal — Full Rewrite

### Screen 1: Method selection
Three options stacked vertically, in this order:

| Option | Style | Icon | Title | Subtitle |
|--------|-------|------|-------|----------|
| 邮箱登录 | White card, `1px solid #e0d8cc` | ✉ | 邮箱登录 | 邮箱 + 昵称 + 密码 |
| Gmail 登录 | White card, `1px solid #e0d8cc` | G (blue) | Gmail 登录 | 使用 Google 账号一键登录 |
| 微信登录 | `#07C160` green background | 💬 | 微信登录 | 自动导入昵称与头像 |

Each option: `border-radius: 11px`, `padding: 10px 12px`, hover `scale(1.02)`.

### Screen 2A: Email login/register
Fields: 邮箱地址, 昵称, 密码 (three inputs).
Button: `登录 / 注册` — calls `loginWithEmail(email, password, nickname)`.
Hint below button: `没有账号？填写后自动创建`
Back button: `← 返回` to Screen 1.

**Logic:** `supabase.auth.signInWithPassword` first. If error `invalid_credentials`, call `supabase.auth.signUp` with `{ email, password, options: { data: { nickname } } }` then insert into `profiles`.

### Screen 2B: Gmail login
Calls `loginWithGoogle()` → `supabase.auth.signInWithOAuth({ provider: 'google' })`. Browser navigates away; the modal is gone on return.
After OAuth redirect back: `onAuthStateChange` fires → `user` is set. `app/vault/page.tsx` checks if a `profiles` row exists for the user. If not, it renders a `NicknamePrompt` overlay (full-screen, same z-index as WelcomeModal) with a single nickname input + confirm button. On confirm, inserts the `profiles` row and shows the WelcomeModal.

### Screen 2C: WeChat login
After WeChat OAuth callback succeeds, show two options:
- `使用微信昵称与头像` (green border, selected by default) → complete login immediately
- `自定义 Nomadic 昵称` (white card) → show nickname input field below; avatar upload is optional and can be done later from profile

### AuthContext new methods
```typescript
loginWithEmail(email: string, password: string, nickname?: string): Promise<{ error: string | null }>
loginWithGoogle(redirectPath?: string): void
updateProfile(fields: { nickname?: string; avatarUrl?: string }): Promise<{ error: string | null }>
updateEmail(newEmail: string): Promise<{ error: string | null }>
deleteAccount(): Promise<{ error: string | null }>
```

`updateEmail` calls `supabase.auth.updateUser({ email: newEmail })`. Supabase automatically sends a confirmation link to the new email; the old email remains active until the user clicks the link. No custom API route needed.

`deleteAccount` calls `supabase.auth.admin` via a new server route `POST /api/auth/delete-account` (uses service role key) to hard-delete the user, then signs out client-side.

---

## 4. Vault Page — Logged-in Profile Card

### Layout
White card (`background: #fff`, `border-radius: 14px`, `border: 0.5px solid #e0d8cc`).

Header row (always visible):
- Avatar circle (42×42px, `border-radius: 50%`, `background: rgba(29,158,117,0.15)`, first letter of nickname in `#1D9E75`)
- Name: `{nickname}的领地` (font-size 13px, weight 600)
- Sub: `{savedCities.length} 个城市 · {imprints.length} 个印迹`
- Buttons: `编辑` (green tint) + `退出` (neutral)

### Avatar upload interaction
- Default: avatar shows first letter, no camera icon
- When editing is open: camera overlay (`rgba(0,0,0,0.35)`) appears on hover/tap; clicking triggers `<input type="file" accept="image/*">` → upload to Supabase Storage → update `profiles.avatar_url`
- After upload: avatar shows `<img>` instead of letter initial

### In-place expand (edit mode)
Clicking `编辑` toggles `max-height` from `0` to `auto` on the expand panel. The button label changes to `收起`.

Expand panel fields:
1. **昵称** — text input, pre-filled
2. **邮箱** — text input, pre-filled; on change, calls `updateEmail(newEmail)` which triggers Supabase confirmation email to new address; UI shows inline note: `确认邮件已发送至新邮箱，点击链接后生效`
3. **微信** — shows `已绑定` or `未绑定`; tapping `未绑定` initiates WeChat OAuth bind flow

Buttons: `取消` (collapses panel, discards changes) | `确认保存` (calls `updateProfile`, collapses panel).

### Account deletion
Below the buttons: `删除账号` in `#c8bfaa` (very light, low prominence).
Tapping opens a confirmation inline section (not a separate modal):
- Text: `此操作不可撤销，将永久删除你的账号与所有数据。`
- Input: placeholder `输入 DELETE 确认`
- Button: `确认删除` — enabled only when input value === `'DELETE'`; calls `deleteAccount()`

---

## 5. First-Login Welcome Popup

### Trigger
Shown once after a successful login when `localStorage.getItem('nomadic_welcomed')` is falsy. Set `localStorage.setItem('nomadic_welcomed', '1')` immediately on show.

### Design
- Overlay: `rgba(0,0,0,0.4)`, z-index above LoginModal
- Card: `linear-gradient(160deg, #f0ebe0 0%, #e8f5ee 100%)`, `border-radius: 20px`, centered
- Globe emoji: 🌍 (32px)
- Copy:
  ```
  Hi {nickname}，
  欢迎你来到 Nomadic 此时此地！
  你是这里的第 {userCount} 位大旅行家。
  我们一起探索这个世界吧！
  ```
- `{userCount}`: fetched via `supabase.from('profiles').select('id', { count: 'exact', head: true })` at login time
- Button: `开始探索 →` — closes popup only (no auto-close)

### Component
New `components/WelcomeModal.tsx`. Rendered in `app/vault/page.tsx` (since login entry is in vault).

---

## 6. Supabase & Backend Changes

### Google OAuth
Enable in Supabase Dashboard → Authentication → Providers → Google. Add `NEXT_PUBLIC_SUPABASE_URL` callback URL to Google Cloud Console.

### Supabase Storage
Create bucket `avatars` (public). Upload path: `avatars/{user_id}.{ext}`. After upload, store public URL in `profiles.avatar_url`.

### New API route
`POST /api/auth/delete-account` — server-side, uses `supabaseAdmin.auth.admin.deleteUser(userId)`. Protected: reads session from request cookies to verify the user is deleting their own account.

### profiles table addition
No schema change needed. `avatar_url` already exists.

---

## 7. File Map

| Action | File | Notes |
|--------|------|-------|
| Delete | `components/BottomBubbles.tsx` | Replaced by ContactBubble |
| Create | `components/ContactBubble.tsx` | Single centered bubble |
| Create | `components/WelcomeModal.tsx` | First-login welcome popup |
| Create | `components/NicknamePrompt.tsx` | Post-Gmail-OAuth nickname collection |
| Modify | `components/LoginModal.tsx` | Full rewrite: 3-method selection + sub-screens |
| Modify | `components/ContactModal.tsx` | Copy changes only |
| Modify | `context/AuthContext.tsx` | Add loginWithEmail, loginWithGoogle, updateProfile, updateEmail, deleteAccount |
| Modify | `app/page.tsx` | Replace BottomBubbles → ContactBubble |
| Modify | `app/vault/page.tsx` | Remove green banner; add login bubble (guest); profile card with expand + avatar upload + delete account; WelcomeModal |
| Create | `app/api/auth/delete-account/route.ts` | Server-side account deletion |

---

## 8. Out of Scope

- WeChat Mini Program auth (separate future project)
- Push notifications
- Social features (following, public profiles)
- Password reset flow (Supabase handles via email automatically)
