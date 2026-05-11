import CardShell from './CardShell'

interface PersonaCardProps {
  nickname: string
  avatarUrl: string | null
  personaKey: string
  personaName: string
  personaEmoji: string
  personaTags: string
  personaDescription: string
  personaOverview: string
  cities: string[]
  cityReasons: Record<string, string>
  qrUrl?: string
}

export default function PersonaCard({
  nickname, avatarUrl,
  personaKey, personaName, personaEmoji, personaTags,
  personaDescription, personaOverview,
  cities, cityReasons,
  qrUrl = 'https://nomadictree.io',
}: PersonaCardProps) {
  const tagList = personaTags.split('·').map(t => t.trim())

  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl} qrValue={qrUrl}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Emoji + 标题 */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 8 }}>{personaEmoji}</div>
          <div style={{ fontSize: 10, color: '#8a7560', letterSpacing: '0.1em', marginBottom: 4 }}>
            你的旅行人格
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#3d3020', letterSpacing: -0.3, marginBottom: 8 }}>
            {personaName}
          </div>
          {/* Tags row */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              fontSize: 11, color: '#7a5e30', fontWeight: 600,
              background: 'rgba(122,94,48,0.1)', padding: '2px 8px',
              borderRadius: 5, letterSpacing: '0.03em',
            }}>
              {personaKey}
            </span>
            {tagList.map(t => (
              <span key={t} style={{ fontSize: 11, color: '#9a7a50' }}>· {t}</span>
            ))}
          </div>
        </div>

        {/* Description box */}
        <div style={{
          background: 'rgba(255,255,255,0.6)',
          borderRadius: 10,
          padding: '10px 12px',
          marginBottom: 8,
        }}>
          <div style={{ fontSize: 11, color: '#3d3020', lineHeight: 1.75 }}>
            {personaDescription}
          </div>
        </div>

        {/* Overview box */}
        <div style={{
          background: 'rgba(255,255,255,0.4)',
          borderRadius: 10,
          padding: '10px 12px',
          marginBottom: 10,
        }}>
          <div style={{ fontSize: 10.5, color: '#5a4a38', lineHeight: 1.75 }}>
            {personaOverview}
          </div>
        </div>

        {/* 推荐城市 — 简洁列表，无背景框 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ fontSize: 10, color: '#8a7560', marginBottom: 2 }}>为你推荐的城市</div>
          {cities.slice(0, 3).map(city => (
            <div key={city} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 13 }}>📍</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#3d3020' }}>{city}</span>
            </div>
          ))}
        </div>

      </div>
    </CardShell>
  )
}
