"""APScheduler cron jobs that run all scrapers and persist results."""
import asyncio
import logging
from sqlalchemy import select
from sqlalchemy.dialects.sqlite import insert as sqlite_insert

from database import SessionLocal, engine
from models import Base, FeedItem
from scrapers import reddit, nus_scholarships, nus_news, devpost

logger = logging.getLogger(__name__)

ALL_SCRAPERS = [
    reddit.scrape,
    nus_scholarships.scrape,
    nus_news.scrape,
    devpost.scrape,
]


async def run_all_scrapers():
    logger.info("Running all scrapers…")
    results = await asyncio.gather(*[fn() for fn in ALL_SCRAPERS], return_exceptions=True)

    all_items: list[dict] = []
    for r in results:
        if isinstance(r, Exception):
            logger.error("Scraper error: %s", r)
        else:
            all_items.extend(r)

    if not all_items:
        logger.info("No items scraped.")
        return

    async with SessionLocal() as session:
        for item in all_items:
            stmt = (
                sqlite_insert(FeedItem)
                .values(
                    fingerprint=item["fingerprint"],
                    source=item["source"],
                    item_type=item["item_type"],
                    title=item["title"],
                    date=item.get("date"),
                    url=item.get("url"),
                    template_tags=item.get("template_tags", ""),
                )
                .on_conflict_do_nothing(index_elements=["fingerprint"])
            )
            await session.execute(stmt)
        await session.commit()

    logger.info("Persisted %d items (dupes skipped).", len(all_items))


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
