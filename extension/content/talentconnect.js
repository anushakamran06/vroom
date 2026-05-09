// Content script for nus-csm.symplicity.com (TalentConnect)
// Scrapes internship listings: role title, company, deadline, eligibility

(async function scrapeTalentConnect() {
  const settings = await getSettings();
  if (!settings.sources.talentconnect) return;

  const items = [];

  // Job listing rows — Symplicity renders these as table rows or card elements
  const listingSelectors = [
    '.symplicity-job-item',
    'tr.job-list-row',
    '.position-item',
    '[data-role="job-listing"]',
  ];

  for (const selector of listingSelectors) {
    document.querySelectorAll(selector).forEach(row => {
      const titleEl = row.querySelector('.job-title, .position-title, h3, h4');
      const companyEl = row.querySelector('.employer-name, .company-name, .org-name');
      const deadlineEl = row.querySelector('.deadline, .close-date, .expiry-date');
      const eligibilityEl = row.querySelector('.eligibility, .student-level');

      if (!titleEl) return;

      const company = companyEl?.textContent.trim() || 'Unknown Company';
      const deadline = deadlineEl?.textContent.trim() || null;
      const eligibility = eligibilityEl?.textContent.trim() || null;

      const title = `${titleEl.textContent.trim()} @ ${company}`;
      const meta = [deadline ? `Deadline: ${deadline}` : null, eligibility]
        .filter(Boolean)
        .join(' | ');

      items.push({
        source: 'TalentConnect',
        type: 'internship',
        title,
        date: deadline,
        meta,
        url: row.querySelector('a')?.href || location.href,
      });
    });

    if (items.length > 0) break; // found listings with this selector
  }

  // Fallback: scrape any <table> that looks like a job board
  if (items.length === 0) {
    document.querySelectorAll('table tbody tr').forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 2) return;
      const title = cells[0].textContent.trim();
      const company = cells[1]?.textContent.trim() || '';
      const deadline = cells[3]?.textContent.trim() || null;
      if (!title || title.length < 4) return;

      items.push({
        source: 'TalentConnect',
        type: 'internship',
        title: company ? `${title} @ ${company}` : title,
        date: deadline,
        url: row.querySelector('a')?.href || location.href,
      });
    });
  }

  await processItems(items);
})();

async function processItems(items) {
  const seen = await getSeenFingerprints();

  for (const item of items) {
    const fp = makeFingerprint(item.title, item.source, item.date);
    if (seen.has(fp)) continue;
    if (await isSuppressed(item.title)) continue;
    if (!(await canNotify('talentconnect'))) break;

    await markFingerprint(fp);
    await incrementNotifyCount('talentconnect');

    const feedItem = { ...item, fingerprint: fp, seenAt: Date.now() };
    await addFeedItem(feedItem);

    const deadline = item.date ? ` — ${item.date}` : '';
    chrome.runtime.sendMessage({
      type: 'NOTIFY',
      title: `[TalentConnect] ${item.title}`,
      message: deadline,
      fingerprint: fp,
    });
  }
}
