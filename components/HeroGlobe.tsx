'use client'
import { useEffect, useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

// land-110m has merged continent outlines only (no country borders) → cleaner sketch look
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json'

export default function HeroGlobe({ size = 200 }: { size?: number }) {
  const [lon, setLon] = useState(20) // start with Africa/Europe visible (like logo)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current
      setLon(20 + elapsed * 0.012) // full 360° in ~30s
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current) }
  }, [])

  const scale = size * 0.46
  const cx = size / 2
  const cy = size / 2

  return (
    <ComposableMap
      projection="geoOrthographic"
      projectionConfig={{ rotate: [-(lon % 360), -20, 0], scale }}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    >
      {/* Globe border circle */}
      <circle cx={cx} cy={cy} r={scale} fill="none" stroke="#166b4c" strokeWidth="2" opacity="0.9" />
      {/* Ocean background — very faint so lines stay visible */}
      <circle cx={cx} cy={cy} r={scale} fill="#166b4c" fillOpacity="0.03" />
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="none"
              stroke="#166b4c"
              strokeWidth={1.4}
              style={{
                default: { outline: 'none' },
                hover: { outline: 'none' },
                pressed: { outline: 'none' },
              }}
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  )
}
