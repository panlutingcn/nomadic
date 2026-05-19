import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const redirect = searchParams.get('redirect') ?? '/'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const appId = process.env.WECHAT_APP_ID
  const appSecret = process.env.WECHAT_APP_SECRET

  if (!baseUrl || !appId || !appSecret) {
    console.error('[wechat] missing required env vars: NEXT_PUBLIC_BASE_URL / WECHAT_APP_ID / WECHAT_APP_SECRET')
    return NextResponse.redirect(`${baseUrl ?? ''}/?auth_error=wechat_not_configured`)
  }

  const callbackUrl = encodeURIComponent(`${baseUrl}/api/auth/wechat/callback`)
  const state = encodeURIComponent(redirect)

  const wechatUrl =
    `https://open.weixin.qq.com/connect/qrconnect` +
    `?appid=${appId}` +
    `&redirect_uri=${callbackUrl}` +
    `&response_type=code` +
    `&scope=snsapi_login` +
    `&state=${state}` +
    `#wechat_redirect`

  return NextResponse.redirect(wechatUrl)
}
