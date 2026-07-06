import enum
from datetime import datetime, date
from sqlalchemy import String, Integer, Float, Date, DateTime, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db import Base


class EquipmentStatus(str, enum.Enum):
    running = "running"
    idle = "idle"
    maintenance = "maintenance"
    breakdown = "breakdown"


class InspectionResult(str, enum.Enum):
    pass_ = "pass"
    fail = "fail"


class Equipment(Base):
    __tablename__ = "mfg_equipment"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    line: Mapped[str] = mapped_column(String(100), nullable=False)
    equipment_type: Mapped[str] = mapped_column(String(100), default="")
    status: Mapped[EquipmentStatus] = mapped_column(Enum(EquipmentStatus), default=EquipmentStatus.idle)
    last_check_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ProductionRecord(Base):
    __tablename__ = "mfg_production_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    line: Mapped[str] = mapped_column(String(100), nullable=False)
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)
    work_date: Mapped[date] = mapped_column(Date, nullable=False)
    shift: Mapped[str] = mapped_column(String(20), default="day")
    planned_qty: Mapped[int] = mapped_column(Integer, default=0)
    actual_qty: Mapped[int] = mapped_column(Integer, default=0)
    defect_qty: Mapped[int] = mapped_column(Integer, default=0)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class QualityInspection(Base):
    __tablename__ = "mfg_quality_inspections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    lot_no: Mapped[str] = mapped_column(String(100), nullable=False)
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)
    inspector: Mapped[str] = mapped_column(String(100), default="")
    result: Mapped[InspectionResult] = mapped_column(Enum(InspectionResult), default=InspectionResult.pass_)
    defect_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    inspected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
