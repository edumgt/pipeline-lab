import React, { useEffect, useState } from "react";
import { apiGet, apiPatch, apiPost } from "../../api/client";
import { Equipment } from "../../types";

const STATUS_LABEL: Record<string, string> = {
  running: "가동중", idle: "대기", maintenance: "점검중", breakdown: "고장",
};
const STATUS_COLOR: Record<string, string> = {
  running: "#d1fae5", idle: "#eee", maintenance: "#fef3c7", breakdown: "#fee2e2",
};

export function EquipmentPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [name, setName] = useState("");
  const [line, setLine] = useState("A라인");
  const [type, setType] = useState("");

  async function refresh() {
    setItems(await apiGet<Equipment[]>("/manufacturing/equipment"));
  }
  useEffect(() => { refresh().catch(console.error); }, []);

  async function create() {
    if (!name.trim()) return;
    await apiPost("/manufacturing/equipment", { name, line, equipment_type: type, status: "idle" });
    setName(""); setType("");
    await refresh();
  }

  async function updateStatus(id: number, status: string) {
    await apiPatch(`/manufacturing/equipment/${id}/status?status=${status}`);
    await refresh();
  }

  return (
    <>
      <div className="h1">설비관리</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row" style={{ flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 160 }}>
            <div className="muted">설비명</div>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="예: 사출성형기 #1" />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <div className="muted">라인</div>
            <input className="input" value={line} onChange={e => setLine(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <div className="muted">설비유형</div>
            <input className="input" value={type} onChange={e => setType(e.target.value)} placeholder="예: 사출/조립" />
          </div>
          <div style={{ alignSelf: "end" }}>
            <button className="btn" onClick={create}>등록</button>
          </div>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead><tr><th>설비명</th><th>라인</th><th>유형</th><th>상태</th><th>최근점검</th><th>상태변경</th></tr></thead>
          <tbody>
            {items.map(eq => (
              <tr key={eq.id}>
                <td>{eq.name}</td>
                <td className="muted">{eq.line}</td>
                <td className="muted">{eq.equipment_type || "-"}</td>
                <td><span className="badge" style={{ background: STATUS_COLOR[eq.status] || "#eee" }}>{STATUS_LABEL[eq.status] || eq.status}</span></td>
                <td className="muted">{eq.last_check_at ? new Date(eq.last_check_at).toLocaleString() : "-"}</td>
                <td>
                  <select className="select" value={eq.status} onChange={e => updateStatus(eq.id, e.target.value)}>
                    {Object.keys(STATUS_LABEL).map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="muted">등록된 설비가 없습니다.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
