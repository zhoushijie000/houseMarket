(() => {
  const entry = document.querySelector('.mine-profile');

  const name = entry?.querySelector('.mine-profile__phone, .mine-login');
  if (name) name.textContent = '房产超市用户';
  entry?.setAttribute('role', 'button');
  entry?.setAttribute('tabindex', '0');
  entry?.setAttribute('aria-label', '进入资料设置');
  const avatar = entry?.querySelector('.mine-profile__avatar, .mine-avatar');
  const defaultAvatar = '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="22" r="12"/><path d="M12 60c0-27 40-27 40 0Z"/></svg>';
  if (avatar) avatar.innerHTML = defaultAvatar;
  if (entry && !entry.querySelector('.mine-arrow')) entry.insertAdjacentHTML('beforeend', '<span class="profile-entry-arrow" aria-hidden="true">›</span>');
  const style = document.createElement('style');
  style.textContent = `
    .mine-profile{cursor:pointer}.mine-profile::after{pointer-events:none}.mine-profile__phone{font-size:22px}.profile-entry-arrow{margin-left:auto;font-size:30px;z-index:1}.mine-profile__avatar svg{width:100%;height:100%;fill:#ffb18b}.mine-profile__copy{flex:1}
    .binding-page{--binding-brand:#fd5d00;--binding-bg:#f3f5f6;--binding-text:#303133;box-sizing:border-box;width:min(100%,430px);height:100dvh;max-height:100dvh;max-width:100%;margin:auto;padding:0;border:0;background:var(--binding-bg);color:var(--binding-text);font:14px -apple-system,BlinkMacSystemFont,'Microsoft YaHei',sans-serif}.binding-page::backdrop{background:#0005}.binding-page *{box-sizing:border-box}.binding-header{height:60px;display:flex;align-items:center;background:white;padding:0 16px;border-bottom:1px solid #f0f0f0}.binding-header h1{font-size:17px;text-align:center;flex:1;margin:0;padding-right:36px}.binding-back{border:0;background:none;font-size:30px;width:36px;cursor:pointer}.binding-body{padding:24px 16px}.binding-card{background:white;border-radius:12px;padding:0 16px}.binding-row{min-height:64px;display:flex;align-items:center;gap:16px;border-bottom:1px solid #f1f2f3}.binding-row:last-child{border:0}.binding-row>span:first-child{min-width:56px}.binding-row input:not([type=file]){width:100%;min-width:0;border:0;outline:0;text-align:right;font:inherit;color:var(--binding-text);padding:18px 0}.binding-row:focus-within{box-shadow:inset 0 -2px var(--binding-brand)}.binding-avatar{display:flex;align-items:center;gap:12px;margin-left:auto;padding:14px 0;color:#909399;cursor:pointer}.binding-avatar-icon{display:block;width:56px;height:56px;border-radius:50%;overflow:hidden;background:#fff2e8}.binding-avatar-icon svg{width:100%;height:100%;fill:#ffb18b}.binding-avatar-icon img{width:100%;height:100%;object-fit:cover}.binding-save{width:100%;height:46px;border:0;border-radius:8px;background:var(--binding-brand);color:white;font:inherit;margin-top:24px;cursor:pointer}.binding-legal{display:flex;justify-content:center;gap:12px;align-items:center;margin-top:24px;color:#c0c4cc}.binding-legal button{padding:6px 0;border:0;background:none;color:#606266;font:12px inherit;cursor:pointer}.binding-feedback{min-height:20px;color:#909399;font-size:12px;line-height:1.6;margin-top:12px}.binding-policy{line-height:1.8;color:#606266}.binding-page [hidden]{display:none!important}
  `;
  style.textContent += `
    .binding-header{background:#f5f5f5;border:0}.binding-body{padding:0}.binding-card{border-radius:0;padding:0 16px}.binding-avatar--hero{flex-direction:column;justify-content:center;gap:10px;height:192px;margin:0;background:#f5f5f5;font-size:14px}.binding-avatar--hero .binding-avatar-icon{width:80px;height:80px;border:2px solid white}.binding-row{gap:12px;min-height:64px}.binding-row>label,.binding-row>span:first-child{min-width:92px;flex-shrink:0;font-size:16px}.binding-row input:not([type=file]){text-align:left;font-size:16px}.binding-clear{border:0;border-radius:50%;background:#999;color:white;flex:0 0 18px;height:18px;padding:0;font-size:17px;line-height:16px;cursor:pointer}.binding-phone{width:100%;padding:0;background:white;border:0;border-bottom:1px solid #f1f2f3;text-align:left;font:inherit;cursor:pointer;color:inherit}.binding-phone-value{flex:1;color:#909399}.binding-chevron{font-size:28px;color:#c0c4cc}.binding-actions{padding:0 16px 24px}.binding-nickname-choice{padding:8px;background:#e9e9e9;margin:0 -16px}.binding-nickname-choice button{border:0;border-radius:8px;background:#f5f5f5;padding:10px;width:100%;cursor:pointer;font:inherit}.binding-nickname-choice span{display:block;color:#909399;margin-bottom:4px}.binding-nickname-choice strong{font-weight:400;font-size:16px}.binding-policy{padding:24px 16px}.binding-phone-prompt{border:0;border-radius:16px;padding:24px;width:calc(100% - 48px);max-width:320px;color:#303133;font:14px 'Microsoft YaHei',sans-serif}.binding-phone-prompt::backdrop{background:#0006}.binding-phone-prompt h2{font-size:17px;margin:0 0 12px}.binding-phone-prompt p{color:#606266;line-height:1.7;margin:0 0 20px}.binding-phone-prompt button{border:0;border-radius:8px;background:#fd5d00;color:white;width:100%;padding:12px;cursor:pointer}.mine-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%}
  `;
  document.head.append(style);
  const page = document.createElement('dialog');
  page.className = 'binding-page';
  page.setAttribute('aria-label', '资料设置');
  page.innerHTML = `<header class="binding-header"><button class="binding-back" aria-label="返回" type="button">‹</button><h1>资料设置</h1></header><div class="binding-body"><form id="bindingForm"><label class="binding-avatar binding-avatar--hero"><span class="binding-avatar-icon">${defaultAvatar}</span><span>点击修改头像</span><input type="file" accept="image/png,image/jpeg,image/webp" hidden aria-label="选择头像"></label><div class="binding-card"><div class="binding-nickname-choice" hidden><button type="button" id="useWechatNickname"><span>用微信昵称</span><strong>Jie</strong></button></div><div class="binding-row"><label for="profileNickname">昵称</label><input id="profileNickname" name="nickname" maxlength="20" required value="房产超市用户" placeholder="请输入昵称" autocomplete="nickname"><button class="binding-clear" data-clear="nickname" type="button" aria-label="清空昵称">×</button></div><button class="binding-row binding-phone" type="button"><span>手机号</span><span class="binding-phone-value">待获取</span><span class="binding-chevron" aria-hidden="true">›</span></button><div class="binding-row"><label for="profileWechat">绑定微信号</label><input id="profileWechat" name="wechat" maxlength="32" placeholder="默认与手机号一致" autocomplete="off"><button class="binding-clear" data-clear="wechat" type="button" aria-label="清空微信号">×</button></div></div><div class="binding-actions"><button class="binding-save" type="submit">保存</button><div class="binding-feedback" role="status" hidden></div><div class="binding-legal"><button type="button" data-policy="用户协议">《用户协议》</button><span>|</span><button type="button" data-policy="隐私政策">《隐私政策》</button></div></div></form><section class="binding-policy" hidden><p></p></section></div>`;
  document.body.append(page);
  const form = page.querySelector('form');
  const policy = page.querySelector('.binding-policy');
  const title = page.querySelector('h1');
  let selectedAvatar = '';
  const open = () => { form.hidden = false; policy.hidden = true; title.textContent = '资料设置'; if (!page.open) page.showModal(); };
  entry?.addEventListener('click', open);
  entry?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  page.querySelector('.binding-back').onclick = () => { if (!policy.hidden) { policy.hidden = true; form.hidden = false; title.textContent = '资料设置'; } else page.close(); };
  page.querySelectorAll('[data-policy]').forEach(button => button.onclick = () => { title.textContent = button.dataset.policy; form.hidden = true; policy.hidden = false; policy.querySelector('p').textContent = `${button.dataset.policy}正文待平台提供，当前为页面原型预览。`; });
  page.querySelector('[type=file]').onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { page.querySelector('.binding-feedback').hidden = false; page.querySelector('.binding-feedback').textContent = '请选择不超过 5MB 的 PNG、JPG 或 WebP 图片。'; return; }
    const reader = new FileReader();
    reader.onload = () => { selectedAvatar = reader.result; const img = document.createElement('img'); img.src = selectedAvatar; img.alt = '用户头像'; page.querySelector('.binding-avatar-icon').replaceChildren(img); };
    reader.readAsDataURL(file);
  };
  form.onsubmit = e => { e.preventDefault(); const nickname = form.elements.nickname.value.trim(); if (!nickname) { form.elements.nickname.setCustomValidity('请输入昵称'); form.elements.nickname.reportValidity(); return; } if (name) name.textContent = nickname; if (selectedAvatar && avatar) { const img = document.createElement('img'); img.src = selectedAvatar; img.alt = '用户头像'; avatar.replaceChildren(img); } feedback.hidden = false; feedback.textContent = '已保存'; nicknameChoice.hidden = true; };
  form.elements.nickname.oninput = () => form.elements.nickname.setCustomValidity('');
  const feedback = page.querySelector('.binding-feedback');
  const nicknameChoice = page.querySelector('.binding-nickname-choice');
  form.elements.nickname.addEventListener('focus', () => { nicknameChoice.hidden = false; });
  form.addEventListener('focusout', () => setTimeout(() => {
    if (document.activeElement !== form.elements.nickname && !nicknameChoice.contains(document.activeElement)) nicknameChoice.hidden = true;
  }, 0));
  page.querySelector('#useWechatNickname').onclick = () => { form.elements.nickname.value = 'Jie'; form.elements.nickname.setCustomValidity(''); nicknameChoice.hidden = true; };
  page.querySelectorAll('[data-clear]').forEach(button => button.onclick = () => { const input = form.elements[button.dataset.clear]; input.value = ''; input.focus(); });

  // Only the entry and requirement are prototyped; no phone retrieval is implemented.
  let phone = '';
  const phonePrompt = document.createElement('dialog');
  phonePrompt.className = 'binding-phone-prompt';
  phonePrompt.setAttribute('aria-labelledby', 'phonePromptTitle');
  phonePrompt.innerHTML = '<h2 id="phonePromptTitle">获取手机号</h2><p>请先获取手机号</p><button type="button">我知道了</button>';
  document.body.append(phonePrompt);
  phonePrompt.querySelector('button').onclick = () => phonePrompt.close();
  function requirePhone(reason) {
    if (phone) return true;
    phonePrompt.querySelector('p').textContent = reason || '请先获取手机号';
    if (!phonePrompt.open) phonePrompt.showModal();
    return false;
  }
  page.querySelector('.binding-phone').onclick = () => requirePhone('获取手机号后，可绑定手机号；微信号默认与手机号一致。');
  window.houseMarketRequirePhone = requirePhone;
  // Accept a verified value supplied by the host; this does not acquire a phone number.
  window.addEventListener('housemarket:phone-bound', event => {
    const nextPhone = String(event.detail?.phone || '');
    if (!/^1[3-9][0-9]{9}$/.test(nextPhone)) return;
    if (!form.elements.wechat.value || form.elements.wechat.value === phone) form.elements.wechat.value = nextPhone;
    phone = nextPhone;
    page.querySelector('.binding-phone-value').textContent = phone.slice(0,3) + '****' + phone.slice(-4);
    if (phonePrompt.open) phonePrompt.close();
  });
  document.addEventListener('click', event => {
    const target = event.target.closest('button, a, [data-advisor-index]');
    if (!target) return;
    const following = target.matches('[data-mine-placeholder="我的关注"], .follow') || target.textContent.trim() === '我的关注';
    const contact = target.matches('#advisorOnlineButton, [data-advisor-index], [data-chat-advisor-name]');
    if ((following || contact) && !requirePhone(following ? '查看关注页面前，需要先获取您的手机号。' : '在线联系置业顾问前，需要先获取您的手机号。')) {
      event.preventDefault(); event.stopImmediatePropagation();
    }
  }, true);
})();
