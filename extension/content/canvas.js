// Content script for canvas.nus.edu.sg
// Scrapes announcements, upcoming deadlines, and unread notifications from the DOM

(async function scrapeCanvas() {
  const settings = await getSettings();
  if (!settings.sources.canvas) return;

  const items = [];

  // --- Announcements ---
  // Canvas renders announcements in .ic-announcement-row elements on /courses/:id/announcements
  document.querySelectorAll('.ic-announcement-row').forEach(row => {
    const titleEl = row.querySelector('.ic-announcement-row__content-title');
    const dateEl = row.querySelector('.ic-announcement-row__content-date');
    if (!titleEl) return;
    items.push({
      source: 'Canvas',
      type: 'announcement',
      title: titleEl.textContent.trim(),
      date: dateEl ? dateEl.textContent.trim() : null,
      url: titleEl.closest('a')?.href || location.href,
    });
  });

  // --- Upcoming Deadlines (Assignments) ---
  // Sidebar "Coming Up" panel on dashboard
  document.querySelectorAll('.coming_up .to-do-item, .todo-list-item').forEach(el => {
    const titleEl = el.querySelector('.item-details__title, .to-do-item__name');
    const dateEl = el.querySelector('.item-details__due-at, .to-do-item__info');
    if (!titleEl) return;
    items.push({
      source: 'Canvas',
      type: 'deadline',
      title: titleEl.textContent.trim(),
      date: dateEl ? dateEl.textContent.trim() : null,
      url: titleEl.closest('a')?.href || location.href,
    });
  });

  // --- Unread Notifications (notification bell items) ---
  document.querySelectorAll('#global_nav_notifications_tray .notifications-list li').forEach(el => {
    const titleEl = el.querySelector('.notification-subject, .Title');
    const dateEl = el.querySelector('.notification-date, .Datetime');
    if (!titleEl) return;
    items.push({
      source: 'Canvas',
      type: 'notification',
      title: titleEl.textContent.trim(),
      date: dateEl ? dateEl.textContent.trim() : null,
      url: el.querySelector('a')?.href || location.href,
    });
  });

  await processItems(items);
})();

async function processItems(items) {
  const seen = await getSeenFingerprints();

  for (const item of items) {
    const fp = makeFingerprint(item.title, item.source, item.date);
    if (seen.has(fp)) continue;
    if (await isSuppressed(item.title)) continue;
    if (!(await canNotify('canvas'))) break;

    await markFingerprint(fp);
    await incrementNotifyCount('canvas');

    const feedItem = { ...item, fingerprint: fp, seenAt: Date.now() };
    await addFeedItem(feedItem);

    const deadline = item.date ? ` — ${item.date}` : '';
    chrome.runtime.sendMessage({
      type: 'NOTIFY',
      title: `[Canvas] ${item.title}`,
      message: deadline,
      fingerprint: fp,
    });
  }
}
