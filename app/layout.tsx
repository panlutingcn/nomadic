import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
//触发部署  
export const metadata: Metadata = {
  title: 'Nomadic 此时此地',
  description: '在世界各地扎根，而不只是路过。',
  icons: { icon: '/icon.svg' },
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
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
