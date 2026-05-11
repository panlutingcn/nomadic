'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/onboarding')) return

    const onboarded = localStorage.getItem('nomadic_onboarded')
    const neverRemind = localStorage.getItem('nomadic_never_remind')
    const skipThisSession = sessionStorage.getItem('nomadic_skip_remind_session')

    if (!onboarded) {
      router.replace('/onboarding')
    } else if (!localStorage.getItem('nomadic_persona') && !neverRemind && !skipThisSession) {
      router.replace('/onboarding/remind')
    }
  }, [pathname])

  return <>{children}</>
}
