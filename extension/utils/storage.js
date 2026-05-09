// Wrappers around chrome.storage.local for typed access

const KEYS = {
  SEEN_FINGERPRINTS: 'seen_fingerprints',
  SUPPRESSED_KEYWORDS: 'suppressed_keywords',
  FEED_ITEMS: 'feed_items',
  SETTINGS: 'settings',
  DAILY_COUNTS: 'daily_counts',
};

const MAX_FEED_ITEMS = 200;
const MAX_NOTIFICATIONS_PER_SOURCE_PER_DAY = 5;

async function getSeenFingerprints() {
  const data = await chrome.storage.local.get(KEYS.SEEN_FINGERPRINTS);
  return new Set(data[KEYS.SEEN_FINGERPRINTS] || []);
}

async function markFingerprint(fp) {
  const seen = await getSeenFingerprints();
  seen.add(fp);
  // Keep last 5000 fingerprints to bound storage growth
  const trimmed = [...seen].slice(-5000);
  await chrome.storage.local.set({ [KEYS.SEEN_FINGERPRINTS]: trimmed });
}

async function getSuppressedKeywordSets() {
  const data = await chrome.storage.local.get(KEYS.SUPPRESSED_KEYWORDS);
  return data[KEYS.SUPPRESSED_KEYWORDS] || [];
}

async function addSuppressedKeywords(keywords) {
  const sets = await getSuppressedKeywordSets();
  sets.push(keywords);
  await chrome.storage.local.set({ [KEYS.SUPPRESSED_KEYWORDS]: sets });
}

// Returns true if 2+ keywords from item's title match any suppressed set
async function isSuppressed(title) {
  const sets = await getSuppressedKeywordSets();
  const itemWords = new Set(extractKeywords(title));
  for (const kwSet of sets) {
    const matches = kwSet.filter(k => itemWords.has(k));
    if (matches.length >= 2) return true;
  }
  return false;
}

async function getFeedItems() {
  const data = await chrome.storage.local.get(KEYS.FEED_ITEMS);
  return data[KEYS.FEED_ITEMS] || [];
}

async function addFeedItem(item) {
  const items = await getFeedItems();
  items.unshift(item); // newest first
  const trimmed = items.slice(0, MAX_FEED_ITEMS);
  await chrome.storage.local.set({ [KEYS.FEED_ITEMS]: trimmed });
}

async function dismissFeedItem(fingerprint) {
  const items = await getFeedItems();
  const updated = items.filter(i => i.fingerprint !== fingerprint);
  await chrome.storage.local.set({ [KEYS.FEED_ITEMS]: updated });
}

async function getSettings() {
  const data = await chrome.storage.local.get(KEYS.SETTINGS);
  return data[KEYS.SETTINGS] || getDefaultSettings();
}

function getDefaultSettings() {
  return {
    template: null, // set on first install
    sources: {
      canvas: true,
      talentconnect: true,
      reddit: true,
      nus_scholarships: true,
      nus_news: true,
      devpost: true,
    },
  };
}

async function saveSettings(settings) {
  await chrome.storage.local.set({ [KEYS.SETTINGS]: settings });
}

// Daily rate limiter per source
async function canNotify(source) {
  const today = new Date().toISOString().slice(0, 10);
  const data = await chrome.storage.local.get(KEYS.DAILY_COUNTS);
  const counts = data[KEYS.DAILY_COUNTS] || {};

  // Reset counts if it's a new day
  if (counts._date !== today) {
    await chrome.storage.local.set({ [KEYS.DAILY_COUNTS]: { _date: today } });
    return true;
  }

  return (counts[source] || 0) < MAX_NOTIFICATIONS_PER_SOURCE_PER_DAY;
}

async function incrementNotifyCount(source) {
  const today = new Date().toISOString().slice(0, 10);
  const data = await chrome.storage.local.get(KEYS.DAILY_COUNTS);
  const counts = data[KEYS.DAILY_COUNTS] || { _date: today };
  counts[source] = (counts[source] || 0) + 1;
  await chrome.storage.local.set({ [KEYS.DAILY_COUNTS]: counts });
}
