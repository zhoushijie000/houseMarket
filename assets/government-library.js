(() => {
  const $ = id => document.getElementById(id);
  const storage = window.governmentLibraryStorage;
  const districts = window.policyCatalog.districtOrder;
  const requestedDistrict = new URLSearchParams(location.search).get('district');
  const district = districts.includes(requestedDistrict) ? requestedDistrict : null;
  const canManage = district === null;
  const editor = $('editor');
  const dateFormat = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  });
  const collator = new Intl.Collator('zh-CN', { numeric: true });
  const icons = {
    folder: '<svg class="item-icon folder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 19V5h7l2 3h9v11z" stroke-linejoin="round"/></svg>',
    file: '<svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 4h6" stroke-linejoin="round"/></svg>'
  };

  let entries = [];
  const expandedFolders = new Set([storage.chengduFolderId]);
  const searchToggles = new Map();
  let activeKeyword = '';
  let loadState = 'loading';
  let refreshVersion = 0;
  let noticeTimer;
  let editorMode;
  let scopeTarget;
  let saving = false;

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text != null) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function textButton(text, callback, label) {
    const button = element('button', text, 'text-button');
    button.type = 'button';
    button.addEventListener('click', callback);
    if (label) button.setAttribute('aria-label', label);
    return button;
  }

  function notify(message, error = false) {
    const notice = $('notice');
    notice.textContent = message;
    notice.classList.toggle('error', error);
    notice.hidden = false;
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => { notice.hidden = true; }, 4200);
  }

  function sizeLabel(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 ** 2)).toFixed(1) + ' MB';
  }

  function initializeOptions() {
    if (district) {
      $('agencyName').textContent = district;
      $('accountName').textContent = '区市县用户';
      return;
    }
    $('districtFilter').append(new Option('全部区市县', ''));
    districts.forEach(district => {
      $('districtFilter').append(new Option(district, district));
      const label = element('label');
      const input = element('input');
      input.type = 'checkbox';
      input.name = 'district';
      input.value = district;
      label.append(input, district);
      $('districtOptions').append(label);
    });
  }

  function fileScope(entry, file) {
    return file.districts || entry.districts;
  }

  function buildFolder(entry, name, key) {
    return { entry, name, key, folder: true, children: new Map(), districts: new Set() };
  }

  function buildTree() {
    const scope = district || $('districtFilter').value;
    const roots = [];
    for (const entry of entries) {
      const files = entry.files.filter(file => !scope || fileScope(entry, file).includes(scope));
      if (!files.length) continue;
      if (!entry.folder) {
        const file = files[0];
        roots.push({ entry, name: entry.name, ...file, districts: fileScope(entry, file) });
        continue;
      }
      const root = buildFolder(entry, entry.name, entry.id);
      for (const file of files) {
        const available = fileScope(entry, file);
        const parts = file.path.split('/');
        const fileName = parts.pop();
        let folder = root;
        available.forEach(district => folder.districts.add(district));
        for (const part of parts) {
          if (!folder.children.has(part)) {
            folder.children.set(part, buildFolder(entry, part, folder.key + '/' + part));
          }
          folder = folder.children.get(part);
          available.forEach(district => folder.districts.add(district));
        }
        folder.children.set(fileName, { entry, name: fileName, ...file, districts: available });
      }
      roots.push(root);
    }
    return roots;
  }

  function treeMatches(items, keyword) {
    return items.flatMap(item => {
      if (item.name.toLocaleLowerCase('zh-CN').includes(keyword)) return [item];
      if (!item.folder) return [];
      const children = treeMatches([...item.children.values()], keyword);
      return children.length ? [{ ...item, children: new Map(children.map(child => [child.name, child])), searchExpanded: true }] : [];
    });
  }

  function toggleFolder(key, isExpanded) {
    if (activeKeyword) searchToggles.set(key, !isExpanded);
    else if (isExpanded) expandedFolders.delete(key);
    else expandedFolders.add(key);
    render(key);
  }

  async function download(item) {
    try {
      const file = await storage.download(item.entry.id, item.path, district);
      if (!file) {
        notify('该文档已不可下载，已刷新列表。', true);
        await refresh();
        return;
      }
      const url = file.url || URL.createObjectURL(file.blob);
      const link = element('a');
      link.href = url;
      link.download = item.name;
      document.body.append(link);
      link.click();
      link.remove();
      if (file.blob) setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      notify('下载失败，请重试。', true);
    }
  }

  function renderRow(item, depth, isExpanded) {
    const row = element('tr');
    const name = element('div', null, 'item-name');
    name.style.setProperty('--depth', depth);
    if (item.folder) {
      const toggle = element('button', null, 'tree-toggle');
      toggle.type = 'button';
      toggle.dataset.folderKey = item.key;
      toggle.setAttribute('aria-expanded', String(isExpanded));
      const caret = element('span', null, 'tree-caret');
      caret.setAttribute('aria-hidden', 'true');
      toggle.append(caret);
      toggle.insertAdjacentHTML('beforeend', icons.folder);
      toggle.append(element('span', item.name, 'tree-label'));
      toggle.addEventListener('click', () => toggleFolder(item.key, isExpanded));
      name.append(toggle);
    } else {
      name.innerHTML = '<span class="tree-caret" aria-hidden="true"></span>' + icons.file;
      name.append(element('span', item.name));
    }
    row.append(element('td'), element('td', item.folder ? '—' : sizeLabel(item.size)));
    row.firstChild.append(name);
    if (canManage) {
      const scope = element('td');
      const tags = element('div', null, 'scope-tags');
      const districtCount = item.folder ? item.districts.size : item.districts.length;
      if (districtCount === districts.length) {
        tags.append(element('span', '全部区市县', 'scope-tag'));
      } else {
        item.districts.forEach(district => tags.append(element('span', district, 'scope-tag')));
      }
      scope.append(tags);
      row.append(scope);
    }
    row.append(element('td', dateFormat.format(item.entry.uploadedAt)));
    const cell = element('td');
    const actions = element('div', null, 'row-actions');
    if (!item.folder) actions.append(textButton('下载', () => download(item), '下载 ' + item.name));
    if (canManage && (depth === 0 || !item.folder)) {
      actions.append(textButton('设置范围', () => openEditor('scope', item), '设置范围 ' + item.name));
    }
    cell.append(actions);
    row.append(cell);
    return row;
  }

  function appendRows(items, rows, depth = 0) {
    for (const item of items) {
      const isExpanded = searchToggles.get(item.key) ?? (item.searchExpanded || expandedFolders.has(item.key));
      rows.push(renderRow(item, depth, isExpanded));
      if (item.folder && isExpanded) {
        const children = [...item.children.values()].sort((a, b) =>
          Number(Boolean(b.folder)) - Number(Boolean(a.folder)) || collator.compare(a.name, b.name)
        );
        appendRows(children, rows, depth + 1);
      }
    }
  }

  function render(focusKey) {
    $('uploadActions').hidden = !canManage || loadState !== 'ready';
    $('districtFilterField').hidden = !canManage;
    $('scopeHeading').hidden = !canManage;
    $('scopeCol').hidden = !canManage;
    const keyword = $('keyword').value.trim().toLocaleLowerCase('zh-CN');
    if (keyword !== activeKeyword) {
      activeKeyword = keyword;
      searchToggles.clear();
    }
    const items = buildTree();
    const rows = [];
    if (loadState === 'ready') appendRows(keyword ? treeMatches(items, keyword) : items, rows);
    const table = $('rows');
    const state = $('tableState');
    table.replaceChildren(...rows);
    if (focusKey) {
      [...table.querySelectorAll('.tree-toggle')].find(toggle => toggle.dataset.folderKey === focusKey)?.focus({ preventScroll: true });
    }
    state.hidden = rows.length > 0;
    if (loadState === 'error') state.textContent = '无法读取知识库，请检查浏览器的站点存储设置后刷新。';
    else if (loadState === 'loading') state.textContent = '正在加载知识库…';
    else if (keyword || $('districtFilter').value) state.textContent = '没有符合筛选条件的资料。';
    else state.textContent = '暂无可用资料。';
    $('resultCount').textContent = loadState === 'ready' ? `显示 ${rows.length} 项` : '';
  }

  async function refresh() {
    const version = ++refreshVersion;
    try {
      const records = await storage.list();
      if (version !== refreshVersion) return;
      entries = records.sort((a, b) => b.uploadedAt - a.uploadedAt);
      loadState = 'ready';
    } catch {
      if (version !== refreshVersion) return;
      entries = [];
      loadState = 'error';
    }
    render();
  }

  function districtInputs() { return [...$('districtOptions').querySelectorAll('input')]; }

  function updateDistrictCount() {
    const count = districtInputs().filter(input => input.checked).length;
    $('selectedDistricts').textContent = `已选 ${count} 个区市县`;
    $('toggleDistricts').textContent = count === districts.length ? '取消全选' : '全选';
  }

  function pickedFiles() {
    return Array.from($(editorMode === 'folder' ? 'folderInput' : 'fileInput').files);
  }

  function updateFiles() {
    const files = pickedFiles();
    const folderName = files[0]?.webkitRelativePath.split('/')[0];
    const preview = $('filePreview');
    $('fileSummary').textContent = files.length
      ? (editorMode === 'folder' ? `${folderName} · ${files.length} 个文档` : `已选 ${files.length} 个文档`)
      : (editorMode === 'folder' ? '尚未选择含文档的文件夹' : '尚未选择文档');
    const paths = files.slice(0, 5).map(file => element('li', file.webkitRelativePath || file.name));
    if (files.length > paths.length) paths.push(element('li', `另有 ${files.length - paths.length} 个文档`));
    preview.replaceChildren(...paths);
    preview.hidden = !paths.length;
    $('editorError').hidden = true;
  }

  function openEditor(mode, item = null) {
    if (!canManage || loadState !== 'ready') return;
    editorMode = mode;
    scopeTarget = item;
    $('uploadForm').reset();
    $('uploadField').hidden = mode === 'scope';
    $('editTarget').hidden = !item;
    $('editTarget').textContent = item?.name || '';
    const folder = mode === 'folder' || item?.folder;
    $('dialogTitle').textContent = item ? '设置下载范围' : (folder ? '上传文件夹' : '上传文档');
    $('uploadLabel').textContent = folder ? '待上传文件夹' : '待上传文档';
    $('chooseFiles').textContent = folder ? '选择文件夹' : '选择文档';
    $('scopeHelp').textContent = folder
      ? '所选区市县为文件夹内文档的默认下载范围。可为单个文档单独设置范围。'
      : '所选区市县可查看并下载文档。';
    $('saveEntry').textContent = item ? '保存' : '确认上传';
    const selected = item?.folder ? item.entry.districts : item?.districts;
    districtInputs().forEach(input => { input.checked = selected?.includes(input.value) || false; });
    updateDistrictCount();
    updateFiles();
    editor.showModal();
  }

  function uploadEntries(files, scope) {
    const uploadedAt = Date.now();
    const create = (name, folder, uploads) => ({
      id: crypto.randomUUID(), name, folder, districts: scope, uploadedAt, files: uploads
    });
    if (editorMode === 'folder') {
      const [name] = files[0].webkitRelativePath.split('/');
      return [create(name, true, files.map(file => ({
        path: file.webkitRelativePath.slice(name.length + 1), blob: file
      })))];
    }
    return files.map(file => create(file.name, false, [{ path: file.name, blob: file }]));
  }

  function showEditorError(message) {
    $('editorError').textContent = message;
    $('editorError').hidden = false;
  }

  $('uploadForm').addEventListener('submit', async event => {
    event.preventDefault();
    if (!canManage || saving) return;
    const files = pickedFiles();
    const scope = districtInputs().filter(input => input.checked).map(input => input.value);
    if (!scopeTarget && !files.length) {
      showEditorError(editorMode === 'folder' ? '请选择含文档的文件夹。' : '请先选择要上传的文档。');
      $('chooseFiles').focus();
      return;
    }
    if (!scope.length) {
      showEditorError('请至少选择一个可下载的区市县。');
      districtInputs()[0].focus();
      return;
    }
    saving = true;
    const controls = $('uploadForm').querySelectorAll('button, input');
    controls.forEach(control => { control.disabled = true; });
    try {
      if (scopeTarget) {
        const path = scopeTarget.entry.folder ? scopeTarget.path : undefined;
        const updated = await storage.changeScope(scopeTarget.entry.id, scope, path);
        if (!updated) throw new Error('资料不存在');
      } else {
        await storage.upload(uploadEntries(files, scope));
        $('keyword').value = '';
        $('districtFilter').value = '';
      }
      editor.close();
      notify(scopeTarget ? '下载范围已更新。' : '上传成功。');
      await refresh();
    } catch (error) {
      showEditorError(error.name === 'QuotaExceededError' ? '浏览器存储空间不足，请减少本次上传的文件。' : '保存失败，请重试。');
    } finally {
      saving = false;
      controls.forEach(control => { control.disabled = false; });
    }
  });

  $('searchForm').addEventListener('submit', event => { event.preventDefault(); render(); });
  $('searchForm').addEventListener('reset', () => setTimeout(render, 0));
  $('districtFilter').addEventListener('change', () => render());
  $('uploadFiles').addEventListener('click', () => openEditor('files'));
  $('uploadFolder').addEventListener('click', () => openEditor('folder'));
  $('chooseFiles').addEventListener('click', () => $(editorMode === 'folder' ? 'folderInput' : 'fileInput').click());
  $('fileInput').addEventListener('change', updateFiles);
  $('folderInput').addEventListener('change', updateFiles);
  $('districtOptions').addEventListener('change', updateDistrictCount);
  $('toggleDistricts').addEventListener('click', () => {
    const inputs = districtInputs();
    const selectAll = !inputs.every(input => input.checked);
    inputs.forEach(input => { input.checked = selectAll; });
    updateDistrictCount();
  });
  $('closeEditor').addEventListener('click', () => editor.close());
  $('cancelEditor').addEventListener('click', () => editor.close());
  editor.addEventListener('cancel', event => { if (saving) event.preventDefault(); });
  window.addEventListener('focus', () => { if (!editor.open) refresh(); });
  initializeOptions();
  render();
  refresh();
})();
