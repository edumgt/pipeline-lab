import React, { useEffect, useState } from "react";
import { apiGet } from "../../api/client";
import { Account, LedgerLine } from "../../types";

export function LedgerPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [ledger, setLedger] = useState<LedgerLine[]>([]);

  useEffect(() => {
    apiGet<Account[]>("/accounting/accounts").then(a => {
      setAccounts(a);
      if (a.length > 0) setAccountId(a[0].id);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (accountId == null) return;
    apiGet<LedgerLine[]>(`/accounting/accounts/${accountId}/ledger`).then(setLedger).catch(console.error);
  }, [accountId]);

  const account = accounts.find(a => a.id === accountId);
  const closingBalance = ledger.length > 0 ? ledger[ledger.length - 1].balance : 0;

  return (
    <>
      <div className="h1">원장조회</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="muted">계정 선택</div>
        <select className="select" style={{ width: "100%", maxWidth: 300 }} value={accountId ?? ""} onChange={e => setAccountId(Number(e.target.value))}>
          {accounts.map(a => <option key={a.id} value={a.id}>{a.code} {a.name}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
          <div><b>{account ? `${account.code} ${account.name}` : "-"}</b></div>
          <div className="muted">잔액 {closingBalance.toLocaleString()}</div>
        </div>
        <table className="table">
          <thead><tr><th>일자</th><th>적요</th><th>차변</th><th>대변</th><th>잔액</th></tr></thead>
          <tbody>
            {ledger.map((l, idx) => (
              <tr key={idx}>
                <td className="muted">{l.entry_date}</td>
                <td>{l.description}</td>
                <td>{l.debit ? l.debit.toLocaleString() : "-"}</td>
                <td>{l.credit ? l.credit.toLocaleString() : "-"}</td>
                <td>{l.balance.toLocaleString()}</td>
              </tr>
            ))}
            {ledger.length === 0 && <tr><td colSpan={5} className="muted">거래 내역이 없습니다.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
