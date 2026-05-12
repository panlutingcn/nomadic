import { NextRequest, NextResponse } from 'next/server'
import { searchCity } from '@/lib/deepseek'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'edge'

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000

async function getCached(q: string) {
  // Try English name (case-insensitive)
  const { data: byEn } = await supabaseAdmin
    .from('city_cache')
    .select('data, updated_at')
    .ilike('city_name', q)
    .maybeSingle()
  if (byEn) return byEn

  // Try Chinese name (exact)
  const { data: byZh } = await supabaseAdmin
    .from('city_cache')
    .select('data, updated_at')
    .eq('city_name_zh', q)
    .maybeSingle()
  return byZh ?? null
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()
    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const q = query.trim()

    // Check cache
    const cached = await getCached(q)
    if (cached) {
      const age = Date.now() - new Date(cached.updated_at).getTime()
      if (age < ONE_MONTH_MS) {
        return NextResponse.json({ success: true, result: cached.data, fromCache: true })
      }
    }

    // Cache miss or stale → call AI
    const result = await searchCity(q)

    // Upsert cache (write in background, don't await to keep response fast)
    supabaseAdmin.from('city_cache').upsert({
      city_name: result.cityName,
      city_name_zh: result.cityNameZh,
      data: result,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'city_name' }).then(() => {})

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('[Search API] Error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '搜索失败' },
      { status: 500 }
    )
  }
}
