import Fuse from 'fuse.js'
import { CITIES, CityData } from '@/data/cities'

const cityList = Object.values(CITIES)

const fuse = new Fuse(cityList, {
  keys: [
    { name: 'name', weight: 0.35 },
    { name: 'nameZh', weight: 0.35 },
    { name: 'country', weight: 0.1 },
    { name: 'countryZh', weight: 0.1 },
    { name: 'soul.headline', weight: 0.05 },
    { name: 'chance.paragraph', weight: 0.05 },
  ],
  threshold: 0.45,
  includeScore: true,
  minMatchCharLength: 2,
})

export type SearchResult = {
  city: CityData
  confidence: 'exact' | 'fuzzy' | 'ai'
  score?: number
}

export function localSearch(query: string): SearchResult[] | null {
  const trimmed = query.trim()
  if (!trimmed || trimmed.length < 2) return []

  // Layer 1: exact match — English name, Chinese name, country (both languages)
  const exact = cityList.find(
    c =>
      c.name.toLowerCase() === trimmed.toLowerCase() ||
      c.nameZh === trimmed ||
      c.country.toLowerCase() === trimmed.toLowerCase() ||
      c.countryZh === trimmed
  )
  if (exact) return [{ city: exact, confidence: 'exact', score: 1 }]

  // Layer 2: fuzzy match
  const fuzzy = fuse.search(trimmed)
  if (fuzzy.length > 0 && fuzzy[0].score! < 0.45) {
    return fuzzy.slice(0, 3).map(r => ({
      city: r.item,
      confidence: 'fuzzy' as const,
      score: 1 - (r.score ?? 0),
    }))
  }

  // null = no local match, caller should fall through to AI
  return null
}
