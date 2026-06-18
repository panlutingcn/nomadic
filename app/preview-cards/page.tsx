'use client'
export const dynamic = 'force-static'
import CityCard from '@/components/cards/CityCard'
import ImprintCard from '@/components/cards/ImprintCard'
import PersonaCard from '@/components/cards/PersonaCard'
import { CITIES } from '@/data/cities'

const MOCK_USER = { nickname: 'Alice', avatarUrl: null }
const LISBON = CITIES['Lisbon']

const LOCAL_BLENDER = {
  personaKey: 'SCTF',
  personaName: '本地混入者',
  personaEmoji: '🎭',
  personaTags: '定居·文化·部落·即兴',
  personaDescription: '没有计划地融入，直到被误认为是本地人。你的旅行不是旅行，是暂时换一种人生过过。',
  personaOverview: '你会学几句当地俚语，找到只有本地人知道的酒吧，然后在那里认识一群朋友，忘记自己是游客。真正融入一座城市的肌理，是你读懂它最直接的方式。',
  cities: ['里斯本', '塔林', '瓦伦西亚'],
  cityReasons: { '里斯本': '外国人与本地人界限模糊，融入极易', '塔林': '小城社群紧密，外来者反而更受欢迎', '瓦伦西亚': '悠闲节奏让人自然地慢下来融入' },
}

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
        <div style={{ color: '#555', fontSize: 11 }}>人格卡 · Persona Card</div>
        <PersonaCard
          nickname={MOCK_USER.nickname}
          avatarUrl={MOCK_USER.avatarUrl}
          {...LOCAL_BLENDER}
          qrUrl="https://nomadictree.io/persona?type=SCTF"
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
