import { useAuth } from '@/context/AuthContext'

interface UserProfile {
  nickname: string | null
  avatarUrl: string | null
}

export function useUserProfile(): UserProfile {
  const { profileNickname, profileAvatarUrl } = useAuth()
  return { nickname: profileNickname, avatarUrl: profileAvatarUrl }
}
