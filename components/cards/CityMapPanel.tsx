'use client'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

function fmtCoord(val: number, pos: string, neg: string) {
  const abs = Math.abs(val)
  const d = Math.floor(abs)
  const m = Math.floor((abs - d) * 60)
  return `${String(d).padStart(2, '0')}°${String(m).padStart(2, '0')}'${val >= 0 ? pos : neg}`
}

interface CityMapPanelProps {
  lat: number
  lon: number
  cityNameZh: string
}

export default function CityMapPanel({ lat, lon, cityNameZh }: CityMapPanelProps) {
  return (
    <>
      <ComposableMap
        projection="geoOrthographic"
        projectionConfig={{ scale: 150, rotate: [-lon, -lat, 0] }}
        width={331}
        height={130}
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
    </>
  )
}
