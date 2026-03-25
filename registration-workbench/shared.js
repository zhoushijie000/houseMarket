(() => {
  const STORAGE_KEY = "houseMarket.registrationWorkbench.v2";
  const LEGACY_STORAGE_KEY = "houseMarket.registrationWorkbench.v1";
  const LOCAL_EVENT = "registration-workbench:changed";

  const FIELD_TYPES = {
    text: { label: "单行输入" },
    phone: { label: "手机号" },
    "single-select": { label: "单选" },
    "multi-select": { label: "多选" },
    textarea: { label: "多行文本" }
  };

  const RECORD_STATUS_MAP = {
    new: { label: "待跟进" },
    pushed: { label: "已推送" },
    contacted: { label: "已联系" }
  };

  const FORM_STATUS_MAP = {
    upcoming: { label: "未开始", tone: "upcoming" },
    active: { label: "进行中", tone: "active" },
    expired: { label: "已结束", tone: "expired" }
  };

  const PUSH_CHANNELS = [
    { value: "站内消息", label: "站内消息" },
    { value: "短信提醒", label: "短信提醒" },
    { value: "顾问回访", label: "顾问回访" }
  ];

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const pad = (value) => String(value).padStart(2, "0");
  const randomId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
  const nowIso = () => new Date().toISOString();

  const createIsoAtOffset = (offsetDays, hour, minute) => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
  };

  const formatDateTime = (value) => {
    if (!value) {
      return "未设置";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const formatDateRange = (start, end) => `${formatDateTime(start)} 至 ${formatDateTime(end)}`;

  const toDatetimeLocalValue = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const normalizeOptions = (options) => {
    if (Array.isArray(options)) {
      return options.map((item) => String(item).trim()).filter(Boolean);
    }

    if (!options) {
      return [];
    }

    return String(options)
      .split(/[\n,，]/)
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const createField = (overrides = {}) => {
    const type = FIELD_TYPES[overrides.type] ? overrides.type : "text";

    return {
      id: overrides.id || randomId("field"),
      label: overrides.label || "新字段",
      type,
      required: Boolean(overrides.required),
      filterable: overrides.filterable !== false,
      listable: overrides.listable !== false,
      placeholder: overrides.placeholder || "",
      hint: overrides.hint || "",
      options: normalizeOptions(overrides.options)
    };
  };

  const createStarterFields = () => [
    createField({
      id: "name",
      label: "登记姓名",
      type: "text",
      required: false,
      filterable: false,
      listable: true,
      placeholder: "请输入姓名",
      hint: "便于顾问联系时准确称呼"
    }),
    createField({
      id: "mobile",
      label: "手机号",
      type: "phone",
      required: true,
      filterable: true,
      listable: true,
      placeholder: "请输入接收通知的手机号",
      hint: "用于接收活动提醒、楼盘动态与顾问回访"
    }),
    createField({
      id: "remark",
      label: "补充说明",
      type: "textarea",
      required: false,
      filterable: true,
      listable: false,
      placeholder: "请输入您的补充需求",
      hint: "可填写预算、通勤、户型等个性化要求"
    })
  ];

  const buildMiniProgramPath = (formId) => `pages/house-market/registration/index?formId=${encodeURIComponent(formId)}`;
  const buildQrLandingUrl = (formId) =>
    `https://housemarket.example.com/mp-entry?formId=${encodeURIComponent(formId)}`;
  const getQrImageUrl = (formId) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(buildQrLandingUrl(formId))}`;

  const createForm = (overrides = {}) => {
    const id = overrides.id || randomId("form");
    const name = overrides.name || "新登记表单";
    const page = overrides.page && typeof overrides.page === "object" ? overrides.page : {};
    const fields =
      Array.isArray(overrides.fields) && overrides.fields.length
        ? overrides.fields.map((field) => createField(field))
        : createStarterFields();

    return {
      id,
      name,
      activityName: overrides.activityName || "",
      registrationStart: overrides.registrationStart || createIsoAtOffset(0, 9, 0),
      registrationEnd: overrides.registrationEnd || createIsoAtOffset(14, 23, 59),
      page: {
        title: page.title || name,
        prompt: page.prompt || "请完善登记信息，我们会根据您的登记内容匹配房源、专场活动与顾问服务。"
      },
      fields,
      createdAt: overrides.createdAt || nowIso(),
      createdBy: overrides.createdBy || "周世杰",
      miniProgramPath: overrides.miniProgramPath || buildMiniProgramPath(id),
      qrLandingUrl: overrides.qrLandingUrl || buildQrLandingUrl(id)
    };
  };

  const createBlankForm = () =>
    createForm({
      name: "新登记表单",
      page: {
        title: "新登记表单",
        prompt: "请填写登记信息，提交后系统将匹配房源与运营活动。"
      },
      fields: createStarterFields()
    });

  const createRecord = (overrides = {}) => ({
    id: overrides.id || randomId("lead"),
    formId: overrides.formId || "",
    createdAt: overrides.createdAt || nowIso(),
    status: RECORD_STATUS_MAP[overrides.status] ? overrides.status : "new",
    pushCount: Number.isFinite(overrides.pushCount) ? overrides.pushCount : 0,
    lastPushAt: overrides.lastPushAt || "",
    lastPushChannel: overrides.lastPushChannel || "",
    lastPushTitle: overrides.lastPushTitle || "",
    data: overrides.data && typeof overrides.data === "object" ? overrides.data : {}
  });

  const createPushHistory = (overrides = {}) => ({
    id: overrides.id || randomId("push"),
    createdAt: overrides.createdAt || nowIso(),
    channel: overrides.channel || PUSH_CHANNELS[0].value,
    title: overrides.title || "",
    content: overrides.content || "",
    targetIds: Array.isArray(overrides.targetIds) ? overrides.targetIds : [],
    filterSummary: overrides.filterSummary || "全部登记用户"
  });

  const createDefaultState = () => {
    const formIntent = createForm({
      id: "form-intent-chengdu",
      name: "购房意向登记",
      registrationStart: createIsoAtOffset(-2, 9, 0),
      registrationEnd: createIsoAtOffset(16, 22, 0),
      page: {
        title: "成都房产超市购房意向登记",
        prompt: "请填写预算、意向区域和置业目的。\n系统将为您匹配合适的房源、专场活动与顾问服务。"
      },
      fields: [
        createField({
          id: "name",
          label: "登记姓名",
          type: "text",
          required: false,
          filterable: false,
          listable: true,
          placeholder: "请输入姓名"
        }),
        createField({
          id: "mobile",
          label: "手机号",
          type: "phone",
          required: true,
          filterable: true,
          listable: true,
          placeholder: "请输入接收通知的手机号",
          hint: "用于接收活动提醒与顾问回访"
        }),
        createField({
          id: "budget",
          label: "预算范围",
          type: "single-select",
          required: true,
          filterable: true,
          listable: true,
          options: ["200万以内", "200-350万", "350-500万", "500万以上"]
        }),
        createField({
          id: "district",
          label: "意向区域",
          type: "multi-select",
          required: true,
          filterable: true,
          listable: true,
          options: ["高新区", "天府新区", "锦江区", "成华区", "龙泉驿区"]
        }),
        createField({
          id: "purpose",
          label: "置业目的",
          type: "single-select",
          required: true,
          filterable: true,
          listable: true,
          options: ["首次置业", "改善换房", "教育置业", "资产配置"]
        }),
        createField({
          id: "remark",
          label: "补充说明",
          type: "textarea",
          required: false,
          filterable: true,
          listable: false,
          placeholder: "请输入补充需求"
        })
      ]
    });

    const formTalent = createForm({
      id: "form-talent-housing",
      name: "人才安居专场登记",
      activityName: "2026 春季人才安居专场",
      registrationStart: createIsoAtOffset(-1, 10, 0),
      registrationEnd: createIsoAtOffset(9, 20, 30),
      page: {
        title: "人才安居专场登记",
        prompt: "本表单用于收集人才安居专场意向客户。\n提交后将安排政策顾问一对一跟进。"
      },
      fields: [
        createField({
          id: "name",
          label: "登记姓名",
          type: "text",
          required: true,
          filterable: false,
          listable: true,
          placeholder: "请输入姓名"
        }),
        createField({
          id: "mobile",
          label: "手机号",
          type: "phone",
          required: true,
          filterable: true,
          listable: true,
          placeholder: "请输入手机号"
        }),
        createField({
          id: "company",
          label: "工作单位",
          type: "text",
          required: true,
          filterable: true,
          listable: true,
          placeholder: "请输入工作单位"
        }),
        createField({
          id: "talentLevel",
          label: "人才资格",
          type: "single-select",
          required: true,
          filterable: true,
          listable: true,
          options: ["A 类人才", "B 类人才", "C 类人才", "普通人才"]
        }),
        createField({
          id: "district",
          label: "意向区域",
          type: "single-select",
          required: true,
          filterable: true,
          listable: true,
          options: ["高新区", "天府新区", "成华区", "青羊区"]
        }),
        createField({
          id: "remark",
          label: "补充说明",
          type: "textarea",
          required: false,
          filterable: true,
          listable: false,
          placeholder: "请输入补充说明"
        })
      ]
    });

    const formLive = createForm({
      id: "form-live-openhouse",
      name: "特价好房直播预约",
      activityName: "周末直播专场",
      registrationStart: createIsoAtOffset(2, 12, 0),
      registrationEnd: createIsoAtOffset(15, 19, 0),
      page: {
        title: "特价好房直播预约登记",
        prompt: "预约直播专场后，可在直播前收到场次提醒与好房清单。\n请确保手机号真实有效。"
      },
      fields: [
        createField({
          id: "name",
          label: "登记姓名",
          type: "text",
          required: false,
          filterable: false,
          listable: true
        }),
        createField({
          id: "mobile",
          label: "手机号",
          type: "phone",
          required: true,
          filterable: true,
          listable: true
        }),
        createField({
          id: "session",
          label: "直播场次",
          type: "single-select",
          required: true,
          filterable: true,
          listable: true,
          options: ["周六 19:30", "周日 15:00"]
        }),
        createField({
          id: "budget",
          label: "预算范围",
          type: "single-select",
          required: false,
          filterable: true,
          listable: true,
          options: ["200万以内", "200-350万", "350-500万", "500万以上"]
        }),
        createField({
          id: "attendMode",
          label: "参与方式",
          type: "single-select",
          required: true,
          filterable: true,
          listable: true,
          options: ["仅看直播", "直播后预约到访"]
        }),
        createField({
          id: "remark",
          label: "补充说明",
          type: "textarea",
          required: false,
          filterable: true,
          listable: false
        })
      ]
    });

    return {
      forms: [formIntent, formTalent, formLive],
      records: [
        createRecord({
          id: "lead-001",
          formId: formIntent.id,
          createdAt: createIsoAtOffset(0, 10, 18),
          status: "new",
          data: {
            name: "周先生",
            mobile: "13800138001",
            budget: "200-350万",
            district: ["天府新区", "高新区"],
            purpose: "首次置业",
            remark: "优先考虑地铁沿线三房"
          }
        }),
        createRecord({
          id: "lead-002",
          formId: formIntent.id,
          createdAt: createIsoAtOffset(-1, 16, 42),
          status: "pushed",
          pushCount: 1,
          lastPushAt: createIsoAtOffset(-1, 18, 10),
          lastPushChannel: "站内消息",
          lastPushTitle: "天府新区新上房源",
          data: {
            name: "李女士",
            mobile: "13900139002",
            budget: "350-500万",
            district: ["锦江区"],
            purpose: "改善换房",
            remark: "关注主城改善项目"
          }
        }),
        createRecord({
          id: "lead-003",
          formId: formTalent.id,
          createdAt: createIsoAtOffset(-2, 15, 5),
          status: "contacted",
          pushCount: 2,
          lastPushAt: createIsoAtOffset(-1, 9, 30),
          lastPushChannel: "顾问回访",
          lastPushTitle: "人才政策核验提醒",
          data: {
            name: "陈先生",
            mobile: "13700137003",
            company: "成都高新科技有限公司",
            talentLevel: "B 类人才",
            district: "高新区",
            remark: "希望政策顾问先电话沟通"
          }
        }),
        createRecord({
          id: "lead-004",
          formId: formTalent.id,
          createdAt: createIsoAtOffset(-3, 11, 24),
          status: "new",
          data: {
            name: "王女士",
            mobile: "13600136004",
            company: "天府软件园企业",
            talentLevel: "普通人才",
            district: "天府新区",
            remark: "希望了解首套房资格"
          }
        }),
        createRecord({
          id: "lead-005",
          formId: formLive.id,
          createdAt: createIsoAtOffset(-1, 20, 20),
          status: "new",
          data: {
            name: "宋女士",
            mobile: "13500135005",
            session: "周六 19:30",
            budget: "200-350万",
            attendMode: "直播后预约到访",
            remark: "直播后希望安排周日看房"
          }
        })
      ],
      pushHistory: [
        createPushHistory({
          id: "push-demo-001",
          createdAt: createIsoAtOffset(-1, 18, 10),
          channel: "站内消息",
          title: "天府新区新上房源",
          content: "根据您的预算和区域偏好，已为您匹配 3 个重点楼盘，可回复预约看房。",
          targetIds: ["lead-001", "lead-002"],
          filterSummary: "表单：购房意向登记；预算范围：200-350万；意向区域：天府新区"
        })
      ]
    };
  };

  const migrateLegacyState = (rawState) => {
    if (!rawState || typeof rawState !== "object" || Array.isArray(rawState) || Array.isArray(rawState.forms)) {
      return rawState;
    }

    if (!Array.isArray(rawState.fields) || !rawState.fields.length) {
      return rawState;
    }

    const migratedForm = createForm({
      id: "form-migrated-default",
      name: rawState.meta && rawState.meta.title ? rawState.meta.title : "迁移登记表单",
      registrationStart: createIsoAtOffset(-1, 0, 0),
      registrationEnd: createIsoAtOffset(30, 23, 59),
      page: {
        title: rawState.meta && rawState.meta.title ? rawState.meta.title : "迁移登记表单",
        prompt:
          rawState.meta && rawState.meta.subtitle
            ? rawState.meta.subtitle
            : "原有单登记页配置已迁移到新的多表单管理结构中。"
      },
      fields: rawState.fields
    });

    return {
      forms: [migratedForm],
      records: Array.isArray(rawState.records)
        ? rawState.records.map((record) => ({
            ...record,
            formId: migratedForm.id
          }))
        : [],
      pushHistory: Array.isArray(rawState.pushHistory) ? rawState.pushHistory : []
    };
  };

  const sanitizeFieldValue = (field, value) => {
    if (field.type === "multi-select") {
      if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
      }

      return value ? [String(value).trim()] : [];
    }

    if (value === undefined || value === null) {
      return "";
    }

    return String(value).trim();
  };

  const normalizeField = (field) => {
    const normalized = createField(field);
    normalized.id = field && field.id ? String(field.id) : normalized.id;
    normalized.label = field && field.label ? String(field.label) : normalized.label;
    normalized.required = Boolean(field && field.required);
    normalized.filterable =
      field && Object.prototype.hasOwnProperty.call(field, "filterable") ? Boolean(field.filterable) : true;
    normalized.listable =
      field && Object.prototype.hasOwnProperty.call(field, "listable") ? Boolean(field.listable) : true;
    normalized.placeholder = field && field.placeholder ? String(field.placeholder) : "";
    normalized.hint = field && field.hint ? String(field.hint) : "";
    normalized.options = normalizeOptions(field && field.options);
    return normalized;
  };

  const normalizeForm = (form) => {
    const normalized = createForm(form);
    normalized.id = form && form.id ? String(form.id) : normalized.id;
    normalized.name = form && form.name ? String(form.name) : normalized.name;
    normalized.activityName = form && form.activityName ? String(form.activityName) : "";
    normalized.registrationStart = form && form.registrationStart ? String(form.registrationStart) : normalized.registrationStart;
    normalized.registrationEnd = form && form.registrationEnd ? String(form.registrationEnd) : normalized.registrationEnd;
    normalized.page = {
      title:
        form && form.page && form.page.title
          ? String(form.page.title)
          : normalized.page.title,
      prompt:
        form && form.page && form.page.prompt
          ? String(form.page.prompt)
          : normalized.page.prompt
    };
    normalized.fields =
      Array.isArray(form && form.fields) && form.fields.length
        ? form.fields.map(normalizeField)
        : createStarterFields();
    normalized.createdAt = form && form.createdAt ? String(form.createdAt) : normalized.createdAt;
    normalized.createdBy = form && form.createdBy ? String(form.createdBy) : normalized.createdBy;
    normalized.miniProgramPath =
      form && form.miniProgramPath ? String(form.miniProgramPath) : buildMiniProgramPath(normalized.id);
    normalized.qrLandingUrl =
      form && form.qrLandingUrl ? String(form.qrLandingUrl) : buildQrLandingUrl(normalized.id);
    return normalized;
  };

  const normalizeRecord = (record, formMap, fallbackFormId) => {
    const normalized = createRecord(record);
    const formId = formMap.has(normalized.formId) ? normalized.formId : fallbackFormId;
    const form = formMap.get(formId);
    const nextData = {};

    if (form) {
      form.fields.forEach((field) => {
        nextData[field.id] = sanitizeFieldValue(field, normalized.data[field.id]);
      });
    }

    normalized.formId = formId;
    normalized.data = nextData;
    return normalized;
  };

  const normalizePushHistory = (item) => createPushHistory(item);

  const normalizeState = (rawState) => {
    const fallback = createDefaultState();
    const source = migrateLegacyState(rawState);

    if (!source || typeof source !== "object") {
      return fallback;
    }

    const forms =
      Array.isArray(source.forms) && source.forms.length
        ? source.forms.map(normalizeForm)
        : fallback.forms;
    const fallbackFormId = forms[0] ? forms[0].id : "";
    const formMap = new Map(forms.map((form) => [form.id, form]));

    return {
      forms,
      records: Array.isArray(source.records)
        ? source.records.map((record) => normalizeRecord(record, formMap, fallbackFormId))
        : fallback.records.map((record) => normalizeRecord(record, formMap, fallbackFormId)),
      pushHistory: Array.isArray(source.pushHistory)
        ? source.pushHistory.map(normalizePushHistory)
        : fallback.pushHistory.map(normalizePushHistory)
    };
  };

  const dispatchChange = (state) => {
    window.dispatchEvent(
      new CustomEvent(LOCAL_EVENT, {
        detail: clone(state)
      })
    );
  };

  const persistState = (state, options = {}) => {
    const normalized = normalizeState(state);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    if (!options.silent) {
      dispatchChange(normalized);
    }

    return clone(normalized);
  };

  const loadState = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyRaw) {
          const legacyParsed = JSON.parse(legacyRaw);
          return persistState(legacyParsed, { silent: true });
        }

        return persistState(createDefaultState(), { silent: true });
      }

      const parsed = JSON.parse(raw);
      const normalized = normalizeState(parsed);

      if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
        return persistState(normalized, { silent: true });
      }

      return clone(normalized);
    } catch (error) {
      return persistState(createDefaultState(), { silent: true });
    }
  };

  const updateState = (updater) => {
    const draft = loadState();
    updater(draft);
    return persistState(draft);
  };

  const resetState = () => persistState(createDefaultState());

  const getFormById = (state, formId) => {
    const source = state && typeof state === "object" ? state : loadState();
    return source.forms.find((form) => form.id === formId) || null;
  };

  const getFilterableFields = (form) => (form ? form.fields.filter((field) => field.filterable) : []);
  const getListableFields = (form) => (form ? form.fields.filter((field) => field.listable) : []);

  const getFieldValueText = (field, value) => {
    if (field.type === "multi-select") {
      return Array.isArray(value) && value.length ? value.join("、") : "未填写";
    }

    return value ? String(value) : "未填写";
  };

  const getFormRuntimeStatus = (form, now = new Date()) => {
    if (!form) {
      return "expired";
    }

    const start = new Date(form.registrationStart);
    const end = new Date(form.registrationEnd);

    if (!Number.isNaN(start.getTime()) && now < start) {
      return "upcoming";
    }

    if (!Number.isNaN(end.getTime()) && now > end) {
      return "expired";
    }

    return "active";
  };

  const getFormStatusMeta = (status) => FORM_STATUS_MAP[status] || FORM_STATUS_MAP.active;
  const recordStatusLabel = (status) => (RECORD_STATUS_MAP[status] ? RECORD_STATUS_MAP[status].label : status || "未设置");

  const getSearchableRecordText = (record, form) => {
    if (!form) {
      return Object.values(record.data || {})
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .join(" ");
    }

    return form.fields.map((field) => getFieldValueText(field, record.data[field.id])).join(" ");
  };

  const recordMatchesFilters = (record, form, filters) => {
    const activeFilters = filters || {};
    const keyword = String(activeFilters.keyword || "").trim().toLowerCase();
    const fieldFilters = activeFilters.fieldFilters || {};

    if (activeFilters.status && activeFilters.status !== "all" && record.status !== activeFilters.status) {
      return false;
    }

    if (keyword) {
      const searchable = getSearchableRecordText(record, form).toLowerCase();
      if (!searchable.includes(keyword)) {
        return false;
      }
    }

    if (!form) {
      return true;
    }

    for (const field of form.fields) {
      const criterion = fieldFilters[field.id];

      if (criterion === undefined || criterion === null || criterion === "" || (Array.isArray(criterion) && !criterion.length)) {
        continue;
      }

      const value = record.data[field.id];

      if (field.type === "single-select") {
        if (value !== criterion) {
          return false;
        }
        continue;
      }

      if (field.type === "multi-select") {
        const selectedValues = Array.isArray(criterion) ? criterion : [criterion];
        const recordValues = Array.isArray(value) ? value : [];

        if (!selectedValues.some((item) => recordValues.includes(item))) {
          return false;
        }
        continue;
      }

      const textValue = getFieldValueText(field, value).toLowerCase();
      if (!textValue.includes(String(criterion).toLowerCase())) {
        return false;
      }
    }

    return true;
  };

  const summarizeFilters = (form, filters) => {
    const parts = [];
    const activeFilters = filters || {};
    const fieldFilters = activeFilters.fieldFilters || {};

    if (form) {
      parts.push(`表单：${form.name}`);
    }

    if (activeFilters.status && activeFilters.status !== "all") {
      parts.push(`跟进状态：${recordStatusLabel(activeFilters.status)}`);
    }

    if (activeFilters.keyword && activeFilters.keyword.trim()) {
      parts.push(`关键词：${activeFilters.keyword.trim()}`);
    }

    if (form) {
      form.fields.forEach((field) => {
        const value = fieldFilters[field.id];

        if (value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length)) {
          return;
        }

        parts.push(`${field.label}：${Array.isArray(value) ? value.join("、") : value}`);
      });
    }

    return parts.join("；") || "全部登记用户";
  };

  const addRegistration = ({ formId, values }) => {
    let createdRecord = null;

    updateState((state) => {
      const form = getFormById(state, formId);

      if (!form) {
        return;
      }

      const data = {};
      form.fields.forEach((field) => {
        data[field.id] = sanitizeFieldValue(field, values[field.id]);
      });

      createdRecord = createRecord({
        formId: form.id,
        status: "new",
        data
      });

      state.records.unshift(createdRecord);
    });

    return createdRecord;
  };

  const pushToRecipients = ({ ids, channel, title, content, filterSummary }) => {
    if (!Array.isArray(ids) || !ids.length) {
      return null;
    }

    const snapshotIds = Array.from(new Set(ids));
    const createdAt = nowIso();
    let pushItem = null;

    updateState((state) => {
      const idSet = new Set(snapshotIds);

      state.records = state.records.map((record) => {
        if (!idSet.has(record.id)) {
          return record;
        }

        return {
          ...record,
          status: "pushed",
          pushCount: (record.pushCount || 0) + 1,
          lastPushAt: createdAt,
          lastPushChannel: channel,
          lastPushTitle: title
        };
      });

      pushItem = createPushHistory({
        createdAt,
        channel,
        title,
        content,
        filterSummary,
        targetIds: snapshotIds
      });

      state.pushHistory.unshift(pushItem);
    });

    return pushItem;
  };

  const subscribe = (callback) => {
    const onLocalChange = (event) => callback(clone(event.detail));
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        callback(loadState());
      }
    };

    window.addEventListener(LOCAL_EVENT, onLocalChange);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(LOCAL_EVENT, onLocalChange);
      window.removeEventListener("storage", onStorage);
    };
  };

  window.registrationWorkbench = {
    FIELD_TYPES,
    FORM_STATUS_MAP,
    PUSH_CHANNELS,
    RECORD_STATUS_MAP,
    STORAGE_KEY,
    clone,
    escapeHtml,
    loadState,
    updateState,
    resetState,
    createBlankField: () =>
      createField({
        label: "新字段",
        type: "text",
        required: false,
        filterable: true,
        listable: true
      }),
    createBlankForm,
    createField,
    createForm,
    addRegistration,
    pushToRecipients,
    getFieldValueText,
    getFormById,
    getFormRuntimeStatus,
    getFormStatusMeta,
    getFilterableFields,
    getListableFields,
    getQrImageUrl,
    buildMiniProgramPath,
    buildQrLandingUrl,
    recordMatchesFilters,
    summarizeFilters,
    recordStatusLabel,
    formatDateTime,
    formatDateRange,
    toDatetimeLocalValue,
    subscribe,
    normalizeOptions
  };
})();
