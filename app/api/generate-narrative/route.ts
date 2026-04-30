import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { city, imageBase64, userInput } = await req.json()

  const content: Anthropic.MessageParam['content'] = []

  if (imageBase64) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
    })
  }

  let promptText: string
  if (userInput && userInput.trim()) {
    promptText = `你是一位擅长城市文化叙事的作家。请以下面的内容为素材，进行丰富和完善，写一段100字左右的印迹故事。

用户提供的素材：
${userInput}

城市：${city}
${imageBase64 ? '请同时参考照片中的场景。' : ''}

要求：
- 保留用户素材的核心意图和情感
- 融入该城市的历史文化特色
- 第一人称，有温度，有细节
- 只输出故事正文，不要标题或解释`
  } else {
    promptText = `你是一位擅长城市文化叙事的作家。请根据${imageBase64 ? '这张照片和' : ''}城市"${city}"，写一段100字左右的印迹故事。
要求：
- 融入该城市的历史文化特色
- 第一人称，有温度，有细节
- 不要泛泛而谈，要有具体的城市意象
- 只输出故事正文，不要标题或解释`
  }

  content.push({ type: 'text', text: promptText })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [{ role: 'user', content }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return NextResponse.json({ narrative: text })
}

export const runtime = 'edge'