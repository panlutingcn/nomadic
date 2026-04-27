export interface SearchResult {
  cityName: string
  cityNameZh: string
  country: string
  countryZh: string
  flag: string
  confidence: number
  userIntent: string
  relevantSections: ('soul' | 'base' | 'chance' | 'local')[]
  aiInsight: string
  soulHeadline: string
  wifiSpeed: string
  costLevel: string
  visaInfo: string
  chanceParagraph: string
  fallbackCity: string | null
}

const SYSTEM_PROMPT = "You are a JSON API. Always respond with valid JSON only, no explanations, no markdown."

const USER_PROMPT = (query: string) =>
  `Identify the city from this query and return nomad-friendly data about it.

Return JSON only:
{"cityName":"English name","cityNameZh":"中文名","country":"Country","countryZh":"国家中文名","flag":"country flag emoji","confidence":0.0-1.0,"userIntent":"意图摘要","relevantSections":["soul","base","chance","local"],"aiInsight":"50-100字中文，说明这座城市对数字游民的吸引力","soulHeadline":"10-20字中文，描述城市灵魂与气质","wifiSpeed":"XX Mbps","costLevel":"$ or $$ or $$$","visaInfo":"签证信息如90天申根免签","chanceParagraph":"50-80字中文，描述商业与工作机会","fallbackCity":null}

Query: ${query}`

export async function searchCity(query: string): Promise<SearchResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  console.log('[deepseek] apiKey present:', !!apiKey, 'prefix:', apiKey?.slice(0, 8))
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured')
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
    const body = await response.text()
    console.log('[deepseek] error response:', response.status, body)
    throw new Error(`Deepseek API error: ${response.status} ${body}`)
  }

  const data = await response.json()
  const text: string = data.content[0].text
  const jsonStr = text.replace(/^```json\s*/m, '').replace(/\s*```$/m, '').trim()
  return JSON.parse(jsonStr) as SearchResult
}
