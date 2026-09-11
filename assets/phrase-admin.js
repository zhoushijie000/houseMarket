(() => {
  const $ = s => document.querySelector(s), key = 'houseMarketCommonPhrases';
  const defaults = [
    ['您好，想咨询一下楼盘信息。', ['新房用户']],
    ['请问目前有哪些在售户型？', ['新房用户']],
    ['请问总价和首付大概多少？', ['新房用户', '二手房用户']],
    ['方便发一份房源资料吗？', ['新房用户', '二手房用户']],
    ['我想预约看房，什么时候方便？', ['新房用户', '二手房用户']],
    ['您好，请问您意向的区域和预算是多少？', ['置业顾问', '经纪人']],
    ['好的，我整理好资料后发给您。', ['置业顾问', '经纪人']],
    ['好的，谢谢您的回复。', ['置业顾问', '新房用户', '经纪人', '二手房用户']]
  ].map(([text, scenes], i) => ({ id: 'default-' + i, text, scenes }));
  let rows;
  try { const saved = localStorage.getItem(key); rows = saved === null ? defaults : JSON.parse(saved); if (!Array.isArray(rows) || rows.some(r => !r.id || typeof r.text !== 'string' || !Array.isArray(r.scenes))) throw Error(); }
  catch { rows = defaults; }
  let page = 1, query = '', scene = '', editing = null;
  function save(next) {
    try { localStorage.setItem(key, JSON.stringify(next)); rows = next; render(); return true; }
    catch { return false; }
  }
  function render() {
    const filtered = rows.filter(r => r.text.includes(query) && (!scene || r.scenes.includes(scene)));
    page = Math.min(page, Math.max(1, Math.ceil(filtered.length / 10)));
    $('#phraseRows').replaceChildren();
    filtered.slice((page - 1) * 10, page * 10).forEach((r, i) => {
      const tr = document.createElement('tr');
      [(page - 1) * 10 + i + 1, r.text, r.scenes.join('、')].forEach(value => { const td = document.createElement('td'); td.textContent = value; tr.append(td); });
      const actions = document.createElement('td');
      ['编辑', '删除'].forEach(label => {
        const b = document.createElement('button'); b.className = 'table-action'; b.textContent = label;
        b.onclick = () => {
          if (label === '编辑') open(r);
          else if (confirm('确认删除该常用语？') && !save(rows.filter(item => item.id !== r.id))) alert('保存失败，请检查浏览器存储设置。');
        };
        actions.append(b);
      });
      tr.append(actions); $('#phraseRows').append(tr);
    });
    if (!filtered.length) { const tr = document.createElement('tr'), td = document.createElement('td'); td.colSpan = 4; td.className = 'empty'; td.textContent = '暂无常用语'; tr.append(td); $('#phraseRows').append(tr); }
    $('#phraseTotal').textContent = '共 ' + filtered.length + ' 条'; $('#phrasePage').textContent = page;
    $('#phrasePrev').disabled = page === 1; $('#phraseNext').disabled = page * 10 >= filtered.length;
  }
  function open(row) {
    editing = row?.id || null; $('#phraseForm').reset(); $('#phraseError').textContent = '';
    $('#phraseDialogTitle').textContent = row ? '编辑常用语' : '添加常用语';
    $('#phraseInput').value = row?.text || '';
    document.querySelectorAll('[name="scene"]').forEach(input => input.checked = Boolean(row?.scenes.includes(input.value)));
    $('#phraseDialog').showModal(); $('#phraseInput').focus();
  }
  $('#addPhrase').onclick = () => open(); $('#cancelPhrase').onclick = () => $('#phraseDialog').close();
  $('#phraseForm').onsubmit = event => {
    event.preventDefault();
    const text = $('#phraseInput').value.trim(), scenes = [...document.querySelectorAll('[name="scene"]:checked')].map(input => input.value);
    if (!text || !scenes.length) { $('#phraseError').textContent = !text ? '请输入常用语' : '请选择适用场景'; return; }
    if (rows.some(r => r.id !== editing && r.text === text && r.scenes.some(s => scenes.includes(s)))) { $('#phraseError').textContent = '所选场景已存在相同常用语'; return; }
    const row = { id: editing || crypto.randomUUID(), text, scenes };
    if (!save(editing ? rows.map(r => r.id === editing ? row : r) : [...rows, row])) { $('#phraseError').textContent = '保存失败，请检查浏览器存储设置。'; return; }
    $('#phraseDialog').close();
  };
  $('#phraseSearchForm').onsubmit = event => { event.preventDefault(); query = $('#phraseSearch').value.trim(); scene = $('#phraseSceneSearch').value; page = 1; render(); };
  $('#phraseSearchForm').onreset = () => { query = ''; scene = ''; page = 1; render(); };
  $('#phrasePrev').onclick = () => { page--; render(); }; $('#phraseNext').onclick = () => { page++; render(); };
  render();
})();
