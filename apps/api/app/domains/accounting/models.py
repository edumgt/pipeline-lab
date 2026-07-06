import enum
from datetime import datetime, date
from sqlalchemy import String, Integer, Float, Date, DateTime, Enum, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base


class AccountType(str, enum.Enum):
    asset = "asset"
    liability = "liability"
    equity = "equity"
    revenue = "revenue"
    expense = "expense"


DEBIT_NORMAL_TYPES = {AccountType.asset, AccountType.expense}


class Account(Base):
    __tablename__ = "acc_accounts"
    __table_args__ = (UniqueConstraint("code", name="uq_acc_accounts_code"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(20), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    type: Mapped[AccountType] = mapped_column(Enum(AccountType), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    lines: Mapped[list["JournalEntryLine"]] = relationship(back_populates="account")


class JournalEntry(Base):
    __tablename__ = "acc_journal_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    entry_date: Mapped[date] = mapped_column(Date, nullable=False)
    description: Mapped[str] = mapped_column(String(500), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    lines: Mapped[list["JournalEntryLine"]] = relationship(back_populates="entry", cascade="all, delete-orphan")


class JournalEntryLine(Base):
    __tablename__ = "acc_journal_entry_lines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    journal_entry_id: Mapped[int] = mapped_column(ForeignKey("acc_journal_entries.id"), nullable=False)
    account_id: Mapped[int] = mapped_column(ForeignKey("acc_accounts.id"), nullable=False)
    debit: Mapped[float] = mapped_column(Float, default=0)
    credit: Mapped[float] = mapped_column(Float, default=0)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    entry: Mapped["JournalEntry"] = relationship(back_populates="lines")
    account: Mapped["Account"] = relationship(back_populates="lines")
