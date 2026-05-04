import CardShell from './CardShell'

interface BrandCardProps {
  nickname: string
  avatarUrl: string | null
}

const QUADRANTS = [
  { icon: '🌿', label: '城市灵魂', desc: '文化氛围、生活节奏、社区性格' },
  { icon: '🏠', label: '生存基准', desc: '住房、消费、签证、基础设施' },
  { icon: '💡', label: '商业机会', desc: '创业环境、行业生态、远程工作资源' },
  { icon: '🤝', label: '本地圈子', desc: '社群、活动、找到同频的探索者' },
]

export default function BrandCard({ nickname, avatarUrl }: BrandCardProps) {
  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl} qrValue="https://nomadictree.io">
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#8a7560', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' as const }}>探索每座城市的四个维度</div>
        {QUADRANTS.map((q) => (
          <div key={q.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>{q.icon}</span>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#3d3020' }}>{q.label}</span>
              <span style={{ fontSize: 11, color: '#8a7560', marginLeft: 5 }}>— {q.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}
