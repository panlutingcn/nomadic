import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { city, imageBase64 } = await req.json()

  const content: Anthropic.MessageParam['content'] = []

  if (imageBase64) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
    })
  }

  content.push({
    type: 'text',
    text: `你是一位擅长城市文化叙事的作家。请根据${imageBase64 ? '这张照片和' : ''}城市"${city}"，写一段100字左右的印迹故事。
要求：
- 融入该城市的历史文化特色
- 第一人称，有温度，有细节
- 不要泛泛而谈，要有具体的城市意象
- 只输出故事正文，不要标题或解释`,
  })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [{ role: 'user', content }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return NextResponse.json({ narrative: text })
}

export const runtime = 'edge';