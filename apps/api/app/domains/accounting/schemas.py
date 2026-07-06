from datetime import datetime, date
from pydantic import BaseModel, Field, model_validator


class AccountCreate(BaseModel):
    code: str
    name: str
    type: str


class AccountOut(BaseModel):
    id: int
    code: str
    name: str
    type: str
    created_at: datetime

    class Config:
        from_attributes = True


class JournalEntryLineIn(BaseModel):
    account_id: int
    debit: float = 0
    credit: float = 0
    description: str | None = None


class JournalEntryCreate(BaseModel):
    entry_date: date
    description: str = ""
    lines: list[JournalEntryLineIn]

    @model_validator(mode="after")
    def check_balanced(self):
        if len(self.lines) < 2:
            raise ValueError("전표는 최소 2줄(차변/대변) 이상이어야 합니다")
        total_debit = round(sum(l.debit for l in self.lines), 2)
        total_credit = round(sum(l.credit for l in self.lines), 2)
        if total_debit != total_credit:
            raise ValueError(f"차변 합계({total_debit})와 대변 합계({total_credit})가 일치하지 않습니다")
        if total_debit == 0:
            raise ValueError("전표 금액이 0일 수 없습니다")
        return self


class JournalEntryLineOut(BaseModel):
    id: int
    account_id: int
    debit: float
    credit: float
    description: str | None

    class Config:
        from_attributes = True


class JournalEntryOut(BaseModel):
    id: int
    entry_date: date
    description: str
    created_at: datetime
    lines: list[JournalEntryLineOut] = []

    class Config:
        from_attributes = True


class LedgerLine(BaseModel):
    journal_entry_id: int
    entry_date: date
    description: str
    debit: float
    credit: float
    balance: float


class FinancialStatementSummary(BaseModel):
    as_of: date
    assets_total: float
    liabilities_total: float
    equity_total: float
    revenue_total: float
    expense_total: float
    net_income: float
    balance_check: bool
