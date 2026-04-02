(function () {
  const DISTRICTS = [
    {
      id: "gaoxin",
      name: "高新区",
      shortName: "高新",
      location: "成都南部",
      focus: "科创产业 / 金融城 / 改善住区",
      intro: "软件园、金融城与大源板块联动，改善置业与人才安居需求集中。",
      features: ["科创产业", "金融城", "改善住区"],
      accent: "#fd5d00",
      accentSoft: "rgba(253, 93, 0, 0.14)",
      palette: { start: "#ffb47c", end: "#fd5d00" },
      map: { markerX: "56%", markerY: "63%" },
      advantages: [
        { title: "产业带动居住需求", desc: "软件园、交子大道和新川板块聚集高活跃就业人口，改善与人才置业并行。" },
        { title: "轨交覆盖成熟", desc: "金融城、大源和中和片区串联，工作与居住通勤半径更清晰。" },
        { title: "改善产品集中", desc: "高新南低密与品质住区较多，适合关注产品力和交付标准的置业人群。" }
      ],
      services: [
        { id: "serviceSubsidyCard", title: "优惠补贴申领", desc: "人才安居、购房补贴和以旧换新入口集中查看。", action: "立即申领", items: ["人才安居资格", "购房补贴进度", "以旧换新入口"] },
        { id: "servicePolicyCard", title: "区县政策", desc: "人才购房、交易登记和板块规则集中查看。", action: "查看政策", items: ["人才购房政策", "交易登记流程", "板块配套规划"] }
      ],
      videos: [
        { title: "高新区板块导览", meta: "软件园 · 金融城 · 大源", duration: "03:18" },
        { title: "高新南住区分布", meta: "新川 · 中和 · 高新南", duration: "02:46" },
        { title: "高新区通勤与配套", meta: "商务区 · 轨交 · 商业", duration: "03:02" }
      ],
      projects: [
        { name: "招商时代公园", area: "高新区 / 建面 105-143㎡", desc: "金融城南改善住区 / 近地铁", price: "31000-34000", stock: "剩余 36 套", badge: "金融城", thumb: "金融城", tags: ["改善", "地铁旁"] },
        { name: "城投天府锦上", area: "高新区 / 建面 99-128㎡", desc: "软件园居住板块 / 配套成熟", price: "28500-32000", stock: "剩余 22 套", badge: "高新南", thumb: "软件园", tags: ["人才安居", "商圈"] },
        { name: "万科都会半岛", area: "高新区 / 建面 118-169㎡", desc: "低密改善 / 新川创新住区", price: "33500-36000", stock: "剩余 18 套", badge: "新川", thumb: "创新区", tags: ["低密", "改善"] }
      ]
    },
    {
      id: "tianfu",
      name: "天府新区",
      shortName: "天府",
      location: "成都南拓",
      focus: "总部商务 / 会展生态 / 滨水住区",
      intro: "总部商务区、科学城和麓湖板块衔接，兼具生态资源与新城配套。",
      features: ["总部商务", "会展生态", "滨水住区"],
      accent: "#ff7a2f",
      accentSoft: "rgba(255, 122, 47, 0.16)",
      palette: { start: "#ffc68f", end: "#ff7a2f" },
      map: { markerX: "74%", markerY: "76%" },
      advantages: [
        { title: "新城界面完整", desc: "总部商务区、科学城和麓湖形成连续开发界面，城市面貌更新快。" },
        { title: "生态资源集中", desc: "麓湖、水系公园和会展片区提升居住舒适度，适合关注景观与居住品质。" },
        { title: "板块层次清晰", desc: "会展、总部和科学城分别承接商务、居住和产业，选房路径更明确。" }
      ],
      services: [
        { id: "serviceSubsidyCard", title: "优惠补贴申领", desc: "人才安居、购房支持和专项补贴统一查看。", action: "立即申领", items: ["人才安居补贴", "购房支持入口", "资格审核进度"] },
        { id: "servicePolicyCard", title: "区县政策", desc: "新区置业规则、学校入学和交易政策集中查看。", action: "查看政策", items: ["新区置业政策", "学位配套说明", "交易办理流程"] }
      ],
      videos: [
        { title: "天府新区会展主轴", meta: "会展城 · 商务区 · 公园", duration: "03:26" },
        { title: "科学城住区导览", meta: "科学城 · 兴隆湖 · 创新社区", duration: "02:58" },
        { title: "麓湖生活配套", meta: "滨水 · 商业 · 教育", duration: "03:12" }
      ],
      projects: [
        { name: "天投麓城", area: "天府新区 / 建面 108-168㎡", desc: "麓湖低密改善 / 景观资源集中", price: "29500-34500", stock: "剩余 24 套", badge: "麓湖", thumb: "滨水区", tags: ["低密", "生态"] },
        { name: "保利天珺", area: "天府新区 / 建面 99-143㎡", desc: "总部商务区住区 / 通勤便捷", price: "27000-31500", stock: "剩余 31 套", badge: "总部区", thumb: "商务区", tags: ["商务", "改善"] },
        { name: "中铁建西派善境", area: "天府新区 / 建面 115-173㎡", desc: "科学城改善住区 / 配套上新", price: "28500-33000", stock: "剩余 19 套", badge: "科学城", thumb: "兴隆湖", tags: ["公园", "教育"] }
      ]
    },
    {
      id: "wuhou",
      name: "武侯区",
      shortName: "武侯",
      location: "成都西南",
      focus: "成熟生活 / 学校配套 / 城市更新",
      intro: "武侯新城、红牌楼与簇桥板块成熟度高，适合关注生活配套和通勤效率。",
      features: ["成熟生活", "学校配套", "城市更新"],
      accent: "#f26b36",
      accentSoft: "rgba(242, 107, 54, 0.16)",
      palette: { start: "#ffbf97", end: "#f26b36" },
      map: { markerX: "33%", markerY: "61%" },
      advantages: [
        { title: "生活配套成熟", desc: "红牌楼、双楠和武侯新城商圈成熟，日常生活便利度高。" },
        { title: "通勤效率稳定", desc: "连接主城核心区与高新南，适合兼顾主城资源与南向通勤的家庭。" },
        { title: "城市更新持续", desc: "武侯新城和簇桥板块持续迭代，改善产品和次新住区选择较多。" }
      ],
      services: [
        { id: "serviceSubsidyCard", title: "优惠补贴申领", desc: "安居补贴、换房支持和交易补助集中查看。", action: "立即申领", items: ["安居补贴入口", "换房支持", "办理进度"] },
        { id: "servicePolicyCard", title: "区县政策", desc: "更新片区规则、交易流程和学位政策统一查看。", action: "查看政策", items: ["更新片区政策", "交易流程", "学位说明"] }
      ],
      videos: [
        { title: "武侯新城住区导览", meta: "武侯新城 · 红牌楼 · 双楠", duration: "02:52" },
        { title: "武侯生活配套分布", meta: "商圈 · 教育 · 医疗", duration: "03:07" },
        { title: "西南通勤主轴", meta: "双地铁 · 快速路 · 商务区", duration: "02:39" }
      ],
      projects: [
        { name: "华润武侯瑞府", area: "武侯区 / 建面 105-142㎡", desc: "武侯新城品质住区 / 次新配套", price: "25500-29800", stock: "剩余 27 套", badge: "武侯新城", thumb: "西南城", tags: ["成熟", "改善"] },
        { name: "建发望江云启", area: "武侯区 / 建面 118-165㎡", desc: "主城改善 / 商圈配套完整", price: "29500-33800", stock: "剩余 14 套", badge: "红牌楼", thumb: "主城芯", tags: ["商圈", "次新"] },
        { name: "国贸天琴湾", area: "武侯区 / 建面 98-128㎡", desc: "簇桥住区 / 生活便利度高", price: "23000-26800", stock: "剩余 33 套", badge: "簇桥", thumb: "成熟区", tags: ["通勤", "配套"] }
      ]
    },
    {
      id: "qingyang",
      name: "青羊区",
      shortName: "青羊",
      location: "成都中西部",
      focus: "主城文脉 / 教育医疗 / 低密改善",
      intro: "主城核心生活界面完整，学校、医疗和历史文脉资源集中，改善需求稳定。",
      features: ["主城文脉", "教育医疗", "低密改善"],
      accent: "#e6671f",
      accentSoft: "rgba(230, 103, 31, 0.16)",
      palette: { start: "#ffc285", end: "#e6671f" },
      map: { markerX: "40%", markerY: "35%" },
      advantages: [
        { title: "主城资源集中", desc: "学校、医院和传统商圈密度高，适合关注长期居住便利性的家庭。" },
        { title: "文脉与居住并重", desc: "文殊坊、宽窄巷子和浣花溪周边形成独特主城生活气质。" },
        { title: "改善稀缺度高", desc: "主城供应节奏稳，低密和次新改善产品关注度持续。" }
      ],
      services: [
        { id: "serviceSubsidyCard", title: "优惠补贴申领", desc: "家庭置业支持、以旧换新和资格办理统一查看。", action: "立即申领", items: ["家庭置业支持", "资格办理", "以旧换新"] },
        { id: "servicePolicyCard", title: "区县政策", desc: "主城区置业规则、落户和配套政策集中查看。", action: "查看政策", items: ["主城区规则", "落户政策", "配套规划"] }
      ],
      videos: [
        { title: "青羊主城住区导览", meta: "浣花溪 · 金沙 · 光华", duration: "03:11" },
        { title: "青羊教育医疗资源", meta: "学校 · 医疗 · 商业", duration: "02:44" },
        { title: "主城改善产品带", meta: "光华 · 金沙 · 低密住区", duration: "03:05" }
      ],
      projects: [
        { name: "华发统建锦江大院", area: "青羊区 / 建面 118-168㎡", desc: "主城改善 / 低密产品", price: "31500-36800", stock: "剩余 12 套", badge: "光华", thumb: "主城芯", tags: ["低密", "主城"] },
        { name: "保利西堂里院", area: "青羊区 / 建面 103-139㎡", desc: "浣花溪住区 / 配套成熟", price: "28800-32600", stock: "剩余 20 套", badge: "浣花溪", thumb: "文脉区", tags: ["文脉", "改善"] },
        { name: "中海金沙府", area: "青羊区 / 建面 95-126㎡", desc: "金沙住区 / 通勤便利", price: "26000-29800", stock: "剩余 29 套", badge: "金沙", thumb: "成熟区", tags: ["教育", "配套"] }
      ]
    },
    {
      id: "jinjiang",
      name: "锦江区",
      shortName: "锦江",
      location: "成都东南",
      focus: "主城商业 / 城东住区 / 改善热度",
      intro: "东大路、攀成钢和三圣乡片区热度高，兼顾主城商务、商业和改善居住需求。",
      features: ["主城商业", "城东住区", "改善热度"],
      accent: "#ef6b2e",
      accentSoft: "rgba(239, 107, 46, 0.16)",
      palette: { start: "#ffc392", end: "#ef6b2e" },
      map: { markerX: "63%", markerY: "42%" },
      advantages: [
        { title: "商业能级强", desc: "东大路和春熙路延展带动商务与商业资源，城市界面活跃。" },
        { title: "城东改善集中", desc: "攀成钢、三圣乡和东湖片区改善产品丰富，次新产品关注度高。" },
        { title: "核心主城属性稳", desc: "工作、生活和消费半径集中，适合关注主城便利度的置业人群。" }
      ],
      services: [
        { id: "serviceSubsidyCard", title: "优惠补贴申领", desc: "改善置业支持、换房补助和资格办理入口集中查看。", action: "立即申领", items: ["改善置业支持", "换房补助", "资格办理"] },
        { id: "servicePolicyCard", title: "区县政策", desc: "主城交易政策、配套兑现和片区更新规则统一查看。", action: "查看政策", items: ["交易政策", "片区更新", "配套兑现"] }
      ],
      videos: [
        { title: "锦江城东住区导览", meta: "攀成钢 · 三圣乡 · 东湖", duration: "03:14" },
        { title: "锦江商业主轴", meta: "东大路 · 商圈 · 商务区", duration: "02:48" },
        { title: "锦江改善产品分布", meta: "主城改善 · 景观住区", duration: "02:57" }
      ],
      projects: [
        { name: "华润锦宸府", area: "锦江区 / 建面 105-146㎡", desc: "攀成钢改善住区 / 商圈成熟", price: "32000-37800", stock: "剩余 16 套", badge: "攀成钢", thumb: "城东芯", tags: ["主城", "改善"] },
        { name: "新希望锦官天樾", area: "锦江区 / 建面 118-169㎡", desc: "三圣乡景观住区 / 低密改善", price: "29500-34200", stock: "剩余 23 套", badge: "三圣乡", thumb: "景观区", tags: ["低密", "景观"] },
        { name: "龙湖天璞", area: "锦江区 / 建面 98-132㎡", desc: "城东次新住区 / 生活配套完整", price: "27800-31600", stock: "剩余 26 套", badge: "东湖", thumb: "成熟区", tags: ["次新", "商圈"] }
      ]
    },
    {
      id: "chenghua",
      name: "成华区",
      shortName: "成华",
      location: "成都东北",
      focus: "东客枢纽 / 产业更新 / 品质住区",
      intro: "东客站、二仙桥和杉板桥板块持续更新，兼顾枢纽通勤与品质住区改善需求。",
      features: ["东客枢纽", "产业更新", "品质住区"],
      accent: "#ef7434",
      accentSoft: "rgba(239, 116, 52, 0.16)",
      palette: { start: "#ffc89b", end: "#ef7434" },
      map: { markerX: "76%", markerY: "44%" },
      advantages: [
        { title: "枢纽通勤优势", desc: "东客站和快速路体系完善，跨城出行与主城通勤效率兼顾。" },
        { title: "旧城更新明显", desc: "二仙桥、杉板桥和崔家店片区持续焕新，次新项目密度提升。" },
        { title: "品质住区增长", desc: "东部新城与主城连接更紧密，适合关注次新产品和更新红利的人群。" }
      ],
      services: [
        { id: "serviceSubsidyCard", title: "优惠补贴申领", desc: "换房支持、置业补贴和资格办理统一查看。", action: "立即申领", items: ["换房支持", "置业补贴", "资格办理"] },
        { id: "servicePolicyCard", title: "区县政策", desc: "更新片区政策、枢纽配套和交易规则集中查看。", action: "查看政策", items: ["更新片区政策", "枢纽配套", "交易规则"] }
      ],
      videos: [
        { title: "成华东客枢纽导览", meta: "东客站 · 二仙桥 · 杉板桥", duration: "03:08" },
        { title: "成华更新住区分布", meta: "杉板桥 · 崔家店 · 次新住区", duration: "02:43" },
        { title: "东北板块通勤主轴", meta: "枢纽 · 快速路 · 商圈", duration: "02:51" }
      ],
      projects: [
        { name: "龙湖舜山府", area: "成华区 / 建面 98-139㎡", desc: "杉板桥次新住区 / 轨交便捷", price: "24500-28600", stock: "剩余 34 套", badge: "杉板桥", thumb: "东客站", tags: ["轨交", "次新"] },
        { name: "华侨城熙成里", area: "成华区 / 建面 108-143㎡", desc: "二仙桥更新住区 / 生活配套提升", price: "23200-27200", stock: "剩余 28 套", badge: "二仙桥", thumb: "更新区", tags: ["更新", "配套"] },
        { name: "中粮悦著云廷", area: "成华区 / 建面 120-160㎡", desc: "东部新城改善住区 / 景观界面新", price: "26000-30200", stock: "剩余 17 套", badge: "东部新城", thumb: "新住区", tags: ["改善", "景观"] }
      ]
    }
  ];

  const DISTRICT_MAP = DISTRICTS.reduce(function (acc, district) {
    acc[district.id] = district;
    return acc;
  }, {});

  const LOCATED_DISTRICT_ID = "gaoxin";

  const DISTRICT_VIDEO_COVER_PRESETS = {
    gaoxin: [
      { image: commonsFilePath("交子大道.jpg"), alt: "成都交子大道街景" },
      { image: commonsFilePath("成都地鐵世紀城站換乘通道.jpg"), alt: "成都世纪城站换乘通道" },
      { image: "../assets/d86e2b37c94f42fcb022f0376ae8a0cf.jpg", alt: "成都城市天际线" }
    ],
    tianfu: [
      { image: commonsFilePath("成都地铁华阳站 站台 2026-01-09 01.jpg"), alt: "成都地铁华阳站站台" },
      { image: commonsFilePath("成都地鐵三岔站.jpg"), alt: "成都地铁三岔站" },
      { image: commonsFilePath("成都地鐵世紀城站換乘通道.jpg"), alt: "成都世纪城站换乘通道" }
    ],
    wuhou: [
      { image: commonsFilePath("成都的武侯祠.jpg"), alt: "成都武侯祠景观" },
      { image: commonsFilePath("成都的武侯祠竹林.jpg"), alt: "成都武侯祠竹林" },
      { image: commonsFilePath("成都武侯祠 惠陵.jpg"), alt: "成都武侯祠惠陵" }
    ],
    qingyang: [
      { image: commonsFilePath("成都青羊宫八卦亭.jpg"), alt: "成都青羊宫八卦亭" },
      { image: commonsFilePath("成都青羊宫唐王殿.jpg"), alt: "成都青羊宫唐王殿" },
      { image: commonsFilePath("成都天府广场.jpg"), alt: "成都天府广场景观" }
    ],
    jinjiang: [
      { image: commonsFilePath("安顺廊桥夜景.jpg"), alt: "成都安顺廊桥夜景" },
      { image: commonsFilePath("成都望江楼2.JPG"), alt: "成都望江楼景观" },
      { image: commonsFilePath("成都锦江区东湖公园 从湖面眺望成都二环路.jpg"), alt: "成都锦江东湖公园" }
    ],
    chenghua: [
      { image: commonsFilePath("成都东站候车室.jpg"), alt: "成都东站候车室" },
      { image: commonsFilePath("成都东站 东广场 - panoramio.jpg"), alt: "成都东站东广场" },
      { image: commonsFilePath("成都东客站站厅 2024-11-24 03.jpg"), alt: "成都东客站站厅" }
    ]
  };

  const ESTATE_DETAIL_HERO_PRESETS = [
    { image: "../assets/楼盘实景-楼栋外立面.png", alt: "楼栋外立面实景" },
    { image: "../assets/楼盘实景-社区楼景.png", alt: "社区楼景实景" },
    { image: "../assets/楼盘实景-园林入口.png", alt: "园林入口实景" },
    { image: "../assets/楼盘实景-客厅样板间.png", alt: "样板间客厅实景" },
    { image: "../assets/楼盘实景-会所书吧.png", alt: "会所书吧实景" }
  ];

  const DISTRICT_CONTACT_PRESETS = {
    gaoxin: {
      developerName: "成都高新置业发展有限公司",
      developerPhone: "028-8512-6600",
      advisor: {
        name: "唐静怡",
        avatarText: "唐",
        role: "高级置业顾问",
        wechatId: "gaoxin_tangjy",
        phone: "13550081236"
      }
    },
    tianfu: {
      developerName: "成都天府新区城市发展集团",
      developerPhone: "028-6877-3200",
      advisor: {
        name: "周清妍",
        avatarText: "周",
        role: "置业服务顾问",
        wechatId: "tianfu_zhouqy",
        phone: "13608051228"
      }
    },
    wuhou: {
      developerName: "成都武侯城市更新建设有限公司",
      developerPhone: "028-8558-1988",
      advisor: {
        name: "冯嘉怡",
        avatarText: "冯",
        role: "资深置业顾问",
        wechatId: "wuhou_fengjy",
        phone: "13980561147"
      }
    },
    qingyang: {
      developerName: "成都青羊城市建设投资集团",
      developerPhone: "028-8621-3077",
      advisor: {
        name: "顾安宁",
        avatarText: "顾",
        role: "主城置业顾问",
        wechatId: "qingyang_guan",
        phone: "13881742265"
      }
    },
    jinjiang: {
      developerName: "成都锦江建设开发有限责任公司",
      developerPhone: "028-8447-9100",
      advisor: {
        name: "林悦",
        avatarText: "林",
        role: "金牌置业顾问",
        wechatId: "jinjiang_linyue",
        phone: "13709063518"
      }
    },
    chenghua: {
      developerName: "成都成华城市建设投资有限公司",
      developerPhone: "028-8411-5500",
      advisor: {
        name: "宋嘉禾",
        avatarText: "宋",
        role: "改善置业顾问",
        wechatId: "chenghua_songjh",
        phone: "13666192742"
      }
    }
  };

  function commonsFilePath(fileName) {
    return "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(fileName);
  }

  function getDistrictFromQuery(fallbackId) {
    const params = new URLSearchParams(window.location.search);
    const districtId = params.get("district");
    if (DISTRICT_MAP[districtId]) {
      return districtId;
    }

    return fallbackId || "";
  }

  function updateQuery(districtId) {
    if (!window.history || !window.history.replaceState) {
      return;
    }

    const url = new URL(window.location.href);
    if (districtId) {
      url.searchParams.set("district", districtId);
    } else {
      url.searchParams.delete("district");
    }
    window.history.replaceState({}, "", url.toString());
  }

  function bindHistoryBack(triggerEl, fallbackHref) {
    if (!triggerEl) {
      return;
    }

    if (fallbackHref && triggerEl.tagName === "A") {
      triggerEl.href = fallbackHref;
    }

    triggerEl.addEventListener("click", function (event) {
      if (window.history.length > 1) {
        event.preventDefault();
        window.history.back();
        return;
      }

      if (triggerEl.tagName !== "A" && fallbackHref) {
        window.location.href = fallbackHref;
      }
    });
  }

  function normalizeDialPhone(phone) {
    return String(phone || "").replace(/[^\d]/g, "");
  }

  function buildEstateDetailHref(districtId, projectIndex, routeState) {
    const params = new URLSearchParams();
    if (districtId) {
      params.set("district", districtId);
    }
    params.set("project", String(projectIndex));

    if (routeState) {
      ["source", "group", "item", "districtName"].forEach(function (key) {
        if (routeState[key] !== null && routeState[key] !== undefined && routeState[key] !== "") {
          params.set(key, routeState[key]);
        }
      });
    }

    return "./estate-detail.html?" + params.toString();
  }

  function renderEstateCard(district, project, projectIndex, routeState) {
    return '' +
      '<a class="estate-card estate-card--link" href="' + buildEstateDetailHref(district.id, projectIndex, routeState) + '">' +
        '<div class="estate-card__media" style="--thumb-start:' + district.palette.start + ";--thumb-end:" + district.palette.end + '">' +
          '<div class="estate-card__media-badge">' + project.badge + "</div>" +
          '<div class="estate-card__media-name">' + project.thumb + "</div>" +
        "</div>" +
        '<div class="estate-card__body">' +
          '<h3 class="estate-card__title">' + project.name + "</h3>" +
          '<p class="estate-card__meta">' + project.area + "</p>" +
          '<p class="estate-card__desc">' + project.desc + "</p>" +
          '<div class="tag-row">' + renderTags(project.tags, true) + "</div>" +
          '<div class="estate-card__footer">' +
            '<div class="price">' + project.price + '<small>元/㎡</small></div>' +
            '<div class="status-badge">' + project.stock + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="estate-card__arrow" aria-hidden="true">›</div>' +
      "</a>";
  }

  function getEstateDetailModel(district, project, projectIndex) {
    const heroPreset = ESTATE_DETAIL_HERO_PRESETS[projectIndex % ESTATE_DETAIL_HERO_PRESETS.length];
    const contactPreset = DISTRICT_CONTACT_PRESETS[district.id] || DISTRICT_CONTACT_PRESETS.gaoxin;
    const salesOffice = project.badge + "售楼部";

    return {
      hero: heroPreset,
      salesOffice: salesOffice,
      contact: contactPreset,
      infoItems: [
        { label: "参考单价", value: project.price + "元/㎡" },
        { label: "项目位置", value: project.area },
        { label: "所在板块", value: project.badge },
        { label: "产品标签", value: project.tags.join(" / ") },
        { label: "在售情况", value: project.stock },
        { label: "开发企业", value: contactPreset.developerName }
      ],
      highlightItems: [
        { title: "项目亮点", body: project.desc },
        { title: "板块价值", body: district.intro },
        { title: "到访咨询", body: "可联系 " + contactPreset.advisor.name + " 到 " + salesOffice + " 一对一了解在售房源与优惠情况。" }
      ]
    };
  }

  function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      const tempInput = document.createElement("input");
      tempInput.value = text;
      tempInput.setAttribute("readonly", "readonly");
      tempInput.style.position = "absolute";
      tempInput.style.left = "-9999px";
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.setSelectionRange(0, tempInput.value.length);

      try {
        if (document.execCommand("copy")) {
          resolve();
        } else {
          reject(new Error("copy failed"));
        }
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(tempInput);
      }
    });
  }

  function renderTags(list, neutral) {
    return list.map(function (item) {
      const className = neutral ? "tag tag--neutral" : "tag";
      return '<span class="' + className + '">' + item + "</span>";
    }).join("");
  }

  function setPageAccent(pageEl, district) {
    if (!pageEl || !district) {
      return;
    }

    document.body.style.setProperty("--district-accent", district.accent);
    document.body.style.setProperty("--district-accent-soft", district.accentSoft);
    document.body.style.setProperty("--district-logo-start", district.palette.start);
    document.body.style.setProperty("--district-logo-end", district.palette.end);
    pageEl.style.setProperty("--district-accent", district.accent);
    pageEl.style.setProperty("--district-accent-soft", district.accentSoft);
    pageEl.style.setProperty("--district-logo-start", district.palette.start);
    pageEl.style.setProperty("--district-logo-end", district.palette.end);
  }

  function renderCollectionFocusCard(district) {
    const active = function (targetId) {
      return targetId === district.id ? " is-active" : "";
    };

    return '' +
      '<div class="district-grid__expanded">' +
        '<div class="focus-card">' +
          '<div class="focus-card__header">' +
            '<div>' +
              '<h2 class="focus-card__title">' + district.name + "</h2>" +
              '<div class="focus-card__meta">' + district.location + "</div>" +
            "</div>" +
            '<a class="focus-card__link" href="./detail.html?district=' + district.id + '">进入专区</a>' +
          "</div>" +
          '<div class="city-map-panel" style="--marker-x:' + district.map.markerX + ";--marker-y:" + district.map.markerY + '">' +
            '<div class="city-map">' +
              '<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-label="成都区县地图">' +
                '<path class="city-map__outline" d="M45 70C63 39 100 26 136 33C171 40 201 63 210 99C220 136 206 180 172 202C134 228 79 217 51 184C28 154 25 103 45 70Z" />' +
                '<polygon class="city-map__region' + active("qingyang") + '" points="76,66 113,52 129,79 108,108 69,95" />' +
                '<text class="city-map__label' + active("qingyang") + '" x="90" y="84">青羊</text>' +
                '<polygon class="city-map__region' + active("jinjiang") + '" points="128,80 163,64 178,94 150,122 111,109" />' +
                '<text class="city-map__label' + active("jinjiang") + '" x="136" y="96">锦江</text>' +
                '<polygon class="city-map__region' + active("chenghua") + '" points="165,66 195,82 200,120 175,138 149,123 178,95" />' +
                '<text class="city-map__label' + active("chenghua") + '" x="166" y="103">成华</text>' +
                '<polygon class="city-map__region' + active("wuhou") + '" points="54,104 91,104 104,141 72,166 40,137" />' +
                '<text class="city-map__label' + active("wuhou") + '" x="59" y="134">武侯</text>' +
                '<polygon class="city-map__region' + active("gaoxin") + '" points="103,140 147,122 160,162 121,191 77,178" />' +
                '<text class="city-map__label' + active("gaoxin") + '" x="108" y="158">高新</text>' +
                '<polygon class="city-map__region' + active("tianfu") + '" points="159,162 189,151 206,191 169,214 121,191" />' +
                '<text class="city-map__label' + active("tianfu") + '" x="154" y="185">天府</text>' +
              "</svg>" +
              '<div class="map-callout">' +
                '<span class="map-callout__dot"></span>' +
                "<span>" + district.name + " · " + district.location + "</span>" +
              "</div>" +
            "</div>" +
          "</div>" +
          '<p class="focus-card__desc">' + district.intro + "</p>" +
        "</div>" +
      "</div>";
  }

  function initCollectionPage() {
    const pageEl = document.getElementById("collectionPage");
    const tabsEl = document.getElementById("districtTabs");
    const gridEl = document.getElementById("districtGrid");
    const selectionPanelEl = document.getElementById("selectionPanel");
    const districtCountEl = document.getElementById("districtCount");
    const focusNameEl = document.getElementById("focusName");
    const focusLocationEl = document.getElementById("focusLocation");
    const focusIntroEl = document.getElementById("focusIntro");
    const focusButtonEl = document.getElementById("focusButton");
    const mapPanelEl = document.getElementById("mapPanel");
    const mapCalloutTextEl = document.getElementById("mapCalloutText");
    let selectedDistrictId = getDistrictFromQuery("");

    function renderTabs() {
      tabsEl.innerHTML = DISTRICTS.map(function (district) {
        const activeClass = district.id === selectedDistrictId ? "filter-chip is-active" : "filter-chip";
        return '<button class="' + activeClass + '" type="button" data-id="' + district.id + '">' + district.name + "</button>";
      }).join("");
    }

    function renderGrid() {
      gridEl.innerHTML = DISTRICTS.map(function (district) {
        const activeClass = district.id === selectedDistrictId ? "district-card is-active" : "district-card";
        return '' +
          '<article class="' + activeClass + '" style="--district-logo-start:' + district.palette.start + ";--district-logo-end:" + district.palette.end + '">' +
            '<div class="district-card__head">' +
              '<div class="district-logo">' + district.shortName + "</div>" +
              "<div>" +
                '<div class="district-card__name">' + district.name + "</div>" +
                '<div class="district-card__location">' + district.location + "</div>" +
              "</div>" +
            "</div>" +
            '<p class="district-card__intro">' + district.intro + "</p>" +
          "</article>";
      }).join("");
    }

    function syncMap(district) {
      mapPanelEl.style.setProperty("--marker-x", district.map.markerX);
      mapPanelEl.style.setProperty("--marker-y", district.map.markerY);
      mapCalloutTextEl.textContent = district.name + " · " + district.location;

      document.querySelectorAll(".city-map__region").forEach(function (regionEl) {
        regionEl.classList.toggle("is-active", regionEl.getAttribute("data-district") === district.id);
      });

      document.querySelectorAll(".city-map__label").forEach(function (labelEl) {
        labelEl.classList.toggle("is-active", labelEl.getAttribute("data-label") === district.id);
      });
    }

    function renderFocus(district) {
      selectionPanelEl.classList.remove("is-hidden");
      setPageAccent(pageEl, district);
      focusNameEl.textContent = district.name;
      focusLocationEl.textContent = district.location;
      focusIntroEl.textContent = district.intro;
      focusButtonEl.href = "./detail.html?district=" + district.id;
      syncMap(district);
    }

    function clearFocus() {
      selectionPanelEl.classList.add("is-hidden");
    }

    function selectDistrict(districtId) {
      const district = DISTRICT_MAP[districtId];
      if (!district) {
        return;
      }

      selectedDistrictId = districtId;
      updateQuery(districtId);
      renderTabs();
      renderGrid();
      renderFocus(district);
    }

    districtCountEl.textContent = DISTRICTS.length + "个区县";

    tabsEl.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-id]");
      if (button) {
        selectDistrict(button.getAttribute("data-id"));
      }
    });

    renderTabs();
    renderGrid();

    if (selectedDistrictId) {
      renderFocus(DISTRICT_MAP[selectedDistrictId]);
    } else {
      clearFocus();
    }
  }

  function initCollectionPageV2() {
    const pageEl = document.getElementById("collectionPage");
    const collectionBackButton = document.getElementById("collectionBackButton");
    const searchInputEl = document.getElementById("districtSearchInput");
    const gridEl = document.getElementById("districtGrid");
    const districtCountEl = document.getElementById("districtCount");
    const defaultDistrict = DISTRICT_MAP[LOCATED_DISTRICT_ID];
    let selectedDistrictId = getDistrictFromQuery("");
    let keyword = "";

    function getFilteredDistricts() {
      if (!keyword) {
        return DISTRICTS;
      }

      return DISTRICTS.filter(function (district) {
        const source = [
          district.name,
          district.shortName,
          district.location,
          district.intro,
          district.features.join(" ")
        ].join(" ").toLowerCase();

        return source.indexOf(keyword) > -1;
      });
    }

    function renderGrid() {
      const filteredDistricts = getFilteredDistricts();
      const hasSelectedDistrict = filteredDistricts.some(function (district) {
        return district.id === selectedDistrictId;
      });

      setPageAccent(pageEl, hasSelectedDistrict && selectedDistrictId ? DISTRICT_MAP[selectedDistrictId] : defaultDistrict);
      districtCountEl.textContent = filteredDistricts.length + "个区县";

      if (!filteredDistricts.length) {
        gridEl.innerHTML = '<div class="district-empty">未找到相关区县</div>';
        return;
      }

      gridEl.innerHTML = filteredDistricts.map(function (district) {
        const activeClass = district.id === selectedDistrictId ? "district-card is-active" : "district-card";
        const cardHtml = '' +
          '<button class="' + activeClass + '" type="button" data-id="' + district.id + '" style="--district-logo-start:' + district.palette.start + ";--district-logo-end:" + district.palette.end + '">' +
            '<div class="district-card__head">' +
              '<div class="district-logo">' + district.shortName + "</div>" +
              "<div>" +
                '<div class="district-card__name">' + district.name + "</div>" +
                '<div class="district-card__location">' + district.location + "</div>" +
              "</div>" +
            "</div>" +
            '<p class="district-card__intro">' + district.intro + "</p>" +
          "</button>";

        if (hasSelectedDistrict && district.id === selectedDistrictId) {
          return cardHtml + renderCollectionFocusCard(district);
        }

        return cardHtml;
      }).join("");
    }

    function selectDistrict(districtId) {
      if (selectedDistrictId === districtId) {
        selectedDistrictId = "";
        updateQuery("");
        setPageAccent(pageEl, defaultDistrict);
        renderGrid();
        return;
      }

      if (DISTRICT_MAP[districtId]) {
        selectedDistrictId = districtId;
        updateQuery(districtId);
        setPageAccent(pageEl, DISTRICT_MAP[districtId]);
        renderGrid();
      }
    }

    gridEl.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-id]");
      if (button) {
        selectDistrict(button.getAttribute("data-id"));
      }
    });

    if (searchInputEl) {
      searchInputEl.addEventListener("input", function (event) {
        keyword = event.target.value.trim().toLowerCase();
        renderGrid();
      });
    }

    setPageAccent(pageEl, selectedDistrictId ? DISTRICT_MAP[selectedDistrictId] : defaultDistrict);
    bindHistoryBack(collectionBackButton, "../房产超市_住进成都.html");
    renderGrid();
  }

  function initDetailPage() {
    const pageEl = document.getElementById("detailPage");
    const district = DISTRICT_MAP[getDistrictFromQuery(LOCATED_DISTRICT_ID)];
    const params = new URLSearchParams(window.location.search);
    const source = params.get("source");
    const groupIndex = params.get("group");
    const itemIndex = params.get("item");
    const districtName = params.get("districtName");
    const backLinkEl = document.getElementById("backLink");
    const detailTopTitleEl = document.getElementById("detailTopTitle");
    const detailLogoEl = document.getElementById("detailLogo");
    const detailLocationEl = document.getElementById("detailLocation");
    const detailNameEl = document.getElementById("detailName");
    const detailFocusEl = document.getElementById("detailFocus");
    const advantagesListEl = document.getElementById("advantagesList");
    const serviceGridEl = document.getElementById("serviceGrid");
    const videoRailEl = document.getElementById("videoRail");
    const projectListEl = document.getElementById("projectList");
    const projectFilterBarEl = document.getElementById("projectFilterBar");
    const videoCountEl = document.getElementById("videoCount");
    const projectCountEl = document.getElementById("projectCount");
    const estateDetailRouteState = {
      source: source || "",
      group: groupIndex,
      item: itemIndex,
      districtName: districtName || ""
    };
    let selectedProjectBoard = "";
    let backHref = "./index.html?district=" + district.id;

    setPageAccent(pageEl, district);
    if (source === "activity" && groupIndex !== null && itemIndex !== null) {
      const backParams = new URLSearchParams();
      backParams.set("screen", "activity");
      backParams.set("group", groupIndex);
      backParams.set("item", itemIndex);
      if (districtName) {
        backParams.set("districtName", districtName);
      }
      backHref = "../房产超市_住进成都.html?" + backParams.toString();
    }
    bindHistoryBack(backLinkEl, backHref);
    detailTopTitleEl.textContent = district.name + "专区";
    document.title = district.name + "专区";
    detailLogoEl.textContent = district.shortName;
    detailLogoEl.style.setProperty("--district-logo-start", district.palette.start);
    detailLogoEl.style.setProperty("--district-logo-end", district.palette.end);
    detailLocationEl.textContent = district.location;
    detailNameEl.textContent = district.name;
    detailFocusEl.textContent = district.focus;
    videoCountEl.textContent = district.videos.length + "条";
    projectCountEl.textContent = district.projects.length + "个";

    advantagesListEl.innerHTML = district.advantages.map(function (item) {
      return '' +
        '<article class="advantage-card">' +
          '<h3 class="advantage-card__title">' + item.title + "</h3>" +
        "</article>";
    }).join("");

    serviceGridEl.innerHTML = district.services.map(function (service) {
      return '' +
        '<article class="service-card" id="' + service.id + '">' +
          '<div class="service-card__top">' +
            '<h3 class="service-card__title">' + service.title + "</h3>" +
            '<a class="service-card__action" href="#' + service.id + '">' + service.action + "</a>" +
          "</div>" +
          '<p class="service-card__desc">' + service.desc + "</p>" +
          '<div class="service-list">' +
            service.items.map(function (item) {
              return '<div class="service-list__item">' + item + "</div>";
            }).join("") +
          "</div>" +
        "</article>";
    }).join("");

    const videoCoverList = DISTRICT_VIDEO_COVER_PRESETS[district.id] || [];
    videoRailEl.innerHTML = district.videos.map(function (video, index) {
      const start = index % 2 === 0 ? district.palette.start : district.palette.end;
      const end = index % 2 === 0 ? district.palette.end : district.accent;
      const cover = videoCoverList.length ? videoCoverList[index % videoCoverList.length] : null;
      return '' +
        '<article class="video-card" style="--video-start:' + start + ";--video-end:" + end + '">' +
          '<div class="video-card__cover">' +
            (cover ? '<img class="video-card__image" src="' + cover.image + '" alt="' + cover.alt + '" loading="lazy" decoding="async" referrerpolicy="no-referrer" />' : "") +
            '<div class="video-card__district">' + district.name + "</div>" +
            '<div class="video-card__play" aria-hidden="true"></div>' +
            '<h3 class="video-card__title">' + video.title + "</h3>" +
          "</div>" +
          '<div class="video-card__body">' +
            '<div class="video-card__meta">' + video.meta + "</div>" +
            '<div class="video-card__duration">' + video.duration + "</div>" +
          "</div>" +
        "</article>";
    }).join("");

    projectListEl.innerHTML = district.projects.map(function (project, projectIndex) {
      return renderEstateCard(district, project, projectIndex, estateDetailRouteState);
    }).join("");

    function getProjectBoards() {
      return district.projects.reduce(function (boards, project) {
        if (project.badge && boards.indexOf(project.badge) === -1) {
          boards.push(project.badge);
        }
        return boards;
      }, []);
    }

    function getFilteredProjects() {
      return district.projects.map(function (project, projectIndex) {
        return {
          project: project,
          projectIndex: projectIndex
        };
      }).filter(function (entry) {
        if (!selectedProjectBoard) {
          return true;
        }

        return entry.project.badge === selectedProjectBoard;
      });
    }

    function renderProjectFilters() {
      const boards = getProjectBoards();
      const items = [
        '<button class="filter-chip' + (selectedProjectBoard ? "" : " is-active") + '" type="button" data-board="">全部板块</button>'
      ];

      boards.forEach(function (board) {
        const activeClass = board === selectedProjectBoard ? "filter-chip is-active" : "filter-chip";
        items.push('<button class="' + activeClass + '" type="button" data-board="' + board + '">' + board + "</button>");
      });

      projectFilterBarEl.innerHTML = items.join("");
    }

    function renderProjects() {
      const filteredProjects = getFilteredProjects();
      projectCountEl.textContent = filteredProjects.length + "个";

      if (!filteredProjects.length) {
        projectListEl.innerHTML = '<div class="list-empty">当前板块暂无楼盘</div>';
        return;
      }

      projectListEl.innerHTML = filteredProjects.map(function (entry) {
        return renderEstateCard(district, entry.project, entry.projectIndex, estateDetailRouteState);
      }).join("");
    }

    projectFilterBarEl.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-board]");
      if (!button) {
        return;
      }

      selectedProjectBoard = button.getAttribute("data-board") || "";
      renderProjectFilters();
      renderProjects();
    });

    renderProjectFilters();
    renderProjects();
  }

  function initEstateDetailPage() {
    const pageEl = document.getElementById("estateDetailPage");
    if (!pageEl) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const district = DISTRICT_MAP[getDistrictFromQuery(LOCATED_DISTRICT_ID)];
    const source = params.get("source");
    const groupIndex = params.get("group");
    const itemIndex = params.get("item");
    const districtName = params.get("districtName");
    const maxProjectIndex = Math.max(0, district.projects.length - 1);
    const projectIndex = Math.min(maxProjectIndex, Math.max(0, Number(params.get("project")) || 0));
    const project = district.projects[projectIndex];
    const model = getEstateDetailModel(district, project, projectIndex);
    const backLinkEl = document.getElementById("estateBackLink");
    const estateHeroImageEl = document.getElementById("estateHeroImage");
    const estateHeroMetaEl = document.getElementById("estateHeroMeta");
    const estateTitleEl = document.getElementById("estateTitle");
    const estateDistrictEl = document.getElementById("estateDistrict");
    const estateSalesOfficeEl = document.getElementById("estateSalesOffice");
    const estateTagRowEl = document.getElementById("estateTagRow");
    const estatePriceTextEl = document.getElementById("estatePriceText");
    const estateStockTextEl = document.getElementById("estateStockText");
    const estateBasicListEl = document.getElementById("estateBasicList");
    const estateHighlightListEl = document.getElementById("estateHighlightList");
    const openProjectQrButtonEl = document.getElementById("openProjectQrButton");
    const contactAdvisorButtonEl = document.getElementById("contactAdvisorButton");
    const contactDeveloperButtonEl = document.getElementById("contactDeveloperButton");
    const developerPhoneTextEl = document.getElementById("developerPhoneText");
    const developerNameTextEl = document.getElementById("developerNameText");
    const projectQrSheetEl = document.getElementById("projectQrSheet");
    const projectQrSheetBackdropEl = document.getElementById("projectQrSheetBackdrop");
    const projectQrSheetCloseEl = document.getElementById("projectQrSheetClose");
    const projectQrTitleEl = document.getElementById("projectQrTitle");
    const projectQrMetaEl = document.getElementById("projectQrMeta");
    const advisorSheetEl = document.getElementById("advisorSheet");
    const advisorSheetBackdropEl = document.getElementById("advisorSheetBackdrop");
    const advisorSheetCloseEl = document.getElementById("advisorSheetClose");
    const advisorAvatarEl = document.getElementById("advisorAvatar");
    const advisorNameEl = document.getElementById("advisorName");
    const saveAdvisorQrButtonEl = document.getElementById("saveAdvisorQrButton");
    const advisorQrGraphicEl = document.getElementById("advisorQrGraphic");
    const advisorWechatIdEl = document.getElementById("advisorWechatId");
    const copyWechatButtonEl = document.getElementById("copyWechatButton");
    const callAdvisorButtonEl = document.getElementById("callAdvisorButton");
    const advisorSheetTipEl = document.getElementById("advisorSheetTip");
    let backHref = "./detail.html?district=" + district.id;

    if (source === "activity" && groupIndex !== null && itemIndex !== null) {
      const backParams = new URLSearchParams();
      backParams.set("district", district.id);
      backParams.set("source", source);
      backParams.set("group", groupIndex);
      backParams.set("item", itemIndex);
      if (districtName) {
        backParams.set("districtName", districtName);
      }
      backHref = "./detail.html?" + backParams.toString();
    }

    setPageAccent(pageEl, district);
    bindHistoryBack(backLinkEl, backHref);
    document.title = project.name;

    estateHeroImageEl.src = model.hero.image;
    estateHeroImageEl.alt = project.name + model.hero.alt;
    estateHeroMetaEl.textContent = model.salesOffice;
    estateTitleEl.textContent = project.name;
    estateDistrictEl.textContent = district.name;
    estateSalesOfficeEl.textContent = model.salesOffice;
    estateTagRowEl.innerHTML = renderTags([project.badge].concat(project.tags).slice(0, 3), true);
    estatePriceTextEl.textContent = project.price + "元/㎡";
    estateStockTextEl.textContent = project.stock;
    developerPhoneTextEl.textContent = model.contact.developerPhone + " · 售楼部热线";
    developerNameTextEl.textContent = model.contact.developerName;

    const basicInfoItems = [
      { label: "项目位置", value: project.area },
      { label: "所在板块", value: project.badge },
      { label: "售楼部", value: model.salesOffice },
      { label: "产品标签", value: project.tags.join(" / ") },
      { label: "开发企业", value: model.contact.developerName }
    ];

    estateBasicListEl.innerHTML = basicInfoItems.map(function (item) {
      return '' +
        '<div class="estate-info-row">' +
          '<div class="estate-info-row__label">' + item.label + "</div>" +
          '<div class="estate-info-row__value">' + item.value + "</div>" +
        "</div>";
    }).join("");

    estateHighlightListEl.innerHTML = model.highlightItems.map(function (item) {
      return '' +
        '<article class="estate-highlight-card">' +
          '<h3 class="estate-highlight-card__title">' + item.title + "</h3>" +
          '<p class="estate-highlight-card__desc">' + item.body + "</p>" +
        "</article>";
    }).join("");

    contactDeveloperButtonEl.href = "tel:" + normalizeDialPhone(model.contact.developerPhone);
    contactDeveloperButtonEl.setAttribute("aria-label", "联系开发企业");
    advisorAvatarEl.textContent = model.contact.advisor.avatarText || model.contact.advisor.name.slice(0, 1);
    advisorNameEl.textContent = model.contact.advisor.name;
    advisorWechatIdEl.textContent = model.contact.advisor.wechatId;
    callAdvisorButtonEl.href = "tel:" + normalizeDialPhone(model.contact.advisor.phone);
    projectQrTitleEl.textContent = project.name;
    projectQrMetaEl.textContent = district.name + " · 微信扫码查看楼盘详情";

    function setAdvisorSheetTip(text, state) {
      advisorSheetTipEl.textContent = text || "";
      advisorSheetTipEl.dataset.state = state || "";
    }

    function openProjectQrSheet() {
      advisorSheetEl.hidden = true;
      projectQrSheetEl.hidden = false;
      document.body.classList.add("is-sheet-open");
    }

    function closeProjectQrSheet() {
      projectQrSheetEl.hidden = true;
      document.body.classList.remove("is-sheet-open");
    }

    function openAdvisorSheet() {
      projectQrSheetEl.hidden = true;
      advisorSheetEl.hidden = false;
      document.body.classList.add("is-sheet-open");
      setAdvisorSheetTip("可点击保存二维码、复制微信号或直接电话咨询。", "");
    }

    function closeAdvisorSheet() {
      advisorSheetEl.hidden = true;
      document.body.classList.remove("is-sheet-open");
    }

    openProjectQrButtonEl.addEventListener("click", function () {
      openProjectQrSheet();
    });

    projectQrSheetBackdropEl.addEventListener("click", function () {
      closeProjectQrSheet();
    });

    projectQrSheetCloseEl.addEventListener("click", function () {
      closeProjectQrSheet();
    });

    contactAdvisorButtonEl.addEventListener("click", function () {
      openAdvisorSheet();
    });

    advisorSheetBackdropEl.addEventListener("click", function () {
      closeAdvisorSheet();
    });

    advisorSheetCloseEl.addEventListener("click", function () {
      closeAdvisorSheet();
    });

    copyWechatButtonEl.addEventListener("click", function () {
      copyTextToClipboard(model.contact.advisor.wechatId).then(function () {
        setAdvisorSheetTip("已复制微信号：" + model.contact.advisor.wechatId, "success");
      }).catch(function () {
        setAdvisorSheetTip("复制失败，请手动记录微信号：" + model.contact.advisor.wechatId, "error");
      });
    });

    if (saveAdvisorQrButtonEl && advisorQrGraphicEl) {
      saveAdvisorQrButtonEl.addEventListener("click", function () {
        try {
          const qrDataUrl = extractBackgroundImageUrl(window.getComputedStyle(advisorQrGraphicEl).backgroundImage);
          downloadDataUrl(qrDataUrl, model.contact.advisor.name + "-微信二维码.svg");
          setAdvisorSheetTip("二维码已开始保存，请在本地文件中查看。", "success");
        } catch (error) {
          setAdvisorSheetTip("保存失败，请稍后重试。", "error");
        }
      });
    }
  }

  function extractBackgroundImageUrl(value) {
    const match = String(value || "").match(/url\((['"]?)(.*?)\1\)/);
    return match ? match[2] : "";
  }

  function downloadDataUrl(dataUrl, fileName) {
    if (!dataUrl) {
      throw new Error("missing data url");
    }
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (document.body.dataset.page === "collection") {
    initCollectionPageV2();
  }

  if (document.body.dataset.page === "detail") {
    initDetailPage();
  }

  if (document.body.dataset.page === "estate-detail") {
    initEstateDetailPage();
  }
}());
