    const districtGroups = [
      { name: "城市新区", districts: ["四川天府新区", "成都东部新区", "成都高新区"] },
      {
        name: "中心城区",
        districts: [
          "锦江区", "青羊区", "金牛区", "武侯区", "成华区", "龙泉驿区",
          "青白江区", "新都区", "温江区", "双流区", "郫都区", "新津区"
        ]
      },
      {
        name: "县市新城",
        districts: [
          "简阳市", "都江堰市", "彭州市", "邛崃市",
          "崇州市", "金堂县", "大邑县", "蒲江县"
        ]
      }
    ];

    const policySupportDimensions = [
      "人才购房支持", "就学支持", "购房补贴支持", "购房消费券支持", "以旧换新支持",
      "交通优惠支持", "车位购买支持", "房票购房支持", "房票安置支持",
      "公房承租人购买新建商品住房补贴支持"
    ];

    const defaultPolicies = (district) => [
      {
        title: `${district}人才安居购房支持办法`,
        tags: ["人才购房支持", "就学支持"],
        start: "2026-03-01",
        end: "2027-02-28"
      },
      {
        title: `${district}促进住房消费若干措施`,
        tags: ["以旧换新支持", "交通优惠支持"],
        start: "2026-03-01",
        end: "2027-02-28"
      }
    ];

    const specialPolicies = {
      "四川天府新区": defaultPolicies("四川天府新区"),
      "成都东部新区": [
        { title: "成都东部新区人才购房支持办法", tags: ["人才购房支持", "就学支持"], start: "2026-01-08", end: "2029-01-08" },
        { title: "成都东部新区促进住房消费若干措施", tags: ["以旧换新支持", "交通优惠支持"], start: "2026-05-01", end: "2027-04-30" }
      ],
      "成华区": [
        { title: "成华区人才安居购房支持办法", tags: ["人才购房支持", "就学支持"], start: "2026-12-12", end: "2027-12-12" },
        { title: "成华区促进住房消费若干措施", tags: ["以旧换新支持", "交通优惠支持"], start: "2026-12-12", end: "2027-12-12" }
      ],
      "龙泉驿区": [
        { title: "龙泉驿区购房补贴措施", tags: ["购房补贴支持", "车位购买支持"], start: "2026-02-13", end: "2026-12-31" },
        defaultPolicies("龙泉驿区")[1]
      ],
      "青白江区": [
        { title: "关于2026年青白江区发放购房消费券", tags: ["购房消费券支持", "购房补贴支持"], start: "2026-01-01", end: "2026-12-31" },
        defaultPolicies("青白江区")[0]
      ],
      "简阳市": [
        { title: "简阳市房票购房支持政策", tags: ["房票购房支持", "房票安置支持"], start: "2026-03-31", end: "2028-03-30" },
        defaultPolicies("简阳市")[1]
      ],
      "彭州市": [
        { title: "彭州市购房补贴措施", tags: ["购房补贴支持", "车位购买支持"], start: "2026-01-04", end: "2027-01-03" },
        defaultPolicies("彭州市")[0]
      ]
    };

    const districtOrder = districtGroups.flatMap((group) => group.districts);
    const policiesByDistrict = Object.fromEntries(
      districtOrder.map((district) => [district, specialPolicies[district] || defaultPolicies(district)])
    );


window.policyCatalog = { districtGroups, policySupportDimensions, districtOrder, policiesByDistrict };
