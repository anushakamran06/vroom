// Service worker — handles alarms, background polling, Chrome notifications

const BACKEND_BASE = 'https://next-extension-api.fly.dev';
const ALARM_NAME = 'public-source-poll';
const ALARM_PERIOD_MINUTES = 360; // 6 hours

// ---- Lifecycle ----

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await showOnboarding();
  }
  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: 1,
    periodInMinutes: ALARM_PERIOD_MINUTES,
  });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAME) {
    await pollPublicSources();
  }
});

// ---- Message handling (from content scripts) ----

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'NOTIFY') {
    fireNotification(msg.fingerprint, msg.title, msg.message);
  }
  sendResponse({ ok: true });
});

// ---- Notification dispatch ----

function fireNotification(id, title, message) {
  chrome.notifications.create(id, {
    type: 'basic',
    iconUrl: '../icons/icon48.png',
    title,
    message: message || '',
    priority: 1,
  });
}

// ---- Backend polling for public sources ----

async function pollPublicSources() {
  const settingsData = await chrome.storage.local.get('settings');
  const settings = settingsData.settings || {};
  const template = settings.template || 'freshman';

  try {
    const res = await fetch(`${BACKEND_BASE}/feed?template=${template}`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return;

    const items = await res.json();
    await processBackendItems(items);
  } catch (_e) {
    // Network unavailable — silent fail, will retry on next alarm
  }
}

async function processBackendItems(items) {
  const data = await chrome.storage.local.get(['seen_fingerprints', 'suppressed_keywords', 'daily_counts']);
  const seen = new Set(data.seen_fingerprints || []);
  const suppressedSets = data.suppressed_keywords || [];
  const today = new Date().toISOString().slice(0, 10);
  const counts = (data.daily_counts?._date === today) ? data.daily_counts : { _date: today };

  const newSeen = [...seen];
  const feedItems = [];

  for (const item of items) {
    const fp = item.fingerprint || djb2Hash(`${item.title}|${item.source}|${item.date || ''}`);
    if (seen.has(fp)) continue;
    if (isSuppressedSync(item.title, suppressedSets)) continue;

    const source = item.source?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
    if ((counts[source] || 0) >= 5) continue;

    newSeen.push(fp);
    counts[source] = (counts[source] || 0) + 1;

    feedItems.push({ ...item, fingerprint: fp, seenAt: Date.now() });

    const deadline = item.date ? ` — ${item.date}` : '';
    fireNotification(fp, `[${item.source}] ${item.title}`, deadline);
  }

  const existingFeed = (await chrome.storage.local.get('feed_items')).feed_items || [];
  const merged = [...feedItems, ...existingFeed].slice(0, 200);

  await chrome.storage.local.set({
    seen_fingerprints: newSeen.slice(-5000),
    feed_items: merged,
    daily_counts: counts,
  });
}

// ---- Onboarding ----

async function showOnboarding() {
  chrome.tabs.create({ url: chrome.runtime.getURL('popup/onboarding.html') });
}

// ---- Helpers (duplicated from utils for service worker scope) ----

function djb2Hash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0;
  }
  return hash.toString(16);
}

function isSuppressedSync(title, suppressedSets) {
  const words = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
  const wordSet = new Set(words);
  for (const kwSet of suppressedSets) {
    if (kwSet.filter(k => wordSet.has(k)).length >= 2) return true;
  }
  return false;
}
