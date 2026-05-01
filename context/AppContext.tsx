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
  addImprint: (imprint: Omit<Imprint, 'id' | 'createdAt'>) => void
  updateImprint: (id: string, updates: Partial<Omit<Imprint, 'id' | 'createdAt'>>) => void
  deleteImprint: (id: string) => void
  restoreImprint: (id: string) => void
  permanentlyDeleteImprint: (id: string) => void
  trashedImprints: Imprint[]
  allPublicImprints: Imprint[]
  searchContext: SearchContext | null
  setSearchContext: (context: SearchContext | null) => void
}

const SAMPLE_SAVED_CITIES: SavedCity[] = [
  { name: 'Berlin', country: 'Germany', savedAt: '2025.01.14' },
  { name: 'Amsterdam', country: 'Netherlands', savedAt: '2025.01.08' },
  { name: 'Lisbon', country: 'Portugal', savedAt: '2024.12.30' },
]

const SAMPLE_USER_IMPRINTS: Imprint[] = [
  { id: 'my-1', city: 'Berlin', title: 'Markthalle IX 的一个下午', narrative: '柏林人对空间再利用的想象力让我重新思考创意的边界。', tags: ['柏林', '创意'], isPublic: true, likes: 12, createdAt: '2026.03.18', photo: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=600&q=80' },
  { id: 'my-2', city: 'Amsterdam', title: '约旦区的周六早市', narrative: '阿姆斯特丹人把生活过得像一门手艺，每一个摊位背后都是一个认真经营的小世界。', tags: ['阿姆斯特丹', '生活方式'], isPublic: false, createdAt: '2026.02.05', photo: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=600&q=80' },
  { id: 'my-3', city: 'Lisbon', title: '里斯本的第一杯 Ginjinha', narrative: '在阿尔法玛区迷路的那个傍晚，我突然明白为什么这么多人选择留下来。', tags: ['里斯本', '慢生活'], isPublic: true, likes: 8, createdAt: '2026.01.30', photo: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=600&q=80' },
  { id: 'my-4', city: 'Prague', title: '布拉格的咖啡馆工作日', narrative: '一杯咖啡，三小时，窗外是中世纪的屋顶。效率反而比在办公室高了三倍。', tags: ['布拉格', '远程工作'], isPublic: false, createdAt: '2025.12.10', photo: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=600&q=80' },
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
    if (!user) {
      setImprints(SAMPLE_USER_IMPRINTS)
      setSavedCities(SAMPLE_SAVED_CITIES)
      return
    }

    Promise.all([
      supabase.from('imprints').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('saved_cities').select('*').eq('user_id', user.id).order('saved_at', { ascending: false }),
    ]).then(([{ data: impData }, { data: cityData }]) => {
      if (impData) {
        setImprints(impData.map(r => ({
          id: r.id,
          city: r.city,
          title: r.title,
          narrative: r.narrative ?? '',
          tags: r.tags ?? [],
          isPublic: r.is_public,
          likes: r.likes,
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
    })
  }, [user?.id])

  const toggleSaveCity = (name: string, country: string) => {
    setSavedCities(prev => {
      const exists = prev.find(c => c.name === name)
      if (exists) {
        if (user) supabase.from('saved_cities').delete().eq('user_id', user.id).eq('city_name', name).then(() => {})
        return prev.filter(c => c.name !== name)
      }
      const savedAt = new Date().toLocaleDateString('zh-CN').replace(/\//g, '.')
      if (user) supabase.from('saved_cities').insert({ user_id: user.id, city_name: name, country }).then(() => {})
      return [{ name, country, savedAt }, ...prev]
    })
  }

  const isCitySaved = (name: string) => savedCities.some(c => c.name === name)

  const addImprint = (imprint: Omit<Imprint, 'id' | 'createdAt'>) => {
    const newImprint: Imprint = {
      ...imprint,
      id: `imprint-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('zh-CN').replace(/\//g, '.'),
    }
    setImprints(prev => [newImprint, ...prev])
    if (user) {
      supabase.from('imprints').insert({
        user_id: user.id,
        city: imprint.city,
        title: imprint.title,
        narrative: imprint.narrative,
        tags: imprint.tags,
        is_public: imprint.isPublic,
        photo_url: imprint.photo ?? null,
      }).then(() => {})
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

  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000
  const now = Date.now()
  const activeImprints = imprints.filter(i => !i.deletedAt)
  const trashedImprints = imprints.filter(i => i.deletedAt && now - new Date(i.deletedAt).getTime() < THREE_DAYS_MS)

  const samplePublic: Imprint[] = SAMPLE_IMPRINTS.map(s => ({ ...s, author: s.author, likes: s.likes }))
  const allPublicImprints = [
    ...activeImprints.filter(i => i.isPublic),
    ...samplePublic,
  ]

  return (
    <AppContext.Provider value={{
      selectedCity, setSelectedCity,
      savedCities, toggleSaveCity, isCitySaved,
      imprints: activeImprints, addImprint, updateImprint, deleteImprint, restoreImprint, permanentlyDeleteImprint,
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
