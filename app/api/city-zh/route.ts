import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { city } = await req.json()
  if (!city) return NextResponse.json({ nameZh: null })

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) return NextResponse.json({ nameZh: null })

  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是地理助手。只回答城市的中文译名，不含任何其他文字。' },
          { role: 'user', content: `城市"${city}"的中文名是什么？只回答中文名，不含任何其他内容。` },
        ],
        temperature: 0,
        max_tokens: 16,
      }),
    })
    const data = await res.json()
    const nameZh = (data.choices?.[0]?.message?.content as string | undefined)?.trim() ?? null
    return NextResponse.json({ nameZh: nameZh || null })
  } catch {
    return NextResponse.json({ nameZh: null })
  }
}
