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
  const [focused, setFocused] = useState(false)
  const [hoveredGo, setHoveredGo] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
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
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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

  const containerBorder = 'none'

  const containerShadow = pulsing
    ? [
        '0 6px 28px rgba(29,158,117,0.18)',
        '0 2px 6px rgba(0,0,0,0.10)',
        '0 0 0 1.5px rgba(29,158,117,0.45)',
        '0 0 0 3px rgba(29,158,117,0.10)',
        'inset 0 2.5px 0 rgba(255,255,255,1)',
        'inset 1.5px 0 0 rgba(255,255,255,0.60)',
        'inset -1.5px 0 0 rgba(255,255,255,0.60)',
      ].join(', ')
    : focused
      ? [
          '0 8px 32px rgba(0,0,0,0.12)',
          '0 2px 6px rgba(0,0,0,0.08)',
          '0 0 0 1.5px rgba(29,158,117,0.35)',
          '0 0 0 4px rgba(29,158,117,0.08)',
          'inset 0 2.5px 0 rgba(255,255,255,1)',
          'inset 1.5px 0 0 rgba(255,255,255,0.65)',
          'inset -1.5px 0 0 rgba(255,255,255,0.65)',
          ].join(', ')
      : [
          '0 6px 28px rgba(0,0,0,0.08)',
          '0 2px 6px rgba(0,0,0,0.09)',
          '0 0 0 1px rgba(255,255,255,0.90)',
          'inset 0 2.5px 0 rgba(255,255,255,1)',
          'inset 1.5px 0 0 rgba(255,255,255,0.60)',
          'inset -1.5px 0 0 rgba(255,255,255,0.60)',
          ].join(', ')

  const containerAnimation = pulsing ? 'pulse-random 2.4s ease-in-out infinite' : 'none'

  return (
    <div style={{
      background: 'linear-gradient(160deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.52) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: containerBorder,
      borderRadius: '14px',
      padding: '8px 12px',
      display: 'flex',
      flexDirection: isMobile ? 'row' : 'column',
      alignItems: isMobile ? 'center' : 'stretch',
      gap: isMobile ? '10px' : '6px',
      margin: '8px 0 4px',
      boxShadow: containerShadow,
      animation: containerAnimation,
      transition: 'border-color 220ms ease, box-shadow 220ms ease',
    }}>
      <textarea
        ref={textareaRef}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={3}
        disabled={loading}
        style={{
          ...(isMobile ? { flex: 1 } : {}),
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
      <button
          onClick={handleSearch}
          onMouseEnter={() => !loading && setHoveredGo(true)}
          onMouseLeave={() => setHoveredGo(false)}
          style={{
            alignSelf: isMobile ? 'auto' : 'flex-end',
            background: loading
              ? 'rgba(232,245,238,0.80)'
              : hoveredGo
                ? 'linear-gradient(150deg, #32d494 0%, #22b882 55%, #1a9e6e 100%)'
                : 'linear-gradient(150deg, #27b882 0%, #1D9E75 55%, #178f68 100%)',
            color: loading ? 'var(--accent)' : '#fff',
            fontSize: '12px',
            fontWeight: 500,
            padding: '8px 18px',
            borderRadius: '9px',
            border: loading ? '0.5px solid rgba(29,158,117,0.25)' : 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            pointerEvents: loading ? 'none' : 'auto',
            animation: loading ? 'pulse-hero 2.4s ease-in-out infinite' : 'none',
            boxShadow: loading
              ? 'none'
              : hoveredGo
                ? '0 6px 20px rgba(29,158,117,0.48), inset 0 1px 0 rgba(255,255,255,0.30)'
                : '0 2px 10px rgba(29,158,117,0.32), inset 0 1px 0 rgba(255,255,255,0.22)',
            transform: hoveredGo && !loading ? 'scale(1.05) translateY(-1px)' : 'scale(1)',
            transition: 'box-shadow 180ms ease, transform 180ms ease, background 180ms ease',
          }}
        >
          {loading ? '开启英雄之旅中……' : 'GO'}
        </button>
    </div>
  )
})

SearchBox.displayName = 'SearchBox'
export default SearchBox
