"""Scrapes r/NUS via Reddit's public JSON API (no auth required)."""
import hashlib
import httpx
from datetime import datetime, timezone

SUBREDDIT = "nus"
OPPORTUNITY_KEYWORDS = {"internship", "scholarship", "application", "deadline", "bursary", "sep", "exchange"}
REDDIT_URL = f"https://www.reddit.com/r/{SUBREDDIT}/new.json?limit=50"
HEADERS = {"User-Agent": "NExtension/1.0 (NUS student opportunity aggregator)"}


def _fingerprint(title: str, source: str, date: str | None) -> str:
    raw = f"{title.strip().lower()}|{source}|{date or ''}"
    return hashlib.sha256(raw.encode()).hexdigest()[:32]


def _matches_keywords(text: str) -> bool:
    words = set(text.lower().split())
    return bool(words & OPPORTUNITY_KEYWORDS)


async def scrape() -> list[dict]:
    async with httpx.AsyncClient(headers=HEADERS, timeout=20) as client:
        try:
            resp = await client.get(REDDIT_URL)
            resp.raise_for_status()
        except httpx.HTTPError:
            return []

    data = resp.json()
    posts = data.get("data", {}).get("children", [])
    items = []

    for child in posts:
        post = child.get("data", {})
        title = post.get("title", "")
        selftext = post.get("selftext", "")

        if not _matches_keywords(title + " " + selftext):
            continue

        created_utc = post.get("created_utc", 0)
        date_str = datetime.fromtimestamp(created_utc, tz=timezone.utc).strftime("%Y-%m-%d")
        url = f"https://reddit.com{post.get('permalink', '')}"

        items.append({
            "source": "Reddit r/NUS",
            "item_type": "reddit_post",
            "title": title,
            "date": date_str,
            "url": url,
            "fingerprint": _fingerprint(title, "Reddit r/NUS", date_str),
            "template_tags": "freshman,internship,scholarship",
        })

    return items
