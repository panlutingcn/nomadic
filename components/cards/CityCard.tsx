'use client'
import dynamic from 'next/dynamic'
import CardShell from './CardShell'
import { CITY_COORDS } from '@/data/cityCoords'

const CityMapPanel = dynamic(() => import('./CityMapPanel'), { ssr: false })

interface CityCardProps {
  nickname: string
  avatarUrl: string | null
  cityNameZh: string
  cityNameEn: string
  countryZh: string
  flag: string
  description: string
  personality?: string
  economy?: string
  qrValue?: string
  cityKey?: string
}

export default function CityCard({
  nickname, avatarUrl, cityNameZh, cityNameEn, countryZh, flag,
  description, personality, economy, qrValue, cityKey,
}: CityCardProps) {
  const coords = cityKey ? CITY_COORDS[cityKey] : null
  const [lon, lat] = coords ?? [0, 0]
  const hasCoords = !!coords

  const p1 = personality || description
  const p2 = economy ?? ''

  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl} qrValue={qrValue}>
      <div>
        {hasCoords && (
          <div style={{
            width: '100%', height: 130, borderRadius: 10, overflow: 'hidden',
            background: '#e8f4f0', marginBottom: 10, position: 'relative',
          }}>
            <CityMapPanel lat={lat} lon={lon} cityNameZh={cityNameZh} />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, flexWrap: 'wrap' as const }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#3d3020', lineHeight: 1.2 }}>{cityNameZh || cityNameEn}</span>
          {cityNameZh && cityNameEn && cityNameZh !== cityNameEn && (
            <span style={{ fontSize: 13, color: '#8a7560' }}>{cityNameEn}</span>
          )}
        </div>
        <div style={{ fontSize: 13, color: '#5a4a38', marginBottom: 8 }}>
          {flag} {countryZh}
        </div>
        <div style={{ height: '0.5px', background: 'rgba(61,48,32,0.15)', marginBottom: 10 }} />

        <div style={{ fontSize: 12.5, color: '#5a4a38', lineHeight: 1.75, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{p1}</div>

        {p2 && <div style={{ fontSize: 12.5, color: '#5a4a38', lineHeight: 1.75, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{p2}</div>}
      </div>
    </CardShell>
  )
}
