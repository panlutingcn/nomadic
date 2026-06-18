'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (pathname.startsWith('/onboarding')) return
    if (pathname.startsWith('/preview-cards')) return

    const onboarded = localStorage.getItem('nomadic_onboarded')
    const neverRemind = localStorage.getItem('nomadic_never_remind')
    const skipThisSession = sessionStorage.getItem('nomadic_skip_remind_session')

    const personaKey = user
      ? localStorage.getItem(`nomadic_persona_${user.id}`)
      : localStorage.getItem('nomadic_persona')

    if (!onboarded) {
      router.replace('/onboarding')
    } else if (!personaKey && !neverRemind && !skipThisSession) {
      router.replace('/onboarding')
    }
  }, [pathname, user?.id, loading])

  return <>{children}</>
}
