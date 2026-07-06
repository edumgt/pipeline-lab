import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../api/client";
import { Account, JournalEntry } from "../../types";

type LineInput = { account_id: number; debit: string; credit: string; description: string };

function emptyLine(accountId: number): LineInput {
  return { account_id: accountId, debit: "", credit: "", description: "" };
}

export function JournalPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState<LineInput[]>([]);
  const [error, setError] = useState("");

  async function refresh() {
    const [a, e] = await Promise.all([
      apiGet<Account[]>("/accounting/accounts"),
      apiGet<JournalEntry[]>("/accounting/journal-entries"),
    ]);
    setAccounts(a);
    setEntries(e);
    if (lines.length === 0 && a.length > 0) {
      setLines([emptyLine(a[0].id), emptyLine(a[0].id)]);
    }
  }
  useEffect(() => { refresh().catch(console.error); }, []);

  function updateLine(idx: number, patch: Partial<LineInput>) {
    setLines(ls => ls.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  }
  function addLine() {
    setLines(ls => [...ls, emptyLine(accounts[0]?.id ?? 0)]);
  }
  function removeLine(idx: number) {
    setLines(ls => ls.filter((_, i) => i !== idx));
  }

  const totalDebit = lines.reduce((s, l) => s + (parseFloat(l.debit) || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0);
  const balanced = lines.length >= 2 && totalDebit === totalCredit && totalDebit > 0;

  async function submit() {
    setError("");
    if (!balanced) {
      setError("차변/대변 합계가 일치해야 전표를 등록할 수 있습니다.");
      return;
    }
    try {
      await apiPost("/accounting/journal-entries", {
        entry_date: entryDate,
        description,
        lines: lines.map(l => ({
          account_id: l.account_id,
          debit: parseFloat(l.debit) || 0,
          credit: parseFloat(l.credit) || 0,
          description: l.description || null,
        })),
      });
      setDescription("");
      setLines([emptyLine(accounts[0]?.id ?? 0), emptyLine(accounts[0]?.id ?? 0)]);
      await refresh();
    } catch (e: any) {
      setError("전표 등록 실패: " + e.message);
    }
  }

  function accountLabel(id: number) {
    const a = accounts.find(x => x.id === id);
    return a ? `${a.code} ${a.name}` : String(id);
  }

  return (
    <>
      <div className="h1">전표입력 (분개)</div>

      {accounts.length === 0 ? (
        <div className="card">먼저 <b>계정과목</b> 화면에서 계정을 등록하세요.</div>
      ) : (
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="row" style={{ flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div className="muted">전표일자</div>
              <input className="input" type="date" value={entryDate} onChange={e => setEntryDate(e.target.value)} />
            </div>
            <div style={{ flex: 3, minWidth: 200 }}>
              <div className="muted">적요</div>
              <input className="input" value={description} onChange={e => setDescription(e.target.value)} placeholder="예: 제품 매출" />
            </div>
          </div>

          <table className="table" style={{ marginTop: 12 }}>
            <thead><tr><th>계정과목</th><th>차변</th><th>대변</th><th>설명</th><th></th></tr></thead>
            <tbody>
              {lines.map((l, idx) => (
                <tr key={idx}>
                  <td>
                    <select className="select" value={l.account_id} onChange={e => updateLine(idx, { account_id: Number(e.target.value) })}>
                      {accounts.map(a => <option key={a.id} value={a.id}>{a.code} {a.name}</option>)}
                    </select>
                  </td>
                  <td><input className="input" type="number" value={l.debit} onChange={e => updateLine(idx, { debit: e.target.value, credit: e.target.value ? "" : l.credit })} /></td>
                  <td><input className="input" type="number" value={l.credit} onChange={e => updateLine(idx, { credit: e.target.value, debit: e.target.value ? "" : l.debit })} /></td>
                  <td><input className="input" value={l.description} onChange={e => updateLine(idx, { description: e.target.value })} /></td>
                  <td><button className="btn-ghost" onClick={() => removeLine(idx)}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="row" style={{ marginTop: 10, justifyContent: "space-between" }}>
            <button className="btn-ghost" onClick={addLine}>+ 라인 추가</button>
            <div className="muted">차변 합계 {totalDebit.toLocaleString()} · 대변 합계 {totalCredit.toLocaleString()} {balanced ? "✓ 일치" : "(불일치)"}</div>
          </div>

          {error && <div className="muted" style={{ color: "#b91c1c", marginTop: 8 }}>{error}</div>}

          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={submit} disabled={!balanced}>전표 등록</button>
          </div>
        </div>
      )}

      <div className="section-title">최근 전표</div>
      <div className="card">
        {entries.length === 0 && <div className="muted">등록된 전표가 없습니다.</div>}
        {entries.map(entry => (
          <div key={entry.id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #eee" }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div><b>#{entry.id}</b> {entry.description}</div>
              <div className="muted">{entry.entry_date}</div>
            </div>
            <table className="table">
              <thead><tr><th>계정</th><th>차변</th><th>대변</th></tr></thead>
              <tbody>
                {entry.lines.map(l => (
                  <tr key={l.id}>
                    <td>{accountLabel(l.account_id)}</td>
                    <td>{l.debit ? l.debit.toLocaleString() : "-"}</td>
                    <td>{l.credit ? l.credit.toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </>
  );
}
