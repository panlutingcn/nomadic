export interface CityData {
  name: string
  nameZh: string
  country: string
  countryZh: string
  flag: string
  match: number
  soul: { headline: string; sub: string }
  base: { wifi: string; cost: string; visa: string; welfare: string }
  chance: {
    paragraph: string
    policy: { label: string; url: string }
    localJobs: { name: string; url: string }[]
    remoteJobs: { name: string; url: string }[]
  }
  local: {
    platforms: { name: string; url: string }[]
  }
}

export const CITIES: Record<string, CityData> = {
  Berlin: {
    name: 'Berlin', nameZh: '柏林', country: 'Germany', countryZh: '德国', flag: '🇩🇪', match: 98,
    soul: {
      headline: '在这里，废墟与先锋共生。',
      sub: '文化 · 历史 · 节庆 · 经济支柱'
    },
    base: {
      wifi: '98 Mbps', cost: '$$', visa: '90天申根免签',
      welfare: '🏥 持有效签证可加入法定医保（GKV），公立医院覆盖广泛，费用较低。'
    },
    chance: {
      paragraph: '柏林设计审美偏向理性实用主义，创意产业密集，品牌出海需求旺盛。Mittelstand 中小企业构成商业骨干，咨询、策划与内容类项目持续活跃。',
      policy: { label: '自由职业签证（Freiberufler）', url: 'https://www.make-it-in-germany.com/en/visa-residence/types/self-employment' },
      localJobs: [
        { name: 'StepStone DE', url: 'https://www.stepstone.de' },
        { name: 'XING Jobs', url: 'https://www.xing.com/jobs' },
        { name: 'Indeed DE', url: 'https://de.indeed.com' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com' },
        { name: 'Toptal', url: 'https://www.toptal.com' },
        { name: 'Contra', url: 'https://contra.com' },
      ]
    },
    local: {
      platforms: [
        { name: 'Meetup Berlin', url: 'https://www.meetup.com/cities/de/berlin/' },
        { name: 'Eventbrite Berlin', url: 'https://www.eventbrite.de/d/germany--berlin/events/' },
        { name: 'Berlin Startup Jobs Events', url: 'https://berlinstartupjobs.com/events/' },
      ]
    }
  },
  Amsterdam: {
    name: 'Amsterdam', nameZh: '阿姆斯特丹', country: 'Netherlands', countryZh: '荷兰', flag: '🇳🇱', match: 91,
    soul: {
      headline: '自由与秩序，在运河间共存。',
      sub: '文化 · 历史 · 节庆 · 经济支柱'
    },
    base: {
      wifi: '120 Mbps', cost: '$$$', visa: '90天申根免签',
      welfare: '🏥 工作满一定时间可享受荷兰社保，医疗保险强制购买，质量高且报销比例大。'
    },
    chance: {
      paragraph: '阿姆斯特丹是欧洲科技初创与创意产业的重镇，英语普及率极高，对外籍人才极度友好。',
      policy: { label: 'DAFT 自雇签证（美国公民适用）', url: 'https://ind.nl/en/residence-permits/work/self-employment' },
      localJobs: [
        { name: 'Nationalevacaturebank', url: 'https://www.nationalevacaturebank.nl' },
        { name: 'LinkedIn NL Jobs', url: 'https://www.linkedin.com/jobs' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com' },
        { name: 'Toptal', url: 'https://www.toptal.com' },
      ]
    },
    local: {
      platforms: [
        { name: 'Meetup Amsterdam', url: 'https://www.meetup.com/cities/nl/amsterdam/' },
        { name: 'Eventbrite Amsterdam', url: 'https://www.eventbrite.nl/d/netherlands--amsterdam/events/' },
      ]
    }
  },
  Lisbon: {
    name: 'Lisbon', nameZh: '里斯本', country: 'Portugal', countryZh: '葡萄牙', flag: '🇵🇹', match: 87,
    soul: {
      headline: '阳光、瓷砖与慢生活的哲学。',
      sub: '文化 · 历史 · 节庆 · 经济支柱'
    },
    base: {
      wifi: '85 Mbps', cost: '$', visa: '90天申根免签',
      welfare: '🏥 持 D8 签证可访问公共医疗系统（SNS），费用低廉；长期居民可申请 NHR 税务优惠。'
    },
    chance: {
      paragraph: '里斯本物价低廉、气候宜人，已成为欧洲增长最快的数字游民聚集地，初创生态活跃。',
      policy: { label: '数字游民签证（D8 Visa）', url: 'https://vistos.mne.gov.pt/en/national-visas/required-documentation/passive-income' },
      localJobs: [
        { name: 'Net-Empregos', url: 'https://www.net-empregos.com' },
        { name: 'LinkedIn PT Jobs', url: 'https://www.linkedin.com/jobs' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com' },
        { name: 'Nomad List Jobs', url: 'https://nomadlist.com/jobs' },
      ]
    },
    local: {
      platforms: [
        { name: 'Meetup Lisbon', url: 'https://www.meetup.com/cities/pt/lisbon/' },
        { name: 'Eventbrite Lisboa', url: 'https://www.eventbrite.pt/d/portugal--lisbon/events/' },
      ]
    }
  },
  Bangkok: {
    name: 'Bangkok', nameZh: '曼谷', country: 'Thailand', countryZh: '泰国', flag: '🇹🇭', match: 85,
    soul: {
      headline: '混沌中生长的东南亚能量之都。',
      sub: '文化 · 历史 · 节庆 · 经济支柱'
    },
    base: {
      wifi: '74 Mbps', cost: '$', visa: '30天落地签',
      welfare: '🏥 外籍人士不纳入泰国社保体系，建议自行购买国际医疗保险，费用约 $50–$150/月。'
    },
    chance: {
      paragraph: '曼谷是东南亚商业枢纽，共享办公空间密集，消费成本极低，适合刚起步的数字游民。',
      policy: { label: 'LTR 长期居留签证（高收入远程工作者）', url: 'https://ltr.boi.go.th/en/index.html' },
      localJobs: [
        { name: 'JobsDB Thailand', url: 'https://th.jobsdb.com' },
        { name: 'LinkedIn TH Jobs', url: 'https://www.linkedin.com/jobs' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com' },
        { name: 'Toptal', url: 'https://www.toptal.com' },
      ]
    },
    local: {
      platforms: [
        { name: 'Meetup Bangkok', url: 'https://www.meetup.com/cities/th/bangkok/' },
        { name: 'Eventbrite Bangkok', url: 'https://www.eventbrite.com/d/thailand--bangkok/events/' },
        { name: 'InterNations Bangkok', url: 'https://www.internations.org/bangkok-expats/' },
      ]
    }
  },
  Prague: {
    name: 'Prague', nameZh: '布拉格', country: 'Czech Republic', countryZh: '捷克', flag: '🇨🇿', match: 82,
    soul: {
      headline: '中欧的童话古城，创意与历史共鸣。',
      sub: '文化 · 历史 · 节庆 · 经济支柱'
    },
    base: {
      wifi: '80 Mbps', cost: '$', visa: '90天申根免签',
      welfare: '🏥 申根区内医疗资源完善，建议购买旅行医疗保险，私立诊所英语服务良好。'
    },
    chance: {
      paragraph: '布拉格物价低于西欧三分之一，科技初创生态快速崛起，吸引大量欧洲远程工作者定居。',
      policy: { label: '自由职业贸易许可证（Živnostenský list）', url: 'https://www.businessinfo.cz/en/starting-business/' },
      localJobs: [
        { name: 'Jobs.cz', url: 'https://www.jobs.cz' },
        { name: 'LinkedIn CZ Jobs', url: 'https://www.linkedin.com/jobs' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com' },
      ]
    },
    local: {
      platforms: [
        { name: 'Meetup Prague', url: 'https://www.meetup.com/cities/cz/prague/' },
        { name: 'Eventbrite Prague', url: 'https://www.eventbrite.com/d/czech-republic--prague/events/' },
      ]
    }
  },
  Vienna: {
    name: 'Vienna', nameZh: '维也纳', country: 'Austria', countryZh: '奥地利', flag: '🇦🇹', match: 80,
    soul: {
      headline: '帝国余晖中的艺术与优雅。',
      sub: '文化 · 历史 · 节庆 · 经济支柱'
    },
    base: {
      wifi: '90 Mbps', cost: '$$$', visa: '90天申根免签',
      welfare: '🏥 奥地利医疗体系完善，持有效居留许可者可参加社会保险，公立医疗质量极高。'
    },
    chance: {
      paragraph: '维也纳是中欧商业中心，金融与文化创意产业并重，生活质量连续多年全球排名第一。',
      policy: { label: '奥地利红白红卡（自雇类别）', url: 'https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/self-employed-key-workers/' },
      localJobs: [
        { name: 'karriere.at', url: 'https://www.karriere.at' },
        { name: 'LinkedIn AT Jobs', url: 'https://www.linkedin.com/jobs' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com' },
      ]
    },
    local: {
      platforms: [
        { name: 'Meetup Vienna', url: 'https://www.meetup.com/cities/at/vienna/' },
        { name: 'Eventbrite Vienna', url: 'https://www.eventbrite.at/d/austria--vienna/events/' },
      ]
    }
  },
  Paris: {
    name: 'Paris', nameZh: '巴黎', country: 'France', countryZh: '法国', flag: '🇫🇷', match: 89,
    soul: {
      headline: '时尚、哲学与美食的永恒之都。',
      sub: '文化 · 艺术 · 时尚 · 美食'
    },
    base: {
      wifi: '100 Mbps', cost: '$$$', visa: '90天申根免签',
      welfare: '🏥 法国医疗体系全球顶尖，持有效居留许可者可加入社会保险（Sécurité Sociale）。'
    },
    chance: {
      paragraph: '巴黎是全球时尚、奢侈品与创意产业的中心，科技初创生态（Station F）快速崛起，英语工作机会日益增多。',
      policy: { label: '法国自由职业签证（Talent Passport）', url: 'https://www.service-public.fr/particuliers/vosdroits/F16922' },
      localJobs: [
        { name: 'Welcome to the Jungle', url: 'https://www.welcometothejungle.com' },
        { name: 'LinkedIn FR Jobs', url: 'https://www.linkedin.com/jobs' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com' },
        { name: 'Malt', url: 'https://www.malt.fr' },
      ]
    },
    local: {
      platforms: [
        { name: 'Meetup Paris', url: 'https://www.meetup.com/cities/fr/paris/' },
        { name: 'Eventbrite Paris', url: 'https://www.eventbrite.fr/d/france--paris/events/' },
        { name: 'Station F Events', url: 'https://stationf.co' },
      ]
    }
  },
  Barcelona: {
    name: 'Barcelona', nameZh: '巴塞罗那', country: 'Spain', countryZh: '西班牙', flag: '🇪🇸', match: 86,
    soul: {
      headline: '地中海的激情与建筑的诗意在此交汇。',
      sub: '文化 · 建筑 · 美食 · 创意'
    },
    base: {
      wifi: '95 Mbps', cost: '$$', visa: '90天申根免签',
      welfare: '🏥 西班牙公共医疗体系完善，持居留许可者可享受免费公立医疗，私立诊所英语服务普遍。'
    },
    chance: {
      paragraph: '巴塞罗那是欧洲最具活力的创意与科技中心之一，Mobile World Congress 每年在此举办，初创生态活跃，英语工作机会多。',
      policy: { label: '西班牙数字游民签证', url: 'https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Detalle-ficha-consular.aspx' },
      localJobs: [
        { name: 'InfoJobs', url: 'https://www.infojobs.net' },
        { name: 'LinkedIn ES Jobs', url: 'https://www.linkedin.com/jobs' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com' },
        { name: 'Workana', url: 'https://www.workana.com' },
      ]
    },
    local: {
      platforms: [
        { name: 'Meetup Barcelona', url: 'https://www.meetup.com/cities/es/barcelona/' },
        { name: 'Eventbrite Barcelona', url: 'https://www.eventbrite.es/d/spain--barcelona/events/' },
        { name: 'Barcelona Activa', url: 'https://www.barcelonactiva.cat' },
      ]
    }
  },
  Porto: {
    name: 'Porto', nameZh: '波尔图', country: 'Portugal', countryZh: '葡萄牙', flag: '🇵🇹', match: 84,
    soul: {
      headline: '葡萄酒、花砖与大西洋风的慢城哲学。',
      sub: '文化 · 历史 · 美食 · 艺术'
    },
    base: {
      wifi: '80 Mbps', cost: '$', visa: '90天申根免签',
      welfare: '🏥 葡萄牙公共医疗系统（SNS）覆盖广泛，持 D8 签证可低价就医，生活成本远低于西欧。'
    },
    chance: {
      paragraph: '波尔图物价低廉、生活质量高，近年吸引大量远程工作者和创意人才，科技初创生态快速成长。',
      policy: { label: '葡萄牙数字游民签证（D8）', url: 'https://vistos.mne.gov.pt/en/national-visas/required-documentation/passive-income' },
      localJobs: [
        { name: 'Net-Empregos', url: 'https://www.net-empregos.com' },
        { name: 'LinkedIn PT Jobs', url: 'https://www.linkedin.com/jobs' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com' },
        { name: 'Nomad List Jobs', url: 'https://nomadlist.com/jobs' },
      ]
    },
    local: {
      platforms: [
        { name: 'Meetup Porto', url: 'https://www.meetup.com/cities/pt/porto/' },
        { name: 'Eventbrite Porto', url: 'https://www.eventbrite.pt/d/portugal--porto/events/' },
      ]
    }
  },
  Dublin: {
    name: 'Dublin', nameZh: '都柏林', country: 'Ireland', countryZh: '爱尔兰', flag: '🇮🇪', match: 83,
    soul: {
      headline: '欧洲科技之都，文学与酒吧文化的故乡。',
      sub: '文化 · 科技 · 文学 · 社群'
    },
    base: {
      wifi: '105 Mbps', cost: '$$$', visa: '90天免签（非申根）',
      welfare: '🏥 爱尔兰公共医疗（HSE）质量高，持有效签证可享受部分公共医疗服务，私立医疗保险推荐购买。'
    },
    chance: {
      paragraph: '都柏林是 Google、Meta、Apple 欧洲总部所在地，英语母语环境，科技与金融岗位密集，是进入欧洲市场的理想跳板。',
      policy: { label: '爱尔兰创业签证（Start-up Entrepreneur Programme）', url: 'https://enterprise.gov.ie/en/what-we-do/supports-for-smes/start-up-entrepreneur-programme/' },
      localJobs: [
        { name: 'IrishJobs.ie', url: 'https://www.irishjobs.ie' },
        { name: 'LinkedIn IE Jobs', url: 'https://www.linkedin.com/jobs' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com' },
        { name: 'Toptal', url: 'https://www.toptal.com' },
      ]
    },
    local: {
      platforms: [
        { name: 'Meetup Dublin', url: 'https://www.meetup.com/cities/ie/dublin/' },
        { name: 'Eventbrite Dublin', url: 'https://www.eventbrite.ie/d/ireland--dublin/events/' },
        { name: 'Silicon Docks Events', url: 'https://www.siliconrepublic.com/events' },
      ]
    }
  },
  Dubrovnik: {
    name: 'Dubrovnik', nameZh: '杜布罗夫尼克', country: 'Croatia', countryZh: '克罗地亚', flag: '🇭🇷', match: 78,
    soul: {
      headline: '亚得里亚海的珍珠，城墙内的永恒时光。',
      sub: '文化 · 历史 · 海岸 · 美食'
    },
    base: {
      wifi: '70 Mbps', cost: '$$', visa: '90天申根免签',
      welfare: '🏥 克罗地亚医疗体系完善，公立医院覆盖基本需求，建议购买旅行医疗保险。'
    },
    chance: {
      paragraph: '杜布罗夫尼克以旅游业为主，远程工作者可享受极高生活质量与低廉物价，克罗地亚数字游民签证是欧洲最早推出的之一。',
      policy: { label: '克罗地亚数字游民签证', url: 'https://mup.gov.hr/aliens-281621/stay-and-work/temporary-stay-of-digital-nomads/286833' },
      localJobs: [
        { name: 'MojPosao', url: 'https://www.mojposao.hr' },
        { name: 'LinkedIn HR Jobs', url: 'https://www.linkedin.com/jobs' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com' },
        { name: 'Nomad List Jobs', url: 'https://nomadlist.com/jobs' },
      ]
    },
    local: {
      platforms: [
        { name: 'Meetup Croatia', url: 'https://www.meetup.com/cities/hr/zagreb/' },
        { name: 'Eventbrite Croatia', url: 'https://www.eventbrite.com/d/croatia/events/' },
      ]
    }
  },
  Florence: {
    name: 'Florence', nameZh: '佛罗伦萨', country: 'Italy', countryZh: '意大利', flag: '🇮🇹', match: 81,
    soul: {
      headline: '文艺复兴的摇篮，美与创造力的永恒源泉。',
      sub: '文化 · 艺术 · 美食 · 历史'
    },
    base: {
      wifi: '85 Mbps', cost: '$$', visa: '90天申根免签',
      welfare: '🏥 意大利国家医疗服务（SSN）覆盖广泛，持居留许可者可免费或低价就医，私立诊所质量高。'
    },
    chance: {
      paragraph: '佛罗伦萨是全球时尚、皮革工艺与艺术设计的圣地，创意产业机会丰富，意大利语能力可大幅提升本地商业机会。',
      policy: { label: '意大利数字游民签证', url: 'https://www.esteri.it/en/servizi-consolari-e-visti/stranieri-in-italia/visti-per-lItalia/' },
      localJobs: [
        { name: 'InfoJobs IT', url: 'https://www.infojobs.it' },
        { name: 'LinkedIn IT Jobs', url: 'https://www.linkedin.com/jobs' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com' },
        { name: 'Freelancer.com', url: 'https://www.freelancer.com' },
      ]
    },
    local: {
      platforms: [
        { name: 'Meetup Florence', url: 'https://www.meetup.com/cities/it/florence/' },
        { name: 'Eventbrite Firenze', url: 'https://www.eventbrite.it/d/italy--florence/events/' },
      ]
    }
  },
  Tallinn: {
    name: 'Tallinn', nameZh: '塔林', country: 'Estonia', countryZh: '爱沙尼亚', flag: '🇪🇪', match: 88,
    soul: {
      headline: '世界上数字化程度最高的古城。',
      sub: '文化 · 历史 · 节庆 · 经济支柱'
    },
    base: {
      wifi: '110 Mbps', cost: '$', visa: '90天申根免签',
      welfare: '🏥 爱沙尼亚数字游民签证持有者须自行购买医疗保险，本地私立诊所费用合理。'
    },
    chance: {
      paragraph: '塔林是全球数字游民签证的发源地，科技初创密度欧洲最高，e-Residency 项目让远程经营欧盟公司成为现实。',
      policy: { label: '数字游民签证（Digital Nomad Visa）', url: 'https://www.politsei.ee/en/instructions/digital-nomad-visa' },
      localJobs: [
        { name: 'CV.ee', url: 'https://www.cv.ee' },
        { name: 'LinkedIn EE Jobs', url: 'https://www.linkedin.com/jobs' },
      ],
      remoteJobs: [
        { name: 'Remote.co', url: 'https://remote.co' },
        { name: 'We Work Remotely', url: 'https://weworkremotely.com' },
        { name: 'Nomad List Jobs', url: 'https://nomadlist.com/jobs' },
      ]
    },
    local: {
      platforms: [
        { name: 'Meetup Tallinn', url: 'https://www.meetup.com/cities/ee/tallinn/' },
        { name: 'Eventbrite Tallinn', url: 'https://www.eventbrite.com/d/estonia--tallinn/events/' },
      ]
    }
  },
}

export const CITY_LIST = ['Berlin', 'Amsterdam', 'Lisbon', 'BCN', 'Prague', 'Vienna', 'Tallinn']

export const GLOBAL_COMMUNITIES = [
  { name: 'Nomad List Community', url: 'https://nomadlist.com/community' },
  { name: 'Remote Year', url: 'https://www.remoteyear.com' },
  { name: 'Digital Nomad Reddit', url: 'https://www.reddit.com/r/digitalnomad/' },
  { name: 'Dynamite Circle', url: 'https://www.tropicalmba.com/community/' },
  { name: 'Couchsurfing Hangouts', url: 'https://www.couchsurfing.com' },
]
