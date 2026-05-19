import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import { AuthProvider } from '@/context/AuthContext'
import OnboardingGuard from '@/components/OnboardingGuard'
import NicknameGuard from '@/components/NicknameGuard'

export const metadata: Metadata = {
  title: 'Nomadic',
  description: '在世界各地扎根，而不只是路过。一个给数字游民的灵感与商机社区。',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Nomadic',
    description: '在世界各地扎根，而不只是路过。一个给数字游民的灵感与商机社区。',
    url: 'https://nomadictree.io',
    siteName: 'Nomadic',
    images: [{ url: 'https://nomadictree.io/og-default', width: 1200, height: 630, alt: 'Nomadic 此时此地' }],
    locale: 'zh_CN',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <AuthProvider>
          <AppProvider>
            <OnboardingGuard>
              <NicknameGuard>
                {children}
              </NicknameGuard>
            </OnboardingGuard>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
