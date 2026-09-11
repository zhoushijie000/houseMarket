(() => {
  const $ = s => document.querySelector(s);
  const record = $('main').dataset.page === '消息记录';
  const messages = [
    {id:'MSG20260910001',title:'欢迎使用房产超市',type:'系统通知',status:'已发送',target:'全部用户',time:'2026-09-10 09:00',content:'欢迎使用成都住建房产超市，您可以浏览楼盘、查看购房政策和预约看房。'},
    {id:'MSG20260909002',title:'周末看房活动提醒',type:'活动通知',status:'已发送',target:'报名用户',time:'2026-09-09 16:30',content:'您报名的周末看房活动即将开始，请在活动详情中查看集合时间和地点。'},
    {id:'MSG20260909003',title:'预约看房确认',type:'业务提醒',status:'已发送',target:'指定用户',time:'2026-09-09 14:20',content:'您的看房预约已确认，请前往预约详情查看安排。'},
    {id:'MSG20260908004',title:'房产超市服务升级通知',type:'系统通知',status:'草稿',target:'全部用户',time:'2026-09-08 10:00',content:'房产超市将更新楼盘信息展示，欢迎体验。'}
  ];
  const names=['成都安家小陈','蓉城看房人','向阳而居','林溪听风','一米阳光','西岭归客'];
  const rows=record ? Array.from({length:16},(_,i)=>({...messages[i%3],id:'REC20260910'+String(i+1).padStart(3,'0'),name:names[i%6],phone:'138****'+String(1200+i),status:i%3?'已读':'未读',readTime:i%3?'2026-09-10 10:25':'—'})) : messages;
  let page=1, query={title:'',type:'',status:''}, opener;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const headers=record?['记录编号','消息标题','消息类型','接收用户','手机号','发送时间','阅读状态','操作']:['消息编号','消息标题','消息类型','接收对象','消息状态','创建时间','操作'];
  $('#tableHead').innerHTML='<tr>'+headers.map(x=>'<th>'+x+'</th>').join('')+'</tr>';
  function render(){
    const filtered=rows.filter(r=>r.title.includes(query.title)&&(!query.type||r.type===query.type)&&(!query.status||r.status===query.status));
    const visible=filtered.slice((page-1)*10,page*10);
    $('#messageRows').innerHTML=visible.map(r=>{
      const values=record?[r.id,r.title,r.type,r.name,r.phone,r.time,r.status]:[r.id,r.title,r.type,r.target,r.status,r.time];
      return '<tr>'+values.map(v=>'<td>'+(['已读','已发送','草稿','未读'].includes(v)?'<span class="customer-tag '+(['已发送','已读'].includes(v)?'green':'orange')+'">'+esc(v)+'</span>':esc(v))+'</td>').join('')+'<td><button class="table-action" data-detail="'+r.id+'">查看详情</button></td></tr>';
    }).join('')||'<tr><td class="empty" colspan="'+headers.length+'">暂无符合条件的消息</td></tr>';
    $('#totalText').textContent='共 '+filtered.length+' 条'; $('#pageNumber').textContent=page;
    $('#prev').disabled=page===1; $('#next').disabled=page*10>=filtered.length;
  }
  $('#filters').addEventListener('submit',e=>{e.preventDefault();query=Object.fromEntries(new FormData(e.target));query.title=query.title.trim();page=1;render()});
  $('#filters').addEventListener('reset',()=>{query={title:'',type:'',status:''};page=1;render()});
  $('#prev').onclick=()=>{page--;render()};$('#next').onclick=()=>{page++;render()};
  $('#messageRows').onclick=e=>{
    const b=e.target.closest('[data-detail]');if(!b)return;opener=b;
    const r=rows.find(r=>r.id===b.dataset.detail);
    $('#detailBody').textContent=`消息标题：${r.title}\n消息类型：${r.type}\n${record?'接收用户：'+r.name+'（'+r.phone+'）':'接收对象：'+r.target}\n${record?'发送时间':'创建时间'}：${r.time}\n状态：${r.status}${record?'\n阅读时间：'+r.readTime:''}\n\n消息内容\n${r.content}`;
    $('#detailOverlay').classList.add('show');$('#detailOverlay').setAttribute('aria-hidden','false');$('#closeDialog').focus();
  };
  function close(){ $('#detailOverlay').classList.remove('show');$('#detailOverlay').setAttribute('aria-hidden','true');opener?.focus() }
  $('#closeDialog').onclick=close;$('#confirmDialog').onclick=close;$('#detailOverlay').onclick=e=>{if(e.target===$('#detailOverlay'))close()};
  function closeMenus(){document.querySelectorAll('[data-nav-menu]').forEach(m=>{m.classList.remove('open');m.querySelector('button').setAttribute('aria-expanded','false')})}
  $('#headerNav').onclick=e=>{const b=e.target.closest('.nav-trigger');if(b){const m=b.parentElement,open=!m.classList.contains('open');closeMenus();m.classList.toggle('open',open);b.setAttribute('aria-expanded',String(open))}};
  document.addEventListener('click',e=>{if(!e.target.closest('#headerNav'))closeMenus()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenus();if($('#detailOverlay').classList.contains('show'))close()}if(e.key==='Tab'&&$('#detailOverlay').classList.contains('show')){e.preventDefault();(document.activeElement===$('#closeDialog')?$('#confirmDialog'):$('#closeDialog')).focus()}});
  render();
})();
