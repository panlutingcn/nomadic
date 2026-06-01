'use client'
export const runtime = 'edge'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PERSONAS } from '@/data/travelPersona'
import { CITIES } from '@/data/cities'
import BottomNav from '@/components/BottomNav'
import dynamicImport from 'next/dynamic'

const GlobeMap = dynamicImport(() => import('@/components/GlobeMap'), { ssr: false })

interface PublicImprint {
  id: string
  city: string
  title: string
  narrative: string
  tags: string[]
  createdAt: string
  photo?: string
  likes?: number
}

interface ProfileData {
  nickname: string | null
  avatarUrl: string | null
  personaKey: string | null
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = Array.isArray(params.id) ? params.id[0] : params.id
  const [profile, setProfile] = useState<ProfileData>({ nickname: null, avatarUrl: null, personaKey: null })
  const [publicImprints, setPublicImprints] = useState<PublicImprint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    Promise.all([
      supabase.from('profiles').select('nickname, avatar_url, persona_key').eq('id', userId).single(),
      supabase.from('imprints').select('id, city, title, narrative, tags, created_at, photo_url, likes')
        .eq('user_id', userId).eq('is_public', true).is('deleted_at', null)
        .order('created_at', { ascending: false }),
    ]).then(([{ data: prof }, { data: imps }]) => {
      setProfile({
        nickname: prof?.nickname ?? null,
        avatarUrl: prof?.avatar_url ?? null,
        personaKey: prof?.persona_key ?? null,
      })
      setPublicImprints((imps ?? []).map(r => ({
        id: r.id,
        city: r.city,
        title: r.title,
        narrative: r.narrative ?? '',
        tags: r.tags ?? [],
        createdAt: new Date(r.created_at).toLocaleDateString('zh-CN').replace(/\//g, '.'),
        photo: r.photo_url ?? undefined,
        likes: r.likes ?? 0,
      })))
      setLoading(false)
    })
  }, [userId])

  const persona = profile.personaKey ? PERSONAS[profile.personaKey] : null
  const imprintCities = Array.from(new Set(publicImprints.map(i => i.city))).slice(0, 8)
  const uniqueCountries = Array.from(new Set(imprintCities.map(c => CITIES[c]?.country || c))).length
  const displayName = profile.nickname ?? '游民'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, color: '#b8a98a' }}>加载中……</span>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px 0', flex: 1 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
          <button onClick={() => router.back()} style={{ fontSize: 11, color: '#8a7a62', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginRight: 12 }}>← 返回</button>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#2d2418' }}>游民主页</span>
        </div>

        {/* 用户信息栏 */}
        <div style={{ background: '#fff', border: '0.5px solid #e2d9c8', borderRadius: 16, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(29,158,117,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 500, color: '#1D9E75', flexShrink: 0, overflow: 'hidden' }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : displayName[0]?.toUpperCase() ?? 'N'
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#2d2418', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
            <div style={{ fontSize: 11, color: '#8a7a62', marginTop: 2 }}>{publicImprints.length} 个公开印迹 · {uniqueCountries} 个国家</div>
          </div>
        </div>

        {/* 旅行人格 */}
        {persona ? (
          <div style={{ background: '#faeeda', border: '0.5px solid #e8c98a', borderRadius: 13, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{persona.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#854f0b', marginBottom: 2 }}>旅行人格</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#633806' }}>{persona.name}</div>
              <div style={{ fontSize: 11, color: '#b8952a', marginTop: 1 }}>{profile.personaKey} · {persona.tags}</div>
            </div>
          </div>
        ) : null}

        {/* 全球版图 */}
        {imprintCities.length > 0 && (
          <div style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 13, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 13px 7px' }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#2d2418' }}>全球版图</span>
              <span style={{ fontSize: 11, color: '#8a7a62' }}>{imprintCities.length} 座城市 · {uniqueCountries} 个国家</span>
            </div>
            <div style={{ height: 160, position: 'relative', background: '#dceef8', overflow: 'hidden' }}>
              <GlobeMap cities={imprintCities} onCityClick={() => {}} />
            </div>
            <div style={{ fontSize: 10, color: '#8a7a62', textAlign: 'center', padding: '7px 0 9px' }}>游民的足迹</div>
          </div>
        )}

        {/* 公开印迹 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#2d2418' }}>公开印迹</span>
          <span style={{ fontSize: 11, color: '#8a7a62' }}>{publicImprints.length} 个</span>
        </div>
        {publicImprints.length === 0 && (
          <div style={{ background: '#fff', border: '0.5px solid #ddd4c0', borderRadius: 12, padding: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: '#b8a98a' }}>还没有公开印迹</span>
          </div>
        )}
        {publicImprints.map(imp => (
          <div key={imp.id} onClick={() => router.push(`/imprint/${imp.id}`)}
            style={{ display: 'flex', background: '#fff', border: '0.5px solid #e2d9c8', borderRadius: 12, overflow: 'hidden', marginBottom: 8, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ width: 68, height: 60, background: '#ede8df', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {imp.photo ? <img src={imp.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 9, color: '#c8bfaa' }}>图片</span>}
            </div>
            <div style={{ padding: '8px 10px', flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: '#b8a98a' }}>{CITIES[imp.city]?.nameZh || imp.city}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#2d2418', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{imp.title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {imp.tags.slice(0, 2).map(t => (
                    <span key={t} style={{ fontSize: 9, background: 'transparent', color: '#8a7a62', padding: '1px 5px', borderRadius: 4 }}>{t}</span>
                  ))}
                </div>
                <span style={{ fontSize: 10, color: '#b8a98a' }}>♡ {imp.likes}</span>
              </div>
            </div>
          </div>
        ))}

        <div style={{ height: 12 }} />
      </div>

      <div style={{ height: 32 }} />
      <BottomNav />
    </div>
  )
}
