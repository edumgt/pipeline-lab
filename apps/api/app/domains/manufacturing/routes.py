from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from . import schemas, crud

router = APIRouter(prefix="/manufacturing", tags=["manufacturing"])


@router.get("/summary", response_model=schemas.ManufacturingSummary)
def get_summary(db: Session = Depends(get_db)):
    return crud.summary(db)


@router.post("/equipment", response_model=schemas.EquipmentOut)
def create_equipment(payload: schemas.EquipmentCreate, db: Session = Depends(get_db)):
    return crud.create_equipment(db, payload)


@router.get("/equipment", response_model=list[schemas.EquipmentOut])
def list_equipment(db: Session = Depends(get_db)):
    return crud.list_equipment(db)


@router.patch("/equipment/{equipment_id}/status", response_model=schemas.EquipmentOut)
def update_equipment_status(equipment_id: int, status: str, db: Session = Depends(get_db)):
    eq = crud.set_equipment_status(db, equipment_id, status)
    if not eq:
        raise HTTPException(status_code=404, detail="equipment not found")
    return eq


@router.post("/production-records", response_model=schemas.ProductionRecordOut)
def create_production_record(payload: schemas.ProductionRecordCreate, db: Session = Depends(get_db)):
    return crud.create_production_record(db, payload)


@router.get("/production-records", response_model=list[schemas.ProductionRecordOut])
def list_production_records(db: Session = Depends(get_db)):
    return crud.list_production_records(db)


@router.post("/quality-inspections", response_model=schemas.QualityInspectionOut)
def create_quality_inspection(payload: schemas.QualityInspectionCreate, db: Session = Depends(get_db)):
    return crud.create_quality_inspection(db, payload)


@router.get("/quality-inspections", response_model=list[schemas.QualityInspectionOut])
def list_quality_inspections(db: Session = Depends(get_db)):
    return crud.list_quality_inspections(db)
