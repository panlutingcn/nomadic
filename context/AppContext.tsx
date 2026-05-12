'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { SAMPLE_IMPRINTS } from '@/data/sampleImprints'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export interface SavedCity {
  name: string
  country: string
  savedAt: string
}

export interface Imprint {
  id: string
  city: string
  author?: string
  userId?: string
  title: string
  narrative: string
  tags: string[]
  isPublic: boolean
  likes?: number
  createdAt: string
  photo?: string
  deletedAt?: string
}

export interface SearchContext {
  cityName: string
  cityNameZh: string
  country: string
  countryZh: string
  flag: string
  confidence: number
  userIntent: string
  relevantSections: string[]
  aiInsight: string
  soulHeadline: string
  soulBody: string
  soulPersonality: string
  soulEconomy: string
  soulFestivals: string
  soulFigures: string
  wifiSpeed: string
  costLevel: string
  visaInfo: string
  baseVisaDays: string
  baseVisaDesc: string
  baseSafety: string
  baseDailyCost: string
  baseVisaDetail: string
  baseSociety: string
  chanceParagraph: string
  chancePolicy: { label: string; url: string; desc: string }
  localParagraph: string
}

interface AppState {
  selectedCity: string
  setSelectedCity: (city: string) => void
  savedCities: SavedCity[]
  toggleSaveCity: (name: string, country: string) => void
  isCitySaved: (name: string) => boolean
  imprints: Imprint[]
  addImprint: (imprint: Omit<Imprint, 'id' | 'createdAt'>) => void | Promise<void>
  updateImprint: (id: string, updates: Partial<Omit<Imprint, 'id' | 'createdAt'>>) => void
  deleteImprint: (id: string) => void
  restoreImprint: (id: string) => void
  permanentlyDeleteImprint: (id: string) => void
  likeImprint: (id: string) => void
  trashedImprints: Imprint[]
  allPublicImprints: Imprint[]
  searchContext: SearchContext | null
  setSearchContext: (context: SearchContext | null) => void
}

const SAMPLE_SAVED_CITIES: SavedCity[] = [
  { name: 'Amsterdam', country: 'Netherlands', savedAt: '2026.03.18' },
  { name: 'Florence', country: 'Italy', savedAt: '2026.02.14' },
  { name: 'Helsinki', country: 'Finland', savedAt: '2026.01.05' },
]

const SAMPLE_USER_IMPRINTS: Imprint[] = [
  { id: 'sample-1', city: 'Berlin', author: '@nomad_kai', title: '施普雷河边的一个黄昏', narrative: '傍晚的施普雷河边，有人在废弃发电站的墙上作画，有人在河岸边开着露天派对。\n柏林的创业者大多不穿西装，但他们谈的事往往比任何办公室里的人更认真。\n这座城市有一种笃定感——不着急，但走得很远。\n理性与浪漫在这里共存，像两种矛盾的颜色调出了最对的底色。', tags: ['柏林', '德国', '创业氛围'], isPublic: true, likes: 32, createdAt: '2026.03.07', photo: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=600&q=80' },
  { id: 'my-4', city: 'Prague', title: '布拉格的咖啡馆工作日', narrative: '布拉格的咖啡馆有一种魔力：你坐下来"只是工作两小时"，然后抬头一看，外面已经黄昏了。\n窗外是中世纪的屋顶，杯子早就空了，思路却比在办公室清晰三倍。\n这里的网速出奇地好，房租出奇地低，街上走的人出奇地不着急。\n也许效率的敌人从来不是懒惰，而是错误的地点。', tags: ['布拉格', '捷克', '远程工作'], isPublic: false, createdAt: '2025.12.10', photo: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=600&q=80' },
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('zh-CN').replace(/\//g, '.')
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [selectedCity, setSelectedCity] = useState('')
  const [searchContext, setSearchContext] = useState<SearchContext | null>(null)
  const [savedCities, setSavedCities] = useState<SavedCity[]>(SAMPLE_SAVED_CITIES)
  const [imprints, setImprints] = useState<Imprint[]>(SAMPLE_USER_IMPRINTS)

  useEffect(() => {
    let cancelled = false

    if (!user) {
      setImprints(SAMPLE_USER_IMPRINTS)
      setSavedCities(SAMPLE_SAVED_CITIES)
      return
    }

    Promise.all([
      supabase.from('imprints').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('saved_cities').select('*').eq('user_id', user.id).order('saved_at', { ascending: false }),
    ]).then(([{ data: impData, error: impErr }, { data: cityData, error: cityErr }]) => {
      if (cancelled) return
      if (impErr) console.error('[AppContext] Failed to load imprints:', impErr)
      if (cityErr) console.error('[AppContext] Failed to load saved_cities:', cityErr)
      if (impData) {
        setImprints(impData.map(r => ({
          id: r.id,
          city: r.city,
          title: r.title,
          narrative: r.narrative ?? '',
          tags: r.tags ?? [],
          isPublic: r.is_public,
          author: r.author ?? undefined,
          userId: r.user_id ?? undefined,
          likes: r.likes ?? 0,
          createdAt: formatDate(r.created_at),
          photo: r.photo_url ?? undefined,
          deletedAt: r.deleted_at ?? undefined,
        })))
      }
      if (cityData) {
        setSavedCities(cityData.map(r => ({
          name: r.city_name,
          country: r.country,
          savedAt: formatDate(r.saved_at),
        })))
      }
    }).catch(err => {
      if (cancelled) return
      console.error('[AppContext] Failed to load user data:', err)
      setImprints([])
      setSavedCities([])
    })

    return () => { cancelled = true }
  }, [user?.id])

  const toggleSaveCity = (name: string, country: string) => {
    const exists = savedCities.find(c => c.name === name)
    if (exists) {
      if (user) supabase.from('saved_cities').delete().eq('user_id', user.id).eq('city_name', name).then(() => {})
      setSavedCities(prev => prev.filter(c => c.name !== name))
    } else {
      const savedAt = new Date().toLocaleDateString('zh-CN').replace(/\//g, '.')
      if (user) supabase.from('saved_cities').insert({ user_id: user.id, city_name: name, country }).then(() => {})
      setSavedCities(prev => [{ name, country, savedAt }, ...prev])
    }
  }

  const isCitySaved = (name: string) => savedCities.some(c => c.name === name)

  const addImprint = async (imprint: Omit<Imprint, 'id' | 'createdAt'>) => {
    const tempId = `imprint-${Date.now()}`
    const newImprint: Imprint = {
      ...imprint,
      id: tempId,
      createdAt: new Date().toLocaleDateString('zh-CN').replace(/\//g, '.'),
    }
    setImprints(prev => [newImprint, ...prev])
    if (user) {
      const { data } = await supabase.from('imprints').insert({
        user_id: user.id,
        city: imprint.city,
        title: imprint.title,
        narrative: imprint.narrative,
        tags: imprint.tags,
        is_public: imprint.isPublic,
        photo_url: imprint.photo ?? null,
        author: imprint.author ?? null,
      }).select('id').single()
      if (data?.id) {
        setImprints(prev => prev.map(i => i.id === tempId ? { ...i, id: data.id } : i))
      }
    }
  }

  const updateImprint = (id: string, updates: Partial<Omit<Imprint, 'id' | 'createdAt'>>) => {
    setImprints(prev => prev.map(imp => imp.id === id ? { ...imp, ...updates } : imp))
    if (user) {
      const patch: Record<string, unknown> = {}
      if (updates.city !== undefined) patch.city = updates.city
      if (updates.title !== undefined) patch.title = updates.title
      if (updates.narrative !== undefined) patch.narrative = updates.narrative
      if (updates.tags !== undefined) patch.tags = updates.tags
      if (updates.isPublic !== undefined) patch.is_public = updates.isPublic
      if (updates.photo !== undefined) patch.photo_url = updates.photo
      supabase.from('imprints').update(patch).eq('id', id).then(() => {})
    }
  }

  const deleteImprint = (id: string) => {
    const now = new Date().toISOString()
    setImprints(prev => prev.map(imp => imp.id === id ? { ...imp, deletedAt: now } : imp))
    if (user) supabase.from('imprints').update({ deleted_at: now }).eq('id', id).then(() => {})
  }

  const restoreImprint = (id: string) => {
    setImprints(prev => prev.map(imp => imp.id === id ? { ...imp, deletedAt: undefined } : imp))
    if (user) supabase.from('imprints').update({ deleted_at: null }).eq('id', id).then(() => {})
  }

  const permanentlyDeleteImprint = (id: string) => {
    setImprints(prev => prev.filter(imp => imp.id !== id))
    if (user) supabase.from('imprints').delete().eq('id', id).then(() => {})
  }

  const likeImprint = (id: string) => {
    if (!user) return
    const likedKey = `liked_${user.id}_${id}`
    const alreadyLiked = localStorage.getItem(likedKey) === '1'
    const delta = alreadyLiked ? -1 : 1
    if (alreadyLiked) localStorage.removeItem(likedKey)
    else localStorage.setItem(likedKey, '1')
    // Only sync to Supabase; display is handled by liked state in the detail page
    const current = imprints.find(i => i.id === id)?.likes ?? 0
    supabase.from('imprints')
      .update({ likes: Math.max(0, current + delta) })
      .eq('id', id)
      .then(() => {})
  }

  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000
  const now = Date.now()
  const activeImprints = imprints.filter(i => !i.deletedAt)
  const trashedImprints = imprints.filter(i => i.deletedAt && now - new Date(i.deletedAt).getTime() < THREE_DAYS_MS)

  const samplePublic: Imprint[] = SAMPLE_IMPRINTS.map(s => ({ ...s, author: s.author, likes: s.likes }))
  const userPublicIds = new Set(activeImprints.filter(i => i.isPublic).map(i => i.id))
  const allPublicImprints = [
    ...activeImprints.filter(i => i.isPublic),
    ...samplePublic.filter(s => !userPublicIds.has(s.id)),
  ]

  return (
    <AppContext.Provider value={{
      selectedCity, setSelectedCity,
      savedCities, toggleSaveCity, isCitySaved,
      imprints: activeImprints, addImprint, updateImprint, deleteImprint, restoreImprint, permanentlyDeleteImprint, likeImprint,
      trashedImprints,
      allPublicImprints,
      searchContext, setSearchContext,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
