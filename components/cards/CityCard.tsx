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
  lat?: number
  lon?: number
}

export default function CityCard({
  nickname, avatarUrl, cityNameZh, cityNameEn, countryZh, flag,
  description, personality, economy, qrValue, cityKey, lat: latProp, lon: lonProp,
}: CityCardProps) {
  const coords = cityKey ? CITY_COORDS[cityKey] : null
  const lon = coords ? coords[0] : (lonProp ?? 0)
  const lat = coords ? coords[1] : (latProp ?? 0)
  const hasCoords = !!(coords || (latProp && lonProp))

  const p1 = personality || description
  const p2 = economy ?? ''

  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl} qrValue={qrValue}>
      <div>
        {hasCoords && (
          <div style={{
            width: '100%', height: 110, borderRadius: 10, overflow: 'hidden',
            background: '#e8f4f0', marginBottom: 10, position: 'relative',
          }}>
            <CityMapPanel lat={lat} lon={lon} cityNameZh={cityNameZh} />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10, flexWrap: 'wrap' as const }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#3d3020', lineHeight: 1.2 }}>{cityNameZh || cityNameEn}</span>
          {cityNameZh && cityNameEn && cityNameZh !== cityNameEn && (
            <span style={{ fontSize: 13, color: '#8a7560' }}>{cityNameEn}</span>
          )}
        </div>
        <div style={{ fontSize: 13, color: '#5a4a38', marginBottom: 16 }}>
          {flag} {countryZh}
        </div>
        <div style={{ height: '0.5px', background: 'rgba(61,48,32,0.15)', marginBottom: 14 }} />

        <div style={{ fontSize: 12.5, color: '#5a4a38', lineHeight: 1.75, marginBottom: 8 }}>{p1}</div>

        {p2 && <div style={{ fontSize: 12.5, color: '#5a4a38', lineHeight: 1.75 }}>{p2}</div>}
      </div>
    </CardShell>
  )
}
