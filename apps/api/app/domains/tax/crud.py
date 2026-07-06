from datetime import date
from calendar import monthrange
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from . import models


def create_tax_invoice(db: Session, payload) -> models.TaxInvoice:
    inv = models.TaxInvoice(
        invoice_type=payload.invoice_type,
        partner_name=payload.partner_name,
        partner_biz_no=payload.partner_biz_no,
        issue_date=payload.issue_date,
        supply_amount=payload.supply_amount,
        vat_amount=payload.vat_amount,
        status=payload.status,
        note=payload.note,
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return inv


def list_tax_invoices(db: Session, invoice_type: str | None = None, limit: int = 500):
    stmt = select(models.TaxInvoice)
    if invoice_type:
        stmt = stmt.where(models.TaxInvoice.invoice_type == invoice_type)
    stmt = stmt.order_by(desc(models.TaxInvoice.issue_date), desc(models.TaxInvoice.id)).limit(limit)
    return list(db.scalars(stmt).all())


def _quarter_range(year: int, quarter: int) -> tuple[date, date]:
    start_month = (quarter - 1) * 3 + 1
    end_month = start_month + 2
    start = date(year, start_month, 1)
    end = date(year, end_month, monthrange(year, end_month)[1])
    return start, end


def vat_return_summary(db: Session, year: int, quarter: int) -> dict:
    start, end = _quarter_range(year, quarter)
    stmt = select(models.TaxInvoice).where(
        models.TaxInvoice.issue_date >= start,
        models.TaxInvoice.issue_date <= end,
        models.TaxInvoice.status != models.TaxInvoiceStatus.canceled,
    )
    invoices = list(db.scalars(stmt).all())

    sales = [i for i in invoices if i.invoice_type == models.TaxInvoiceType.sales]
    purchases = [i for i in invoices if i.invoice_type == models.TaxInvoiceType.purchase]

    sales_supply_total = round(sum(i.supply_amount for i in sales), 2)
    sales_vat_total = round(sum(i.vat_amount for i in sales), 2)
    purchase_supply_total = round(sum(i.supply_amount for i in purchases), 2)
    purchase_vat_total = round(sum(i.vat_amount for i in purchases), 2)

    return {
        "year": year,
        "quarter": quarter,
        "period_start": start,
        "period_end": end,
        "sales_supply_total": sales_supply_total,
        "sales_vat_total": sales_vat_total,
        "purchase_supply_total": purchase_supply_total,
        "purchase_vat_total": purchase_vat_total,
        "vat_payable": round(sales_vat_total - purchase_vat_total, 2),
        "invoice_count": len(invoices),
    }
