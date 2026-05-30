export interface SafetyLink {
  name: string
  url: string
  desc: string
}

export const CITY_SAFETY_LINKS: Record<string, SafetyLink[]> = {
  Berlin: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '德国通用紧急号码（急救·消防·警察110）' },
    { name: '中国驻德国大使馆', url: 'https://www.china-botschaft.de', desc: '领事服务与紧急求助热线' },
    { name: 'Charité 柏林夏里特大学医院', url: 'https://www.charite.de', desc: '德国最大大学附属医院，提供英语服务' },
  ],
  Amsterdam: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '荷兰通用紧急号码（急救·消防·警察）' },
    { name: '中国驻荷兰大使馆', url: 'https://www.chinese-embassy.nl', desc: '领事服务与紧急求助热线' },
    { name: 'Amsterdam UMC 阿姆斯特丹大学医学中心', url: 'https://www.amsterdamumc.org', desc: '荷兰顶尖大学医院，提供英语服务' },
  ],
  Lisbon: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '葡萄牙通用紧急号码（急救·消防·警察）' },
    { name: '中国驻葡萄牙大使馆', url: 'http://pt.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Hospital de Santa Maria', url: 'https://www.chulisboa.min-saude.pt', desc: '里斯本最大公立教学医院' },
  ],
  Prague: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '捷克通用紧急号码（急救155·警察158·消防150）' },
    { name: '中国驻捷克大使馆', url: 'http://cz.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Nemocnice Na Homolce', url: 'https://www.homolka.cz', desc: '布拉格主要国际医院，提供英语服务' },
  ],
  Vienna: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '奥地利通用紧急号码（急救144·警察133·消防122）' },
    { name: '中国驻奥地利大使馆', url: 'http://at.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'AKH Wien 维也纳综合医院', url: 'https://www.akhwien.at', desc: '欧洲最大医院之一，提供多语言服务' },
  ],
  Paris: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '法国通用紧急号码（SAMU急救15·警察17·消防18）' },
    { name: '中国驻法国大使馆', url: 'http://fr.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'AP-HP 巴黎公立医院联盟', url: 'https://www.aphp.fr', desc: '巴黎最大公立医院网络，覆盖全市主要医院' },
  ],
  Barcelona: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '西班牙通用紧急号码（急救·警察091·消防080）' },
    { name: '中国驻西班牙大使馆', url: 'http://es.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Hospital Clínic de Barcelona', url: 'https://www.clinicbarcelona.org', desc: '巴塞罗那顶尖大学附属医院，提供英语服务' },
  ],
  Porto: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '葡萄牙通用紧急号码（急救·消防·警察）' },
    { name: '中国驻葡萄牙大使馆', url: 'http://pt.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Hospital de São João', url: 'https://www.chusj.min-saude.pt', desc: '波尔图最大公立医院，提供部分英语服务' },
  ],
  Dublin: [
    { name: '紧急救援 · 112 / 999', url: 'tel:112', desc: '爱尔兰紧急号码（急救·警察·消防均可拨打）' },
    { name: '中国驻爱尔兰大使馆', url: 'http://ie.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: "St. Vincent's University Hospital", url: 'https://www.svuh.ie', desc: '都柏林主要公立教学医院' },
  ],
  Dubrovnik: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '克罗地亚通用紧急号码（急救194·警察192·消防193）' },
    { name: '中国驻克罗地亚大使馆', url: 'http://hr.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Opća bolnica Dubrovnik', url: 'https://www.bolnica-du.hr', desc: '杜布罗夫尼克综合医院' },
  ],
  Florence: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '意大利通用紧急号码（急救118·警察113·消防115）' },
    { name: '中国驻意大利大使馆', url: 'http://it.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'AOU Careggi 卡雷吉大学医院', url: 'https://www.aoucareggi.toscana.it', desc: '佛罗伦萨最大公立教学医院' },
  ],
  Tallinn: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '爱沙尼亚通用紧急号码（急救·警察·消防）' },
    { name: '中国驻爱沙尼亚大使馆', url: 'http://ee.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'North Estonia Medical Centre', url: 'https://www.regionaalhaigla.ee', desc: '塔林最大医院，提供英语服务' },
  ],
  Madrid: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '西班牙通用紧急号码（急救·警察091·消防080）' },
    { name: '中国驻西班牙大使馆', url: 'http://es.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Hospital Universitario La Paz', url: 'https://www.comunidad.madrid/hospital/lapaz', desc: '马德里最大公立大学医院' },
  ],
  Valencia: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '西班牙通用紧急号码（急救·警察091·消防080）' },
    { name: '中国驻西班牙大使馆', url: 'http://es.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Hospital Universitari i Politècnic La Fe', url: 'https://www.hospital-lafe.com', desc: '瓦伦西亚最大公立教学医院' },
  ],
  Riga: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '拉脱维亚通用紧急号码（急救·警察·消防）' },
    { name: '中国驻拉脱维亚大使馆', url: 'http://lv.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Rīgas Austrumu slimnīca', url: 'https://www.aslimnica.lv', desc: '里加东部临床大学医院' },
  ],
  Vilnius: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '立陶宛通用紧急号码（急救·警察·消防）' },
    { name: '中国驻立陶宛大使馆', url: 'http://lt.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Vilnius University Hospital Santaros Clinics', url: 'https://www.santa.lt', desc: '维尔纽斯最大大学医院，提供英语服务' },
  ],
  Krakow: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '波兰通用紧急号码（急救999·警察997·消防998）' },
    { name: '中国驻波兰大使馆', url: 'http://pl.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Szpital Uniwersytecki w Krakowie', url: 'https://www.su.krakow.pl', desc: '克拉科夫大学医院，提供部分英语服务' },
  ],
  Budapest: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '匈牙利通用紧急号码（急救104·警察107·消防105）' },
    { name: '中国驻匈牙利大使馆', url: 'http://hu.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Semmelweis Egyetem Klinikai Tömb', url: 'https://semmelweis.hu', desc: '布达佩斯塞梅尔维斯大学附属医院' },
  ],
  Bucharest: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '罗马尼亚通用紧急号码（急救·警察·消防）' },
    { name: '中国驻罗马尼亚大使馆', url: 'http://ro.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Spitalul Universitar de Urgență București', url: 'https://www.suub.ro', desc: '布加勒斯特大学紧急医院' },
  ],
  Sofia: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '保加利亚通用紧急号码（急救·警察·消防）' },
    { name: '中国驻保加利亚大使馆', url: 'http://bg.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'UMHAT Alexandrovska', url: 'https://www.alexandrovska.com', desc: '索非亚最大大学医院' },
  ],
  Athens: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '希腊通用紧急号码（急救166·警察100·消防199）' },
    { name: '中国驻希腊大使馆', url: 'http://gr.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Evangelismos General Hospital', url: 'https://www.evangelismos.gr', desc: '雅典最大公立医院，提供英语服务' },
  ],
  Zagreb: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '克罗地亚通用紧急号码（急救194·警察192·消防193）' },
    { name: '中国驻克罗地亚大使馆', url: 'http://hr.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'KBC Zagreb', url: 'https://www.kbc-zagreb.hr', desc: '萨格勒布临床医院中心' },
  ],
  Ljubljana: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '斯洛文尼亚通用紧急号码（急救·警察·消防）' },
    { name: '中国驻斯洛文尼亚大使馆', url: 'http://si.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'UMC Ljubljana 卢布尔雅那大学医疗中心', url: 'https://www.umcljubljana.si', desc: '斯洛文尼亚最大医院，提供英语服务' },
  ],
  Rotterdam: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '荷兰通用紧急号码（急救·消防·警察）' },
    { name: '中国驻荷兰大使馆', url: 'https://www.chinese-embassy.nl', desc: '领事服务与紧急求助热线' },
    { name: 'Erasmus MC', url: 'https://www.erasmusmc.nl', desc: '鹿特丹伊拉斯谟大学医学中心，欧洲顶尖医院' },
  ],
  Stockholm: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '瑞典通用紧急号码（医疗建议拨1177）' },
    { name: '中国驻瑞典大使馆', url: 'http://se.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Karolinska Universitetssjukhuset', url: 'https://www.karolinska.se', desc: '卡罗林斯卡大学医院，全球顶尖研究型医院' },
  ],
  Copenhagen: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '丹麦通用紧急号码（急救·警察·消防）' },
    { name: '中国驻丹麦大使馆', url: 'http://dk.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Rigshospitalet', url: 'https://www.rigshospitalet.dk', desc: '丹麦国立医院，哥本哈根最大医院' },
  ],
  Helsinki: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '芬兰通用紧急号码（急救·消防·警察）' },
    { name: '中国驻芬兰大使馆', url: 'http://fi.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'HUS 赫尔辛基大学医院', url: 'https://www.hus.fi', desc: '芬兰最大医院网络，提供英语服务' },
  ],
  Zurich: [
    { name: '紧急救援 · 112 / 144', url: 'tel:112', desc: '瑞士紧急号码（急救144·警察117·消防118）' },
    { name: '中国驻瑞士大使馆', url: 'http://ch.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'UniversitätsSpital Zürich (USZ)', url: 'https://www.usz.ch', desc: '苏黎世大学医院，提供英语服务' },
  ],
  Lyon: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '法国通用紧急号码（SAMU急救15·警察17·消防18）' },
    { name: '中国驻法国大使馆', url: 'http://fr.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Hospices Civils de Lyon', url: 'https://www.chu-lyon.fr', desc: '里昂公共医院联盟，法国最大医院网络之一' },
  ],
  Nice: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '法国通用紧急号码（SAMU急救15·警察17·消防18）' },
    { name: '中国驻法国大使馆', url: 'http://fr.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'CHU de Nice', url: 'https://www.chu-nice.fr', desc: '尼斯大学医院中心' },
  ],
  Bordeaux: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '法国通用紧急号码（SAMU急救15·警察17·消防18）' },
    { name: '中国驻法国大使馆', url: 'http://fr.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'CHU de Bordeaux', url: 'https://www.chu-bordeaux.fr', desc: '波尔多大学医院中心' },
  ],
  Montpellier: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '法国通用紧急号码（SAMU急救15·警察17·消防18）' },
    { name: '中国驻法国大使馆', url: 'http://fr.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'CHU de Montpellier', url: 'https://www.chu-montpellier.fr', desc: '蒙彼利埃大学医院中心' },
  ],
  Edinburgh: [
    { name: '紧急救援 · 999 / 112', url: 'tel:999', desc: '英国紧急号码（警察·急救·消防均可拨打）' },
    { name: '中国驻英国大使馆', url: 'http://gb.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Royal Infirmary of Edinburgh', url: 'https://www.nhslothian.scot', desc: '爱丁堡皇家医院' },
  ],
  Milan: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '意大利通用紧急号码（急救118·警察113·消防115）' },
    { name: '中国驻意大利大使馆', url: 'http://it.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Ospedale Niguarda', url: 'https://www.ospedaleniguarda.it', desc: '米兰最大公立医院之一，提供英语服务' },
  ],
  Bologna: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '意大利通用紧急号码（急救118·警察113·消防115）' },
    { name: '中国驻意大利大使馆', url: 'http://it.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Policlinico Sant\'Orsola', url: 'https://www.aosp.bo.it', desc: '博洛尼亚大学附属医院' },
  ],
  Naples: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '意大利通用紧急号码（急救118·警察113·消防115）' },
    { name: '中国驻意大利大使馆', url: 'http://it.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'AOU Federico II', url: 'https://www.policlinico.unina.it', desc: '那不勒斯腓特烈二世大学医院' },
  ],
  Antwerp: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '比利时通用紧急号码（急救100·警察101·消防100）' },
    { name: '中国驻比利时大使馆', url: 'http://be.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'UZA 安特卫普大学医院', url: 'https://www.uza.be', desc: '安特卫普大学附属医院，提供英语服务' },
  ],
  Ghent: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '比利时通用紧急号码（急救100·警察101·消防100）' },
    { name: '中国驻比利时大使馆', url: 'http://be.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'UZ Gent 根特大学医院', url: 'https://www.uzgent.be', desc: '根特大学附属医院，提供英语服务' },
  ],
  Oslo: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '挪威紧急号码（急救113·警察112·消防110）' },
    { name: '中国驻挪威大使馆', url: 'http://no.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Oslo Universitetssykehus (OUS)', url: 'https://www.oslo-universitetssykehus.no', desc: '奥斯陆大学医院，挪威最大医疗机构' },
  ],
  Reykjavik: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '冰岛通用紧急号码（急救·警察·消防）' },
    { name: '中国驻丹麦大使馆（兼管冰岛）', url: 'http://dk.china-embassy.gov.cn', desc: '冰岛无中国使馆，领事事务由驻丹麦大使馆负责' },
    { name: 'Landspítali 国立大学医院', url: 'https://www.landspitali.is', desc: '冰岛唯一大学医院，提供英语服务' },
  ],
  Geneva: [
    { name: '紧急救援 · 112 / 144', url: 'tel:112', desc: '瑞士紧急号码（急救144·警察117·消防118）' },
    { name: '中国驻瑞士大使馆', url: 'http://ch.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Hôpitaux Universitaires de Genève (HUG)', url: 'https://www.hug.ch', desc: '日内瓦大学医院，欧洲最大医院之一，多语言服务' },
  ],
  Basel: [
    { name: '紧急救援 · 112 / 144', url: 'tel:112', desc: '瑞士紧急号码（急救144·警察117·消防118）' },
    { name: '中国驻瑞士大使馆', url: 'http://ch.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Universitätsspital Basel', url: 'https://www.unispital-basel.ch', desc: '巴塞尔大学医院，提供多语言服务' },
  ],
  Toulouse: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '法国通用紧急号码（SAMU急救15·警察17·消防18）' },
    { name: '中国驻法国大使馆', url: 'http://fr.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'CHU de Toulouse', url: 'https://www.chu-toulouse.fr', desc: '图卢兹大学医院中心' },
  ],
  Marseille: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '法国通用紧急号码（SAMU急救15·警察17·消防18）' },
    { name: '中国驻法国大使馆', url: 'http://fr.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'APHM 马赛公立医院联盟', url: 'https://www.ap-hm.fr', desc: '马赛公立医院联盟，覆盖全市主要医院' },
  ],
  Manchester: [
    { name: '紧急救援 · 999 / 112', url: 'tel:999', desc: '英国紧急号码（警察·急救·消防均可拨打）' },
    { name: '中国驻英国大使馆', url: 'http://gb.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Manchester University NHS Foundation Trust', url: 'https://mft.nhs.uk', desc: '曼彻斯特大学医院NHS基金会' },
  ],
  Bristol: [
    { name: '紧急救援 · 999 / 112', url: 'tel:999', desc: '英国紧急号码（警察·急救·消防均可拨打）' },
    { name: '中国驻英国大使馆', url: 'http://gb.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Bristol Royal Infirmary', url: 'https://www.uhbristol.nhs.uk', desc: '布里斯托皇家医院' },
  ],
  Turin: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '意大利通用紧急号码（急救118·警察113·消防115）' },
    { name: '中国驻意大利大使馆', url: 'http://it.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Città della Salute e della Scienza', url: 'https://www.cittadellasalute.to.it', desc: '都灵健康与科学城，意大利最大医院综合体之一' },
  ],
  Warsaw: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '波兰通用紧急号码（急救999·警察997·消防998）' },
    { name: '中国驻波兰大使馆', url: 'http://pl.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Centralny Szpital Kliniczny MSWiA', url: 'https://www.cskmswia.pl', desc: '华沙中央临床医院，接受外籍患者' },
  ],
  Salzburg: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '奥地利紧急号码（急救144·警察133·消防122）' },
    { name: '中国驻奥地利大使馆', url: 'http://at.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'LKH Salzburg 萨尔茨堡州立医院', url: 'https://www.salzburger-landeskliniken.at', desc: '萨尔茨堡主要公立医院' },
  ],
  Innsbruck: [
    { name: '紧急救援 · 112', url: 'tel:112', desc: '奥地利紧急号码（急救144·警察133·消防122）' },
    { name: '中国驻奥地利大使馆', url: 'http://at.china-embassy.gov.cn', desc: '领事服务与紧急求助热线' },
    { name: 'Universitätsklinik Innsbruck', url: 'https://www.tilak.at', desc: '因斯布鲁克大学医院，提供英语服务' },
  ],
}
