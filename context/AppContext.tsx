'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { SAMPLE_IMPRINTS } from '@/data/sampleImprints'

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
  allPublicImprints: Imprint[]
  searchContext: SearchContext | null
  setSearchContext: (context: SearchContext | null) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState('')
  const [searchContext, setSearchContext] = useState<SearchContext | null>(null)
  const [savedCities, setSavedCities] = useState<SavedCity[]>([
    { name: 'Berlin', country: 'Germany', savedAt: '2025.01.14' },
    { name: 'Amsterdam', country: 'Netherlands', savedAt: '2025.01.08' },
    { name: 'Lisbon', country: 'Portugal', savedAt: '2024.12.30' },
  ])
  const [imprints, setImprints] = useState<Imprint[]>([
    { id: 'my-1', city: 'Berlin', title: 'Markthalle IX 的一个下午', narrative: '柏林人对空间再利用的想象力让我重新思考创意的边界。', tags: ['柏林', '创意'], isPublic: true, likes: 12, createdAt: '2026.03.18', photo: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=600&q=80' },
    { id: 'my-2', city: 'Amsterdam', title: '约旦区的周六早市', narrative: '阿姆斯特丹人把生活过得像一门手艺，每一个摊位背后都是一个认真经营的小世界。', tags: ['阿姆斯特丹', '生活方式'], isPublic: false, createdAt: '2026.02.05', photo: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=600&q=80' },
    { id: 'my-3', city: 'Lisbon', title: '里斯本的第一杯 Ginjinha', narrative: '在阿尔法玛区迷路的那个傍晚，我突然明白为什么这么多人选择留下来。', tags: ['里斯本', '慢生活'], isPublic: true, likes: 8, createdAt: '2026.01.30', photo: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=600&q=80' },
    { id: 'my-4', city: 'Prague', title: '布拉格的咖啡馆工作日', narrative: '一杯咖啡，三小时，窗外是中世纪的屋顶。效率反而比在办公室高了三倍。', tags: ['布拉格', '远程工作'], isPublic: false, createdAt: '2025.12.10', photo: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=600&q=80' },
    { id: 'my-5', city: 'Tallinn', title: '塔林老城的数字游民聚会', narrative: '在这里遇见了来自十二个国家的人，大家都在用笔记本电脑改变世界，却住在中世纪的石头房子里。', tags: ['塔林', '社群'], isPublic: true, likes: 21, createdAt: '2025.11.22', photo: 'https://images.unsplash.com/photo-1518975513267-071132b42e06?auto=format&fit=crop&w=600&q=80' },
  ])

  const toggleSaveCity = (name: string, country: string) => {
    setSavedCities(prev => {
      const exists = prev.find(c => c.name === name)
      if (exists) return prev.filter(c => c.name !== name)
      return [{ name, country, savedAt: new Date().toLocaleDateString('zh-CN').replace(/\//g, '.') }, ...prev]
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
  }

  const samplePublic: Imprint[] = SAMPLE_IMPRINTS.map(s => ({ ...s, author: s.author, likes: s.likes }))
  const allPublicImprints = [
    ...imprints.filter(i => i.isPublic),
    ...samplePublic,
  ]

  return (
    <AppContext.Provider value={{
      selectedCity, setSelectedCity,
      savedCities, toggleSaveCity, isCitySaved,
      imprints, addImprint,
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
