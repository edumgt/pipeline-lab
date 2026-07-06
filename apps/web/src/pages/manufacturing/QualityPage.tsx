import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../api/client";
import { QualityInspection } from "../../types";

export function QualityPage() {
  const [items, setItems] = useState<QualityInspection[]>([]);
  const [lotNo, setLotNo] = useState("");
  const [product, setProduct] = useState("");
  const [inspector, setInspector] = useState("");
  const [result, setResult] = useState("pass");
  const [reason, setReason] = useState("");

  async function refresh() {
    setItems(await apiGet<QualityInspection[]>("/manufacturing/quality-inspections"));
  }
  useEffect(() => { refresh().catch(console.error); }, []);

  async function create() {
    if (!lotNo.trim() || !product.trim()) return;
    await apiPost("/manufacturing/quality-inspections", {
      lot_no: lotNo, product_name: product, inspector, result,
      defect_reason: result === "fail" ? reason : null,
    });
    setLotNo(""); setProduct(""); setReason("");
    await refresh();
  }

  const failCount = items.filter(i => i.result === "fail").length;

  return (
    <>
      <div className="h1">품질검사</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row" style={{ flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div className="muted">LOT 번호</div>
            <input className="input" value={lotNo} onChange={e => setLotNo(e.target.value)} placeholder="LOT-2026-0001" />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div className="muted">제품명</div>
            <input className="input" value={product} onChange={e => setProduct(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <div className="muted">검사자</div>
            <input className="input" value={inspector} onChange={e => setInspector(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: 100 }}>
            <div className="muted">판정</div>
            <select className="select" style={{ width: "100%" }} value={result} onChange={e => setResult(e.target.value)}>
              <option value="pass">합격</option>
              <option value="fail">불합격</option>
            </select>
          </div>
          {result === "fail" && (
            <div style={{ flex: 2, minWidth: 160 }}>
              <div className="muted">불량 사유</div>
              <input className="input" value={reason} onChange={e => setReason(e.target.value)} placeholder="예: 치수 불량" />
            </div>
          )}
          <div style={{ alignSelf: "end" }}>
            <button className="btn" onClick={create}>등록</button>
          </div>
        </div>
      </div>

      <div className="muted" style={{ marginBottom: 8 }}>누적 불합격 건수: {failCount}</div>
      <div className="card">
        <table className="table">
          <thead><tr><th>LOT</th><th>제품</th><th>검사자</th><th>판정</th><th>불량사유</th><th>검사일시</th></tr></thead>
          <tbody>
            {items.map(q => (
              <tr key={q.id}>
                <td>{q.lot_no}</td>
                <td>{q.product_name}</td>
                <td className="muted">{q.inspector || "-"}</td>
                <td><span className="badge" style={{ background: q.result === "fail" ? "#fee2e2" : "#d1fae5" }}>{q.result === "fail" ? "불합격" : "합격"}</span></td>
                <td className="muted">{q.defect_reason || "-"}</td>
                <td className="muted">{new Date(q.inspected_at).toLocaleString()}</td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="muted">검사 이력이 없습니다.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
