from datetime import datetime, date
from pydantic import BaseModel, Field, model_validator


class TaxInvoiceCreate(BaseModel):
    invoice_type: str  # sales | purchase
    partner_name: str
    partner_biz_no: str = ""
    issue_date: date
    supply_amount: float = Field(..., ge=0)
    vat_amount: float | None = None
    status: str = "issued"
    note: str | None = None

    @model_validator(mode="after")
    def default_vat(self):
        if self.vat_amount is None:
            self.vat_amount = round(self.supply_amount * 0.1, 2)
        return self


class TaxInvoiceOut(BaseModel):
    id: int
    invoice_type: str
    partner_name: str
    partner_biz_no: str
    issue_date: date
    supply_amount: float
    vat_amount: float
    status: str
    note: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class VatReturnSummary(BaseModel):
    year: int
    quarter: int
    period_start: date
    period_end: date
    sales_supply_total: float
    sales_vat_total: float
    purchase_supply_total: float
    purchase_vat_total: float
    vat_payable: float
    invoice_count: int
