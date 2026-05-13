import CardShell from './CardShell'
import { getBodyText } from '@/lib/imprintUtils'

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

// At 15px bold, ~16 Chinese chars fit on one line in the 343px text column
const MAX_TITLE_CHARS = 16
// At 13px, ~24 chars/line × 3 lines = 72; use 78 for a little more content
const MAX_BODY_CHARS = 78

export default function ImprintCard({
  nickname, avatarUrl, photo, title, narrative, cityNameZh, countryZh, flag, cityBgColor = '#ede8df', qrValue
}: ImprintCardProps) {
  // Truncate title to single display line
  const displayTitle = title
    ? (title.length > MAX_TITLE_CHARS ? title.slice(0, MAX_TITLE_CHARS - 1) + '…' : title)
    : undefined

  // Join all paragraphs into continuous text, truncate to ~3 display lines
  const body = getBodyText(narrative, title)
  const fullText = body.split('\n').filter(p => p.trim()).join('')
  const displayBody = fullText.length > MAX_BODY_CHARS
    ? fullText.slice(0, MAX_BODY_CHARS - 1) + '…'
    : fullText

  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl} qrValue={qrValue}>
      {/* Outer wrapper: flex-column, vertically centered in the content zone */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Photo */}
        <div style={{
          width: '100%', height: 150, borderRadius: 10, overflow: 'hidden', marginBottom: 12,
          background: photo ? `center / cover no-repeat url(${photo})` : cityBgColor,
          flexShrink: 0,
          display: photo ? undefined : 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: 'rgba(61,48,32,0.4)',
        }}>
          {!photo && cityNameZh}
        </div>

        {/* Title — JS-truncated so it always fits on one line, no CSS clipping */}
        {displayTitle && (
          <div style={{
            fontSize: 15, fontWeight: 700, color: '#3d3020',
            lineHeight: 1.6, marginBottom: 0, flexShrink: 0,
          }}>{displayTitle}</div>
        )}

        {/* Divider below title */}
        <div style={{ height: 0.5, background: 'rgba(61,48,32,0.18)', margin: '8px 0 10px', flexShrink: 0 }} />

        {/* Body — continuous text, ~3 display lines */}
        <div style={{ fontSize: 13, color: '#5a4a38', lineHeight: 1.8, marginBottom: 12, flexShrink: 0 }}>
          {displayBody}
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#8a7560', flexShrink: 0 }}>
          {flag && <span>{flag}</span>}
          <span>{cityNameZh}{countryZh ? ` · ${countryZh}` : ''}</span>
        </div>
      </div>
    </CardShell>
  )
}
