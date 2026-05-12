import CardShell from './CardShell'

interface ImprintCardProps {
  nickname: string
  avatarUrl: string | null
  photo: string | undefined
  title?: string
  narrative: string
  cityNameZh: string
  countryZh: string
  flag: string
  cityBgColor?: string
  qrValue?: string
}

export default function ImprintCard({
  nickname, avatarUrl, photo, title, narrative, cityNameZh, countryZh, flag, cityBgColor = '#ede8df', qrValue
}: ImprintCardProps) {

  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl} qrValue={qrValue}>
      <div>
        <div style={{ width: '100%', height: 150, borderRadius: 10, overflow: 'hidden', marginBottom: 12, background: cityBgColor, position: 'relative' }}>
          {photo ? (
            <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} crossOrigin="anonymous" />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'rgba(61,48,32,0.4)' }}>
              {cityNameZh}
            </div>
          )}
        </div>
        {title && (
          <div style={{ fontSize: 15, fontWeight: 700, color: '#3d3020', lineHeight: 1.3, marginBottom: 8 }}>{title}</div>
        )}
        <div style={{
          fontSize: 13, color: '#5a4a38', lineHeight: 1.8, marginBottom: 10,
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
        }}>{narrative}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8a7560' }}>
          <span>📍</span>
          <span>{cityNameZh}{countryZh ? ` · ${flag} ${countryZh}` : ''}</span>
        </div>
      </div>
    </CardShell>
  )
}
