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

export default function ImprintCard({
  nickname, avatarUrl, photo, title, narrative, cityNameZh, countryZh, flag, cityBgColor = '#ede8df', qrValue
}: ImprintCardProps) {

  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl} qrValue={qrValue}>
      <div>
        <div style={{
          width: '100%', height: 150, borderRadius: 10, overflow: 'hidden', marginBottom: 12,
          background: photo ? `center / cover no-repeat url(${photo})` : cityBgColor,
          display: photo ? undefined : 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: 'rgba(61,48,32,0.4)',
        }}>
          {!photo && cityNameZh}
        </div>
        {title && (
          <div style={{ fontSize: 15, fontWeight: 700, color: '#3d3020', lineHeight: 1.3, marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        )}
        {(() => {
          const body = getBodyText(narrative, title)
          const paras = body.split('\n').filter(p => p.trim())
          const shown = paras.slice(0, 3)
          const hasMore = paras.length > 3
          return (
            <div style={{ fontSize: 13, color: '#5a4a38', lineHeight: 1.8, marginBottom: 10 }}>
              {shown.map((p, i) => (
                <div key={i}>{p}{hasMore && i === shown.length - 1 ? '…' : ''}</div>
              ))}
            </div>
          )
        })()}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#8a7560' }}>
          {flag && <span>{flag}</span>}
          <span>{cityNameZh}{countryZh ? ` · ${countryZh}` : ''}</span>
        </div>
      </div>
    </CardShell>
  )
}
