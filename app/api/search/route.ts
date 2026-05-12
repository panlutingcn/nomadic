import { NextRequest, NextResponse } from 'next/server'
import { searchCity } from '@/lib/deepseek'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()
    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }
    const result = await searchCity(query.trim())
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('[Search API] Error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '搜索失败' },
      { status: 500 }
    )
  }
}
