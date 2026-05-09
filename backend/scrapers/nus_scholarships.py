"""Scrapes the NUS Scholarships listing page for new scholarship entries."""
import hashlib
import httpx
from bs4 import BeautifulSoup

URL = "https://scholarships.nus.edu.sg/ScholarshipsListing"
HEADERS = {"User-Agent": "NExtension/1.0"}


def _fingerprint(title: str) -> str:
    raw = f"{title.strip().lower()}|NUS Scholarships|"
    return hashlib.sha256(raw.encode()).hexdigest()[:32]


async def scrape() -> list[dict]:
    async with httpx.AsyncClient(headers=HEADERS, timeout=20, follow_redirects=True) as client:
        try:
            resp = await client.get(URL)
            resp.raise_for_status()
        except httpx.HTTPError:
            return []

    soup = BeautifulSoup(resp.text, "lxml")
    items = []

    # The scholarships page renders cards or table rows; try common selectors
    for el in soup.select(".scholarship-card, .scholarship-item, article, tr"):
        title_el = el.find(["h2", "h3", "h4", "a", "td"])
        if not title_el:
            continue
        title = title_el.get_text(strip=True)
        if len(title) < 6:
            continue

        link_el = el.find("a", href=True)
        url = link_el["href"] if link_el else URL
        if url.startswith("/"):
            url = "https://scholarships.nus.edu.sg" + url

        deadline_el = el.find(string=lambda t: t and ("deadline" in t.lower() or "closing" in t.lower()))
        date_str = deadline_el.strip() if deadline_el else None

        items.append({
            "source": "NUS Scholarships",
            "item_type": "scholarship",
            "title": title,
            "date": date_str,
            "url": url,
            "fingerprint": _fingerprint(title),
            "template_tags": "scholarship",
        })

    return items
