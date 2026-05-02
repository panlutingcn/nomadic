import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'Nomadic 此时此地',
  description: '在世界各地扎根，而不只是路过。',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌳</text></svg>",
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
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
