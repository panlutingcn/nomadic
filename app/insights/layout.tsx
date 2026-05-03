import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nomadic 城市洞察 | 此时此地',
  description: '四维城市洞察：城市灵魂、生存基准、商业机会、本地圈子。探索你的下一座城市。',
  openGraph: {
    title: 'Nomadic 城市洞察 | 此时此地',
    description: '四维城市洞察：城市灵魂、生存基准、商业机会、本地圈子。探索你的下一座城市。',
    url: 'https://nomadictree.io/insights',
    siteName: 'Nomadic',
    images: [
      {
        url: 'https://nomadictree.io/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Nomadic 城市洞察',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
}

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
