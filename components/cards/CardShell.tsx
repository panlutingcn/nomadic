import { QRCodeCanvas } from 'qrcode.react'

interface CardShellProps {
  nickname?: string | null
  avatarUrl: string | null
  qrValue?: string
  contentBg?: string
  showAvatar?: boolean  // kept for API compat, no longer rendered
  children: React.ReactNode
}

export default function CardShell({ nickname, contentBg, qrValue, children }: CardShellProps) {
  return (
    <div style={{
      width: 375,
      height: 667,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 16,
      overflow: 'hidden',
      fontFamily: "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif",
      boxShadow: '0 8px 40px rgba(20,60,40,0.28)',
    }}>

      {/* Layer 0 — tree image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: "url('/tree-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        zIndex: 0,
      }} />

      {/* Layer 1 — frosted white: tree shows through at ~40% */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.76)',
        zIndex: 1,
      }} />

      {/* ── Top zone — header (no extra bg, frost layer handles it) ── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '9px 20px 12px',
        borderBottom: '0.5px solid rgba(0, 0, 0, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <img
          src="/logo-full-t.png"
          alt="Nomadic"
          style={{ height: 17, width: 'auto', }}
        />
        {nickname ? (
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#2d2418',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}>
            {nickname}
          </div>
        ) : null}
      </div>

      {/* ── Content zone — no extra bg ── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          flex: 1,
          padding: '14px 16px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: contentBg ?? 'transparent',
        }}>
          {children}
        </div>
      </div>

      {/* ── Bottom zone — forest green brand footer (original height preserved) ── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '0 22px',
        minHeight: 146,
        borderTop: '0.5px solid rgba(23,143,104,0.30)',
        background: 'rgba(18, 95, 60, 0.88)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left: text block */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.92)', lineHeight: 1.6 }}>
            在世界各地扎根，而不只是路过。
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.52)', lineHeight: 1.6 }}>
            Rooted in the world, never just passing by.
          </div>
          <div style={{ marginTop: 6, fontSize: 14, color: 'rgba(255,255,255,0.92)', lineHeight: 1.6 }}>
            旅居信息 · 在地社区 · 同频旅伴
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.48)', lineHeight: 1.6 }}>
            Information. Community. Belonging.
          </div>
        </div>

        {/* Right: QR code + URL stacked, centered */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <QRCodeCanvas
            value={qrValue ?? 'https://nomadictree.io'}
            size={60}
            bgColor="transparent"
            fgColor="rgba(255,255,255,0.88)"
          />
          <div style={{
            fontSize: 9,
            color: 'rgba(255,255,255,0.88)',
            fontWeight: 600,
            letterSpacing: 0.2,
            width: 60,
            textAlign: 'center',
          }}>
            nomadictree.io
          </div>
        </div>
      </div>

    </div>
  )
}
