'use client'
import BrandCard from '@/components/cards/BrandCard'
import CityCard from '@/components/cards/CityCard'
import ImprintCard from '@/components/cards/ImprintCard'

const MOCK_USER = { nickname: 'Alice', avatarUrl: null }

export default function PreviewCardsPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a1a',
      padding: '48px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 48,
      alignItems: 'center',
    }}>
      <div style={{ color: '#555', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
        Share Card Preview — Dev Only
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <div style={{ color: '#555', fontSize: 11 }}>主页卡 · Brand Card</div>
        <BrandCard nickname={MOCK_USER.nickname} avatarUrl={MOCK_USER.avatarUrl} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <div style={{ color: '#555', fontSize: 11 }}>洞察卡 · City Card</div>
        <CityCard
          nickname={MOCK_USER.nickname}
          avatarUrl={MOCK_USER.avatarUrl}
          cityNameZh="里斯本"
          cityNameEn="Lisbon"
          countryZh="葡萄牙"
          flag="🇵🇹"
          description="里斯本是一座慢节奏的城市——不是因为它懒散，而是因为它学会了享受。阳光、海风、法朵音乐与廉价的本地红酒，构成了这座城市独特的生活美学。"
          qrValue="https://nomadictree.io/insights?city=Lisbon"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <div style={{ color: '#555', fontSize: 11 }}>印迹卡 · Imprint Card</div>
        <ImprintCard
          nickname={MOCK_USER.nickname}
          avatarUrl={MOCK_USER.avatarUrl}
          photo="https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=600&q=80"
          narrative="在阿尔法玛区迷路是必须的。那些坡陡到让人停下来喘气的小巷，反而给了你抬头看海的理由。黄昏时分，橙色的阳光把每一扇破旧的门都变成画。"
          cityNameZh="里斯本"
          countryZh="葡萄牙"
          flag="🇵🇹"
          cityBgColor="#e8e2d8"
          qrValue="https://nomadictree.io/imprint/my-3"
        />
      </div>
    </div>
  )
}
