from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db import get_db
from . import schemas, crud

router = APIRouter(prefix="/tax", tags=["tax"])


@router.post("/invoices", response_model=schemas.TaxInvoiceOut)
def create_tax_invoice(payload: schemas.TaxInvoiceCreate, db: Session = Depends(get_db)):
    return crud.create_tax_invoice(db, payload)


@router.get("/invoices", response_model=list[schemas.TaxInvoiceOut])
def list_tax_invoices(invoice_type: str | None = Query(None), db: Session = Depends(get_db)):
    return crud.list_tax_invoices(db, invoice_type=invoice_type)


@router.get("/vat-return", response_model=schemas.VatReturnSummary)
def get_vat_return(year: int, quarter: int = Query(..., ge=1, le=4), db: Session = Depends(get_db)):
    return crud.vat_return_summary(db, year, quarter)
