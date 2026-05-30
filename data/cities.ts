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
  landing: {
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
    housing?: string
    housingLinks?: { name: string; url: string; desc?: string }[]
  }
  chance: {
    paragraph: string
    policy: { label: string; url: string; desc?: string }
    localJobs: { name: string; url: string; desc?: string }[]
    remoteJobs: { name: string; url: string; desc?: string }[]
  }
  community: {
    paragraph?: string
    platforms: { name: string; url: string; desc?: string }[]
    zhCommunity?: string
    zhCommunityLinks?: { name: string; url: string }[]
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
    landing: {
      wifi: '98 Mbps', cost: '$$', visa: '90天申根免签',
      visaDays: '90天', visaDesc: '🛂 申根区90天免签，自由职业签证（Freiberufler）可长期居留，审批周期2-4个月。',
      welfare: '🏥 持有效签证可加入法定医保（GKV），公立医院覆盖广泛，费用较低。',
      safety: '柏林整体安全，犯罪率低于欧洲多数大城市。需注意：地铁站和夜间娱乐区（如 Görlitzer Park）有扒窃风险；独自夜行建议选择灯光充足的路线。女性独行整体安全感较高，当地人普遍尊重个人边界。',
      dailyCost: '每日预算参考：\n• 餐饮：$20–30（自煮早餐 + 午餐外食 + 偶尔下馆子）\n• 住宿：$40–60（Airbnb 单间或合租公寓，按月租更划算）\n• 交通：$5–8（月票约 $90，日均约 $3；偶尔打车）\n• 合计：约 $65–100/天',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。长期居留可申请自由职业签证（Freiberufler），需提供收入证明、德语能力证明（部分情况）及健康保险。审批周期2-4个月。',
      society: '德国拥有全球最完善的社会保障体系之一：法定医疗保险（GKV）覆盖广泛，失业保险、养老金制度健全。持有效工作签证或自雇许可的外籍人士可参与社保体系。德国人普遍重视工作与生活平衡（Work-Life Balance），法定带薪假期20天以上，社会整体节奏稳健而有序。',
      housing: '主要租房平台：Immobilienscout24（长租主流）、WG-Gesucht（合租首选）、Airbnb / Wunderflats（短租）。押金通常为3个月冷租金，合同以德语签署，建议请人翻译核查。柏林住房市场竞争激烈，旺季（7–9月）尤甚，建议提前2–3个月开始找房，准备好收入证明、身份证件及Schufa信用报告。月租参考：合租单间 €600–900，独立一居室 €1,100–1,600。',
      housingLinks: [
        { name: 'Immobilienscout24', url: 'https://www.immobilienscout24.de', desc: '德国最大长租平台，覆盖公寓与独立屋' },
        { name: 'WG-Gesucht', url: 'https://www.wg-gesucht.de', desc: '德语区合租信息首选，适合共享公寓找房' },
        { name: 'Wunderflats', url: 'https://www.wunderflats.com', desc: '短中租专属平台，外籍友好，支持英语签约' },
      ],
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
    community: {
      paragraph: '柏林的社群文化极度多元，从科技创业者到艺术家，从环保活动家到电子音乐爱好者，总能找到同频的人。',
      platforms: [
        { name: 'Meetup Berlin', url: 'https://www.meetup.com/cities/de/berlin/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Berlin', url: 'https://www.eventbrite.de/d/germany--berlin/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
        { name: 'Berlin Startup Jobs Events', url: 'https://berlinstartupjobs.com/events/', desc: '柏林创业圈活动与招聘信息聚合' },
      ],
      zhCommunity: '柏林华人圈以留学生、科技从业者和艺术家为主，社群相当活跃。小红书搜索「柏林旅居」「柏林生活」可找到最新攻略和本地旅居者；知乎有大量德国签证、租房、自雇经验分享。微信群入口可在小红书评论区或各类柏林旅居帖子中获取邀请链接。柏林华人微信互助群通常覆盖租房、二手物品交易、活动组织等实用信息。',
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
    landing: {
      wifi: '120 Mbps', cost: '$$$', visa: '90天申根免签',
      visaDays: '90天', visaDesc: '🛂 申根区90天免签，荷兰自雇居留许可（DAFT）适合美国公民，其他国籍可申请创业签证。',
      welfare: '🏥 工作满一定时间可享受荷兰社保，医疗保险强制购买，质量高且报销比例大。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。荷兰自雇居留许可（DAFT）适合美国公民，其他国籍可申请创业签证（Startup Visa）或高技能移民签证（Highly Skilled Migrant），需提供商业计划书或雇主担保。',
      dailyCost: '每日预算参考：\n• 餐饮：€25–40（咖啡馆午餐€12–18，晚餐€20–35）\n• 住宿：€60–100（市中心合租公寓，住宿成本较高）\n• 交通：€3–5（地铁/电车单程€3.2，月票€100）\n• 合计：约€90–150/天',
      safety: '阿姆斯特丹整体安全，犯罪率低。需注意：红灯区和中央火车站周边有扒窃风险；骑行时注意自行车盗窃（建议使用两把锁）。夜间独行整体安全，当地人普遍友善。',
      society: '荷兰拥有完善的社会保障体系，公共医疗（Zorgverzekering）为强制保险，居民须自行购买基础医保。工作文化注重效率与平衡，直接沟通是荷兰人的特点。英语普及率极高，几乎所有人都能流利交流。',
      housing: '主要租房平台：Funda（长租主流）、Kamernet（合租）、HousingAnywhere（短中租，对外籍友好）。阿姆斯特丹住房市场极度紧张，是欧洲最难找房的城市之一，建议提前3个月以上开始找房。押金通常为1–2个月租金，房东普遍要求月收入为租金3倍的证明，部分房东要求荷兰本地担保人。月租参考：合租单间 €800–1,200，独立一居室 €1,600–2,400。短租可考虑 Airbnb 或 Wunderflats 过渡，但长期性价比差。',
      housingLinks: [
        { name: 'Funda', url: 'https://www.funda.nl', desc: '荷兰最大租房平台，覆盖各类长租公寓' },
        { name: 'Kamernet', url: 'https://kamernet.nl', desc: '荷兰合租房源聚合，适合独立卧室找房' },
        { name: 'HousingAnywhere', url: 'https://housinganywhere.com', desc: '短中租平台，外籍人士友好，支持英语签约' },
      ],
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
    community: {
      paragraph: '阿姆斯特丹的外籍人士社群成熟活跃，英语是通用语言，各类专业社群和兴趣小组让融入变得轻松自然。',
      platforms: [
        { name: 'Meetup Amsterdam', url: 'https://www.meetup.com/cities/nl/amsterdam/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Amsterdam', url: 'https://www.eventbrite.nl/d/netherlands--amsterdam/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ],
      zhCommunity: '阿姆斯特丹华人圈以科技从业者、金融人士和留学生为主。小红书搜索「阿姆斯特丹旅居」「荷兰生活」可找到实用攻略；知乎有大量荷兰签证、租房、税务经验。华人微信互助群涵盖租房资源、二手物品和活动信息，入口可在小红书相关帖子评论区获取。荷兰整体国际化程度极高，与外籍社群融合比较自然。',
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
    landing: {
      wifi: '85 Mbps', cost: '$', visa: '90天申根免签',
      visaDays: '365天', visaDesc: '🛂 数字游民签证（D8）有效期1年，可续签，适合月收入超过€3,040的远程工作者。',
      welfare: '🏥 持 D8 签证可访问公共医疗系统（SNS），费用低廉；长期居民可申请 NHR 税务优惠。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。葡萄牙数字游民签证（D8）有效期1年，可续签，适合月收入超过€3,040的远程工作者。申请需提供收入证明、健康保险及住址证明。',
      dailyCost: '每日预算参考：\n• 餐饮：€15–25（午餐套餐€8–12，晚餐€15–25）\n• 住宿：€35–60（市中心合租公寓，近年价格上涨明显）\n• 交通：€2–4（地铁单程€1.5，月票€40）\n• 合计：约€55–90/天',
      safety: '里斯本整体安全，是欧洲治安较好的首都之一。需注意：阿尔法玛区和旅游景点有扒窃风险；夜间独行整体安全，当地人友善。女性独行安全感较高。',
      society: '葡萄牙公共医疗系统（SNS）覆盖广泛，持D8签证可低价就医。生活节奏悠闲，葡萄牙人重视家庭与社交。英语在年轻人和旅游业从业者中普及，但老一辈葡萄牙人英语较弱。',
      housing: '主要租房平台：Idealista（葡萄牙最大租房平台）、OLX（二手兼租房）、Uniplaces（学生/短租友好）。里斯本租房市场近年竞争显著加剧，建议提前1–2个月找房，准备好护照、收入证明和银行流水。押金通常为2个月租金，合同以葡萄牙语签署。月租参考：合租单间 €500–800，独立一居室 €900–1,400。市中心（Chiado、Príncipe Real）价格最贵，Santos、Mouraria等区性价比更高。',
      housingLinks: [
        { name: 'Idealista', url: 'https://www.idealista.pt', desc: '葡萄牙最大租房平台，长短租均有覆盖' },
        { name: 'OLX', url: 'https://www.olx.pt', desc: '分类广告平台，含个人直租房源，价格透明' },
        { name: 'Uniplaces', url: 'https://www.uniplaces.com', desc: '面向学生与短租用户，外籍友好，支持英语' },
      ],
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
    community: {
      paragraph: '里斯本的数字游民社群是欧洲最活跃的之一，共享办公空间遍布全城，游民聚会几乎每周都有。',
      platforms: [
        { name: 'Meetup Lisbon', url: 'https://www.meetup.com/cities/pt/lisbon/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Lisboa', url: 'https://www.eventbrite.pt/d/portugal--lisbon/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ],
      zhCommunity: '里斯本华人旅居圈近年快速扩大，是欧洲华人游民最活跃的城市之一。小红书搜索「里斯本旅居」「葡萄牙D8签证」可获取大量一手经验；微博、知乎上葡萄牙生活社区活跃。华人微信群覆盖租房、签证、税务等实用话题，入口可在小红书相关帖子评论区或里斯本华人互助社区找到。部分共享工作空间（如Heden、Second Home）已有固定华人游民圈子。',
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
    landing: {
      wifi: '80 Mbps', cost: '$', visa: '90天申根免签',
      visaDays: '90天', visaDesc: '🛂 申根区90天免签，自由职业贸易许可证（Živnostenský list）可合法自雇经营。',
      welfare: '🏥 申根区内医疗资源完善，建议购买旅行医疗保险，私立诊所英语服务良好。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。捷克自由职业贸易许可证（Živnostenský list）可合法自雇经营，申请相对简便，是欧洲最友好的自雇制度之一。',
      dailyCost: '每日预算参考：\n• 餐饮：Kč200–400（午餐套餐Kč150–200，晚餐Kč250–400）\n• 住宿：Kč800–1500（市中心合租公寓）\n• 交通：Kč30–50（地铁单程Kč30，月票Kč550）\n• 合计：约Kč1,100–2,000/天（约$50–90）',
      safety: '布拉格整体安全，犯罪率低。需注意：老城广场和查理大桥周边有扒窃风险；夜间独行整体安全，但建议避开偏僻街道。出租车建议使用Bolt或Uber，避免路边拦车。',
      society: '捷克拥有完善的公共医疗体系，持有效居留许可者可参与国家医保。工作文化务实，捷克人普遍重视工作与生活平衡。英语在年轻人和商业环境中普及，但日常生活中捷克语为主。',
      housing: '主要租房平台：Sreality.cz（捷克最大租房平台）、Bezrealitky（无中介直租）、Facebook群组「Prague Expats Accommodation」。布拉格租房市场相对宽松，外籍人士找房难度中等。押金通常为1–3个月，合同以捷克语签署，建议找人翻译。月租参考：合租单间 Kč8,000–14,000，独立一居室 Kč18,000–28,000（约€700–1,100）。Žižkov、Vinohrady、Smíchov区性价比好且生活便利。',
      housingLinks: [
        { name: 'Sreality.cz', url: 'https://www.sreality.cz', desc: '捷克最大租房平台，长租房源最全' },
        { name: 'Bezrealitky', url: 'https://www.bezrealitky.cz', desc: '无中介直租平台，省去代理费，性价比高' },
      ],
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
    community: {
      paragraph: '布拉格的外籍人士社群以欧洲远程工作者为主，价格亲民的共享办公空间和活跃的创业社群让融入变得容易。',
      platforms: [
        { name: 'Meetup Prague', url: 'https://www.meetup.com/cities/cz/prague/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Prague', url: 'https://www.eventbrite.com/d/czech-republic--prague/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ],
      zhCommunity: '布拉格华人圈以留学生和远程工作者为主，规模适中但互助性强。小红书搜索「布拉格旅居」「捷克生活」可找到租房、签证攻略；知乎上有关捷克自雇许可（živnostenský list）的详细分享。华人微信互助群主要覆盖租房资源和日常生活信息，规模小于西欧城市，融入本地国际社群是更主流的社交方式。',
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
    landing: {
      wifi: '90 Mbps', cost: '$$$', visa: '90天申根免签',
      visaDays: '90天', visaDesc: '🛂 申根区90天免签，红白红卡（自雇类别）适合高技能人才申请长期居留。',
      welfare: '🏥 奥地利医疗体系完善，持有效居留许可者可参加社会保险，公立医疗质量极高。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。奥地利人才护照（Talent Passport）适合自由职业者与创业者申请长期居留，需提供收入证明和专业资质。',
      dailyCost: '每日预算参考：\n• 餐饮：€20–35（咖啡馆午餐€12–18，晚餐€20–35）\n• 住宿：€50–80（市中心合租公寓）\n• 交通：€3–5（地铁单程€2.4，月票€51）\n• 合计：约€75–120/天',
      safety: '维也纳是全球最安全的城市之一，犯罪率极低。公共交通安全可靠，夜间独行无忧。需注意：中央火车站周边偶有扒窃，保管好随身物品即可。',
      society: '奥地利拥有全球顶尖的社会保障体系，公共医疗（Krankenversicherung）覆盖广泛。工作文化正式而高效，奥地利人重视隐私和个人边界。德语是官方语言，英语在商业环境中普及。',
      housing: '主要租房平台：Willhaben（奥地利最大平台）、ImmobilienScout24、Wohnungsbörse。维也纳有大量市政公寓（Gemeindebau），但外籍人士通常需通过私人市场找房。押金通常为3个月，合同以德语签署。月租参考：合租单间 €700–1,000，独立一居室 €1,100–1,700。建议避开旅游旺季（7–8月）找房，竞争更激烈。1区（内城）最贵，7区（Neubau）、8区（Josefstadt）文艺气息浓且价格适中。',
      housingLinks: [
        { name: 'Willhaben', url: 'https://www.willhaben.at', desc: '奥地利最大综合平台，租房与二手均覆盖' },
        { name: 'ImmobilienScout24', url: 'https://www.immobilienscout24.de', desc: '德语区长租主流平台，覆盖维也纳各区' },
        { name: 'Wohnungsbörse', url: 'https://www.wohnungsboerse.net', desc: '奥地利租房搜索引擎，汇聚多平台房源' },
      ],
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
    community: {
      paragraph: '维也纳的社群文化相对内敛，但外籍专业人士圈子成熟，文化活动丰富，适合喜欢高质量社交的游民。',
      platforms: [
        { name: 'Meetup Vienna', url: 'https://www.meetup.com/cities/at/vienna/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Vienna', url: 'https://www.eventbrite.at/d/austria--vienna/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ],
      zhCommunity: '维也纳华人圈以留学生、音乐学院学生和外交/国际机构从业者为主，社群相对精英化。小红书搜索「维也纳旅居」「奥地利生活」可找到签证和生活经验分享；知乎上奥地利人才签证话题有详细讨论。华人微信群活跃度中等，覆盖租房和文化活动。维也纳中文学校和春节晚会是华人圈固定社交节点。',
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
    landing: {
      wifi: '100 Mbps', cost: '$$$', visa: '90天申根免签',
      visaDays: '90天', visaDesc: '🛂 申根区90天免签，人才护照（Talent Passport）适合自由职业者与创业者申请长期居留。',
      welfare: '🏥 法国医疗体系全球顶尖，持有效居留许可者可加入社会保险（Sécurité Sociale）。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。法国人才护照（Passeport Talent）适合创意工作者和高技能人才申请长期居留，有效期4年，可续签。',
      dailyCost: '每日预算参考：\n• 餐饮：€25–45（咖啡馆午餐€15–20，晚餐€25–45）\n• 住宿：€60–100（市中心合租公寓，住宿成本较高）\n• 交通：€4–6（地铁单程€2.1，月票€86）\n• 合计：约€90–150/天',
      safety: '巴黎整体安全，但扒窃问题较为突出，尤其在埃菲尔铁塔、卢浮宫和地铁站。建议随身携带复印件，使用防盗包。部分郊区治安较差，建议避开。夜间独行在市中心整体安全。',
      society: '法国拥有全球最完善的社会保障体系之一，公共医疗（Sécurité Sociale）覆盖广泛。工作文化注重生活质量，法定带薪假期25天，35小时工作制是法律规定。法语是官方语言，法国人对语言有强烈的文化认同。',
      housing: '主要租房平台：SeLoger（法国最大租房平台）、Le Bon Coin（兼分类广告）、Spotahome（短中租，对外籍友好）。巴黎住房市场竞争激烈，房东通常要求收入证明为月租3倍。外籍人士无法提供法国担保人时，可使用 Visale（政府免费担保服务）或 Garantme。押金通常为1–2个月。月租参考：合租单间 €800–1,200，独立一居室 €1,400–2,200。10–11区、18区（蒙马特）性价比相对较好。',
      housingLinks: [
        { name: 'SeLoger', url: 'https://www.seloger.com', desc: '法国最大租房平台，长租房源最全面' },
        { name: 'Le Bon Coin', url: 'https://www.leboncoin.fr', desc: '法国最大分类广告平台，含个人直租房源' },
        { name: 'Spotahome', url: 'https://www.spotahome.com', desc: '中短租平台，外籍人士友好，提供视频看房' },
        { name: 'Visale', url: 'https://www.visale.fr', desc: '法国政府免费担保服务，解决无本地担保人问题' },
        { name: 'Garantme', url: 'https://garantme.fr', desc: '商业担保平台，帮助外籍人士通过房东租房审核' },
      ],
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
    community: {
      paragraph: '巴黎的外籍人士社群以创意从业者和科技人才为主，Station F 周边聚集了大量初创圈子，社交机会丰富。',
      platforms: [
        { name: 'Meetup Paris', url: 'https://www.meetup.com/cities/fr/paris/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Paris', url: 'https://www.eventbrite.fr/d/france--paris/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
        { name: 'Station F Events', url: 'https://stationf.co', desc: '全球最大创业园区，巴黎初创生态核心' },
      ],
      zhCommunity: '巴黎华人圈规模庞大，是欧洲最大的华人聚居地之一（主要在13区唐人街）。小红书搜索「巴黎旅居」「法国旅居」有海量攻略；微博和微信公众号「巴黎生活圈」「旅法华人」等有实时资讯。巴黎华人微信群极为活跃，覆盖租房、法语课、创业等各类主题，建议加入小红书评论区曝光的活跃群组。旅法华人圈分层明显——留学生、创业者、时尚从业者各有圈子。',
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
    landing: {
      wifi: '95 Mbps', cost: '$$', visa: '90天申根免签',
      visaDays: '365天', visaDesc: '🛂 西班牙数字游民签证有效期1年，可续签至5年，适合月收入超过€2,334的远程工作者。',
      welfare: '🏥 西班牙公共医疗体系完善，持居留许可者可享受免费公立医疗，私立诊所英语服务普遍。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。西班牙数字游民签证有效期1年，可续签至5年，适合月收入超过€2,334的远程工作者。申请需提供收入证明、健康保险及无犯罪记录证明。',
      dailyCost: '每日预算参考：\n• 餐饮：€25–40（Tapas午餐€10–15，晚餐€20–30）\n• 住宿：€50–80（市中心合租公寓，按月租更划算）\n• 交通：€3–5（地铁单程€2.4，月票€40）\n• 合计：约€80–130/天',
      safety: '巴塞罗那整体安全，但扒窃问题较为突出，尤其在兰布拉大道、哥特区和地铁站。建议随身携带复印件而非原件，避免在人群密集处使用手机。夜间独行整体安全，但建议避开偏僻街道。',
      society: '西班牙拥有完善的公共医疗体系（SNS），持居留许可者可享受免费公立医疗。工作节奏较为悠闲，午休文化（Siesta）仍存在于部分行业。加泰罗尼亚地区有独特的文化认同，当地人普遍使用加泰罗尼亚语和西班牙语双语。',
      housing: '主要租房平台：Idealista（西班牙最大租房平台）、Fotocasa、Habitaclia（加泰罗尼亚本地平台）、Airbnb（短租）。巴塞罗那租房竞争近年加剧，数字游民涌入推高了房价。押金通常为2个月，合同以西班牙语或加泰罗尼亚语签署。月租参考：合租单间 €600–950，独立一居室 €1,100–1,800。Gràcia、Poble Sec、Sants等区生活气息浓且性价比高，避开Eixample和哥特区（价格最贵）。',
      housingLinks: [
        { name: 'Idealista', url: 'https://www.idealista.es', desc: '西班牙最大租房平台，巴塞罗那房源最全' },
        { name: 'Fotocasa', url: 'https://www.fotocasa.es', desc: '西班牙主流租房平台，覆盖公寓与独立屋' },
        { name: 'Habitaclia', url: 'https://www.habitaclia.com', desc: '加泰罗尼亚本地主流平台，本地房源丰富' },
      ],
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
    community: {
      paragraph: '巴塞罗那的游民社群充满活力，海滩、共享办公空间和各类创意活动让这里成为欧洲最受欢迎的游民目的地之一。',
      platforms: [
        { name: 'Meetup Barcelona', url: 'https://www.meetup.com/cities/es/barcelona/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Barcelona', url: 'https://www.eventbrite.es/d/spain--barcelona/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
        { name: 'Barcelona Activa', url: 'https://www.barcelonactiva.cat', desc: '巴塞罗那市政创业支持机构，提供资源与活动' },
      ],
      zhCommunity: '巴塞罗那华人圈以创意从业者、电商运营者和数字游民为主，气氛轻松开放。小红书搜索「巴塞罗那旅居」「西班牙数字游民签证」有大量经验帖；微信公众号「在巴塞」「巴塞华人」等有本地资讯。华人微信互助群覆盖租房、签证和本地活动，在小红书帖子评论区或留学论坛可找入口。Barcelona Tech City的国际科技圈是与本地外籍社群融合的好入口。',
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
    landing: {
      wifi: '80 Mbps', cost: '$', visa: '90天申根免签',
      visaDays: '365天', visaDesc: '🛂 数字游民签证（D8）有效期1年，可续签，适合月收入超过€3,040的远程工作者。',
      welfare: '🏥 葡萄牙公共医疗系统（SNS）覆盖广泛，持 D8 签证可低价就医，生活成本远低于西欧。',
      visaDetail: '申根区90天免签适用于多数国家护照持有者。葡萄牙数字游民签证（D8）有效期1年，可续签，适合月收入超过€3,040的远程工作者。波尔图生活成本远低于里斯本，是申请D8签证的热门城市。',
      dailyCost: '每日预算参考：\n• 餐饮：€12–20（午餐套餐€7–10，晚餐€12–20）\n• 住宿：€25–50（市中心合租公寓，性价比高）\n• 交通：€2–3（地铁单程€1.5，月票€40）\n• 合计：约€40–75/天',
      safety: '波尔图整体安全，是葡萄牙治安最好的城市之一。需注意：旅游景点和地铁站有扒窃风险；夜间独行整体安全，当地人友善。女性独行安全感较高。',
      society: '葡萄牙公共医疗系统（SNS）覆盖广泛，持D8签证可低价就医。波尔图生活节奏比里斯本更悠闲，当地人务实而热情。英语在年轻人中普及，但老一辈葡萄牙人英语较弱。',
      housing: '主要租房平台：Idealista、OLX、Uniplaces。波尔图租房市场比里斯本宽松，价格也明显更低。押金通常为2个月，合同以葡萄牙语签署。月租参考：合租单间 €350–550，独立一居室 €650–1,000。Bonfim、Paranhos等区性价比出众，Ribeira历史区最贵。外籍旅居者聚集度高，找房信息也较易在本地游民社群获取。',
      housingLinks: [
        { name: 'Idealista', url: 'https://www.idealista.pt', desc: '葡萄牙最大租房平台，长短租均有覆盖' },
        { name: 'OLX', url: 'https://www.olx.pt', desc: '分类广告平台，含个人直租房源，价格透明' },
        { name: 'Uniplaces', url: 'https://www.uniplaces.com', desc: '面向学生与短租用户，外籍友好，支持英语' },
      ],
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
    community: {
      paragraph: '波尔图的游民社群规模虽小于里斯本，但氛围更加紧密，本地人与外籍人士的融合度高，容易建立真实的人际连接。',
      platforms: [
        { name: 'Meetup Porto', url: 'https://www.meetup.com/cities/pt/porto/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Porto', url: 'https://www.eventbrite.pt/d/portugal--porto/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ],
      zhCommunity: '波尔图华人旅居圈规模小于里斯本，但正在快速成长，氛围更加紧密友好。小红书搜索「波尔图旅居」「波尔图生活」可找到近期经验分享；里斯本华人群组中也有不少人同时覆盖波尔图信息。华人微信互助群规模较小但互助性强，推荐先从里斯本华人群扩展联系，也可在波尔图的共享办公（如Cowork Porto）认识其他华人旅居者。',
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
    landing: {
      wifi: '105 Mbps', cost: '$$$', visa: '90天免签（非申根）',
      visaDays: '90天', visaDesc: '🛂 爱尔兰非申根区，90天免签入境，创业签证（STEP）适合高潜力创业者申请长期居留。',
      welfare: '🏥 爱尔兰公共医疗（HSE）质量高，持有效签证可享受部分公共医疗服务，私立医疗保险推荐购买。',
      visaDetail: '爱尔兰非申根区，多数国家护照持有者可免签入境90天。创业签证（Start-Up Entrepreneur Programme, STEP）适合高潜力创业者申请长期居留，需提供商业计划书和资金证明。',
      dailyCost: '每日预算参考：\n• 餐饮：€25–45（午餐€12–18，晚餐€25–45）\n• 住宿：€70–120（市中心合租公寓，住宿成本极高）\n• 交通：€3–5（公交单程€2.6，月票€140）\n• 合计：约€100–170/天',
      safety: '都柏林整体安全，但部分区域（如北内城）治安较差。市中心夜间需注意扒窃，尤其在酒吧区（Temple Bar）。夜间独行建议选择灯光充足的路线，避开偏僻街道。',
      society: '爱尔兰拥有完善的公共医疗体系（HSE），但等待时间较长，私立医疗更为高效。工作文化友好开放，英语是官方语言，沟通无障碍。都柏林是欧洲科技公司（Google、Meta、Apple）欧洲总部的聚集地。',
      housing: '主要租房平台：Daft.ie（爱尔兰最大、最重要的租房平台）、Rent.ie、Airbnb（短租过渡）。都柏林住房危机严峻，空置率极低，是西欧找房最难的城市之一。建议提前3个月以上启动找房，加入Facebook「Dublin Accommodation」群组第一时间获取信息。押金通常为1个月，合同有法律保护。月租参考：合租单间 €900–1,300，独立一居室 €1,800–2,600。Rathmines、Stoneybatter、Phibsborough区相对亲民。',
      housingLinks: [
        { name: 'Daft.ie', url: 'https://www.daft.ie', desc: '爱尔兰最大也是最重要的租房平台' },
        { name: 'Rent.ie', url: 'https://www.rent.ie', desc: '爱尔兰次大租房平台，覆盖全国各地房源' },
      ],
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
    community: {
      paragraph: '都柏林的科技社群以欧洲科技公司员工和创业者为主，酒吧文化让社交变得自然，英语母语环境大幅降低融入门槛。',
      platforms: [
        { name: 'Meetup Dublin', url: 'https://www.meetup.com/cities/ie/dublin/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Dublin', url: 'https://www.eventbrite.ie/d/ireland--dublin/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
        { name: 'Silicon Docks Events', url: 'https://www.siliconrepublic.com/events', desc: '都柏林科技圈活动聚合，初创与科技社群必备' },
      ],
      zhCommunity: '都柏林华人圈以科技公司（Google、Meta）华人员工、留学生和少数游民为主，整体规模适中。小红书搜索「都柏林旅居」「爱尔兰生活」有签证、租房经验分享；知乎上爱尔兰工作签证话题有详细讨论。都柏林华人微信互助群活跃，覆盖租房（这是最大痛点）、生活资讯等；爱尔兰华人社区协会（Irish Chinese Community Association）也有定期活动。',
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
    landing: {
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
    community: {
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
    landing: {
      wifi: '85 Mbps', cost: '$$', visa: '90天申根免签',
      visaDays: '365天', visaDesc: '🛂 意大利数字游民签证有效期1年，可续签，适合月收入超过€2,700的远程工作者。',
      welfare: '🏥 意大利国家医疗服务（SSN）覆盖广泛，持居留许可者可免费或低价就医，私立诊所质量高。',
      visaDetail: '🛂 意大利数字游民签证（Visto per Nomadi Digitali）有效期1年，可续签。申请条件：月收入≥€2,700，需提供远程工作合同或自雇证明、医疗保险、住房证明。申根区90天免签适合短期探访，长期居留需办理居留许可（Permesso di Soggiorno）。',
      dailyCost: '每日预算参考：\n• 餐饮：€25–45（含一顿正餐）\n• 住宿：€60–120（市中心公寓/月租€1,200–2,000）\n• 交通：€5–10（公交/步行为主）\n• 合计：约€90–175/天',
      safety: '🔒 佛罗伦萨整体安全，但游客区扒窃频发，尤其是乌菲兹美术馆、圣十字广场周边。夜间独行较安全，建议保管好随身物品。',
      society: '意大利人重视家庭、美食与社交，生活节奏悠闲。英语在旅游业和年轻人中普及，但日常生活以意大利语为主。外籍人士社群以艺术、设计和学术人士为主，融入本地生活需要一定意大利语基础。',
      housing: '主要租房平台：Immobiliare.it（意大利最大租房平台）、Subito.it（含二手兼租房）、Airbnb/Spotahome（短中租）。佛罗伦萨租房市场受旅游业影响，旺季（5–9月）短租供给多但价格高，长租更稳定。押金通常为2–3个月，合同以意大利语签署，有意大利语基础大幅降低沟通成本。月租参考：合租单间 €500–800，独立一居室 €900–1,400。Oltrarno、Campo di Marte等区生活气息足且价格合理。',
      housingLinks: [
        { name: 'Immobiliare.it', url: 'https://www.immobiliare.it', desc: '意大利最大租房平台，长租房源丰富' },
        { name: 'Subito.it', url: 'https://www.subito.it', desc: '分类广告平台，含个人直租与二手物品' },
        { name: 'Spotahome', url: 'https://www.spotahome.com', desc: '中短租平台，外籍人士友好，提供视频看房' },
      ],
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
    community: {
      paragraph: '佛罗伦萨的外籍人士社群以艺术、设计和学术人士为主，意大利语能力可大幅提升融入深度，但英语社群同样活跃。',
      platforms: [
        { name: 'Meetup Florence', url: 'https://www.meetup.com/cities/it/florence/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Firenze', url: 'https://www.eventbrite.it/d/italy--florence/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ],
      zhCommunity: '佛罗伦萨华人圈以艺术设计留学生和皮革/时尚行业从业者为主，较为小众精英化。小红书搜索「佛罗伦萨旅居」「意大利艺术留学」有相关经验；知乎上意大利旅居和签证话题有讨论。本地华人社群规模较小，意大利语能力是深度融入的关键。建议通过佛罗伦萨中文学校或华人商会（Camera di Commercio Cinese）寻找联络点。',
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
    landing: {
      wifi: '110 Mbps', cost: '$', visa: '90天申根免签',
      visaDays: '365天', visaDesc: '🛂 爱沙尼亚数字游民签证有效期1年，e-Residency可在欧盟注册公司，全球首个此类签证。',
      welfare: '🏥 爱沙尼亚数字游民签证持有者须自行购买医疗保险，本地私立诊所费用合理。',
      visaDetail: '🛂 爱沙尼亚数字游民签证（Digital Nomad Visa）有效期1年，可续签。申请条件：月收入≥€3,504，需提供远程工作合同或自雇证明、医疗保险。e-Residency（电子居民）项目允许全球任何人在爱沙尼亚注册欧盟公司，无需实际居住，是数字创业者的首选。',
      dailyCost: '每日预算参考：\n• 餐饮：€15–30（含一顿正餐）\n• 住宿：€40–80（市中心公寓/月租€800–1,400）\n• 交通：€3–8（公交/步行为主）\n• 合计：约€58–118/天',
      safety: '🔒 塔林是欧洲最安全的城市之一，犯罪率极低。老城区夜间也较安全，但建议避免深夜独自前往偏僻区域。',
      society: '爱沙尼亚人内敛务实，重视个人空间与效率。英语普及率极高，尤其在科技和商业领域。塔林拥有欧洲最活跃的数字游民社群之一，e-Residency社区遍布全球，本地科技创业氛围浓厚。',
      housing: '主要租房平台：KV.ee（爱沙尼亚最大租房平台）、City24.ee、Airbnb（短租）。塔林住房市场相对宽松，外籍人士找房较容易，英语沟通无障碍。押金通常为1–2个月，合同通常可提供英语版本。月租参考：合租单间 €400–700，独立一居室 €700–1,100。老城区（Vanalinn）最贵但最美，Kalamaja、Telliskivi等新兴文艺区性价比高且游民聚集。',
      housingLinks: [
        { name: 'KV.ee', url: 'https://www.kv.ee', desc: '爱沙尼亚最大租房平台，覆盖全国各类房源' },
        { name: 'City24.ee', url: 'https://www.city24.ee', desc: '波罗的海综合房产平台，含塔林各区租房' },
      ],
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
    community: {
      paragraph: '塔林的数字游民社群是欧洲最具凝聚力的之一，e-Residency 持有者遍布全球，本地科技社群开放且国际化。',
      platforms: [
        { name: 'Meetup Tallinn', url: 'https://www.meetup.com/cities/ee/tallinn/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Tallinn', url: 'https://www.eventbrite.com/d/estonia--tallinn/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ],
      zhCommunity: '塔林华人圈规模较小，以科技从业者和 e-Residency 创业者为主。小红书搜索「塔林旅居」「爱沙尼亚数字游民」有近年经验分享；e-Residency 社区 Slack 和 Telegram 群中有华人创业者活跃。整体融入路径以国际游民社群（英语）为主，华人圈子规模有限，Telliskivi 创意园区是结识其他旅居者的好去处。',
    }
  },
  Madrid: {
    name: 'Madrid', nameZh: '马德里', country: 'Spain', countryZh: '西班牙', flag: '🇪🇸', match: 85,
    soul: {
      headline: '伊比利亚的心脏，永不入眠的城市。',
      sub: '文化 · 艺术 · 历史 · 美食',
      body: '马德里的夜晚从午夜开始。普拉多、索菲亚王后、提森三大博物馆构成欧洲密度最高的艺术三角，而街头的活力才是这座城市真正的灵魂。',
      personality: '马德里融合了卡斯蒂利亚的庄重与地中海的热情，Malasaña街区的嬉皮自由与Salamanca的精英气质在同一座城市和平共存。这里的人相信凌晨两点才是真正的开始，友善与直率是他们待人的方式。',
      economy: '西班牙政治与金融中心，Fintech与SaaS初创生态快速成长，旅游、媒体与创意产业并驾齐驱。2023年推出的数字游民签证正在吸引大批远程工作者涌入。',
      festivals: '圣伊西德罗节（5月）是最盛大的传统节庆，万人在马扎纳雷斯河畔共舞；Veranos de la Villa夏日文化节覆盖全城剧场与广场；三王节巡游（1月5日）是冬季的童话时刻。',
      figures: '戈雅在马德里完成了《黑色绘画》系列；导演阿尔莫多瓦用这座城市的街道重塑了西班牙电影；建筑师莫内欧的索菲亚王后艺术中心扩建改变了城市天际线。',
    },
    landing: {
      wifi: '65 Mbps', cost: '$$', visa: '数字游民签证1年，可续签至3年',
      visaDays: '365 days',
      visaDesc: '🛂 西班牙数字游民签证要求月收入≥€2,646，在境外雇主或自雇，审批约1-3个月。',
      welfare: '🏥 持有效签证可参与西班牙公共医疗体系，公立医院质量较高，覆盖广泛。',
      safety: '整体安全，主要风险是太阳门与格兰大道一带的扒窃。夜间娱乐区活跃但总体有序，女性独行白天安全感高。',
      dailyCost: '每日预算参考：\n• 餐饮：€15–25（午餐Menú del Día €10–14，Tapas晚餐€15–25）\n• 住宿：€40–70（市中心Airbnb合租，月租比日租划算约50%）\n• 交通：€3–5（地铁月票€55，日均约€2）\n• 合计：约€58–100/天',
      visaDetail: '西班牙数字游民签证（Visado para Teletrabajadores）需提供收入证明、健康保险、无犯罪记录。初始1年，入境后可申请3年居留许可，配偶及未成年子女可同行申请。',
      society: '工作与生活平衡受法律保护，午休文化部分保留，家庭与社交是生活重心。持有效签证的自雇者可缴纳Autónomo社保，享受医疗保障。',
    },
    chance: {
      paragraph: '西班牙语是全球第二大语言市场，内容创作与营销咨询需求旺盛；Fintech与SaaS初创生态在马德里快速成长，联合办公空间密集。',
      policy: { label: 'ICEX Invest in Spain', url: 'https://www.investinspain.org/en/why-spain/index.html', desc: '西班牙官方外商投资促进机构，提供落地支持' },
      localJobs: [
        { name: 'InfoJobs', url: 'https://www.infojobs.net', desc: '西班牙最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '马德里有多个活跃的数字游民社群，共享办公空间密集，国际化程度高，英语交流无障碍。',
      platforms: [
        { name: 'Meetup Madrid', url: 'https://www.meetup.com/cities/es/madrid/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Madrid', url: 'https://www.eventbrite.com/d/spain--madrid/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Valencia: {
    name: 'Valencia', nameZh: '瓦伦西亚', country: 'Spain', countryZh: '西班牙', flag: '🇪🇸', match: 92,
    soul: {
      headline: '地中海阳光下，欧洲数字游民的性价比之选。',
      sub: '文化 · 美食 · 建筑 · 海滩',
      body: '瓦伦西亚是西班牙数字游民社区公认的隐藏宝石——气候全年温暖，生活成本远低于巴塞罗那，卡拉特拉瓦设计的艺术科学城每天提醒着人们，这里的创意从未停止。',
      personality: '瓦伦西亚人以乐观开朗著称，融合了地中海的悠闲与本土文化的独立精神。旧城区的古老市场与现代蓬勃的科技社群并存，让这座城市既有历史厚重感又充满活力。',
      economy: '旅游与农业科技是传统支柱，汽车制造（福特工厂）与数字经济快速崛起；瓦伦西亚港是欧洲最繁忙的货运港之一，物流与国际贸易人才需求旺盛。',
      festivals: '法雅节（Las Fallas，3月）是联合国非物质文化遗产，万千纸扎人偶在火光中消逝，是欧洲最壮观的节庆之一；番茄节（La Tomatina，8月，布尼奥尔）在附近小镇举行，每年吸引数万人参与。',
      figures: '建筑师圣地亚哥·卡拉特拉瓦以艺术科学城重塑了瓦伦西亚天际线；哲学家路易斯·比维斯是文艺复兴时代的人文主义先驱；网球运动员大卫·费雷尔以坚韧精神代表了瓦伦西亚人的气质。',
    },
    landing: {
      wifi: '65 Mbps', cost: '$', visa: '数字游民签证1年，可续签至3年',
      visaDays: '365 days',
      visaDesc: '🛂 与马德里相同的西班牙数字游民签证，月收入门槛€2,646，瓦伦西亚办证流程顺畅。',
      welfare: '🏥 西班牙公共医疗覆盖全国，瓦伦西亚公立医院质量良好，语言服务相对完善。',
      safety: '西班牙安全感最高的大城市之一，犯罪率低于马德里与巴塞罗那。旧城区夜间热闹而安全，女性独行体感安全度高。',
      dailyCost: '每日预算参考：\n• 餐饮：€12–20（市场午餐€8–12，晚餐€12–20）\n• 住宿：€30–55（市中心Airbnb单间，比巴塞罗那便宜约35%）\n• 交通：€2–4（地铁月票€40，骑行基础设施完善）\n• 合计：约€44–79/天',
      visaDetail: '申请西班牙数字游民签证与全国标准一致。城市生活成本约为马德里的70-80%，月均租金比巴塞罗那低约€400，是欧洲性价比最高的数字游民目的地之一。',
      society: '生活节奏舒适，骑行文化成熟，海滩与山区均在30分钟车程内。外籍人士社区庞大，英语友好程度逐年提升，融入难度较低。',
    },
    chance: {
      paragraph: '旅游科技与农业科技（AgriTech）是本地热点赛道，英语教学与西班牙语课程是稳定收入来源；电商与内容创作需求随游民社区增长而旺盛。',
      policy: { label: 'ICEX Invest in Spain', url: 'https://www.investinspain.org/en/why-spain/index.html', desc: '西班牙官方外商投资促进机构，提供落地支持' },
      localJobs: [
        { name: 'InfoJobs', url: 'https://www.infojobs.net', desc: '西班牙最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '瓦伦西亚数字游民社区规模快速增长，多个共享办公空间在旧城区聚集，国际化氛围浓厚。',
      platforms: [
        { name: 'Meetup Valencia', url: 'https://www.meetup.com/cities/es/valencia/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Valencia', url: 'https://www.eventbrite.com/d/spain--valencia/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Riga: {
    name: 'Riga', nameZh: '里加', country: 'Latvia', countryZh: '拉脱维亚', flag: '🇱🇻', match: 88,
    soul: {
      headline: '新艺术建筑之都，波罗的海的隐秘宝石。',
      sub: '文化 · 建筑 · 历史 · 科技',
      body: '里加拥有世界上密度最高的新艺术主义建筑群，旧城区是联合国教科文组织世界遗产。中世纪的石板路与20世纪初的华丽建筑立面，诉说着这座城市不寻常的历史轨迹。',
      personality: '里加人性格内敛而充满韧性，历经多次占领的历史塑造了他们对自由的珍视。年轻一代英语流利，对科技与创新抱有热情，城市创意氛围正在快速崛起。',
      economy: 'IT服务、金融科技与共享服务中心是现代里加的经济支柱；旅游业贡献稳定，木材与食品加工等传统产业仍有一席之地。欧元区成员国地位为商业运营提供便利。',
      festivals: '里加歌舞节（Dziesmu un deju svētki）是全球规模最大的合唱节之一，每5年举行一次；里加城市节（8月）是最盛大的街头狂欢；圣约翰节（Jāņi，6月24日）是波罗的海最浪漫的仲夏夜传统。',
      figures: '音乐指挥马里斯·扬颂斯将里加带上古典音乐的世界舞台；电影导演赛尔盖·爱森斯坦在里加度过了童年，奠定了他对视觉叙事的敏感；建筑师米哈伊尔·埃森施泰因（其父）设计了里加最著名的新艺术建筑。',
    },
    landing: {
      wifi: '70 Mbps', cost: '$', visa: '申根90天免签，可申请拉脱维亚临时居留',
      visaDays: '90 days',
      visaDesc: '🛂 申根90天免签适用于多数护照。自雇或创业者可申请临时居留许可，审批约3个月。',
      welfare: '🏥 欧盟成员国，公立医疗对外籍人士收费，建议购买国际医疗保险；私立诊所价格合理，服务质量较高。',
      safety: '整体安全，老城区旅游繁忙地带有扒窃风险。深夜在车站附近保持警觉。女性独行整体安全，当地人普遍友善。',
      dailyCost: '每日预算参考：\n• 餐饮：€10–18（午餐€5–9，晚餐餐厅€12–18）\n• 住宿：€25–45（市中心Airbnb单间，按月租性价比极高）\n• 交通：€2–3（月票€50，步行与骑行覆盖大部分市区）\n• 合计：约€37–66/天',
      visaDetail: '拉脱维亚为欧元区成员，持申根签证可自由出入。自雇者可申请临时居留（Uzturēšanās atļauja），需提供商业计划与财务证明。长期居留后可申请欧盟永久居留资格。',
      society: '社会稳定，教育水平高，英语在里加年轻人中普及率超80%。城市规模适中，通勤时间短，生活节奏从容有序。',
    },
    chance: {
      paragraph: '里加是波罗的海IT外包与共享服务中心，欧洲客户信任度高；金融科技初创活跃，欧盟监管框架为合规创业提供便利。',
      policy: { label: 'Investment and Development Agency of Latvia (LIAA)', url: 'https://www.liaa.gov.lv/en', desc: '拉脱维亚官方投资与发展促进机构' },
      localJobs: [
        { name: 'CV.lv', url: 'https://www.cv.lv', desc: '拉脱维亚最大招聘平台，覆盖本地各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '里加外籍人士社群以科技从业者为主，Startup Latvia等计划孵化了活跃的创业者网络，Meetup活动频繁。',
      platforms: [
        { name: 'Meetup Riga', url: 'https://www.meetup.com/cities/lv/riga/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Riga', url: 'https://www.eventbrite.com/d/latvia--riga/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Vilnius: {
    name: 'Vilnius', nameZh: '维尔纽斯', country: 'Lithuania', countryZh: '立陶宛', flag: '🇱🇹', match: 86,
    soul: {
      headline: 'Revolut的故乡，波罗的海最快崛起的科技都市。',
      sub: '文化 · 建筑 · 科技 · 创业',
      body: '维尔纽斯旧城是欧洲保存最完整的巴洛克建筑群之一，而自称独立国家的乌皮斯共和国（Užupis）就藏在其中——这里有自己的宪法：每个人都有权利去爱。',
      personality: '维尔纽斯人兼具北欧的务实与东欧的艺术气质，对创业与技术有天然的热情。Revolut、Nord Security、Vinted等独角兽在此诞生，证明这座城市的野心从未局限于波罗的海。',
      economy: '金融科技是最亮眼的名片，Revolut、Paysera等公司将立陶宛带上欧洲Fintech版图；IT服务、激光科技与生物技术是核心支柱；立陶宛银行牌照与欧盟合规体系吸引大量创业者。',
      festivals: '卡济米埃拉斯集市（Kaziukas，3月）是最古老的传统手工艺市集；维尔纽斯节（6月）是最盛大的夏季文化庆典；万灵节（Vėlinės，11月）是波罗的海最具诗意的悼念传统。',
      figures: '诗人密茨凯维奇在维尔纽斯留下波兰浪漫主义文学的根脉；乌皮斯共和国创建者Romas Lileikis以艺术行动震动了欧洲；物理学家马利亚·居里（祖籍立陶宛）是人类科学史上最重要的女性之一。',
    },
    landing: {
      wifi: '75 Mbps', cost: '$', visa: '申根90天免签，可申请立陶宛创业签证',
      visaDays: '90 days',
      visaDesc: '🛂 申根90天免签。创业者可申请立陶宛Startup Visa，需获Startup Lithuania认证，审批2-3个月。',
      welfare: '🏥 欧盟成员国，公立医疗对外籍人士收费；维尔纽斯私立诊所价格低于西欧30-50%，质量良好。',
      safety: '欧洲最安全的首都之一，旧城区夜间活跃而安全，无明显高风险区域，女性独行安全感高。',
      dailyCost: '每日预算参考：\n• 餐饮：€10–16（午餐€5–8，晚餐餐厅€10–16）\n• 住宿：€22–42（市中心Airbnb单间，按月租价格极具竞争力）\n• 交通：€2–3（月票€30，旧城区步行可达大部分地点）\n• 合计：约€34–61/天',
      visaDetail: '立陶宛Startup Visa适合创业者，需通过Startup Lithuania审核（评估团队、产品与市场潜力），获批后可获1年居留，可续签。长期居住后可申请欧盟永久居留。',
      society: '拥有欧盟最快的公共WiFi网络之一，数字化政府服务领先，年轻人英语普及率高。城市小巧功能完善，生活成本在欧盟首都中属最低梯队。',
    },
    chance: {
      paragraph: 'Fintech是最大机会，立陶宛银行牌照是欧盟通行证；IT咨询与北欧外包业务活跃；激光科技是本地特色产业，精密制造配套链完整。',
      policy: { label: 'Invest Lithuania', url: 'https://www.investlithuania.com', desc: '立陶宛官方投资促进机构，提供创业落地支持' },
      localJobs: [
        { name: 'CV Online LT', url: 'https://www.cvonline.lt', desc: '立陶宛最大招聘平台，覆盖本地各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '维尔纽斯创业社群以Fintech从业者为核心，Startup Lithuania定期举办活动，Tech Zity联合办公空间是聚会核心场地。',
      platforms: [
        { name: 'Meetup Vilnius', url: 'https://www.meetup.com/cities/lt/vilnius/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Vilnius', url: 'https://www.eventbrite.com/d/lithuania--vilnius/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Krakow: {
    name: 'Krakow', nameZh: '克拉科夫', country: 'Poland', countryZh: '波兰', flag: '🇵🇱', match: 90,
    soul: {
      headline: '中世纪古城，东欧最受游民钟爱的宜居之地。',
      sub: '文化 · 历史 · 艺术 · 科技',
      body: '克拉科夫是波兰唯一在二战中幸免于难的古城，瓦维尔城堡矗立在维斯瓦河畔已逾千年。这里的中世纪广场在欧洲最大之列，而地下的盐矿藏着另一个地下世界。',
      personality: '克拉科夫人以知识分子气质著称，这里汇聚了波兰最顶尖的大学与最密集的博物馆。年轻人思想开放，对外来者保持好奇，카济米日犹太区的咖啡馆文化让整座城市散发出波西米亚气息。',
      economy: '旅游业是重要支柱，金融共享服务中心（HSBC、ABB、IBM等跨国企业在此设立后台）是近十年最大的经济亮点；IT与游戏开发产业快速成长，Cracow Technology Park聚集了大批科技企业。',
      festivals: '克拉科夫龙节（Wianki，6月）是维斯瓦河畔的夏至仲夏节庆；犹太文化节（Kraków Jewish Culture Festival，6-7月）是欧洲最重要的犹太文化活动之一；音乐节Film Music Festival聚焦电影配乐，全球瞩目。',
      figures: '教皇约翰·保罗二世在克拉科夫担任主教多年，这座城市至今是他精神遗产的守护者；导演安杰依·瓦伊达的史诗电影记录了波兰民族的苦难与荣光；诗人维斯瓦娃·辛波丝卡以日常的惊奇获得诺贝尔文学奖。',
    },
    landing: {
      wifi: '70 Mbps', cost: '$', visa: '申根90天免签',
      visaDays: '90 days',
      visaDesc: '🛂 申根区90天免签，波兰尚无数字游民专属签证，长期居留可申请自雇或公司注册途径。',
      welfare: '🏥 欧盟成员国，持有效居留许可可参与波兰社保体系；私立医疗诊所价格低廉，质量良好。',
      safety: '克拉科夫是波兰最安全的城市之一，旅游区卡济米日与老城区扒窃风险低。夜间酒吧街区热闹但秩序良好，女性独行安全感高。',
      dailyCost: '每日预算参考：\n• 餐饮：$10–18（波兰传统餐厅午餐$5–9，晚餐$10–18）\n• 住宿：$22–45（市中心Airbnb单间，按月租极具性价比）\n• 交通：$2–3（月票$28，老城区步行可达大部分景点）\n• 合计：约$34–66/天',
      visaDetail: '波兰尚未推出数字游民专属签证。长期居留可通过成立波兰公司（sp. z o.o.）或自雇形式申请居留许可，审批约2-4个月。波兰正在讨论引入游民签证项目。',
      society: '波兰社会稳定，生活成本是欧盟最低之列，教育与医疗质量持续提升。克拉科夫年轻人英语普及率高，国际化程度远超波兰其他城市。',
    },
    chance: {
      paragraph: 'IT外包与共享服务中心是克拉科夫最大的职业机会，跨国企业后台运营需求持续；游戏开发与内容创作生态活跃，波兰语市场本地化需求旺盛。',
      policy: { label: 'Polish Investment and Trade Agency (PAIH)', url: 'https://www.paih.gov.pl/en', desc: '波兰官方投资与贸易促进机构' },
      localJobs: [
        { name: 'Pracuj.pl', url: 'https://www.pracuj.pl', desc: '波兰最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '克拉科夫外籍人士社群以IT从业者与留学生为主，Krakow Expats等Facebook群组活跃，共享办公空间遍布老城区。',
      platforms: [
        { name: 'Meetup Kraków', url: 'https://www.meetup.com/cities/pl/krakow/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Kraków', url: 'https://www.eventbrite.com/d/poland--krakow/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Budapest: {
    name: 'Budapest', nameZh: '布达佩斯', country: 'Hungary', countryZh: '匈牙利', flag: '🇭🇺', match: 91,
    soul: {
      headline: '多瑙河上的明珠，欧洲游民的温泉之都。',
      sub: '文化 · 建筑 · 美食 · 温泉',
      body: '布达佩斯是一座被分成两半的城市——布达的山丘城堡与佩斯的宏伟林荫大道隔河相望，多瑙河在它们之间静静流淌，夜幕下的议会大厦倒影是欧洲最壮观的城市景色之一。',
      personality: '匈牙利人以机智、艺术天赋与对苦难的幽默感著称，布达佩斯的咖啡馆文化可追溯至奥匈帝国时代。年轻一代思想开放，创业精神旺盛，废墟酒吧（Ruin Bars）文化是他们对颓废与创意的独特诠释。',
      economy: '制造业、旅游业与金融服务是传统支柱；近年来IT与半导体产业快速成长，多家跨国科技企业在布达佩斯设立中欧总部；废墟酒吧与创意产业已成为城市软实力的重要组成部分。',
      festivals: '布达佩斯艺术周（Budapest Spring Festival，3-4月）是中欧最重要的古典艺术节；Sziget音乐节（8月）是欧洲最大的音乐节之一；圣诞市场（12月）被评为欧洲最美圣诞市场之一。',
      figures: '钢琴家弗朗茨·李斯特以布达佩斯为家，留下了最重要的音乐遗产；建筑师约瑟夫·霍夫曼的分离派风格影响了整座城市的建筑美学；小说家马格达·萨博的《门》是20世纪匈牙利文学的里程碑。',
    },
    landing: {
      wifi: '72 Mbps', cost: '$', visa: '申根90天免签，可申请匈牙利白卡（White Card）',
      visaDays: '365 days',
      visaDesc: '🛂 匈牙利2022年推出White Card数字游民签证，允许在匈工作1年，月收入要求约€2,000，审批约30天。',
      welfare: '🏥 欧盟成员国，持有效居留可参与匈牙利社保；私立医疗价格低廉，温泉水疗设施享誉欧洲。',
      safety: '整体安全，旅游区（瓦茨大街、英雄广场）有扒窃风险。夜间废墟酒吧区域热闹，整体秩序良好，女性独行安全感较高。',
      dailyCost: '每日预算参考：\n• 餐饮：$10–18（传统餐厅午餐$5–9，晚餐$10–18）\n• 住宿：$22–45（佩斯市中心Airbnb单间，按月租性价比极高）\n• 交通：$2–3（地铁月票$25，步行可达大部分景点）\n• 合计：约$34–66/天',
      visaDetail: '匈牙利White Card（白卡）：需提供收入证明、健康保险、无犯罪记录，初始1年，可续签。匈牙利不在欧元区，福林（HUF）兑换方便，日常消费约为西欧的40-50%。',
      society: '生活成本是欧盟最低之列，温泉文化深入日常，周末泡温泉是当地社交仪式。匈牙利年轻人英语普及率高，城市国际化程度不断提升。',
    },
    chance: {
      paragraph: 'IT共享服务中心是布达佩斯最大的就业赛道，多家跨国企业在此设立中欧运营总部；游戏开发与创意科技初创生态活跃。',
      policy: { label: 'Hungarian Investment Promotion Agency (HIPA)', url: 'https://hipa.hu/en/', desc: '匈牙利官方投资促进机构，提供外商落地支持' },
      localJobs: [
        { name: 'Profession.hu', url: 'https://www.profession.hu', desc: '匈牙利最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '布达佩斯数字游民社群以废墟酒吧为聚会场所，Budapest Digital Nomads等社区活跃，共享办公空间遍布佩斯商业区。',
      platforms: [
        { name: 'Meetup Budapest', url: 'https://www.meetup.com/cities/hu/budapest/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Budapest', url: 'https://www.eventbrite.com/d/hungary--budapest/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Bucharest: {
    name: 'Bucharest', nameZh: '布加勒斯特', country: 'Romania', countryZh: '罗马尼亚', flag: '🇷🇴', match: 87,
    soul: {
      headline: '东欧最快互联网之城，被低估的游民天堂。',
      sub: '文化 · 历史 · 科技 · 夜生活',
      body: '布加勒斯特拥有欧洲最快的固定宽带速度之一，生活成本极低，却坐拥雄伟的宫殿大道与疯狂的夜生活。这是一座常被忽视，但住过的人几乎都爱上它的城市。',
      personality: '罗马尼亚人融合了拉丁的热情与巴尔干的韧性，布加勒斯特人以直率和幽默著称。年轻一代受过良好教育，英语流利，对科技创业充满热情，城市正在经历属于自己的文艺复兴。',
      economy: 'IT外包是近十年最大的经济引擎，罗马尼亚IT工程师享誉欧洲；汽车零部件、农业出口与旅游业是传统支柱；布加勒斯特的科技初创生态正在从外包向产品化转型。',
      festivals: '乔治·埃内斯库国际音乐节（George Enescu Festival，9月）是欧洲最重要的古典音乐节之一；布加勒斯特国际电影节（BIFF）聚焦独立电影；Untold音乐节（克卢日-纳波卡，8月）是罗马尼亚最大的电子音乐节。',
      figures: '雕塑家康斯坦丁·布朗库西是现代雕塑的奠基者之一；作家米尔恰·伊利亚德是宗教史学的全球权威；体操运动员纳迪亚·科马内奇在蒙特利尔奥运会上完成了体操历史上第一个满分10分。',
    },
    landing: {
      wifi: '85 Mbps', cost: '$', visa: '申根90天免签（罗马尼亚非申根区），可申请居留许可',
      visaDays: '90 days',
      visaDesc: '🛂 罗马尼亚尚未加入申根区，但多数护照可免签90天。长期居留可申请D签证，罗马尼亚正在讨论游民签证方案。',
      welfare: '🏥 欧盟成员国，公立医疗覆盖有限；私立诊所价格极低，质量良好，国际医疗保险月费用低于西欧60%。',
      safety: '整体安全，老城区（Centrul Vechi）夜间热闹，扒窃风险低。女性独行整体安全，当地人对外来者友善。',
      dailyCost: '每日预算参考：\n• 餐饮：$8–15（传统餐厅午餐$4–8，晚餐$8–15）\n• 住宿：$18–40（市中心Airbnb单间，欧洲最低价之列）\n• 交通：$1–2（地铁月票$18，城市骑行基础设施完善）\n• 合计：约$27–57/天',
      visaDetail: '罗马尼亚计划推出专属数字游民签证（立法讨论中）。目前可通过注册公司或受雇于罗马尼亚企业申请居留许可。已加入欧盟，预计将于近年加入申根区。',
      society: '生活成本在欧盟最低行列，互联网速度欧洲最快之一。布加勒斯特年轻人受教育程度高，英语普及率高，IT人才密度在欧洲名列前茅。',
    },
    chance: {
      paragraph: 'IT外包与软件开发是最成熟的机会，罗马尼亚工程师享誉欧洲；电商与数字营销需求随中产崛起而增长；游戏开发生态活跃。',
      policy: { label: 'InvestRomania', url: 'https://investromania.gov.ro/en/', desc: '罗马尼亚官方外商投资促进机构' },
      localJobs: [
        { name: 'eJobs.ro', url: 'https://www.ejobs.ro', desc: '罗马尼亚最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '布加勒斯特的外籍人士与数字游民社群快速增长，Nomad House与多个共享办公空间活跃于老城区周边。',
      platforms: [
        { name: 'Meetup Bucharest', url: 'https://www.meetup.com/cities/ro/bucharest/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Bucharest', url: 'https://www.eventbrite.com/d/romania--bucharest/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Sofia: {
    name: 'Sofia', nameZh: '索非亚', country: 'Bulgaria', countryZh: '保加利亚', flag: '🇧🇬', match: 85,
    soul: {
      headline: '维托沙山脚下的千年古城，欧洲最低调的游民宝地。',
      sub: '文化 · 历史 · 自然 · 科技',
      body: '索非亚是欧洲最古老的首都之一，城市中心竟有罗马、拜占庭、奥斯曼与苏维埃时代的建筑遗迹共存。走出市区15分钟，就是维托沙山的滑雪道与徒步小径。',
      personality: '保加利亚人以点头表示"否"、摇头表示"是"——这是外来者在索非亚上的第一课。他们性格热情而低调，对外来者持开放态度，年轻的科技社群正在重新定义这座城市的形象。',
      economy: 'IT外包与BPO（业务流程外包）是经济引擎，索非亚软件工程师的薪酬与技术能力在欧洲享有声誉；旅游业、农业与纺织业是传统支柱；欧洲最低企业税率（10%）吸引大量企业注册。',
      festivals: '索非亚国际电影节（Sofia International Film Festival，3月）是巴尔干半岛最重要的电影盛事；Rose Festival（卡赞勒克，5-6月）庆祝全球50%玫瑰精油的产地；伊凡·瓦佐夫文学节（9月）致敬保加利亚最伟大的民族作家。',
      figures: '奥林匹克摔跤冠军丹·科洛夫是20世纪最具传奇色彩的摔跤手；作曲家潘乔·弗拉基格罗夫将保加利亚音乐带上世界舞台；女高音吉娜·米哈诺娃是20世纪歌剧史上最动人的嗓音之一。',
    },
    landing: {
      wifi: '68 Mbps', cost: '$', visa: '申根90天免签（保加利亚非申根区），可申请居留许可',
      visaDays: '90 days',
      visaDesc: '🛂 保加利亚尚未完全加入申根区（2024年空陆路已开放），多数护照免签90天。长期居留可申请D签证。',
      welfare: '🏥 欧盟成员国，公立医疗服务对外籍人士收费，建议购买私立保险；保加利亚私立诊所价格极低。',
      safety: '整体安全，旧城区与商业中心治安良好。需注意路面状况参差不齐；女性独行整体安全，城市夜间氛围平和。',
      dailyCost: '每日预算参考：\n• 餐饮：$7–14（传统餐厅午餐$3–7，晚餐$7–14）\n• 住宿：$15–35（市中心Airbnb单间，欧洲最低价之一）\n• 交通：$1–2（地铁月票$22，城市交通网络完善）\n• 合计：约$23–51/天',
      visaDetail: '保加利亚企业税率仅10%，是欧盟最低，吸引大量跨境创业者注册公司。长期居留可通过公司注册或受雇途径申请。保加利亚计划加入申根区，预计提升国际吸引力。',
      society: '生活成本是欧盟最低行列，维托沙山提供极佳的户外生活质量。索非亚年轻人英语能力强，IT社区国际化，城市整体节奏轻松。',
    },
    chance: {
      paragraph: 'IT外包与软件开发是核心机会，欧洲最低企业税率吸引公司注册；电商配套与内容外包需求旺盛；创业孵化生态正在成形。',
      policy: { label: 'InvestBulgaria Agency', url: 'https://www.investbg.government.bg/en/', desc: '保加利亚官方外商投资促进机构' },
      localJobs: [
        { name: 'Jobs.bg', url: 'https://www.jobs.bg', desc: '保加利亚最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '索非亚的科技社群规模不大但凝聚力强，Campus X联合办公空间是创业者的聚集地，外籍人士圈子活跃。',
      platforms: [
        { name: 'Meetup Sofia', url: 'https://www.meetup.com/cities/bg/sofia/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Sofia', url: 'https://www.eventbrite.com/d/bulgaria--sofia/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Athens: {
    name: 'Athens', nameZh: '雅典', country: 'Greece', countryZh: '希腊', flag: '🇬🇷', match: 83,
    soul: {
      headline: '文明的发源地，阳光、历史与咖啡的永恒交织。',
      sub: '文化 · 历史 · 美食 · 海滩',
      body: '雅典是人类文明的摇篮，帕台农神庙俯瞰着一座同时活在古代与现代的城市。这里的人每天在古迹旁喝咖啡，把几千年的历史当成日常背景。',
      personality: '雅典人以热情好客与哲学式的人生态度著称，强调享受当下（φιλότιμο，philotimo，荣誉感与好客精神）。即使在经济危机中也保持了生活热情，咖啡馆文化、夜间海滩聚会与激烈的政治辩论是日常生活的一部分。',
      economy: '旅游业是最大支柱，近年来科技初创与数字游民经济快速成长；希腊推出数字游民签证（2021年），吸引大批远程工作者；航运业是传统国际经济命脉，提供大量专业服务需求。',
      festivals: '雅典音乐节（Athens Epidaurus Festival，6-8月）在埃庇道鲁斯古剧场演出，是欧洲最具震撼力的露天演出之一；复活节（4-5月）是希腊最重要的宗教节庆，午夜烛光游行令人动容；雅典马拉松（11月）沿古老的马拉松路线而跑。',
      figures: '苏格拉底、柏拉图、亚里士多德在雅典建立了西方哲学的根基；诗人卡瓦菲斯以亚历山大为背景写下希腊现代诗歌的巅峰之作；作曲家米基斯·狄奥多拉基斯的《希腊人左巴》旋律成为整个民族的灵魂标记。',
    },
    landing: {
      wifi: '55 Mbps', cost: '$$', visa: '数字游民签证1年，可续签',
      visaDays: '365 days',
      visaDesc: '🛂 希腊2021年推出数字游民签证，月收入要求€3,500，允许在希腊工作1年，配偶子女可随行。',
      welfare: '🏥 欧元区成员，公立医疗覆盖有限，建议购买私立保险；雅典私立诊所价格合理，质量良好。',
      safety: '雅典整体安全，奥莫尼亚广场附近夜间需注意，扒窃风险集中于旅游热点区域。女性独行白天安全感高，夜间建议结伴出行。',
      dailyCost: '每日预算参考：\n• 餐饮：€12–22（小馆午餐€7–12，晚餐餐厅€14–25）\n• 住宿：€35–65（市中心Airbnb单间，旺季7-9月价格上浮）\n• 交通：€2–4（地铁月票€30，城市中心步行可达）\n• 合计：约€49–91/天',
      visaDetail: '希腊数字游民签证要求月均收入≥€3,500，需提供健康保险与无犯罪记录。初始1年，可续签。签证持有人无需缴纳希腊所得税（前7年享受50%税收减免）。',
      society: '地中海生活节奏，午后阳光最好的时光用于享受而非工作。外籍人士社区在雅典科洛纳基与克西亚区（Psiri）聚集，国际化程度近年大幅提升。',
    },
    chance: {
      paragraph: '旅游科技与酒店科技（HotelTech）是本地热点赛道；航运数字化需求持续；英语教学与内容创作是稳定收入来源。',
      policy: { label: 'Enterprise Greece', url: 'https://www.enterprisegreece.gov.gr/en/', desc: '希腊官方投资与贸易促进机构' },
      localJobs: [
        { name: 'Kariera.gr', url: 'https://www.kariera.gr', desc: '希腊最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '雅典数字游民社群依托Syntagma与Monastiraki周边联合办公空间，Athens Digital Arts Festival定期聚集创意人士。',
      platforms: [
        { name: 'Meetup Athens', url: 'https://www.meetup.com/cities/gr/athens/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Athens', url: 'https://www.eventbrite.com/d/greece--athens/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Zagreb: {
    name: 'Zagreb', nameZh: '萨格勒布', country: 'Croatia', countryZh: '克罗地亚', flag: '🇭🇷', match: 80,
    soul: {
      headline: '欧元区最新成员，巴尔干的咖啡文化之都。',
      sub: '文化 · 历史 · 美食 · 自然',
      body: '萨格勒布是一座被分成上城与下城的双面城市——上城是中世纪的石板路与古教堂，下城是宽阔的林荫大道与浓咖啡。克罗地亚2023年正式加入欧元区，让这里的商业环境更加成熟。',
      personality: '萨格勒布人以直率、幽默与咖啡文化著称，每天早上在广场喝咖啡是神圣的社交仪式，不可被打扰。他们对自己的城市有强烈的自豪感，也对外来者保持着适度的开放。',
      economy: '制造业、农业食品与旅游业是传统支柱；IT服务与初创生态近年快速崛起，Infobip等独角兽公司证明了克罗地亚的技术潜力；欧元区成员身份吸引更多外资进入。',
      festivals: '萨格勒布圣诞市场（12月）连续多年被评为欧洲最美圣诞市场；INmusic音乐节（6月）是克罗地亚最大的露天音乐节；萨格勒布电影节（10月）聚焦中欧独立电影。',
      figures: '发明家尼古拉·特斯拉（塞尔维亚裔，克罗地亚境内出生）是交流电与现代电力系统的奠基者；作家米洛斯拉夫·克尔莱扎是20世纪最重要的南斯拉夫文学巨匠；建筑师赫尔曼·波勒的作品定义了萨格勒布下城区的城市风貌。',
    },
    landing: {
      wifi: '60 Mbps', cost: '$', visa: '申根90天免签，可申请克罗地亚数字游民居留',
      visaDays: '365 days',
      visaDesc: '🛂 克罗地亚2021年推出数字游民居留许可，1年期，月收入要求约€2,539，申请门槛相对较低。',
      welfare: '🏥 欧元区成员，持有效居留可参与克罗地亚医疗体系；私立诊所价格低于西欧，质量良好。',
      safety: '整体安全，犯罪率低，是巴尔干地区安全感最高的首都之一。女性独行安全感高，当地人对外来者友善。',
      dailyCost: '每日预算参考：\n• 餐饮：€10–18（传统餐厅午餐€6–10，晚餐€10–18）\n• 住宿：€28–50（市中心Airbnb单间，按月租性价比高）\n• 交通：€2–3（电车月票€28，步行可达上城与下城）\n• 合计：约€40–71/天',
      visaDetail: '克罗地亚数字游民居留：需提供收入证明、健康保险、住址证明，审批约30-60天。持有居留期间免缴克罗地亚所得税，是欧洲税务友好度最高的游民签证之一。',
      society: '克罗地亚2023年加入欧元区与申根区，大幅提升了便利性。萨格勒布生活节奏悠闲，自然环境优越，亚得里亚海海岸仅2小时车程。',
    },
    chance: {
      paragraph: 'IT服务与软件开发是最活跃的机会，Infobip等本地独角兽带动了整体生态；旅游科技与内容创作随着克罗地亚旅游业蓬勃发展而增长。',
      policy: { label: 'Croatian Investment and Competitiveness Agency (AIK)', url: 'https://aik-invest.hr/en/', desc: '克罗地亚官方投资竞争力促进机构' },
      localJobs: [
        { name: 'MojPosao', url: 'https://www.mojposao.hr', desc: '克罗地亚最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '萨格勒布的数字游民社群以科技从业者为核心，Impact Hub Zagreb是最活跃的共享办公与创业社区。',
      platforms: [
        { name: 'Meetup Zagreb', url: 'https://www.meetup.com/cities/hr/zagreb/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Zagreb', url: 'https://www.eventbrite.com/d/croatia--zagreb/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Ljubljana: {
    name: 'Ljubljana', nameZh: '卢布尔雅那', country: 'Slovenia', countryZh: '斯洛文尼亚', flag: '🇸🇮', match: 82,
    soul: {
      headline: '欧洲最绿色的首都，阿尔卑斯山脚的宜居小城。',
      sub: '文化 · 自然 · 建筑 · 可持续',
      body: '卢布尔雅那是欧洲人均绿地面积最多的首都之一，龙桥、三重桥与卢布尔雅那城堡构成了这座小城的童话轮廓。这里的人口只有30万，但生活质量在欧洲名列前茅。',
      personality: '斯洛文尼亚人以低调务实著称，不喜夸张，重视环保与生活质量。卢布尔雅那获得欧洲绿色首都荣誉，骑行与步行是最受欢迎的出行方式，咖啡馆文化以户外露台见长。',
      economy: '制造业（汽车零部件、医药）、旅游业与金融服务是支柱产业；IT与互联网初创生态小而精，斯洛文尼亚企业税率较低，欧元区地位吸引中欧商业布局。',
      festivals: '卢布尔雅那夏季节（Ljubljana Festival，6-9月）是中欧最负盛名的夏季艺术节；龙节（Dragon Festival，6月）以城市标志龙为主题；圣诞市场（12月）以精品手工艺著称。',
      figures: '建筑师约热·普莱契尼克重塑了20世纪卢布尔雅那的城市面貌，其作品已列入联合国教科文组织遗产；哲学家斯拉沃伊·齐泽克是当代最具争议的思想家之一；诗人弗朗茨·普雷谢伦是斯洛文尼亚民族文化的精神象征。',
    },
    landing: {
      wifi: '65 Mbps', cost: '$$', visa: '申根90天免签，可申请斯洛文尼亚居留许可',
      visaDays: '90 days',
      visaDesc: '🛂 申根区90天免签，斯洛文尼亚尚无专属数字游民签证，长期居留可通过自雇或公司注册申请。',
      welfare: '🏥 欧元区成员，公立医疗体系完善，外籍居民持证可享受较完整的医疗保障，质量高于周边多数国家。',
      safety: '欧洲最安全的首都之一，犯罪率极低，旧城区全天候安全，女性独行安全感极高。',
      dailyCost: '每日预算参考：\n• 餐饮：€12–22（传统餐厅午餐€8–12，晚餐€14–22）\n• 住宿：€35–65（市中心Airbnb单间，规模小价格相对稳定）\n• 交通：€1–3（骑行系统完善，步行可达大部分地点）\n• 合计：约€48–90/天',
      visaDetail: '斯洛文尼亚尚未推出专属数字游民签证，但自雇居留申请相对便捷。作为欧元区小国，商业税率具竞争力，已有多名游民通过注册公司方式长期居留。',
      society: '生活质量在欧洲名列前茅，骑行基础设施完善，自然环境优越（朱利安阿尔卑斯与布莱德湖均在1小时车程内）。城市规模小，社区凝聚力强。',
    },
    chance: {
      paragraph: 'IT服务与精密制造配套是本地机会；斯洛文尼亚作为中欧德语区市场的门户，德语能力者有额外优势；可持续科技（GreenTech）是新兴赛道。',
      policy: { label: 'Spirit Slovenia', url: 'https://www.spiritslovenia.si/en/', desc: '斯洛文尼亚官方企业与投资促进机构' },
      localJobs: [
        { name: 'MojeDelo.com', url: 'https://www.mojedelo.com', desc: '斯洛文尼亚最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '卢布尔雅那的创业社群规模小但高质量，ABC Accelerator是中欧知名孵化器，外籍人士社区以科技从业者为主。',
      platforms: [
        { name: 'Meetup Ljubljana', url: 'https://www.meetup.com/cities/si/ljubljana/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Ljubljana', url: 'https://www.eventbrite.com/d/slovenia--ljubljana/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Rotterdam: {
    name: 'Rotterdam', nameZh: '鹿特丹', country: 'Netherlands', countryZh: '荷兰', flag: '🇳🇱', match: 80,
    soul: {
      headline: '欧洲最大港口，大胆建筑与创新文化的试验场。',
      sub: '文化 · 建筑 · 港口 · 创新',
      body: '鹿特丹是欧洲最大的货运港，二战后几乎从零重建，这给了建筑师们一张白纸。方块屋、铅笔塔、鹿特丹市场大厅——这座城市把大胆建筑当成了最骄傲的名片。',
      personality: '鹿特丹人以务实直率著称，有着"做事，不说话"的实干精神，与阿姆斯特丹的文艺气质形成鲜明对比。这里的创业文化以可持续发展与港口科技为特色，年轻人对变革有强烈的热情。',
      economy: '欧洲最大港口带动物流、航运与贸易金融；建筑设计与城市规划领域享有全球声誉；清洁科技与循环经济是新兴支柱，鹿特丹已宣布2030年实现碳中和目标。',
      festivals: '鹿特丹国际电影节（IFFR，1-2月）是全球最重要的独立电影节之一；North Sea Jazz Festival（7月）是欧洲规模最大的室内爵士音乐节；鹿特丹马拉松（4月）是荷兰最大的路跑赛事。',
      figures: '哲学家伊拉斯谟（Erasmus）在鹿特丹出生，成为文艺复兴人文主义的代名词；建筑师雷姆·库哈斯的OMA事务所以鹿特丹为基地改变了全球建筑话语；荷兰画家扬·斯坦受到鹿特丹港口文化深刻影响。',
    },
    landing: {
      wifi: '100 Mbps', cost: '$$', visa: '申根90天免签，可申请荷兰自雇居留',
      visaDays: '90 days',
      visaDesc: '🛂 荷兰尚无数字游民专属签证，但自雇居留（Zelfstandige）申请相对成熟，需通过IND审核，审批约3个月。',
      welfare: '🏥 欧元区成员，荷兰医疗体系质量顶尖，外籍居民需购买强制基本医疗保险（约€130/月）。',
      safety: '整体安全，是荷兰犯罪率最低的大城市之一（低于阿姆斯特丹）。公共交通安全，夜间市中心有序，女性独行安全感高。',
      dailyCost: '每日预算参考：\n• 餐饮：€15–28（市场大厅午餐€10–15，晚餐餐厅€18–30）\n• 住宿：€50–85（市中心Airbnb单间，比阿姆斯特丹便宜约20%）\n• 交通：€4–6（OV月票€100，骑行基础设施完善）\n• 合计：约€69–119/天',
      visaDetail: '荷兰自雇居留（Zelfstandige zonder personeel，ZZP）适合freelancer，需通过IND（移民局）评估商业可行性，获批后可居留1年，可续签。荷兰对高技能外籍人才（DAFT协议）有特别优惠渠道。',
      society: '荷兰工作文化强调效率与直接，准时与预约是基本礼仪。骑行文化全球第一，90%以上出行依赖自行车。英语普及率近100%，外籍人士融入无语言障碍。',
    },
    chance: {
      paragraph: '港口科技（PortTech）、物流数字化与清洁能源是本地特色赛道；建筑设计与城市规划咨询需求旺盛；欧洲最大进出口贸易枢纽带来丰富的B2B机会。',
      policy: { label: 'Netherlands Foreign Investment Agency (NFIA)', url: 'https://www.nfia.nl/en/', desc: '荷兰官方外商投资促进机构' },
      localJobs: [
        { name: 'Nationale Vacaturebank', url: 'https://www.nationalevacaturebank.nl', desc: '荷兰大型招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '鹿特丹外籍人士社区以港口与科技行业从业者为主，YES!Delft创业生态系统是中欧重要的孵化平台。',
      platforms: [
        { name: 'Meetup Rotterdam', url: 'https://www.meetup.com/cities/nl/rotterdam/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Rotterdam', url: 'https://www.eventbrite.com/d/netherlands--rotterdam/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Stockholm: {
    name: 'Stockholm', nameZh: '斯德哥尔摩', country: 'Sweden', countryZh: '瑞典', flag: '🇸🇪', match: 74,
    soul: {
      headline: 'Spotify与IKEA的故乡，北欧创新的永恒坐标。',
      sub: '文化 · 设计 · 科技 · 自然',
      body: '斯德哥尔摩建在14座岛屿上，每一座桥都是一段历史。这里诞生了Spotify、Klarna、Mojang，证明了14座岛与500万人口可以创造出改变世界的公司。',
      personality: '瑞典人以平等主义（Jantelagen）和务实低调著称，不炫耀成功，重视可持续与设计美学。斯德哥尔摩的创业文化既有北欧的严谨，又有出人意料的创意爆发力。',
      economy: '科技初创生态全球顶尖，Spotify、Klarna、King等独角兽从这里走向世界；金融与制造业是传统支柱；设计与创意产业是城市软实力的核心，IKEA与H&M均发源于瑞典。',
      festivals: '仲夏节（Midsommar，6月）是瑞典最神圣的传统节日，竖花柱、跳青蛙舞是必不可少的仪式；诺贝尔颁奖典礼（12月10日）让斯德哥尔摩成为全球关注的焦点；音乐节Way Out West（哥德堡，8月）是北欧最重要的音乐节。',
      figures: 'ABBA成员均来自瑞典，用流行音乐征服了全球；阿尔弗雷德·诺贝尔在斯德哥尔摩留下了改变世界的遗产；建筑师拉尔夫·厄斯金的北极建筑哲学影响了全球极地设计。',
    },
    landing: {
      wifi: '95 Mbps', cost: '$$$', visa: '申根90天免签，可申请瑞典自雇居留',
      visaDays: '90 days',
      visaDesc: '🛂 申根90天免签，瑞典无专属数字游民签证。自雇居留（F-skatt）申请需提供商业计划，审批约3-6个月。',
      welfare: '🏥 瑞典医疗体系全球顶尖，外籍居民持证可享受与本地人相同的公立医疗，费用极低。',
      safety: '欧洲最安全的城市之一，暴力犯罪率极低。市中心与旅游区全天候安全，女性独行安全感极高。',
      dailyCost: '每日预算参考：\n• 餐饮：$25–45（咖啡馆午餐$18–25，晚餐餐厅$30–55）\n• 住宿：$70–130（市中心Airbnb单间，北欧价格最高之列）\n• 交通：$5–8（地铁月票$120，骑行系统完善）\n• 合计：约$100–183/天',
      visaDetail: '瑞典生活成本是欧洲最高之列，但公共服务质量匹配。自雇者需申请F-skattsedel税号，长期居留可申请永久居留，福利待遇接近本地公民。',
      society: '工作文化以Fika（咖啡休息）为核心，工作与生活平衡是不可协商的价值观。法定带薪假期25天以上，加班文化几乎不存在。英语普及率接近100%。',
    },
    chance: {
      paragraph: '科技初创是最大机会，斯德哥尔摩是欧洲独角兽密度最高的城市；设计、游戏（Mojang等）与音乐科技是特色赛道；北欧市场对创新产品接受度极高。',
      policy: { label: 'Business Sweden', url: 'https://www.business-sweden.com', desc: '瑞典官方贸易与投资促进委员会' },
      localJobs: [
        { name: 'Jobtech.se', url: 'https://jobtech.se', desc: '瑞典政府支持的开放招聘数据平台' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '斯德哥尔摩创业社群以科技从业者为主，SUP46等孵化器是活跃中心，外籍人士英语社群规模庞大。',
      platforms: [
        { name: 'Meetup Stockholm', url: 'https://www.meetup.com/cities/se/stockholm/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Stockholm', url: 'https://www.eventbrite.com/d/sweden--stockholm/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Copenhagen: {
    name: 'Copenhagen', nameZh: '哥本哈根', country: 'Denmark', countryZh: '丹麦', flag: '🇩🇰', match: 72,
    soul: {
      headline: 'Hygge与设计的圣地，世界上最幸福的城市。',
      sub: '文化 · 设计 · 美食 · 可持续',
      body: '哥本哈根是幸福感指数全球最高的城市之一，Hygge（拥抱舒适与温馨）不只是一个词，而是整座城市的生活哲学。Noma让这里成为全球美食朝圣地，而骑行与海港浴场是丹麦人日常生活的两大支柱。',
      personality: '丹麦人以平等、直接与工作生活平衡著称，会议中每个人的意见同等重要。哥本哈根的创业文化务实而有人情味，关注用户体验与可持续发展，设计美学贯穿于城市的每个角落。',
      economy: '制药（诺和诺德）、航运（马士基）与设计是传统支柱；科技初创与绿色能源是新兴增长点；哥本哈根已宣布2025年成为全球第一个碳中和首都的目标。',
      festivals: '哥本哈根爵士音乐节（Copenhagen Jazz Festival，7月）是欧洲最大的爵士节；CPH:DOX纪录片电影节（3月）是全球顶尖的纪录片盛事；圣诞市场（12月）以Tivoli游乐园为核心，是北欧最浪漫的节日体验。',
      figures: '童话作家汉斯·克里斯蒂安·安徒生在哥本哈根留下了全球最美丽的儿童文学遗产；哲学家索伦·克尔凯郭尔在此建立了存在主义哲学；建筑师约恩·乌松设计了悉尼歌剧院，以哥本哈根为永久精神家园。',
    },
    landing: {
      wifi: '100 Mbps', cost: '$$$', visa: '申根90天免签，可申请丹麦自雇居留',
      visaDays: '90 days',
      visaDesc: '🛂 申根90天免签，丹麦无专属数字游民签证。自雇居留申请需证明可在丹麦维持生计，审批3-6个月。',
      welfare: '🏥 丹麦全民免费医疗，外籍居民持证可享受与本地人相同的医疗保障，质量全球顶尖。',
      safety: '全球最安全城市之一，犯罪率极低，公共秩序极好。市中心全天候安全，女性独行安全感极高。',
      dailyCost: '每日预算参考：\n• 餐饮：$28–50（咖啡午餐$20–28，晚餐$35–60）\n• 住宿：$80–150（市中心Airbnb单间，北欧价格最高之列）\n• 交通：$5–8（地铁月票$130，骑行城市基础设施全球最佳）\n• 合计：约$113–208/天',
      visaDetail: '丹麦生活成本极高，但薪资水平与公共服务质量匹配。自雇申请通过可获1年居留，可续签，长期居留后可申请永久居留。收入税率较高（约40-56%），需提前规划税务。',
      society: '全球幸福感排名第一，工作周约37小时，加班极少。骑行文化全球领先，城市可持续设计是丹麦的软实力名片。英语普及率接近100%。',
    },
    chance: {
      paragraph: '绿色科技与可持续设计是哥本哈根特色赛道；医疗健康科技（HealthTech）以诺和诺德生态为依托；食品科技（FoodTech）在Noma效应下持续活跃。',
      policy: { label: 'Invest in Denmark', url: 'https://investindk.com/en/', desc: '丹麦官方外商投资促进机构' },
      localJobs: [
        { name: 'JobIndex', url: 'https://www.jobindex.dk', desc: '丹麦最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '哥本哈根创业生态成熟，Rainmaking、SCAPE等孵化器聚集，外籍人士英语社群活跃，融入障碍极低。',
      platforms: [
        { name: 'Meetup Copenhagen', url: 'https://www.meetup.com/cities/dk/copenhagen/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Copenhagen', url: 'https://www.eventbrite.com/d/denmark--copenhagen/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Helsinki: {
    name: 'Helsinki', nameZh: '赫尔辛基', country: 'Finland', countryZh: '芬兰', flag: '🇫🇮', match: 76,
    soul: {
      headline: '桑拿与寂静，北欧最内敛的创新之城。',
      sub: '文化 · 设计 · 科技 · 自然',
      body: '赫尔辛基是一座海湾之城——城市与岛屿、森林与海水无缝衔接。芬兰人以沉默为美德，但在桑拿里，所有人都会说真心话。这里的设计简约到极致，功能强大到令人惊叹。',
      personality: '芬兰人以诚实、守时与内敛著称，Sisu（坚韧不拔的精神）是民族气质的核心。赫尔辛基人不会主动寒暄，但一旦成为朋友就是终身挚友。游民社区以工作效率高著称，少说多做是普遍风格。',
      economy: 'Nokia遗留的科技基因与Rovio（愤怒的小鸟）等游戏公司定义了芬兰科技形象；教育科技（EdTech）是芬兰出口的新名片；造纸、金属与船舶制造是传统经济支柱。',
      festivals: '赫尔辛基节（Helsinki Festival，8月）是芬兰最大的艺术节，覆盖音乐、视觉艺术与表演；Flow Festival（8月）是北欧最重要的当代音乐节；仲夏节（Juhannus，6月）是芬兰最神圣的传统节日，全城迁往乡村别墅。',
      figures: '建筑师埃罗·萨里宁设计了纽约TWA候机楼，以芬兰功能主义震动世界；作曲家让·西贝柳斯的交响诗《芬兰颂》是民族精神的音乐化身；游戏设计师彼得里·雅尔维宁带领Supercell创造了《部落冲突》等全球爆款。',
    },
    landing: {
      wifi: '100 Mbps', cost: '$$$', visa: '申根90天免签，可申请芬兰自雇居留',
      visaDays: '90 days',
      visaDesc: '🛂 申根90天免签，芬兰无专属数字游民签证。芬兰Talent Boost计划鼓励国际人才落地，自雇申请审批约3个月。',
      welfare: '🏥 芬兰公立医疗覆盖全面，外籍居民持证可享受与本地人接近的医疗保障，桑拿文化也是一种医疗。',
      safety: '全球最安全城市之一，犯罪率极低，公共秩序极好，女性独行安全感极高。',
      dailyCost: '每日预算参考：\n• 餐饮：$22–40（咖啡馆午餐$15–22，晚餐$25–45）\n• 住宿：$65–120（市中心Airbnb单间，北欧价格较高）\n• 交通：$4–6（地铁月票$90，骑行系统完善）\n• 合计：约$91–166/天',
      visaDetail: '芬兰Talent Boost计划为国际人才提供定制化支持，自雇者申请私人企业主（Yrittäjä）许可，收入税率较高，但公共服务质量匹配。',
      society: '工作文化极度尊重个人空间，会议高效简洁，不废话。全球教育质量最高国家，公共图书馆服务全球领先。英语在赫尔辛基年轻人中普及率接近100%。',
    },
    chance: {
      paragraph: '游戏开发与EdTech是赫尔辛基特色赛道；清洁科技与智慧城市解决方案是政府主导的热点方向；芬兰设计品牌出海需求带来内容与营销机会。',
      policy: { label: 'Business Finland', url: 'https://www.businessfinland.fi/en/', desc: '芬兰官方外商投资与创新促进机构' },
      localJobs: [
        { name: 'Duunitori', url: 'https://duunitori.fi', desc: '芬兰最大招聘聚合平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '赫尔辛基的创业社群以Maria 01为核心，是北欧最大的专注初创企业园区，外籍人士融入渠道成熟。',
      platforms: [
        { name: 'Meetup Helsinki', url: 'https://www.meetup.com/cities/fi/helsinki/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Helsinki', url: 'https://www.eventbrite.com/d/finland--helsinki/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Zurich: {
    name: 'Zurich', nameZh: '苏黎世', country: 'Switzerland', countryZh: '瑞士', flag: '🇨🇭', match: 65,
    soul: {
      headline: '全球金融之都，品质生活的极致标准。',
      sub: '文化 · 金融 · 设计 · 自然',
      body: '苏黎世是全球生活质量排名最高的城市之一，瑞士银行的穹顶在阳光下熠熠生辉，利马特河在古城中静静流淌。这里的一切都精确、干净、昂贵——但绝对值得。',
      personality: '苏黎世人以守时、严谨与对品质的执着著称，多语言能力是标配（德语、法语、意大利语均通行）。创业文化务实且目标导向，高校密集（ETH苏黎世）带来源源不断的科技人才。',
      economy: '金融与银行业是全球命脉，瑞信与瑞银总部所在地；科技初创以医疗健康与金融科技为主；制药（诺华）与精密制造享誉全球；旅游业稳定而高端。',
      festivals: '苏黎世艺术节（Zurich Fest，8月）是瑞士最大的城市节庆；蓝调节（Blues Festival，11月）是瑞士最重要的蓝调音乐聚会；圣诞市场（12月，Bellevue广场）是欧洲最美圣诞市集之一。',
      figures: '物理学家阿尔伯特·爱因斯坦在苏黎世联邦理工学院求学，改变了人类对宇宙的认知；心理学家卡尔·荣格在苏黎世创立了分析心理学；建筑师勒·柯布西耶早年在苏黎世接受艺术训练，奠定了现代主义建筑的基础。',
    },
    landing: {
      wifi: '100 Mbps', cost: '$$$', visa: '申根90天免签，可申请瑞士自雇居留',
      visaDays: '90 days',
      visaDesc: '🛂 瑞士非欧盟成员，申根规则适用。自雇居留申请需证明财务自足与商业可行性，审批约3-6个月。',
      welfare: '🏥 瑞士医疗体系全球顶尖，但费用极高，强制购买基本医疗保险（约CHF400-600/月）。',
      safety: '全球最安全城市之一，犯罪率极低，公共交通零误差。女性独行安全感极高，全天候安全。',
      dailyCost: '每日预算参考：\n• 餐饮：$35–60（超市简餐$15–25，餐厅午餐$25–40）\n• 住宿：$120–200（市中心Airbnb单间，欧洲最贵之列）\n• 交通：$8–12（月票CHF155，公共交通覆盖极广）\n• 合计：约$163–272/天',
      visaDetail: '瑞士居留申请分为EU/EFTA与第三国两个通道，第三国公民审批更严格，需证明雇主或商业理由。长期居留后享有极高的社会保障，养老金体系全球顶尖。',
      society: '生活成本全球最高之列，但薪资水平与公共服务匹配。多元文化城市，英语、德语、法语均广泛使用，外籍人士占苏黎世人口约30%。',
    },
    chance: {
      paragraph: '金融科技（Fintech）与财富管理科技（WealthTech）是苏黎世的核心赛道；医疗健康科技（HealthTech）以诺华生态为依托；ETH苏黎世带动深科技（DeepTech）持续活跃。',
      policy: { label: 'Switzerland Global Enterprise (S-GE)', url: 'https://www.s-ge.com/en', desc: '瑞士官方贸易与投资促进机构' },
      localJobs: [
        { name: 'Jobs.ch', url: 'https://www.jobs.ch', desc: '瑞士最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '苏黎世外籍人士社群规模庞大（占人口约30%），Impact Hub苏黎世是全球影响力最大的社会创新孵化网络发源地。',
      platforms: [
        { name: 'Meetup Zurich', url: 'https://www.meetup.com/cities/ch/zurich/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Zurich', url: 'https://www.eventbrite.com/d/switzerland--zurich/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Lyon: {
    name: 'Lyon', nameZh: '里昂', country: 'France', countryZh: '法国', flag: '🇫🇷', match: 82,
    soul: {
      headline: '法国美食之都，隐藏在巴黎光环下的创意城市。',
      sub: '文化 · 美食 · 历史 · 科技',
      body: '里昂是法国厨师的圣地，保罗·博古斯的遗产在每一家布雄餐馆里延续。索恩河与罗讷河在城中汇流，中世纪旧城的密道（traboules）藏着里昂最迷人的秘密。',
      personality: '里昂人有一种低调的自豪感，不需要巴黎的认可就知道自己城市的价值。创业文化以医疗健康与数字化为核心，法国第二大经济中心的地位带来了充沛的商业机会与略低于巴黎的生活成本。',
      economy: '医疗健康（生物制药、医疗器械）是最重要的产业集群；丝绸与纺织业的历史遗产催生了时尚与纺织科技；数字化与智慧城市建设吸引大量初创公司；旅游业稳定增长。',
      festivals: '灯光节（Fête des Lumières，12月8日）是全球最壮观的城市灯光展，每年吸引200万游客；里昂国际纪录片电影节（Sunny Side of the Doc，6月）是欧洲最重要的纪录片市场；保罗·博古斯美食节每年致敬这座城市的厨艺传统。',
      figures: '大厨保罗·博古斯是法国新式烹饪（Nouvelle Cuisine）的缔造者，让里昂成为全球美食朝圣地；电影发明者卢米埃尔兄弟在里昂完成了人类第一部电影放映；小说家安托万·德·圣-埃克苏佩里是《小王子》的作者。',
    },
    landing: {
      wifi: '70 Mbps', cost: '$$', visa: '申根90天免签，可申请法国数字游民签证（Talent Passport）',
      visaDays: '365 days',
      visaDesc: '🛂 法国Talent Passport（人才护照）适合自雇与创业者，有效期4年，月收入要求约€2,700，审批约2个月。',
      welfare: '🏥 法国医疗体系全球顶尖，持有效居留可参与法国社保（CPAM），看诊费用极低。',
      safety: '整体安全，旧城区与商业区治安良好，部分郊区需注意。夜间市中心有序，女性独行白天安全感高。',
      dailyCost: '每日预算参考：\n• 餐饮：€15–28（布雄午餐€15–22，晚餐€20–35）\n• 住宿：€40–75（市中心Airbnb单间，比巴黎便宜约40%）\n• 交通：€3–5（地铁月票€65，骑行系统完善）\n• 合计：约€58–108/天',
      visaDetail: '法国Talent Passport是欧洲最灵活的长期居留签证之一，覆盖创业者、艺术家与自雇专业人士，有效期4年可续签，配偶可获同等居留权。',
      society: '法国工作文化重视生活质量，35小时工作周是法定标准，带薪假期25天以上。里昂生活成本比巴黎低30-40%，但城市设施几乎与巴黎相当。',
    },
    chance: {
      paragraph: '医疗健康科技（HealthTech/BioTech）是里昂特色赛道；纺织科技与时尚科技结合城市历史形成独特优势；法国市场本地化内容与营销需求旺盛。',
      policy: { label: 'Invest in Lyon', url: 'https://www.onlylyon.com/business/invest/', desc: '大里昂都市圈官方投资促进机构' },
      localJobs: [
        { name: 'Pôle Emploi', url: 'https://www.pole-emploi.fr', desc: '法国国家就业局，覆盖全国各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '里昂的创业生态以EMLYON商学院校友网络为核心，法国Tech Lyon社区活跃，外籍人士多集中于Presqu\'île半岛区域。',
      platforms: [
        { name: 'Meetup Lyon', url: 'https://www.meetup.com/cities/fr/lyon/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Lyon', url: 'https://www.eventbrite.com/d/france--lyon/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Nice: {
    name: 'Nice', nameZh: '尼斯', country: 'France', countryZh: '法国', flag: '🇫🇷', match: 79,
    soul: {
      headline: '蔚蓝海岸的明珠，地中海阳光与法式优雅的完美融合。',
      sub: '文化 · 海滩 · 美食 · 艺术',
      body: '尼斯的英国人海滨步道（Promenade des Anglais）是全球最美的城市海滨大道之一，蔚蓝色的地中海就在眼前。旧城区（Vieux-Nice）的橙黄色建筑与热闹集市，让这里既有法式精致又有意式热情。',
      personality: '尼斯独特的文化融合了法国南部的悠闲与意大利的活泼——尼斯直到1860年才成为法国领土，意大利语遗存在烹饪与方言中清晰可辨。人们热情、享乐主义，把阳光与美食当作人生最重要的事。',
      economy: '旅游业是主导产业，卡纳维拉尔科技园（Sophia Antipolis）是欧洲最大的科技园区之一，聚集了数百家科技公司；文化创意、健康养老与数字经济是新兴支柱。',
      festivals: '尼斯狂欢节（Carnaval de Nice，2月）是全球规模最大的狂欢节之一，花车游行壮观华丽；尼斯爵士节（Nice Jazz Festival，7月）是法国历史最悠久的爵士音乐节；Corso fleuri鲜花游行（2月）展示蔚蓝海岸的花卉盛况。',
      figures: '画家亨利·马蒂斯在尼斯度过了生命的后半段，其野兽主义色彩受地中海阳光的直接启发；雕塑家阿尔曼（Arman）在尼斯出生，是新现实主义艺术运动的核心人物；作家罗杰·波多斯以尼斯为背景写下了著名的侦探小说系列。',
    },
    landing: {
      wifi: '65 Mbps', cost: '$$', visa: '申根90天免签，可申请法国Talent Passport',
      visaDays: '365 days',
      visaDesc: '🛂 法国Talent Passport适合自雇与创业者，4年期，月收入要求约€2,700。尼斯近邻摩纳哥，税务规划选项多样。',
      welfare: '🏥 法国公共医疗覆盖，持有效居留可参与法国社保体系，医疗质量高，费用合理。',
      safety: '整体安全，旅游区海滨步道扒窃风险存在，旧城区夜间有序。女性独行白天安全感高，夜间建议结伴出行。',
      dailyCost: '每日预算参考：\n• 餐饮：€14–26（旧城区小馆午餐€12–18，晚餐€18–30）\n• 住宿：€45–85（旺季7-8月价格翻倍，淡季性价比高）\n• 交通：€3–5（电车月票€45，骑行到海滩极便利）\n• 合计：约€62–116/天',
      visaDetail: '近邻摩纳哥（20分钟车程），部分高净值游民选择摩纳哥居留（零个人所得税）同时在尼斯生活。法国Talent Passport可在尼斯申请，与全国标准一致。',
      society: '地中海生活节奏，工作与海滩在同一天轮流进行是当地常态。Sophia Antipolis科技园的存在让尼斯拥有超出其旅游形象的科技底蕴，外籍人士社区在卡纳比埃一带聚集。',
    },
    chance: {
      paragraph: '旅游科技与酒店管理科技是本地热点；Sophia Antipolis带动了智能城市与健康科技需求；豪华旅游与游艇行业的数字化需求旺盛。',
      policy: { label: "Côte d'Azur Economic Development Agency", url: 'https://www.riviera-invest.com/en/', desc: '蔚蓝海岸官方经济发展与投资促进机构' },
      localJobs: [
        { name: 'Pôle Emploi', url: 'https://www.pole-emploi.fr', desc: '法国国家就业局，覆盖全国各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '尼斯的外籍人士社区以英国人、意大利人与科技从业者为主，Sophia Antipolis科技园是最大的专业人士聚集地。',
      platforms: [
        { name: 'Meetup Nice', url: 'https://www.meetup.com/cities/fr/nice/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Nice', url: 'https://www.eventbrite.com/d/france--nice/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Bordeaux: {
    name: 'Bordeaux', nameZh: '波尔多', country: 'France', countryZh: '法国', flag: '🇫🇷', match: 83,
    soul: {
      headline: '世界葡萄酒之都，大西洋岸的优雅慢城。',
      sub: '文化 · 美食 · 建筑 · 自然',
      body: '波尔多是联合国教科文组织世界遗产城市，18世纪新古典主义建筑群在加龙河畔连绵展开，水镜广场（Miroir d\'eau）是欧洲最大的反光水景，傍晚的倒影令人屏息。',
      personality: '波尔多人以葡萄酒文化为豪，慢生活哲学深入骨髓——即使是工作日，午餐也是一件严肃的事情。近年来高铁开通（从巴黎只需2小时）带来了大量年轻创业者，城市正在从沉睡中加速苏醒。',
      economy: '葡萄酒产业是全球品牌，带动旅游、餐饮与农业科技；航空航天（空客供应链）是重要制造业支柱；数字经济与创业生态随巴黎人口外溢快速成长。',
      festivals: 'Bordeaux Fête le Vin葡萄酒节（6月，双年举办）是全球最大的葡萄酒盛宴，河边汇聚数十万酒客；FACTS动漫节（10月）是法国南部最大的流行文化节；Fête de la Musique（6月21日）是全城共享的免费音乐夜。',
      figures: '哲学家孟德斯鸠是波尔多人，其《论法的精神》奠定了现代法治理念的基础；画家弗朗西斯科·戈雅在流亡期间在波尔多度过了生命的最后岁月；导演让·维果以波尔多的自由精神为创作源泉。',
    },
    landing: {
      wifi: '68 Mbps', cost: '$$', visa: '申根90天免签，可申请法国Talent Passport',
      visaDays: '365 days',
      visaDesc: '🛂 法国Talent Passport适合自雇与创业者，4年期，月收入要求约€2,700，审批约2个月。',
      welfare: '🏥 法国公共医疗体系，持有效居留可参与CPAM，医疗质量高，费用合理。',
      safety: '整体安全，旧城区与河畔全天候安全，部分郊区夜间需注意。女性独行白天安全感高。',
      dailyCost: '每日预算参考：\n• 餐饮：€13–25（传统小馆午餐€12–18，晚餐€18–28）\n• 住宿：€38–70（市中心Airbnb单间，比巴黎便宜约40%）\n• 交通：€3–5（有轨电车月票€55，骑行系统完善）\n• 合计：约€54–100/天',
      visaDetail: '法国Talent Passport可在波尔多申请，与全国标准一致。巴黎2小时高铁让波尔多成为理想的"逃离巴黎"目的地，既享有法国资源，又保持相对低廉的生活成本。',
      society: '生活节奏悠闲，葡萄酒是日常社交的核心媒介。波尔多大学城氛围浓厚，年轻人比例高，外籍人士融入相对容易。',
    },
    chance: {
      paragraph: '葡萄酒旅游科技（WineTech）是本地独特赛道；航空航天供应链数字化需求旺盛；法国市场本地化内容创作稳定增长。',
      policy: { label: 'Invest in Bordeaux Métropole', url: 'https://invest.bordeaux-metropole.fr/en/', desc: '波尔多都市圈官方投资促进机构' },
      localJobs: [
        { name: 'Pôle Emploi', url: 'https://www.pole-emploi.fr', desc: '法国国家就业局，覆盖全国各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '波尔多创业社群以Darwin生态园为核心，可持续与社会创新主题的外籍人士社区在此汇聚。',
      platforms: [
        { name: 'Meetup Bordeaux', url: 'https://www.meetup.com/cities/fr/bordeaux/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Bordeaux', url: 'https://www.eventbrite.com/d/france--bordeaux/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Montpellier: {
    name: 'Montpellier', nameZh: '蒙彼利埃', country: 'France', countryZh: '法国', flag: '🇫🇷', match: 85,
    soul: {
      headline: '法国最年轻的大城市，地中海阳光下的创业新热点。',
      sub: '文化 · 教育 · 创业 · 海滩',
      body: '蒙彼利埃是法国人口增长最快的城市之一，学生占总人口约三分之一，带来了与城市规模不相称的活力与创意密度。距地中海海滩仅15分钟，是法国生活成本最低而阳光最充足的科技城市。',
      personality: '蒙彼利埃充满年轻人的能量与乐观，大学城氛围让这里保持着永久的青春感。南法慢生活与创业热情并存，卡托利克教堂广场是每天下午自发聚会的场所。',
      economy: '医疗健康（欧洲最重要的医学院之一）与信息技术是支柱产业；IBM、Dell等科技巨头的法国研发中心落户于此；农业科技以周边葡萄酒与橄榄产区为背景快速成长。',
      festivals: '蒙彼利埃舞蹈节（Montpellier Danse，6-7月）是全球最重要的当代舞蹈节；Radio France音乐节（7月）带来古典与爵士的交融；葡萄酒节（Foire aux Vins，7月）是朗格多克产区的年度盛宴。',
      figures: '哲学家奥古斯特·孔德在蒙彼利埃大学学习，创立了社会学这门学科；诗人保罗·瓦莱里在蒙彼利埃留下了其知识形成的关键岁月；医学先驱弗朗索瓦·拉伯雷在蒙彼利埃医学院就读，开创了人文主义医学传统。',
    },
    landing: {
      wifi: '65 Mbps', cost: '$', visa: '申根90天免签，可申请法国Talent Passport',
      visaDays: '365 days',
      visaDesc: '🛂 法国Talent Passport适合自雇与创业者，4年期，月收入要求约€2,700。蒙彼利埃生活成本在法国大城市中最低之列。',
      welfare: '🏥 法国公共医疗体系完善，蒙彼利埃医学院保证了本地医疗资源的丰富，持居留证可参与CPAM。',
      safety: '整体安全，大学城氛围让城市保持活力，旧城区全天候安全。女性独行整体安全感高。',
      dailyCost: '每日预算参考：\n• 餐饮：€11–22（大学区小馆午餐€9–14，晚餐€14–24）\n• 住宿：€30–58（市中心Airbnb单间，法国大城市最低价之列）\n• 交通：€3–4（有轨电车月票€38，骑行海滩极便利）\n• 合计：约€44–84/天',
      visaDetail: '蒙彼利埃生活成本约为巴黎的60-65%，是法国游民性价比最高的目的地之一。法国Talent Passport全国统一申请标准，审批约2个月。',
      society: '学生城市氛围带来持续的多元文化融合，大学提供大量英语课程，外籍人士社区年轻化。地中海气候全年300天阳光，户外生活质量极高。',
    },
    chance: {
      paragraph: '医疗健康科技依托欧洲顶级医学院资源持续活跃；教育科技与语言学习平台有丰富的本地用户基础；农业科技结合朗格多克产区正在兴起。',
      policy: { label: 'Business France', url: 'https://www.businessfrance.fr/en', desc: '法国官方贸易与投资促进机构' },
      localJobs: [
        { name: 'Pôle Emploi', url: 'https://www.pole-emploi.fr', desc: '法国国家就业局，覆盖全国各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '蒙彼利埃的数字游民社群以年轻从业者为主，BIC蒙彼利埃创业孵化器是最活跃的创业者社区聚集地。',
      platforms: [
        { name: 'Meetup Montpellier', url: 'https://www.meetup.com/cities/fr/montpellier/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Montpellier', url: 'https://www.eventbrite.com/d/france--montpellier/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Edinburgh: {
    name: 'Edinburgh', nameZh: '爱丁堡', country: 'United Kingdom', countryZh: '英国', flag: '🇬🇧', match: 78,
    soul: {
      headline: '城堡与雾气，全球最浪漫的文学之城。',
      sub: '文化 · 历史 · 文学 · 艺术',
      body: '爱丁堡是全球第一座联合国教科文组织认定的文学之城。城堡俯瞰皇家大道，J.K.罗琳在这里的咖啡馆写出了哈利·波特第一章，每年8月，世界上最大的艺术节把这座城市变成一整个舞台。',
      personality: '爱丁堡人以机智、独立与苏格兰骄傲著称，与伦敦的商业气质截然不同。城市学术氛围浓厚（爱丁堡大学是全球百强），金融与科技的融合产生了独特的创业文化。',
      economy: '金融服务是传统支柱（苏格兰皇家银行发源地）；科技初创生态快速成长，爱丁堡被誉为"硅格伦"（Silicon Glen）；旅游业是第二大产业，弗林奇艺术节每年带来数百万游客。',
      festivals: '爱丁堡弗林奇艺术节（Edinburgh Festival Fringe，8月）是全球最大的艺术节，3500+个节目在整座城市上演；爱丁堡国际电影节（6月）是全球历史最悠久的电影节；跨年夜Hogmanay庆典是苏格兰最重要的传统节日。',
      figures: 'J.K.罗琳在爱丁堡咖啡馆写出哈利·波特的第一章，改变了全球儿童文学的面貌；亚当·斯密的《国富论》在爱丁堡的启蒙思想土壤中诞生；查尔斯·达尔文在爱丁堡大学开始了他的博物学训练。',
    },
    landing: {
      wifi: '75 Mbps', cost: '$$', visa: '英国免签6个月（因国籍而异），可申请英国自雇签证',
      visaDays: '180 days',
      visaDesc: '🛂 英国脱欧后，欧盟护照需申请电子旅行授权（ETA）。长期居留可申请Global Talent Visa或自雇签证。',
      welfare: '🏥 NHS国民健康服务向居民提供免费医疗，持有效签证可享受与本地人相同的医疗待遇。',
      safety: '整体安全，是英国犯罪率最低的大城市之一。皇家大道与旧城区全天候安全，节日期间人流密集需注意扒窃。',
      dailyCost: '每日预算参考：\n• 餐饮：$16–28（咖啡馆午餐$12–18，晚餐$18–30）\n• 住宿：$55–100（市中心Airbnb单间，节日旺季价格翻倍）\n• 交通：$3–6（月票$80，步行可达旧城区大部分景点）\n• 合计：约$74–134/天',
      visaDetail: '英国Global Talent Visa适合科技、艺术与学术领域精英，需获认可机构背书，有效期5年。自雇签证（Self-Employment Visa）需提供客户合同与财务证明。',
      society: '英语环境使融入极为便利，苏格兰人以热情豪放著称（区别于英格兰的保守印象）。爱丁堡大学文化使城市保持了持续的知识活力，咖啡馆文化盛行。',
    },
    chance: {
      paragraph: '金融科技（FinTech）与数字金融是爱丁堡特色赛道；文化创意与内容产业依托艺术节生态蓬勃；人工智能与生命科学初创快速成长。',
      policy: { label: 'Scottish Enterprise', url: 'https://www.scottish-enterprise.com/support-for-businesses', desc: '苏格兰官方经济发展与投资促进机构' },
      localJobs: [
        { name: 'S1Jobs', url: 'https://www.s1jobs.com', desc: '苏格兰最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '爱丁堡外籍人士社群规模庞大，Codebase是英国最大的科技创业中心之一，社群活动频繁。',
      platforms: [
        { name: 'Meetup Edinburgh', url: 'https://www.meetup.com/cities/gb/edinburgh/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Edinburgh', url: 'https://www.eventbrite.com/d/united-kingdom--edinburgh/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Milan: {
    name: 'Milan', nameZh: '米兰', country: 'Italy', countryZh: '意大利', flag: '🇮🇹', match: 76,
    soul: {
      headline: '全球时尚与设计之都，意大利经济的真正引擎。',
      sub: '文化 · 时尚 · 设计 · 商业',
      body: '米兰是意大利最国际化的城市，时装周与家具展让它成为全球创意产业的风向标。但在T台之外，达芬奇的《最后的晚餐》就挂在一所老教堂的墙上，安静地等待着你。',
      personality: '米兰人以效率著称（在意大利是绝对罕见的特质），工作文化更接近北欧而非南意大利。时尚感是一种生存本能，就算是遛狗也要穿得体面。对外来者保持职业性的开放，融入需要时间但值得等待。',
      economy: '时尚与奢侈品（Armani、Prada、Versace总部均在此）是软实力核心；金融服务与制造业是经济支柱；设计与科技初创生态快速成长，米兰正在争夺欧洲第二大创业城市的地位。',
      festivals: '米兰时装周（Milano Fashion Week，2月/9月）是全球四大时装周之一；米兰设计周（Salone del Mobile，4月）是全球最大的家具与设计展；米兰圣安布罗吉奥节（12月7日）是城市的守护圣人节庆。',
      figures: '达芬奇的《最后的晚餐》永久保存在米兰；设计师吉奥·庞帝（Gio Ponti）以皮雷利大厦重塑了米兰的现代天际线；作曲家朱塞佩·威尔第在斯卡拉歌剧院首演了他最重要的歌剧作品。',
    },
    landing: {
      wifi: '75 Mbps', cost: '$$$', visa: '申根90天免签，可申请意大利数字游民签证',
      visaDays: '365 days',
      visaDesc: '🛂 意大利2024年推出数字游民签证，月收入要求约€2,700，在欧盟境外雇主工作或自雇，审批约2-3个月。',
      welfare: '🏥 意大利NHS（SSN）覆盖全国，持有效居留可参与公共医疗；米兰私立诊所质量高但费用较贵。',
      safety: '整体安全，中央火车站与购物区扒窃风险较高。夜间部分街区需注意，女性独行白天安全感较高。',
      dailyCost: '每日预算参考：\n• 餐饮：€15–30（小馆午餐€10–18，晚餐€20–35）\n• 住宿：€55–100（市中心Airbnb单间，设计周期间价格暴涨）\n• 交通：€3–5（地铁月票€39，骑行基础设施完善）\n• 合计：约€73–135/天',
      visaDetail: '意大利数字游民签证（Visto per Nomadi Digitali）要求月均收入≥€2,700，需提供健康保险与住址证明，有效期1年可续签为2年居留许可。',
      society: '米兰工作节奏快于意大利其他城市，英语在商业环境普及率较高。设计与时尚社群国际化，外籍专业人士融入相对容易。',
    },
    chance: {
      paragraph: '时尚科技（FashionTech）与设计科技是米兰特色赛道；金融科技在意大利金融中心生态下活跃；制造业数字化（工业4.0）需求旺盛。',
      policy: { label: 'Invest in Lombardy', url: 'https://www.invest.regione.lombardia.it/en/', desc: '伦巴第大区官方投资促进机构' },
      localJobs: [
        { name: 'Infojob.it', url: 'https://www.infojobs.it', desc: '意大利最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '米兰的外籍人士社群庞大而多元，Talent Garden等联合办公空间是创意从业者的聚集地，国际化程度远超意大利其他城市。',
      platforms: [
        { name: 'Meetup Milan', url: 'https://www.meetup.com/cities/it/milan/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Milan', url: 'https://www.eventbrite.com/d/italy--milan/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Bologna: {
    name: 'Bologna', nameZh: '博洛尼亚', country: 'Italy', countryZh: '意大利', flag: '🇮🇹', match: 84,
    soul: {
      headline: '欧洲最古老大学之城，美食、左翼文化与红色拱廊的交响。',
      sub: '文化 · 美食 · 教育 · 历史',
      body: '博洛尼亚以三个绰号著称：La Dotta（博学者之城）、La Grassa（美食之城）、La Rossa（红色之城）——分别指向大学、美食与政治传统。38公里的红色拱廊将整座城市连为一体，是人类最宏伟的步行系统之一。',
      personality: '博洛尼亚人以慷慨、开明与对美食的宗教级热情著称。作为意大利左翼文化的心脏地带，这里的政治讨论与美食讨论同样激烈。大学城氛围带来了持续的年轻活力与思想多元。',
      economy: '制造业（包装机械、食品加工设备）是"博洛尼亚工业区"的骨干；大学经济带动教育、研究与文化产业；食品产业（意式火腿、意大利面）是全球品牌；科技初创生态以大学为依托稳步成长。',
      festivals: '博洛尼亚儿童书展（Bologna Children\'s Book Fair，3月）是全球最重要的出版业盛会；宗教圣象巡游（Festa di San Petronio，10月）是城市守护圣人节庆；Cinema Ritrovato电影节（6月）致敬经典电影遗产。',
      figures: '天文学家尼古拉·哥白尼在博洛尼亚大学学习了法学与天文学，奠定了日心说的知识基础；画家乔治·莫兰迪在博洛尼亚度过了一生，以静物画建立了独特的视觉哲学；作曲家奥托里诺·雷斯庇基将博洛尼亚的声音带向了全球交响乐厅。',
    },
    landing: {
      wifi: '72 Mbps', cost: '$$', visa: '申根90天免签，可申请意大利数字游民签证',
      visaDays: '365 days',
      visaDesc: '🛂 意大利数字游民签证月收入要求约€2,700，博洛尼亚申请流程与全国一致，审批约2-3个月。',
      welfare: '🏥 意大利NHS（SSN）覆盖全国，持居留证可参与公共医疗；博洛尼亚医疗水平高于意大利南部城市。',
      safety: '意大利最安全的城市之一，犯罪率极低，旧城区与大学区全天候安全，女性独行安全感高。',
      dailyCost: '每日预算参考：\n• 餐饮：€13–25（传统餐厅午餐€10–16，晚餐€16–28）\n• 住宿：€38–70（市中心Airbnb单间，比米兰便宜约30%）\n• 交通：€2–4（巴士月票$35，步行可达旧城区大部分景点）\n• 合计：约€53–99/天',
      visaDetail: '博洛尼亚生活成本约为米兰的70-75%，大学城带来了丰富的英语交流环境。意大利数字游民签证全国统一申请，可在博洛尼亚领事馆办理相关手续。',
      society: '大学城氛围带来持续的多元文化融合，英语在学术与科技圈普及。博洛尼亚以美食文化著称，周末农贸市场是融入社区的最佳方式。',
    },
    chance: {
      paragraph: '包装机械与工业自动化是本地独特赛道；食品科技（FoodTech）依托全球美食品牌生态成长；出版与内容产业以书展为中心持续活跃。',
      policy: { label: 'Invest in Emilia-Romagna', url: 'https://investinemiliaromagna.it/en/', desc: '艾米利亚-罗马涅大区官方投资促进机构' },
      localJobs: [
        { name: 'Infojob.it', url: 'https://www.infojobs.it', desc: '意大利最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '博洛尼亚的数字游民社群依托大学生态快速成长，Impact Hub Bologna是创意从业者与社会创业者的聚集地。',
      platforms: [
        { name: 'Meetup Bologna', url: 'https://www.meetup.com/cities/it/bologna/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Bologna', url: 'https://www.eventbrite.com/d/italy--bologna/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Naples: {
    name: 'Naples', nameZh: '那不勒斯', country: 'Italy', countryZh: '意大利', flag: '🇮🇹', match: 80,
    soul: {
      headline: '混沌即诗意，披萨的故乡，地中海最真实的城市。',
      sub: '文化 · 美食 · 历史 · 自然',
      body: '那不勒斯是欧洲最混沌、最真实也最令人着迷的城市。这里没有刻意为游客打造的门面，只有地道的生活：窗台晾晒的衣物、空气中弥漫的披萨香、维苏威火山沉默地守望着海湾。',
      personality: '那不勒斯人以热情、戏剧性与对生活的彻底享受著称，"Napoli non fa per tutti"（那不勒斯不适合所有人）是本地人的自豪宣言。这座城市需要适应，但适应后会给你一种其他地方无法替代的真实感。',
      economy: '旅游业是最大支柱，通往庞贝、赫库兰尼姆与阿马尔菲海岸的门户地位带来稳定客流；制造业（食品加工、纺织）与海运是传统产业；科技初创生态以南意大利最大规模在此成长。',
      festivals: '那不勒斯圣热纳罗节（Festa di San Gennaro，9月）是全城守护圣人节庆，液化血奇迹牵动全市神经；Maggio dei Monumenti（5月）开放全城历史遗迹；那不勒斯披萨节（Napoli Pizza Village，9月）是全球最大的披萨节。',
      figures: '诗人维吉尔在那不勒斯度过了生命的最后岁月，《埃涅伊德》的灵感源于此处；哲学家乔尔达诺·布鲁诺在那不勒斯出生，以自由思想殉道；女演员索菲亚·罗兰是那不勒斯最骄傲的文化符号。',
    },
    landing: {
      wifi: '60 Mbps', cost: '$', visa: '申根90天免签，可申请意大利数字游民签证',
      visaDays: '365 days',
      visaDesc: '🛂 意大利数字游民签证月收入要求约€2,700，那不勒斯生活成本在意大利大城市中最低，性价比突出。',
      welfare: '🏥 意大利NHS（SSN）全国覆盖，持居留证可参与公共医疗；那不勒斯医院水平参差，建议购买私立补充保险。',
      safety: '需要有选择地融入。旧城区历史中心与海滨大道安全感较高；部分郊区（Scampia）不建议涉足。保持常规大城市旅行意识，女性独行旅游区白天安全感一般。',
      dailyCost: '每日预算参考：\n• 餐饮：€10–20（传统小馆午餐€7–12，披萨晚餐€8–15）\n• 住宿：€28–55（市中心Airbnb单间，意大利最低价之列）\n• 交通：€2–3（地铁月票$28，步行可达旧城区大部分景点）\n• 合计：约€40–78/天',
      visaDetail: '那不勒斯生活成本约为米兰的55-65%，是意大利游民最具性价比的目的地。意大利数字游民签证全国统一标准，可在那不勒斯领事馆办理相关手续。',
      society: '那不勒斯生活节奏悠闲，人际关系热烈而直接。外籍社区规模不如米兰，但正在快速成长。地理位置绝佳，维苏威、庞贝与阿马尔菲海岸均在1小时内。',
    },
    chance: {
      paragraph: '旅游科技与文化遗产数字化是本地热点；食品科技依托世界级美食传统成长；南意大利市场本地化需求随数字经济崛起而增长。',
      policy: { label: 'Invitalia - National Agency for Inward Investment', url: 'https://www.invitalia.it/en/', desc: '意大利官方内外资投资促进机构' },
      localJobs: [
        { name: 'Infojob.it', url: 'https://www.infojobs.it', desc: '意大利最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '那不勒斯的数字游民社群以内容创作者与旅游从业者为主，BASE Napoli是本地最活跃的创意与创业社区。',
      platforms: [
        { name: 'Meetup Naples', url: 'https://www.meetup.com/cities/it/naples/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Naples', url: 'https://www.eventbrite.com/d/italy--naples/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Antwerp: {
    name: 'Antwerp', nameZh: '安特卫普', country: 'Belgium', countryZh: '比利时', flag: '🇧🇪', match: 78,
    soul: {
      headline: '全球钻石之都，鲁本斯与当代时尚的交汇地。',
      sub: '文化 · 时尚 · 艺术 · 港口',
      body: '安特卫普是全球85%宝石级钻石的集散地，也是欧洲时尚界最被低估的城市之一。斯海尔德河畔的哥特式大教堂与鲁本斯故居之间，藏着这座城市对美的永恒执念。',
      personality: '安特卫普人以直率、对美的高标准与强烈的城市自豪感著称，他们瞧不起只知道布鲁塞尔的人。时尚圈"安特卫普六君子"的传奇让这座城市在设计界的地位远超其规模，年轻的创意社群持续涌入。',
      economy: '钻石贸易是全球独一无二的支柱；港口是欧洲第二大，带动物流与石化产业；皇家艺术学院催生了持续的时尚与设计经济；科技初创生态以港口数字化为特色成长。',
      festivals: '安特卫普时尚周（Antwerp Fashion Week，4月）展示下一代设计天才；坚不可摧节（Sfinks Festival，7月）是比利时最大的世界音乐节；鲁本斯集市（Rubenianum，8月）将整座城市带回巴洛克时代。',
      figures: '巴洛克画家彼得·保罗·鲁本斯在安特卫普度过了创作生涯的鼎盛时期，故居至今完好；时尚设计师安·迪穆拉米斯特是"安特卫普六君子"的核心人物；印刷商克里斯托弗·普朗坦在安特卫普建立了欧洲最重要的16世纪印刷坊。',
    },
    landing: {
      wifi: '80 Mbps', cost: '$$', visa: '申根90天免签，比利时无数字游民专属签证',
      visaDays: '90 days',
      visaDesc: '🛂 比利时无专属数字游民签证，申根90天免签。长期居留可通过自雇或受雇途径申请，审批约3-6个月。',
      welfare: '🏥 欧元区成员，比利时医疗体系完善，外籍居民持有效居留可参与强制医疗保险体系。',
      safety: '整体安全，港口城市背景带来文化多元，主要旅游区与旧城区治安良好。夜间部分街区需注意，女性独行白天安全感高。',
      dailyCost: '每日预算参考：\n• 餐饮：€15–28（小馆午餐€10–16，晚餐€18–30）\n• 住宿：€45–80（市中心Airbnb单间，比布鲁塞尔稍便宜）\n• 交通：€3–5（月票€55，骑行基础设施完善）\n• 合计：约€63–113/天',
      visaDetail: '比利时尚无数字游民签证。自雇居留申请需通过市政厅注册，提供商业计划与财务证明。欧元区成员国身份为商业运营提供完整的欧盟框架支持。',
      society: '安特卫普英语普及率极高，荷兰语为官方语言但日常英语交流无障碍。时尚与创意社群国际化，外籍设计师与IT从业者是主要移居群体。',
    },
    chance: {
      paragraph: '时尚科技与奢侈品数字化是安特卫普特色赛道；港口物流科技（LogTech）需求持续旺盛；钻石行业区块链溯源是新兴创新机会。',
      policy: { label: 'Flanders Investment & Trade', url: 'https://www.flandersinvestmentandtrade.com/en', desc: '佛兰德斯官方投资贸易促进机构' },
      localJobs: [
        { name: 'VDAB', url: 'https://www.vdab.be/vindeenjob', desc: '佛兰德斯官方就业服务平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '安特卫普的创意社群聚集在旧城区与时尚区，Start it @KBC是比利时最大的创业孵化社区之一，外籍人士融入相对容易。',
      platforms: [
        { name: 'Meetup Antwerp', url: 'https://www.meetup.com/cities/be/antwerp/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Antwerp', url: 'https://www.eventbrite.com/d/belgium--antwerp/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Ghent: {
    name: 'Ghent', nameZh: '根特', country: 'Belgium', countryZh: '比利时', flag: '🇧🇪', match: 76,
    soul: {
      headline: '比利时最进步的城市，中世纪石桥上的素食革命。',
      sub: '文化 · 历史 · 可持续 · 学术',
      body: '根特是比利时保存最完好的中世纪城市之一，三座中世纪塔楼倒映在利斯河中。这里也是欧洲第一座推行"星期四蔬菜日"（Veggie Thursday）的城市，将进步主义融入了日常饮食。',
      personality: '根特人以开明、艺术气质与对传统的创新再诠释著称。根特大学带来持续的年轻活力，城市对可持续生活方式的执着已成为欧洲城市转型的样本，外来者在这里感受到的是真实的欢迎而非表演性的友善。',
      economy: '根特大学是城市经济核心，带动教育、研究与生物技术产业；钢铁与化工是传统工业支柱；创意经济与旅游业快速成长；可持续科技与食品科技正在成为新名片。',
      festivals: '根特节（Gentse Feesten，7月）是欧洲最大的免费城市音乐节，连续10天将整座城市变成露天舞台；根特灯光节（Lichtfestival，2年一届）是欧洲最美的城市光艺术节之一；圣尼古拉斯日（12月6日）是根特最传统的儿童节庆。',
      figures: '根特祭坛画《神秘羔羊》是扬·凡·艾克最重要的作品，是北欧文艺复兴的奠基之作；皇帝查理五世（卡洛斯一世）在根特出生，开创了哈布斯堡王朝的全球霸权；社会学家埃米尔·杜尔凯姆的思想在根特大学学术传统中深有影响。',
    },
    landing: {
      wifi: '80 Mbps', cost: '$$', visa: '申根90天免签，比利时无数字游民专属签证',
      visaDays: '90 days',
      visaDesc: '🛂 比利时无专属数字游民签证，申根90天免签。自雇居留申请需通过市政厅注册，审批约3-6个月。',
      welfare: '🏥 欧元区成员，比利时医疗体系完善，根特大学医院是顶级医疗资源。',
      safety: '比利时最安全的城市之一，犯罪率极低，旧城区全天候安全，女性独行安全感极高。',
      dailyCost: '每日预算参考：\n• 餐饮：€13–24（小馆午餐€9–14，晚餐€15–26）\n• 住宿：€40–72（市中心Airbnb单间，比安特卫普稍便宜）\n• 交通：€3–4（月票€48，骑行城市基础设施完善）\n• 合计：约€56–100/天',
      visaDetail: '根特生活成本略低于布鲁塞尔与安特卫普，大学城氛围带来丰富的英语交流环境。比利时自雇申请流程与全国一致，根特市政厅服务效率较高。',
      society: '大学城与多元文化氛围使根特成为比利时最容易融入的城市之一，英语在年轻人中普及率接近100%。可持续生活方式是社区共同价值观，骑行文化成熟。',
    },
    chance: {
      paragraph: '生物技术与食品科技依托根特大学生态系统持续活跃；可持续科技（GreenTech/CleanTech）是城市政策主导的成长赛道；创意内容与文化产业以节庆经济为支撑。',
      policy: { label: 'Flanders Investment & Trade', url: 'https://www.flandersinvestmentandtrade.com/en', desc: '佛兰德斯官方投资贸易促进机构' },
      localJobs: [
        { name: 'VDAB', url: 'https://www.vdab.be/vindeenjob', desc: '佛兰德斯官方就业服务平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '根特的创业社群以可持续与社会创新为主题，iMind与Ghent Bio-Energy Valley是最活跃的专业社区。',
      platforms: [
        { name: 'Meetup Ghent', url: 'https://www.meetup.com/cities/be/gent/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Ghent', url: 'https://www.eventbrite.com/d/belgium--ghent/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Oslo: {
    name: 'Oslo', nameZh: '奥斯陆', country: 'Norway', countryZh: '挪威', flag: '🇳🇴', match: 68,
    soul: {
      headline: '峡湾与石油财富，全球最可持续的城市之一。',
      sub: '文化 · 自然 · 设计 · 可持续',
      body: '奥斯陆坐落在奥斯陆峡湾顶端，城市与自然的边界几乎不存在。市中心的歌剧院屋顶可以直接走上去眺望海湾，森林就在地铁终点，这里的富裕以一种低调而有品质的方式展现。',
      personality: '挪威人以直率、平等主义与对户外生活的热爱著称，"Friluftsliv"（户外生活哲学）是民族精神的核心。奥斯陆人不炫耀财富，但对可持续生活的承诺是真实的。外籍社区以科技与能源行业从业者为主，融入需要主动出击。',
      economy: '石油与天然气是挪威经济命脉，但奥斯陆正在积极转型为可持续能源与绿色科技中心；航运、海洋科技与渔业是传统支柱；科技初创生态以清洁能源与海洋科技为特色；挪威主权财富基金是全球最大的主权基金。',
      festivals: '奥斯陆爵士音乐节（Oslo Jazz Festival，8月）是北欧最重要的爵士节之一；挪威国庆节（5月17日）是北欧最壮观的民族庆典，全城着传统民族服装游行；极地光夜（极光季，10-3月）让整个峡湾成为自然的展演舞台。',
      figures: '剧作家亨利克·易卜生在奥斯陆创作了《玩偶之家》，开创了现代戏剧的先河；画家爱德华·蒙克的《呐喊》是20世纪最广为人知的艺术作品之一；探险家罗尔德·阿蒙森是第一个到达南极点的人，象征着挪威对极限的追求。',
    },
    landing: {
      wifi: '100 Mbps', cost: '$$$', visa: '申根90天免签，挪威无数字游民专属签证',
      visaDays: '90 days',
      visaDesc: '🛂 挪威非欧盟但为申根区成员，90天免签。自雇居留申请需证明财务自足，审批约3-4个月。',
      welfare: '🏥 挪威全民医疗体系是全球最完善之一，外籍居民持证后享有与本地人相同的医疗保障。',
      safety: '全球最安全城市之一，犯罪率极低，公共秩序极好，女性独行安全感极高。',
      dailyCost: '每日预算参考：\n• 餐饮：$30–55（咖啡馆午餐$22–30，晚餐$35–60）\n• 住宿：$80–160（市中心Airbnb单间，北欧价格较高）\n• 交通：$5–8（地铁月票$100，骑行系统完善）\n• 合计：约$115–223/天',
      visaDetail: '挪威生活成本是北欧最高之列，但薪资水平与石油财富匹配。自雇居留需提供商业可行性证明，长期居留后享有北欧完整福利体系。挪威克朗（NOK）汇率波动值得关注。',
      society: '挪威工作文化以效率与平等著称，管理层级扁平，会议简洁高效。户外活动（滑雪、徒步）是社交核心，每个周末都是进山出发的理由。英语普及率接近100%。',
    },
    chance: {
      paragraph: '清洁能源与海洋科技是奥斯陆最具潜力的赛道；挪威石油基金的投资触角覆盖全球，金融分析与ESG咨询需求旺盛；可持续科技创业享有充足的政府支持。',
      policy: { label: 'Innovation Norway', url: 'https://www.innovasjonnorge.no/en/start-page/', desc: '挪威官方创新与投资促进机构' },
      localJobs: [
        { name: 'FINN Jobb', url: 'https://www.finn.no/job/browse.html', desc: '挪威最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '奥斯陆的外籍人士社群以能源与科技行业从业者为主，StartupLab是北欧最活跃的创业孵化器之一。',
      platforms: [
        { name: 'Meetup Oslo', url: 'https://www.meetup.com/cities/no/oslo/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Oslo', url: 'https://www.eventbrite.com/d/norway--oslo/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Reykjavik: {
    name: 'Reykjavik', nameZh: '雷克雅未克', country: 'Iceland', countryZh: '冰岛', flag: '🇮🇸', match: 66,
    soul: {
      headline: '极光与火山之间，全球最平和的极小国都市。',
      sub: '文化 · 自然 · 创意 · 极地',
      body: '雷克雅未克是全球最北的国家首都，10万人口的城市却拥有世界级的音乐场景、极光奇观与地热能源。这里几乎没有犯罪、没有贫困，人们在午夜阳光下喝啤酒，讨论精灵与诗歌。',
      personality: '冰岛人以平等、创意与对自然的敬畏著称，没有"太怪"这个概念——在一个相信精灵存在的国家，什么都是可能的。雷克雅未克的文化场景以远超城市规模的密度与创造力震动世界，Björk就是最好的证明。',
      economy: '渔业是传统经济命脉；旅游业在2010年代火山爆发后爆炸式成长；地热能源是独特的绿色经济优势；创意产业（音乐、电影、游戏）的输出与城市规模极不相称。',
      festivals: '雷克雅未克艺术节（Reykjavík Arts Festival，5-6月）覆盖所有艺术形式；Secret Solstice音乐节（6月）在午夜阳光下进行，全球最独特的音乐节体验；Iceland Airwaves（10-11月）是发掘北欧独立音乐的最佳窗口。',
      figures: '歌手Björk将冰岛的奇异美学带向了全球流行音乐；萨迦文学（Sagas）是中世纪北欧最重要的文学遗产，雷克雅未克是其精神家园；棋手鲍比·菲舍尔以冰岛为庇护所，在此度过了人生的最后岁月。',
    },
    landing: {
      wifi: '100 Mbps', cost: '$$$', visa: '申根90天免签，冰岛有长期远程工作签证',
      visaDays: '180 days',
      visaDesc: '🛂 冰岛推出远程工作长居签证，允许停留6个月，月收入要求约$7,000，审批约30天，可续签。',
      welfare: '🏥 冰岛全民医疗体系覆盖完整，外籍居民持证后可享受公共医疗，温泉水疗（Blue Lagoon等）也是医疗传统的一部分。',
      safety: '全球犯罪率最低的国家，几乎没有暴力犯罪，是全球和平指数连续多年第一的国家。女性独行安全感全球最高。',
      dailyCost: '每日预算参考：\n• 餐饮：$30–55（咖啡馆午餐$22–32，晚餐$35–65）\n• 住宿：$85–170（市中心Airbnb单间，冰岛价格极高）\n• 交通：$5–10（无地铁，公交月票$75，租车更便利）\n• 合计：约$120–235/天',
      visaDetail: '冰岛长期远程工作签证（Long-Term Visa）：有效期6个月，月收入要求约$7,000，需提供雇主证明或自雇收入证明。冰岛不在欧盟但为申根区成员，签证持有期间可自由出入申根区。',
      society: '全球最平等的社会之一，性别平等与LGBTQ+权利全球领先。生活成本极高但与独特的自然体验（极光、火山、温泉）交换。城市规模小，社区紧密，外籍人士融入速度快。',
    },
    chance: {
      paragraph: '地热能源与可持续科技是冰岛独特优势赛道；旅游科技与户外探险体验数字化需求旺盛；创意产业以超小规模创造超大影响力，内容创作者在这里找到罕见的灵感密度。',
      policy: { label: 'Invest in Iceland', url: 'https://www.invest.is/invest-in-iceland/', desc: '冰岛官方外商投资促进机构' },
      localJobs: [
        { name: 'Alfreð Jobs', url: 'https://www.alfred.is', desc: '冰岛最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '雷克雅未克的外籍人士社群规模不大但凝聚力极强，Startup Iceland每年聚集北大西洋最重要的创业者与投资人。',
      platforms: [
        { name: 'Meetup Reykjavik', url: 'https://www.meetup.com/cities/is/reykjavik/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Reykjavik', url: 'https://www.eventbrite.com/d/iceland--reykjavik/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Geneva: {
    name: 'Geneva', nameZh: '日内瓦', country: 'Switzerland', countryZh: '瑞士', flag: '🇨🇭', match: 63,
    soul: {
      headline: '全球外交中枢，红十字与联合国的精神故乡。',
      sub: '文化 · 外交 · 奢侈品 · 自然',
      body: '日内瓦是全球外交密度最高的城市——联合国欧洲总部、世卫组织、红十字会均在此驻扎。勃朗峰在晴天的远景中清晰可见，莱蒙湖的喷泉是城市天际线最优雅的点睛之笔。',
      personality: '日内瓦以多元文化、中立外交与对精度的执着著称，是瑞士最具国际化色彩的城市。外籍人士占总人口约40%，英语几乎与法语同等通行，但融入本地圈子需要时间与耐心。',
      economy: '国际组织经济（联合国相关机构超200个）是全球独一无二的产业；金融与私人银行是传统支柱；奢侈手表（劳力士、江诗丹顿）是瑞士工业的明珠；生物制药（罗氏子公司）是高端制造业核心。',
      festivals: '日内瓦汽车展（Geneva International Motor Show，3月）是全球最重要的汽车展之一；时尚节（Fête de la Escalade，12月）纪念1602年的保卫战，巧克力浇头传统令人难忘；跨年烟火在莱蒙湖上燃放，是欧洲最精致的跨年景观之一。',
      figures: '让-雅克·卢梭在日内瓦出生，其社会契约论奠定了现代民主思想基础；物理学家尼尔斯·玻尔与爱因斯坦在日内瓦进行了影响量子力学的重要辩论；人道主义先驱亨利·杜南在日内瓦创立了红十字会。',
    },
    landing: {
      wifi: '100 Mbps', cost: '$$$', visa: '申根90天免签，可申请瑞士自雇居留',
      visaDays: '90 days',
      visaDesc: '🛂 瑞士非欧盟成员，申根规则适用。自雇居留申请需证明财务自足与商业可行性，审批约3-6个月。',
      welfare: '🏥 瑞士医疗体系全球顶尖，强制购买基本医疗保险（约CHF450-650/月），日内瓦医疗费用高于苏黎世。',
      safety: '全球最安全城市之一，犯罪率极低，外交区与湖滨全天候安全，女性独行安全感极高。',
      dailyCost: '每日预算参考：\n• 餐饮：$38–65（联合国区午餐$28–38，晚餐餐厅$45–75）\n• 住宿：$130–220（市中心Airbnb单间，欧洲最贵之一）\n• 交通：$5–8（月票CHF90，骑行与步行覆盖湖滨区域）\n• 合计：约$173–293/天',
      visaDetail: '日内瓦是全球生活成本最高的城市之一，但国际组织薪资与金融业待遇与此匹配。自雇申请通过后可居留1年，可续签。长期居留享有顶级公共服务与极高的社会安全感。',
      society: '多元文化是日内瓦最大的社会特征，40%的人口持外国护照，英语、法语与多种语言并行。国际组织生态带来大量跨文化专业社群，融入专业圈子相对容易。',
    },
    chance: {
      paragraph: '国际组织咨询与NGO支持是日内瓦独特机会；金融科技与私人银行数字化需求旺盛；生命科学与医疗健康创新以WHO/罗氏生态为依托。',
      policy: { label: 'Switzerland Global Enterprise (S-GE)', url: 'https://www.s-ge.com/en', desc: '瑞士官方贸易与投资促进机构' },
      localJobs: [
        { name: 'Jobs.ch', url: 'https://www.jobs.ch', desc: '瑞士最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '日内瓦的专业社群以国际组织与金融从业者为主，Impact Hub日内瓦是社会创新领域的核心聚集地，外籍人士英语社群规模庞大。',
      platforms: [
        { name: 'Meetup Geneva', url: 'https://www.meetup.com/cities/ch/geneva/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Geneva', url: 'https://www.eventbrite.com/d/switzerland--geneva/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Basel: {
    name: 'Basel', nameZh: '巴塞尔', country: 'Switzerland', countryZh: '瑞士', flag: '🇨🇭', match: 67,
    soul: {
      headline: '全球最重要的当代艺术展之城，三国交界的制药重镇。',
      sub: '文化 · 艺术 · 制药 · 边境',
      body: '巴塞尔是瑞士、德国、法国三国边界的交汇点，走出中央火车站就能踏上三个国家的土地。Art Basel每年将全球最重要的画廊与藏家聚集于此，让这座30万人的城市成为当代艺术世界的临时首都。',
      personality: '巴塞尔人以严谨、艺术品位与对实用功能的极致追求著称，同时带着三国文化融合的开放心态。制药工业的务实与Art Basel的前卫在此奇妙共存，形成一种独特的"科学遇见艺术"城市气质。',
      economy: '制药与化工（诺华、罗氏总部）是全球顶尖的产业集群；Art Basel带动文化经济；金融服务与私人银行是传统支柱；三国边境地位带来独特的跨境商业机会。',
      festivals: 'Art Basel（6月）是全球最重要的当代艺术博览会，每年吸引9万名艺术界人士；巴塞尔狂欢节（Basler Fasnacht，2-3月）是瑞士最大、欧洲最著名的狂欢节之一；Baloise Session音乐节（10月）是瑞士最重要的室内爵士与流行音乐节。',
      figures: '哲学家弗里德里希·尼采在巴塞尔大学任古典语言学教授，在此完成了早期最重要的著作；建筑师赫尔佐格与德梅隆（Herzog & de Meuron）以巴塞尔为基地改变了全球建筑话语；化学家保罗·穆勒在巴塞尔发现了DDT的杀虫特性，获诺贝尔医学奖。',
    },
    landing: {
      wifi: '100 Mbps', cost: '$$$', visa: '申根90天免签，可申请瑞士自雇居留',
      visaDays: '90 days',
      visaDesc: '🛂 瑞士非欧盟成员，申根规则适用。巴塞尔三国边境地位使居住灵活性高，许多人在德国或法国居住、在瑞士工作。',
      welfare: '🏥 瑞士医疗体系顶尖，强制购买基本医疗保险（约CHF380-550/月）。巴塞尔大学医院是欧洲顶级医疗机构之一。',
      safety: '瑞士最安全的城市之一，犯罪率极低，三国边境城市公共秩序极好，女性独行安全感极高。',
      dailyCost: '每日预算参考：\n• 餐饮：$32–58（咖啡馆午餐$24–32，晚餐$38–65）\n• 住宿：$100–190（市中心Airbnb单间，Art Basel期间价格暴涨）\n• 交通：$5–8（月票CHF125，步行可达三国边境）\n• 合计：约$137–256/天',
      visaDetail: '巴塞尔的独特优势在于三国边境：可在成本较低的德国弗赖堡或法国米卢斯居住，同时在瑞士工作。瑞士自雇居留申请标准全国统一，审批约3-6个月。',
      society: '多语言环境（德语、法语均通行，英语普及率高），制药与艺术两个行业塑造了城市特有的精英与创意氛围。Art Basel期间整座城市的能量密度超乎想象。',
    },
    chance: {
      paragraph: '制药与生命科学是巴塞尔最高密度的产业机会；Art Basel生态带动艺术科技（ArtTech）与文化内容需求；三国边境的跨境贸易与咨询服务持续活跃。',
      policy: { label: 'Switzerland Global Enterprise (S-GE)', url: 'https://www.s-ge.com/en', desc: '瑞士官方贸易与投资促进机构' },
      localJobs: [
        { name: 'Jobs.ch', url: 'https://www.jobs.ch', desc: '瑞士最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '巴塞尔的外籍人士社群以制药、金融与艺术从业者为主，BaselArea Business & Innovation是本地最活跃的创业支持机构。',
      platforms: [
        { name: 'Meetup Basel', url: 'https://www.meetup.com/cities/ch/basel/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Basel', url: 'https://www.eventbrite.com/d/switzerland--basel/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Toulouse: {
    name: 'Toulouse', nameZh: '图卢兹', country: 'France', countryZh: '法国', flag: '🇫🇷', match: 82,
    soul: {
      headline: '粉红城市，空客的故乡，法国第四大城市的低调野心。',
      sub: '文化 · 航空 · 教育 · 美食',
      body: '图卢兹的砖红色建筑在南法阳光下散发着温暖的玫瑰色，因此得名"粉红城市"。这里是全球最大商用飞机制造商空客的诞生地，也是加龙河畔最有活力的法国学生城市。',
      personality: '图卢兹人兼具奥克西坦文化的热情与工程师精神的严谨，融合得出人意料的和谐。学生占总人口约20%，让城市保持了持续的年轻活力与创意密度，南法的悠闲生活节奏与航空航天的精确文化构成奇妙张力。',
      economy: '航空航天是全球顶尖产业集群（空客、泰雷兹、萨基姆），带动完整的供应链生态；信息技术与卫星技术（法国国家空间研究中心CNES）是第二支柱；医疗健康与生物技术依托顶尖大学持续成长。',
      festivals: '图卢兹探戈节（Festival Rio Loco，6月）是法国最大的世界音乐节之一；Toulouse Game Show（11月）是法国最大的电子游戏文化节；橄榄球赛季（TOP14联赛，9-5月）让斯塔德德法兰西球迷文化成为城市日历的核心。',
      figures: '作家安托万·德·圣-埃克苏佩里是图卢兹的飞行员诗人，《小王子》的原型部分来自他在此飞越比利牛斯山的经历；音乐家克劳德·努加罗是图卢兹的民谣大使；数学家皮埃尔·德·费马在图卢兹完成了影响数学史三个世纪的"费马大定理"。',
    },
    landing: {
      wifi: '68 Mbps', cost: '$$', visa: '申根90天免签，可申请法国Talent Passport',
      visaDays: '365 days',
      visaDesc: '🛂 法国Talent Passport适合自雇与创业者，4年期，月收入要求约€2,700。图卢兹生活成本在法国大城市中属中等偏低。',
      welfare: '🏥 法国公共医疗体系完善，图卢兹大学医院是南法最重要的医疗中心，持居留证可参与CPAM。',
      safety: '整体安全，旧城区与大学区治安良好，部分郊区夜间需注意。女性独行白天安全感高。',
      dailyCost: '每日预算参考：\n• 餐饮：€12–23（大学区小馆午餐€9–14，晚餐€15–25）\n• 住宿：€36–68（市中心Airbnb单间，比里昂略便宜）\n• 交通：€3–5（地铁月票€60，骑行系统完善）\n• 合计：约€51–96/天',
      visaDetail: '法国Talent Passport全国统一标准，图卢兹申请流程顺畅。生活成本约为巴黎的65-70%，航空航天产业集群带来稳定的B2B商业机会。',
      society: '大学城与工程师文化融合，英语在航空航天与科技行业普及率高。图卢兹橄榄球文化是融入本地社区的快捷通道，户外活动以比利牛斯山为背景极为丰富。',
    },
    chance: {
      paragraph: '航空航天供应链数字化是最具规模的B2B机会；卫星科技与地球观测数据分析（CNES生态）是高端赛道；游戏开发与创意科技依托年轻学生城市生态成长。',
      policy: { label: 'Business France', url: 'https://www.businessfrance.fr/en', desc: '法国官方贸易与投资促进机构' },
      localJobs: [
        { name: 'Pôle Emploi', url: 'https://www.pole-emploi.fr', desc: '法国国家就业局，覆盖全国各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '图卢兹的创业社群依托Aerospace Valley聚集，EPITECH与INSA等工程院校校友网络是最活跃的技术社区来源。',
      platforms: [
        { name: 'Meetup Toulouse', url: 'https://www.meetup.com/cities/fr/toulouse/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Toulouse', url: 'https://www.eventbrite.com/d/france--toulouse/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Marseille: {
    name: 'Marseille', nameZh: '马赛', country: 'France', countryZh: '法国', flag: '🇫🇷', match: 74,
    soul: {
      headline: '法国最古老的城市，地中海最真实的港口灵魂。',
      sub: '文化 · 港口 · 美食 · 多元',
      body: '马赛是法国最古老的城市，希腊人在2600年前建立了这个港口。今天的马赛是法国最多元的城市——北非、亚美尼亚、意大利、西班牙的文化在这里层叠交织，形成了任何其他法国城市都复制不了的独特气质。',
      personality: '马赛人以直率、骄傲与对城市的强烈认同著称，他们对外界的刻板印象毫不在意，坚持着自己的节奏。沸鱼汤（Bouillabaisse）是一种宗教，旧港是客厅，地中海是后院。欧洲文化之都的经历让马赛的创意能量开始被更多人发现。',
      economy: '港口是欧洲第三大，带动物流与石化；旅游业随2013年欧洲文化之都后快速成长；数字经济与创意产业在政策推动下进入快车道；电影与影视制作依托地中海背景持续活跃。',
      festivals: '马赛-普罗旺斯欧洲文化之都遗产系列活动延续至今；Marseille Jazz des cinq Continents（7月）是全球顶级的世界爵士节；马赛圣诞节（Foire aux Santons，11-1月）是以手工陶偶著称的传统节庆。',
      figures: '亚历山大·仲马（大仲马）以马赛为背景写下《基督山伯爵》，将这座城市的地中海传奇带向全世界；建筑师勒·柯布西耶的"马赛公寓"（Unité d\'Habitation）是现代主义建筑史上的里程碑；说唱音乐人IAM将马赛的多元文化带入了法语流行音乐的核心。',
    },
    landing: {
      wifi: '65 Mbps', cost: '$$', visa: '申根90天免签，可申请法国Talent Passport',
      visaDays: '365 days',
      visaDesc: '🛂 法国Talent Passport适合自雇与创业者，4年期，月收入要求约€2,700。马赛生活成本在法国大城市中偏低。',
      welfare: '🏥 法国公共医疗覆盖全国，马赛La Timone大学医院是南法最重要的医疗机构，持居留证可参与CPAM。',
      safety: '治安是马赛最需关注的问题，部分郊区（北部）不适合初来者独自涉足；旧港与城市中心白天安全，夜间旅游区有序。女性独行旅游区白天安全感一般，夜间建议结伴。',
      dailyCost: '每日预算参考：\n• 餐饮：€12–22（港口餐厅午餐€10–16，晚餐€15–25）\n• 住宿：€32–62（市中心Airbnb单间，法国大城市最低价之列）\n• 交通：€3–5（地铁月票$55，海滨骑行系统完善）\n• 合计：约€47–89/天',
      visaDetail: '马赛生活成本约为巴黎的60-65%，是法国最具性价比的大城市之一，但需要对城市多元复杂的现实有所准备。法国Talent Passport全国统一标准。',
      society: '多元文化是马赛最大的社会特征，北非、亚美尼亚、意大利移民后代共同构成了城市的文化基因。地中海生活方式、足球（奥林匹克马赛）与沸鱼汤是社区融入的三大媒介。',
    },
    chance: {
      paragraph: '港口科技（PortTech）与物流数字化是本地最大机会；影视制作依托地中海背景与城市多元文化持续活跃；旅游科技与文化产业数字化在2013年欧洲文化之都遗产下稳步成长。',
      policy: { label: 'Business France', url: 'https://www.businessfrance.fr/en', desc: '法国官方贸易与投资促进机构' },
      localJobs: [
        { name: 'Pôle Emploi', url: 'https://www.pole-emploi.fr', desc: '法国国家就业局，覆盖全国各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '马赛的数字游民社群以内容创作者、远程设计师与港口行业从业者为主，La Friche la Belle de Mai创意园区是最活跃的聚集地。',
      platforms: [
        { name: 'Meetup Marseille', url: 'https://www.meetup.com/cities/fr/marseille/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Marseille', url: 'https://www.eventbrite.com/d/france--marseille/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Manchester: {
    name: 'Manchester', nameZh: '曼彻斯特', country: 'United Kingdom', countryZh: '英国', flag: '🇬🇧', match: 81,
    soul: {
      headline: '工业革命的摇篮，英国最有活力的北部科技城市。',
      sub: '文化 · 音乐 · 科技 · 足球',
      body: '曼彻斯特是英国最酷的城市之一，工业革命的遗产在砖红色厂房与运河沿岸的共享办公空间中延续。奥尔德姆街的音乐场景、北方科技廊的科技能量，以及两支足球队在同一座城市的传奇，构成了这里独特的城市精神。',
      personality: '曼彻斯特人以幽默、直率与强烈的城市认同著称，他们对自己城市的热爱不需要伦敦的背书。Madchester音乐文化、工业遗产与科技转型在这里和平共存，形成了英国南北关系中独特而有力的北方声音。',
      economy: '数字科技与媒体是现代经济支柱（MediaCityUK聚集BBC、ITV等媒体机构）；生命科学与制造业是传统优势；金融科技（FinTech North）快速崛起；足球经济带动旅游与体育科技。',
      festivals: '曼彻斯特国际节（Manchester International Festival，7月，双年举行）是全球首个专为原创艺术作品设计的节日；Manchester Day（6月）是城市最大的街头庆典；奥尔德姆街音乐节（Neighbourhood Weekender，5月）聚焦独立音乐。',
      figures: '乐队绿洲（Oasis）和The Smiths在曼彻斯特的砖墙里写出了英国流行音乐的一个时代；计算机先驱艾伦·图灵在曼彻斯特大学完成了现代计算机科学的奠基性工作；工业革命纺纱机发明家詹姆斯·哈格里夫斯改变了曼彻斯特，也改变了世界。',
    },
    landing: {
      wifi: '80 Mbps', cost: '$$', visa: '英国免签6个月（因国籍而异），可申请UK Global Talent Visa',
      visaDays: '180 days',
      visaDesc: '🛂 英国脱欧后，欧盟护照需申请ETA。Global Talent Visa适合科技与创意领域精英，需获认可机构背书，有效期5年。',
      welfare: '🏥 NHS国民健康服务免费覆盖，持有效签证可享受与本地人相同的医疗待遇。',
      safety: '整体安全，城市中心与学生区治安良好。部分郊区夜间需注意，旅游区与商业中心安全感高，女性独行白天安全感较高。',
      dailyCost: '每日预算参考：\n• 餐饮：$14–26（Northern Quarter午餐$10–16，晚餐$16–28）\n• 住宿：$50–90（市中心Airbnb单间，比伦敦便宜约40%）\n• 交通：$3–6（月票$80，有轨电车网络覆盖广泛）\n• 合计：约$67–122/天',
      visaDetail: '曼彻斯特生活成本约为伦敦的60-65%，但创业生态与就业机会密度接近伦敦水平。UK Global Talent Visa有Tech Nation、Arts Council England等多个背书机构，申请通道成熟。',
      society: '英语环境使融入极为便利，曼彻斯特大学与曼彻斯特城市大学带来庞大国际学生社群。城市节奏比伦敦舒适，生活质量与工作机会的平衡在英国城市中首屈一指。',
    },
    chance: {
      paragraph: '媒体科技与内容创作依托MediaCityUK生态持续活跃；FinTech North带动金融科技快速成长；生命科学园区Manchester Science Park聚集大量研发机会。',
      policy: { label: 'MIDAS Manchester Investment & Development Agency', url: 'https://www.investinmanchester.com', desc: '曼彻斯特官方投资与开发促进机构' },
      localJobs: [
        { name: 'Manchester Digital Jobs', url: 'https://www.manchesterdigital.com/jobs', desc: '曼彻斯特数字产业协会旗下招聘平台' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '曼彻斯特的外籍人士社群以科技与媒体从业者为主，Manchester Tech Trust等机构定期举办活动，Northern Quarter是创意社群聚集的核心街区。',
      platforms: [
        { name: 'Meetup Manchester', url: 'https://www.meetup.com/cities/gb/manchester/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Manchester', url: 'https://www.eventbrite.com/d/united-kingdom--manchester/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Bristol: {
    name: 'Bristol', nameZh: '布里斯托尔', country: 'United Kingdom', countryZh: '英国', flag: '🇬🇧', match: 80,
    soul: {
      headline: 'Banksy的故乡，英国最具创意与可持续精神的城市。',
      sub: '文化 · 艺术 · 可持续 · 科技',
      body: '布里斯托尔的街道是世界上密度最高的街头艺术博物馆，Banksy在这里的涂鸦是无需门票的展览。这座城市以独立精神著称，在"脱离伦敦轨道"的英国城市中，布里斯托尔是最彻底也最自信的一个。',
      personality: '布里斯托尔人以独立、创意与对可持续生活的真实践行著称，不是表演性的环保而是骨子里的价值观。这里的亚文化场景（Drum & Bass发源地）与科技创业生态以出人意料的密度共存于一座35万人口的城市中。',
      economy: '航空航天（罗尔斯·罗伊斯、空客英国）是传统工业优势；科技初创生态以深科技与绿色科技为特色快速成长；创意媒体（Aardman动画工作室在此）与文化产业是软实力核心；港口服务与金融是补充支柱。',
      festivals: '布里斯托尔国际气球节（Bristol International Balloon Fiesta，8月）是欧洲最大的热气球节；Encounters国际短片节（11月）是欧洲顶级的短片电影节；St Pauls Carnival（7月）是英国规模最大的加勒比文化节庆。',
      figures: 'Banksy在布里斯托尔街头开始了他的涂鸦生涯，改变了全球对街头艺术的认知；Aardman动画创始人彼得·罗德创造了憨豆先生的好友——小羊肖恩；探险家约翰·卡伯特从布里斯托尔港出发，发现了北美大陆。',
    },
    landing: {
      wifi: '75 Mbps', cost: '$$', visa: '英国免签6个月（因国籍而异），可申请UK Global Talent Visa',
      visaDays: '180 days',
      visaDesc: '🛂 英国脱欧后，欧盟护照需申请ETA。Global Talent Visa适合科技与创意领域精英，5年期，审批约3-8周。',
      welfare: '🏥 NHS国民健康服务免费覆盖全英国，布里斯托尔皇家医院是西英格兰的顶级医疗机构。',
      safety: '整体安全，城市中心与Clifton区治安良好。部分郊区夜间需注意，旅游区安全感高，女性独行白天安全感较高。',
      dailyCost: '每日预算参考：\n• 餐饮：$14–26（独立餐厅午餐$10–16，晚餐$16–28）\n• 住宿：$48–88（市中心Airbnb单间，比伦敦便宜约35-40%）\n• 交通：$3–6（月票$75，骑行基础设施完善）\n• 合计：约$65–120/天',
      visaDetail: '布里斯托尔生活成本约为伦敦的60-65%，深科技与可持续科技的创业生态密度高于城市规模预期。UK Global Talent Visa申请渠道成熟，Watershed等机构可提供创意行业背书。',
      society: '布里斯托尔大学带来大量国际学生，英语环境使融入极为便利。可持续生活是真实的社区价值观，素食餐厅密度全英最高，骑行基础设施持续改善。',
    },
    chance: {
      paragraph: '深科技（航空航天、量子计算）是布里斯托尔独特的B2B赛道；Aardman生态带动创意内容与动画科技机会；绿色科技与可持续建筑是城市政策主导的成长方向。',
      policy: { label: 'Invest Bristol & Bath', url: 'https://www.investbristolbath.com', desc: '布里斯托尔与巴斯地区官方投资促进机构' },
      localJobs: [
        { name: 'TechSpark Jobs', url: 'https://techspark.co/jobs/', desc: '布里斯托尔科技社区旗下招聘平台' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '布里斯托尔的数字游民与创意社群聚集在Stokes Croft与Clifton区，Watershed创意科技中心是最活跃的社区聚集地。',
      platforms: [
        { name: 'Meetup Bristol', url: 'https://www.meetup.com/cities/gb/bristol/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Bristol', url: 'https://www.eventbrite.com/d/united-kingdom--bristol/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Turin: {
    name: 'Turin', nameZh: '都灵', country: 'Italy', countryZh: '意大利', flag: '🇮🇹', match: 82,
    soul: {
      headline: '巧克力、菲亚特与裹尸布，意大利最被低估的城市。',
      sub: '文化 · 工业 · 美食 · 历史',
      body: '都灵是意大利统一运动的诞生地，皮埃蒙特的宽阔林荫大道与宏伟宫殿群证明了它曾经的王国首都地位。但今天更多游民发现，这里拥有欧洲最好的咖啡馆文化、比米兰低30%的生活成本，以及意大利工业精神最纯粹的体现。',
      personality: '都灵人以低调务实、内敛骄傲著称，他们不大声喧哗，但巧克力（gianduja）与苦艾酒（Vermouth）的传统会告诉你这座城市的深度。工业文化与皇家遗产共同塑造了一种"优雅的严肃"，外来者被接受，但需要尊重当地节奏。',
      economy: '汽车工业（菲亚特/Stellantis）是传统命脉，正在经历向电动车与自动驾驶的转型；航空航天（莱昂纳多）与国防工业是第二支柱；IT初创与人工智能研究正在以都灵理工大学为中心快速崛起。',
      festivals: '国际书展（Salone Internazionale del Libro，5月）是欧洲最重要的书展之一；CinemAmbiente环境电影节（6月）聚焦环境与可持续话题；都灵国际电影节（11月）是意大利最具先锋精神的电影节。',
      figures: '尼采在都灵完成了人生最后的清醒写作，宣称这是他最喜爱的城市；导演米开朗基罗·安东尼奥尼的镜头语言深受都灵工业景观影响；设计师埃托雷·索特萨斯以都灵为基地创立了Memphis设计运动，改变了20世纪设计史。',
    },
    landing: {
      wifi: '70 Mbps', cost: '$$', visa: '申根90天免签，可申请意大利数字游民签证',
      visaDays: '365 days',
      visaDesc: '🛂 意大利数字游民签证月收入要求约€2,700，都灵生活成本比米兰低约30%，是意大利北部最具性价比的目的地。',
      welfare: '🏥 意大利NHS（SSN）全国覆盖，都灵大学医院（Molinette）是意大利顶级医疗机构之一，持居留证可参与公共医疗。',
      safety: '整体安全，是意大利北部最安全的大城市之一。市中心与宫殿区全天候安全，部分郊区夜间需注意，女性独行安全感较高。',
      dailyCost: '每日预算参考：\n• 餐饮：€12–22（传统小馆午餐€8–14，晚餐€14–24）\n• 住宿：€35–65（市中心Airbnb单间，比米兰便宜约30%）\n• 交通：€2–4（地铁月票€37，步行可达大部分历史景点）\n• 合计：约€49–91/天',
      visaDetail: '都灵是意大利游民最具性价比的选择之一，位于米兰和法国边境之间，可方便往来两国。意大利数字游民签证全国统一标准，都灵领事馆服务效率较高。',
      society: '皮埃蒙特文化以务实著称，都灵人对时间和约定保持着北意大利的严谨。工业转型期的城市氛围带来了创业机会，共享办公空间快速增长，年轻从业者开始重新发现这座被忽视的城市。',
    },
    chance: {
      paragraph: '汽车工业数字化（EV/自动驾驶）是都灵最大的转型机会；人工智能研究以都灵理工大学为中心快速崛起；航空航天供应链数字化持续旺盛。',
      policy: { label: 'Invest in Turin and Piedmont', url: 'https://www.investinturinpiedmont.com/en/', desc: '都灵与皮埃蒙特大区官方投资促进机构' },
      localJobs: [
        { name: 'Infojob.it', url: 'https://www.infojobs.it', desc: '意大利最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '都灵的数字游民社群正在快速成长，Toolbox Coworking是意大利历史最悠久的联合办公空间之一，汽车与AI主题社群活跃。',
      platforms: [
        { name: 'Meetup Turin', url: 'https://www.meetup.com/cities/it/turin/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Turin', url: 'https://www.eventbrite.com/d/italy--turin/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Warsaw: {
    name: 'Warsaw', nameZh: '华沙', country: 'Poland', countryZh: '波兰', flag: '🇵🇱', match: 86,
    soul: {
      headline: '从废墟重建的欧洲之鸟，中东欧最重要的科技枢纽。',
      sub: '文化 · 历史 · 科技 · 韧性',
      body: '华沙是人类历史上最彻底的重建故事：二战中90%的城市被夷为平地，华沙人在废墟中按旧照片和记忆砖瓦重建了整座城市。今天的华沙是中东欧最重要的科技枢纽，其韧性已成为创业精神最好的隐喻。',
      personality: '华沙人以直率、幽默（黑色幽默尤其精湛）与强烈的民族自豪著称，对困难有超乎寻常的化解能力。年轻的波兰IT一代英语流利，创业热情旺盛，正在把这座城市打造成欧洲的下一个科技中心。',
      economy: 'IT外包与软件开发是经济引擎（CD PROJEKT RED、Allegro等公司的总部），波兰IT工程师在欧洲享有最高声誉之一；金融服务与银行共享服务中心聚集大量外资；游戏开发是最具国际影响力的产业名片。',
      festivals: '华沙音乐节（Warsaw Music Week，9月）是波兰最重要的当代音乐节；科学节（Festiwal Nauki，9月）是欧洲规模最大的公众科学节之一；华沙国际电影节（10月）是中欧最重要的电影盛事之一。',
      figures: '钢琴家弗雷德里克·肖邦在华沙出生，以波洛涅兹舞曲永久定义了波兰的民族音乐灵魂；物理学家玛丽·居里（居里夫人）在华沙出生，是人类历史上唯一获得两个不同科学领域诺贝尔奖的人；作家波莱斯瓦夫·普鲁斯在《玩偶》中留下了19世纪华沙最完整的城市肖像。',
    },
    landing: {
      wifi: '75 Mbps', cost: '$', visa: '申根90天免签',
      visaDays: '90 days',
      visaDesc: '🛂 申根区90天免签，波兰尚无数字游民专属签证。长期居留可通过公司注册或受雇途径申请居留许可，审批约2-4个月。',
      welfare: '🏥 欧盟成员国，持有效居留可参与波兰社保体系；华沙私立医疗价格低廉，服务质量持续提升。',
      safety: '整体安全，欧洲犯罪率最低的首都之一。旧城区与商业中心全天候安全，女性独行安全感高。',
      dailyCost: '每日预算参考：\n• 餐饮：$9–18（波兰传统餐厅午餐$5–9，晚餐$10–18）\n• 住宿：$22–50（市中心Airbnb单间，欧盟首都最低价之列）\n• 交通：$2–3（地铁月票$28，公共交通网络覆盖完整）\n• 合计：约$33–71/天',
      visaDetail: '波兰尚未推出数字游民专属签证，但通过成立波兰公司（sp. z o.o.）申请居留许可是成熟路径，审批约2-4个月，公司注册成本约€1,000-1,500。波兰正讨论推出游民签证项目。',
      society: '华沙年轻一代英语普及率高，城市国际化程度远超波兰其他城市。生活成本是欧盟首都中最低之列，互联网速度快，科技人才密度高，是欧洲最具性价比的大城市之一。',
    },
    chance: {
      paragraph: 'IT外包与软件开发是华沙最成熟的机会，波兰工程师人才储备丰富；游戏开发以CDPR为代表形成完整生态；金融科技与电商（Allegro效应）快速成长。',
      policy: { label: 'Polish Investment and Trade Agency (PAIH)', url: 'https://www.paih.gov.pl/en', desc: '波兰官方投资与贸易促进机构' },
      localJobs: [
        { name: 'Pracuj.pl', url: 'https://www.pracuj.pl', desc: '波兰最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '华沙的科技社群以IT从业者为核心，Campus Warsaw（Google孵化器）与众多联合办公空间是创业者的聚集地，外籍人士社区快速扩大。',
      platforms: [
        { name: 'Meetup Warsaw', url: 'https://www.meetup.com/cities/pl/warsaw/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Warsaw', url: 'https://www.eventbrite.com/d/poland--warsaw/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Salzburg: {
    name: 'Salzburg', nameZh: '萨尔茨堡', country: 'Austria', countryZh: '奥地利', flag: '🇦🇹', match: 72,
    soul: {
      headline: '莫扎特的故乡，阿尔卑斯山下的巴洛克音乐圣地。',
      sub: '文化 · 音乐 · 建筑 · 自然',
      body: '萨尔茨堡是全球音乐朝圣者的目的地，莫扎特在这里出生并度过了早年岁月。盐河（Salzach）两岸的巴洛克建筑群是联合国教科文组织世界遗产，每年夏天的音乐节把全球最重要的古典音乐人汇聚于此。',
      personality: '萨尔茨堡人以对音乐的骄傲与对传统的珍视著称，这座城市的保守与其世界级的文化地位构成了奇妙的张力。游客比常住人口多得多，但本地人依然保持着奥地利特有的从容礼貌，阿尔卑斯山的存在让一切焦虑都显得多余。',
      economy: '旅游业是最大支柱，音乐节经济带动整个地区；制造业与科技初创在扎尔茨堡科技园快速成长；医疗健康产业依托大学医院持续活跃；奥地利整体营商环境稳定，欧元区成员国地位便利。',
      festivals: '萨尔茨堡音乐节（Salzburg Festival，7-8月）是全球最重要的古典音乐节，每年吸引25万音乐爱好者；莫扎特周（Mozartwoche，1月）在作曲家诞辰前后举行；萨尔茨堡圣诞市场（12月）是欧洲最古老最美丽的圣诞市场之一。',
      figures: '沃尔夫冈·阿马多伊斯·莫扎特是萨尔茨堡最骄傲的儿子，其故居是全球访问量最高的音乐家博物馆；指挥家赫伯特·冯·卡拉扬是萨尔茨堡音乐节的灵魂缔造者；电影《音乐之声》让全球观众记住了萨尔茨堡的山丘与湖泊。',
    },
    landing: {
      wifi: '75 Mbps', cost: '$$$', visa: '申根90天免签，奥地利无数字游民专属签证',
      visaDays: '90 days',
      visaDesc: '🛂 欧元区及申根区成员，90天免签。奥地利尚无数字游民专属签证，长期居留可申请自雇许可，审批约3-4个月。',
      welfare: '🏥 奥地利医疗体系欧洲顶尖，持有效居留可参与奥地利社保（ASVG），公立医院覆盖全面。',
      safety: '欧洲最安全的城市之一，犯罪率极低，全天候安全，女性独行安全感极高。',
      dailyCost: '每日预算参考：\n• 餐饮：€14–26（传统餐厅午餐€10–16，晚餐€16–28）\n• 住宿：€55–100（市中心Airbnb单间，音乐节期间价格暴涨）\n• 交通：€3–5（月票€65，骑行与步行可达大部分景点）\n• 合计：约€72–131/天',
      visaDetail: '奥地利自雇居留（Gewerbeschein）申请：需提供商业计划与财务证明，获批后可居留1年，可续签。萨尔茨堡生活成本略低于维也纳，城市规模小通勤效率高。',
      society: '音乐节旺季（7-8月）让萨尔茨堡人口翻倍，淡季城市安静而宜居。奥地利人普遍礼貌守时，英语在商业与旅游领域普及率高。阿尔卑斯山的户外活动（滑雪、徒步）是社区融入的最好媒介。',
    },
    chance: {
      paragraph: '旅游科技与文化遗产数字化是本地特色赛道；音乐教育科技以莫扎特音乐大学为依托成长；萨尔茨堡科技园聚集信息技术与高端制造企业，提供稳定的B2B机会。',
      policy: { label: 'Austrian Business Agency (ABA)', url: 'https://www.aba.gv.at/en/', desc: '奥地利官方外商投资促进机构' },
      localJobs: [
        { name: 'karriere.at', url: 'https://www.karriere.at', desc: '奥地利最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '萨尔茨堡的外籍人士社群规模不大但质量高，音乐节带来的国际人脉与科技园区从业者构成两个主要社群。',
      platforms: [
        { name: 'Meetup Salzburg', url: 'https://www.meetup.com/cities/at/salzburg/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Salzburg', url: 'https://www.eventbrite.com/d/austria--salzburg/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
  Innsbruck: {
    name: 'Innsbruck', nameZh: '因斯布鲁克', country: 'Austria', countryZh: '奥地利', flag: '🇦🇹', match: 70,
    soul: {
      headline: '阿尔卑斯山心脏的奥运之城，城市与雪山的终极共存。',
      sub: '文化 · 自然 · 运动 · 历史',
      body: '因斯布鲁克是全球少数几个从市中心步行15分钟就能踏上滑雪道的城市，北连阿尔卑斯山脉与因河（Inn River）在城市中央交汇。这座曾举办两次冬奥会的城市，把极限运动与悠闲咖啡馆文化融合得天衣无缝。',
      personality: '因斯布鲁克人以户外文化、蒂罗尔传统与对游客保持适度友善著称，这是一座真正生活在山里的城市——户外运动不是周末活动，而是日常基础设施。城市大学氛围带来持续年轻活力，外籍学生占比高，英语交流无障碍。',
      economy: '旅游业（冬季滑雪与夏季登山）是最大支柱；奥地利联邦铁路运营中心与蒂罗尔行政中心带来稳定的公共服务经济；大学经济与生命科学研究是现代增长引擎。',
      festivals: '因斯布鲁克古乐节（Innsbrucker Festwochen der Alten Musik，8月）是全球最重要的古乐专业音乐节之一；新年游行（1月）是蒂罗尔传统节庆的精华展示；冬奥会遗产设施全年对公众开放，是独特的运动旅游体验。',
      figures: '皇帝马克西米利安一世选择因斯布鲁克作为哈布斯堡帝国的临时首都，留下了辉煌的帝国建筑遗产；建筑师扎哈·哈迪德为因斯布鲁克设计了伯吉塞尔滑雪跳台与北链缆车站，以解构主义重塑了城市天际线；探险家安德烈亚斯·霍弗是蒂罗尔自由精神的民族英雄。',
    },
    landing: {
      wifi: '70 Mbps', cost: '$$$', visa: '申根90天免签，奥地利无数字游民专属签证',
      visaDays: '90 days',
      visaDesc: '🛂 欧元区及申根区成员，90天免签。长期居留可申请奥地利自雇许可，审批约3-4个月，因斯布鲁克大学城氛围有助于申请。',
      welfare: '🏥 奥地利全国统一医疗保障体系，持有效居留可参与社保，因斯布鲁克大学医院是蒂罗尔顶级医疗机构。',
      safety: '欧洲最安全的城市之一，犯罪率极低，全天候安全，女性独行安全感极高。',
      dailyCost: '每日预算参考：\n• 餐饮：€13–24（传统蒂罗尔餐厅午餐€10–16，晚餐€15–26）\n• 住宿：€50–90（市中心Airbnb单间，旺季价格较高）\n• 交通：€3–5（月票$58，步行与缆车可达山地景区）\n• 合计：约€66–119/天',
      visaDetail: '奥地利自雇居留申请在因斯布鲁克通过蒂罗尔州政府办理，流程与全国一致。大学城环境为申请提供额外的社会证明。户外生活质量是其他城市无法复制的生活优势。',
      society: '大学城氛围使英语普及率极高，蒂罗尔文化以传统与现代的共存为特色。滑雪与登山是最快的社区融入媒介，交换生、研究人员与极限运动爱好者构成多元的外籍人士社群。',
    },
    chance: {
      paragraph: '冬季运动科技（SportTech）与旅游科技是因斯布鲁克独特赛道；奥地利联邦铁路数字化带来物联网与交通科技机会；大学城创业生态以生命科学与材料科学为特色。',
      policy: { label: 'Austrian Business Agency (ABA)', url: 'https://www.aba.gv.at/en/', desc: '奥地利官方外商投资促进机构' },
      localJobs: [
        { name: 'karriere.at', url: 'https://www.karriere.at', desc: '奥地利最大招聘平台，覆盖各行业职位' },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', desc: '全球最大职业社交网络，覆盖各行业职位' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co', desc: '精选远程工作职位，注重工作质量' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com', desc: '全球最大远程工作社区与招聘平台' },
      ]
    },
    community: {
      paragraph: '因斯布鲁克的外籍人士社群以学生、运动员与户外从业者为主，Mountain Hub等空间是远程工作者与创业者的聚集地。',
      platforms: [
        { name: 'Meetup Innsbruck', url: 'https://www.meetup.com/cities/at/innsbruck/', desc: '本地兴趣小组活动平台，覆盖各类社群' },
        { name: 'Eventbrite Innsbruck', url: 'https://www.eventbrite.com/d/austria--innsbruck/events/', desc: '活动票务与发现平台，涵盖各类线下活动' },
      ]
    }
  },
}

export const CITY_LIST = [
  'Berlin', 'Amsterdam', 'Lisbon', 'Prague', 'Vienna', 'Paris', 'Barcelona', 'Porto',
  'Dublin', 'Dubrovnik', 'Florence', 'Tallinn', 'Madrid', 'Valencia', 'Riga', 'Vilnius',
  'Krakow', 'Budapest', 'Bucharest', 'Sofia', 'Athens', 'Zagreb', 'Ljubljana', 'Rotterdam',
  'Stockholm', 'Copenhagen', 'Helsinki', 'Zurich', 'Lyon', 'Nice', 'Bordeaux', 'Montpellier',
  'Edinburgh', 'Milan', 'Bologna', 'Naples', 'Antwerp', 'Ghent', 'Oslo', 'Reykjavik',
  'Geneva', 'Basel', 'Toulouse', 'Marseille', 'Manchester', 'Bristol', 'Turin', 'Warsaw',
  'Salzburg', 'Innsbruck',
]

export const GLOBAL_COMMUNITIES: { name: string; url: string; desc: string }[] = [
  { name: 'Nomad List Community', url: 'https://nomadlist.com/community', desc: '全球最大数字游民数据库与社区论坛' },
  { name: 'Digital Nomad Reddit', url: 'https://www.reddit.com/r/digitalnomad/', desc: 'Reddit 上最活跃的数字游民讨论社区' },
  { name: 'Dynamite Circle', url: 'https://www.tropicalmba.com/community/', desc: 'Tropical MBA 旗下付费精英游民社群' },
]
