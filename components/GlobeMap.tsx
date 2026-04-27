'use client'
import { useEffect, useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { CITY_COORDS } from '@/data/cityCoords'
import { NOMAD_CITY_POOL, PINNED_CITIES } from '@/data/nomadCities'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const CITY_ZH: Record<string, string> = Object.fromEntries(
  [...PINNED_CITIES, ...NOMAD_CITY_POOL].map(c => [c.en, c.zh])
)
CITY_ZH['Bangkok'] = '曼谷'

interface GlobeMapProps {
  cities: string[]
  onCityClick: (city: string) => void
}

export default function GlobeMap({ cities, onCityClick }: GlobeMapProps) {
  const [lon, setLon] = useState(0)
  const rafRef = useRef<number>(0)
  const pausedRef = useRef(false)
  const lonRef = useRef(0)

  useEffect(() => {
    const animate = () => {
      if (!pausedRef.current) {
        lonRef.current = (lonRef.current + 0.08) % 360
        setLon(lonRef.current)
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const dots = cities
    .map((en, i) => ({ en, zh: CITY_ZH[en] ?? en, coords: CITY_COORDS[en], isFirst: i === 0 }))
    .filter(d => d.coords != null)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: '#e8f4f0',
        overflow: 'hidden',
      }}
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <ComposableMap
        projection="geoOrthographic"
        projectionConfig={{ scale: 80, rotate: [-lon, -20, 0] }}
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
                  hover: { outline: 'none', fill: '#ede8df' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
        {dots.map(({ en, zh, coords, isFirst }) => (
          <Marker key={en} coordinates={coords} onClick={() => onCityClick(en)}>
            <g style={{ cursor: 'pointer' }}>
              <circle r={isFirst ? 4 : 3} fill="#1D9E75" opacity={0.9} />
              <circle r={isFirst ? 9 : 6} fill="#1D9E75" opacity={0.15} />
              <text
                textAnchor="middle"
                y={12}
                style={{ fontSize: 6, fill: '#1D9E75', fontWeight: isFirst ? 600 : 400, pointerEvents: 'none' }}
              >
                {zh}
              </text>
            </g>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  )
}
