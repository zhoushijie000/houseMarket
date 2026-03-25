(() => {
  const workbench = window.registrationWorkbench;

  if (!workbench) {
    return;
  }

  const $ = (id) => document.getElementById(id);
  const escapeHtml = workbench.escapeHtml;

  const els = {
    resetDemoBtn: $("resetDemoBtn"),
    workspaceTabs: Array.from(document.querySelectorAll("[data-tab]")),
    workspaceViews: Array.from(document.querySelectorAll("[data-view]")),
    formKeywordInput: $("formKeywordInput"),
    formStatusSelect: $("formStatusSelect"),
    formActivitySelect: $("formActivitySelect"),
    createFormBtn: $("createFormBtn"),
    formTableBody: $("formTableBody"),
    recordFormFilterSelect: $("recordFormFilterSelect"),
    recordStatusFilterSelect: $("recordStatusFilterSelect"),
    recordKeywordFilterInput: $("recordKeywordFilterInput"),
    dynamicFilterBar: $("dynamicFilterBar"),
    selectionSummary: $("selectionSummary"),
    selectFilteredBtn: $("selectFilteredBtn"),
    clearSelectionBtn: $("clearSelectionBtn"),
    openPushModalBtn: $("openPushModalBtn"),
    recordTableBody: $("recordTableBody"),
    modalBackdrop: $("modalBackdrop"),
    formModal: $("formModal"),
    formModalTitle: $("formModalTitle"),
    formNameInput: $("formNameInput"),
    formStartInput: $("formStartInput"),
    formEndInput: $("formEndInput"),
    formActivityInput: $("formActivityInput"),
    pageTitleInput: $("pageTitleInput"),
    pagePromptInput: $("pagePromptInput"),
    addFieldBtn: $("addFieldBtn"),
    fieldList: $("fieldList"),
    fieldEditorTitle: $("fieldEditorTitle"),
    fieldEditorMeta: $("fieldEditorMeta"),
    moveFieldUpBtn: $("moveFieldUpBtn"),
    moveFieldDownBtn: $("moveFieldDownBtn"),
    deleteFieldBtn: $("deleteFieldBtn"),
    fieldLabelInput: $("fieldLabelInput"),
    fieldTypeSelect: $("fieldTypeSelect"),
    fieldPlaceholderInput: $("fieldPlaceholderInput"),
    fieldHintInput: $("fieldHintInput"),
    fieldRequiredInput: $("fieldRequiredInput"),
    fieldFilterableInput: $("fieldFilterableInput"),
    fieldListableInput: $("fieldListableInput"),
    fieldOptionsGroup: $("fieldOptionsGroup"),
    fieldOptionsInput: $("fieldOptionsInput"),
    saveFormBtn: $("saveFormBtn"),
    qrModal: $("qrModal"),
    qrModalTitle: $("qrModalTitle"),
    qrCodeImage: $("qrCodeImage"),
    qrFallback: $("qrFallback"),
    miniProgramPathOutput: $("miniProgramPathOutput"),
    qrLandingOutput: $("qrLandingOutput"),
    copyMiniPathBtn: $("copyMiniPathBtn"),
    openFormLink: $("openFormLink"),
    pushModal: $("pushModal"),
    pushChannelSelect: $("pushChannelSelect"),
    pushTitleInput: $("pushTitleInput"),
    pushContentInput: $("pushContentInput"),
    pushTargetSummary: $("pushTargetSummary"),
    pushSelectedBtn: $("pushSelectedBtn"),
    pushFilteredBtn: $("pushFilteredBtn"),
    toast: $("toast"),
    modalCloseButtons: Array.from(document.querySelectorAll("[data-close-modal]"))
  };

  const view = {
    tab: "forms",
    formFilters: {
      keyword: "",
      status: "all",
      activity: "all"
    },
    recordFilters: {
      formId: "all",
      status: "all",
      keyword: "",
      fieldFilters: {}
    },
    selectedRecordIds: new Set(),
    modal: {
      activeId: "",
      formMode: "create",
      formDraft: null,
      selectedFieldId: "",
      qrFormId: ""
    }
  };

  let toastTimer = null;

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const isSelectField = (field) => field && (field.type === "single-select" || field.type === "multi-select");
  const getFormRecordCount = (state, formId) => state.records.filter((record) => record.formId === formId).length;

  const getFilteredForms = (state) => {
    const keyword = view.formFilters.keyword.trim().toLowerCase();

    return state.forms.filter((form) => {
      const runtimeStatus = workbench.getFormRuntimeStatus(form);

      if (view.formFilters.status !== "all" && runtimeStatus !== view.formFilters.status) {
        return false;
      }

      if (view.formFilters.activity === "__none__" && form.activityName) {
        return false;
      }

      if (
        view.formFilters.activity !== "all" &&
        view.formFilters.activity !== "__none__" &&
        form.activityName !== view.formFilters.activity
      ) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return [form.name, form.page.title, form.activityName].join(" ").toLowerCase().includes(keyword);
    });
  };

  const getFilteredRecords = (state) =>
    state.records.filter((record) => {
      if (view.recordFilters.formId !== "all" && record.formId !== view.recordFilters.formId) {
        return false;
      }

      const form = workbench.getFormById(state, record.formId);
      return workbench.recordMatchesFilters(record, form, view.recordFilters);
    });

  const getRecordPrimaryName = (record) => record.data.name || record.data.mobile || record.id;

  const getRecordSummary = (record, form) => {
    if (!form) {
      return "未匹配到表单配置";
    }

    const displayFields = workbench
      .getListableFields(form)
      .filter((field) => !["name", "mobile"].includes(field.id))
      .slice(0, 3);

    if (!displayFields.length) {
      const remarkField = form.fields.find((field) => field.id === "remark");
      return remarkField ? workbench.getFieldValueText(remarkField, record.data[remarkField.id]) : "暂无摘要";
    }

    return displayFields
      .map((field) => `${field.label}：${workbench.getFieldValueText(field, record.data[field.id])}`)
      .join("；");
  };

  const getSelectedDraftField = () => {
    const draft = view.modal.formDraft;
    if (!draft) {
      return null;
    }

    return draft.fields.find((field) => field.id === view.modal.selectedFieldId) || draft.fields[0] || null;
  };

  const showToast = (message) => {
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      els.toast.classList.remove("is-visible");
    }, 2200);
  };

  const qrPatternMarkup = (seed) => {
    const size = 21;
    let state = 0;

    for (const char of seed) {
      state = (state * 131 + char.charCodeAt(0)) >>> 0;
    }

    const next = () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };

    const finderDark = (x, y) => {
      const localX = x % 7;
      const localY = y % 7;
      if (localX === 0 || localX === 6 || localY === 0 || localY === 6) {
        return true;
      }
      if (localX >= 2 && localX <= 4 && localY >= 2 && localY <= 4) {
        return true;
      }
      return false;
    };

    const cells = [];

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const inTopLeft = x < 7 && y < 7;
        const inTopRight = x >= size - 7 && y < 7;
        const inBottomLeft = x < 7 && y >= size - 7;
        const dark = inTopLeft || inTopRight || inBottomLeft ? finderDark(x, y) : next() > 0.52;
        cells.push(`<span class="qr-fallback__cell${dark ? " is-dark" : ""}"></span>`);
      }
    }

    return cells.join("");
  };

  const syncBackdrop = () => {
    const isOpen = Boolean(view.modal.activeId);
    els.modalBackdrop.hidden = !isOpen;
    document.body.classList.toggle("body-modal-open", isOpen);
  };

  const openModal = (modalId) => {
    [els.formModal, els.qrModal, els.pushModal].forEach((modal) => {
      modal.hidden = modal.id !== modalId;
      modal.setAttribute("aria-hidden", modal.id === modalId ? "false" : "true");
    });

    view.modal.activeId = modalId;
    syncBackdrop();
  };

  const closeModal = (modalId = view.modal.activeId) => {
    const target = modalId ? $(modalId) : null;
    if (target) {
      target.hidden = true;
      target.setAttribute("aria-hidden", "true");
    }

    if (modalId === "formModal") {
      view.modal.formDraft = null;
      view.modal.selectedFieldId = "";
    }

    if (modalId === "qrModal") {
      view.modal.qrFormId = "";
    }

    if (view.modal.activeId === modalId) {
      view.modal.activeId = "";
    }

    syncBackdrop();
  };

  const renderTabs = () => {
    els.workspaceTabs.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === view.tab);
    });

    els.workspaceViews.forEach((panel) => {
      panel.hidden = panel.dataset.view !== view.tab;
    });
  };

  const renderFormFilters = (state) => {
    const activities = Array.from(new Set(state.forms.map((form) => form.activityName).filter(Boolean)));

    els.formActivitySelect.innerHTML = [
      '<option value="all">全部活动</option>',
      '<option value="__none__">未绑定活动</option>'
    ]
      .concat(activities.map((activity) => `<option value="${escapeHtml(activity)}">${escapeHtml(activity)}</option>`))
      .join("");

    els.formKeywordInput.value = view.formFilters.keyword;
    els.formStatusSelect.value = view.formFilters.status;
    els.formActivitySelect.value = view.formFilters.activity;
  };

  const renderFormTable = (state) => {
    const forms = getFilteredForms(state);

    if (!forms.length) {
      els.formTableBody.innerHTML = '<tr><td colspan="6" class="table-empty">暂无匹配的登记表单</td></tr>';
      return;
    }

    els.formTableBody.innerHTML = forms
      .map((form) => {
        const status = workbench.getFormRuntimeStatus(form);
        const statusMeta = workbench.getFormStatusMeta(status);
        const formLink = `./form.html?formId=${encodeURIComponent(form.id)}`;

        return `
          <tr>
            <td>
              <div class="table-title">${escapeHtml(form.name)}</div>
              <div class="table-sub">${escapeHtml(form.page.title)}</div>
            </td>
            <td>${escapeHtml(workbench.formatDateRange(form.registrationStart, form.registrationEnd))}</td>
            <td>${escapeHtml(form.activityName || "未绑定")}</td>
            <td>${escapeHtml(getFormRecordCount(state, form.id))}</td>
            <td><span class="status-pill status-pill--${escapeHtml(statusMeta.tone)}">${escapeHtml(statusMeta.label)}</span></td>
            <td>
              <div class="table-actions">
                <button class="table-link" type="button" data-form-action="edit" data-form-id="${escapeHtml(form.id)}">编辑</button>
                <button class="table-link" type="button" data-form-action="qr" data-form-id="${escapeHtml(form.id)}">二维码</button>
                <a class="table-link" href="${formLink}" target="_blank" rel="noreferrer">登记页</a>
                <button class="table-link table-link--danger" type="button" data-form-action="delete" data-form-id="${escapeHtml(form.id)}">删除</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  };

  const renderRecordFilters = (state) => {
    els.recordFormFilterSelect.innerHTML = ['<option value="all">全部表单</option>']
      .concat(state.forms.map((form) => `<option value="${escapeHtml(form.id)}">${escapeHtml(form.name)}</option>`))
      .join("");

    if (view.recordFilters.formId !== "all" && !state.forms.some((form) => form.id === view.recordFilters.formId)) {
      view.recordFilters.formId = "all";
      view.recordFilters.fieldFilters = {};
    }

    els.recordFormFilterSelect.value = view.recordFilters.formId;
    els.recordStatusFilterSelect.value = view.recordFilters.status;
    els.recordKeywordFilterInput.value = view.recordFilters.keyword;
  };

  const renderDynamicFilters = (state) => {
    if (view.recordFilters.formId === "all") {
      view.recordFilters.fieldFilters = {};
      els.dynamicFilterBar.innerHTML = '<div class="empty-state">请选择具体表单后，可按该表单的登记字段继续筛选。</div>';
      return;
    }

    const form = workbench.getFormById(state, view.recordFilters.formId);

    if (!form) {
      view.recordFilters.fieldFilters = {};
      els.dynamicFilterBar.innerHTML = '<div class="empty-state">当前表单不存在，请重新选择。</div>';
      return;
    }

    const filterableFieldIds = new Set(workbench.getFilterableFields(form).map((field) => field.id));
    Object.keys(view.recordFilters.fieldFilters).forEach((fieldId) => {
      if (!filterableFieldIds.has(fieldId)) {
        delete view.recordFilters.fieldFilters[fieldId];
      }
    });

    const html = workbench
      .getFilterableFields(form)
      .map((field) => {
        const currentValue = view.recordFilters.fieldFilters[field.id];

        if (field.type === "single-select") {
          return `
            <label class="form-item dynamic-filter">
              <span class="form-item__label">${escapeHtml(field.label)}</span>
              <select class="form-item__control" data-filter-select="${escapeHtml(field.id)}">
                <option value="">全部</option>
                ${field.options
                  .map(
                    (option) =>
                      `<option value="${escapeHtml(option)}"${currentValue === option ? ' selected="selected"' : ""}>${escapeHtml(option)}</option>`
                  )
                  .join("")}
              </select>
            </label>
          `;
        }

        if (field.type === "multi-select") {
          const selectedValues = Array.isArray(currentValue) ? currentValue : [];
          return `
            <div class="dynamic-filter dynamic-filter--chips">
              <div class="form-item__label">${escapeHtml(field.label)}</div>
              <div class="chip-filter-row">
                ${field.options
                  .map((option) => {
                    const active = selectedValues.includes(option);
                    return `<button class="choice-chip choice-chip--small${active ? " is-selected" : ""}" type="button" data-filter-chip="${escapeHtml(field.id)}" data-filter-value="${escapeHtml(option)}">${escapeHtml(option)}</button>`;
                  })
                  .join("")}
              </div>
            </div>
          `;
        }

        return `
          <label class="form-item dynamic-filter">
            <span class="form-item__label">${escapeHtml(field.label)}</span>
            <input class="form-item__control" type="text" value="${escapeHtml(currentValue || "")}" placeholder="请输入${escapeHtml(field.label)}" data-filter-input="${escapeHtml(field.id)}" />
          </label>
        `;
      })
      .join("");

    els.dynamicFilterBar.innerHTML = html || '<div class="empty-state">该表单暂无可筛选字段</div>';
  };

  const renderSelectionSummary = (state) => {
    const filteredCount = getFilteredRecords(state).length;
    els.selectionSummary.textContent = `当前筛选结果 ${filteredCount} 人，已选 ${view.selectedRecordIds.size} 人`;
  };

  const renderRecordTable = (state) => {
    const records = getFilteredRecords(state);

    if (!records.length) {
      els.recordTableBody.innerHTML = '<tr><td colspan="9" class="table-empty">当前筛选条件下暂无登记用户</td></tr>';
      return;
    }

    els.recordTableBody.innerHTML = records
      .map((record) => {
        const form = workbench.getFormById(state, record.formId);
        const checked = view.selectedRecordIds.has(record.id);

        return `
          <tr>
            <td class="table-check">
              <label class="record-check">
                <input type="checkbox" data-record-checkbox="${escapeHtml(record.id)}"${checked ? ' checked="checked"' : ""} />
              </label>
            </td>
            <td>
              <div class="table-title">${escapeHtml(getRecordPrimaryName(record))}</div>
              <div class="table-sub">${escapeHtml(record.id)}</div>
            </td>
            <td>${escapeHtml(record.data.mobile || "未填写")}</td>
            <td>${escapeHtml(form ? form.name : "未知表单")}</td>
            <td><div class="table-summary">${escapeHtml(getRecordSummary(record, form))}</div></td>
            <td>${escapeHtml(workbench.formatDateTime(record.createdAt))}</td>
            <td><span class="status-pill status-pill--${escapeHtml(record.status)}">${escapeHtml(workbench.recordStatusLabel(record.status))}</span></td>
            <td>${escapeHtml(record.pushCount || 0)}</td>
            <td>
              <div class="table-actions">
                <button class="table-link" type="button" data-record-action="form" data-form-id="${escapeHtml(record.formId)}">查看表单</button>
                ${
                  record.status !== "contacted"
                    ? `<button class="table-link" type="button" data-record-action="contacted" data-record-id="${escapeHtml(record.id)}">标记已联系</button>`
                    : '<span class="table-link table-link--muted">已联系</span>'
                }
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  };

  const renderPushModal = (state) => {
    const filteredCount = getFilteredRecords(state).length;
    const currentChannel = els.pushChannelSelect.value || workbench.PUSH_CHANNELS[0].value;
    const activeForm = view.recordFilters.formId === "all" ? null : workbench.getFormById(state, view.recordFilters.formId);
    const filterSummary = workbench.summarizeFilters(activeForm, view.recordFilters);

    els.pushChannelSelect.innerHTML = workbench.PUSH_CHANNELS
      .map(
        (item) =>
          `<option value="${escapeHtml(item.value)}"${item.value === currentChannel ? ' selected="selected"' : ""}>${escapeHtml(item.label)}</option>`
      )
      .join("");

    if (!els.pushTitleInput.value) {
      els.pushTitleInput.value = "房产超市最新登记通知";
    }

    if (!els.pushContentInput.value) {
      els.pushContentInput.value = "我们已根据您的登记内容匹配了相关房源与活动信息，可回复预约顾问跟进。";
    }

    els.pushTargetSummary.textContent = view.selectedRecordIds.size
      ? `当前已选择 ${view.selectedRecordIds.size} 位登记用户。当前筛选条件：${filterSummary}`
      : `当前筛选命中 ${filteredCount} 位登记用户。当前筛选条件：${filterSummary}`;
  };

  const renderFieldEditor = () => {
    const draft = view.modal.formDraft;
    const field = getSelectedDraftField();

    els.fieldTypeSelect.innerHTML = Object.entries(workbench.FIELD_TYPES)
      .map(
        ([value, item]) =>
          `<option value="${escapeHtml(value)}"${field && field.type === value ? ' selected="selected"' : ""}>${escapeHtml(item.label)}</option>`
      )
      .join("");

    if (!draft || !field) {
      els.fieldEditorTitle.textContent = "请选择字段";
      els.fieldEditorMeta.textContent = "新增或选择字段后，再继续编辑。";
      [
        els.moveFieldUpBtn,
        els.moveFieldDownBtn,
        els.deleteFieldBtn,
        els.fieldLabelInput,
        els.fieldTypeSelect,
        els.fieldPlaceholderInput,
        els.fieldHintInput,
        els.fieldRequiredInput,
        els.fieldFilterableInput,
        els.fieldListableInput,
        els.fieldOptionsInput
      ].forEach((element) => {
        element.disabled = true;
      });
      els.fieldOptionsGroup.hidden = true;
      return;
    }

    const index = draft.fields.findIndex((item) => item.id === field.id);
    els.fieldEditorTitle.textContent = field.label;
    els.fieldEditorMeta.textContent = `字段标识：${field.id}`;
    els.moveFieldUpBtn.disabled = index <= 0;
    els.moveFieldDownBtn.disabled = index === draft.fields.length - 1;
    els.deleteFieldBtn.disabled = draft.fields.length <= 1;
    els.fieldLabelInput.disabled = false;
    els.fieldTypeSelect.disabled = false;
    els.fieldPlaceholderInput.disabled = false;
    els.fieldHintInput.disabled = false;
    els.fieldRequiredInput.disabled = false;
    els.fieldFilterableInput.disabled = false;
    els.fieldListableInput.disabled = false;
    els.fieldOptionsInput.disabled = false;

    els.fieldLabelInput.value = field.label;
    els.fieldPlaceholderInput.value = field.placeholder;
    els.fieldHintInput.value = field.hint;
    els.fieldRequiredInput.checked = field.required;
    els.fieldFilterableInput.checked = field.filterable;
    els.fieldListableInput.checked = field.listable;
    els.fieldOptionsInput.value = field.options.join("\n");
    els.fieldOptionsGroup.hidden = !isSelectField(field);
  };

  const renderFieldList = () => {
    const draft = view.modal.formDraft;

    if (!draft) {
      els.fieldList.innerHTML = '<div class="empty-state">请先打开新增或编辑弹窗</div>';
      renderFieldEditor();
      return;
    }

    els.fieldList.innerHTML = draft.fields
      .map((field) => {
        const active = field.id === view.modal.selectedFieldId;
        const tags = [
          field.required ? '<span class="mini-tag mini-tag--accent">必填</span>' : "",
          field.filterable ? '<span class="mini-tag">可筛选</span>' : "",
          field.listable ? '<span class="mini-tag">列表展示</span>' : ""
        ]
          .filter(Boolean)
          .join("");

        return `
          <button class="field-card${active ? " is-active" : ""}" type="button" data-field-id="${escapeHtml(field.id)}">
            <div class="field-card__head">
              <span class="field-card__title">${escapeHtml(field.label)}</span>
              <span class="field-card__type">${escapeHtml(workbench.FIELD_TYPES[field.type].label)}</span>
            </div>
            <div class="field-card__meta">${tags || '<span class="field-card__muted">基础字段</span>'}</div>
          </button>
        `;
      })
      .join("");

    renderFieldEditor();
  };

  const renderFormModal = () => {
    const draft = view.modal.formDraft;

    if (!draft) {
      return;
    }

    els.formModalTitle.textContent = view.modal.formMode === "create" ? "新增登记表单" : "编辑登记表单";
    els.saveFormBtn.textContent = view.modal.formMode === "create" ? "创建表单" : "保存修改";
    els.formNameInput.value = draft.name;
    els.formStartInput.value = workbench.toDatetimeLocalValue(draft.registrationStart);
    els.formEndInput.value = workbench.toDatetimeLocalValue(draft.registrationEnd);
    els.formActivityInput.value = draft.activityName;
    els.pageTitleInput.value = draft.page.title;
    els.pagePromptInput.value = draft.page.prompt;
    renderFieldList();
  };

  const renderQrModal = (state) => {
    const form = workbench.getFormById(state, view.modal.qrFormId);

    if (!form) {
      els.qrModalTitle.textContent = "登记页二维码";
      els.qrCodeImage.hidden = true;
      els.qrCodeImage.removeAttribute("src");
      els.qrFallback.innerHTML = "";
      els.miniProgramPathOutput.textContent = "未找到表单";
      els.qrLandingOutput.textContent = "";
      els.openFormLink.href = "./form.html";
      return;
    }

    els.qrModalTitle.textContent = `${form.name} 二维码`;
    els.qrFallback.innerHTML = qrPatternMarkup(form.qrLandingUrl);
    els.qrCodeImage.hidden = false;
    els.qrCodeImage.src = workbench.getQrImageUrl(form.id);
    els.miniProgramPathOutput.textContent = form.miniProgramPath;
    els.qrLandingOutput.textContent = form.qrLandingUrl;
    els.openFormLink.href = `./form.html?formId=${encodeURIComponent(form.id)}`;
  };

  const render = (state) => {
    renderTabs();
    renderFormFilters(state);
    renderFormTable(state);
    renderRecordFilters(state);
    renderDynamicFilters(state);
    renderSelectionSummary(state);
    renderRecordTable(state);
    renderPushModal(state);

    if (view.modal.formDraft) {
      renderFormModal();
    }

    if (view.modal.qrFormId) {
      renderQrModal(state);
    }
  };

  const openCreateFormModal = () => {
    const draft = clone(workbench.createBlankForm());
    view.modal.formMode = "create";
    view.modal.formDraft = draft;
    view.modal.selectedFieldId = draft.fields[0] ? draft.fields[0].id : "";
    renderFormModal();
    openModal("formModal");
  };

  const openEditFormModal = (formId) => {
    const state = workbench.loadState();
    const form = workbench.getFormById(state, formId);

    if (!form) {
      showToast("未找到对应的登记表单");
      return;
    }

    view.modal.formMode = "edit";
    view.modal.formDraft = clone(form);
    view.modal.selectedFieldId = form.fields[0] ? form.fields[0].id : "";
    renderFormModal();
    openModal("formModal");
  };

  const openQrModal = (formId) => {
    view.modal.qrFormId = formId;
    renderQrModal(workbench.loadState());
    openModal("qrModal");
  };

  const openPushModal = () => {
    renderPushModal(workbench.loadState());
    openModal("pushModal");
  };

  const updateDraftForm = (updater) => {
    if (!view.modal.formDraft) {
      return;
    }

    updater(view.modal.formDraft);
    renderFormModal();
  };

  const updateSelectedDraftField = (updater) => {
    updateDraftForm((draft) => {
      const field = draft.fields.find((item) => item.id === view.modal.selectedFieldId);
      if (!field) {
        return;
      }

      updater(field, draft);
    });
  };

  const addDraftField = () => {
    const field = workbench.createBlankField();
    updateDraftForm((draft) => {
      draft.fields.push(field);
      view.modal.selectedFieldId = field.id;
    });
  };

  const moveDraftField = (direction) => {
    updateDraftForm((draft) => {
      const index = draft.fields.findIndex((field) => field.id === view.modal.selectedFieldId);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= draft.fields.length) {
        return;
      }

      const moved = draft.fields.splice(index, 1)[0];
      draft.fields.splice(nextIndex, 0, moved);
    });
  };

  const deleteDraftField = () => {
    const draft = view.modal.formDraft;
    const field = getSelectedDraftField();

    if (!draft || !field) {
      return;
    }

    if (draft.fields.length === 1) {
      showToast("至少保留一个登记字段");
      return;
    }

    if (!window.confirm(`确认删除字段“${field.label}”吗？`)) {
      return;
    }

    updateDraftForm((nextDraft) => {
      const index = nextDraft.fields.findIndex((item) => item.id === field.id);
      nextDraft.fields = nextDraft.fields.filter((item) => item.id !== field.id);
      const fallbackField = nextDraft.fields[index] || nextDraft.fields[index - 1] || nextDraft.fields[0] || null;
      view.modal.selectedFieldId = fallbackField ? fallbackField.id : "";
    });
  };

  const normalizeRecordDataForForm = (record, form) => {
    const nextData = {};

    form.fields.forEach((field) => {
      const currentValue = record.data[field.id];

      if (field.type === "multi-select") {
        nextData[field.id] = Array.isArray(currentValue) ? currentValue : currentValue ? [String(currentValue)] : [];
        return;
      }

      nextData[field.id] = typeof currentValue === "string" ? currentValue : "";
    });

    return nextData;
  };

  const saveFormModal = () => {
    const draft = view.modal.formDraft;

    if (!draft) {
      return;
    }

    if (!draft.name.trim()) {
      showToast("请先填写表单名称");
      return;
    }

    if (!draft.page.title.trim()) {
      showToast("请先填写登记页标题");
      return;
    }

    if (!draft.registrationStart || !draft.registrationEnd) {
      showToast("请先设置登记开始和结束时间");
      return;
    }

    const start = new Date(draft.registrationStart);
    const end = new Date(draft.registrationEnd);
    if (start > end) {
      showToast("登记开始时间不能晚于结束时间");
      return;
    }

    draft.miniProgramPath = workbench.buildMiniProgramPath(draft.id);
    draft.qrLandingUrl = workbench.buildQrLandingUrl(draft.id);

    workbench.updateState((state) => {
      if (view.modal.formMode === "create") {
        state.forms.unshift(clone(draft));
        return;
      }

      state.forms = state.forms.map((form) => (form.id === draft.id ? clone(draft) : form));
      state.records = state.records.map((record) => {
        if (record.formId !== draft.id) {
          return record;
        }

        return {
          ...record,
          data: normalizeRecordDataForForm(record, draft)
        };
      });
    });

    closeModal("formModal");
    render(workbench.loadState());
    showToast(view.modal.formMode === "create" ? "已新增登记表单" : "已保存表单修改");
  };

  const deleteForm = (formId) => {
    const state = workbench.loadState();
    const form = workbench.getFormById(state, formId);

    if (!form) {
      return;
    }

    const recordIds = state.records.filter((record) => record.formId === form.id).map((record) => record.id);
    const tips = recordIds.length ? `该表单下还有 ${recordIds.length} 条登记记录，会一并删除。` : "该表单下暂无登记记录。";

    if (!window.confirm(`确认删除“${form.name}”吗？${tips}`)) {
      return;
    }

    const removedRecordIds = new Set(recordIds);

    workbench.updateState((draft) => {
      draft.forms = draft.forms.filter((item) => item.id !== form.id);
      draft.records = draft.records.filter((record) => record.formId !== form.id);
      draft.pushHistory = draft.pushHistory
        .map((item) => ({
          ...item,
          targetIds: item.targetIds.filter((id) => !removedRecordIds.has(id))
        }))
        .filter((item) => item.targetIds.length);
    });

    view.selectedRecordIds = new Set(Array.from(view.selectedRecordIds).filter((id) => !removedRecordIds.has(id)));

    if (view.recordFilters.formId === form.id) {
      view.recordFilters.formId = "all";
      view.recordFilters.fieldFilters = {};
    }

    render(workbench.loadState());
    showToast("已删除登记表单");
  };

  const markRecordContacted = (recordId) => {
    workbench.updateState((state) => {
      state.records = state.records.map((record) => (record.id === recordId ? { ...record, status: "contacted" } : record));
    });
    render(workbench.loadState());
    showToast("已标记为已联系");
  };

  const handlePush = (mode) => {
    const state = workbench.loadState();
    const filteredRecords = getFilteredRecords(state);
    const ids = mode === "selected" ? Array.from(view.selectedRecordIds) : filteredRecords.map((record) => record.id);

    if (!ids.length) {
      showToast("当前没有可推送的登记用户");
      return;
    }

    const title = els.pushTitleInput.value.trim();
    const content = els.pushContentInput.value.trim();

    if (!title || !content) {
      showToast("请先填写推送标题和推送内容");
      return;
    }

    const activeForm = view.recordFilters.formId === "all" ? null : workbench.getFormById(state, view.recordFilters.formId);
    const filterSummary =
      mode === "selected"
        ? `手动选择：${ids.length} 人${activeForm ? `；表单：${activeForm.name}` : ""}`
        : workbench.summarizeFilters(activeForm, view.recordFilters);

    workbench.pushToRecipients({
      ids,
      channel: els.pushChannelSelect.value,
      title,
      content,
      filterSummary
    });

    if (mode === "filtered") {
      view.selectedRecordIds = new Set(ids);
    }

    closeModal("pushModal");
    render(workbench.loadState());
    showToast(`已向 ${ids.length} 位登记用户发起推送`);
  };

  const copyMiniProgramPath = async () => {
    const state = workbench.loadState();
    const form = workbench.getFormById(state, view.modal.qrFormId);

    if (!form) {
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(form.miniProgramPath);
      } else {
        throw new Error("clipboard unavailable");
      }
    } catch (error) {
      const temp = document.createElement("textarea");
      temp.value = form.miniProgramPath;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
    }

    showToast("已复制小程序路径");
  };

  els.workspaceTabs.forEach((button) => {
    button.addEventListener("click", () => {
      view.tab = button.dataset.tab;
      render(workbench.loadState());
    });
  });

  els.formKeywordInput.addEventListener("input", (event) => {
    view.formFilters.keyword = event.target.value;
    render(workbench.loadState());
  });

  els.formStatusSelect.addEventListener("change", (event) => {
    view.formFilters.status = event.target.value;
    render(workbench.loadState());
  });

  els.formActivitySelect.addEventListener("change", (event) => {
    view.formFilters.activity = event.target.value;
    render(workbench.loadState());
  });

  els.createFormBtn.addEventListener("click", () => {
    openCreateFormModal();
  });

  els.formTableBody.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-form-action]");
    if (!actionTarget) {
      return;
    }

    const formId = actionTarget.dataset.formId;
    const action = actionTarget.dataset.formAction;

    if (action === "edit") {
      openEditFormModal(formId);
      return;
    }

    if (action === "qr") {
      openQrModal(formId);
      return;
    }

    if (action === "delete") {
      deleteForm(formId);
    }
  });

  els.recordFormFilterSelect.addEventListener("change", (event) => {
    view.recordFilters.formId = event.target.value;
    view.recordFilters.fieldFilters = {};
    render(workbench.loadState());
  });

  els.recordStatusFilterSelect.addEventListener("change", (event) => {
    view.recordFilters.status = event.target.value;
    render(workbench.loadState());
  });

  els.recordKeywordFilterInput.addEventListener("input", (event) => {
    view.recordFilters.keyword = event.target.value;
    render(workbench.loadState());
  });

  els.dynamicFilterBar.addEventListener("input", (event) => {
    const fieldId = event.target.dataset.filterInput;
    if (!fieldId) {
      return;
    }

    view.recordFilters.fieldFilters[fieldId] = event.target.value;
    render(workbench.loadState());
  });

  els.dynamicFilterBar.addEventListener("change", (event) => {
    const fieldId = event.target.dataset.filterSelect;
    if (!fieldId) {
      return;
    }

    view.recordFilters.fieldFilters[fieldId] = event.target.value;
    render(workbench.loadState());
  });

  els.dynamicFilterBar.addEventListener("click", (event) => {
    const target = event.target.closest("[data-filter-chip]");
    if (!target) {
      return;
    }

    const fieldId = target.dataset.filterChip;
    const value = target.dataset.filterValue;
    const current = Array.isArray(view.recordFilters.fieldFilters[fieldId]) ? view.recordFilters.fieldFilters[fieldId] : [];

    view.recordFilters.fieldFilters[fieldId] = current.includes(value)
      ? current.filter((item) => item !== value)
      : current.concat(value);

    render(workbench.loadState());
  });

  els.recordTableBody.addEventListener("change", (event) => {
    const recordId = event.target.dataset.recordCheckbox;
    if (!recordId) {
      return;
    }

    if (event.target.checked) {
      view.selectedRecordIds.add(recordId);
    } else {
      view.selectedRecordIds.delete(recordId);
    }

    render(workbench.loadState());
  });

  els.recordTableBody.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-record-action]");
    if (!actionTarget) {
      return;
    }

    if (actionTarget.dataset.recordAction === "contacted") {
      markRecordContacted(actionTarget.dataset.recordId);
      return;
    }

    if (actionTarget.dataset.recordAction === "form") {
      openEditFormModal(actionTarget.dataset.formId);
    }
  });

  els.selectFilteredBtn.addEventListener("click", () => {
    const ids = getFilteredRecords(workbench.loadState()).map((record) => record.id);
    view.selectedRecordIds = new Set(ids);
    render(workbench.loadState());
    showToast(`已选择当前筛选结果中的 ${ids.length} 人`);
  });

  els.clearSelectionBtn.addEventListener("click", () => {
    view.selectedRecordIds.clear();
    render(workbench.loadState());
    showToast("已清空所选用户");
  });

  els.openPushModalBtn.addEventListener("click", () => {
    openPushModal();
  });

  els.formNameInput.addEventListener("change", (event) => {
    updateDraftForm((draft) => {
      draft.name = event.target.value;
      if (!draft.page.title.trim()) {
        draft.page.title = draft.name;
      }
    });
  });

  els.formStartInput.addEventListener("change", (event) => {
    updateDraftForm((draft) => {
      draft.registrationStart = event.target.value ? new Date(event.target.value).toISOString() : "";
    });
  });

  els.formEndInput.addEventListener("change", (event) => {
    updateDraftForm((draft) => {
      draft.registrationEnd = event.target.value ? new Date(event.target.value).toISOString() : "";
    });
  });

  els.formActivityInput.addEventListener("change", (event) => {
    updateDraftForm((draft) => {
      draft.activityName = event.target.value;
    });
  });

  els.pageTitleInput.addEventListener("change", (event) => {
    updateDraftForm((draft) => {
      draft.page.title = event.target.value;
    });
  });

  els.pagePromptInput.addEventListener("change", (event) => {
    updateDraftForm((draft) => {
      draft.page.prompt = event.target.value;
    });
  });

  els.fieldList.addEventListener("click", (event) => {
    const target = event.target.closest("[data-field-id]");
    if (!target) {
      return;
    }

    view.modal.selectedFieldId = target.dataset.fieldId;
    renderFormModal();
  });

  els.addFieldBtn.addEventListener("click", addDraftField);
  els.moveFieldUpBtn.addEventListener("click", () => moveDraftField(-1));
  els.moveFieldDownBtn.addEventListener("click", () => moveDraftField(1));
  els.deleteFieldBtn.addEventListener("click", deleteDraftField);

  els.fieldLabelInput.addEventListener("change", (event) => {
    updateSelectedDraftField((field) => {
      field.label = event.target.value || "新字段";
    });
  });

  els.fieldTypeSelect.addEventListener("change", (event) => {
    updateSelectedDraftField((field) => {
      field.type = event.target.value;
      if (isSelectField(field) && !field.options.length) {
        field.options = ["示例选项 A", "示例选项 B"];
      }
    });
  });

  els.fieldPlaceholderInput.addEventListener("change", (event) => {
    updateSelectedDraftField((field) => {
      field.placeholder = event.target.value;
    });
  });

  els.fieldHintInput.addEventListener("change", (event) => {
    updateSelectedDraftField((field) => {
      field.hint = event.target.value;
    });
  });

  els.fieldRequiredInput.addEventListener("change", (event) => {
    updateSelectedDraftField((field) => {
      field.required = event.target.checked;
    });
  });

  els.fieldFilterableInput.addEventListener("change", (event) => {
    updateSelectedDraftField((field) => {
      field.filterable = event.target.checked;
    });
  });

  els.fieldListableInput.addEventListener("change", (event) => {
    updateSelectedDraftField((field) => {
      field.listable = event.target.checked;
    });
  });

  els.fieldOptionsInput.addEventListener("change", (event) => {
    updateSelectedDraftField((field) => {
      field.options = workbench.normalizeOptions(event.target.value);
    });
  });

  els.saveFormBtn.addEventListener("click", saveFormModal);
  els.copyMiniPathBtn.addEventListener("click", () => {
    copyMiniProgramPath();
  });
  els.pushSelectedBtn.addEventListener("click", () => {
    handlePush("selected");
  });
  els.pushFilteredBtn.addEventListener("click", () => {
    handlePush("filtered");
  });

  els.modalBackdrop.addEventListener("click", () => {
    closeModal();
  });

  els.modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(button.dataset.closeModal);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && view.modal.activeId) {
      closeModal();
    }
  });

  els.resetDemoBtn.addEventListener("click", () => {
    if (!window.confirm("确认恢复为默认示例数据吗？当前新增的表单、登记用户和推送记录都会被重置。")) {
      return;
    }

    view.formFilters = {
      keyword: "",
      status: "all",
      activity: "all"
    };
    view.recordFilters = {
      formId: "all",
      status: "all",
      keyword: "",
      fieldFilters: {}
    };
    view.selectedRecordIds.clear();
    closeModal();
    workbench.resetState();
    render(workbench.loadState());
    showToast("已恢复默认示例数据");
  });

  els.qrCodeImage.addEventListener("error", () => {
    els.qrCodeImage.hidden = true;
  });

  els.qrCodeImage.addEventListener("load", () => {
    els.qrCodeImage.hidden = false;
  });

  workbench.subscribe((state) => {
    render(state);
  });

  render(workbench.loadState());
})();
