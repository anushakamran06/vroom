from datetime import datetime
from sqlalchemy import String, DateTime, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class FeedItem(Base):
    __tablename__ = "feed_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    fingerprint: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    source: Mapped[str] = mapped_column(String(64))
    item_type: Mapped[str] = mapped_column(String(64))
    title: Mapped[str] = mapped_column(Text)
    date: Mapped[str | None] = mapped_column(String(128), nullable=True)
    url: Mapped[str | None] = mapped_column(Text, nullable=True)
    template_tags: Mapped[str] = mapped_column(String(256), default="")  # csv: freshman,internship
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("fingerprint", name="uq_fingerprint"),)
