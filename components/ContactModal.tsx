'use client'
import { useState, useRef, useEffect } from 'react'

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

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      if (successTimerRef.current) clearTimeout(successTimerRef.current)
    }
  }, [])

  const handleClose = () => {
    setShow(false)
    closeTimerRef.current = setTimeout(onClose, 200)
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
    if (loading) return
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
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      setSuccess(true)
      successTimerRef.current = setTimeout(handleClose, 3000)
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
                name="user-email"
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
                name="subject"
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
                name="message"
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
