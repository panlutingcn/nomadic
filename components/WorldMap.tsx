'use client'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { CITY_COORDS } from '@/data/cityCoords'
import { NOMAD_CITY_POOL, PINNED_CITIES } from '@/data/nomadCities'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const CITY_ZH: Record<string, string> = Object.fromEntries(
  [...PINNED_CITIES, ...NOMAD_CITY_POOL].map(c => [c.en, c.zh])
)
CITY_ZH['Bangkok'] = '曼谷'

interface WorldMapProps {
  cities: string[]
  onCityClick: (city: string) => void
}

export default function WorldMap({ cities, onCityClick }: WorldMapProps) {
  const dots = cities
    .map((en, i) => ({ en, zh: CITY_ZH[en] ?? en, coords: CITY_COORDS[en], isFirst: i === 0 }))
    .filter(d => d.coords != null)

  return (
    <ComposableMap
      projection="geoNaturalEarth1"
      projectionConfig={{ scale: 120, center: [20, 40] }}
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
                hover:   { outline: 'none', fill: '#ede8df' },
                pressed: { outline: 'none' },
              }}
            />
          ))
        }
      </Geographies>
      {dots.map(({ en, zh, coords, isFirst }) => (
        <Marker
          key={en}
          coordinates={coords}
          onClick={() => onCityClick(en)}
        >
          <g style={{ cursor: 'pointer' }}>
            <circle r={isFirst ? 4 : 3} fill="#178f68" opacity={0.9} />
            <circle r={isFirst ? 9 : 6} fill="#178f68" opacity={0.12} />
            <text
              textAnchor="middle"
              y={11}
              style={{ fontSize: 5, fill: '#178f68', fontWeight: isFirst ? 600 : 400, pointerEvents: 'none' }}
            >
              {zh}
            </text>
          </g>
        </Marker>
      ))}
    </ComposableMap>
  )
}
