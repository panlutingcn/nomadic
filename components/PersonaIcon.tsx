// Warm-tone SVG persona icons — designed to match the illustrated badge style
// Color palette: tan #c8a870 / cream #dcc48a / brown #a08050 / deep #7a5e30

const C1 = '#c8a870'  // main
const C2 = '#dcc48a'  // lighter / columns
const C3 = '#a08050'  // darker / depth
const C4 = '#7a5e30'  // deep detail

interface PersonaIconProps {
  personaKey: string
  size?: number
}

export default function PersonaIcon({ personaKey, size = 56 }: PersonaIconProps) {
  const svgProps = { width: size, height: size, viewBox: '0 0 48 48', fill: 'none' }

  switch (personaKey) {

    // 城市考古学家 — Greek temple
    case 'SCLP': return (
      <svg {...svgProps}>
        <polygon points="24,5 4,17 44,17" fill={C1}/>
        <rect x="4" y="16" width="40" height="5" rx="1" fill={C1}/>
        <rect x="7" y="21" width="5" height="15" rx="2" fill={C2}/>
        <rect x="14.5" y="21" width="5" height="15" rx="2" fill={C2}/>
        <rect x="22" y="21" width="5" height="15" rx="2" fill={C2}/>
        <rect x="29.5" y="21" width="5" height="15" rx="2" fill={C2}/>
        <rect x="37" y="21" width="5" height="15" rx="2" fill={C2}/>
        <rect x="4" y="36" width="40" height="4" rx="1" fill={C1}/>
        <rect x="2" y="40" width="44" height="3" rx="1" fill={C3}/>
      </svg>
    )

    // 街头漫游者 — Boot sole + heel
    case 'SCLF': return (
      <svg {...svgProps}>
        <path d="M12 8 L12 30 Q12 36 18 37 L38 38 Q42 38 42 34 L42 32 Q42 29 38 29 L22 28 L22 8 Q22 6 17 6 Q12 6 12 8Z" fill={C1}/>
        <path d="M14 30 Q14 35 19 36 L36 37 Q40 37 40 33 L40 32 Q40 30 37 30 L22 29.5" fill={C2}/>
        <rect x="12" y="6" width="10" height="4" rx="2" fill={C3}/>
      </svg>
    )

    // 文化外交官 — Globe with meridians
    case 'SCTP': return (
      <svg {...svgProps}>
        <circle cx="24" cy="24" r="18" fill={C2}/>
        <ellipse cx="24" cy="24" rx="9" ry="18" fill={C1}/>
        <line x1="6" y1="24" x2="42" y2="24" stroke={C3} strokeWidth="1.5"/>
        <line x1="24" y1="6" x2="24" y2="42" stroke={C3} strokeWidth="1.5"/>
        <path d="M9 16 Q24 19 39 16" stroke={C3} strokeWidth="1.2" fill="none"/>
        <path d="M9 32 Q24 29 39 32" stroke={C3} strokeWidth="1.2" fill="none"/>
        <circle cx="24" cy="24" r="18" stroke={C3} strokeWidth="1.5" fill="none"/>
      </svg>
    )

    // 本地混入者 — Theater masks
    case 'SCTF': return (
      <svg {...svgProps}>
        <circle cx="18" cy="22" r="13" fill={C2}/>
        <path d="M12 27 Q18 32 24 27" stroke={C3} strokeWidth="2" strokeLinecap="round" fill="none"/>
        <circle cx="14" cy="19" r="2" fill={C3}/>
        <circle cx="22" cy="19" r="2" fill={C3}/>
        <circle cx="30" cy="21" r="13" fill={C1}/>
        <path d="M24 29 Q30 24 36 29" stroke={C3} strokeWidth="2" strokeLinecap="round" fill="none"/>
        <circle cx="26" cy="18" r="2" fill={C3}/>
        <circle cx="34" cy="18" r="2" fill={C3}/>
      </svg>
    )

    // 自然驻守者 — Leaf with veins
    case 'SVLP': return (
      <svg {...svgProps}>
        <path d="M24 6 Q38 10 40 24 Q38 38 24 42 Q10 38 8 24 Q10 10 24 6Z" fill={C1}/>
        <path d="M24 42 L24 6" stroke={C2} strokeWidth="2" strokeLinecap="round"/>
        <path d="M24 18 Q32 16 36 20" stroke={C2} strokeWidth="1.5" fill="none"/>
        <path d="M24 24 Q32 22 38 26" stroke={C2} strokeWidth="1.5" fill="none"/>
        <path d="M24 18 Q16 16 12 20" stroke={C2} strokeWidth="1.5" fill="none"/>
        <path d="M24 24 Q16 22 10 26" stroke={C2} strokeWidth="1.5" fill="none"/>
      </svg>
    )

    // 野地隐士 — Pine tree
    case 'SVLF': return (
      <svg {...svgProps}>
        <polygon points="24,5 6,22 14,22 8,32 17,32 11,42 37,42 31,32 40,32 34,22 42,22" fill={C1}/>
        <polygon points="24,5 8,22 40,22" fill={C2}/>
        <polygon points="24,16 9,32 39,32" fill={C1}/>
        <polygon points="24,26 11,42 37,42" fill={C2}/>
        <rect x="21" y="40" width="6" height="5" rx="1" fill={C3}/>
      </svg>
    )

    // 探险组织者 — Mountain peak with flag
    case 'SVTP': return (
      <svg {...svgProps}>
        <polygon points="24,5 4,42 44,42" fill={C1}/>
        <polygon points="24,5 14,28 34,28" fill={C2}/>
        <rect x="22" y="4" width="2" height="12" rx="1" fill={C4}/>
        <polygon points="24,4 24,10 31,7" fill={C3}/>
        <path d="M10 42 Q12 35 16 38 Q20 40 22 34" stroke={C3} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    )

    // 即兴探险家 — Wave with board
    case 'SVTF': return (
      <svg {...svgProps}>
        <path d="M4 28 Q10 20 16 26 Q22 32 28 24 Q34 16 44 22 L44 38 Q34 30 28 36 Q22 42 16 36 Q10 30 4 38Z" fill={C1}/>
        <path d="M4 20 Q10 12 16 18 Q22 24 28 16 Q34 8 44 14" stroke={C2} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <rect x="20" y="8" width="8" height="22" rx="4" fill={C3} transform="rotate(25 24 19)"/>
        <rect x="22" y="8" width="4" height="22" rx="2" fill={C2} transform="rotate(25 24 19)"/>
      </svg>
    )

    // 精准漂流者 — Suitcase with sticker
    case 'DCLP': return (
      <svg {...svgProps}>
        <rect x="6" y="14" width="36" height="28" rx="4" fill={C1}/>
        <rect x="6" y="14" width="36" height="8" rx="4" fill={C3}/>
        <rect x="17" y="8" width="14" height="8" rx="3" stroke={C1} strokeWidth="2.5" fill="none"/>
        <line x1="6" y1="26" x2="42" y2="26" stroke={C3} strokeWidth="1.5"/>
        <rect x="12" y="30" width="10" height="7" rx="2" fill={C2}/>
        <line x1="24" y1="14" x2="24" y2="42" stroke={C2} strokeWidth="1.5"/>
      </svg>
    )

    // 文化拾荒者 — Artist palette
    case 'DCLF': return (
      <svg {...svgProps}>
        <path d="M8 24 Q6 10 18 7 Q30 4 38 14 Q46 24 38 32 Q34 36 30 34 Q26 32 28 28 Q30 22 24 22 Q18 22 16 28 Q12 36 8 34 Q4 32 8 24Z" fill={C1}/>
        <circle cx="16" cy="13" r="3" fill={C3}/>
        <circle cx="26" cy="9" r="3" fill={C2}/>
        <circle cx="35" cy="14" r="3" fill={C3}/>
        <circle cx="38" cy="24" r="3" fill={C2}/>
        <circle cx="23" cy="25" r="4" fill={C4}/>
      </svg>
    )

    // 游民外交家 — Compass
    case 'DCTP': return (
      <svg {...svgProps}>
        <circle cx="24" cy="24" r="19" fill={C2}/>
        <circle cx="24" cy="24" r="15" fill={C1}/>
        <circle cx="24" cy="24" r="3" fill={C4}/>
        <polygon points="24,8 21,24 24,20 27,24" fill={C4}/>
        <polygon points="24,40 21,24 24,28 27,24" fill={C3}/>
        <polygon points="8,24 24,21 20,24 24,27" fill={C3}/>
        <polygon points="40,24 24,21 28,24 24,27" fill={C3}/>
        <text x="24" y="7" textAnchor="middle" fontSize="5" fill={C4} fontWeight="bold">N</text>
      </svg>
    )

    // 灵魂冲浪者 — Triple waves
    case 'DCTF': return (
      <svg {...svgProps}>
        <path d="M4 16 Q10 9 16 14 Q22 19 28 12 Q34 5 44 11 L44 19 Q34 13 28 20 Q22 27 16 22 Q10 17 4 24Z" fill={C2}/>
        <path d="M4 26 Q10 19 16 24 Q22 29 28 22 Q34 15 44 21 L44 29 Q34 23 28 30 Q22 37 16 32 Q10 27 4 34Z" fill={C1}/>
        <path d="M4 36 Q10 29 16 34 Q22 39 28 32 Q34 25 44 31 L44 39 Q34 33 28 40 Q22 47 16 42 Q10 37 4 44Z" fill={C3}/>
      </svg>
    )

    // 地平线猎人 — Sunrise over mountains
    case 'DVLP': return (
      <svg {...svgProps}>
        <line x1="4" y1="30" x2="44" y2="30" stroke={C3} strokeWidth="2"/>
        <path d="M8 30 L16 16 L24 26 L30 14 L44 30Z" fill={C2}/>
        <path d="M24 30 A12 12 0 0 1 12 30" fill={C1} stroke="none"/>
        <path d="M12 30 A12 12 0 0 1 36 30" fill={C1} stroke="none"/>
        <line x1="24" y1="18" x2="24" y2="14" stroke={C1} strokeWidth="2" strokeLinecap="round"/>
        <line x1="24" y1="18" x2="29" y2="20" stroke={C1} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="24" y1="18" x2="19" y2="20" stroke={C1} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="24" y1="18" x2="32" y2="16" stroke={C1} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="24" y1="18" x2="16" y2="16" stroke={C1} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="24" cy="30" r="9" fill={C1}/>
        <path d="M15 30 A9 9 0 0 1 33 30" fill={C2}/>
      </svg>
    )

    // 风的跟随者 — Kite with ribbons
    case 'DVLF': return (
      <svg {...svgProps}>
        <polygon points="24,5 36,22 24,39 12,22" fill={C1}/>
        <line x1="24" y1="5" x2="24" y2="39" stroke={C2} strokeWidth="1.5"/>
        <line x1="12" y1="22" x2="36" y2="22" stroke={C2} strokeWidth="1.5"/>
        <line x1="24" y1="39" x2="20" y2="44" stroke={C3} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="20" y1="44" x2="28" y2="46" stroke={C3} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="24" cy="22" r="3" fill={C3}/>
      </svg>
    )

    // 部落探险队 — Three mountain peaks
    case 'DVTP': return (
      <svg {...svgProps}>
        <polygon points="24,5 8,40 40,40" fill={C1}/>
        <polygon points="38,12 26,40 48,40" fill={C2}/>
        <polygon points="10,12 0,40 22,40" fill={C2}/>
        <polygon points="24,5 16,26 32,26" fill={C3}/>
        <polygon points="38,12 32,28 44,28" fill={C3}/>
        <polygon points="10,12 4,28 16,28" fill={C3}/>
      </svg>
    )

    // 自由漩涡 — Pinwheel
    case 'DVTF': return (
      <svg {...svgProps}>
        <path d="M24 24 Q18 8 24 6 Q32 4 30 14 Q28 20 24 24Z" fill={C1}/>
        <path d="M24 24 Q40 18 42 24 Q44 32 34 30 Q28 28 24 24Z" fill={C2}/>
        <path d="M24 24 Q30 40 24 42 Q16 44 18 34 Q20 28 24 24Z" fill={C1}/>
        <path d="M24 24 Q8 30 6 24 Q4 16 14 18 Q20 20 24 24Z" fill={C2}/>
        <circle cx="24" cy="24" r="4" fill={C3}/>
        <circle cx="24" cy="24" r="2" fill={C4}/>
      </svg>
    )

    // Fallback
    default: return (
      <svg {...svgProps}>
        <circle cx="24" cy="24" r="18" fill={C1}/>
        <text x="24" y="30" textAnchor="middle" fontSize="18" fill={C4}>?</text>
      </svg>
    )
  }
}
