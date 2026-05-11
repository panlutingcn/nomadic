import CardShell from './CardShell'

interface WorldCardProps {
  nickname: string
  avatarUrl: string | null
  cityCount: number
  countryCount: number
  cityNames: string[]
}

export default function WorldCard({ nickname, avatarUrl, cityCount, countryCount, cityNames }: WorldCardProps) {
  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl} qrValue="https://nomadictree.io">
      <div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#8a7560', marginBottom: 6, lineHeight: 1.5 }}>
            My footprints on this planet.
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#3d3020', lineHeight: 1.3, letterSpacing: -0.3 }}>
            我的全球版图
          </div>
          <div style={{ fontSize: 13, color: '#8a7560', marginTop: 6 }}>
            在流动中，把世界变成家园。
          </div>
        </div>

        <div style={{ height: '0.5px', background: 'rgba(61,48,32,0.15)', marginBottom: 16 }} />

        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1, background: 'rgba(29,158,117,0.1)', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1D9E75' }}>{cityCount}</div>
            <div style={{ fontSize: 11, color: '#5a4a38', marginTop: 2 }}>座城市</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(29,158,117,0.1)', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1D9E75' }}>{countryCount}</div>
            <div style={{ fontSize: 11, color: '#5a4a38', marginTop: 2 }}>个国家</div>
          </div>
        </div>

        <div style={{ height: '0.5px', background: 'rgba(61,48,32,0.15)', marginBottom: 14 }} />

        {cityNames.length > 0 && (
          <div>
            <div style={{ fontSize: 11, color: '#8a7560', marginBottom: 8 }}>足迹城市</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {cityNames.slice(0, 12).map(city => (
                <span key={city} style={{
                  fontSize: 11, padding: '3px 9px', borderRadius: 6,
                  background: 'rgba(29,158,117,0.12)', color: '#085041',
                  border: '0.5px solid rgba(29,158,117,0.25)',
                }}>
                  {city}
                </span>
              ))}
              {cityNames.length > 12 && (
                <span style={{ fontSize: 11, color: '#8a7560' }}>+{cityNames.length - 12}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </CardShell>
  )
}
