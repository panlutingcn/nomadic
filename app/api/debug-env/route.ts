import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY
  return NextResponse.json({
    hasKey: !!key,
    keyPrefix: key ? key.slice(0, 12) + '...' : null,
    keyLength: key?.length ?? 0,
  })
}

export const runtime = 'edge';