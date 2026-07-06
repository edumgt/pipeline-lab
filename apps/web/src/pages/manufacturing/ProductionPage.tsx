import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../api/client";
import { ProductionRecord } from "../../types";

function fmt(ts?: string) {
  if (!ts) return "-";
  try { return new Date(ts).toLocaleString(); } catch { return ts; }
}

export function ProductionPage() {
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [line, setLine] = useState("A라인");
  const [product, setProduct] = useState("");
  const [workDate, setWorkDate] = useState(new Date().toISOString().slice(0, 10));
  const [shift, setShift] = useState("day");
  const [planned, setPlanned] = useState(0);
  const [actual, setActual] = useState(0);
  const [defect, setDefect] = useState(0);

  async function refresh() {
    setRecords(await apiGet<ProductionRecord[]>("/manufacturing/production-records"));
  }

  useEffect(() => { refresh().catch(console.error); }, []);

  async function create() {
    if (!product.trim()) return;
    await apiPost("/manufacturing/production-records", {
      line, product_name: product, work_date: workDate, shift,
      planned_qty: planned, actual_qty: actual, defect_qty: defect,
    });
    setProduct(""); setPlanned(0); setActual(0); setDefect(0);
    await refresh();
  }

  return (
    <>
      <div className="h1">생산실적</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row" style={{ flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 120 }}>
            <div className="muted">라인</div>
            <input className="input" value={line} onChange={e => setLine(e.target.value)} />
          </div>
          <div style={{ flex: 2, minWidth: 160 }}>
            <div className="muted">제품명</div>
            <input className="input" value={product} onChange={e => setProduct(e.target.value)} placeholder="예: 엔진커버" />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div className="muted">작업일자</div>
            <input className="input" type="date" value={workDate} onChange={e => setWorkDate(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: 100 }}>
            <div className="muted">교대</div>
            <select className="select" style={{ width: "100%" }} value={shift} onChange={e => setShift(e.target.value)}>
              <option value="day">주간</option>
              <option value="night">야간</option>
            </select>
          </div>
        </div>
        <div className="row" style={{ marginTop: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 100 }}>
            <div className="muted">계획수량</div>
            <input className="input" type="number" value={planned} onChange={e => setPlanned(Number(e.target.value))} />
          </div>
          <div style={{ flex: 1, minWidth: 100 }}>
            <div className="muted">실적수량</div>
            <input className="input" type="number" value={actual} onChange={e => setActual(Number(e.target.value))} />
          </div>
          <div style={{ flex: 1, minWidth: 100 }}>
            <div className="muted">불량수량</div>
            <input className="input" type="number" value={defect} onChange={e => setDefect(Number(e.target.value))} />
          </div>
          <div style={{ alignSelf: "end" }}>
            <button className="btn" onClick={create}>등록</button>
          </div>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr><th>라인</th><th>제품</th><th>작업일</th><th>교대</th><th>계획</th><th>실적</th><th>불량</th><th>등록일시</th></tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id}>
                <td>{r.line}</td>
                <td>{r.product_name}</td>
                <td className="muted">{r.work_date}</td>
                <td className="muted">{r.shift === "day" ? "주간" : "야간"}</td>
                <td>{r.planned_qty}</td>
                <td>{r.actual_qty}</td>
                <td>{r.defect_qty}</td>
                <td className="muted">{fmt(r.created_at)}</td>
              </tr>
            ))}
            {records.length === 0 && <tr><td colSpan={8} className="muted">생산실적이 없습니다.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
