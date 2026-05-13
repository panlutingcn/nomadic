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

// Max characters per paragraph line to prevent overflow in the fixed-size card.
// At 13px, the card's text column (~343px wide) fits ~24 Chinese chars per line.
// Capped at 48 chars ≈ 2 display lines per paragraph → 3 paras ≈ 6 lines → safe.
const MAX_PARA_CHARS = 48

export default function ImprintCard({
  nickname, avatarUrl, photo, title, narrative, cityNameZh, countryZh, flag, cityBgColor = '#ede8df', qrValue
}: ImprintCardProps) {
  const body = getBodyText(narrative, title)
  const rawParas = body.split('\n').filter(p => p.trim())
  const paras = rawParas.slice(0, 3).map((p, i, arr) => {
    const isLast = i === arr.length - 1
    const hasMoreParas = rawParas.length > 3
    if (p.length > MAX_PARA_CHARS) {
      return p.slice(0, MAX_PARA_CHARS - 1) + '…'
    }
    if (isLast && hasMoreParas) return p + '…'
    return p
  })

  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl} qrValue={qrValue}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
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

        {/* Title — single line, no wrap */}
        {title && (
          <div style={{
            fontSize: 15, fontWeight: 700, color: '#3d3020', lineHeight: 1.35, marginBottom: 8,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            flexShrink: 0,
          }}>{title}</div>
        )}

        {/* Body paragraphs — character-limited, no CSS clipping */}
        <div style={{ fontSize: 13, color: '#5a4a38', lineHeight: 1.8, marginBottom: 10 }}>
          {paras.map((p, i) => (
            <div key={i}>{p}</div>
          ))}
        </div>

        {/* Location — always fully visible */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#8a7560', flexShrink: 0 }}>
          {flag && <span>{flag}</span>}
          <span>{cityNameZh}{countryZh ? ` · ${countryZh}` : ''}</span>
        </div>
      </div>
    </CardShell>
  )
}
