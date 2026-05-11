'use client'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useRouter } from 'next/navigation'
import { SEARCH_PROMPTS, SearchPrompt } from '@/data/searchPrompts'

const CHAR_DELAY = 60
const LINE_PAUSE = 400

export interface SearchBoxHandle {
  fill: (text: string) => void
  pulse: () => void
  search: () => void
  startLoading: () => void
}

interface SearchBoxProps {
  onError?: (msg: string) => void
}

function getDailyPrompt(): SearchPrompt {
  const today = new Date().toISOString().slice(0, 10)
  try {
    const stored = localStorage.getItem('nomadic_daily_prompt_v2')
    if (stored) {
      const { date, index } = JSON.parse(stored)
      if (date === today) return SEARCH_PROMPTS[index]
    }
    const index = Math.floor(Math.random() * SEARCH_PROMPTS.length)
    localStorage.setItem('nomadic_daily_prompt_v2', JSON.stringify({ date: today, index }))
    return SEARCH_PROMPTS[index]
  } catch {
    return SEARCH_PROMPTS[0]
  }
}

const SearchBox = forwardRef<SearchBoxHandle, SearchBoxProps>(({ onError: _onError }, ref) => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [placeholder, setPlaceholder] = useState('')
  const [pulsing, setPulsing] = useState(false)
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(ref, () => ({
    fill: (text: string) => {
      setQuery(text)
      textareaRef.current?.focus()
    },
    pulse: () => {
      setPulsing(true)
      setTimeout(() => setPulsing(false), 2400)
    },
    search: () => { handleSearch() },
    startLoading: () => { setLoading(true) },
  }))

  useEffect(() => {
    const prompt = getDailyPrompt()
    const full = prompt.city + '\n' + prompt.line2 + '\n' + prompt.line3
    let i = 0
    let timeout: ReturnType<typeof setTimeout>

    const type = () => {
      if (i <= full.length) {
        setPlaceholder(full.slice(0, i))
        const nextChar = full[i]
        const delay = nextChar === '\n' ? LINE_PAUSE : CHAR_DELAY
        i++
        timeout = setTimeout(type, delay)
      }
    }

    timeout = setTimeout(type, 300)
    return () => clearTimeout(timeout)
  }, [])

  const handleSearch = () => {
    if (!query.trim()) return
    setLoading(true)
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const borderColor = pulsing ? 'var(--accent)' : 'var(--border-light)'
  const boxShadow = pulsing ? 'none' : '0 2px 6px rgba(0,0,0,0.06)'
  const containerAnimation = pulsing ? 'pulse-random 2.4s ease-in-out infinite' : 'none'

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
      animation: containerAnimation,
      transition: pulsing ? 'border-color 200ms ease' : 'border-color 200ms ease, box-shadow 200ms ease',
    }}>
      <textarea
        ref={textareaRef}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        disabled={loading}
        style={{
          fontSize: '12px',
          color: 'var(--text-primary)',
          lineHeight: 1.6,
          background: 'none',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontFamily: 'inherit',
          opacity: loading ? 0.6 : 1,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSearch}
          style={{
            background: loading ? '#e8f5ee' : 'var(--accent)',
            color: loading ? 'var(--accent)' : '#fff',
            fontSize: '12px',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: '8px',
            border: loading ? '0.5px solid var(--border-light)' : 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            pointerEvents: loading ? 'none' : 'auto',
            animation: loading ? 'pulse-hero 2.4s ease-in-out infinite' : 'none',
          }}
        >
          {loading ? '开启英雄之旅中……' : 'GO'}
        </button>
      </div>
    </div>
  )
})

SearchBox.displayName = 'SearchBox'
export default SearchBox
