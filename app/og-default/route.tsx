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
        {/* Subtle grid pattern overlay */}
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
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: '#1D9E75',
          display: 'flex',
        }} />

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          {/* Tree + wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
            <span style={{ fontSize: 96, lineHeight: 1 }}>🌳</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontSize: 80,
                fontWeight: 800,
                color: '#3d3020',
                letterSpacing: '-2px',
                lineHeight: 1,
              }}>
                Nomadic
              </span>
              <span style={{
                fontSize: 36,
                color: '#8a7560',
                letterSpacing: '6px',
                marginTop: 6,
              }}>
                此时此地
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            width: 80,
            height: 3,
            background: '#1D9E75',
            borderRadius: 2,
            marginBottom: 32,
            display: 'flex',
          }} />

          {/* Taglines */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28, color: '#5a4a38', letterSpacing: '1px' }}>
              在世界各地扎根，而不只是路过。
            </span>
            <span style={{ fontSize: 24, color: '#8a7560', letterSpacing: '0.5px' }}>
              一个给数字游民的灵感与商机社区。
            </span>
          </div>
        </div>

        {/* URL badge bottom right */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          right: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(29,158,117,0.12)',
          border: '1.5px solid rgba(29,158,117,0.3)',
          borderRadius: 12,
          padding: '10px 20px',
        }}>
          <span style={{ fontSize: 22, color: '#1D9E75', fontWeight: 700, letterSpacing: '0.5px' }}>
            nomadictree.io
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
