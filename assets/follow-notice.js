(() => {
  if (window.HouseFollowNotice) return;

  const preferenceKey = 'houseMarket.followNotice.hidden.v1';
  let suppressed = false;
  let dialog;
  let checkbox;

  function shouldSkip() {
    if (suppressed) return true;
    try { return localStorage.getItem(preferenceKey) === '1'; } catch { return false; }
  }

  function createDialog() {
    dialog = document.createElement('dialog');
    dialog.id = 'followNoticeDialog';
    dialog.setAttribute('aria-labelledby', 'followNoticeTitle');
    dialog.setAttribute('aria-describedby', 'followNoticeMessage');
    dialog.innerHTML = `
      <form method="dialog">
        <span class="follow-notice__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20.8 4.7a5.6 5.6 0 0 0-7.9 0l-.9.9-.9-.9a5.6 5.6 0 0 0-7.9 7.9L12 21l8.8-8.4a5.6 5.6 0 0 0 0-7.9Z"/></svg></span>
        <h2 id="followNoticeTitle">关注成功</h2>
        <p id="followNoticeMessage">楼盘已加入“我的关注”。<br>有新动态，我们会第一时间通知您。</p>
        <label class="follow-notice__preference"><input id="followNoticeHide" type="checkbox"><span>不再提示</span></label>
        <button class="follow-notice__confirm" type="submit" autofocus>我知道了</button>
      </form>`;
    document.body.append(dialog);
    checkbox = dialog.querySelector('input');
    dialog.querySelector('form').addEventListener('submit', () => {
      if (!checkbox.checked) return;
      suppressed = true;
      try { localStorage.setItem(preferenceKey, '1'); } catch { /* Keep the choice for the current page if storage is unavailable. */ }
    });
  }

  function show() {
    if (shouldSkip()) return false;
    if (!dialog) createDialog();
    if (!dialog.open) {
      checkbox.checked = false;
      dialog.showModal();
    }
    return true;
  }

  window.HouseFollowNotice = Object.freeze({ show });
})();
