// Generates a stable fingerprint for deduplication: hash of title+source+date
function djb2Hash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0; // keep unsigned 32-bit
  }
  return hash.toString(16);
}

function makeFingerprint(title, source, date) {
  const normalized = `${title.trim().toLowerCase()}|${source}|${date || ''}`;
  return djb2Hash(normalized);
}

// Extract keywords from a title for "don't show like this" suppression
function extractKeywords(title) {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'for', 'in', 'on', 'at', 'to', 'of', 'is', 'are', 'with', 'by']);
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
}
