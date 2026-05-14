import { QRCodeCanvas } from 'qrcode.react'

interface CardShellProps {
  nickname?: string | null
  avatarUrl: string | null
  qrValue?: string
  contentBg?: string
  showAvatar?: boolean  // kept for API compat, no longer rendered
  children: React.ReactNode
}

export default function CardShell({ nickname, contentBg, children }: CardShellProps) {
  return (
    <div style={{
      width: 375,
      height: 667,
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(160deg, #f5f0e8 0%, #ede4d4 100%)',
      borderRadius: 16,
      overflow: 'hidden',
      fontFamily: "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif",
      boxShadow: '0 8px 32px rgba(61,48,32,0.18)',
    }}>
      {/* Top zone */}
      <div style={{
        padding: '9px 20px 12px',
        borderBottom: '0.5px solid rgba(61,48,32,0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        flexShrink: 0,
      }}>
        <img
          src="/logo-full-t.png"
          alt="Nomadic"
          style={{ height: 17, width: 'auto', position: 'relative', top: 4 }}
        />
        {nickname ? (
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#5a4a38',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            position: 'relative',
            top: -8,
          }}>
            {nickname}
          </div>
        ) : null}
      </div>

      {/* Content zone */}
      <div style={{ flex: 1, minHeight: 0, background: contentBg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '14px 16px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {children}
        </div>
      </div>

      {/* Bottom zone */}
      <div style={{
        padding: '12px 22px 0',
        borderTop: '0.5px solid rgba(61,48,32,0.12)',
        background: 'rgba(255,255,255,0.35)',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#5a4a38', lineHeight: 1.7 }}>在世界各地扎根，而不只是路过。</div>
          <div style={{ fontSize: 13, color: '#8a7560', lineHeight: 1.7 }}>一个给数字游民的灵感与商机社区。</div>
        </div>
        {/* URL vertically centered in the full space below the text block */}
        <div style={{ height: 88, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: '#166b4c', fontWeight: 600, letterSpacing: 0.3, position: 'relative', top: -11 }}>nomadictree.io</div>
          <div style={{ position: 'absolute', right: 0, bottom: 21 }}>
            <QRCodeCanvas value="https://nomadictree.io" size={60} bgColor="transparent" fgColor="#3d3020" />
          </div>
        </div>
      </div>
    </div>
  )
}
