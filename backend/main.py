"""N.ext FastAPI backend — public feed endpoint + scheduled scrapers."""
import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Literal

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from cron import run_all_scrapers, init_db
from database import get_db
from models import FeedItem

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TEMPLATE_TAGS: dict[str, set[str]] = {
    "freshman":    {"freshman"},
    "internship":  {"internship"},
    "scholarship": {"scholarship"},
}

scheduler = AsyncIOScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    # Run scrapers immediately on startup, then every 6 hours
    asyncio.create_task(run_all_scrapers())
    scheduler.add_job(run_all_scrapers, "interval", hours=6, id="scrape_all")
    scheduler.start()
    yield
    scheduler.shutdown(wait=False)


app = FastAPI(title="N.ext API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # extension can call from any origin
    allow_methods=["GET"],
    allow_headers=["*"],
)


class FeedItemOut(BaseModel):
    fingerprint: str
    source: str
    item_type: str
    title: str
    date: str | None
    url: str | None
    template_tags: str

    model_config = {"from_attributes": True}


@app.get("/feed", response_model=list[FeedItemOut])
async def get_feed(
    template: Literal["freshman", "internship", "scholarship"] = Query("freshman"),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    """Return latest deduplicated items matching the requested template."""
    tag = list(TEMPLATE_TAGS[template])[0]
    stmt = (
        select(FeedItem)
        .where(FeedItem.template_tags.contains(tag))
        .order_by(FeedItem.created_at.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


@app.get("/health")
async def health():
    return {"status": "ok"}
