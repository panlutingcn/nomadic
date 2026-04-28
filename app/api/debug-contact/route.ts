import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.RESEND_API_KEY
  if (!key) return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 500 })

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Nomadic <onboarding@resend.dev>',
      to: 'panluting.cn@gmail.com',
      subject: '[Nomadic] 测试邮件',
      text: '这是一封测试邮件',
    }),
  })

  const data = await res.text()
  return NextResponse.json({ status: res.status, body: data })
}

export const runtime = 'edge'
