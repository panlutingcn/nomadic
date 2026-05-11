import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { query, cityList } = await req.json()

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'DEEPSEEK_API_KEY not configured' },
        { status: 500 }
      )
    }

    const cityNames: string[] = Array.isArray(cityList) ? cityList : []

    const prompt = `你是 Nomadic 城市推荐助手。用户输入了：「${query.trim()}」

从以下城市列表中，选出最符合用户需求的 1-3 座城市：
${cityNames.join('、')}

只返回 JSON 格式，不要有任何其他文字：
{"recommendations": [{"city": "城市名", "reason": "一句话推荐理由，不超过20字"}]}`

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a JSON API. Always respond with valid JSON only, no explanations, no markdown.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 256,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      console.error('[Search API] DeepSeek error:', response.status, body)
      throw new Error(`DeepSeek API error: ${response.status}`)
    }

    const data = await response.json()
    const text: string = data.choices[0].message.content
    const jsonStr = text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```$/m, '').trim()

    let parsed: { recommendations: { city: string; reason: string }[] }
    try {
      parsed = JSON.parse(jsonStr)
    } catch {
      console.error('[Search API] JSON parse failed:', text.slice(0, 200))
      throw new Error('结果解析失败，请再试一次')
    }

    return NextResponse.json({ success: true, recommendations: parsed.recommendations ?? [] })
  } catch (error) {
    console.error('[Search API] Error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '搜索失败' },
      { status: 500 }
    )
  }
}
