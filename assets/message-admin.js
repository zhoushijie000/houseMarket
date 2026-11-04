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
})();
