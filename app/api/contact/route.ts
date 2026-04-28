import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, subject, message } = await req.json()

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Nomadic <onboarding@resend.dev>',
      to: 'panluting.cn@gmail.com',
      reply_to: email,
      subject: `[Nomadic] ${subject}`,
      text: `来自: ${email}\n\n${message}`,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export const runtime = 'edge'
