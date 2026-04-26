'use client'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'

const PLACEHOLDER_LINES = ['柏林', '我想去佛罗伦萨的画廊工作', '欧洲哪里适合一个人安静写作？']
const FULL_PLACEHOLDER = PLACEHOLDER_LINES.join('\n')
const CHAR_DELAY = 60
const LINE_PAUSE = 400

export interface SearchBoxHandle {
  fill: (text: string) => void
  pulse: () => void
}

const SearchBox = forwardRef<SearchBoxHandle>((_, ref) => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [placeholder, setPlaceholder] = useState('')
  const [pulsing, setPulsing] = useState(false)
  const router = useRouter()
  const { setSelectedCity, setSearchContext } = useApp()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(ref, () => ({
    fill: (text: string) => {
      setQuery(text)
      setError(false)
      textareaRef.current?.focus()
    },
    pulse: () => {
      setPulsing(true)
      setTimeout(() => setPulsing(false), 700)
    },
  }))

  useEffect(() => {
    let i = 0
    let timeout: ReturnType<typeof setTimeout>

    const type = () => {
      if (i <= FULL_PLACEHOLDER.length) {
        setPlaceholder(FULL_PLACEHOLDER.slice(0, i))
        const nextChar = FULL_PLACEHOLDER[i]
        const delay = nextChar === '\n' ? LINE_PAUSE : CHAR_DELAY
        i++
        timeout = setTimeout(type, delay)
      }
    }

    timeout = setTimeout(type, 300)
    return () => clearTimeout(timeout)
  }, [])

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

  const borderColor = error ? '#e07050' : pulsing ? 'var(--accent)' : 'var(--border-light)'
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
        onChange={e => { setQuery(e.target.value); setError(false) }}
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
