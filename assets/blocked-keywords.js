(() => {
  const key = 'houseMarket.blockedKeywords.v1';
  function read() {
    try { const rows = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(rows) ? rows.filter(r => r && typeof r.word === 'string' && r.word.trim()) : []; }
    catch { return []; }
  }
  function save(rows) {
    localStorage.setItem(key, JSON.stringify(rows));
    window.dispatchEvent(new Event('keywords-changed'));
  }
  function mask(value) {
    const text = String(value ?? ''), marked = new Set();
    for (const {word} of read()) {
      let start = text.indexOf(word);
      while (start !== -1) {
        for (let i = start; i < start + word.length; i++) marked.add(i);
        start = text.indexOf(word, start + 1);
      }
    }
    let offset = 0;
    return Array.from(text, char => { const hidden = Array.from({length:char.length}, (_,i) => marked.has(offset+i)).some(Boolean); offset += char.length; return hidden ? '*' : char; }).join('');
  }
  window.BlockedKeywords = {read, save, mask};
  window.addEventListener('storage', e => { if (e.key === key || e.key === null) window.dispatchEvent(new Event('keywords-changed')); });
})();
