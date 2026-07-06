from datetime import datetime, date
from sqlalchemy.orm import Session
from sqlalchemy import select, desc, func
from . import models


def create_equipment(db: Session, payload) -> models.Equipment:
    eq = models.Equipment(
        name=payload.name,
        line=payload.line,
        equipment_type=payload.equipment_type,
        status=payload.status,
        note=payload.note,
    )
    db.add(eq)
    db.commit()
    db.refresh(eq)
    return eq


def list_equipment(db: Session, limit: int = 200):
    stmt = select(models.Equipment).order_by(desc(models.Equipment.id)).limit(limit)
    return list(db.scalars(stmt).all())


def set_equipment_status(db: Session, equipment_id: int, status: str):
    eq = db.get(models.Equipment, equipment_id)
    if not eq:
        return None
    eq.status = status
    eq.last_check_at = datetime.utcnow()
    db.commit()
    db.refresh(eq)
    return eq


def create_production_record(db: Session, payload) -> models.ProductionRecord:
    rec = models.ProductionRecord(
        line=payload.line,
        product_name=payload.product_name,
        work_date=payload.work_date,
        shift=payload.shift,
        planned_qty=payload.planned_qty,
        actual_qty=payload.actual_qty,
        defect_qty=payload.defect_qty,
        note=payload.note,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec


def list_production_records(db: Session, limit: int = 200):
    stmt = select(models.ProductionRecord).order_by(desc(models.ProductionRecord.work_date), desc(models.ProductionRecord.id)).limit(limit)
    return list(db.scalars(stmt).all())


def create_quality_inspection(db: Session, payload) -> models.QualityInspection:
    insp = models.QualityInspection(
        lot_no=payload.lot_no,
        product_name=payload.product_name,
        inspector=payload.inspector,
        result=payload.result,
        defect_reason=payload.defect_reason,
    )
    db.add(insp)
    db.commit()
    db.refresh(insp)
    return insp


def list_quality_inspections(db: Session, limit: int = 200):
    stmt = select(models.QualityInspection).order_by(desc(models.QualityInspection.id)).limit(limit)
    return list(db.scalars(stmt).all())


def summary(db: Session) -> dict:
    equipment = list(db.scalars(select(models.Equipment)).all())
    by_status: dict[str, int] = {}
    for eq in equipment:
        key = eq.status.value if hasattr(eq.status, "value") else eq.status
        by_status[key] = by_status.get(key, 0) + 1

    today = date.today()
    today_records = list(
        db.scalars(select(models.ProductionRecord).where(models.ProductionRecord.work_date == today)).all()
    )
    planned = sum(r.planned_qty for r in today_records)
    actual = sum(r.actual_qty for r in today_records)
    defect = sum(r.defect_qty for r in today_records)
    defect_rate = round((defect / actual * 100), 2) if actual else 0.0

    recent_fail = db.scalar(
        select(func.count()).select_from(models.QualityInspection).where(models.QualityInspection.result == models.InspectionResult.fail)
    ) or 0

    return {
        "equipment_total": len(equipment),
        "equipment_by_status": by_status,
        "today_planned_qty": planned,
        "today_actual_qty": actual,
        "today_defect_qty": defect,
        "defect_rate": defect_rate,
        "recent_inspection_fail_count": recent_fail,
    }
