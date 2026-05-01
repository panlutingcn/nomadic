import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') ?? '/'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const appId = process.env.WECHAT_APP_ID
  const appSecret = process.env.WECHAT_APP_SECRET

  if (!baseUrl || !appId || !appSecret) {
    console.error('[wechat callback] missing required env vars')
    return NextResponse.redirect('/?auth_error=config')
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=wechat_cancelled`)
  }

  const rawState = decodeURIComponent(state)
  const safePath = rawState.startsWith('/') && !rawState.startsWith('//') ? rawState : '/'
  const redirectTo = `${baseUrl}${safePath}`

  // 1. Exchange code for access_token + openid
  // Server-to-server only — appSecret never reaches the browser.
  // WeChat's token endpoint requires secret as a query param (their API design).
  let tokenData: { access_token: string; openid: string; errcode?: number }
  let wxUserInfo: { nickname?: string; headimgurl?: string; errcode?: number }

  try {
    const tokenRes = await fetch(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`
    )
    tokenData = await tokenRes.json()
    if (tokenData.errcode) {
      console.error('[wechat callback] token error:', tokenData)
      return NextResponse.redirect(`${baseUrl}/?auth_error=wechat_token`)
    }

    // 2. Fetch WeChat user info (nickname + avatar)
    const infoRes = await fetch(
      `https://api.weixin.qq.com/sns/userinfo?access_token=${tokenData.access_token}&openid=${tokenData.openid}&lang=zh_CN`
    )
    wxUserInfo = await infoRes.json()
    if (wxUserInfo.errcode) {
      console.error('[wechat callback] userinfo error:', wxUserInfo)
      return NextResponse.redirect(`${baseUrl}/?auth_error=wechat_userinfo`)
    }
  } catch (err) {
    console.error('[wechat callback] network error:', err)
    return NextResponse.redirect(`${baseUrl}/?auth_error=network`)
  }

  const { access_token, openid } = tokenData
  const userInfo = wxUserInfo as { nickname: string; headimgurl: string }

  // 3. Find existing Supabase user by wechat_openid in profiles
  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('id, nickname')
    .eq('wechat_openid', openid)
    .single()

  let userId: string
  let userEmail: string

  if (existingProfile) {
    userId = existingProfile.id
    userEmail = `${openid}@wx.nomadic.placeholder`
  } else {
    // 4a. Create new Supabase auth user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: `${openid}@wx.nomadic.placeholder`,
      email_confirm: true,
      user_metadata: {
        wechat_openid: openid,
        nickname: userInfo.nickname,
        avatar_url: userInfo.headimgurl,
      },
    })
    if (createError || !newUser.user) {
      console.error('[wechat callback] createUser error:', createError)
      return NextResponse.redirect(`${baseUrl}/?auth_error=create_user`)
    }
    userId = newUser.user.id
    userEmail = `${openid}@wx.nomadic.placeholder`

    // 4b. Insert profile row
    const { error: insertError } = await supabaseAdmin.from('profiles').insert({
      id: userId,
      nickname: userInfo.nickname || 'Nomadic 用户',
      avatar_url: userInfo.headimgurl || null,
      wechat_openid: openid,
    })
    if (insertError) {
      console.error('[wechat callback] profile insert error:', insertError)
      return NextResponse.redirect(`${baseUrl}/?auth_error=profile_create`)
    }
  }

  // 5. Generate a one-time magic link to sign in this user
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: userEmail,
    options: { redirectTo },
  })

  if (linkError || !linkData?.properties?.action_link) {
    console.error('[wechat callback] generateLink error:', linkError)
    return NextResponse.redirect(`${baseUrl}/?auth_error=link`)
  }

  return NextResponse.redirect(linkData.properties.action_link)
}
