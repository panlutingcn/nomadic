'use client'
export const dynamic = 'force-static'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import SearchBox, { SearchBoxHandle } from '@/components/SearchBox'
import ErrorToast from '@/components/ErrorToast'
import ShareSheet from '@/components/ShareSheet'
import BrandCard from '@/components/cards/BrandCard'
import { useApp } from '@/context/AppContext'
import { useUserProfile } from '@/hooks/useUserProfile'
import { CITIES } from '@/data/cities'
import { PINNED_CITIES, NOMAD_CITY_POOL, NomadCity } from '@/data/nomadCities'
import { shuffle } from '@/utils/shuffle'

const RANDOM_COUNT = 9

export default function ExplorePage() {
  const router = useRouter()
  const { allPublicImprints } = useApp()
  const { nickname: profileNickname, avatarUrl: profileAvatar } = useUserProfile()
  const [errorMessage, setErrorMessage] = useState('')
  const [randomCities, setRandomCities] = useState<NomadCity[]>([])
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [shareAnchor, setShareAnchor] = useState<DOMRect | null>(null)
  const searchBoxRef = useRef<SearchBoxHandle>(null)
  const brandCardRef = useRef<HTMLDivElement>(null)

  const closeShare = useCallback(() => setShareAnchor(null), [])

  useEffect(() => {
    setRandomCities(shuffle(NOMAD_CITY_POOL).slice(0, RANDOM_COUNT))
  }, [])

  const handleCityClick = (city: NomadCity) => {
    router.push(`/search?q=${encodeURIComponent(city.zh)}`)
  }

  const handleRandomExplore = () => {
    const all = [...PINNED_CITIES, ...NOMAD_CITY_POOL]
    const pick = all[Math.floor(Math.random() * all.length)]
    searchBoxRef.current?.fill(pick.zh)
  }

  const displayCities: NomadCity[] = [...PINNED_CITIES, ...randomCities]
  const previewImprints = allPublicImprints.slice(0, 3)
  const photoBg: Record<string, string> = { Berlin: '#dde8d8', Lisbon: '#e8e2d8', Amsterdam: '#d8e0e8', Prague: '#e8e8ed', Florence: '#ede2d8' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '0 16px 10px' }}>

        {/* Hero */}
        <div style={{ position: 'relative', height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 12, overflow: 'visible' }}>
          {/* 分享按钮 — 右上角 */}
          <button
            onClick={e => setShareAnchor(e.currentTarget.getBoundingClientRect())}
            aria-label="分享"
            style={{ position: 'absolute', top: 16, right: 0, zIndex: 4, width: 32, height: 30, border: '0.5px solid var(--border-light)', borderRadius: 8, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: 'var(--text-secondary)', cursor: 'pointer' }}
          >⤴</button>
          <svg style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', overflow: 'visible', pointerEvents: 'none', zIndex: 1, opacity: 0.13 }} width="290" height="190" viewBox="0 0 290 190">
            <line className="tree-branch b0" x1="145" y1="162" x2="120" y2="182" stroke="#6b4520" strokeWidth="3.5" strokeLinecap="round"/>
            <line className="tree-branch b0" x1="145" y1="162" x2="170" y2="182" stroke="#6b4520" strokeWidth="3.5" strokeLinecap="round"/>
            <line className="tree-branch b0" x1="145" y1="165" x2="145" y2="188" stroke="#6b4520" strokeWidth="2.8" strokeLinecap="round"/>
            <line className="tree-branch b1" x1="120" y1="182" x2="100" y2="198" stroke="#7a5230" strokeWidth="2.4" strokeLinecap="round"/>
            <line className="tree-branch b1" x1="120" y1="182" x2="112" y2="202" stroke="#7a5230" strokeWidth="1.8" strokeLinecap="round"/>
            <line className="tree-branch b1" x1="170" y1="182" x2="190" y2="198" stroke="#7a5230" strokeWidth="2.4" strokeLinecap="round"/>
            <line className="tree-branch b1" x1="170" y1="182" x2="178" y2="202" stroke="#7a5230" strokeWidth="1.8" strokeLinecap="round"/>
            <line className="tree-branch b1" x1="145" y1="188" x2="130" y2="206" stroke="#7a5230" strokeWidth="1.8" strokeLinecap="round"/>
            <line className="tree-branch b1" x1="145" y1="188" x2="160" y2="206" stroke="#7a5230" strokeWidth="1.8" strokeLinecap="round"/>
            <line className="tree-branch b2" x1="100" y1="198" x2="82" y2="212" stroke="#8a6240" strokeWidth="1.5" strokeLinecap="round"/>
            <line className="tree-branch b2" x1="100" y1="198" x2="94" y2="216" stroke="#8a6240" strokeWidth="1.2" strokeLinecap="round"/>
            <line className="tree-branch b2" x1="190" y1="198" x2="208" y2="212" stroke="#8a6240" strokeWidth="1.5" strokeLinecap="round"/>
            <line className="tree-branch b2" x1="190" y1="198" x2="196" y2="216" stroke="#8a6240" strokeWidth="1.2" strokeLinecap="round"/>
            <line className="tree-branch b2" x1="130" y1="206" x2="118" y2="218" stroke="#8a6240" strokeWidth="1.2" strokeLinecap="round"/>
            <line className="tree-branch b2" x1="160" y1="206" x2="172" y2="218" stroke="#8a6240" strokeWidth="1.2" strokeLinecap="round"/>
            <line className="tree-branch b3" x1="82" y1="212" x2="66" y2="222" stroke="#9a7250" strokeWidth="1.0" strokeLinecap="round"/>
            <line className="tree-branch b3" x1="208" y1="212" x2="224" y2="222" stroke="#9a7250" strokeWidth="1.0" strokeLinecap="round"/>
            <line className="tree-branch b0" x1="145" y1="162" x2="144" y2="108" stroke="#6b4520" strokeWidth="13" strokeLinecap="round"/>
            <line className="tree-branch b0" x1="139" y1="155" x2="138" y2="114" stroke="#8a6030" strokeWidth="4" strokeLinecap="round"/>
            <line className="tree-branch b0" x1="151" y1="155" x2="152" y2="114" stroke="#4e3015" strokeWidth="2.5" strokeLinecap="round"/>
            <line className="tree-branch b1" x1="144" y1="120" x2="118" y2="86" stroke="#6b4520" strokeWidth="9" strokeLinecap="round"/>
            <line className="tree-branch b1" x1="144" y1="120" x2="170" y2="88" stroke="#6b4520" strokeWidth="9" strokeLinecap="round"/>
            <line className="tree-branch b2" x1="118" y1="96" x2="86" y2="72" stroke="#6b4520" strokeWidth="6.5" strokeLinecap="round"/>
            <line className="tree-branch b3" x1="86" y1="72" x2="54" y2="58" stroke="#6b4520" strokeWidth="4.5" strokeLinecap="round"/>
            <line className="tree-branch b4" x1="54" y1="58" x2="24" y2="50" stroke="#6b4520" strokeWidth="3.0" strokeLinecap="round"/>
            <line className="tree-branch b5" x1="24" y1="50" x2="6" y2="44" stroke="#6b4520" strokeWidth="2.0" strokeLinecap="round"/>
            <line className="tree-branch b4" x1="86" y1="72" x2="68" y2="50" stroke="#6b4520" strokeWidth="3.0" strokeLinecap="round"/>
            <line className="tree-branch b5" x1="68" y1="50" x2="54" y2="34" stroke="#6b4520" strokeWidth="2.0" strokeLinecap="round"/>
            <line className="tree-branch b6" x1="54" y1="34" x2="44" y2="22" stroke="#7a5230" strokeWidth="1.4" strokeLinecap="round"/>
            <line className="tree-branch b6" x1="54" y1="34" x2="60" y2="20" stroke="#7a5230" strokeWidth="1.3" strokeLinecap="round"/>
            <line className="tree-branch b5" x1="54" y1="58" x2="40" y2="40" stroke="#6b4520" strokeWidth="2.2" strokeLinecap="round"/>
            <line className="tree-branch b6" x1="40" y1="40" x2="28" y2="26" stroke="#7a5230" strokeWidth="1.5" strokeLinecap="round"/>
            <line className="tree-branch b7" x1="28" y1="26" x2="18" y2="16" stroke="#7a5230" strokeWidth="1.1" strokeLinecap="round"/>
            <line className="tree-branch b7" x1="28" y1="26" x2="32" y2="14" stroke="#7a5230" strokeWidth="1.0" strokeLinecap="round"/>
            <line className="tree-branch b6" x1="24" y1="50" x2="10" y2="36" stroke="#7a5230" strokeWidth="1.8" strokeLinecap="round"/>
            <line className="tree-branch b7" x1="10" y1="36" x2="2" y2="26" stroke="#7a5230" strokeWidth="1.2" strokeLinecap="round"/>
            <line className="tree-branch b2" x1="144" y1="108" x2="144" y2="62" stroke="#6b4520" strokeWidth="5.0" strokeLinecap="round"/>
            <line className="tree-branch b3" x1="144" y1="72" x2="128" y2="46" stroke="#6b4520" strokeWidth="3.0" strokeLinecap="round"/>
            <line className="tree-branch b4" x1="128" y1="46" x2="118" y2="28" stroke="#7a5230" strokeWidth="2.0" strokeLinecap="round"/>
            <line className="tree-branch b5" x1="118" y1="28" x2="110" y2="14" stroke="#7a5230" strokeWidth="1.4" strokeLinecap="round"/>
            <line className="tree-branch b4" x1="128" y1="46" x2="136" y2="26" stroke="#7a5230" strokeWidth="1.8" strokeLinecap="round"/>
            <line className="tree-branch b3" x1="144" y1="72" x2="160" y2="46" stroke="#6b4520" strokeWidth="3.0" strokeLinecap="round"/>
            <line className="tree-branch b4" x1="160" y1="46" x2="170" y2="28" stroke="#7a5230" strokeWidth="2.0" strokeLinecap="round"/>
            <line className="tree-branch b5" x1="170" y1="28" x2="178" y2="14" stroke="#7a5230" strokeWidth="1.4" strokeLinecap="round"/>
            <line className="tree-branch b4" x1="160" y1="46" x2="152" y2="26" stroke="#7a5230" strokeWidth="1.8" strokeLinecap="round"/>
            <line className="tree-branch b3" x1="144" y1="62" x2="144" y2="36" stroke="#7a5230" strokeWidth="2.2" strokeLinecap="round"/>
            <line className="tree-branch b5" x1="144" y1="36" x2="138" y2="18" stroke="#7a5230" strokeWidth="1.4" strokeLinecap="round"/>
            <line className="tree-branch b5" x1="144" y1="36" x2="150" y2="18" stroke="#7a5230" strokeWidth="1.4" strokeLinecap="round"/>
            <line className="tree-branch b2" x1="170" y1="96" x2="202" y2="72" stroke="#6b4520" strokeWidth="6.5" strokeLinecap="round"/>
            <line className="tree-branch b3" x1="202" y1="72" x2="234" y2="58" stroke="#6b4520" strokeWidth="4.5" strokeLinecap="round"/>
            <line className="tree-branch b4" x1="234" y1="58" x2="264" y2="50" stroke="#6b4520" strokeWidth="3.0" strokeLinecap="round"/>
            <line className="tree-branch b5" x1="264" y1="50" x2="282" y2="44" stroke="#6b4520" strokeWidth="2.0" strokeLinecap="round"/>
            <line className="tree-branch b4" x1="202" y1="72" x2="220" y2="50" stroke="#6b4520" strokeWidth="3.0" strokeLinecap="round"/>
            <line className="tree-branch b5" x1="220" y1="50" x2="234" y2="34" stroke="#6b4520" strokeWidth="2.0" strokeLinecap="round"/>
            <line className="tree-branch b6" x1="234" y1="34" x2="244" y2="22" stroke="#7a5230" strokeWidth="1.4" strokeLinecap="round"/>
            <line className="tree-branch b6" x1="234" y1="34" x2="228" y2="20" stroke="#7a5230" strokeWidth="1.3" strokeLinecap="round"/>
            <line className="tree-branch b5" x1="234" y1="58" x2="248" y2="40" stroke="#6b4520" strokeWidth="2.2" strokeLinecap="round"/>
            <line className="tree-branch b6" x1="248" y1="40" x2="260" y2="26" stroke="#7a5230" strokeWidth="1.5" strokeLinecap="round"/>
            <line className="tree-branch b7" x1="260" y1="26" x2="270" y2="16" stroke="#7a5230" strokeWidth="1.1" strokeLinecap="round"/>
            <line className="tree-branch b7" x1="260" y1="26" x2="256" y2="14" stroke="#7a5230" strokeWidth="1.0" strokeLinecap="round"/>
            <line className="tree-branch b6" x1="264" y1="50" x2="278" y2="36" stroke="#7a5230" strokeWidth="1.8" strokeLinecap="round"/>
            <line className="tree-branch b7" x1="278" y1="36" x2="286" y2="26" stroke="#7a5230" strokeWidth="1.2" strokeLinecap="round"/>
            <ellipse className="tree-leaf l1"  cx="8"   cy="82"  rx="14" ry="11" fill="#1D9E75"/>
            <ellipse className="tree-leaf l1"  cx="20"  cy="74"  rx="18" ry="14" fill="#1D9E75"/>
            <ellipse className="tree-leaf l2"  cx="6"   cy="94"  rx="10" ry="8"  fill="#0f6e56"/>
            <ellipse className="tree-leaf l2"  cx="32"  cy="72"  rx="16" ry="13" fill="#0f6e56"/>
            <ellipse className="tree-leaf l2"  cx="16"  cy="86"  rx="14" ry="11" fill="#1D9E75"/>
            <ellipse className="tree-leaf l3"  cx="22"  cy="64"  rx="15" ry="12" fill="#1D9E75"/>
            <ellipse className="tree-leaf l3"  cx="38"  cy="80"  rx="13" ry="10" fill="#1D9E75"/>
            <ellipse className="tree-leaf l4"  cx="46"  cy="62"  rx="20" ry="16" fill="#1D9E75"/>
            <ellipse className="tree-leaf l4"  cx="60"  cy="54"  rx="22" ry="17" fill="#1D9E75"/>
            <ellipse className="tree-leaf l5"  cx="40"  cy="76"  rx="15" ry="11" fill="#0f6e56"/>
            <ellipse className="tree-leaf l5"  cx="72"  cy="62"  rx="17" ry="13" fill="#0f6e56"/>
            <ellipse className="tree-leaf l5"  cx="54"  cy="72"  rx="16" ry="12" fill="#1D9E75"/>
            <ellipse className="tree-leaf l6"  cx="64"  cy="42"  rx="18" ry="14" fill="#1D9E75"/>
            <ellipse className="tree-leaf l6"  cx="78"  cy="50"  rx="16" ry="13" fill="#1D9E75"/>
            <ellipse className="tree-leaf l7"  cx="80"  cy="38"  rx="20" ry="16" fill="#1D9E75"/>
            <ellipse className="tree-leaf l7"  cx="96"  cy="26"  rx="22" ry="17" fill="#1D9E75"/>
            <ellipse className="tree-leaf l8"  cx="74"  cy="52"  rx="15" ry="12" fill="#0f6e56"/>
            <ellipse className="tree-leaf l8"  cx="108" cy="34"  rx="18" ry="14" fill="#0f6e56"/>
            <ellipse className="tree-leaf l8"  cx="90"  cy="46"  rx="16" ry="12" fill="#1D9E75"/>
            <ellipse className="tree-leaf l9"  cx="100" cy="18"  rx="18" ry="14" fill="#1D9E75"/>
            <ellipse className="tree-leaf l9"  cx="116" cy="22"  rx="16" ry="13" fill="#0f6e56"/>
            <ellipse className="tree-leaf l10" cx="122" cy="14"  rx="20" ry="16" fill="#1D9E75"/>
            <ellipse className="tree-leaf l10" cx="136" cy="6"   rx="22" ry="17" fill="#1D9E75"/>
            <ellipse className="tree-leaf l11" cx="145" cy="2"   rx="26" ry="18" fill="#1D9E75"/>
            <ellipse className="tree-leaf l11" cx="154" cy="6"   rx="22" ry="17" fill="#1D9E75"/>
            <ellipse className="tree-leaf l11" cx="168" cy="14"  rx="20" ry="16" fill="#1D9E75"/>
            <ellipse className="tree-leaf l12" cx="145" cy="20"  rx="24" ry="16" fill="#0f6e56"/>
            <ellipse className="tree-leaf l12" cx="130" cy="28"  rx="18" ry="14" fill="#0f6e56"/>
            <ellipse className="tree-leaf l12" cx="160" cy="28"  rx="18" ry="14" fill="#0f6e56"/>
            <ellipse className="tree-leaf l13" cx="145" cy="36"  rx="20" ry="13" fill="#1D9E75"/>
            <ellipse className="tree-leaf l8"  cx="182" cy="26"  rx="22" ry="17" fill="#1D9E75"/>
            <ellipse className="tree-leaf l8"  cx="198" cy="36"  rx="18" ry="14" fill="#0f6e56"/>
            <ellipse className="tree-leaf l9"  cx="174" cy="38"  rx="20" ry="16" fill="#1D9E75"/>
            <ellipse className="tree-leaf l9"  cx="208" cy="46"  rx="16" ry="12" fill="#1D9E75"/>
            <ellipse className="tree-leaf l9"  cx="188" cy="50"  rx="15" ry="12" fill="#0f6e56"/>
            <ellipse className="tree-leaf l10" cx="178" cy="22"  rx="16" ry="13" fill="#0f6e56"/>
            <ellipse className="tree-leaf l10" cx="196" cy="20"  rx="18" ry="14" fill="#1D9E75"/>
            <ellipse className="tree-leaf l5"  cx="216" cy="54"  rx="22" ry="17" fill="#1D9E75"/>
            <ellipse className="tree-leaf l6"  cx="230" cy="62"  rx="20" ry="16" fill="#1D9E75"/>
            <ellipse className="tree-leaf l6"  cx="210" cy="70"  rx="15" ry="11" fill="#0f6e56"/>
            <ellipse className="tree-leaf l6"  cx="224" cy="42"  rx="18" ry="14" fill="#1D9E75"/>
            <ellipse className="tree-leaf l7"  cx="238" cy="72"  rx="16" ry="12" fill="#1D9E75"/>
            <ellipse className="tree-leaf l7"  cx="244" cy="54"  rx="16" ry="13" fill="#0f6e56"/>
            <ellipse className="tree-leaf l14" cx="252" cy="62"  rx="20" ry="16" fill="#1D9E75"/>
            <ellipse className="tree-leaf l15" cx="266" cy="72"  rx="18" ry="14" fill="#1D9E75"/>
            <ellipse className="tree-leaf l16" cx="258" cy="78"  rx="16" ry="13" fill="#0f6e56"/>
            <ellipse className="tree-leaf l17" cx="274" cy="64"  rx="15" ry="12" fill="#1D9E75"/>
            <ellipse className="tree-leaf l17" cx="282" cy="74"  rx="13" ry="10" fill="#0f6e56"/>
            <ellipse className="tree-leaf l18" cx="268" cy="84"  rx="14" ry="11" fill="#1D9E75"/>
            <ellipse className="tree-leaf l18" cx="280" cy="86"  rx="10" ry="8"  fill="#0f6e56"/>
            <ellipse className="tree-leaf l19" cx="110" cy="44"  rx="22" ry="16" fill="#085041"/>
            <ellipse className="tree-leaf l20" cx="145" cy="48"  rx="28" ry="18" fill="#085041"/>
            <ellipse className="tree-leaf l21" cx="180" cy="44"  rx="22" ry="16" fill="#085041"/>
            <ellipse className="tree-leaf l22" cx="78"  cy="64"  rx="18" ry="13" fill="#085041"/>
            <ellipse className="tree-leaf l23" cx="214" cy="64"  rx="18" ry="13" fill="#085041"/>
            <ellipse className="tree-leaf l24" cx="145" cy="62"  rx="30" ry="16" fill="#0f6e56"/>
          </svg>
          <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '0.06em' }}>Nomadic</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#3d3020', marginTop: 6, lineHeight: 1.45 }}>在世界各地扎根，而不只是路过。</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>一个给数字游民的灵感与商机社区。</div>
          </div>
        </div>

        <SearchBox ref={searchBoxRef} onError={setErrorMessage} />

        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 8 }}>—— 你想去哪里 ——</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12, justifyContent: 'center' }}>
          {displayCities.map(city => (
            <button
              key={city.en}
              onClick={() => handleCityClick(city)}
              onMouseEnter={() => setHoveredCity(city.en)}
              onMouseLeave={() => setHoveredCity(null)}
              style={{
                fontSize: 11,
                padding: '5px 11px',
                borderRadius: 8,
                background: 'var(--accent-dim)',
                color: 'var(--accent-text)',
                border: `${hoveredCity === city.en ? '1.5px' : '0.5px'} solid var(--accent-border)`,
                cursor: 'pointer',
                fontWeight: hoveredCity === city.en ? 600 : 500,
                transform: hoveredCity === city.en ? 'scale(1.06)' : 'scale(1)',
                transition: 'all 120ms ease',
              }}
            >
              {city.zh}
            </button>
          ))}
          <button
            onClick={handleRandomExplore}
            onMouseEnter={() => setHoveredCity('__random__')}
            onMouseLeave={() => setHoveredCity(null)}
            style={{
              fontSize: 11, padding: '5px 11px', borderRadius: 8,
              background: 'var(--bg-card-2)', color: 'var(--text-secondary)',
              border: `${hoveredCity === '__random__' ? '1.5px' : '0.5px'} solid var(--border-light)`,
              cursor: 'pointer',
              fontWeight: hoveredCity === '__random__' ? 600 : 500,
              transform: hoveredCity === '__random__' ? 'scale(1.06)' : 'scale(1)',
              transition: 'all 120ms ease',
              animation: hoveredCity === '__random__' ? 'none' : 'pulse-random 2.4s ease-in-out infinite',
            }}
          >
            随机 🎲
          </button>
        </div>

        <div style={{ height: '0.5px', background: 'var(--border)', margin: '12px 0' }} />

        {/* 社区最新印迹 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>遇见社区 · 最新印迹</span>
          <button onClick={() => router.push('/meet')} style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>查看全部 ›</button>
        </div>
        {previewImprints.map(imp => (
          <div key={imp.id} onClick={() => router.push('/meet')}
            style={{ display: 'flex', background: 'var(--bg-card)', border: '0.5px solid var(--border-light)', borderRadius: 12, overflow: 'hidden', marginBottom: 8, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 72, height: 62, background: photoBg[imp.city] ?? '#dde8d8', flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {imp.photo
                ? <img src={imp.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 9, color: '#8a9870' }}>[ 图片 ]</span>
              }
              <span style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(245,240,232,0.9)', color: '#3d3020', fontSize: 9, fontWeight: 500, padding: '2px 6px', borderRadius: 5 }}>
                {CITIES[imp.city]?.nameZh || imp.city}
              </span>
            </div>
            <div style={{ padding: '8px 10px', flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3 }}>{imp.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.45, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{imp.narrative?.slice(0, 50)}…</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{imp.author ?? 'Nomadic 用户'}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>♡ {imp.likes ?? 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 32 }} />
      <BottomNav />
      {errorMessage && <ErrorToast onClose={() => setErrorMessage('')} />}

      {/* 隐藏的 BrandCard，用于 html2canvas 截图 */}
      <div style={{ position: 'absolute', left: -9999, top: 0, pointerEvents: 'none' }}>
        <div ref={brandCardRef}>
          <BrandCard nickname={profileNickname} avatarUrl={profileAvatar} />
        </div>
      </div>

      <ShareSheet
        anchorRect={shareAnchor}
        onClose={closeShare}
        cardRef={brandCardRef}
        showCopyLink={true}
        copyUrl="https://nomadictree.io"
      />
    </div>
  )
}
