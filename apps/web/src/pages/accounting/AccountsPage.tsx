import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../api/client";
import { Account } from "../../types";

const TYPE_LABEL: Record<string, string> = {
  asset: "자산", liability: "부채", equity: "자본", revenue: "수익", expense: "비용",
};

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("asset");
  const [error, setError] = useState("");

  async function refresh() {
    setAccounts(await apiGet<Account[]>("/accounting/accounts"));
  }
  useEffect(() => { refresh().catch(console.error); }, []);

  async function create() {
    setError("");
    if (!code.trim() || !name.trim()) return;
    try {
      await apiPost("/accounting/accounts", { code, name, type });
      setCode(""); setName("");
      await refresh();
    } catch (e: any) {
      setError("계정과목 생성 실패 (코드 중복 등을 확인하세요)");
    }
  }

  return (
    <>
      <div className="h1">계정과목</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row" style={{ flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 100 }}>
            <div className="muted">코드</div>
            <input className="input" value={code} onChange={e => setCode(e.target.value)} placeholder="101" />
          </div>
          <div style={{ flex: 2, minWidth: 160 }}>
            <div className="muted">계정명</div>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="현금" />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <div className="muted">계정유형</div>
            <select className="select" style={{ width: "100%" }} value={type} onChange={e => setType(e.target.value)}>
              {Object.keys(TYPE_LABEL).map(t => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
            </select>
          </div>
          <div style={{ alignSelf: "end" }}>
            <button className="btn" onClick={create}>등록</button>
          </div>
        </div>
        {error && <div className="muted" style={{ color: "#b91c1c", marginTop: 8 }}>{error}</div>}
      </div>

      <div className="card">
        <table className="table">
          <thead><tr><th>코드</th><th>계정명</th><th>유형</th></tr></thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.id}><td>{a.code}</td><td>{a.name}</td><td className="muted">{TYPE_LABEL[a.type] || a.type}</td></tr>
            ))}
            {accounts.length === 0 && <tr><td colSpan={3} className="muted">등록된 계정과목이 없습니다.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
