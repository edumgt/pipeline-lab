from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db import get_db
from . import schemas, crud

router = APIRouter(prefix="/accounting", tags=["accounting"])


@router.post("/accounts", response_model=schemas.AccountOut)
def create_account(payload: schemas.AccountCreate, db: Session = Depends(get_db)):
    return crud.create_account(db, payload)


@router.get("/accounts", response_model=list[schemas.AccountOut])
def list_accounts(db: Session = Depends(get_db)):
    return crud.list_accounts(db)


@router.post("/journal-entries", response_model=schemas.JournalEntryOut)
def create_journal_entry(payload: schemas.JournalEntryCreate, db: Session = Depends(get_db)):
    for line in payload.lines:
        if not crud.get_account(db, line.account_id):
            raise HTTPException(status_code=404, detail=f"account not found: {line.account_id}")
    return crud.create_journal_entry(db, payload)


@router.get("/journal-entries", response_model=list[schemas.JournalEntryOut])
def list_journal_entries(db: Session = Depends(get_db)):
    return crud.list_journal_entries(db)


@router.get("/accounts/{account_id}/ledger", response_model=list[schemas.LedgerLine])
def get_ledger(account_id: int, as_of: date | None = None, db: Session = Depends(get_db)):
    if not crud.get_account(db, account_id):
        raise HTTPException(status_code=404, detail="account not found")
    return crud.get_ledger(db, account_id, as_of=as_of)


@router.get("/financial-statements", response_model=schemas.FinancialStatementSummary)
def get_financial_statements(as_of: date | None = None, db: Session = Depends(get_db)):
    return crud.financial_statement_summary(db, as_of=as_of)
