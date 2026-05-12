import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

interface UserProfile {
  nickname: string | null
  avatarUrl: string | null
}

export function useUserProfile(): UserProfile {
  const { user } = useAuth()
  const [nickname, setNickname] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setNickname(null); setAvatarUrl(null); return }
    const fallback =
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split('@')[0] ??
      '探索者'
    ;(async () => {
      try {
        const { data } = await supabase.from('profiles').select('nickname, avatar_url').eq('id', user.id).single()
        const displayName =
          data?.nickname ??
          (user.user_metadata?.nickname as string | undefined) ??
          fallback
        setNickname(displayName)
        setAvatarUrl(data?.avatar_url ?? null)
      } catch {
        setNickname(fallback)
        setAvatarUrl(null)
      }
    })()
  }, [user?.id])

  return { nickname, avatarUrl }
}
