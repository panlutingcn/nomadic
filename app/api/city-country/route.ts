import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { city } = await req.json()
  if (!city) return NextResponse.json({ country: null })

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) return NextResponse.json({ country: null })

  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a geography assistant. Reply only with the country name in Chinese, nothing else.' },
          { role: 'user', content: `城市"${city}"所在的国家是？只回答国家名称（中文），不含任何其他内容。` },
        ],
        temperature: 0,
        max_tokens: 16,
      }),
    })
    const data = await res.json()
    const country: string = data.choices?.[0]?.message?.content?.trim() ?? ''
    return NextResponse.json({ country: country || null })
  } catch {
    return NextResponse.json({ country: null })
  }
}
