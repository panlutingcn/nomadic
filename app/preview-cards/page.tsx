'use client'
export const dynamic = 'force-static'
import CityCard from '@/components/cards/CityCard'
import ImprintCard from '@/components/cards/ImprintCard'
import { CITIES } from '@/data/cities'

const MOCK_USER = { nickname: 'Alice', avatarUrl: null }
const LISBON = CITIES['Lisbon']

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
        <div style={{ color: '#555', fontSize: 11 }}>洞察卡 · City Card</div>
        <CityCard
          nickname={MOCK_USER.nickname}
          avatarUrl={MOCK_USER.avatarUrl}
          cityNameZh={LISBON.nameZh}
          cityNameEn={LISBON.name}
          countryZh={LISBON.countryZh}
          flag={LISBON.flag}
          description={LISBON.soul.body ?? ''}
          personality={LISBON.soul.personality}
          economy={LISBON.soul.economy}
          qrValue="https://nomadictree.io/insights?city=Lisbon"
          cityKey="Lisbon"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <div style={{ color: '#555', fontSize: 11 }}>印迹卡 · Imprint Card</div>
        <ImprintCard
          nickname={MOCK_USER.nickname}
          avatarUrl={MOCK_USER.avatarUrl}
          photo="https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=600&q=80"
          title="在阿尔法玛迷路的那个黄昏"
          narrative="在阿尔法玛区迷路是必须的。那些坡陡到让人停下来喘气的小巷，反而给了你抬头看海的理由。黄昏时分，橙色的阳光把每一扇破旧的门都变成画。我站在某个无名台阶上，听见远处传来法朵，不知道唱的是什么，却莫名想哭。"
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
