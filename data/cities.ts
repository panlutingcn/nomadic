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
      welfare: '🏥 持有效签证可加入法定医保（GKV），公立医院覆盖广泛，费用较低。',
      safety: '柏林整体安全，犯罪率低于欧洲多数大城市。需注意：地铁站和夜间娱乐区（如 Görlitzer Park）有扒窃风险；独自夜行建议选择灯光充足的路线。女性独行整体安全感较高，当地人普遍尊重个人边界。',
      dailyCost: '每日预算参考：\n• 餐饮：$20–30（自煮早餐 + 午餐外食 + 偶尔下馆子）\n• 住宿：$40–60（Airbnb 单间或合租公寓，按月租更划算）\n• 交通：$5–8（月票约 $90，日均约 $3；偶尔打车）\n• 合计：约 $65–100/天',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。长期居留可申请自由职业签证（Freiberufler），需提供收入证明、德语能力证明（部分情况）及健康保险。审批周期2-4个月。',
      society: '德国拥有全球最完善的社会保障体系之一：法定医疗保险（GKV）覆盖广泛，失业保险、养老金制度健全。持有效工作签证或自雇许可的外籍人士可参与社保体系。德国人普遍重视工作与生活平衡（Work-Life Balance），法定带薪假期20天以上，社会整体节奏稳健而有序。',
    },
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
      paragraph: '柏林的社群文化极度多元，从科技创业者到艺术家，从环保活动家到电子音乐爱好者，总能找到同频的人。',
      platforms: [
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
    },
    base: {
      wifi: '120 Mbps', cost: '$$$', visa: '90天申根免签',
      welfare: '🏥 工作满一定时间可享受荷兰社保，医疗保险强制购买，质量高且报销比例大。'
    },
    chance: {
      paragraph: '阿姆斯特丹是欧洲科技初创与创意产业的重镇，英语普及率极高，对外籍人才极度友好。',
      policy: { label: 'DAFT 自雇签证（美国公民适用）', url: 'https://ind.nl/en/residence-permits/work/self-employment', desc: '荷兰自雇居留许可，DAFT 条约适用于美国公民' },
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
    },
    base: {
      wifi: '85 Mbps', cost: '$', visa: '90天申根免签',
      welfare: '🏥 持 D8 签证可访问公共医疗系统（SNS），费用低廉；长期居民可申请 NHR 税务优惠。'
    },
    chance: {
      paragraph: '里斯本物价低廉、气候宜人，已成为欧洲增长最快的数字游民聚集地，初创生态活跃。',
      policy: { label: '数字游民签证（D8 Visa）', url: 'https://vistos.mne.gov.pt/en/national-visas/required-documentation/passive-income', desc: '葡萄牙数字游民签证，适合远程收入者申请' },
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
    },
    base: {
      wifi: '74 Mbps', cost: '$', visa: '30天落地签',
      welfare: '🏥 外籍人士不纳入泰国社保体系，建议自行购买国际医疗保险，费用约 $50–$150/月。'
    },
    chance: {
      paragraph: '曼谷是东南亚商业枢纽，共享办公空间密集，消费成本极低，适合刚起步的数字游民。',
      policy: { label: 'LTR 长期居留签证（高收入远程工作者）', url: 'https://ltr.boi.go.th/en/index.html', desc: '泰国高收入远程工作者长期居留签证' },
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
    },
    base: {
      wifi: '80 Mbps', cost: '$', visa: '90天申根免签',
      welfare: '🏥 申根区内医疗资源完善，建议购买旅行医疗保险，私立诊所英语服务良好。'
    },
    chance: {
      paragraph: '布拉格物价低于西欧三分之一，科技初创生态快速崛起，吸引大量欧洲远程工作者定居。',
      policy: { label: '自由职业贸易许可证（Živnostenský list）', url: 'https://www.businessinfo.cz/en/starting-business/', desc: '捷克自由职业贸易许可证，适合自雇人士' },
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
    },
    base: {
      wifi: '90 Mbps', cost: '$$$', visa: '90天申根免签',
      welfare: '🏥 奥地利医疗体系完善，持有效居留许可者可参加社会保险，公立医疗质量极高。'
    },
    chance: {
      paragraph: '维也纳是中欧商业中心，金融与文化创意产业并重，生活质量连续多年全球排名第一。',
      policy: { label: '奥地利红白红卡（自雇类别）', url: 'https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/self-employed-key-workers/', desc: '奥地利自雇类居留许可，适合高技能人才' },
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
    },
    base: {
      wifi: '100 Mbps', cost: '$$$', visa: '90天申根免签',
      welfare: '🏥 法国医疗体系全球顶尖，持有效居留许可者可加入社会保险（Sécurité Sociale）。'
    },
    chance: {
      paragraph: '巴黎是全球时尚、奢侈品与创意产业的中心，科技初创生态（Station F）快速崛起，英语工作机会日益增多。',
      policy: { label: '法国自由职业签证（Talent Passport）', url: 'https://www.service-public.fr/particuliers/vosdroits/F16922', desc: '法国人才护照，适合自由职业者与创业者' },
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
    },
    base: {
      wifi: '95 Mbps', cost: '$$', visa: '90天申根免签',
      welfare: '🏥 西班牙公共医疗体系完善，持居留许可者可享受免费公立医疗，私立诊所英语服务普遍。'
    },
    chance: {
      paragraph: '巴塞罗那是欧洲最具活力的创意与科技中心之一，Mobile World Congress 每年在此举办，初创生态活跃，英语工作机会多。',
      policy: { label: '西班牙数字游民签证', url: 'https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Detalle-ficha-consular.aspx', desc: '西班牙数字游民签证，适合远程工作者申请' },
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
    },
    base: {
      wifi: '80 Mbps', cost: '$', visa: '90天申根免签',
      welfare: '🏥 葡萄牙公共医疗系统（SNS）覆盖广泛，持 D8 签证可低价就医，生活成本远低于西欧。'
    },
    chance: {
      paragraph: '波尔图物价低廉、生活质量高，近年吸引大量远程工作者和创意人才，科技初创生态快速成长。',
      policy: { label: '葡萄牙数字游民签证（D8）', url: 'https://vistos.mne.gov.pt/en/national-visas/required-documentation/passive-income', desc: '葡萄牙数字游民签证，适合远程收入者申请' },
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
    },
    base: {
      wifi: '105 Mbps', cost: '$$$', visa: '90天免签（非申根）',
      welfare: '🏥 爱尔兰公共医疗（HSE）质量高，持有效签证可享受部分公共医疗服务，私立医疗保险推荐购买。'
    },
    chance: {
      paragraph: '都柏林是 Google、Meta、Apple 欧洲总部所在地，英语母语环境，科技与金融岗位密集，是进入欧洲市场的理想跳板。',
      policy: { label: '爱尔兰创业签证（Start-up Entrepreneur Programme）', url: 'https://enterprise.gov.ie/en/what-we-do/supports-for-smes/start-up-entrepreneur-programme/', desc: '爱尔兰创业签证，适合高潜力创业者申请' },
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
    },
    base: {
      wifi: '70 Mbps', cost: '$$', visa: '90天申根免签',
      welfare: '🏥 克罗地亚医疗体系完善，公立医院覆盖基本需求，建议购买旅行医疗保险。'
    },
    chance: {
      paragraph: '杜布罗夫尼克以旅游业为主，远程工作者可享受极高生活质量与低廉物价，克罗地亚数字游民签证是欧洲最早推出的之一。',
      policy: { label: '克罗地亚数字游民签证', url: 'https://mup.gov.hr/aliens-281621/stay-and-work/temporary-stay-of-digital-nomads/286833', desc: '克罗地亚数字游民签证，欧洲最早推出之一' },
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
    },
    base: {
      wifi: '85 Mbps', cost: '$$', visa: '90天申根免签',
      welfare: '🏥 意大利国家医疗服务（SSN）覆盖广泛，持居留许可者可免费或低价就医，私立诊所质量高。'
    },
    chance: {
      paragraph: '佛罗伦萨是全球时尚、皮革工艺与艺术设计的圣地，创意产业机会丰富，意大利语能力可大幅提升本地商业机会。',
      policy: { label: '意大利数字游民签证', url: 'https://www.esteri.it/en/servizi-consolari-e-visti/stranieri-in-italia/visti-per-lItalia/', desc: '意大利数字游民签证，适合远程工作者申请' },
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
    },
    base: {
      wifi: '110 Mbps', cost: '$', visa: '90天申根免签',
      welfare: '🏥 爱沙尼亚数字游民签证持有者须自行购买医疗保险，本地私立诊所费用合理。'
    },
    chance: {
      paragraph: '塔林是全球数字游民签证的发源地，科技初创密度欧洲最高，e-Residency 项目让远程经营欧盟公司成为现实。',
      policy: { label: '数字游民签证（Digital Nomad Visa）', url: 'https://www.politsei.ee/en/instructions/digital-nomad-visa', desc: '爱沙尼亚数字游民签证，全球首个此类签证' },
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
