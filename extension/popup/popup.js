// Popup UI logic

const SOURCE_LABELS = {
  canvas: 'Canvas',
  talentconnect: 'TalentConnect',
  reddit: 'Reddit r/NUS',
  nus_scholarships: 'NUS Scholarships',
  nus_news: 'NUS News',
  devpost: 'Devpost',
};

const SOURCE_TAG_CLASS = {
  Canvas: 'tag-canvas',
  TalentConnect: 'tag-talentconnect',
  Reddit: 'tag-reddit',
  'NUS Scholarships': 'tag-scholarship',
  'NUS News': 'tag-news',
  Devpost: 'tag-devpost',
};

async function init() {
  await renderFeed();
  await renderSettings();
  setupSettingsToggle();
}

async function renderFeed() {
  const data = await chrome.storage.local.get('feed_items');
  const items = data.feed_items || [];
  const list = document.getElementById('feed-list');
  const empty = document.getElementById('empty-state');

  list.innerHTML = '';

  if (items.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'feed-item';
    li.dataset.fingerprint = item.fingerprint;

    const tagClass = SOURCE_TAG_CLASS[item.source] || 'tag-news';
    const relTime = item.seenAt ? formatRelTime(item.seenAt) : '';

    li.innerHTML = `
      <div class="item-top">
        <span class="item-title">${escHtml(item.title)}</span>
        <button class="dismiss-btn" title="Dismiss" aria-label="Dismiss">×</button>
      </div>
      <div class="item-meta">
        <span class="source-tag ${tagClass}">${escHtml(item.source)}</span>
        ${item.date ? `<span class="item-date">${escHtml(item.date)}</span>` : ''}
        ${relTime ? `<span class="item-date">${relTime}</span>` : ''}
        <button class="suppress-btn" title="Don't show similar items">Don't show like this</button>
      </div>
    `;

    li.querySelector('.dismiss-btn').addEventListener('click', () => dismissItem(item.fingerprint, li));
    li.querySelector('.suppress-btn').addEventListener('click', () => suppressItem(item));

    list.appendChild(li);
  });
}

async function dismissItem(fingerprint, liEl) {
  const data = await chrome.storage.local.get('feed_items');
  const items = (data.feed_items || []).filter(i => i.fingerprint !== fingerprint);
  await chrome.storage.local.set({ feed_items: items });
  liEl.remove();
  if (items.length === 0) {
    document.getElementById('empty-state').classList.remove('hidden');
  }
}

async function suppressItem(item) {
  // Extract keywords and store as a suppression set
  const keywords = extractKeywords(item.title);
  if (keywords.length < 2) {
    alert('Not enough keywords to create a suppression rule from this title.');
    return;
  }
  const data = await chrome.storage.local.get('suppressed_keywords');
  const sets = data.suppressed_keywords || [];
  sets.push(keywords);
  await chrome.storage.local.set({ suppressed_keywords: sets });
  await dismissItem(item.fingerprint, document.querySelector(`[data-fingerprint="${item.fingerprint}"]`));
}

async function renderSettings() {
  const data = await chrome.storage.local.get('settings');
  const settings = data.settings || { sources: {} };
  const container = document.getElementById('source-toggles');
  container.innerHTML = '';

  Object.entries(SOURCE_LABELS).forEach(([key, label]) => {
    const enabled = settings.sources[key] !== false; // default on
    const row = document.createElement('div');
    row.className = 'toggle-row';
    row.innerHTML = `
      <span>${escHtml(label)}</span>
      <label class="toggle-switch">
        <input type="checkbox" data-source="${key}" ${enabled ? 'checked' : ''} />
        <span class="slider"></span>
      </label>
    `;
    row.querySelector('input').addEventListener('change', async (e) => {
      const d = await chrome.storage.local.get('settings');
      const s = d.settings || { sources: {} };
      s.sources[key] = e.target.checked;
      await chrome.storage.local.set({ settings: s });
    });
    container.appendChild(row);
  });

  document.getElementById('clear-all-btn').addEventListener('click', async () => {
    if (!confirm('Clear all alerts from the feed?')) return;
    await chrome.storage.local.set({ feed_items: [] });
    await renderFeed();
  });
}

function setupSettingsToggle() {
  const btn = document.getElementById('settings-btn');
  const panel = document.getElementById('settings-panel');
  btn.addEventListener('click', () => panel.classList.toggle('hidden'));
}

// ---- Helpers ----

function extractKeywords(title) {
  const stop = new Set(['the', 'a', 'an', 'and', 'or', 'for', 'in', 'on', 'at', 'to', 'of', 'is', 'are', 'with', 'by']);
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3 && !stop.has(w));
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

function formatRelTime(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

document.addEventListener('DOMContentLoaded', init);
