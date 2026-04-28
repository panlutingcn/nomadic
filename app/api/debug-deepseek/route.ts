import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.DEEPSEEK_API_KEY
  return NextResponse.json({
    hasKey: !!key,
    keyPrefix: key ? key.slice(0, 8) + '...' : null,
    keyLength: key?.length ?? 0,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('DEEPSEEK') || k.includes('NEXT_PUBLIC'))
  })
}

export const runtime = 'edge';
