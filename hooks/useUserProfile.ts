import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

interface UserProfile {
  nickname: string
  avatarUrl: string | null
}

export function useUserProfile(): UserProfile {
  const { user } = useAuth()
  const [nickname, setNickname] = useState<string>('探索者')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setNickname('探索者'); setAvatarUrl(null); return }
    supabase.from('profiles').select('nickname, avatar_url').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setNickname(data.nickname ?? (user.user_metadata?.nickname as string | undefined) ?? '探索者')
          setAvatarUrl(data.avatar_url ?? null)
        }
      })
  }, [user?.id])

  return { nickname, avatarUrl }
}
