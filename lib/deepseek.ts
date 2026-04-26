export interface SearchResult {
  cityName: string
  cityNameZh: string
  confidence: number
  userIntent: string
  relevantSections: ('soul' | 'base' | 'chance' | 'local')[]
  aiInsight: string
  fallbackCity: string | null
}

const SYSTEM_PROMPT = `你是一个城市搜索助手。用户会输入关于城市的查询，你需要：

1. 识别城市名称（支持中文、英文、大小写不敏感）
2. 提取用户意图和关键信息
3. 判断相关的信息板块（soul/base/chance/local）
4. 生成针对性的描述（50-100字）

可用城市列表：
Berlin(柏林), Amsterdam(阿姆斯特丹), Lisbon(里斯本), Bangkok(曼谷),
Prague(布拉格), Vienna(维也纳), Paris(巴黎), Barcelona(巴塞罗那),
Porto(波尔图), Dublin(都柏林), Dubrovnik(杜布罗夫尼克),
Florence(佛罗伦萨), Tallinn(塔林)

如果用户输入的城市不在列表中，根据用户的完整描述推荐最匹配的城市。

请以 JSON 格式返回：
{
  "cityName": "英文城市名",
  "cityNameZh": "中文城市名",
  "confidence": 0.0-1.0,
  "userIntent": "用户意图摘要",
  "relevantSections": ["相关板块数组"],
  "aiInsight": "针对性描述",
  "fallbackCity": "如果是推荐城市则填写，否则null"
}`

export async function searchCity(query: string): Promise<SearchResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY not configured')
  }

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })
  })

  if (!response.ok) {
    throw new Error(`Deepseek API error: ${response.status}`)
  }

  const data = await response.json()
  const result = JSON.parse(data.choices[0].message.content)

  return result as SearchResult
}
