'use client'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import CardShell from './CardShell'
import { CITY_COORDS } from '@/data/cityCoords'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

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

function fmtCoord(val: number, pos: string, neg: string) {
  const abs = Math.abs(val)
  const d = Math.floor(abs)
  const m = Math.floor((abs - d) * 60)
  return `${String(d).padStart(2, '0')}°${String(m).padStart(2, '0')}'${val >= 0 ? pos : neg}`
}

export default function CityCard({
  nickname, avatarUrl, cityNameZh, cityNameEn, countryZh, flag,
  description, personality, economy, qrValue, cityKey,
}: CityCardProps) {
  const coords = cityKey ? CITY_COORDS[cityKey] : null
  const [lon, lat] = coords ?? [0, 0]
  const hasCoords = !!coords

  const raw1 = personality || description
  const raw2 = economy ?? ''
  const p1 = raw1.length > 80 ? raw1.slice(0, 80) + '…' : raw1
  const p2 = raw2.length > 80 ? raw2.slice(0, 80) + '…' : raw2

  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl} qrValue={qrValue}>
      <div>
        {/* Globe map panel */}
        {hasCoords && (
          <div style={{
            width: '100%', height: 160, borderRadius: 10, overflow: 'hidden',
            background: '#e8f4f0', marginBottom: 14, position: 'relative',
          }}>
            <ComposableMap
              projection="geoOrthographic"
              projectionConfig={{ scale: 150, rotate: [-lon, -lat, 0] }}
              width={331}
              height={160}
              style={{ width: '100%', height: '100%' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#f0ebe0"
                      stroke="#d8cdb8"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>
              <Marker coordinates={[lon, lat]}>
                <circle r={10} fill="#1D9E75" opacity={0.15} />
                <circle r={5} fill="#1D9E75" opacity={0.9} />
                <circle r={2.2} fill="#ffffff" />
                <text
                  textAnchor="middle"
                  y={20}
                  style={{
                    fontSize: 9.5,
                    fill: '#0f6e56',
                    fontWeight: 700,
                    pointerEvents: 'none',
                    userSelect: 'none' as const,
                    fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
                  }}
                >
                  {cityNameZh}
                </text>
              </Marker>
            </ComposableMap>
            {/* Coordinates label */}
            <div style={{
              position: 'absolute', bottom: 8, right: 10,
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: 9, color: 'rgba(61,80,70,0.55)',
              lineHeight: 1.6, textAlign: 'right' as const, letterSpacing: 0.3,
              pointerEvents: 'none',
            }}>
              <div>{fmtCoord(lat, 'N', 'S')}</div>
              <div>{fmtCoord(lon, 'E', 'W')}</div>
            </div>
          </div>
        )}

        {/* City name + country */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, flexWrap: 'wrap' as const }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#3d3020', lineHeight: 1.2 }}>{cityNameZh || cityNameEn}</span>
          {cityNameZh && cityNameEn && cityNameZh !== cityNameEn && (
            <span style={{ fontSize: 13, color: '#8a7560' }}>{cityNameEn}</span>
          )}
        </div>
        <div style={{ fontSize: 13, color: '#5a4a38', marginBottom: 12 }}>
          {flag} {countryZh}
        </div>
        <div style={{ height: '0.5px', background: 'rgba(61,48,32,0.15)', marginBottom: 12 }} />

        {/* 文化内核 */}
        <div style={{ fontSize: 12.5, color: '#5a4a38', lineHeight: 1.85, marginBottom: 10 }}>{p1}</div>

        {/* 经济支柱 */}
        {p2 && <div style={{ fontSize: 12.5, color: '#5a4a38', lineHeight: 1.85 }}>{p2}</div>}
      </div>
    </CardShell>
  )
}
