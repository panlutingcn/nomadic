import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { email, nickname } = await req.json()
  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Nomadic <onboarding@resend.dev>',
      to: email,
      subject: '欢迎来到 Nomadic 此时此地 🌍',
      html: `
        <div style="font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f5f0e8; border-radius: 16px;">
          <div style="text-align: center; font-size: 36px; margin-bottom: 20px;">🌍</div>
          <h2 style="text-align: center; color: #2d2418; font-size: 18px; font-weight: 600; margin-bottom: 8px;">
            欢迎来到 Nomadic 此时此地
          </h2>
          <p style="color: #7a6a50; font-size: 14px; line-height: 1.8; text-align: center; margin-bottom: 24px;">
            Hi ${nickname}，很高兴在这里遇见你。<br/>
            Nomadic 是一个为数字游民而生的探索平台——<br/>
            在这里，你可以发现城市的灵魂，留下自己的印迹，<br/>
            遇见和你一样在路上的人。
          </p>
          <div style="text-align: center; margin-bottom: 28px;">
            <a href="https://nomadictree.io" style="display: inline-block; padding: 12px 28px; background: #178f68; color: #fff; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 500;">
              开始探索 →
            </a>
          </div>
          <p style="color: #c8bfaa; font-size: 12px; text-align: center; margin: 0;">
            Nomadic 此时此地 · nomadictree.io
          </p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
