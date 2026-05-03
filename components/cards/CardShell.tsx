import { QRCodeSVG } from 'qrcode.react'

interface CardShellProps {
  nickname: string
  avatarUrl: string | null
  children: React.ReactNode
}

export default function CardShell({ nickname, avatarUrl, children }: CardShellProps) {
  return (
    <div style={{
      width: 375,
      background: 'linear-gradient(160deg, #f5f0e8 0%, #ede4d4 100%)',
      borderRadius: 16,
      overflow: 'hidden',
      fontFamily: "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif",
      boxShadow: '0 8px 32px rgba(61,48,32,0.18)',
    }}>
      {/* Top zone */}
      <div style={{
        padding: '18px 20px 14px',
        borderBottom: '0.5px solid rgba(61,48,32,0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🌳</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#3d3020', lineHeight: 1.2 }}>Nomadic</div>
            <div style={{ fontSize: 11, color: '#8a7560', lineHeight: 1.2 }}>此时此地</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 12, color: '#5a4a38', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {nickname}
          </div>
          {avatarUrl ? (
            <img src={avatarUrl} alt={nickname} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} crossOrigin="anonymous" />
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', fontWeight: 600 }}>
              {(nickname[0] ?? 'N').toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Content zone */}
      <div style={{ padding: '20px 20px 16px' }}>
        {children}
      </div>

      {/* Bottom zone */}
      <div style={{
        padding: '14px 20px 20px',
        borderTop: '0.5px solid rgba(61,48,32,0.12)',
        background: 'rgba(255,255,255,0.35)',
      }}>
        <div style={{ fontSize: 12, color: '#8a7560', lineHeight: 1.7, marginBottom: 12 }}>
          <div>在世界各地扎根，而不只是路过。</div>
          <div>一个给数字游民的灵感与商机社区。</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: '#1D9E75', fontWeight: 600, letterSpacing: 0.3 }}>nomadictree.io</div>
          <QRCodeSVG value="https://nomadictree.io" size={64} bgColor="transparent" fgColor="#3d3020" />
        </div>
      </div>
    </div>
  )
}
