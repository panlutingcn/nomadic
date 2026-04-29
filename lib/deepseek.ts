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
  soulBody: string
  soulPersonality: string
  soulEconomy: string
  soulFestivals: string
  soulFigures: string
  wifiSpeed: string
  costLevel: string
  visaInfo: string
  baseVisaDays: string
  baseVisaDesc: string
  baseSafety: string
  baseDailyCost: string
  baseVisaDetail: string
  baseSociety: string
  chanceParagraph: string
  chancePolicy: { label: string; url: string; desc: string }
  localParagraph: string
  fallbackCity: string | null
}

const SYSTEM_PROMPT = "You are a JSON API. Always respond with valid JSON only, no explanations, no markdown."

const USER_PROMPT = (query: string) =>
  `Identify the city from this query and return nomad-friendly data about it.

Return JSON only:
{"cityName":"English name","cityNameZh":"中文名","country":"Country","countryZh":"国家中文名","flag":"country flag emoji","confidence":0.0-1.0,"userIntent":"意图摘要","relevantSections":["soul","base","chance","local"],"aiInsight":"50-100字中文，说明这座城市对数字游民的吸引力","soulHeadline":"10-20字中文，描述城市灵魂与气质","soulBody":"40-60字中文，用诗意的语言描述城市精神内核，类似：这座城市永远在建设中——不是因为它未完成，而是因为它拒绝停止生长。","soulPersonality":"80-120字中文，描述城市文化性格与精神内核","soulEconomy":"60-100字中文，描述城市经济支柱与产业结构","soulFestivals":"60-100字中文，描述代表性节庆活动","soulFigures":"60-100字中文，描述与该城市相关的代表人物","wifiSpeed":"XX Mbps","costLevel":"$ or $$ or $$$","visaInfo":"签证信息如90天申根免签","baseVisaDays":"最适合数字游民的签证天数，格式如：90 days 或 365 days","baseVisaDesc":"🛂 开头，30-50字中文，描述该签证的具体信息与申请要点","baseSafety":"60-100字中文，描述治安状况与安全注意事项","baseDailyCost":"60-100字中文，描述每日花销参考（餐饮/住宿/交通）","baseVisaDetail":"60-100字中文，描述签证政策详情与长期居留选项","baseSociety":"60-100字中文，描述社会保障与生活节奏","chanceParagraph":"50-80字中文，描述商业与工作机会","chancePolicy":{"label":"该国官方投资促进机构或创业支持计划的名称","url":"该国官方投资促进机构、商业支持或创业计划的官方网站URL（必须是政府官方网站，如投资促进局、商业发展机构等，不要使用签证网站或旅游中介）","desc":"20-30字中文描述"},"localParagraph":"30-50字中文，描述当地社群氛围与外籍人士融入情况","fallbackCity":null}

IMPORTANT for chancePolicy: The URL must point to the country's official investment promotion agency, business development organization, or startup support program (e.g., Germany Trade & Invest, Business France, IDA Ireland). DO NOT use visa websites, immigration portals, or tourism agencies. Focus on business and investment support resources.

Query: ${query}`

export async function searchCity(query: string): Promise<SearchResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  console.log('[deepseek] apiKey present:', !!apiKey, 'prefix:', apiKey?.slice(0, 8))
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY not configured')
  }

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: USER_PROMPT(query) }
      ],
      temperature: 0.7,
    })
  })

  if (!response.ok) {
    const body = await response.text()
    console.log('[deepseek] error response:', response.status, body)
    throw new Error(`Deepseek API error: ${response.status}`)
  }

  const data = await response.json()
  const text: string = data.choices[0].message.content
  const jsonStr = text.replace(/^```json\s*/m, '').replace(/\s*```$/m, '').trim()
  return JSON.parse(jsonStr) as SearchResult
}
