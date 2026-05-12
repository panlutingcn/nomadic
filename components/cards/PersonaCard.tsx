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

// Handwriting / calligraphic font for persona name
const HANDWRITING_FONT = "'Xingkai SC', 'STXingkai', 'KaiTi', cursive"

// Label color shared by "你的旅行人格" and "为你推荐的城市"
const LABEL_COLOR = '#8a7560'

export default function PersonaCard({
  nickname, avatarUrl,
  personaKey, personaName, personaEmoji, personaTags,
  personaDescription, personaOverview,
  cities, cityReasons,
  qrUrl = 'https://nomadictree.io',
}: PersonaCardProps) {
  const tagList = personaTags.split('·').map(t => t.trim())
  const descSentences = personaDescription.match(/[^。！？]*[。！？]/g) ?? [personaDescription]
  const overviewSize = personaOverview.length > 80 ? 10.5 : personaOverview.length > 55 ? 11 : 12

  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl} qrValue={qrUrl}>
      {/* 黄色方框 */}
      <div style={{ flex: 1, border: '2px solid #f0c040', borderRadius: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 20, paddingBottom: 36, paddingLeft: 4, paddingRight: 4 }}>

          {/* Emoji */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 44, lineHeight: 1 }}>{personaEmoji}</div>
          </div>

          {/* 5 paragraphs with uniform gap */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 14, paddingRight: 14 }}>

            {/* 你的旅行人格 */}
            <div style={{ textAlign: 'center', fontSize: 10, color: LABEL_COLOR, letterSpacing: '0.1em' }}>
              你的旅行人格
            </div>

            {/* 人格名称 */}
            <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 600, color: '#1a1a1a', letterSpacing: 0.5, fontFamily: HANDWRITING_FONT }}>
              {personaName}
            </div>

            {/* personaKey + tags */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 12, color: '#1a1a1a', fontWeight: 700, letterSpacing: '0.03em' }}>
                {personaKey}
              </span>
              {tagList.map(t => (
                <span key={t} style={{ fontSize: 11, color: '#1a1a1a' }}>· {t}</span>
              ))}
            </div>

            {/* description */}
            <div style={{ textAlign: 'center' }}>
              {descSentences.map((sentence, i) => (
                <div key={i} style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#f0c040',
                  lineHeight: 1.8,
                  textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.75), 1px 1px 2px rgba(0,0,0,0.8)',
                }}>
                  {sentence}
                </div>
              ))}
            </div>

            {/* overview */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: overviewSize,
                fontWeight: 700,
                color: '#1a1a1a',
                lineHeight: 1.75,
              }}>
                {personaOverview}
              </div>
            </div>
          </div>

          {/* 推荐城市 */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <div style={{ fontSize: 10, color: LABEL_COLOR, marginBottom: 5, letterSpacing: '0.05em' }}>
              —— 为你推荐的城市 ——
            </div>
            <div style={{ fontSize: 12, color: '#1a1a1a', lineHeight: 1.5 }}>
              {cities.slice(0, 3).join(' | ')}
            </div>
          </div>

        </div>
      </div>
    </CardShell>
  )
}
