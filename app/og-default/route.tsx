import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #f5f0e8 0%, #e8dece 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle dot grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(61,48,32,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          display: 'flex',
        }} />

        {/* Green accent bar top */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 6,
          background: '#178f68',
          display: 'flex',
        }} />

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 36 }}>
            <span style={{ fontSize: 88, lineHeight: 1 }}>🌳</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
                <span style={{ fontSize: 80, fontWeight: 800, color: '#3d3020', letterSpacing: '-2px', lineHeight: 1 }}>
                  Nomadic
                </span>
                <span style={{ fontSize: 42, color: '#8a7560', letterSpacing: '4px', lineHeight: 1, paddingBottom: 14 }}>
                  此时此地
                </span>
              </div>
            </div>
          </div>

          <div style={{ width: 80, height: 3, background: '#178f68', borderRadius: 2, marginBottom: 36, display: 'flex' }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28, color: '#5a4a38', letterSpacing: '1px' }}>
              在世界各地扎根，而不只是路过。
            </span>
            <span style={{ fontSize: 24, color: '#8a7560', letterSpacing: '0.5px' }}>
              一个给数字游民的灵感与商机社区。
            </span>
          </div>
        </div>

        {/* Bottom right: URL */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          right: 56,
          display: 'flex',
        }}>
          <span style={{ fontSize: 22, color: '#178f68', fontWeight: 700 }}>
            nomadictree.io
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
