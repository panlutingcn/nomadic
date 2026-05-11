import CardShell from './CardShell'

interface BrandCardProps {
  nickname: string
  avatarUrl: string | null
}

const FEATURES = [
  { icon: '🌍', label: '城市灵魂', desc: '文化氛围与城市性格' },
  { icon: '🏠', label: '生存基准', desc: '物价·网速·签证评估' },
  { icon: '💼', label: '商业机会', desc: '接触当地商业生态' },
  { icon: '👥', label: '本地圈子', desc: '建立深层专业人脉' },
  { icon: '📸', label: '旅行印迹', desc: '记录你的专属故事' },
]

export default function BrandCard({ nickname, avatarUrl }: BrandCardProps) {
  return (
    <CardShell nickname={nickname} avatarUrl={avatarUrl} qrValue="https://nomadictree.io">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Three-paragraph hero — 1/2 of content height, vertically centered */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 14 }}>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#166b4c',
            lineHeight: 1.5,
            letterSpacing: 0.2,
            marginBottom: 10,
          }}>
            In flow, we anchor.
          </div>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#3d3020',
            lineHeight: 1.55,
            marginBottom: 10,
          }}>
            在流动中建立秩序。
          </div>
          <div style={{
            fontSize: 13,
            color: '#8a7560',
            lineHeight: 1.7,
          }}>
            从漂泊的数字游民，到真正的世界公民。
          </div>
        </div>

        <div style={{ height: '0.5px', background: 'rgba(61,48,32,0.15)' }} />

        {/* Features — 1/3 of content height, tighter spacing, vertically centered */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7, paddingLeft: 14 }}>
          {FEATURES.map((f) => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0, width: 20, textAlign: 'center' as const }}>{f.icon}</span>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#3d3020' }}>{f.label}</span>
                <span style={{ fontSize: 11, color: '#8a7560', marginLeft: 5 }}>— {f.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  )
}
