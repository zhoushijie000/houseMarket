(() => {
  'use strict';
  const $ = s => document.querySelector(s), isCategory = document.body.dataset.aiPage === 'categories';
  const key = 'houseMarketAIConfigV1';
  const initial = { categories: [{id:'c1',name:'买房咨询',color:'#3F6FE8',background:'#EDF3FF'},{id:'c2',name:'购房政策',color:'#D9942B',background:'#FFF7E8'},{id:'c3',name:'区域解读',color:'#248969',background:'#EDF9F5'}], prompts: [{id:'p1',content:'首次买房需要准备哪些资料？',category:'c1',enabled:true},{id:'p2',content:'成都最新购房政策有哪些？',category:'c2',enabled:true},{id:'p3',content:'帮我了解一下天府新区',category:'c3',enabled:false}] };
  let data, page=1, editing=null, filters={query:'',category:'',status:''};
  function read() { try { data=JSON.parse(localStorage.getItem(key)) || structuredClone(initial); if(!Array.isArray(data.categories)||!Array.isArray(data.prompts)) throw Error(); } catch { data=structuredClone(initial); } }
  read();
  function toast(text) { $('#toast').textContent=text; $('#toast').classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),2500); }
  function save(next) { try { localStorage.setItem(key,JSON.stringify(next)); data=next; render(); return true; } catch { toast('保存失败，请检查浏览器存储设置'); return false; } }
  const collection=()=>isCategory?'categories':'prompts';
  function options(select,placeholder) { const previous=select.value; select.replaceChildren(new Option(placeholder,''),...data.categories.map(c=>new Option(c.name,c.id))); select.value=previous; }
  function tag(c) { const el=document.createElement('span'); el.className='category-tag'; el.textContent=c?.name||'未分类'; if(c){el.style.color=c.color;el.style.backgroundColor=c.background;} return el; }
  function cell(tr,value) { const td=document.createElement('td'); if(value instanceof Node) td.append(value); else td.textContent=value; tr.append(td); return td; }
  function button(text,fn,cls='table-action') { const b=document.createElement('button'); b.type='button'; b.textContent=text; b.className=cls; b.onclick=fn; return b; }
  function render() {
    if(!isCategory) options($('#categoryFilter'),'全部类别');
    const rows=data[collection()].filter(r=>(isCategory?r.name:r.content).includes(filters.query)&&(isCategory||((!filters.category||r.category===filters.category)&&(!filters.status||String(r.enabled)===filters.status))));
    page=Math.max(1,Math.min(page,Math.ceil(rows.length/10))); $('#rows').replaceChildren();
    rows.slice((page-1)*10,page*10).forEach((r,i)=>{
      const tr=document.createElement('tr'); cell(tr,(page-1)*10+i+1); cell(tr,isCategory?r.name:r.content);
      if(isCategory) { ['color','background'].forEach(k=>{const wrap=document.createElement('span');wrap.className='color-value';const swatch=document.createElement('span');swatch.className='swatch';swatch.style.backgroundColor=r[k];wrap.append(swatch,document.createTextNode(r[k].toUpperCase()));cell(tr,wrap);}); }
      else {cell(tr,tag(data.categories.find(c=>c.id===r.category))); const toggle=button(r.enabled?'启用':'停用',()=>{const next=structuredClone(data);next.prompts.find(p=>p.id===r.id).enabled=!r.enabled;if(save(next))toast(r.enabled?'已停用':'已启用');},'switch'+(r.enabled?' on':''));toggle.setAttribute('role','switch');toggle.setAttribute('aria-checked',String(r.enabled));toggle.setAttribute('aria-label','启用引导语：'+r.content);cell(tr,toggle);}
      const actions=cell(tr,''); actions.append(button('编辑',()=>open(r)),button('删除',()=>{
        if(isCategory&&data.prompts.some(p=>p.category===r.id)){toast('该类别下存在引导语，请先调整或删除关联引导语');return;}
        if(!confirm('确认删除该'+(isCategory?'类别':'引导语')+'？'))return;
        const next=structuredClone(data);next[collection()]=next[collection()].filter(x=>x.id!==r.id);if(save(next))toast('删除成功');
      },'table-action danger')); $('#rows').append(tr);
    });
    if(!rows.length){const tr=document.createElement('tr');const td=cell(tr,'暂无数据，请调整筛选条件或新增');td.colSpan=5;td.className='empty';$('#rows').append(tr);}
    $('#total').textContent='共 '+rows.length+' 条';$('#page').textContent=page;$('#prev').disabled=page===1;$('#next').disabled=page*10>=rows.length;
  }
  function syncColors(){ ['color','background'].forEach(k=>{const v=$('#'+k).value;if(/^#[\da-f]{6}$/i.test(v)){ $('#'+k+'Picker').value=v;}}); }
  function count(){const n=Array.from($('#content').value).length;$('#counter').textContent=n+' / 30';$('#content').setCustomValidity(n>30?'引导语内容不能超过30个字':'');$('#counter').style.color=n>30?'#f56c6c':'';}
  function open(r){
    if(!isCategory&&!data.categories.length){toast('请先在类别管理中新增类别');return;}
    editing=r?.id||null;$('#editForm').reset();$('#error').textContent='';$('#editorTitle').textContent=(r?'编辑':'新增')+(isCategory?'类别':'引导语');
    if(isCategory){$('#name').value=r?.name||'';$('#color').value=r?.color||'#3F6FE8';$('#background').value=r?.background||'#EDF3FF';syncColors();}
    else {$('#content').value=r?.content||'';options($('#category'),'请选择所属类别');$('#category').value=r?.category||'';$('#enabled').value=String(r?.enabled??true);count();}
    $('#editor').showModal();$(isCategory?'#name':'#content').focus();
  }
  $('#add').onclick=()=>open();$('#cancel').onclick=$('#close').onclick=()=>$('#editor').close();
  if(isCategory){['color','background'].forEach(k=>{$('#'+k).oninput=syncColors;$('#'+k+'Picker').oninput=e=>{$('#'+k).value=e.target.value.toUpperCase();syncColors();};});}else $('#content').oninput=count;
  $('#editForm').onsubmit=e=>{e.preventDefault(); const fail=t=>$('#error').textContent=t;let row;
    if(isCategory){ const name=$('#name').value.trim(),color=$('#color').value,background=$('#background').value;if(!name)return fail('请输入类别名称');if(data.categories.some(c=>c.id!==editing&&c.name===name))return fail('类别名称已存在');if(![color,background].every(v=>/^#[\da-f]{6}$/i.test(v)))return fail('请输入有效的六位十六进制颜色');row={name,color,background}; }
    else {const content=$('#content').value.trim(),category=$('#category').value;if(!content||Array.from(content).length>30)return fail('请输入1至30个字的引导语');if(!data.categories.some(c=>c.id===category))return fail('请选择有效的所属类别');row={content,category,enabled:$('#enabled').value==='true'};}
    row.id=editing||crypto.randomUUID();const next=structuredClone(data);next[collection()]=editing?next[collection()].map(r=>r.id===editing?row:r):[...next[collection()],row];if(save(next)){$('#editor').close();toast('保存成功');}
  };
  $('#searchForm').onsubmit=e=>{e.preventDefault();filters={query:$('#query').value.trim(),category:$('#categoryFilter')?.value||'',status:$('#statusFilter')?.value||''};page=1;render();};
  $('#searchForm').onreset=()=>{filters={query:'',category:'',status:''};page=1;setTimeout(render,0);};$('#prev').onclick=()=>{page--;render();};$('#next').onclick=()=>{page++;render();};
  document.addEventListener('click',e=>{const trigger=e.target.closest('.nav-menu-toggle');document.querySelectorAll('[data-nav-menu]').forEach(item=>{const active=trigger?.parentElement===item&&!item.classList.contains('open');item.classList.toggle('open',active);item.querySelector('.nav-menu-toggle')?.setAttribute('aria-expanded',String(active));});if(e.target.closest('[data-placeholder-menu],[data-customer-menu]'))toast('该功能暂未开放');});
  window.addEventListener('storage',e=>{if(e.key===key){read();render();if($('#editor').open){$('#editor').close();toast('配置已更新，请重新编辑');}}});render();
})();
