# Contact Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a chat-bubble contact entry at the homepage bottom that opens a form modal for users to email Luna at panluting.cn@gmail.com via Netlify Forms.

**Architecture:** Two new components (ContactBubble + ContactModal) with all state local to ContactBubble. A hidden Netlify form in page.tsx lets Netlify detect the form at build time; actual submission uses fetch with `application/x-www-form-urlencoded` to avoid page refresh.

**Tech Stack:** React 19 + TypeScript, Netlify Forms, fetch API, inline styles matching existing codebase patterns.

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `components/ContactBubble.tsx` | Create | Chat-bubble entry point + owns showModal state + renders ContactModal |
| `components/ContactModal.tsx` | Create | Form modal with fields, validation, submission, success/error states |
| `app/page.tsx` | Modify | Import ContactBubble, add hidden Netlify form, place ContactBubble before BottomNav |

---

### Task 1: Create ContactModal component

**Files:**
- Create: `components/ContactModal.tsx`

- [ ] **Step 1: Create the file with full implementation**

```tsx
'use client'
import { useState } from 'react'

interface ContactModalProps {
  onClose: () => void
}

interface FormErrors {
  email?: string
  subject?: string
  message?: string
}

export default function ContactModal({ onClose }: ContactModalProps) {
  const [show, setShow] = useState(true)
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleClose = () => {
    setShow(false)
    setTimeout(onClose, 200)
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }
    if (!subject.trim()) {
      newErrors.subject = '请填写邮件主题'
    }
    if (message.trim().length < 10) {
      newErrors.message = '内容至少需要10个字符'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    setSubmitError(null)
    try {
      const body = new URLSearchParams({
        'form-name': 'contact',
        'user-email': email,
        'subject': subject,
        'message': message,
      })
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      setSuccess(true)
      setTimeout(handleClose, 3000)
    } catch (err) {
      console.error('[contact] submit error:', err)
      setSubmitError('提交失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '9px 11px',
    borderRadius: 8,
    border: `1px solid ${hasError ? '#e05252' : 'var(--border)'}`,
    background: 'var(--bg-page)',
    color: 'var(--text-primary)',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  })

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9998,
        opacity: show ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: 16,
          padding: '24px 20px',
          maxWidth: 360,
          width: '92%',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          position: 'relative',
          transform: show ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 200ms ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'none', border: 'none',
            fontSize: 20, color: 'var(--text-secondary)',
            cursor: 'pointer', padding: 4, lineHeight: 1,
          }}
        >×</button>

        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
            给Luna写信
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            收件人: panluting.cn@gmail.com
          </div>
        </div>

        {success ? (
          <div style={{
            textAlign: 'center', padding: '24px 0',
            color: '#1D9E75', fontSize: 14, fontWeight: 500,
          }}>
            ✓ 已发送！Luna会尽快回复你
          </div>
        ) : (
          <>
            {/* Email field */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>你的邮箱</div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
                style={inputStyle(!!errors.email)}
              />
              {errors.email && (
                <div style={{ fontSize: 10, color: '#e05252', marginTop: 3 }}>{errors.email}</div>
              )}
            </div>

            {/* Subject field */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>主题</div>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="邮件主题"
                disabled={loading}
                style={inputStyle(!!errors.subject)}
              />
              {errors.subject && (
                <div style={{ fontSize: 10, color: '#e05252', marginTop: 3 }}>{errors.subject}</div>
              )}
            </div>

            {/* Message field */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>内容</div>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="想对Luna说的话..."
                disabled={loading}
                rows={6}
                style={{ ...inputStyle(!!errors.message), resize: 'vertical', minHeight: 100 }}
              />
              {errors.message && (
                <div style={{ fontSize: 10, color: '#e05252', marginTop: 3 }}>{errors.message}</div>
              )}
            </div>

            {/* Submit error */}
            {submitError && (
              <div style={{ fontSize: 11, color: '#e05252', marginBottom: 10, textAlign: 'center' }}>
                {submitError}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={handleClose}
                disabled={loading}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)',
                  background: 'var(--bg-card-2)', color: 'var(--text-secondary)',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: '8px 18px', borderRadius: 8, border: 'none',
                  background: loading ? 'rgba(29,158,117,0.5)' : 'var(--accent)',
                  color: '#fff', fontSize: 12, fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                }}
              >
                {loading ? '发送中...' : '发送'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify the file was created**

```bash
cat components/ContactModal.tsx | head -5
```
Expected: `'use client'`

---

### Task 2: Create ContactBubble component

**Files:**
- Create: `components/ContactBubble.tsx`

- [ ] **Step 1: Create the file with full implementation**

```tsx
'use client'
import { useState } from 'react'
import ContactModal from './ContactModal'

export default function ContactBubble() {
  const [showModal, setShowModal] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <>
      {/* Chat bubble entry point */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, marginBottom: 8 }}>
        <div
          onClick={() => setShowModal(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'relative',
            background: '#f0ebe0',
            borderRadius: 14,
            padding: '10px 16px',
            maxWidth: 280,
            cursor: 'pointer',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 150ms ease',
            boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          {/* Bubble tail (left side) */}
          <div style={{
            position: 'absolute',
            left: -7,
            top: 14,
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderRight: '8px solid #f0ebe0',
          }} />
          <div style={{
            fontSize: 11,
            color: '#b8a98a',
            lineHeight: 1.6,
            textAlign: 'center',
          }}>
            这是旅行者Luna用代码写给自己的情书。<br />
            如果它也触动了你，欢迎来信交流 ✉️
          </div>
        </div>
      </div>

      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </>
  )
}
```

- [ ] **Step 2: Verify the file was created**

```bash
cat components/ContactBubble.tsx | head -5
```
Expected: `'use client'`

---

### Task 3: Integrate into homepage

**Files:**
- Modify: `app/page.tsx`

The homepage currently ends with:
```tsx
      </div>
      <BottomNav />
      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
      {errorMessage && <ErrorToast onClose={() => setErrorMessage('')} />}
    </div>
```

- [ ] **Step 1: Add ContactBubble import at the top of the file**

Find the existing imports block (lines 1–12) and add:
```tsx
import ContactBubble from '@/components/ContactBubble'
```

After the existing imports, the block should look like:
```tsx
'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import SearchBox, { SearchBoxHandle } from '@/components/SearchBox'
import GuideModal from '@/components/GuideModal'
import ErrorToast from '@/components/ErrorToast'
import GlobeMap from '@/components/GlobeMap'
import ContactBubble from '@/components/ContactBubble'
import { useApp } from '@/context/AppContext'
import { CITIES } from '@/data/cities'
import { PINNED_CITIES, NOMAD_CITY_POOL, NomadCity } from '@/data/nomadCities'
import { shuffle } from '@/utils/shuffle'
```

- [ ] **Step 2: Add hidden Netlify form and ContactBubble before BottomNav**

Find this block near the end of the JSX (around line 280):
```tsx
      </div>
      <BottomNav />
```

Replace it with:
```tsx
      </div>

      {/* Hidden form for Netlify Forms build-time detection */}
      <form name="contact" data-netlify="true" hidden>
        <input type="email" name="user-email" />
        <input type="text" name="subject" />
        <textarea name="message"></textarea>
      </form>

      <ContactBubble />
      <BottomNav />
```

- [ ] **Step 3: Build to verify no TypeScript errors**

```bash
npm run build 2>&1 | tail -20
```
Expected: Build completes with no TypeScript errors. Route list shows `○ /` as static.

- [ ] **Step 4: Commit**

```bash
git add components/ContactBubble.tsx components/ContactModal.tsx app/page.tsx
git commit -m "feat: add contact bubble and email form via Netlify Forms"
```

---

### Task 4: Deploy and configure Netlify Forms notification

**Files:** None (deployment + Netlify dashboard config)

- [ ] **Step 1: Deploy to production**

```bash
npx netlify deploy --prod --skip-functions-cache 2>&1 | tail -15
```
Expected: `Deploy is live!` with production URL.

- [ ] **Step 2: Verify hidden form exists in production HTML**

```bash
curl -s https://nomadictree.netlify.app | grep -o 'data-netlify="true"'
```
Expected: `data-netlify="true"`

- [ ] **Step 3: Configure email notification in Netlify dashboard**

1. Go to https://app.netlify.com/projects/nomadictree/forms
2. Verify "contact" form appears in the list
3. Click on the form → "Form notifications"
4. Add email notification → set recipient to `panluting.cn@gmail.com`
5. Save

- [ ] **Step 4: Send a test submission**

Open https://nomadictree.netlify.app, click the contact bubble, fill in the form, and submit. Verify:
- Success message "✓ 已发送！Luna会尽快回复你" appears
- Modal auto-closes after 3 seconds
- Email arrives at panluting.cn@gmail.com

- [ ] **Step 5: Commit deployment note**

```bash
git commit --allow-empty -m "chore: configure Netlify Forms notification for contact form"
```
