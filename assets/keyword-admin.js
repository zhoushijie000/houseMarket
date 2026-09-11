(() => {
  const $ = s => document.querySelector(s);
  function closeMenus() {
    document.querySelectorAll('[data-nav-menu]').forEach(menu => {
      menu.classList.remove('open');
      menu.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
    });
  }
  $('#headerNav').addEventListener('click', event => {
    const button = event.target.closest('.nav-trigger');
    if (!button) return;
    const menu = button.parentElement, open = !menu.classList.contains('open');
    closeMenus(); menu.classList.toggle('open', open); button.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => { if (!event.target.closest('#headerNav')) closeMenus(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenus(); });
  let search = '', page = 1;
  const tabs = [...document.querySelectorAll('[data-message-tab]')];
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => {const selected=t===tab;t.classList.toggle('selected',selected);t.setAttribute('aria-selected',String(selected));document.getElementById(t.dataset.messageTab).hidden=!selected;});
  }));
  function render() {
    const rows = BlockedKeywords.read().filter(r=>r.word.includes(search));
    page=Math.min(page,Math.max(1,Math.ceil(rows.length/10)));
    $('#keywordRows').replaceChildren();
    rows.slice((page-1)*10,page*10).forEach((r,i)=>{
      const tr=document.createElement('tr');
      [(page-1)*10+i+1,r.word,r.createdAt,'已生效'].forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.append(td)});
      const td=document.createElement('td'),button=document.createElement('button');button.className='table-action';button.textContent='删除';
      button.onclick=()=>{if(!confirm('确认删除屏蔽关键词“'+r.word+'”？删除后该词将恢复正常显示。'))return;try{BlockedKeywords.save(BlockedKeywords.read().filter(item=>item.word!==r.word));}catch{alert('保存失败，请检查浏览器存储设置。')}};
      td.append(button);tr.append(td);$('#keywordRows').append(tr);
    });
    if(!rows.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=5;td.className='empty';td.textContent=search?'暂无匹配的屏蔽关键词':'暂无屏蔽关键词，点击“添加关键词”开始设置';tr.append(td);$('#keywordRows').append(tr)}
    $('#keywordTotal').textContent='共 '+rows.length+' 条';$('#keywordPage').textContent=page;$('#keywordPrev').disabled=page===1;$('#keywordNext').disabled=page*10>=rows.length;
  }
  $('#keywordSearchForm').onsubmit=e=>{e.preventDefault();search=$('#keywordSearch').value.trim();page=1;render()};
  $('#keywordSearchForm').onreset=()=>{search='';page=1;render()};
  $('#keywordPrev').onclick=()=>{page--;render()};$('#keywordNext').onclick=()=>{page++;render()};
  const dialog=$('#keywordDialog');
  $('#addKeyword').onclick=()=>{$('#keywordForm').reset();$('#keywordError').textContent='';dialog.showModal();$('#keywordInput').focus()};
  $('#cancelKeyword').onclick=()=>dialog.close();
  $('#keywordForm').onsubmit=e=>{
    e.preventDefault();const word=$('#keywordInput').value.trim(),rows=BlockedKeywords.read();
    if(!word){$('#keywordError').textContent='请输入屏蔽关键词';return}
    if(rows.some(r=>r.word===word)){$('#keywordError').textContent='该关键词已存在，请勿重复添加';return}
    try{BlockedKeywords.save([...rows,{word,createdAt:new Date().toLocaleString('sv-SE')}]);search='';$('#keywordSearch').value='';page=Math.ceil((rows.length+1)/10);render();dialog.close()}catch{$('#keywordError').textContent='保存失败，请检查浏览器存储设置后重试'}
  };
  window.addEventListener('keywords-changed',render);render();
})();
