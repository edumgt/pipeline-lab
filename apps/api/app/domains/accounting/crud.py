from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from . import models


def create_account(db: Session, payload) -> models.Account:
    acc = models.Account(code=payload.code, name=payload.name, type=payload.type)
    db.add(acc)
    db.commit()
    db.refresh(acc)
    return acc


def list_accounts(db: Session, limit: int = 500):
    stmt = select(models.Account).order_by(models.Account.code).limit(limit)
    return list(db.scalars(stmt).all())


def get_account(db: Session, account_id: int):
    return db.get(models.Account, account_id)


def create_journal_entry(db: Session, payload) -> models.JournalEntry:
    entry = models.JournalEntry(entry_date=payload.entry_date, description=payload.description)
    db.add(entry)
    db.flush()
    for line in payload.lines:
        db.add(models.JournalEntryLine(
            journal_entry_id=entry.id,
            account_id=line.account_id,
            debit=line.debit,
            credit=line.credit,
            description=line.description,
        ))
    db.commit()
    db.refresh(entry)
    return entry


def list_journal_entries(db: Session, limit: int = 200):
    stmt = select(models.JournalEntry).order_by(desc(models.JournalEntry.entry_date), desc(models.JournalEntry.id)).limit(limit)
    return list(db.scalars(stmt).all())


def get_ledger(db: Session, account_id: int, as_of: date | None = None) -> list[dict]:
    account = get_account(db, account_id)
    if not account:
        return []
    debit_normal = account.type in models.DEBIT_NORMAL_TYPES

    stmt = (
        select(models.JournalEntryLine, models.JournalEntry)
        .join(models.JournalEntry, models.JournalEntryLine.journal_entry_id == models.JournalEntry.id)
        .where(models.JournalEntryLine.account_id == account_id)
    )
    if as_of:
        stmt = stmt.where(models.JournalEntry.entry_date <= as_of)
    stmt = stmt.order_by(models.JournalEntry.entry_date, models.JournalEntry.id)
    rows = db.execute(stmt).all()

    balance = 0.0
    ledger = []
    for line, entry in rows:
        delta = (line.debit - line.credit) if debit_normal else (line.credit - line.debit)
        balance += delta
        ledger.append({
            "journal_entry_id": entry.id,
            "entry_date": entry.entry_date,
            "description": entry.description,
            "debit": line.debit,
            "credit": line.credit,
            "balance": round(balance, 2),
        })
    return ledger


def financial_statement_summary(db: Session, as_of: date | None = None) -> dict:
    as_of = as_of or date.today()
    accounts = list_accounts(db)

    totals = {t: 0.0 for t in models.AccountType}
    for acc in accounts:
        ledger = get_ledger(db, acc.id, as_of=as_of)
        balance = ledger[-1]["balance"] if ledger else 0.0
        acc_type = acc.type if isinstance(acc.type, models.AccountType) else models.AccountType(acc.type)
        totals[acc_type] += balance

    assets_total = round(totals[models.AccountType.asset], 2)
    liabilities_total = round(totals[models.AccountType.liability], 2)
    equity_total = round(totals[models.AccountType.equity], 2)
    revenue_total = round(totals[models.AccountType.revenue], 2)
    expense_total = round(totals[models.AccountType.expense], 2)
    net_income = round(revenue_total - expense_total, 2)

    balance_check = abs(assets_total - (liabilities_total + equity_total + net_income)) < 0.01

    return {
        "as_of": as_of,
        "assets_total": assets_total,
        "liabilities_total": liabilities_total,
        "equity_total": equity_total,
        "revenue_total": revenue_total,
        "expense_total": expense_total,
        "net_income": net_income,
        "balance_check": balance_check,
    }
