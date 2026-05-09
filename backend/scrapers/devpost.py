"""Scrapes Devpost for Singapore-tagged hackathons."""
import hashlib
import httpx
from bs4 import BeautifulSoup

URL = "https://devpost.com/hackathons?challenge_type=online&status=upcoming&order_by=deadline&themes[]=Singapore"
HEADERS = {"User-Agent": "NExtension/1.0"}


def _fingerprint(title: str, date: str | None) -> str:
    raw = f"{title.strip().lower()}|Devpost|{date or ''}"
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

    for card in soup.select(".hackathon-tile, .challenge-listing article, [data-challenge-id]"):
        title_el = card.find(["h2", "h3", "h4"])
        if not title_el:
            continue
        title = title_el.get_text(strip=True)
        if len(title) < 4:
            continue

        link_el = card.find("a", href=True)
        url = link_el["href"] if link_el else "https://devpost.com"
        if not url.startswith("http"):
            url = "https://devpost.com" + url

        deadline_el = card.find(string=lambda t: t and "deadline" in t.lower())
        date_str = deadline_el.strip() if deadline_el else None

        items.append({
            "source": "Devpost",
            "item_type": "hackathon",
            "title": title,
            "date": date_str,
            "url": url,
            "fingerprint": _fingerprint(title, date_str),
            "template_tags": "internship",
        })

    return items
