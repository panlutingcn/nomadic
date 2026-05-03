import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'edge'

export async function GET() {
  const { count } = await supabaseAdmin
    .from('profiles')
    .select('id', { count: 'exact', head: true })
  return NextResponse.json({ count: count ?? 0 })
}
