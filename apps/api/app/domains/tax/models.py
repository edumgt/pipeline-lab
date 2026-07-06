import enum
from datetime import datetime, date
from sqlalchemy import String, Integer, Float, Date, DateTime, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db import Base


class TaxInvoiceType(str, enum.Enum):
    sales = "sales"       # 매출
    purchase = "purchase"  # 매입


class TaxInvoiceStatus(str, enum.Enum):
    draft = "draft"
    issued = "issued"
    canceled = "canceled"


class TaxInvoice(Base):
    __tablename__ = "tax_invoices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    invoice_type: Mapped[TaxInvoiceType] = mapped_column(Enum(TaxInvoiceType), nullable=False)
    partner_name: Mapped[str] = mapped_column(String(200), nullable=False)
    partner_biz_no: Mapped[str] = mapped_column(String(20), default="")
    issue_date: Mapped[date] = mapped_column(Date, nullable=False)
    supply_amount: Mapped[float] = mapped_column(Float, default=0)
    vat_amount: Mapped[float] = mapped_column(Float, default=0)
    status: Mapped[TaxInvoiceStatus] = mapped_column(Enum(TaxInvoiceStatus), default=TaxInvoiceStatus.issued)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
