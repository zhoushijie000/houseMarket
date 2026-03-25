(() => {
  const workbench = window.registrationWorkbench;

  if (!workbench) {
    return;
  }

  const $ = (id) => document.getElementById(id);
  const escapeHtml = workbench.escapeHtml;
  const params = new URLSearchParams(window.location.search);

  const els = {
    formNameBadge: $("formNameBadge"),
    pageTitle: $("pageTitle"),
    pageSubtitle: $("pageSubtitle"),
    pageMeta: $("pageMeta"),
    registrationForm: $("registrationForm"),
    formError: $("formError"),
    privacyNote: $("privacyNote"),
    successSheet: $("successSheet"),
    successTitle: $("successTitle"),
    successMessage: $("successMessage"),
    submitAnotherBtn: $("submitAnotherBtn")
  };

  const view = {
    formId: params.get("formId") || "",
    values: {}
  };

  const isEmpty = (field, value) => {
    if (field.type === "multi-select") {
      return !Array.isArray(value) || !value.length;
    }

    return !String(value || "").trim();
  };

  const showError = (message) => {
    els.formError.hidden = false;
    els.formError.textContent = message;
  };

  const hideError = () => {
    els.formError.hidden = true;
    els.formError.textContent = "";
  };

  const resolveCurrentForm = (state) => {
    const requested = view.formId ? workbench.getFormById(state, view.formId) : null;
    if (requested) {
      return requested;
    }

    const activeForm = state.forms.find((form) => workbench.getFormRuntimeStatus(form) === "active");
    return activeForm || state.forms[0] || null;
  };

  const pruneValues = (form) => {
    if (!form) {
      view.values = {};
      return;
    }

    const nextValues = {};

    form.fields.forEach((field) => {
      if (field.type === "multi-select") {
        nextValues[field.id] = Array.isArray(view.values[field.id]) ? view.values[field.id] : [];
      } else {
        nextValues[field.id] = typeof view.values[field.id] === "string" ? view.values[field.id] : "";
      }
    });

    view.values = nextValues;
  };

  const renderFieldControl = (field) => {
    const value = view.values[field.id];
    const requiredTag = field.required ? '<span class="required-tag">必填</span>' : "";

    if (field.type === "single-select" || field.type === "multi-select") {
      const chips = field.options
        .map((option) => {
          const selected =
            field.type === "single-select"
              ? value === option
              : Array.isArray(value) && value.includes(option);

          return `
            <button
              class="choice-chip${selected ? " is-selected" : ""}"
              type="button"
              data-option-field="${escapeHtml(field.id)}"
              data-option-value="${escapeHtml(option)}"
            >${escapeHtml(option)}</button>
          `;
        })
        .join("");

      return `
        <div class="dynamic-field">
          <div class="dynamic-field__head">
            <span class="dynamic-field__label">${escapeHtml(field.label)}</span>
            ${requiredTag}
          </div>
          <div class="choice-group">${chips || '<div class="empty-inline">请先在后台配置字段选项</div>'}</div>
          ${field.hint ? `<div class="dynamic-field__hint">${escapeHtml(field.hint)}</div>` : ""}
        </div>
      `;
    }

    if (field.type === "textarea") {
      return `
        <label class="dynamic-field">
          <div class="dynamic-field__head">
            <span class="dynamic-field__label">${escapeHtml(field.label)}</span>
            ${requiredTag}
          </div>
          <textarea
            class="text-control text-control--textarea"
            rows="4"
            placeholder="${escapeHtml(field.placeholder || "")}"
            data-input-field="${escapeHtml(field.id)}"
          >${escapeHtml(value || "")}</textarea>
          ${field.hint ? `<div class="dynamic-field__hint">${escapeHtml(field.hint)}</div>` : ""}
        </label>
      `;
    }

    const inputMode = field.type === "phone" ? ' inputmode="numeric" maxlength="11"' : "";

    return `
      <label class="dynamic-field">
        <div class="dynamic-field__head">
          <span class="dynamic-field__label">${escapeHtml(field.label)}</span>
          ${requiredTag}
        </div>
        <input
          class="text-control"
          type="text"
          placeholder="${escapeHtml(field.placeholder || "")}"
          value="${escapeHtml(value || "")}"
          data-input-field="${escapeHtml(field.id)}"${inputMode}
        />
        ${field.hint ? `<div class="dynamic-field__hint">${escapeHtml(field.hint)}</div>` : ""}
      </label>
    `;
  };

  const renderEmptyState = (message) => {
    els.formNameBadge.textContent = "暂无登记表单";
    els.pageTitle.textContent = "当前没有可用的登记页";
    els.pageSubtitle.textContent = message;
    els.pageMeta.innerHTML = "";
    els.registrationForm.innerHTML = "";
    els.privacyNote.textContent = "";
    document.title = "登记页";
  };

  const render = (state) => {
    const form = resolveCurrentForm(state);
    view.formId = form ? form.id : "";

    if (!form) {
      renderEmptyState("请先在后台新增登记表单并配置登记页。");
      return;
    }

    pruneValues(form);
    hideError();

    const runtimeStatus = workbench.getFormRuntimeStatus(form);
    const statusMeta = workbench.getFormStatusMeta(runtimeStatus);
    const statusText = `登记状态：${statusMeta.label}`;
    const activityText = form.activityName ? `专场活动：${form.activityName}` : "专场活动：未绑定";
    const timeText = `登记时间：${workbench.formatDateRange(form.registrationStart, form.registrationEnd)}`;

    document.title = form.page.title || "登记页";
    els.formNameBadge.textContent = form.name;
    els.pageTitle.textContent = form.page.title;
    els.pageSubtitle.textContent = form.page.prompt;
    els.pageMeta.innerHTML = [statusText, activityText, timeText].map((text) => `<span>${escapeHtml(text)}</span>`).join("");
    els.privacyNote.textContent = "提交即表示您同意接收房源推荐、活动通知与顾问联系。";
    els.successTitle.textContent = `${form.name} 提交成功`;
    els.successMessage.textContent = "我们已收到您的登记信息，后续将根据登记内容为您安排活动提醒与顾问跟进。";

    const formFields = form.fields.map((field) => renderFieldControl(field)).join("");
    const disabledNotice =
      runtimeStatus === "active"
        ? ""
        : `<div class="form-error form-error--inline">${runtimeStatus === "upcoming" ? "当前表单尚未开始登记，请在开放时间内提交。" : "当前表单已结束登记，如需继续请联系运营人员。"} </div>`;

    const submitButton = `
      <button class="button button--primary button--block button--submit" type="submit"${runtimeStatus === "active" ? "" : " disabled"}>
        ${runtimeStatus === "active" ? "提交登记" : "暂不可提交"}
      </button>
    `;

    els.registrationForm.innerHTML = formFields + disabledNotice + submitButton;
  };

  const validate = (form) => {
    for (const field of form.fields) {
      const value = view.values[field.id];

      if (field.required && isEmpty(field, value)) {
        return `请先填写${field.label}`;
      }

      if (field.type === "phone" && !isEmpty(field, value) && !/^1\d{10}$/.test(String(value).trim())) {
        return "请输入正确的 11 位手机号";
      }
    }

    return "";
  };

  const toggleOption = (form, fieldId, optionValue) => {
    const field = form.fields.find((item) => item.id === fieldId);

    if (!field) {
      return;
    }

    hideError();

    if (field.type === "single-select") {
      view.values[field.id] = optionValue;
      render(workbench.loadState());
      return;
    }

    const current = Array.isArray(view.values[field.id]) ? view.values[field.id] : [];
    const hasValue = current.includes(optionValue);
    view.values[field.id] = hasValue ? current.filter((item) => item !== optionValue) : current.concat(optionValue);
    render(workbench.loadState());
  };

  els.registrationForm.addEventListener("input", (event) => {
    const fieldId = event.target.dataset.inputField;

    if (!fieldId) {
      return;
    }

    view.values[fieldId] = event.target.value;
    hideError();
  });

  els.registrationForm.addEventListener("click", (event) => {
    const target = event.target.closest("[data-option-field]");
    if (!target) {
      return;
    }

    const state = workbench.loadState();
    const form = resolveCurrentForm(state);
    if (!form) {
      return;
    }

    toggleOption(form, target.dataset.optionField, target.dataset.optionValue);
  });

  els.registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const state = workbench.loadState();
    const form = resolveCurrentForm(state);

    if (!form) {
      showError("当前没有可提交的登记表单");
      return;
    }

    if (workbench.getFormRuntimeStatus(form) !== "active") {
      showError("当前登记表单暂不可提交，请在开放时间内访问");
      return;
    }

    const validationMessage = validate(form);

    if (validationMessage) {
      showError(validationMessage);
      return;
    }

    workbench.addRegistration({
      formId: form.id,
      values: view.values
    });

    view.values = {};
    hideError();
    render(workbench.loadState());
    els.successSheet.hidden = false;
  });

  els.submitAnotherBtn.addEventListener("click", () => {
    els.successSheet.hidden = true;
  });

  workbench.subscribe((state) => {
    render(state);
  });

  render(workbench.loadState());
})();
