(() => {
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const $ = (id) => document.getElementById(id);

  const STRATEGIES = {
    guide: { title: "引导咨询", desc: "继续追问关键条件，沉淀有效线索。", tagClass: "tag tag--green" },
    direct: { title: "直接答复", desc: "命中规则后直接输出标准答案。", tagClass: "tag tag--orange" },
    manual: { title: "人工接管", desc: "复杂问题和高意向客户优先转人工。", tagClass: "tag tag--red" }
  };

  const BASE = {
    version: "V2.4.0",
    publishTime: "2026-03-17 16:40",
    draftState: "已发布",
    globalStrategy: "guide",
    settings: {
      scope: "project-policy",
      fallback: "manual",
      responseLimit: "3",
      recoverPolicy: "keep"
    },
    features: [
      { id: "quick-buttons", title: "问题按钮", desc: "支持前台展示预设问题按钮。", enabled: true },
      { id: "decision-rules", title: "条件推导", desc: "根据多题选项命中最终答案。", enabled: true },
      { id: "answer-library", title: "标准答案库", desc: "统一维护规则命中文案和动作。", enabled: true },
      { id: "manual-transfer", title: "人工转接", desc: "规则命中后可直接转人工。", enabled: true },
      { id: "restore-center", title: "恢复中心", desc: "保留版本记录并支持回退。", enabled: true },
      { id: "change-log", title: "操作留痕", desc: "记录保存、发布和恢复行为。", enabled: false }
    ],
    questions: [
      {
        id: "purpose",
        title: "购房目的",
        prompt: "先判断用户置业动机，决定后续追问路径。",
        enabled: true,
        defaultStrategy: "guide",
        options: [
          { id: "first-home", label: "首套自住", next: "budget", strategy: "guide" },
          { id: "upgrade", label: "改善换房", next: "budget", strategy: "guide" },
          { id: "investment", label: "资产配置", next: "result", strategy: "manual" }
        ]
      },
      {
        id: "budget",
        title: "预算区间",
        prompt: "确认预算范围，缩小推荐项目和政策范围。",
        enabled: true,
        defaultStrategy: "guide",
        options: [
          { id: "under-200", label: "200万内", next: "district", strategy: "guide" },
          { id: "200-350", label: "200-350万", next: "district", strategy: "guide" },
          { id: "350-plus", label: "350万以上", next: "district", strategy: "direct" }
        ]
      },
      {
        id: "district",
        title: "关注区域",
        prompt: "确认区域偏好，命中最终回复和项目建议。",
        enabled: true,
        defaultStrategy: "direct",
        options: [
          { id: "gaoxin", label: "高新区", next: "result", strategy: "direct" },
          { id: "tianfu", label: "天府新区", next: "result", strategy: "direct" },
          { id: "chenghua", label: "成华区", next: "result", strategy: "direct" }
        ]
      }
    ],
    rules: [
      {
        id: "rule-first-chenghua",
        name: "首套刚需推荐",
        strategy: "direct",
        conditions: { purpose: "first-home", budget: "under-200", district: "chenghua" },
        answer: "返回成华区总价 200 万内项目清单，并附首套购房资格与贷款说明。",
        action: "发送项目列表 + 首套政策入口"
      },
      {
        id: "rule-first-tianfu",
        name: "首套天府机会",
        strategy: "direct",
        conditions: { purpose: "first-home", budget: "200-350", district: "tianfu" },
        answer: "推荐天府新区首套改善型项目，并推送购房补贴和预约看房入口。",
        action: "发送项目列表 + 补贴申领入口"
      },
      {
        id: "rule-upgrade-gaoxin",
        name: "改善高新推荐",
        strategy: "direct",
        conditions: { purpose: "upgrade", budget: "350-plus", district: "gaoxin" },
        answer: "推荐高新区改善型项目，强调产业、通勤和产品力优势。",
        action: "发送改善项目列表 + 一对一顾问"
      },
      {
        id: "rule-investment-transfer",
        name: "投资客户转人工",
        strategy: "manual",
        conditions: { purpose: "investment" },
        answer: "进入资产配置专席，由人工进一步评估收益预期和风险偏好。",
        action: "转接投资顾问"
      }
    ]
  };

  const buildStable = () => {
    const data = clone(BASE);
    data.version = "V2.3.3";
    data.publishTime = "2026-03-15 18:20";
    data.globalStrategy = "direct";
    data.settings.fallback = "knowledge";
    data.features[5].enabled = true;
    data.rules[1].answer = "推荐天府新区首套项目，并直接发送资格自测与补贴说明。";
    return data;
  };

  const buildHistory = () => {
    const data = clone(BASE);
    data.version = "V2.2.8";
    data.publishTime = "2026-03-11 09:40";
    data.globalStrategy = "manual";
    data.settings.scope = "project-only";
    data.settings.responseLimit = "2";
    data.questions[1].enabled = false;
    data.questions[2].enabled = false;
    data.rules = [
      {
        id: "rule-history-manual",
        name: "旧版统一转人工",
        strategy: "manual",
        conditions: { purpose: "investment" },
        answer: "复杂需求统一转人工，由顾问继续跟进。",
        action: "转接人工"
      }
    ];
    return data;
  };

  let snapshots = [
    {
      id: "snap-240",
      version: "V2.4.0",
      status: "当前发布",
      time: "2026-03-17 16:40",
      operator: "系统管理员",
      highlights: "新增问题按钮配置和规则推导能力，支持多题命中答案。",
      state: clone(BASE)
    },
    {
      id: "snap-233",
      version: "V2.3.3",
      status: "稳定版",
      time: "2026-03-15 18:20",
      operator: "运营主管",
      highlights: "保持稳定问答路径，以直接答复为主，补充留痕记录。",
      state: buildStable()
    },
    {
      id: "snap-228",
      version: "V2.2.8",
      status: "历史版",
      time: "2026-03-11 09:40",
      operator: "产品运营",
      highlights: "旧版流程以人工接管为主，问题路径较短。",
      state: buildHistory()
    }
  ];

  const store = {
    current: clone(BASE),
    selectedSnapshotId: snapshots[0].id,
    dirty: false
  };

  const view = {
    selectedQuestionId: BASE.questions[0].id,
    selectedRuleId: BASE.rules[0].id,
    previewSelections: {},
    previewCurrentQuestionId: BASE.questions[0].id
  };

  const els = {
    featureGrid: $("featureGrid"),
    questionList: $("questionList"),
    questionEditorTitle: $("questionEditorTitle"),
    questionEnabledBtn: $("questionEnabledBtn"),
    questionTitleInput: $("questionTitleInput"),
    questionPromptInput: $("questionPromptInput"),
    questionStrategySelect: $("questionStrategySelect"),
    optionEditorList: $("optionEditorList"),
    ruleList: $("ruleList"),
    ruleEditorTitle: $("ruleEditorTitle"),
    ruleNameInput: $("ruleNameInput"),
    ruleStrategySelect: $("ruleStrategySelect"),
    ruleConditionGrid: $("ruleConditionGrid"),
    ruleAnswerInput: $("ruleAnswerInput"),
    ruleActionInput: $("ruleActionInput"),
    strategyGrid: $("strategyGrid"),
    scopeSelect: $("scopeSelect"),
    fallbackSelect: $("fallbackSelect"),
    responseLimitSelect: $("responseLimitSelect"),
    recoverPolicySelect: $("recoverPolicySelect"),
    previewSteps: $("previewSteps"),
    previewQuestionLabel: $("previewQuestionLabel"),
    previewQuestionTitle: $("previewQuestionTitle"),
    previewQuestionDesc: $("previewQuestionDesc"),
    previewOptions: $("previewOptions"),
    previewResult: $("previewResult"),
    resetPreviewBtn: $("resetPreviewBtn"),
    snapshotList: $("snapshotList"),
    snapshotCountMeta: $("snapshotCountMeta"),
    changeSummary: $("changeSummary"),
    restoreDefaultBtn: $("restoreDefaultBtn"),
    restoreStableBtn: $("restoreStableBtn"),
    createSnapshotBtn: $("createSnapshotBtn"),
    restoreSnapshotBtn: $("restoreSnapshotBtn"),
    versionLabel: $("versionLabel"),
    publishTime: $("publishTime"),
    enabledCount: $("enabledCount"),
    questionCount: $("questionCount"),
    ruleCount: $("ruleCount"),
    strategyLabel: $("strategyLabel"),
    draftState: $("draftState"),
    statusDot: $("statusDot"),
    statusText: $("statusText"),
    saveDraftBtn: $("saveDraftBtn"),
    publishBtn: $("publishBtn"),
    toast: $("toast")
  };

  let toastTimer = null;

  const getQuestion = (id) => store.current.questions.find((item) => item.id === id) || null;
  const getRule = (id) => store.current.rules.find((item) => item.id === id) || null;
  const getOption = (questionId, optionId) => {
    const question = getQuestion(questionId);
    return question ? question.options.find((item) => item.id === optionId) || null : null;
  };
  const enabledQuestions = () => store.current.questions.filter((item) => item.enabled);
  const firstEnabledQuestionId = () => (enabledQuestions()[0] || {}).id || "";
  const selectedQuestion = () => getQuestion(view.selectedQuestionId) || store.current.questions[0] || null;
  const selectedRule = () => getRule(view.selectedRuleId) || store.current.rules[0] || null;
  const selectedSnapshot = () => snapshots.find((item) => item.id === store.selectedSnapshotId) || snapshots[0];
  const stableSnapshot = () => snapshots.find((item) => item.status === "稳定版") || snapshots[0];

  const strategyOptions = (value) =>
    Object.keys(STRATEGIES).map((key) => `<option value="${key}"${key === value ? ' selected="selected"' : ""}>${STRATEGIES[key].title}</option>`).join("");

  const nextOptions = (questionId, value) => {
    const options = [`<option value="result"${value === "result" ? ' selected="selected"' : ""}>直接得出答案</option>`];
    store.current.questions.forEach((question) => {
      if (question.id !== questionId) {
        options.push(`<option value="${question.id}"${question.id === value ? ' selected="selected"' : ""}>${question.title}</option>`);
      }
    });
    return options.join("");
  };

  const optionLabel = (questionId, optionId) => {
    const option = getOption(questionId, optionId);
    return option ? option.label : "未配置";
  };

  const nextLabel = (next) => {
    if (next === "result") {
      return "直接得出答案";
    }
    const question = getQuestion(next);
    return question ? question.title : "结束";
  };

  const normalizeView = () => {
    if (!getQuestion(view.selectedQuestionId)) {
      view.selectedQuestionId = (store.current.questions[0] || {}).id || "";
    }
    if (!getRule(view.selectedRuleId)) {
      view.selectedRuleId = (store.current.rules[0] || {}).id || "";
    }
  };

  const resetPreview = () => {
    view.previewSelections = {};
    view.previewCurrentQuestionId = firstEnabledQuestionId();
  };

  const showToast = (message) => {
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("is-visible"), 2200);
  };

  const setDirty = (message) => {
    store.dirty = true;
    store.current.draftState = "待发布";
    renderOverview();
    if (message) {
      showToast(message);
    }
  };

  const formatNow = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  const bumpVersion = (version) => {
    const match = version.match(/^V(\d+)\.(\d+)\.(\d+)$/);
    return match ? `V${match[1]}.${match[2]}.${String(Number(match[3]) + 1)}` : "V2.4.1";
  };

  const matchRule = (selections) => {
    const matched = store.current.rules.filter((rule) =>
      Object.keys(rule.conditions).every((questionId) => selections[questionId] === rule.conditions[questionId])
    );
    matched.sort((left, right) => Object.keys(right.conditions).length - Object.keys(left.conditions).length);
    return matched[0] || null;
  };

  const renderOverview = () => {
    els.versionLabel.textContent = store.current.version;
    els.publishTime.textContent = `${store.current.publishTime} 发布`;
    els.enabledCount.textContent = String(store.current.features.filter((item) => item.enabled).length);
    els.questionCount.textContent = String(enabledQuestions().length);
    els.ruleCount.textContent = String(store.current.rules.length);
    els.strategyLabel.textContent = STRATEGIES[store.current.globalStrategy].title;
    els.draftState.textContent = store.current.draftState;
    els.statusDot.classList.toggle("is-dirty", store.dirty);
    els.statusText.textContent = store.dirty ? "当前配置有未发布变更" : "当前配置已发布";
  };

  const renderFeatures = () => {
    els.featureGrid.innerHTML = store.current.features.map((feature) => `
      <button class="feature-card${feature.enabled ? " is-enabled" : ""}" type="button" data-feature-id="${feature.id}">
        <div>
          <div class="feature-card__title">${feature.title}</div>
          <div class="feature-card__desc">${feature.desc}</div>
          <div class="feature-card__status">${feature.enabled ? "当前已启用" : "当前已停用"}</div>
        </div>
        <span class="switch${feature.enabled ? " is-on" : ""}" aria-hidden="true"></span>
      </button>
    `).join("");
  };

  const renderQuestions = () => {
    els.questionList.innerHTML = store.current.questions.map((question, index) => `
      <button class="question-card${question.id === view.selectedQuestionId ? " is-selected" : ""}" type="button" data-question-id="${question.id}">
        <div class="question-card__top">
          <div class="question-card__index">${index + 1}</div>
          <span class="${question.enabled ? "tag tag--green" : "tag"}">${question.enabled ? "已启用" : "已停用"}</span>
        </div>
        <div class="question-card__title">${question.title}</div>
        <div class="question-card__desc">${question.prompt}</div>
        <div class="question-card__meta">${question.options.length} 个按钮 · 默认策略 ${STRATEGIES[question.defaultStrategy].title}</div>
      </button>
    `).join("");
  };

  const renderQuestionEditor = () => {
    const question = selectedQuestion();
    if (!question) return;
    els.questionEditorTitle.textContent = question.title;
    els.questionEnabledBtn.textContent = question.enabled ? "已启用" : "已停用";
    els.questionEnabledBtn.classList.toggle("is-disabled", !question.enabled);
    els.questionTitleInput.value = question.title;
    els.questionPromptInput.value = question.prompt;
    els.questionStrategySelect.innerHTML = strategyOptions(question.defaultStrategy);
    els.optionEditorList.innerHTML = question.options.map((option) => `
      <div class="option-row" data-option-id="${option.id}">
        <div class="option-row__meta">
          <span class="field-card__label">按钮文案</span>
          <input class="field-card__control" type="text" data-option-field="label" value="${option.label}" />
        </div>
        <div class="option-row__meta">
          <span class="field-card__label">下一步</span>
          <select class="field-card__control" data-option-field="next">${nextOptions(question.id, option.next)}</select>
        </div>
        <div class="option-row__meta">
          <span class="field-card__label">命中策略</span>
          <select class="field-card__control" data-option-field="strategy">${strategyOptions(option.strategy)}</select>
        </div>
      </div>
    `).join("");
  };

  const renderRules = () => {
    els.ruleList.innerHTML = store.current.rules.map((rule) => `
      <button class="rule-card${rule.id === view.selectedRuleId ? " is-selected" : ""}" type="button" data-rule-id="${rule.id}">
        <div class="rule-card__top">
          <div class="rule-card__title">${rule.name}</div>
          <span class="${STRATEGIES[rule.strategy].tagClass}">${STRATEGIES[rule.strategy].title}</span>
        </div>
        <div class="chip-row">
          ${Object.keys(rule.conditions).map((questionId) => `
            <span class="tag">${(getQuestion(questionId) || { title: questionId }).title}：${optionLabel(questionId, rule.conditions[questionId])}</span>
          `).join("")}
        </div>
        <div class="rule-card__desc">${rule.answer}</div>
        <div class="rule-card__meta">${rule.action}</div>
      </button>
    `).join("");
  };

  const renderRuleEditor = () => {
    const rule = selectedRule();
    if (!rule) return;
    els.ruleEditorTitle.textContent = rule.name;
    els.ruleNameInput.value = rule.name;
    els.ruleStrategySelect.innerHTML = strategyOptions(rule.strategy);
    els.ruleAnswerInput.value = rule.answer;
    els.ruleActionInput.value = rule.action;
    els.ruleConditionGrid.innerHTML = store.current.questions.map((question) => `
      <label class="condition-field">
        <span class="condition-field__label">${question.title}</span>
        <select class="field-card__control" data-condition-question="${question.id}">
          <option value="">不限</option>
          ${question.options.map((option) => `<option value="${option.id}"${rule.conditions[question.id] === option.id ? ' selected="selected"' : ""}>${option.label}</option>`).join("")}
        </select>
      </label>
    `).join("");
  };

  const renderGlobal = () => {
    els.strategyGrid.innerHTML = Object.keys(STRATEGIES).map((key) => `
      <button class="strategy-card${store.current.globalStrategy === key ? " is-selected" : ""}" type="button" data-strategy="${key}">
        <span class="${STRATEGIES[key].tagClass}">${STRATEGIES[key].title}</span>
        <div class="strategy-card__title">${STRATEGIES[key].title}</div>
        <div class="strategy-card__desc">${STRATEGIES[key].desc}</div>
      </button>
    `).join("");
    els.scopeSelect.value = store.current.settings.scope;
    els.fallbackSelect.value = store.current.settings.fallback;
    els.responseLimitSelect.value = store.current.settings.responseLimit;
    els.recoverPolicySelect.value = store.current.settings.recoverPolicy;
  };

  const renderPreview = () => {
    const steps = store.current.questions.filter((question) => view.previewSelections[question.id]);
    els.previewSteps.innerHTML = steps.length
      ? steps.map((question) => `<div class="preview-step">${question.title}：${optionLabel(question.id, view.previewSelections[question.id])}</div>`).join("")
      : '<div class="preview-step">未开始路径预览</div>';

    const currentQuestion = getQuestion(view.previewCurrentQuestionId);
    if (currentQuestion && currentQuestion.enabled) {
      els.previewQuestionLabel.textContent = "当前问题";
      els.previewQuestionTitle.textContent = currentQuestion.title;
      els.previewQuestionDesc.textContent = currentQuestion.prompt;
      els.previewOptions.innerHTML = currentQuestion.options.map((option) => `
        <button class="preview-option" type="button" data-preview-option="${option.id}">
          <div class="preview-option__label">${option.label}</div>
          <div class="preview-option__meta">下一步：${nextLabel(option.next)} · 策略：${STRATEGIES[option.strategy].title}</div>
        </button>
      `).join("");
      els.previewResult.innerHTML = `
        <div class="preview-result__label">推导结果</div>
        <div class="preview-result__title">继续完成选择</div>
        <div class="preview-result__desc">当前还未走完整个问题路径，完成选择后会显示命中的回复和动作策略。</div>
      `;
      return;
    }

    els.previewQuestionLabel.textContent = "流程已完成";
    els.previewQuestionTitle.textContent = "已完成问题路径";
    els.previewQuestionDesc.textContent = "当前路径已得出最终结果，可重置继续体验其他路径。";
    els.previewOptions.innerHTML = "";

    const rule = matchRule(view.previewSelections);
    if (rule) {
      els.previewResult.innerHTML = `
        <div class="preview-result__label">推导结果</div>
        <span class="preview-result__tag">${STRATEGIES[rule.strategy].title}</span>
        <div class="preview-result__title">${rule.name}</div>
        <div class="preview-result__desc">${rule.answer}</div>
        <div class="preview-result__action">${rule.action}</div>
      `;
      return;
    }

    const fallbackMap = {
      manual: "当前条件未命中规则，建议转人工继续跟进。",
      "leave-message": "当前条件未命中规则，建议引导用户留言补充需求。",
      knowledge: "当前条件未命中规则，建议返回知识库标准答案。"
    };
    const fallbackLabelMap = {
      manual: "转人工",
      "leave-message": "引导留言",
      knowledge: "返回知识库"
    };
    els.previewResult.innerHTML = `
      <div class="preview-result__label">推导结果</div>
      <span class="preview-result__tag">${STRATEGIES[store.current.globalStrategy].title}</span>
      <div class="preview-result__title">未命中明确规则</div>
      <div class="preview-result__desc">${fallbackMap[store.current.settings.fallback]}</div>
      <div class="preview-result__action">默认处理：${fallbackLabelMap[store.current.settings.fallback]}</div>
    `;
  };

  const renderSnapshots = () => {
    els.snapshotCountMeta.textContent = `${snapshots.length} 个版本`;
    els.snapshotList.innerHTML = snapshots.map((snapshot) => `
      <button class="snapshot-item${snapshot.id === store.selectedSnapshotId ? " is-selected" : ""}" type="button" data-snapshot-id="${snapshot.id}">
        <div class="snapshot-item__top">
          <div class="snapshot-item__version">${snapshot.version}</div>
          <div class="snapshot-item__status">${snapshot.status}</div>
        </div>
        <div class="snapshot-item__meta">${snapshot.time} · ${snapshot.operator}</div>
      </button>
    `).join("");
    els.changeSummary.textContent = selectedSnapshot().highlights;
  };

  const renderAll = () => {
    normalizeView();
    renderOverview();
    renderFeatures();
    renderQuestions();
    renderQuestionEditor();
    renderRules();
    renderRuleEditor();
    renderGlobal();
    renderPreview();
    renderSnapshots();
  };

  const updateQuestion = (questionId, updater) => {
    store.current.questions = store.current.questions.map((question) => question.id === questionId ? updater(clone(question)) : question);
  };

  const updateRule = (ruleId, updater) => {
    store.current.rules = store.current.rules.map((rule) => rule.id === ruleId ? updater(clone(rule)) : rule);
  };

  const applySnapshot = (snapshot, message) => {
    store.current = clone(snapshot.state);
    store.current.draftState = "待发布";
    store.selectedSnapshotId = snapshot.id;
    store.dirty = true;
    normalizeView();
    resetPreview();
    renderAll();
    showToast(message);
  };

  els.featureGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-feature-id]");
    if (!button) return;
    const featureId = button.getAttribute("data-feature-id");
    store.current.features = store.current.features.map((feature) => feature.id === featureId ? Object.assign({}, feature, { enabled: !feature.enabled }) : feature);
    renderFeatures();
    renderOverview();
    setDirty("已更新功能开关");
  });

  els.questionList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-question-id]");
    if (!button) return;
    view.selectedQuestionId = button.getAttribute("data-question-id");
    renderQuestions();
    renderQuestionEditor();
  });

  els.questionEnabledBtn.addEventListener("click", () => {
    const question = selectedQuestion();
    if (!question) return;
    updateQuestion(question.id, (draft) => Object.assign(draft, { enabled: !draft.enabled }));
    resetPreview();
    renderAll();
    setDirty("已更新问题节点状态");
  });

  els.questionTitleInput.addEventListener("input", () => {
    const question = selectedQuestion();
    if (!question) return;
    updateQuestion(question.id, (draft) => Object.assign(draft, { title: els.questionTitleInput.value }));
    els.questionEditorTitle.textContent = els.questionTitleInput.value || "问题节点";
    renderQuestions();
    renderRules();
    renderRuleEditor();
    renderPreview();
    setDirty();
  });

  els.questionPromptInput.addEventListener("input", () => {
    const question = selectedQuestion();
    if (!question) return;
    updateQuestion(question.id, (draft) => Object.assign(draft, { prompt: els.questionPromptInput.value }));
    renderQuestions();
    renderPreview();
    setDirty();
  });

  els.questionStrategySelect.addEventListener("change", () => {
    const question = selectedQuestion();
    if (!question) return;
    updateQuestion(question.id, (draft) => Object.assign(draft, { defaultStrategy: els.questionStrategySelect.value }));
    renderQuestions();
    setDirty("已更新问题默认策略");
  });

  const syncOptionChange = (event) => {
    const row = event.target.closest(".option-row");
    const question = selectedQuestion();
    if (!row || !question) return;
    const optionId = row.getAttribute("data-option-id");
    const field = event.target.getAttribute("data-option-field");
    if (!field) return;
    updateQuestion(question.id, (draft) => {
      draft.options = draft.options.map((option) => option.id === optionId ? Object.assign({}, option, { [field]: event.target.value }) : option);
      return draft;
    });
  };

  els.optionEditorList.addEventListener("input", (event) => {
    syncOptionChange(event);
    renderQuestions();
    renderRules();
    renderRuleEditor();
    setDirty();
  });

  els.optionEditorList.addEventListener("change", (event) => {
    syncOptionChange(event);
    resetPreview();
    renderAll();
    setDirty("已更新按钮路径");
  });

  els.ruleList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-rule-id]");
    if (!button) return;
    view.selectedRuleId = button.getAttribute("data-rule-id");
    renderRules();
    renderRuleEditor();
  });

  els.ruleNameInput.addEventListener("input", () => {
    const rule = selectedRule();
    if (!rule) return;
    updateRule(rule.id, (draft) => Object.assign(draft, { name: els.ruleNameInput.value }));
    els.ruleEditorTitle.textContent = els.ruleNameInput.value || "规则详情";
    renderRules();
    renderPreview();
    setDirty();
  });

  els.ruleStrategySelect.addEventListener("change", () => {
    const rule = selectedRule();
    if (!rule) return;
    updateRule(rule.id, (draft) => Object.assign(draft, { strategy: els.ruleStrategySelect.value }));
    renderRules();
    renderPreview();
    setDirty("已更新规则策略");
  });

  els.ruleAnswerInput.addEventListener("input", () => {
    const rule = selectedRule();
    if (!rule) return;
    updateRule(rule.id, (draft) => Object.assign(draft, { answer: els.ruleAnswerInput.value }));
    renderRules();
    renderPreview();
    setDirty();
  });

  els.ruleActionInput.addEventListener("input", () => {
    const rule = selectedRule();
    if (!rule) return;
    updateRule(rule.id, (draft) => Object.assign(draft, { action: els.ruleActionInput.value }));
    renderRules();
    renderPreview();
    setDirty();
  });

  els.ruleConditionGrid.addEventListener("change", (event) => {
    if (!event.target.matches("[data-condition-question]")) return;
    const rule = selectedRule();
    if (!rule) return;
    const questionId = event.target.getAttribute("data-condition-question");
    updateRule(rule.id, (draft) => {
      if (event.target.value) {
        draft.conditions[questionId] = event.target.value;
      } else {
        delete draft.conditions[questionId];
      }
      return draft;
    });
    renderRules();
    renderPreview();
    setDirty("已更新命中条件");
  });

  els.strategyGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-strategy]");
    if (!button) return;
    store.current.globalStrategy = button.getAttribute("data-strategy");
    renderGlobal();
    renderOverview();
    renderPreview();
    setDirty("已更新全局策略");
  });

  [
    [els.scopeSelect, "scope"],
    [els.fallbackSelect, "fallback"],
    [els.responseLimitSelect, "responseLimit"],
    [els.recoverPolicySelect, "recoverPolicy"]
  ].forEach(([element, field]) => {
    element.addEventListener("change", () => {
      store.current.settings[field] = element.value;
      renderPreview();
      setDirty("已更新全局配置");
    });
  });

  els.previewOptions.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-preview-option]");
    const question = getQuestion(view.previewCurrentQuestionId);
    if (!button || !question) return;
    const option = getOption(question.id, button.getAttribute("data-preview-option"));
    if (!option) return;
    view.previewSelections[question.id] = option.id;
    view.previewCurrentQuestionId = option.next === "result" ? "" : option.next;
    if (view.previewCurrentQuestionId) {
      const nextQuestion = getQuestion(view.previewCurrentQuestionId);
      if (!nextQuestion || !nextQuestion.enabled) {
        view.previewCurrentQuestionId = "";
      }
    }
    renderPreview();
  });

  els.resetPreviewBtn.addEventListener("click", () => {
    resetPreview();
    renderPreview();
  });

  els.snapshotList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-snapshot-id]");
    if (!button) return;
    store.selectedSnapshotId = button.getAttribute("data-snapshot-id");
    renderSnapshots();
  });

  els.restoreDefaultBtn.addEventListener("click", () => {
    store.current = clone(BASE);
    store.current.draftState = "待发布";
    store.dirty = true;
    resetPreview();
    renderAll();
    showToast("已恢复默认配置");
  });

  els.restoreStableBtn.addEventListener("click", () => applySnapshot(stableSnapshot(), "已恢复最近稳定版"));

  els.createSnapshotBtn.addEventListener("click", () => {
    const snapshotId = `snap-${Date.now()}`;
    snapshots.unshift({
      id: snapshotId,
      version: `${store.current.version}-草稿`,
      status: "手动恢复点",
      time: formatNow(),
      operator: "当前用户",
      highlights: "保存了当前问题按钮、规则配置和全局策略，便于后续恢复。",
      state: clone(store.current)
    });
    store.selectedSnapshotId = snapshotId;
    renderSnapshots();
    showToast("已生成新的恢复点");
  });

  els.restoreSnapshotBtn.addEventListener("click", () => applySnapshot(selectedSnapshot(), "已恢复所选版本"));

  els.saveDraftBtn.addEventListener("click", () => {
    store.current.draftState = "草稿已保存";
    store.dirty = true;
    renderOverview();
    showToast("草稿已保存");
  });

  els.publishBtn.addEventListener("click", () => {
    const publishedTime = formatNow();
    if (snapshots.length && snapshots[0].status === "当前发布") {
      snapshots[0].status = "历史版";
    }
    store.current.version = bumpVersion(store.current.version);
    store.current.publishTime = publishedTime;
    store.current.draftState = "已发布";
    store.dirty = false;
    snapshots.unshift({
      id: `snap-${Date.now()}`,
      version: store.current.version,
      status: "当前发布",
      time: publishedTime,
      operator: "当前用户",
      highlights: "发布了新的问题按钮和规则推导配置版本。",
      state: clone(store.current)
    });
    store.selectedSnapshotId = snapshots[0].id;
    renderAll();
    showToast("配置已发布");
  });

  renderAll();
})();
