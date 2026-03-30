const workbench = window.registrationWorkbench;

if (!workbench) {
  throw new Error("registrationWorkbench is not available");
}

const $ = (id) => document.getElementById(id);

const els = {
  modalBackdrop: $("modalBackdrop"),
  resetDemoBtn: $("resetDemoBtn"),
  batchPushBtn: $("batchPushBtn"),
  cityFilterSelect: $("cityFilterSelect"),
  districtFilterSelect: $("districtFilterSelect"),
  activityFilterSelect: $("activityFilterSelect"),
  recordStatusFilterSelect: $("recordStatusFilterSelect"),
  keywordFilterInput: $("keywordFilterInput"),
  selectionSummary: $("selectionSummary"),
  selectFilteredBtn: $("selectFilteredBtn"),
  clearSelectionBtn: $("clearSelectionBtn"),
  recordTableBody: $("recordTableBody"),
  pushModal: $("pushModal"),
  pushModalTitle: $("pushModalTitle"),
  pushChannelSelect: $("pushChannelSelect"),
  pushTitleInput: $("pushTitleInput"),
  pushContentInput: $("pushContentInput"),
  pushTargetSummary: $("pushTargetSummary"),
  confirmPushBtn: $("confirmPushBtn")
};

const view = {
  filters: {
    city: "all",
    district: "all",
    activity: "all",
    status: "all",
    keyword: ""
  },
  selection: new Set(),
  push: {
    targetIds: [],
    mode: "batch",
    summary: ""
  }
};

const escapeHtml = (value) => workbench.escapeHtml(value);

const truncateText = (value, max = 54) => {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }
  return text.length > max ? `${text.slice(0, max)}...` : text;
};

const getRecordDistricts = (record) => {
  const value = record && record.data ? record.data.district : "";
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  return value ? [String(value).trim()] : [];
};

const inferCity = (record, form) => {
  if (record.data && record.data.city) {
    return String(record.data.city).trim();
  }
  const text = [record.data && record.data.activityName, form && form.name, form && form.activityName]
    .filter(Boolean)
    .join(" ");
  if (text.includes("成都")) {
    return "成都";
  }
  return "成都";
};

const getActivityTimeText = (record, form) => {
  if (record.data && record.data.activityTime) {
    return String(record.data.activityTime).trim();
  }
  if (record.data && record.data.session) {
    return String(record.data.session).trim();
  }
  if (form) {
    return workbench.formatDateRange(form.registrationStart, form.registrationEnd);
  }
  return "待补充";
};

const getLatestPush = (state, record) => {
  const matched = state.pushHistory.find((item) => Array.isArray(item.targetIds) && item.targetIds.includes(record.id));
  if (matched) {
    return matched;
  }
  if (!record.lastPushAt && !record.lastPushTitle) {
    return null;
  }
  return {
    title: record.lastPushTitle || "活动通知",
    content: "",
    createdAt: record.lastPushAt || ""
  };
};

const buildRecordViewModel = (state, record, formMap) => {
  const form = formMap.get(record.formId) || null;
  const districts = getRecordDistricts(record);
  const latestPush = getLatestPush(state, record);
  const latestMessageText = latestPush
    ? [latestPush.title || "", latestPush.content || ""].filter(Boolean).join("：")
    : "";

  return {
    id: record.id,
    record,
    form,
    name: record.data && record.data.name ? String(record.data.name).trim() : "房产超市用户",
    mobile: record.data && record.data.mobile ? String(record.data.mobile).trim() : "待同步",
    city: inferCity(record, form),
    districts,
    districtText: districts.length ? districts.join("、") : "待补充",
    activityName:
      (record.data && record.data.activityName ? String(record.data.activityName).trim() : "")
      || (form && form.activityName)
      || (form && form.name)
      || "活动登记",
    activityTime: getActivityTimeText(record, form),
    createdAtText: workbench.formatDateTime(record.createdAt),
    statusText: workbench.recordStatusLabel(record.status),
    latestPush,
    latestMessageText,
    sourceName: (form && form.name) || "活动登记信息"
  };
};

const getStateSnapshot = () => {
  const state = workbench.loadState();
  const formMap = new Map(state.forms.map((form) => [form.id, form]));
  return {
    state,
    records: state.records.map((record) => buildRecordViewModel(state, record, formMap))
  };
};

const matchesFilters = (item) => {
  if (view.filters.status !== "all" && item.record.status !== view.filters.status) {
    return false;
  }
  if (view.filters.city !== "all" && item.city !== view.filters.city) {
    return false;
  }
  if (view.filters.district !== "all" && !item.districts.includes(view.filters.district)) {
    return false;
  }
  if (view.filters.activity !== "all" && item.activityName !== view.filters.activity) {
    return false;
  }

  const keyword = view.filters.keyword.trim().toLowerCase();
  if (!keyword) {
    return true;
  }

  const searchText = [
    item.name,
    item.mobile,
    item.city,
    item.districtText,
    item.activityName,
    item.activityTime,
    item.latestMessageText,
    item.sourceName
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchText.includes(keyword);
};

const reconcileSelection = (records) => {
  const validIds = new Set(records.map((item) => item.id));
  Array.from(view.selection).forEach((id) => {
    if (!validIds.has(id)) {
      view.selection.delete(id);
    }
  });
};

const renderSelectOptions = (element, values, currentValue, allLabel) => {
  const uniqueValues = Array.from(new Set(values.filter(Boolean))).sort((left, right) => left.localeCompare(right, "zh-CN"));
  const normalizedValue = currentValue !== "all" && uniqueValues.includes(currentValue) ? currentValue : "all";
  element.innerHTML =
    [`<option value="all">${escapeHtml(allLabel)}</option>`]
      .concat(uniqueValues.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`))
      .join("");
  element.value = normalizedValue;
  return normalizedValue;
};

const renderFilters = (records) => {
  view.filters.city = renderSelectOptions(els.cityFilterSelect, records.map((item) => item.city), view.filters.city, "全部城市");
  view.filters.district = renderSelectOptions(
    els.districtFilterSelect,
    records.flatMap((item) => item.districts),
    view.filters.district,
    "全部区县"
  );
  view.filters.activity = renderSelectOptions(
    els.activityFilterSelect,
    records.map((item) => item.activityName),
    view.filters.activity,
    "全部活动"
  );
  els.recordStatusFilterSelect.value = view.filters.status;
  els.keywordFilterInput.value = view.filters.keyword;
};

const renderSelectionSummary = (allRecords, filteredRecords) => {
  const selectedCount = view.selection.size;
  if (selectedCount) {
    els.selectionSummary.textContent = `已选择 ${selectedCount} 位登记用户，当前筛选结果 ${filteredRecords.length} 位，批量推送时将优先发送给已选用户。`;
    return;
  }
  if (!allRecords.length) {
    els.selectionSummary.textContent = "当前暂无登记用户数据。";
    return;
  }
  els.selectionSummary.textContent = `当前筛选结果 ${filteredRecords.length} 位登记用户，可直接批量推送。`;
};

const getMessageHtml = (item) => {
  if (!item.latestPush) {
    return '<span class="message-empty">暂无消息展示</span>';
  }

  const title = item.latestPush.title || "活动通知";
  const content = item.latestPush.content || "已发送推送消息";
  const time = item.latestPush.createdAt ? workbench.formatDateTime(item.latestPush.createdAt) : "";

  return `
    <div class="message-snippet">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(truncateText(content))}</span>
      ${time ? `<small>${escapeHtml(time)}</small>` : ""}
    </div>
  `;
};

const renderTable = (filteredRecords) => {
  if (!filteredRecords.length) {
    els.recordTableBody.innerHTML = '<tr><td colspan="11" class="table-empty">暂无匹配的登记用户</td></tr>';
    return;
  }

  els.recordTableBody.innerHTML = filteredRecords
    .map((item) => {
      const checked = view.selection.has(item.id) ? "checked" : "";
      return `
        <tr class="${view.selection.has(item.id) ? "is-selected" : ""}">
          <td class="table-check">
            <input type="checkbox" data-record-check="${escapeHtml(item.id)}" ${checked} />
          </td>
          <td>
            <div class="table-user">
              <div class="table-user__name">${escapeHtml(item.name)}</div>
              <div class="table-user__meta">${escapeHtml(item.sourceName)}</div>
            </div>
          </td>
          <td>${escapeHtml(item.mobile)}</td>
          <td>${escapeHtml(item.city)}</td>
          <td>${escapeHtml(item.districtText)}</td>
          <td>${escapeHtml(item.activityName)}</td>
          <td>${escapeHtml(item.activityTime)}</td>
          <td>${escapeHtml(item.createdAtText)}</td>
          <td><span class="status-pill status-pill--${escapeHtml(item.record.status)}">${escapeHtml(item.statusText)}</span></td>
          <td>${getMessageHtml(item)}</td>
          <td>
            <button class="button button--ghost button--small" type="button" data-action="push" data-record-id="${escapeHtml(item.id)}">推送</button>
          </td>
        </tr>
      `;
    })
    .join("");
};

const getBatchTargetIds = (allRecords, filteredRecords) => {
  const selectedIds = allRecords.filter((item) => view.selection.has(item.id)).map((item) => item.id);
  return selectedIds.length ? selectedIds : filteredRecords.map((item) => item.id);
};

const closeModal = (modalId) => {
  const modal = $(modalId);
  if (!modal) {
    return;
  }
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  els.modalBackdrop.hidden = true;
  document.body.classList.remove("body-modal-open");
};

const openModal = (modalId) => {
  const modal = $(modalId);
  if (!modal) {
    return;
  }
  els.modalBackdrop.hidden = false;
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("body-modal-open");
};

const openPushModal = (mode, recordId = "") => {
  const { records } = getStateSnapshot();
  const filteredRecords = records.filter(matchesFilters);
  const targetIds = mode === "single" ? [recordId] : getBatchTargetIds(records, filteredRecords);

  view.push.mode = mode;
  view.push.targetIds = targetIds;
  view.push.summary =
    mode === "single"
      ? "当前将向 1 位登记用户发送消息。"
      : view.selection.size
        ? `当前将向已选择的 ${targetIds.length} 位登记用户发送消息。`
        : `当前将向筛选结果中的 ${targetIds.length} 位登记用户发送消息。`;

  els.pushModalTitle.textContent = mode === "single" ? "推送消息" : "批量推送";
  els.pushTargetSummary.textContent = view.push.summary;
  els.pushTitleInput.value = mode === "single" ? "活动消息通知" : "登记活动批量推送";
  els.pushContentInput.value = "";
  els.confirmPushBtn.disabled = !targetIds.length;
  openModal("pushModal");
};

const renderApp = () => {
  const { records } = getStateSnapshot();
  reconcileSelection(records);
  renderFilters(records);
  const filteredRecords = records.filter(matchesFilters);
  renderSelectionSummary(records, filteredRecords);
  renderTable(filteredRecords);
};

els.pushChannelSelect.innerHTML = workbench.PUSH_CHANNELS
  .map((item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`)
  .join("");

els.cityFilterSelect.addEventListener("change", (event) => {
  view.filters.city = event.target.value;
  renderApp();
});

els.districtFilterSelect.addEventListener("change", (event) => {
  view.filters.district = event.target.value;
  renderApp();
});

els.activityFilterSelect.addEventListener("change", (event) => {
  view.filters.activity = event.target.value;
  renderApp();
});

els.recordStatusFilterSelect.addEventListener("change", (event) => {
  view.filters.status = event.target.value;
  renderApp();
});

els.keywordFilterInput.addEventListener("input", (event) => {
  view.filters.keyword = event.target.value;
  renderApp();
});

els.selectFilteredBtn.addEventListener("click", () => {
  const { records } = getStateSnapshot();
  records.filter(matchesFilters).forEach((item) => view.selection.add(item.id));
  renderApp();
});

els.clearSelectionBtn.addEventListener("click", () => {
  view.selection.clear();
  renderApp();
});

els.batchPushBtn.addEventListener("click", () => {
  openPushModal("batch");
});

els.recordTableBody.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-record-check]");
  if (!checkbox) {
    return;
  }
  const recordId = checkbox.getAttribute("data-record-check");
  if (!recordId) {
    return;
  }
  if (checkbox.checked) {
    view.selection.add(recordId);
  } else {
    view.selection.delete(recordId);
  }
  renderApp();
});

els.recordTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action='push']");
  if (!button) {
    return;
  }
  const recordId = button.getAttribute("data-record-id");
  if (!recordId) {
    return;
  }
  openPushModal("single", recordId);
});

els.confirmPushBtn.addEventListener("click", () => {
  const title = els.pushTitleInput.value.trim() || "活动消息通知";
  const content = els.pushContentInput.value.trim();
  if (!content) {
    window.alert("请输入推送文案。");
    els.pushContentInput.focus();
    return;
  }
  if (!view.push.targetIds.length) {
    window.alert("当前没有可推送的登记用户。");
    return;
  }

  workbench.pushToRecipients({
    ids: view.push.targetIds,
    channel: els.pushChannelSelect.value,
    title,
    content,
    filterSummary: view.push.summary
  });

  closeModal("pushModal");
  renderApp();
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(button.getAttribute("data-close-modal"));
  });
});

els.modalBackdrop.addEventListener("click", () => {
  closeModal("pushModal");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !els.pushModal.hidden) {
    closeModal("pushModal");
  }
});

els.resetDemoBtn.addEventListener("click", () => {
  if (!window.confirm("确认恢复为默认示例数据吗？当前登记用户和推送记录都会被重置。")) {
    return;
  }
  view.selection.clear();
  workbench.resetState();
  renderApp();
});

workbench.subscribe(() => {
  renderApp();
});

renderApp();
