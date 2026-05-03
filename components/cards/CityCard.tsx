import CardShell from './CardShell'

interface CityCardProps {
  nickname: string
  avatarUrl: string | null
  cityNameZh: string
  cityNameEn: string
  countryZh: string
  flag: string
  description: string
}

export default function CityCard({ nickname, avatarUrl, cityNameZh, cityNameEn, countryZh, flag, description }: CityCardProps) {
  const truncated = description.length > 100 ? description.slice(0, 100) + '…' : description

  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl}>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#3d3020', lineHeight: 1.2 }}>{cityNameZh || cityNameEn}</span>
          {cityNameZh && cityNameEn && cityNameZh !== cityNameEn && (
            <span style={{ fontSize: 14, color: '#8a7560' }}>{cityNameEn}</span>
          )}
        </div>
        <div style={{ fontSize: 14, color: '#5a4a38', marginBottom: 14 }}>
          {flag} {countryZh}
        </div>
        <div style={{ height: '0.5px', background: 'rgba(61,48,32,0.15)', marginBottom: 14 }} />
        <div style={{ fontSize: 13, color: '#5a4a38', lineHeight: 1.8 }}>{truncated}</div>
      </div>
    </CardShell>
  )
}
