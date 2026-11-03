(() => {
  const $ = id => document.getElementById(id), key = 'houseMarket.advisor.v1';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mask = value => window.BlockedKeywords ? BlockedKeywords.mask(value) : value;
  let customers = structuredClone(window.advisorCustomerSeed).map(c => ({...c, unread: c.status === 'uncontacted' ? 1 : 0}));
  try { const saved = JSON.parse(localStorage.getItem(key)); if (Array.isArray(saved) && saved.length && saved.every(c => customers.some(seed => seed.id === c.id) && typeof c.name === 'string' && Array.isArray(c.dialog) && Array.isArray(c.dynamics))) customers = saved; } catch {}
  customers.forEach(c => {
    const seed = window.advisorCustomerSeed.find(item => item.id === c.id);
    if(c.activityVersion!==2){c.activities=structuredClone(seed.activities);c.activityVersion=2;}
    const timestamp = c.lastMessageAt || c.lastSent || seed?.lastMessageAt;
    c.lastMessageAt = Number.isFinite(new Date(timestamp).getTime()) ? new Date(timestamp).toISOString() : seed.lastMessageAt;
    c.unread = Math.max(0, Math.floor(Number(c.unread) || 0));
  });
  const messageTime = c => new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(c.lastMessageAt));
  let unreadOnly = false, current = null, view = 'messages';
  let profile = {name:'李晓雨', wechat:'AJCD-LXY2026'};
  try { const saved=JSON.parse(localStorage.getItem('houseMarket.advisor.profile.v1')); if(saved && typeof saved.name==='string' && saved.name.trim() && saved.name.length<=20 && typeof saved.wechat==='string' && saved.wechat.length<=32) profile=saved; } catch {}
  const validAvatar = value => typeof value === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(value);
  let draftAvatar = '', avatarReadVersion = 0;
  function renderMine() { $('content').innerHTML=$('mineTemplate').innerHTML; document.querySelector('.mine-profile__phone').textContent=profile.name; if(validAvatar(profile.avatar)) document.querySelector('.mine-profile__avatar img').src=profile.avatar; }
  window.addEventListener('advisor-card-saved',e=>{if(e.detail.name)profile.name=e.detail.name;if(e.detail.name||validAvatar(e.detail.avatar)){if(validAvatar(e.detail.avatar))profile.avatar=e.detail.avatar;try{localStorage.setItem('houseMarket.advisor.profile.v1',JSON.stringify(profile));}catch{}if(view==='mine')renderMine();}});
  const drafts = new Map();
  function toast(text) { $('toast').textContent = text; $('toast').hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => $('toast').hidden = true, 2600); }
  function save() { try { localStorage.setItem(key, JSON.stringify(customers)); } catch { toast('当前浏览器未能保存，请勿刷新页面'); } }
  function counts() { return {all:customers.length, uncontacted:customers.filter(c=>c.status==='uncontacted').length, contacted:customers.filter(c=>c.status==='contacted').length}; }
  const followsEstate = c => c.activities.some(d => d.action === '关注楼盘' && (d.estate || c.estate) === c.estate);
  const avatar = c => `<span class="avatar">${esc(c.name.slice(0,1))}</span>`;
  const activityText = (c,d) => d.action==='关注楼盘'?'已关注'+(d.estate||c.estate)+'楼盘':d.action==='浏览房源'?'浏览房源：3栋1单元1401-120㎡ -542万':d.action==='浏览户型'?'浏览：A户型 142㎡ 3室2厅1卫':d.action;
  function customerActivity(c){return `<div class="customer-activities"><h3>客户动态</h3>${c.activities.map(d=>`<div class="customer-activity"><div>${esc(activityText(c,d))}</div><time>${esc(d.time)}</time></div>`).join('')||'<p class="muted">暂无客户动态</p>'}</div>`;}
  function renderList() {
    const q = view === 'customers' ? $('search').value.trim() : ''; 
    const list = customers.filter(c => (!q || (c.name+c.phone+c.estate).includes(q)) && (view==='messages' ? !unreadOnly || c.unread>0 : true));
    if(view==='messages') list.sort((a,b)=>new Date(b.lastMessageAt)-new Date(a.lastMessageAt));
    $('count').textContent = `共 ${list.length} ${view==='messages'?'个会话':'位客户'}`;
    $('filters').hidden=view==='customers'; $('filters').innerHTML=view==='customers'?'':`<button type="button" data-unread="all">全部消息</button><button type="button" data-unread="unread">未读消息</button>`;
    $('content').innerHTML=list.length?list.map(c=>view==='messages'?`<button class="message-list-item" type="button" data-open-message="${c.id}" aria-label="${esc(c.name)}${c.unread ? '，' + c.unread + '条未读消息' : ''}">
      <div class="message-list-item__avatar">${esc(c.name.slice(0,1))}</div>
      <div class="message-list-item__main"><div class="message-list-item__head"><strong class="message-list-item__sender"><span class="message-list-item__name">${esc(c.name)}</span></strong><span class="message-list-item__time">${messageTime(c)}</span></div><div class="message-list-item__preview">${esc(mask(c.dialog.at(-1)?.image?'[图片]':c.dialog.at(-1)?.text||'暂无消息'))}</div></div>
      <div class="message-list-item__aside">${c.unread ? `<span class="message-list-item__badge">${c.unread}</span>` : '<span></span>'}<span class="message-list-item__meta">›</span></div>
    </button>`:`<section class="card"><div class="row"><a class="customer-summary" href="#customer/${c.id}">${avatar(c)}<div class="grow"><strong>${esc(c.name)}</strong><p class="muted">${esc(c.phone)}</p></div></a><button type="button" class="call-customer" data-call="${c.id}" aria-label="拨打电话" title="拨打电话"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z"/></svg></button></div>${followsEstate(c)?'<span class="followed-estate-tag">已关注您的楼盘</span>':''}${customerActivity(c)}<a class="customer-chat-button" href="#chat/${c.id}?from=customers">在线沟通</a></section>`).join(''):'<div class="empty">暂无符合条件的'+(view==='messages'?'会话':'客户')+'<br>试试调整筛选或搜索条件</div>';
  }
  function renderDetail(c) {
    $('content').innerHTML=`<section class="card"><div class="row">${avatar(c)}<div class="grow"><strong>${esc(c.name)}</strong><p class="muted">${esc(c.phone)}</p></div>${followsEstate(c)?'<span class="badge">已关注您的楼盘</span>':''}</div><dl><dt>意向楼盘</dt><dd>${esc(c.estate)}</dd><dt>客户来源</dt><dd>${esc(c.source)}</dd></dl><div class="actions"><button type="button" data-call="${c.id}">拨打电话</button><a class="primary" href="#chat/${c.id}?from=customer">在线发送消息</a></div></section><section class="card timeline"><h2>客户动态</h2>${c.activities.filter(d=>['关注楼盘','浏览户型','浏览房源'].includes(d.action)).map(d=>`<div class="event"><small>${esc(d.time)}</small><span class="activity-nickname">${esc(d.nickname||c.name)}</span> <span>${esc(activityText(c,d))}</span></div>`).join('') || '<p class="muted">暂无客户动态</p>'}</section>`;
  }
  function renderChat(c) {
    $('content').innerHTML=`<div class="message-contact"><div class="message-contact__avatar">${esc(c.name.slice(0,1))}</div><div class="message-contact__info"><div class="message-contact__name">${esc(c.name)}</div><div class="message-contact__project">${esc(c.phone)}</div></div><button type="button" class="call-customer" data-call="${c.id}" aria-label="拨打电话" title="拨打电话"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z"/></svg></button></div><div class="message-thread__body"><div class="message-thread__time">${messageTime(c)}</div><div class="message-thread__conversation">${c.dialog.map(m=>`<div class="message-thread__reply ${m.role==='user'?'is-user':''}">${m.role==='user'?'':`<div class="message-thread__avatar">${esc(c.name.slice(0,1))}</div>`}<span>${m.image&&/^data:image\/(png|jpeg);base64,/.test(m.image)?`<img src="${m.image}" alt="发送的图片">`:esc(mask(m.text)).replace(/\n/g,'<br>')}</span></div>`).join('')}</div></div>`;
  }
  function renderStats() {
    const unread=customers.reduce((n,c)=>n+(c.unread||0),0);$('unread').textContent=unread;$('unread').hidden=!unread;
  }
  function route() {
    const [path,query='']=(location.hash.slice(1)||'messages').split('?'), [next,id]=path.split('/');
    const previous=current; if(view==='chat'&&previous)drafts.set(previous.id,$('messageInput').value);
    view=['messages','customers','customer','chat','mine'].includes(next)?next:'messages'; current=customers.find(c=>c.id===id)||null;
    if((view==='chat'||view==='customer')&&!current){location.replace('#customers');return;}
    const params=new URLSearchParams(query);
    document.querySelector('.app').style.paddingBottom='';
    const list=view==='messages'||view==='customers';$('listTools').hidden=view!=='customers';$('nav').hidden=!(list||view==='mine');$('back').hidden=list||view==='mine';$('chatTools').hidden=view!=='chat';$('phrases').hidden=true;$('phrasesToggle').setAttribute('aria-expanded','false');$('mediaPanel').hidden=true;$('mediaToggle').setAttribute('aria-expanded','false');document.querySelector('.app').classList.toggle('is-chat',view==='chat');document.querySelector('.app').classList.toggle('is-messages',view==='messages');document.querySelector('.app').classList.toggle('is-mine',view==='mine');
    $('title').textContent='置业顾问端';
    document.querySelectorAll('[data-tab]').forEach(a=>{a.classList.toggle('active',a.dataset.tab===view);a.setAttribute('aria-current',a.dataset.tab===view?'page':'false');});
    $('back').onclick=()=>{location.hash=view==='chat'?(params.get('from')==='customer'?`customer/${current.id}`:params.get('from')==='customers'?'customers':'messages'):(params.get('from')==='chat'?`chat/${current.id}`:'customers');};
    if(view==='mine')renderMine(); else if(list)renderList(); else if(view==='customer')renderDetail(current);else{current.unread=0;save();renderChat(current);$('messageInput').value=drafts.get(current.id)||'';}
    renderStats();window.scrollTo(0,view==='chat'?document.body.scrollHeight:0);
  }
  function send(payload,customer=current) {
    if(!customer)return;
    const time=new Date().toLocaleString('zh-CN',{hour12:false});customer.dialog.push({role:'user',...payload,time});customer.status='contacted';customer.lastActive='刚刚';customer.lastSent=Date.now();customer.lastMessageAt=new Date(customer.lastSent).toISOString();customer.dynamics.unshift({time,text:payload.image?'置业顾问发送了图片':'置业顾问发送了在线消息'});save();
    if(view==='chat'&&current?.id===customer.id){renderChat(customer);window.scrollTo(0,document.body.scrollHeight);}renderStats();
  }
  $('composer').addEventListener('submit',e=>{e.preventDefault();const text=$('messageInput').value.trim();if(!text||text.length>1000)return;send({text});$('messageInput').value='';drafts.delete(current.id);});
  $('search').addEventListener('input',renderList);
  $('filters').onclick=e=>{const b=e.target.closest('button');if(!b)return;unreadOnly=b.dataset.unread==='unread';renderList();};
  $('content').onclick=e=>{const item=e.target.closest('[data-mine-placeholder]');if(item){toast(item.dataset.minePlaceholder+'功能已保留');return;}const message=e.target.closest('[data-open-message]');if(message){location.hash='chat/'+message.dataset.openMessage;return;}const callButton=e.target.closest('[data-call]');const callCustomer=callButton?customers.find(c=>c.id===callButton.dataset.call):null;if(callCustomer){ if(callCustomer.hasCalledAdvisor!==true){toast('客户尚未拨打您的电话，暂不可回拨');return;} $('callNumber').textContent='95013 转 '+callCustomer.privacyNumber.slice(-6); $('callDialog').showModal(); }};
  $('phrasesToggle').onclick=()=>{$('phrases').hidden=!$('phrases').hidden;$('phrasesToggle').setAttribute('aria-expanded',String(!$('phrases').hidden));};
  $('mediaToggle').onclick=()=>{$('mediaPanel').hidden=!$('mediaPanel').hidden;$('mediaToggle').setAttribute('aria-expanded',String(!$('mediaPanel').hidden));document.querySelector('.app').style.paddingBottom=$('mediaPanel').hidden?'':'calc(290px + env(safe-area-inset-bottom,0px))';};
  $('albumButton').onclick=()=>$('imageInput').click();
  $('cameraButton').onclick=()=>$('cameraInput').click();
  let phrases=['您好，请问您意向的区域和预算是多少？','好的，我整理好资料后发给您。','好的，谢谢您的回复。'];
  try {const saved=JSON.parse(localStorage.getItem('houseMarketCommonPhrases'));if(Array.isArray(saved))phrases=saved.filter(p=>p.scenes?.includes('置业顾问')&&typeof p.text==='string').map(p=>p.text);}catch{}
  $('phrases').innerHTML=phrases.length?phrases.map((p,i)=>`<button type="button" data-phrase="${i}">${esc(mask(p))}</button>`).join(''):'<p class="muted">暂无顾问常用语</p>';
  $('phrases').onclick=e=>{const b=e.target.closest('[data-phrase]');if(b){$('messageInput').value=phrases[Number(b.dataset.phrase)].slice(0,1000);$('phrases').hidden=true;$('phrasesToggle').setAttribute('aria-expanded','false');$('messageInput').focus();}};
  $('imageInput').onchange=e=>{const file=e.target.files[0],customer=current;e.target.value='';if(!file||!customer)return;if(!['image/png','image/jpeg'].includes(file.type)||file.size>1024*1024)return toast('请选择不超过 1MB 的 JPG 或 PNG 图片');const reader=new FileReader();reader.onload=()=>send({image:reader.result,text:'[图片]'},customer);reader.onerror=()=>toast('图片读取失败，请重试');reader.readAsDataURL(file);};
  $('cameraInput').onchange=$('imageInput').onchange;
  $('closeSettings').onclick=()=>{if(!$('settingsPolicy').hidden){$('settingsPolicy').hidden=true;$('settingsForm').hidden=false;$('settingsTitle').textContent='资料设置';}else $('settingsDialog').close();};
  $('settingsDialog').addEventListener('close',()=>{avatarReadVersion++;});
  $('clearAdvisorName').onclick=()=>{$('advisorName').value='';$('advisorName').focus();};
  $('advisorName').addEventListener('focus',()=>{$('nicknameChoice').hidden=false;});
  $('settingsForm').addEventListener('focusout',()=>setTimeout(()=>{if(document.activeElement!==$('advisorName')&&!$('nicknameChoice').contains(document.activeElement))$('nicknameChoice').hidden=true;},0));
  $('useWechatNickname').onclick=()=>{$('advisorName').value='Jie';$('nicknameChoice').hidden=true;};
  $('clearAdvisorWechat').onclick=()=>{$('advisorWechat').value='';$('advisorWechat').focus();};
  $('settingsPhone').onclick=()=>$('settingsPhonePrompt').showModal();
  $('closeSettingsPhone').onclick=()=>$('settingsPhonePrompt').close();
  $('settingsDialog').addEventListener('click',e=>{const button=e.target.closest('[data-settings-policy]');if(!button)return;const title=button.dataset.settingsPolicy;$('settingsTitle').textContent=title;$('settingsForm').hidden=true;$('settingsPolicy').hidden=false;$('settingsPolicyText').textContent=title+'正文待平台提供，当前为页面原型预览。';});
  $('settingsAvatarInput').onchange=e=>{
    const file=e.target.files[0];if(!file)return;$('settingsError').hidden=false;
    const version=++avatarReadVersion;$('saveSettings').disabled=false;
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024){$('settingsError').textContent='请选择不超过5MB的PNG、JPG或WebP图片';return;}
    $('saveSettings').disabled=true;$('settingsError').textContent='正在读取头像…';
    const reader=new FileReader();
    reader.onload=()=>{if(version!==avatarReadVersion)return;draftAvatar=reader.result;$('settingsAvatarPreview').src=draftAvatar;$('saveSettings').disabled=false;$('settingsError').textContent='';};
    reader.onerror=()=>{if(version!==avatarReadVersion)return;$('saveSettings').disabled=false;$('settingsError').textContent='头像读取失败，请重试';};
    reader.readAsDataURL(file);
  };
  $('settingsForm').addEventListener('submit',e=>{
    e.preventDefault();if($('saveSettings').disabled)return;const name=$('advisorName').value.trim(),wechat=$('advisorWechat').value.trim();$('settingsError').hidden=false;
    if(!name||name.length>20||wechat.length>32){$('settingsError').textContent='请填写20字以内的昵称，微信号不超过32字';return;}
    const next={...profile,name,wechat,avatar:draftAvatar};
    try {localStorage.setItem('houseMarket.advisor.profile.v1',JSON.stringify(next));} catch {$('settingsError').textContent='保存失败，请尝试更小的头像或检查浏览器存储后重试';return;}
    profile=next;if(view==='mine')renderMine();$('settingsError').textContent='已保存';$('nicknameChoice').hidden=true;
  });
  $('closeCall').onclick=()=>$('callDialog').close();
  // One-time unread fixture for existing prototype sessions that already read every conversation.
  if (!customers.some(c => c.unreadPreviewInitialized)) {
    if (customers.every(c => c.unread === 0)) {
      const customer = customers[0];
      const now = new Date();
      customer.dialog.push({role:'bot', text:'您好，周末想过来看看123㎡三房，下午两点方便吗？', time:now.toLocaleString('zh-CN', {timeZone:'Asia/Shanghai', hour12:false})});
      customer.unread = 1;
      customer.lastMessageAt = now.toISOString();
      customer.lastActive = '刚刚';
    }
    customers.forEach(c => c.unreadPreviewInitialized = true);
    save();
  }
  window.addEventListener('hashchange',route);window.addEventListener('keywords-changed',()=>{if(view==='chat')renderChat(current);else if(view==='messages')renderList();});route();
})();
