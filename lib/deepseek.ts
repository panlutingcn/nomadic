export interface SearchResult {
  cityName: string
  cityNameZh: string
  confidence: number
  userIntent: string
  relevantSections: ('soul' | 'base' | 'chance' | 'local')[]
  aiInsight: string
  fallbackCity: string | null
}

const SYSTEM_PROMPT = "You are a JSON API. Always respond with valid JSON only, no explanations, no markdown."

const USER_PROMPT = (query: string) =>
  `Pick the best matching city from [Berlin(柏林), Amsterdam(阿姆斯特丹), Lisbon(里斯本), Prague(布拉格), Vienna(维也纳), Paris(巴黎), Barcelona(巴塞罗那), Porto(波尔图), Dublin(都柏林), Florence(佛罗伦萨), Tallinn(塔林)] for this query. If the city is not in the list, recommend the closest match.

Return JSON only: {"cityName":"English name","cityNameZh":"中文名","confidence":0.0-1.0,"userIntent":"意图摘要","relevantSections":["soul"|"base"|"chance"|"local" array],"aiInsight":"50-100字中文描述","fallbackCity":"English name if recommended, else null"}

Query: ${query}`

export async function searchCity(query: string): Promise<SearchResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY not configured')
  }

  const response = await fetch('https://dragoncode.codes/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: USER_PROMPT(query) }
      ],
    })
  })

  if (!response.ok) {
    throw new Error(`Deepseek API error: ${response.status}`)
  }

  const data = await response.json()
  const text: string = data.content[0].text
  const jsonStr = text.replace(/^```json\s*/m, '').replace(/\s*```$/m, '').trim()
  return JSON.parse(jsonStr) as SearchResult
}
