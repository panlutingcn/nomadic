import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') ?? '/'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  const appId = process.env.WECHAT_APP_ID!
  const appSecret = process.env.WECHAT_APP_SECRET!

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=wechat_cancelled`)
  }

  // 1. Exchange code for access_token + openid
  const tokenRes = await fetch(
    `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`
  )
  const tokenData = await tokenRes.json()

  if (tokenData.errcode) {
    console.error('[wechat callback] token error:', tokenData)
    return NextResponse.redirect(`${baseUrl}/?auth_error=wechat_token`)
  }

  const { access_token, openid } = tokenData as { access_token: string; openid: string }

  // 2. Fetch WeChat user info (nickname + avatar)
  const infoRes = await fetch(
    `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
  )
  const userInfo = await infoRes.json() as { nickname: string; headimgurl: string }

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
    await supabaseAdmin.from('profiles').insert({
      id: userId,
      nickname: userInfo.nickname || 'Nomadic 用户',
      avatar_url: userInfo.headimgurl || null,
      wechat_openid: openid,
    })
  }

  // 5. Generate a one-time magic link to sign in this user
  const redirectTo = `${baseUrl}${decodeURIComponent(state)}`
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: userEmail,
    options: { redirectTo },
  })

  if (linkError || !(linkData as any).properties?.action_link) {
    console.error('[wechat callback] generateLink error:', linkError)
    return NextResponse.redirect(`${baseUrl}/?auth_error=link`)
  }

  return NextResponse.redirect((linkData as any).properties.action_link)
}
