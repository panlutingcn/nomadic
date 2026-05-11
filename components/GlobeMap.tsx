'use client'
import { useEffect, useRef, useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { CITY_COORDS } from '@/data/cityCoords'
import { NOMAD_CITY_POOL, PINNED_CITIES } from '@/data/nomadCities'
import { COUNTRY_CENTROIDS } from '@/data/countryCentroids'
import { OCEAN_LABELS } from '@/data/oceanLabels'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const CITY_ZH: Record<string, string> = Object.fromEntries(
  [...PINNED_CITIES, ...NOMAD_CITY_POOL].map(c => [c.en, c.zh])
)
CITY_ZH['Bangkok'] = '曼谷'

interface GlobeMapProps {
  cities: string[]
  onCityClick: (city: string) => void
  scale?: number
}

// Returns > 0 if city is on the visible hemisphere facing the camera
function frontFaceDot(cityLon: number, cityLat: number, camLon: number, camLat: number): number {
  const r = Math.PI / 180
  return (
    Math.sin(cityLat * r) * Math.sin(camLat * r) +
    Math.cos(cityLat * r) * Math.cos(camLat * r) * Math.cos((cityLon - camLon) * r)
  )
}

export default function GlobeMap({ cities, onCityClick, scale = 150 }: GlobeMapProps) {
  const [rotate, setRotate] = useState<[number, number, number]>([0, -30, 0])
  const [dir, setDir] = useState(1) // 1 = rightward, -1 = leftward
  const rafRef = useRef<number | null>(null)
  const pausedRef = useRef(false)
  const lonRef = useRef(0)
  const frameRef = useRef(0)
  const dirRef = useRef(1)

  const setDirection = (d: number) => { dirRef.current = d; setDir(d) }

  const dots = useMemo(() =>
    cities
      .map((en, i) => ({ en, zh: CITY_ZH[en] ?? en, coords: CITY_COORDS[en], isFirst: i === 0 }))
      .filter((d): d is typeof d & { coords: [number, number] } => d.coords != null),
    [cities]
  )

  // Decide tilt strategy based on where imprints are
  const { fixedTilt, oscillate } = useMemo(() => {
    if (dots.length === 0) return { fixedTilt: -30, oscillate: false }
    const northCount = dots.filter(d => d.coords[1] > 0).length
    const southCount = dots.filter(d => d.coords[1] <= 0).length
    if (northCount >= southCount * 2) return { fixedTilt: -40, oscillate: false }
    if (southCount >= northCount * 2) return { fixedTilt: 40, oscillate: false }
    return { fixedTilt: 0, oscillate: true }
  }, [dots])

  useEffect(() => {
    const animate = () => {
      if (!pausedRef.current) {
        lonRef.current = ((lonRef.current + 0.08 * dirRef.current) % 360 + 360) % 360
        frameRef.current += 1
        // oscillate lat between -40° and +40° over ~20s (1200 frames at 60fps)
        const lat = oscillate
          ? -40 * Math.sin(frameRef.current * 2 * Math.PI / 1200)
          : fixedTilt
        setRotate([-lonRef.current, lat, 0])
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current) }
  }, [fixedTilt, oscillate])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div
        style={{ width: '100%', height: '100%', background: '#e8f4f0', overflow: 'hidden' }}
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}
      >
      <ComposableMap
        projection="geoOrthographic"
        projectionConfig={{ scale, rotate }}
        width={300}
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
                  hover: { outline: 'none', fill: '#ede8df' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
        {OCEAN_LABELS.map(({ zh, coords }) => {
          if (frontFaceDot(coords[0], coords[1], -rotate[0], -rotate[1]) <= 0.2) return null
          return (
            <Marker key={zh} coordinates={coords}>
              <text
                textAnchor="middle"
                style={{ fontSize: 7, fill: '#a8c4d4', fontWeight: 300, fontStyle: 'italic', pointerEvents: 'none', userSelect: 'none', letterSpacing: 1 }}
              >
                {zh}
              </text>
            </Marker>
          )
        })}
        {COUNTRY_CENTROIDS.map(({ zh, coords }) => {
          // hide labels near the limb (dot < 0.15) to avoid distortion at the edge
          if (frontFaceDot(coords[0], coords[1], -rotate[0], -rotate[1]) <= 0.15) return null
          return (
            <Marker key={zh} coordinates={coords}>
              <text
                textAnchor="middle"
                style={{ fontSize: 6, fill: '#b8a98a', fontWeight: 400, pointerEvents: 'none', userSelect: 'none' }}
              >
                {zh}
              </text>
            </Marker>
          )
        })}
        {dots.map(({ en, zh, coords, isFirst }) => {
          // camera looks at (lon, lat) = (-rotate[0], -rotate[1])
          if (frontFaceDot(coords[0], coords[1], -rotate[0], -rotate[1]) <= 0) return null
          return (
            <Marker key={en} coordinates={coords} onClick={() => onCityClick(en)}>
              <g style={{ cursor: 'pointer' }}>
                <circle r={isFirst ? 4 : 3} fill="#1D9E75" opacity={0.9} />
                <circle r={isFirst ? 9 : 6} fill="#1D9E75" opacity={0.15} />
                <text
                  textAnchor="middle"
                  y={14}
                  style={{ fontSize: 8, fill: '#1D9E75', fontWeight: isFirst ? 600 : 400, pointerEvents: 'none' }}
                >
                  {zh}
                </text>
              </g>
            </Marker>
          )
        })}
      </ComposableMap>
      </div>
      {/* Left arrow */}
      <button
        onClick={() => setDirection(-1)}
        style={{
          position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)',
          width: 22, height: 22, borderRadius: '50%', border: 'none',
          background: dir === -1 ? 'rgba(29,158,117,0.18)' : 'rgba(255,255,255,0.55)',
          color: dir === -1 ? '#1D9E75' : '#8a7a62',
          fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 10, lineHeight: 1,
          boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
          transition: 'background 150ms ease, color 150ms ease',
        }}
      >‹</button>
      {/* Right arrow */}
      <button
        onClick={() => setDirection(1)}
        style={{
          position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
          width: 22, height: 22, borderRadius: '50%', border: 'none',
          background: dir === 1 ? 'rgba(29,158,117,0.18)' : 'rgba(255,255,255,0.55)',
          color: dir === 1 ? '#1D9E75' : '#8a7a62',
          fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 10, lineHeight: 1,
          boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
          transition: 'background 150ms ease, color 150ms ease',
        }}
      >›</button>
    </div>
  )
}
