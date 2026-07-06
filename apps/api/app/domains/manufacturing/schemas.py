from datetime import datetime, date
from pydantic import BaseModel, Field


class EquipmentCreate(BaseModel):
    name: str
    line: str
    equipment_type: str = ""
    status: str = "idle"
    note: str | None = None


class EquipmentOut(BaseModel):
    id: int
    name: str
    line: str
    equipment_type: str
    status: str
    last_check_at: datetime | None
    note: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class ProductionRecordCreate(BaseModel):
    line: str
    product_name: str
    work_date: date
    shift: str = "day"
    planned_qty: int = Field(0, ge=0)
    actual_qty: int = Field(0, ge=0)
    defect_qty: int = Field(0, ge=0)
    note: str | None = None


class ProductionRecordOut(BaseModel):
    id: int
    line: str
    product_name: str
    work_date: date
    shift: str
    planned_qty: int
    actual_qty: int
    defect_qty: int
    note: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class QualityInspectionCreate(BaseModel):
    lot_no: str
    product_name: str
    inspector: str = ""
    result: str = "pass"
    defect_reason: str | None = None


class QualityInspectionOut(BaseModel):
    id: int
    lot_no: str
    product_name: str
    inspector: str
    result: str
    defect_reason: str | None
    inspected_at: datetime

    class Config:
        from_attributes = True


class ManufacturingSummary(BaseModel):
    equipment_total: int
    equipment_by_status: dict[str, int]
    today_planned_qty: int
    today_actual_qty: int
    today_defect_qty: int
    defect_rate: float
    recent_inspection_fail_count: int
