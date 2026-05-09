"""Scrapes the NUS news page for announcements."""
import hashlib
import httpx
from bs4 import BeautifulSoup

URL = "https://news.nus.edu.sg/"
HEADERS = {"User-Agent": "NExtension/1.0"}


def _fingerprint(title: str, date: str | None) -> str:
    raw = f"{title.strip().lower()}|NUS News|{date or ''}"
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

    for article in soup.select("article, .news-item, .post-item, .entry"):
        title_el = article.find(["h2", "h3", "h4", "a"])
        if not title_el:
            continue
        title = title_el.get_text(strip=True)
        if len(title) < 6:
            continue

        link_el = article.find("a", href=True)
        url = link_el["href"] if link_el else URL
        if url.startswith("/"):
            url = "https://news.nus.edu.sg" + url

        date_el = article.find(["time", "span"], class_=lambda c: c and ("date" in c or "time" in c))
        date_str = date_el.get("datetime") or (date_el.get_text(strip=True) if date_el else None)

        items.append({
            "source": "NUS News",
            "item_type": "news",
            "title": title,
            "date": date_str,
            "url": url,
            "fingerprint": _fingerprint(title, date_str),
            "template_tags": "freshman,scholarship",
        })

    return items[:20]  # cap at 20 most recent
