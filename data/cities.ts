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
    body?: string
    personality?: string
    economy?: string
    festivals?: string
    figures?: string
  }
  base: {
    wifi: string
    cost: string
    visa: string
    visaDays?: string
    visaDesc?: string
    welfare: string
    safety?: string
    dailyCost?: string
    visaDetail?: string
    society?: string
  }
  chance: {
    paragraph: string
    policy: { label: string; url: string; desc?: string }
    localJobs: { name: string; url: string; desc?: string }[]
    remoteJobs: { name: string; url: string; desc?: string }[]
  }
  local: {
    paragraph?: string
    platforms: { name: string; url: string; desc?: string }[]
  }
}

export const CITIES: Record<string, CityData> = {
  Berlin: {
    name: 'Berlin', nameZh: '柏林', country: 'Germany', countryZh: '德国', flag: '🇩🇪', match: 98,
    soul: {
      headline: '在这里，废墟与先锋共生。',
      sub: '文化 · 历史 · 节庆 · 经济支柱',
      body: '柏林是一座永远在建设中的城市——不是因为它未完成，而是因为它拒绝停止生长。这里的人相信，废墟也可以是美学，边界也可以是起点。',
      personality: '柏林的文化内核是对自由的执念。二战的废墟、冷战的分裂、统一后的重建，每一段历史都在这座城市留下了可见的伤疤与可触摸的记忆。Kreuzberg 的涂鸦、Mitte 的博物馆岛、Prenzlauer Berg 的咖啡馆——不同的街区讲述着不同的故事，却共同构成了一种包容异见、拥抱多元的城市精神。',
      economy: '柏林的经济支柱包括：科技初创（SoundCloud、Zalando、Delivery Hero 均发源于此）、创意产业（设计、时尚、音乐）、旅游业，以及日益壮大的生物科技与绿色能源领域。Mittelstand 中小企业是德国经济的骨干，在柏林同样活跃。',
      festivals: '柏林国际电影节（Berlinale，每年2月）是全球三大电影节之一；Karneval der Kulturen（文化狂欢节，每年5月）是欧洲最大的多元文化街头节日；Lollapalooza Berlin 和 Melt Festival 是夏季音乐节的代表；圣诞市场（Weihnachtsmarkt）遍布全城，是冬季最温暖的仪式。',
      figures: '大卫·鲍伊（David Bowie）在柏林创作了他最具实验性的三张专辑，称之为"柏林三部曲"；伊莎多拉·邓肯在此开创现代舞；克里斯托弗·伊舍伍德的《再见，柏林》记录了魏玛共和国末期的浮华与颓废；当代艺术家安塞尔姆·基弗（Anselm Kiefer）的作品深刻反映了德国历史的创伤与救赎。',
    },
    base: {
      wifi: '98 Mbps', cost: '$$', visa: '90天申根免签',
      visaDays: '90天', visaDesc: '🛂 申根区90天免签，自由职业签证（Freiberufler）可长期居留，审批周期2-4个月。',
      welfare: '🏥 持有效签证可加入法定医保（GKV），公立医院覆盖广泛，费用较低。',
      safety: '柏林整体安全，犯罪率低于欧洲多数大城市。需注意：地铁站和夜间娱乐区（如 Görlitzer Park）有扒窃风险；独自夜行建议选择灯光充足的路线。女性独行整体安全感较高，当地人普遍尊重个人边界。',
      dailyCost: '每日预算参考：\n• 餐饮：$20–30（自煮早餐 + 午餐外食 + 偶尔下馆子）\n• 住宿：$40–60（Airbnb 单间或合租公寓，按月租更划算）\n• 交通：$5–8（月票约 $90，日均约 $3；偶尔打车）\n• 合计：约 $65–100/天',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。长期居留可申请自由职业签证（Freiberufler），需提供收入证明、德语能力证明（部分情况）及健康保险。审批周期2-4个月。',
      society: '德国拥有全球最完善的社会保障体系之一：法定医疗保险（GKV）覆盖广泛，失业保险、养老金制度健全。持有效工作签证或自雇许可的外籍人士可参与社保体系。德国人普遍重视工作与生活平衡（Work-Life Balance），法定带薪假期20天以上，社会整体节奏稳健而有序。',
    },
    chance: {
      paragraph: '柏林设计审美偏向理性实用主义，创意产业密集，品牌出海需求旺盛。Mittelstand 中小企业构成商业骨干，咨询、策划与内容类项目持续活跃。',
      policy: { label: 'Germany Trade & Invest 创业支持', url: 'https://www.gtai.de/en/invest/investment-guide/establishing-a-company', desc: '德国官方投资促进机构，提供创业与投资指南' },
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
      paragraph: '柏林的社群文化极度多元，从科技创业者到艺术家，从环保活动家到电子音乐爱好者，总能找到同频的人。',
      platforms: [
        { name: 'Meetup Berlin', url: 'https://www.meetup.com/cities/de/berlin/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Berlin', url: 'https://www.eventbrite.de/d/germany--berlin/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
        { name: 'Berlin Startup Jobs Events', url: 'https://berlinstartupjobs.com/events/', desc: '柏林创业圈活动与招聘信息聚合' },
      ]
    }
  },
  Amsterdam: {
    name: 'Amsterdam', nameZh: '阿姆斯特丹', country: 'Netherlands', countryZh: '荷兰', flag: '🇳🇱', match: 91,
    soul: {
      headline: '自由与秩序，在运河间共存。',
      sub: '文化 · 历史 · 节庆 · 经济支柱',
      body: '阿姆斯特丹从不强迫你做选择——它让自由与秩序在同一条运河里共存。这座城市相信，规则是为了让更多人能够自由地生活，而不是限制生活本身。',
      personality: '阿姆斯特丹人骨子里是务实的理想主义者。他们建造了世界上最早的股票交易所，也建造了世界上最宽容的社会制度。这座城市的文化内核是：在承认现实的前提下，尽可能地扩展自由的边界。运河边的咖啡馆、自行车道上的通勤者、红灯区旁的博物馆——一切并存，没有矛盾。',
      economy: '阿姆斯特丹是欧洲的金融与贸易枢纽，荷兰国际集团（ING）、飞利浦、阿斯麦（ASML）均在此设有总部。科技初创生态活跃，Booking.com、Adyen 等独角兽发源于此。创意产业、时尚设计与旅游业同样是重要支柱。',
      festivals: '国王节（Koningsdag，4月27日）是全城最盛大的橙色狂欢；阿姆斯特丹国际纪录片节（IDFA）是全球最大纪录片节；博物馆之夜（Museumnacht）每年11月让全城博物馆通宵开放；Gay Pride 运河游行是欧洲规模最大的骄傲游行之一。',
      figures: '安妮·弗兰克（Anne Frank）的日记让这座城市成为二战记忆的象征；伦勃朗（Rembrandt）在此创作了《夜巡》；斯宾诺莎（Spinoza）在阿姆斯特丹的宽容氛围中发展了他的哲学体系；当代DJ Tiësto 和 Armin van Buuren 将荷兰电子音乐推向全球。',
    },
    base: {
      wifi: '120 Mbps', cost: '$$$', visa: '90天申根免签',
      visaDays: '90天', visaDesc: '🛂 申根区90天免签，荷兰自雇居留许可（DAFT）适合美国公民，其他国籍可申请创业签证。',
      welfare: '🏥 工作满一定时间可享受荷兰社保，医疗保险强制购买，质量高且报销比例大。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。荷兰自雇居留许可（DAFT）适合美国公民，其他国籍可申请创业签证（Startup Visa）或高技能移民签证（Highly Skilled Migrant），需提供商业计划书或雇主担保。',
      dailyCost: '每日预算参考：\n• 餐饮：€25–40（咖啡馆午餐€12–18，晚餐€20–35）\n• 住宿：€60–100（市中心合租公寓，住宿成本较高）\n• 交通：€3–5（地铁/电车单程€3.2，月票€100）\n• 合计：约€90–150/天',
      safety: '阿姆斯特丹整体安全，犯罪率低。需注意：红灯区和中央火车站周边有扒窃风险；骑行时注意自行车盗窃（建议使用两把锁）。夜间独行整体安全，当地人普遍友善。',
      society: '荷兰拥有完善的社会保障体系，公共医疗（Zorgverzekering）为强制保险，居民须自行购买基础医保。工作文化注重效率与平衡，直接沟通是荷兰人的特点。英语普及率极高，几乎所有人都能流利交流。'
    },
    chance: {
      paragraph: '阿姆斯特丹是欧洲科技初创与创意产业的重镇，英语普及率极高，对外籍人才极度友好。',
      policy: { label: 'Netherlands Foreign Investment Agency', url: 'https://investinholland.com/doing-business-here/setting-up-your-business/', desc: '荷兰官方投资促进机构，提供企业设立指南' },
      localJobs: [
        { name: 'Nationalevacaturebank', url: 'https://www.nationalevacaturebank.nl', desc: '荷兰最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn NL Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
        { name: 'Toptal', url: 'https://www.toptal.com', desc: '顶尖自由职业者网络，严格筛选机制' },
      ]
    },
    local: {
      paragraph: '阿姆斯特丹的外籍人士社群成熟活跃，英语是通用语言，各类专业社群和兴趣小组让融入变得轻松自然。',
      platforms: [
        { name: 'Meetup Amsterdam', url: 'https://www.meetup.com/cities/nl/amsterdam/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Amsterdam', url: 'https://www.eventbrite.nl/d/netherlands--amsterdam/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Lisbon: {
    name: 'Lisbon', nameZh: '里斯本', country: 'Portugal', countryZh: '葡萄牙', flag: '🇵🇹', match: 87,
    soul: {
      headline: '阳光、瓷砖与慢生活的哲学。',
      sub: '文化 · 历史 · 节庆 · 经济支柱',
      body: '里斯本不急。它用了几个世纪学会了如何在失去帝国之后，依然优雅地面对大西洋。这里的慢，不是懒惰，而是一种经过历史淬炼的从容。',
      personality: '里斯本的文化内核是"Saudade"——一种对过去的温柔忧愁，对未来的平静期待。葡萄牙人不急于证明自己，他们更愿意在阿尔法玛区的石板路上漫步，在法多音乐里感受生命的重量。这种气质让里斯本成为一座让人想要留下来的城市。',
      economy: '里斯本的经济支柱包括旅游业、科技初创（Web Summit 永久落户于此）、金融服务与创意产业。葡萄牙的 NHR 税务优惠政策吸引了大量欧洲高净值人士定居，房地产与数字游民经济近年快速增长。',
      festivals: 'Santos Populares（6月圣人节）是里斯本最热闹的街头节日，全城烤沙丁鱼、跳舞狂欢；里斯本国际纪录片节（DocLisboa）是葡语世界最重要的纪录片节；Lisbon & Estoril Film Festival 每年秋季举办；法多音乐节贯穿全年，阿尔法玛区的小酒馆是最真实的舞台。',
      figures: '费尔南多·佩索阿（Fernando Pessoa）是里斯本最著名的文学灵魂，他的异名写作实验至今影响全球文学；瓦斯科·达·伽马（Vasco da Gama）从里斯本出发开辟了通往印度的航路；法多歌手阿玛利亚·罗德里格斯（Amália Rodrigues）将葡萄牙音乐带向世界。',
    },
    base: {
      wifi: '85 Mbps', cost: '$', visa: '90天申根免签',
      visaDays: '365天', visaDesc: '🛂 数字游民签证（D8）有效期1年，可续签，适合月收入超过€3,040的远程工作者。',
      welfare: '🏥 持 D8 签证可访问公共医疗系统（SNS），费用低廉；长期居民可申请 NHR 税务优惠。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。葡萄牙数字游民签证（D8）有效期1年，可续签，适合月收入超过€3,040的远程工作者。申请需提供收入证明、健康保险及住址证明。',
      dailyCost: '每日预算参考：\n• 餐饮：€15–25（午餐套餐€8–12，晚餐€15–25）\n• 住宿：€35–60（市中心合租公寓，近年价格上涨明显）\n• 交通：€2–4（地铁单程€1.5，月票€40）\n• 合计：约€55–90/天',
      safety: '里斯本整体安全，是欧洲治安较好的首都之一。需注意：阿尔法玛区和旅游景点有扒窃风险；夜间独行整体安全，当地人友善。女性独行安全感较高。',
      society: '葡萄牙公共医疗系统（SNS）覆盖广泛，持D8签证可低价就医。生活节奏悠闲，葡萄牙人重视家庭与社交。英语在年轻人和旅游业从业者中普及，但老一辈葡萄牙人英语较弱。'
    },
    chance: {
      paragraph: '里斯本物价低廉、气候宜人，已成为欧洲增长最快的数字游民聚集地，初创生态活跃。',
      policy: { label: 'Startup Portugal 创业支持', url: 'https://www.startupportugal.com/startup-visa', desc: '葡萄牙官方创业签证与支持计划' },
      localJobs: [
        { name: 'Net-Empregos', url: 'https://www.net-empregos.com', desc: '葡萄牙最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn PT Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
        { name: 'Nomad List Jobs', url: 'https://nomadlist.com/jobs', desc: '数字游民社区旗下远程职位聚合平台' },
      ]
    },
    local: {
      paragraph: '里斯本的数字游民社群是欧洲最活跃的之一，共享办公空间遍布全城，游民聚会几乎每周都有。',
      platforms: [
        { name: 'Meetup Lisbon', url: 'https://www.meetup.com/cities/pt/lisbon/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Lisboa', url: 'https://www.eventbrite.pt/d/portugal--lisbon/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Bangkok: {
    name: 'Bangkok', nameZh: '曼谷', country: 'Thailand', countryZh: '泰国', flag: '🇹🇭', match: 85,
    soul: {
      headline: '混沌中生长的东南亚能量之都。',
      sub: '文化 · 历史 · 节庆 · 经济支柱',
      body: '曼谷是一座永远不会让你无聊的城市。它把混沌变成了一种生活方式，把嘈杂变成了一种能量。在这里，街头小吃和五星酒店可以在同一条街上共存，没有人觉得奇怪。',
      personality: '曼谷的文化内核是"Sanuk"——泰语中"乐趣"的概念。泰国人相信，任何事情都应该有趣，包括工作。这种哲学渗透在街头小贩的笑容里、寺庙的金色屋顶上、夜市的霓虹灯下。曼谷不评判你，它只是接纳你，然后用它的能量感染你。',
      economy: '曼谷是东南亚最重要的商业枢纽之一，旅游业、金融服务、制造业与科技初创并驾齐驱。泰国政府积极推动数字经济，共享办公空间密集，外资企业众多。近年来，曼谷成为东南亚科技创业的重要节点，吸引大量区域总部落户。',
      festivals: '宋干节（Songkran，4月）是全球最盛大的泼水节，全城变成欢乐的水战场；水灯节（Loy Krathong，11月）在湄南河上放灯，如梦似幻；佛教节日贯穿全年，寺庙是城市生活的精神中心；每年12月的跨年烟火在湄南河畔举行，吸引数十万人聚集。',
      figures: '普密蓬·阿杜德国王（拉玛九世）是泰国人心中的精神支柱，在位70年深受爱戴；泰拳传奇武里拉姆·乌多姆迪是曼谷的体育骄傲；当代艺术家Rirkrit Tiravanija将泰国文化带入国际当代艺术舞台；美食家David Thompson将泰国料理推向全球高端餐饮领域。',
    },
    base: {
      wifi: '74 Mbps', cost: '$', visa: '30天落地签',
      visaDays: '180天', visaDesc: '🛂 多次入境旅游签证（METV）可停留6个月，LTR签证适合高收入远程工作者长期居留。',
      welfare: '🏥 外籍人士不纳入泰国社保体系，建议自行购买国际医疗保险，费用约 $50–$150/月。',
      visaDetail: '多次入境旅游签证（METV）可停留6个月，每次入境最长60天。泰国长期居留签证（LTR）适合高收入远程工作者，有效期10年，需年收入超过$80,000。',
      dailyCost: '每日预算参考：\n• 餐饮：฿200–500（街头小吃฿50–100，餐厅฿150–300）\n• 住宿：฿800–2000（市中心公寓，性价比极高）\n• 交通：฿100–200（BTS/MRT单程฿16–59，打车便宜）\n• 合计：约฿1,200–2,700/天（约$35–80）',
      safety: '曼谷整体安全，针对游客的暴力犯罪极少。需注意：扒窃在旅游区（考山路、暹罗广场）有发生；出租车和嘟嘟车可能绕路，建议使用Grab；避免参与街头赌博和陌生人搭讪的"特价"活动。',
      society: '泰国医疗水平在东南亚领先，私立医院服务优质且价格合理。工作文化注重等级与礼貌，"微笑之国"的称号名副其实。英语在商业区和旅游业普及，但日常生活中泰语为主。'
    },
    chance: {
      paragraph: '曼谷是东南亚商业枢纽，共享办公空间密集，消费成本极低，适合刚起步的数字游民。',
      policy: { label: 'Thailand Board of Investment 投资促进', url: 'https://www.boi.go.th/en/index/', desc: '泰国投资委员会官网，提供投资优惠与商业支持' },
      localJobs: [
        { name: 'JobsDB Thailand', url: 'https://th.jobsdb.com', desc: '东南亚领先招聘平台，泰国职位最全' },
        { name: 'LinkedIn TH Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
        { name: 'Toptal', url: 'https://www.toptal.com', desc: '顶尖自由职业者网络，严格筛选机制' },
      ]
    },
    local: {
      paragraph: '曼谷的外籍人士社群庞大且多元，从东南亚创业者到全球远程工作者，这里是亚洲数字游民密度最高的城市之一。',
      platforms: [
        { name: 'Meetup Bangkok', url: 'https://www.meetup.com/cities/th/bangkok/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Bangkok', url: 'https://www.eventbrite.com/d/thailand--bangkok/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
        { name: 'InterNations Bangkok', url: 'https://www.internations.org/bangkok-expats/', desc: '全球最大外籍人士社群，曼谷分部活跃' },
      ]
    }
  },
  Prague: {
    name: 'Prague', nameZh: '布拉格', country: 'Czech Republic', countryZh: '捷克', flag: '🇨🇿', match: 82,
    soul: {
      headline: '中欧的童话古城，创意与历史共鸣。',
      sub: '文化 · 历史 · 节庆 · 经济支柱',
      body: '布拉格像一本被时间遗忘的童话书——每一块石板路都藏着故事，每一座尖塔都指向某个被遗忘的传说。这座城市的美，是那种让你不敢大声说话的美。',
      personality: '布拉格的文化内核是一种黑色幽默与诗意并存的气质。捷克人经历了哈布斯堡王朝、纳粹占领、苏联统治，却始终保持着一种冷静的反讽精神。卡夫卡的荒诞、哈维尔的坚持、天鹅绒革命的温柔——这座城市教会了世界，如何用文化对抗权力。',
      economy: '布拉格是中欧最重要的经济中心之一，汽车制造（斯柯达）、工程技术、IT服务与旅游业是主要支柱。近年科技初创生态快速崛起，物价远低于西欧，吸引大量欧洲远程工作者和创业者定居。',
      festivals: '布拉格之春音乐节（每年5月）是欧洲最重要的古典音乐节之一；布拉格国际电影节（Febiofest）汇聚全球独立电影；圣诞市场（12月）在老城广场举行，是中欧最美的节日场景之一；布拉格啤酒节每年5月吸引数十万人参与。',
      figures: '弗兰茨·卡夫卡（Franz Kafka）在布拉格出生并创作了他所有重要作品；瓦茨拉夫·哈维尔（Václav Havel）从剧作家到总统，是天鹅绒革命的精神领袖；作曲家安东宁·德沃夏克（Antonín Dvořák）将波西米亚音乐带向世界；米兰·昆德拉（Milan Kundera）的《不能承受的生命之轻》让布拉格成为文学地标。',
    },
    base: {
      wifi: '80 Mbps', cost: '$', visa: '90天申根免签',
      visaDays: '90天', visaDesc: '🛂 申根区90天免签，自由职业贸易许可证（Živnostenský list）可合法自雇经营。',
      welfare: '🏥 申根区内医疗资源完善，建议购买旅行医疗保险，私立诊所英语服务良好。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。捷克自由职业贸易许可证（Živnostenský list）可合法自雇经营，申请相对简便，是欧洲最友好的自雇制度之一。',
      dailyCost: '每日预算参考：\n• 餐饮：Kč200–400（午餐套餐Kč150–200，晚餐Kč250–400）\n• 住宿：Kč800–1500（市中心合租公寓）\n• 交通：Kč30–50（地铁单程Kč30，月票Kč550）\n• 合计：约Kč1,100–2,000/天（约$50–90）',
      safety: '布拉格整体安全，犯罪率低。需注意：老城广场和查理大桥周边有扒窃风险；夜间独行整体安全，但建议避开偏僻街道。出租车建议使用Bolt或Uber，避免路边拦车。',
      society: '捷克拥有完善的公共医疗体系，持有效居留许可者可参与国家医保。工作文化务实，捷克人普遍重视工作与生活平衡。英语在年轻人和商业环境中普及，但日常生活中捷克语为主。'
    },
    chance: {
      paragraph: '布拉格物价低于西欧三分之一，科技初创生态快速崛起，吸引大量欧洲远程工作者定居。',
      policy: { label: 'CzechInvest 投资促进', url: 'https://www.czechinvest.org/en/Doing-business-in-the-Czech-Republic', desc: '捷克官方投资促进机构，提供商业设立指南' },
      localJobs: [
        { name: 'Jobs.cz', url: 'https://www.jobs.cz', desc: '捷克最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn CZ Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    local: {
      paragraph: '布拉格的外籍人士社群以欧洲远程工作者为主，价格亲民的共享办公空间和活跃的创业社群让融入变得容易。',
      platforms: [
        { name: 'Meetup Prague', url: 'https://www.meetup.com/cities/cz/prague/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Prague', url: 'https://www.eventbrite.com/d/czech-republic--prague/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Vienna: {
    name: 'Vienna', nameZh: '维也纳', country: 'Austria', countryZh: '奥地利', flag: '🇦🇹', match: 80,
    soul: {
      headline: '帝国余晖中的艺术与优雅。',
      sub: '文化 · 历史 · 节庆 · 经济支柱',
      body: '维也纳是一座知道自己辉煌过的城市，但它从不炫耀。帝国的余晖渗透在每一座咖啡馆、每一场音乐会里，成为一种日常的优雅。',
      personality: '维也纳的文化内核是一种精致的矛盾：它既是弗洛伊德精神分析的诞生地，也是华尔兹舞曲的故乡；既有帝国的宏大叙事，也有咖啡馆文化的私密温柔。维也纳人对美有近乎苛刻的要求，这种审美渗透在建筑、音乐、甚至日常对话里。',
      economy: '维也纳是奥地利的经济中心，金融服务、旅游业、文化创意产业与国际组织（联合国维也纳办事处、欧佩克总部）是主要支柱。作为中欧的门户城市，维也纳也是连接东西欧商业网络的重要节点。',
      festivals: '维也纳新年音乐会是全球收视率最高的古典音乐直播；维也纳歌剧舞会（Opernball）是欧洲最负盛名的社交盛事；维也纳电影节（Viennale）每年10月举行；圣诞市场遍布全城，市政厅前的市场是欧洲最美之一。',
      figures: '沃尔夫冈·阿马德乌斯·莫扎特（Mozart）在维也纳度过了他最重要的创作岁月；西格蒙德·弗洛伊德（Sigmund Freud）在此创立精神分析学；古斯塔夫·克里姆特（Gustav Klimt）的《吻》成为维也纳分离派的永恒象征；路德维希·维特根斯坦（Ludwig Wittgenstein）在维也纳的哲学圈中成长。',
    },
    base: {
      wifi: '90 Mbps', cost: '$$$', visa: '90天申根免签',
      visaDays: '90天', visaDesc: '🛂 申根区90天免签，红白红卡（自雇类别）适合高技能人才申请长期居留。',
      welfare: '🏥 奥地利医疗体系完善，持有效居留许可者可参加社会保险，公立医疗质量极高。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。奥地利人才护照（Talent Passport）适合自由职业者与创业者申请长期居留，需提供收入证明和专业资质。',
      dailyCost: '每日预算参考：\n• 餐饮：€20–35（咖啡馆午餐€12–18，晚餐€20–35）\n• 住宿：€50–80（市中心合租公寓）\n• 交通：€3–5（地铁单程€2.4，月票€51）\n• 合计：约€75–120/天',
      safety: '维也纳是全球最安全的城市之一，犯罪率极低。公共交通安全可靠，夜间独行无忧。需注意：中央火车站周边偶有扒窃，保管好随身物品即可。',
      society: '奥地利拥有全球顶尖的社会保障体系，公共医疗（Krankenversicherung）覆盖广泛。工作文化正式而高效，奥地利人重视隐私和个人边界。德语是官方语言，英语在商业环境中普及。'
    },
    chance: {
      paragraph: '维也纳是中欧商业中心，金融与文化创意产业并重，生活质量连续多年全球排名第一。',
      policy: { label: 'Austrian Business Agency 投资促进', url: 'https://investinaustria.at/en/business-location/setting-up-company.php', desc: '奥地利官方投资促进机构，提供企业设立支持' },
      localJobs: [
        { name: 'karriere.at', url: 'https://www.karriere.at', desc: '奥地利最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn AT Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    local: {
      paragraph: '维也纳的社群文化相对内敛，但外籍专业人士圈子成熟，文化活动丰富，适合喜欢高质量社交的游民。',
      platforms: [
        { name: 'Meetup Vienna', url: 'https://www.meetup.com/cities/at/vienna/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Vienna', url: 'https://www.eventbrite.at/d/austria--vienna/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Paris: {
    name: 'Paris', nameZh: '巴黎', country: 'France', countryZh: '法国', flag: '🇫🇷', match: 89,
    soul: {
      headline: '时尚、哲学与美食的永恒之都。',
      sub: '文化 · 艺术 · 时尚 · 美食',
      body: '巴黎不需要解释自己。它只是存在着，然后让你慢慢明白，为什么几个世纪以来，全世界的人都想来这里生活一次。',
      personality: '巴黎的文化内核是一种对卓越的执念——在美食、时尚、哲学、艺术的每一个领域，巴黎人都相信存在一个"正确"的方式。这种执念有时令人窒息，但也正是它创造了卢浮宫、创造了法式料理、创造了存在主义哲学。巴黎教会世界：认真对待美，是一种严肃的事业。',
      economy: '巴黎是全球奢侈品与时尚产业的绝对中心（LVMH、开云集团均总部于此），同时也是欧洲最重要的科技创业生态之一——Station F 是全球最大创业园区。金融服务、旅游业、文化创意产业共同构成巴黎的经济骨架。',
      festivals: '巴黎时装周（每年1月/2月、9月/10月）是全球时尚日历的核心；法国国庆日（7月14日）的阅兵式与烟火是全球最壮观的国庆庆典之一；巴黎白夜节（Nuit Blanche）让全城博物馆与艺术空间通宵开放；巴黎书展（Salon du Livre）是法语世界最重要的文化盛事。',
      figures: '维克多·雨果（Victor Hugo）的《悲惨世界》让巴黎的街道成为文学地标；西蒙娜·德·波伏娃（Simone de Beauvoir）与萨特在圣日耳曼咖啡馆重塑了20世纪的思想版图；可可·香奈儿（Coco Chanel）在巴黎创造了现代女性时尚；毕加索（Pablo Picasso）在巴黎完成了立体主义的革命。',
    },
    base: {
      wifi: '100 Mbps', cost: '$$$', visa: '90天申根免签',
      visaDays: '90天', visaDesc: '🛂 申根区90天免签，人才护照（Talent Passport）适合自由职业者与创业者申请长期居留。',
      welfare: '🏥 法国医疗体系全球顶尖，持有效居留许可者可加入社会保险（Sécurité Sociale）。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。法国人才护照（Passeport Talent）适合创意工作者和高技能人才申请长期居留，有效期4年，可续签。',
      dailyCost: '每日预算参考：\n• 餐饮：€25–45（咖啡馆午餐€15–20，晚餐€25–45）\n• 住宿：€60–100（市中心合租公寓，住宿成本较高）\n• 交通：€4–6（地铁单程€2.1，月票€86）\n• 合计：约€90–150/天',
      safety: '巴黎整体安全，但扒窃问题较为突出，尤其在埃菲尔铁塔、卢浮宫和地铁站。建议随身携带复印件，使用防盗包。部分郊区治安较差，建议避开。夜间独行在市中心整体安全。',
      society: '法国拥有全球最完善的社会保障体系之一，公共医疗（Sécurité Sociale）覆盖广泛。工作文化注重生活质量，法定带薪假期25天，35小时工作制是法律规定。法语是官方语言，法国人对语言有强烈的文化认同。'
    },
    chance: {
      paragraph: '巴黎是全球时尚、奢侈品与创意产业的中心，科技初创生态（Station F）快速崛起，英语工作机会日益增多。',
      policy: { label: 'Business France 投资促进', url: 'https://www.businessfrance.fr/discover-france-regulations', desc: '法国官方投资促进机构，提供商业法规与设立指南' },
      localJobs: [
        { name: 'Welcome to the Jungle', url: 'https://www.welcometothejungle.com', desc: '法国新兴招聘平台，注重公司文化展示' },
        { name: 'LinkedIn FR Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
        { name: 'Malt', url: 'https://www.malt.fr', desc: '法国领先自由职业平台，创意与科技人才首选' },
      ]
    },
    local: {
      paragraph: '巴黎的外籍人士社群以创意从业者和科技人才为主，Station F 周边聚集了大量初创圈子，社交机会丰富。',
      platforms: [
        { name: 'Meetup Paris', url: 'https://www.meetup.com/cities/fr/paris/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Paris', url: 'https://www.eventbrite.fr/d/france--paris/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
        { name: 'Station F Events', url: 'https://stationf.co', desc: '全球最大创业园区，巴黎初创生态核心' },
      ]
    }
  },
  Barcelona: {
    name: 'Barcelona', nameZh: '巴塞罗那', country: 'Spain', countryZh: '西班牙', flag: '🇪🇸', match: 86,
    soul: {
      headline: '地中海的激情与建筑的诗意在此交汇。',
      sub: '文化 · 建筑 · 美食 · 创意',
      body: '巴塞罗那是一座用建筑说话的城市。高迪的曲线、地中海的光线、加泰罗尼亚人的骄傲——这一切混合在一起，创造出一种独一无二的城市气质。',
      personality: '巴塞罗那的文化内核是加泰罗尼亚人的双重身份认同：他们既是西班牙人，又坚持自己是加泰罗尼亚人。这种张力催生了一种独特的文化能量——对自我表达的执着、对美的追求、对自由的渴望。巴塞罗那不只是一座城市，它是一种态度。',
      economy: '巴塞罗那是西班牙第二大经济中心，旅游业、科技初创（Mobile World Congress 永久举办地）、时尚设计与创意产业是主要支柱。加泰罗尼亚大区贡献了西班牙约20%的GDP，巴塞罗那是其经济引擎。',
      festivals: 'La Mercè（9月）是巴塞罗那最盛大的城市节日，人塔（Castellers）表演是加泰罗尼亚文化的象征；圣乔治节（Sant Jordi，4月23日）是加泰罗尼亚的情人节，全城互赠玫瑰与书籍；Primavera Sound 是欧洲最重要的独立音乐节之一；圣诞期间的 Fira de Santa Llúcia 是欧洲历史最悠久的圣诞市场。',
      figures: '安东尼·高迪（Antoni Gaudí）用圣家堂、奎尔公园重新定义了建筑的边界；胡安·米罗（Joan Miró）的超现实主义作品让巴塞罗那成为艺术圣地；费德里科·加西亚·洛尔迦（Federico García Lorca）在此度过了重要的创作岁月；当代厨神费兰·阿德里亚（Ferran Adrià）在巴塞罗那近郊创造了分子料理革命。',
    },
    base: {
      wifi: '95 Mbps', cost: '$$', visa: '90天申根免签',
      visaDays: '365天', visaDesc: '🛂 西班牙数字游民签证有效期1年，可续签至5年，适合月收入超过€2,334的远程工作者。',
      welfare: '🏥 西班牙公共医疗体系完善，持居留许可者可享受免费公立医疗，私立诊所英语服务普遍。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。西班牙数字游民签证有效期1年，可续签至5年，适合月收入超过€2,334的远程工作者。申请需提供收入证明、健康保险及无犯罪记录证明。',
      dailyCost: '每日预算参考：\n• 餐饮：€25–40（Tapas午餐€10–15，晚餐€20–30）\n• 住宿：€50–80（市中心合租公寓，按月租更划算）\n• 交通：€3–5（地铁单程€2.4，月票€40）\n• 合计：约€80–130/天',
      safety: '巴塞罗那整体安全，但扒窃问题较为突出，尤其在兰布拉大道、哥特区和地铁站。建议随身携带复印件而非原件，避免在人群密集处使用手机。夜间独行整体安全，但建议避开偏僻街道。',
      society: '西班牙拥有完善的公共医疗体系（SNS），持居留许可者可享受免费公立医疗。工作节奏较为悠闲，午休文化（Siesta）仍存在于部分行业。加泰罗尼亚地区有独特的文化认同，当地人普遍使用加泰罗尼亚语和西班牙语双语。'
    },
    chance: {
      paragraph: '巴塞罗那是欧洲最具活力的创意与科技中心之一，Mobile World Congress 每年在此举办，初创生态活跃，英语工作机会多。',
      policy: { label: 'ICEX 西班牙投资促进', url: 'https://www.investinspain.org/en/how-to-invest', desc: '西班牙官方投资促进机构，提供投资与创业指南' },
      localJobs: [
        { name: 'InfoJobs', url: 'https://www.infojobs.net', desc: '西班牙最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn ES Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
        { name: 'Workana', url: 'https://www.workana.com', desc: '拉美最大自由职业平台，西语市场首选' },
      ]
    },
    local: {
      paragraph: '巴塞罗那的游民社群充满活力，海滩、共享办公空间和各类创意活动让这里成为欧洲最受欢迎的游民目的地之一。',
      platforms: [
        { name: 'Meetup Barcelona', url: 'https://www.meetup.com/cities/es/barcelona/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Barcelona', url: 'https://www.eventbrite.es/d/spain--barcelona/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
        { name: 'Barcelona Activa', url: 'https://www.barcelonactiva.cat', desc: '巴塞罗那市政创业支持机构，提供资源与活动' },
      ]
    }
  },
  Porto: {
    name: 'Porto', nameZh: '波尔图', country: 'Portugal', countryZh: '葡萄牙', flag: '🇵🇹', match: 84,
    soul: {
      headline: '葡萄酒、花砖与大西洋风的慢城哲学。',
      sub: '文化 · 历史 · 美食 · 艺术',
      body: '波尔图是里斯本的另一面——更粗粝，更真实，更不在乎被看见。这里的花砖会剥落，这里的葡萄酒会让你忘记时间，这里的人会在你迷路时主动带你找到目的地。',
      personality: '波尔图人有一种北方葡萄牙人特有的骄傲与务实。他们不像里斯本人那样浪漫，但他们更直接、更真实。这座城市的文化内核是劳动者的尊严——波尔图是葡萄牙的工业心脏，也是法多音乐的另一个故乡，只是这里的法多更粗犷，更有力量。',
      economy: '波尔图的经济支柱包括葡萄酒产业（波特酒举世闻名）、旅游业、科技初创与创意产业。近年来，波尔图成为欧洲增长最快的科技城市之一，物价远低于里斯本，吸引大量远程工作者和创业者。',
      festivals: 'São João（6月23日）是波尔图最盛大的节日，全城人手持塑料锤互敲头顶，在杜罗河边放灯；波尔图国际电影节（Fantasporto）是欧洲最重要的奇幻电影节之一；NOS Primavera Sound 是波尔图版本的巴塞罗那音乐节；圣诞期间的杜罗河畔灯光秀是葡萄牙最美的节日景观。',
      figures: '诗人阿尔瓦罗·德·坎波斯（Álvaro de Campos，佩索阿的异名之一）以波尔图为精神故乡；作家若泽·萨拉马戈（José Saramago）在葡萄牙北部的文化土壤中成长；当代建筑师阿尔瓦罗·西扎（Álvaro Siza）以波尔图为基地，创作了影响全球的极简主义建筑；足球明星迪亚戈（Deco）是波尔图足球文化的象征。',
    },
    base: {
      wifi: '80 Mbps', cost: '$', visa: '90天申根免签',
      visaDays: '365天', visaDesc: '🛂 数字游民签证（D8）有效期1年，可续签，适合月收入超过€3,040的远程工作者。',
      welfare: '🏥 葡萄牙公共医疗系统（SNS）覆盖广泛，持 D8 签证可低价就医，生活成本远低于西欧。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。葡萄牙数字游民签证（D8）有效期1年，可续签，适合月收入超过€3,040的远程工作者。波尔图生活成本远低于里斯本，是申请D8签证的热门城市。',
      dailyCost: '每日预算参考：\n• 餐饮：€12–20（午餐套餐€7–10，晚餐€12–20）\n• 住宿：€25–50（市中心合租公寓，性价比高）\n• 交通：€2–3（地铁单程€1.5，月票€40）\n• 合计：约€40–75/天',
      safety: '波尔图整体安全，是葡萄牙治安最好的城市之一。需注意：旅游景点和地铁站有扒窃风险；夜间独行整体安全，当地人友善。女性独行安全感较高。',
      society: '葡萄牙公共医疗系统（SNS）覆盖广泛，持D8签证可低价就医。波尔图生活节奏比里斯本更悠闲，当地人务实而热情。英语在年轻人中普及，但老一辈葡萄牙人英语较弱。'
    },
    chance: {
      paragraph: '波尔图物价低廉、生活质量高，近年吸引大量远程工作者和创意人才，科技初创生态快速成长。',
      policy: { label: 'Startup Portugal 创业支持', url: 'https://www.startupportugal.com/startup-visa', desc: '葡萄牙官方创业签证与支持计划' },
      localJobs: [
        { name: 'Net-Empregos', url: 'https://www.net-empregos.com', desc: '葡萄牙最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn PT Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
        { name: 'Nomad List Jobs', url: 'https://nomadlist.com/jobs', desc: '数字游民社区旗下远程职位聚合平台' },
      ]
    },
    local: {
      paragraph: '波尔图的游民社群规模虽小于里斯本，但氛围更加紧密，本地人与外籍人士的融合度高，容易建立真实的人际连接。',
      platforms: [
        { name: 'Meetup Porto', url: 'https://www.meetup.com/cities/pt/porto/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Porto', url: 'https://www.eventbrite.pt/d/portugal--porto/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Dublin: {
    name: 'Dublin', nameZh: '都柏林', country: 'Ireland', countryZh: '爱尔兰', flag: '🇮🇪', match: 83,
    soul: {
      headline: '欧洲科技之都，文学与酒吧文化的故乡。',
      sub: '文化 · 科技 · 文学 · 社群',
      body: '都柏林是一座用故事建造的城市。从乔伊斯到贝克特，从吉尼斯到硅谷，这里的人天生擅长把生活变成值得讲述的东西。',
      personality: '爱尔兰人有一种独特的文化气质：他们用幽默对抗苦难，用故事消化历史。都柏林的酒吧不只是喝酒的地方，它是这座城市的客厅——人们在这里辩论政治、分享诗歌、结交朋友。这种开放与温暖，让都柏林成为欧洲最容易融入的城市之一。',
      economy: '都柏林是欧洲科技产业的重要枢纽，Google、Meta、Apple、LinkedIn 的欧洲总部均设于此，被称为"硅谷的欧洲前哨"。低企业税率（12.5%）吸引了大量跨国公司，金融服务与制药产业同样是重要支柱。',
      festivals: 'St. Patrick\'s Day（3月17日）是全球最著名的爱尔兰节日，都柏林的庆典是全球规模最大的之一；都柏林文学节（Dublin Literary Festival）向这座诺贝尔文学奖之城致敬；Bloomsday（6月16日）是纪念乔伊斯《尤利西斯》的文学朝圣日；都柏林国际电影节每年2月举行。',
      figures: '詹姆斯·乔伊斯（James Joyce）的《尤利西斯》将都柏林的一天变成了文学史上最伟大的实验；塞缪尔·贝克特（Samuel Beckett）在都柏林出生，后以《等待戈多》震撼世界；奥斯卡·王尔德（Oscar Wilde）是都柏林最著名的才子；U2 乐队从都柏林走向全球，成为爱尔兰文化最重要的当代符号。',
    },
    base: {
      wifi: '105 Mbps', cost: '$$$', visa: '90天免签（非申根）',
      visaDays: '90天', visaDesc: '🛂 爱尔兰非申根区，90天免签入境，创业签证（STEP）适合高潜力创业者申请长期居留。',
      welfare: '🏥 爱尔兰公共医疗（HSE）质量高，持有效签证可享受部分公共医疗服务，私立医疗保险推荐购买。',
      visaDetail: '爱尔兰非申根区，多数国家护照持有者可免签入境90天。创业签证（Start-Up Entrepreneur Programme, STEP）适合高潜力创业者申请长期居留，需提供商业计划书和资金证明。',
      dailyCost: '每日预算参考：\n• 餐饮：€25–45（午餐€12–18，晚餐€25–45）\n• 住宿：€70–120（市中心合租公寓，住宿成本极高）\n• 交通：€3–5（公交单程€2.6，月票€140）\n• 合计：约€100–170/天',
      safety: '都柏林整体安全，但部分区域（如北内城）治安较差。市中心夜间需注意扒窃，尤其在酒吧区（Temple Bar）。夜间独行建议选择灯光充足的路线，避开偏僻街道。',
      society: '爱尔兰拥有完善的公共医疗体系（HSE），但等待时间较长，私立医疗更为高效。工作文化友好开放，英语是官方语言，沟通无障碍。都柏林是欧洲科技公司（Google、Meta、Apple）欧洲总部的聚集地。'
    },
    chance: {
      paragraph: '都柏林是 Google、Meta、Apple 欧洲总部所在地，英语母语环境，科技与金融岗位密集，是进入欧洲市场的理想跳板。',
      policy: { label: 'IDA Ireland 外商投资促进', url: 'https://www.idaireland.com/invest-in-ireland', desc: '爱尔兰官方外商投资促进机构，提供投资支持与政策指南' },
      localJobs: [
        { name: 'IrishJobs.ie', url: 'https://www.irishjobs.ie', desc: '爱尔兰最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn IE Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
        { name: 'Toptal', url: 'https://www.toptal.com', desc: '顶尖自由职业者网络，严格筛选机制' },
      ]
    },
    local: {
      paragraph: '都柏林的科技社群以欧洲科技公司员工和创业者为主，酒吧文化让社交变得自然，英语母语环境大幅降低融入门槛。',
      platforms: [
        { name: 'Meetup Dublin', url: 'https://www.meetup.com/cities/ie/dublin/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Dublin', url: 'https://www.eventbrite.ie/d/ireland--dublin/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
        { name: 'Silicon Docks Events', url: 'https://www.siliconrepublic.com/events', desc: '都柏林科技圈活动聚合，初创与科技社群必备' },
      ]
    }
  },
  Dubrovnik: {
    name: 'Dubrovnik', nameZh: '杜布罗夫尼克', country: 'Croatia', countryZh: '克罗地亚', flag: '🇭🇷', match: 78,
    soul: {
      headline: '亚得里亚海的珍珠，城墙内的永恒时光。',
      sub: '文化 · 历史 · 海岸 · 美食',
      body: '杜布罗夫尼克是一座被城墙保护的时间胶囊。亚得里亚海的蓝色会让你忘记外面的世界，而城墙内的石板路会让你觉得，某些美好值得被永远保存。',
      personality: '杜布罗夫尼克的文化内核是一种对美的执着守护。这座城市在历史上多次遭受战争与地震的破坏，却每次都以惊人的意志力重建自己。克罗地亚人对这座城市有一种近乎神圣的情感——它不只是旅游景点，它是民族骄傲的具象化。',
      economy: '杜布罗夫尼克的经济高度依赖旅游业，《权力的游戏》拍摄地效应带来了全球知名度。克罗地亚加入欧盟后，外资涌入，房地产与高端旅游业快速发展。数字游民签证的推出，正在吸引更多远程工作者将此作为长期居住地。',
      festivals: '杜布罗夫尼克夏季艺术节（Dubrovnik Summer Festival，7-8月）是克罗地亚最重要的文化盛事，在城墙与广场上演戏剧、音乐与舞蹈；圣布莱斯节（Feast of St. Blaise，2月3日）是城市守护神的节日，全城游行庆祝；每年夏季的《权力的游戏》主题活动吸引全球粉丝朝圣。',
      figures: '马可·波罗（Marco Polo）据传出生于克罗地亚，与杜布罗夫尼克的海洋文化一脉相承；尼古拉·特斯拉（Nikola Tesla）是克罗地亚最著名的科学家，虽非杜布罗夫尼克人，却是整个民族的骄傲；当代导演达利博尔·马塔尼奇（Dalibor Matanić）将克罗地亚电影带上国际舞台。',
    },
    base: {
      wifi: '70 Mbps', cost: '$$', visa: '90天申根免签',
      visaDays: '365天', visaDesc: '🛂 克罗地亚数字游民签证有效期1年，不可续签，适合非欧盟公民远程工作者申请。',
      welfare: '🏥 克罗地亚医疗体系完善，公立医院覆盖基本需求，建议购买旅行医疗保险。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。克罗地亚数字游民签证有效期1年，不可续签，适合非欧盟公民远程工作者申请，需提供月收入超过€2,539的证明。',
      dailyCost: '每日预算参考：\n• 餐饮：€20–40（午餐€10–15，晚餐€20–40，旅游旺季价格更高）\n• 住宿：€40–80（旺季价格翻倍，淡季性价比高）\n• 交通：€3–5（公交单程€2，出租车较贵）\n• 合计：约€65–125/天（旺季更高）',
      safety: '杜布罗夫尼克整体安全，犯罪率极低。旅游旺季（6-9月）人流密集，需注意扒窃。夜间独行安全，当地人友善。建议避开旅游旺季的极度拥挤，选择淡季前往体验更真实的城市生活。',
      society: '克罗地亚拥有公共医疗体系（HZZO），持有效居留许可者可参与国家医保。工作文化较为悠闲，克罗地亚人重视家庭和社交。英语在旅游业和年轻人中普及，但日常生活中克罗地亚语为主。'
    },
    chance: {
      paragraph: '杜布罗夫尼克以旅游业为主，远程工作者可享受极高生活质量与低廉物价，克罗地亚数字游民签证是欧洲最早推出的之一。',
      policy: { label: 'HBOR 克罗地亚投资促进', url: 'https://www.hbor.hr/en/business-support/', desc: '克罗地亚官方发展银行，提供商业支持与融资服务' },
      localJobs: [
        { name: 'MojPosao', url: 'https://www.mojposao.hr', desc: '克罗地亚最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn HR Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
        { name: 'Nomad List Jobs', url: 'https://nomadlist.com/jobs', desc: '数字游民社区旗下远程职位聚合平台' },
      ]
    },
    local: {
      paragraph: '杜布罗夫尼克的游民社群以季节性为主，夏季活跃度极高，克罗地亚数字游民签证吸引了大量欧洲远程工作者。',
      platforms: [
        { name: 'Meetup Croatia', url: 'https://www.meetup.com/cities/hr/zagreb/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Croatia', url: 'https://www.eventbrite.com/d/croatia/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Florence: {
    name: 'Florence', nameZh: '佛罗伦萨', country: 'Italy', countryZh: '意大利', flag: '🇮🇹', match: 81,
    soul: {
      headline: '文艺复兴的摇篮，美与创造力的永恒源泉。',
      sub: '文化 · 艺术 · 美食 · 历史',
      body: '佛罗伦萨是一座让你相信美可以改变世界的城市。文艺复兴不是历史课本里的词条，而是你走在街上随时可以触摸到的空气。',
      personality: '佛罗伦萨的文化内核是美第奇家族留下的遗产：对美的赞助、对知识的尊重、对卓越的追求。这座城市的人相信，工艺是一种道德——无论是皮革匠人还是厨师，都以同样的严肃态度对待自己的手艺。这种精神让佛罗伦萨成为全球手工艺与设计的圣地。',
      economy: '佛罗伦萨的经济支柱包括旅游业、时尚与皮革工艺（Gucci、Ferragamo 均发源于此）、艺术品交易与教育产业。托斯卡纳大区的农业与葡萄酒（基安蒂）也是重要的经济来源。近年来，创意产业与科技初创正在为这座古城注入新的活力。',
      festivals: '卡尔切奥历史足球赛（Calcio Storico，6月）是文艺复兴时期流传下来的暴力足球比赛，是佛罗伦萨最独特的文化奇观；佛罗伦萨国际电影节（Florence Film Festival）每年秋季举行；复活节前夕的"爆炸车"（Scoppio del Carro）是延续600年的传统烟火仪式；每年5月的鸢尾花节（Iris Festival）在米开朗基罗广场举行。',
      figures: '列奥纳多·达·芬奇（Leonardo da Vinci）在佛罗伦萨接受训练并完成早期杰作；米开朗基罗（Michelangelo）在此雕刻了《大卫》；但丁·阿利吉耶里（Dante Alighieri）在佛罗伦萨出生，《神曲》奠定了意大利语文学的基础；伽利略（Galileo Galilei）在托斯卡纳的庇护下完成了他的科学革命。',
    },
    base: {
      wifi: '85 Mbps', cost: '$$', visa: '90天申根免签',
      visaDays: '365天', visaDesc: '🛂 意大利数字游民签证有效期1年，可续签，适合月收入超过€2,700的远程工作者。',
      welfare: '🏥 意大利国家医疗服务（SSN）覆盖广泛，持居留许可者可免费或低价就医，私立诊所质量高。',
      visaDetail: '🛂 意大利数字游民签证（Visto per Nomadi Digitali）有效期1年，可续签。申请条件：月收入≥€2,700，需提供远程工作合同或自雇证明、医疗保险、住房证明。申根区90天免签适合短期探访，长期居留需办理居留许可（Permesso di Soggiorno）。',
      dailyCost: '每日预算参考：\n• 餐饮：€25–45（含一顿正餐）\n• 住宿：€60–120（市中心公寓/月租€1,200–2,000）\n• 交通：€5–10（公交/步行为主）\n• 合计：约€90–175/天',
      safety: '🔒 佛罗伦萨整体安全，但游客区扒窃频发，尤其是乌菲兹美术馆、圣十字广场周边。夜间独行较安全，建议保管好随身物品。',
      society: '意大利人重视家庭、美食与社交，生活节奏悠闲。英语在旅游业和年轻人中普及，但日常生活以意大利语为主。外籍人士社群以艺术、设计和学术人士为主，融入本地生活需要一定意大利语基础。'
    },
    chance: {
      paragraph: '佛罗伦萨是全球时尚、皮革工艺与艺术设计的圣地，创意产业机会丰富，意大利语能力可大幅提升本地商业机会。',
      policy: { label: 'Invitalia 意大利投资促进', url: 'https://www.invitalia.it/en/what-we-do/support-for-businesses', desc: '意大利官方投资促进机构，提供企业支持与融资服务' },
      localJobs: [
        { name: 'InfoJobs IT', url: 'https://www.infojobs.it', desc: '意大利最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn IT Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
        { name: 'Freelancer.com', url: 'https://www.freelancer.com', desc: '全球最大自由职业接单平台，项目类型多样' },
      ]
    },
    local: {
      paragraph: '佛罗伦萨的外籍人士社群以艺术、设计和学术人士为主，意大利语能力可大幅提升融入深度，但英语社群同样活跃。',
      platforms: [
        { name: 'Meetup Florence', url: 'https://www.meetup.com/cities/it/florence/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Firenze', url: 'https://www.eventbrite.it/d/italy--florence/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Tallinn: {
    name: 'Tallinn', nameZh: '塔林', country: 'Estonia', countryZh: '爱沙尼亚', flag: '🇪🇪', match: 88,
    soul: {
      headline: '世界上数字化程度最高的古城。',
      sub: '文化 · 历史 · 节庆 · 经济支柱',
      body: '塔林是一座用中世纪的外壳装着未来的城市。当你站在老城的石板路上，口袋里的手机正在连接着全球最快的数字基础设施——这种反差，正是塔林最迷人的地方。',
      personality: '爱沙尼亚人有一种北欧式的内敛与务实，但在数字领域却异常大胆。这个只有130万人口的小国，创造了 Skype、TransferWise（Wise）、Bolt 等全球科技公司。塔林的文化内核是：用技术解决问题，用效率创造自由。e-Residency 项目是这种精神的最佳体现。',
      economy: '塔林是爱沙尼亚的经济中心，科技初创密度欧洲最高（按人均计算）。Skype 在此诞生，Wise、Bolt、Pipedrive 均发源于塔林。e-Residency 项目吸引全球创业者在爱沙尼亚注册欧盟公司，数字经济是国家战略核心。',
      festivals: '塔林老城节（Tallinn Old Town Days，6月）是中世纪文化的年度复活；爱沙尼亚歌唱节（Song Festival，每5年一届）是波罗的海国家最重要的文化仪式，1988年的歌唱革命正是从这里开始；塔林黑夜电影节（PÖFF）是欧洲最重要的电影节之一；圣诞市场在市政厅广场举行，是北欧最美的节日场景之一。',
      figures: '卡尔·罗伯特·雅各布森（Carl Robert Jakobson）是爱沙尼亚民族觉醒运动的领袖；Skype 联合创始人亚纳斯·弗里斯（Janus Friis）和尼克拉斯·曾斯特罗姆（Niklas Zennström）将塔林推向全球科技版图；当代作曲家阿沃·帕特（Arvo Pärt）的极简主义音乐享誉全球；e-Residency 项目创始人卡斯帕·科尔尤斯（Kaspar Korjus）重新定义了国家与公民的关系。',
    },
    base: {
      wifi: '110 Mbps', cost: '$', visa: '90天申根免签',
      visaDays: '365天', visaDesc: '🛂 爱沙尼亚数字游民签证有效期1年，e-Residency可在欧盟注册公司，全球首个此类签证。',
      welfare: '🏥 爱沙尼亚数字游民签证持有者须自行购买医疗保险，本地私立诊所费用合理。',
      visaDetail: '🛂 爱沙尼亚数字游民签证（Digital Nomad Visa）有效期1年，可续签。申请条件：月收入≥€3,504，需提供远程工作合同或自雇证明、医疗保险。e-Residency（电子居民）项目允许全球任何人在爱沙尼亚注册欧盟公司，无需实际居住，是数字创业者的首选。',
      dailyCost: '每日预算参考：\n• 餐饮：€15–30（含一顿正餐）\n• 住宿：€40–80（市中心公寓/月租€800–1,400）\n• 交通：€3–8（公交/步行为主）\n• 合计：约€58–118/天',
      safety: '🔒 塔林是欧洲最安全的城市之一，犯罪率极低。老城区夜间也较安全，但建议避免深夜独自前往偏僻区域。',
      society: '爱沙尼亚人内敛务实，重视个人空间与效率。英语普及率极高，尤其在科技和商业领域。塔林拥有欧洲最活跃的数字游民社群之一，e-Residency社区遍布全球，本地科技创业氛围浓厚。'
    },
    chance: {
      paragraph: '塔林是全球数字游民签证的发源地，科技初创密度欧洲最高，e-Residency 项目让远程经营欧盟公司成为现实。',
      policy: { label: 'e-Residency 数字创业计划', url: 'https://e-resident.gov.ee/start-a-company/', desc: '爱沙尼亚官方e-Residency计划，支持全球创业者在欧盟注册公司' },
      localJobs: [
        { name: 'CV.ee', url: 'https://www.cv.ee', desc: '爱沙尼亚最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn EE Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
        { name: 'Nomad List Jobs', url: 'https://nomadlist.com/jobs', desc: '数字游民社区旗下远程职位聚合平台' },
      ]
    },
    local: {
      paragraph: '塔林的数字游民社群是欧洲最具凝聚力的之一，e-Residency 持有者遍布全球，本地科技社群开放且国际化。',
      platforms: [
        { name: 'Meetup Tallinn', url: 'https://www.meetup.com/cities/ee/tallinn/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Tallinn', url: 'https://www.eventbrite.com/d/estonia--tallinn/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
}

export const CITY_LIST = ['Berlin', 'Amsterdam', 'Lisbon', 'BCN', 'Prague', 'Vienna', 'Tallinn']

export const GLOBAL_COMMUNITIES: { name: string; url: string; desc: string }[] = [
  { name: 'Nomad List Community', url: 'https://nomadlist.com/community', desc: '全球最大数字游民数据库与社区论坛' },
  { name: 'Digital Nomad Reddit', url: 'https://www.reddit.com/r/digitalnomad/', desc: 'Reddit 上最活跃的数字游民讨论社区' },
  { name: 'Dynamite Circle', url: 'https://www.tropicalmba.com/community/', desc: 'Tropical MBA 旗下付费精英游民社群' },
]
