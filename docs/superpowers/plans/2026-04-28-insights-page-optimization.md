# Insights Page Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance insights page with expandable quadrants, platform descriptions, share functionality, and generic placeholder for no-city state.

**Architecture:** Update data model with expanded fields, rewrite insights page with full-screen modals for SOUL/BASE/CHANCE/LOCAL details, add share modal with QR code.

**Tech Stack:** Next.js 16, TypeScript, React hooks, inline CSS

---

## File Structure

**Modified:**
- `data/cities.ts` - Update interface, add descriptions, expanded content for Berlin
- `app/insights/page.tsx` - Major rewrite with modals and new layout

**No new files** - Modals are inline components

---

### Task 1: Update CityData Interface

**Files:**
- Modify: `data/cities.ts:1-19`

- [ ] **Step 1: Update interface with new optional fields**

```typescript
export interface CityData {
  name: string
  nameZh: string
  country: string
  countryZh: string
  flag: string
  match: number
  soul: {
    headline: string
    sub: string
    body?: string  // NEW: paragraph for main card
    personality?: string  // 城市性格
    economy?: string  // 经济支柱
    festivals?: string  // 节日庆典
    figures?: string  // 历史人物
  }
  base: {
    wifi: string
    cost: string
    visa: string
    welfare: string
    safety?: string  // 治安与安全
    dailyCost?: string  // 每日花销
    visaDetail?: string  // 签证政策
    society?: string  // 社会运转
  }
  chance: {
    paragraph: string
    policy: { label: string; url: string; desc?: string }
    localJobs: { name: string; url: string; desc?: string }[]
    remoteJobs: { name: string; url: string; desc?: string }[]
  }
  local: {
    platforms: { name: string; url: string; desc?: string }[]
  }
}
```

- [ ] **Step 2: Commit interface changes**

```bash
git add data/cities.ts
git commit -m "feat: extend CityData interface with expanded fields and descriptions"
```

---

### Task 2: Add Berlin Expanded Content

**Files:**
- Modify: `data/cities.ts:22-54`

- [ ] **Step 1: Add soul.body and expanded soul fields to Berlin**

```typescript
Berlin: {
  name: 'Berlin', nameZh: '柏林', country: 'Germany', countryZh: '德国', flag: '🇩🇪', match: 98,
  soul: {
    headline: '在这里，废墟与先锋共生。',
    body: '柏林是一座永远在建设中的城市——不是因为它未完成，而是因为它拒绝停止生长。这里的人相信，废墟也可以是美学，边界也可以是起点。',
    sub: '文化 · 历史 · 节庆 · 经济支柱',
    personality: '柏林的文化内核是对自由的执念。二战的废墟、冷战的分裂、统一后的重建，每一段历史都在这座城市留下了可见的伤疤与可触摸的记忆。Kreuzberg 的涂鸦、Mitte 的博物馆岛、Prenzlauer Berg 的咖啡馆——不同的街区讲述着不同的故事，却共同构成了一种包容异见、拥抱多元的城市精神。',
    economy: '柏林的经济支柱包括：科技初创（SoundCloud、Zalando、Delivery Hero 均发源于此）、创意产业（设计、时尚、音乐）、旅游业，以及日益壮大的生物科技与绿色能源领域。Mittelstand 中小企业是德国经济的骨干，在柏林同样活跃。',
    festivals: '柏林国际电影节（Berlinale，每年2月）是全球三大电影节之一；Karneval der Kulturen（文化狂欢节，每年5月）是欧洲最大的多元文化街头节日；Lollapalooza Berlin 和 Melt Festival 是夏季音乐节的代表；圣诞市场（Weihnachtsmarkt）遍布全城，是冬季最温暖的仪式。',
    figures: '大卫·鲍伊（David Bowie）在柏林创作了他最具实验性的三张专辑，称之为"柏林三部曲"；伊莎多拉·邓肯在此开创现代舞；克里斯托弗·伊舍伍德的《再见，柏林》记录了魏玛共和国末期的浮华与颓废；当代艺术家安塞尔姆·基弗（Anselm Kiefer）的作品深刻反映了德国历史的创伤与救赎。',
  },
```

- [ ] **Step 2: Add base expanded fields to Berlin**

```typescript
  base: {
    wifi: '98 Mbps', cost: '$$', visa: '90天申根免签',
    welfare: '🏥 持有效签证可加入法定医保（GKV），公立医院覆盖广泛，费用较低。',
    safety: '柏林整体安全，犯罪率低于欧洲多数大城市。需注意：地铁站和夜间娱乐区（如 Görlitzer Park）有扒窃风险；独自夜行建议选择灯光充足的路线。女性独行整体安全感较高，当地人普遍尊重个人边界。',
    dailyCost: '每日预算参考（追求品质但节俭的独立女性）：\n• 餐饮：$20–30（自煮早餐 + 午餐外食 + 偶尔下馆子）\n• 住宿：$40–60（Airbnb 单间或合租公寓，按月租更划算）\n• 交通：$5–8（月票约 $90，日均约 $3；偶尔打车）\n• 合计：约 $65–100/天',
    visaDetail: '申根区90天免签适用于多数国家护照持有者。长期居留可申请自由职业签证（Freiberufler），需提供收入证明、德语能力证明（部分情况）及健康保险。审批周期2-4个月。',
    society: '德国拥有全球最完善的社会保障体系之一：法定医疗保险（GKV）覆盖广泛，失业保险、养老金制度健全。持有效工作签证或自雇许可的外籍人士可参与社保体系。德国人普遍重视工作与生活平衡（Work-Life Balance），法定带薪假期20天以上，社会整体节奏稳健而有序。',
  },
```

- [ ] **Step 3: Commit Berlin expanded content**

```bash
git add data/cities.ts
git commit -m "feat: add expanded soul and base content for Berlin"
```

---

### Task 3: Add Platform Descriptions

**Files:**
- Modify: `data/cities.ts:34-52` (Berlin chance/local sections)

- [ ] **Step 1: Add descriptions to Berlin links**

```typescript
  chance: {
    paragraph: '柏林设计审美偏向理性实用主义，创意产业密集，品牌出海需求旺盛。Mittelstand 中小企业构成商业骨干，咨询、策划与内容类项目持续活跃。',
    policy: { label: '自由职业签证（Freiberufler）', url: 'https://www.make-it-in-germany.com/en/visa-residence/types/self-employment', desc: '德国官方自雇签证指南' },
    localJobs: [
      { name: 'StepStone DE', url: 'https://www.stepstone.de', desc: '德国最大招聘平台，覆盖各行业职位' },
      { name: 'XING Jobs', url: 'https://www.xing.com/jobs', desc: '德语区职业社交网络，类似 LinkedIn' },
      { name: 'Indeed DE', url: 'https://de.indeed.com', desc: '全球最大招聘搜索引擎德国站' },
    ],
    remoteJobs: [
      { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
      { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      { name: 'Toptal', url: 'https://www.toptal.com', desc: '顶尖自由职业者网络，严格筛选机制' },
      { name: 'Contra', url: 'https://contra.com', desc: '面向独立创作者的无佣金接单平台' },
    ]
  },
  local: {
    platforms: [
      { name: 'Meetup Berlin', url: 'https://www.meetup.com/cities/de/berlin/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
      { name: 'Eventbrite Berlin', url: 'https://www.eventbrite.de/d/germany--berlin/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      { name: 'Berlin Startup Jobs Events', url: 'https://berlinstartupjobs.com/events/', desc: '柏林创业圈活动与招聘信息聚合' },
    ]
  }
```

- [ ] **Step 2: Commit descriptions**

```bash
git add data/cities.ts
git commit -m "feat: add platform descriptions to Berlin links"
```

---

### Task 4: Update GLOBAL_COMMUNITIES

**Files:**
- Modify: `data/cities.ts:421-427`

- [ ] **Step 1: Remove dead links and add descriptions**

```typescript
export const GLOBAL_COMMUNITIES: { name: string; url: string; desc: string }[] = [
  { name: 'Nomad List Community', url: 'https://nomadlist.com/community', desc: '全球最大数字游民数据库与社区论坛' },
  { name: 'Digital Nomad Reddit', url: 'https://www.reddit.com/r/digitalnomad/', desc: 'Reddit 上最活跃的数字游民讨论社区' },
  { name: 'Dynamite Circle', url: 'https://www.tropicalmba.com/community/', desc: 'Tropical MBA 旗下付费精英游民社群' },
]
```

- [ ] **Step 2: Commit GLOBAL_COMMUNITIES update**

```bash
git add data/cities.ts
git commit -m "feat: update GLOBAL_COMMUNITIES with descriptions, remove dead links"
```

---

### Task 5: Update Insights Page Header

**Files:**
- Modify: `app/insights/page.tsx:70-88`

- [ ] **Step 1: Add generic placeholder city data**

```typescript
  // Generic placeholder when no city selected
  const PLACEHOLDER_CITY = {
    name: '世界上的某个城市',
    nameZh: '',
    country: '地球上的某个国家',
    countryZh: '',
    flag: '🌍',
    match: 0,
    soul: {
      headline: '每座城市都有自己的故事。',
      body: '选择一座城市，开始探索它的灵魂、生存基准、商业机会和本地圈子。',
      sub: '文化 · 生活 · 工作'
    },
    base: {
      wifi: '—', cost: '—', visa: '—',
      welfare: '选择具体城市查看详细信息。'
    },
    chance: {
      paragraph: '每座城市都有独特的商业生态和机会。',
      policy: { label: '查询签证政策', url: '#' },
      localJobs: [],
      remoteJobs: []
    },
    local: {
      platforms: []
    }
  }

  const hasSelection = selectedCity && (selectedCity in CITIES || searchContext)
  const city = hasSelection 
    ? (CITIES[selectedCity] ?? { /* searchContext fallback */ })
    : PLACEHOLDER_CITY
```

- [ ] **Step 2: Center-align city/country names with horizontal line above**

```typescript
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <button onClick={handleBack} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 8 }}>← 返回</button>
            
            {/* Horizontal line above city name */}
            <div style={{ height: '0.5px', background: 'var(--border)', marginBottom: 10 }} />
            
            {/* Centered city/country names */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-primary)' }}>
                {city.name} {city.nameZh}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>
                {city.flag} {city.country} {city.countryZh}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 5, marginTop: 32 }}>
            <button onClick={handleSave} style={{ width: 30, height: 28, border: '0.5px solid var(--border-light)', borderRadius: 7, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: isCitySaved(city.name) ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer' }}>
              {isCitySaved(city.name) ? '♥' : '♡'}
            </button>
            <button onClick={() => setShowShare(true)} style={{ width: 30, height: 28, border: '0.5px solid var(--border-light)', borderRadius: 7, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer' }}>⤴</button>
          </div>
        </div>
```

- [ ] **Step 3: Commit header changes**

```bash
git add app/insights/page.tsx
git commit -m "feat: center city/country names, add horizontal line, generic placeholder"
```

---

Plan continues in next message due to length...
