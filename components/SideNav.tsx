'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// ── 小型火山粒子（桌面侧边栏专用，尺寸更克制）──────────
interface Particle {
  id: number; x: number; y: number; vx: number; vy: number
  life: number; decay: number; type: 'spark' | 'lava' | 'smoke'
  size: number; grounded: boolean
}
let _pid2 = 0

function lavaColor(life: number, type: Particle['type']): string {
  if (type === 'smoke') return `rgba(160,140,120,${(life * 0.4).toFixed(2)})`
  if (type === 'spark') {
    if (life > 0.75) return '#ffffc0'
    if (life > 0.55) return '#ffd700'
    if (life > 0.35) return '#ff8c00'
    return '#ff4500'
  }
  if (life > 0.78) return '#fff4a0'
  if (life > 0.58) return '#ff9500'
  if (life > 0.38) return '#ff3e00'
  if (life > 0.18) return '#c01200'
  return '#700800'
}

function MiniVolcano({ erupting }: { erupting: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const rafRef = useRef<number>(0)

  const spawnBatch = useCallback((): Particle[] => {
    const batch: Particle[] = []
    for (let i = 0; i < 3; i++) {
      batch.push({ id: _pid2++, x: (Math.random() - 0.5) * 2, y: -6,
        vx: (Math.random() - 0.5) * 3.5, vy: -(Math.random() * 3 + 2),
        life: 1, decay: 0.05 + Math.random() * 0.02,
        type: 'spark', size: 1.2 + Math.random() * 1.2, grounded: false })
    }
    for (let i = 0; i < 2; i++) {
      batch.push({ id: _pid2++, x: (Math.random() - 0.5) * 2, y: -6,
        vx: (i % 2 === 0 ? 1 : -1) * (Math.random() * 1.4 + 0.3),
        vy: -(Math.random() * 1.8 + 1.2),
        life: 1, decay: 0.022 + Math.random() * 0.01,
        type: 'lava', size: 3 + Math.random() * 2, grounded: false })
    }
    return batch
  }, [])

  useEffect(() => {
    if (!erupting) { if (intervalRef.current) clearInterval(intervalRef.current); return }
    setParticles(prev => [...prev, ...spawnBatch()])
    intervalRef.current = setInterval(() => setParticles(prev => [...prev, ...spawnBatch()]), 120)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [erupting, spawnBatch])

  useEffect(() => {
    if (particles.length === 0) return
    rafRef.current = requestAnimationFrame(() => {
      setParticles(prev =>
        prev.map(p => {
          let { x, y, vx, vy, grounded } = p
          const gravity = p.type === 'smoke' ? -0.01 : 0.20
          vy += gravity
          if (p.type === 'lava' && !grounded && y > 5) { grounded = true; vy = 0.06; vx *= 1.3 }
          if (grounded) { vy += 0.012; vx *= 0.96 }
          x += vx; y += vy
          return { ...p, x, y, vx, vy, life: p.life - p.decay, grounded }
        }).filter(p => p.life > 0 && p.y < 20)
      )
    })
    return () => cancelAnimationFrame(rafRef.current)
  }, [particles])

  useEffect(() => {
    if (erupting) return
    const t = setTimeout(() => setParticles([]), 1600)
    return () => clearTimeout(t)
  }, [erupting])

  return (
    <span className={erupting ? 'volcano-erupting' : ''}
      style={{ position: 'relative', display: 'inline-block', fontSize: 18, lineHeight: 1, overflow: 'visible' }}>
      🌋
      {particles.map(p => {
        const color = lavaColor(p.life, p.type)
        const isHot = p.life > 0.5 && p.type !== 'smoke'
        return (
          <span key={p.id} style={{
            position: 'absolute',
            left: `calc(50% + ${p.x}px)`, top: `calc(50% + ${p.y}px)`,
            width: p.type === 'lava' && p.grounded ? p.size * 1.5 : p.size,
            height: p.type === 'lava' && p.grounded ? p.size * 0.5 : p.size,
            borderRadius: p.type === 'smoke' ? '50%' : (p.grounded ? '40%' : '50%'),
            background: color, opacity: p.type === 'smoke' ? 1 : p.life,
            transform: 'translate(-50%, -50%)', pointerEvents: 'none',
            filter: p.type === 'smoke' ? 'blur(2px)' : (isHot ? 'blur(0.3px)' : 'none'),
            boxShadow: isHot ? `0 0 ${p.size + 1}px ${color}` : 'none',
          }} />
        )
      })}
    </span>
  )
}

// ── 导航项定义 ───────────────────────────────────────────
const NAV_ITEMS = [
  { path: '/',      icon: null,  emoji: '🌋',  label: '探索世界', volcano: true },
  { path: '/meet',  icon: null,  emoji: '👥',  label: '遇见社区', volcano: false },
  { path: '/story', icon: null,  emoji: '✏️',  label: '发布印迹', volcano: false, isCta: true },
  { path: '/mine',  icon: null,  emoji: '🗺️',  label: '我的版图', volcano: false },
]

export default function SideNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [erupting, setErupting] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path + '/') || pathname === path

  const handleNav = (path: string, isVolcano: boolean) => {
    router.push(path)
    if (isVolcano) {
      setErupting(true)
      setTimeout(() => setErupting(false), 1800)
    }
  }

  return (
    <>
    <nav className="side-nav-desktop" style={{
      background: '#ede5d8',
      borderRight: '0.5px solid #d8cdb8',
      display: 'flex',
      flexDirection: 'column',
      padding: '28px 56px 24px 56px',
    }}>
      {/* Logo */}
      <div onClick={() => handleNav('/', true)}
        style={{ cursor: 'pointer', marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
        <img
          src="/logo-nomadic-t.png"
          alt="Nomadic"
          style={{ height: 38, width: 'auto', display: 'block' }}
        />
      </div>

      {/* 导航项 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.path)
          const hovered = hoveredPath === item.path

          /* 写印迹 CTA 按钮 */
          if (item.isCta) {
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path, false)}
                onMouseEnter={() => setHoveredPath(item.path)}
                onMouseLeave={() => setHoveredPath(null)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '10px 28px 10px 14px', borderRadius: 11, border: 'none',
                  cursor: 'pointer', fontSize: 14, fontWeight: 500,
                  margin: '6px 0',
                  background: active
                    ? '#1D9E75'
                    : hovered
                      ? 'rgba(45,36,24,0.05)'
                      : 'none',
                  color: active ? '#fff' : hovered ? '#0f6e56' : 'var(--text-secondary)',
                  transform: hovered ? 'scale(1.06)' : 'scale(1)',
                  transition: 'background 150ms ease, transform 140ms ease',
                }}
              >
                <span style={{ fontSize: 17, lineHeight: 1 }}>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            )
          }

          /* 普通导航项 */
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path, item.volcano)}
              onMouseEnter={() => setHoveredPath(item.path)}
              onMouseLeave={() => setHoveredPath(null)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '10px 28px 10px 14px', borderRadius: 11, border: 'none',
                cursor: 'pointer', fontSize: 14,
                fontWeight: active ? 600 : 400,
                background: active
                  ? '#1D9E75'
                  : hovered
                    ? 'rgba(45,36,24,0.05)'
                    : 'none',
                color: active ? '#fff' : 'var(--text-secondary)',
                transform: hovered ? 'scale(1.06)' : 'scale(1)',
                transition: 'background 150ms ease, transform 140ms ease',
              }}
            >
              {item.volcano ? (
                <MiniVolcano erupting={erupting && active} />
              ) : (
                <span style={{ fontSize: 17, lineHeight: 1 }}>{item.emoji}</span>
              )}
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* 弹性间距 */}
      <div style={{ flex: 1 }} />

      {/* 旅行人格测试入口 */}
      <button
        onClick={() => router.push('/onboarding')}
        onMouseEnter={() => setHoveredPath('__persona__')}
        onMouseLeave={() => setHoveredPath(null)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '10px 28px 10px 14px', borderRadius: 11, border: 'none',
          cursor: 'pointer', fontSize: 13, fontWeight: 500,
          width: '100%', marginBottom: 6,
          background: hoveredPath === '__persona__'
            ? 'rgba(29,158,117,0.08)'
            : 'rgba(29,158,117,0.04)',
          color: hoveredPath === '__persona__' ? '#0f6e56' : '#5a8a76',
          transform: hoveredPath === '__persona__' ? 'scale(1.06)' : 'scale(1)',
          transition: 'background 150ms ease, transform 140ms ease',
        }}
      >
        <span style={{ fontSize: 17, lineHeight: 1 }}>🧭</span>
        <span>旅行人格测试</span>
      </button>

      {/* 扫码加入社群 */}
      <button
        onClick={() => setShowQR(true)}
        onMouseEnter={() => setHoveredPath('__qr__')}
        onMouseLeave={() => setHoveredPath(null)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '10px 28px 10px 14px', borderRadius: 11, border: 'none',
          cursor: 'pointer', fontSize: 13, fontWeight: 500,
          width: '100%', marginBottom: 8,
          background: hoveredPath === '__qr__'
            ? 'rgba(29,158,117,0.08)'
            : 'rgba(29,158,117,0.04)',
          color: hoveredPath === '__qr__' ? '#0f6e56' : '#5a8a76',
          transform: hoveredPath === '__qr__' ? 'scale(1.06)' : 'scale(1)',
          transition: 'background 150ms ease, transform 140ms ease',
        }}
      >
        <span style={{ fontSize: 17, lineHeight: 1 }}>💬</span>
        <span>扫码加入社群</span>
      </button>

      {/* 底部标语 */}
      <div style={{
        borderTop: '0.5px solid #d0c7b8',
        paddingTop: 16,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          全球身份 · 在地资源
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
          nomadictree.io
        </div>
      </div>
    </nav>

    {/* 微信二维码弹窗 */}
    {showQR && (
      <div
        onClick={() => setShowQR(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: 20, padding: '28px 28px 24px',
            maxWidth: 300, width: '90vw', textAlign: 'center',
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, color: '#2d2418', marginBottom: 4 }}>加入 Nomadic 社群</div>
          <div style={{ fontSize: 12, color: '#8a7a62', marginBottom: 16 }}>扫码添加微信，进入游民社区</div>
          <img
            src="/wechat-qr.jpg"
            alt="微信二维码"
            style={{ width: '100%', borderRadius: 12, display: 'block' }}
          />
          <button
            onClick={() => setShowQR(false)}
            style={{
              marginTop: 18, fontSize: 13, color: '#8a7a62',
              background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            关闭
          </button>
        </div>
      </div>
    )}
  </>
  )
}
