'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import NicknamePrompt from './NicknamePrompt'

export default function NicknameGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, profileNickname } = useAuth()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (loading || !user || !user.email_confirmed_at) return
    if (profileNickname !== 'Nomadic 用户') return
    if (localStorage.getItem(`nomadic_nickname_set_${user.id}`)) return
    setShow(true)
  }, [loading, user?.id, user?.email_confirmed_at, profileNickname])

  const handleComplete = () => {
    if (user) localStorage.setItem(`nomadic_nickname_set_${user.id}`, '1')
    setShow(false)
  }

  return (
    <>
      {children}
      {show && user && <NicknamePrompt userId={user.id} onComplete={handleComplete} />}
    </>
  )
}
