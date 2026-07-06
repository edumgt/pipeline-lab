import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../api/client";
import { TaxInvoice } from "../../types";

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<TaxInvoice[]>([]);
  const [filter, setFilter] = useState<"" | "sales" | "purchase">("");
  const [invoiceType, setInvoiceType] = useState("sales");
  const [partnerName, setPartnerName] = useState("");
  const [bizNo, setBizNo] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [supplyAmount, setSupplyAmount] = useState(0);

  async function refresh() {
    const q = filter ? `?invoice_type=${filter}` : "";
    setInvoices(await apiGet<TaxInvoice[]>(`/tax/invoices${q}`));
  }
  useEffect(() => { refresh().catch(console.error); }, [filter]);

  async function create() {
    if (!partnerName.trim() || supplyAmount <= 0) return;
    await apiPost("/tax/invoices", {
      invoice_type: invoiceType, partner_name: partnerName, partner_biz_no: bizNo,
      issue_date: issueDate, supply_amount: supplyAmount,
    });
    setPartnerName(""); setBizNo(""); setSupplyAmount(0);
    await refresh();
  }

  return (
    <>
      <div className="h1">세금계산서 (매입/매출)</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row" style={{ flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 100 }}>
            <div className="muted">구분</div>
            <select className="select" style={{ width: "100%" }} value={invoiceType} onChange={e => setInvoiceType(e.target.value)}>
              <option value="sales">매출</option>
              <option value="purchase">매입</option>
            </select>
          </div>
          <div style={{ flex: 2, minWidth: 160 }}>
            <div className="muted">거래처명</div>
            <input className="input" value={partnerName} onChange={e => setPartnerName(e.target.value)} placeholder="(주)거래처A" />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div className="muted">사업자번호</div>
            <input className="input" value={bizNo} onChange={e => setBizNo(e.target.value)} placeholder="123-45-67890" />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div className="muted">발행일자</div>
            <input className="input" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div className="muted">공급가액</div>
            <input className="input" type="number" value={supplyAmount} onChange={e => setSupplyAmount(Number(e.target.value))} />
          </div>
          <div style={{ alignSelf: "end" }}>
            <button className="btn" onClick={create}>등록</button>
          </div>
        </div>
        <div className="muted" style={{ marginTop: 8 }}>부가세(10%)는 자동 계산됩니다.</div>
      </div>

      <div className="subtabs">
        <button className={"btn-ghost" + (filter === "" ? " active" : "")} onClick={() => setFilter("")}>전체</button>
        <button className={"btn-ghost" + (filter === "sales" ? " active" : "")} onClick={() => setFilter("sales")}>매출</button>
        <button className={"btn-ghost" + (filter === "purchase" ? " active" : "")} onClick={() => setFilter("purchase")}>매입</button>
      </div>

      <div className="card">
        <table className="table">
          <thead><tr><th>구분</th><th>거래처</th><th>발행일</th><th>공급가액</th><th>세액</th><th>상태</th></tr></thead>
          <tbody>
            {invoices.map(i => (
              <tr key={i.id}>
                <td><span className="badge">{i.invoice_type === "sales" ? "매출" : "매입"}</span></td>
                <td>{i.partner_name}</td>
                <td className="muted">{i.issue_date}</td>
                <td>{i.supply_amount.toLocaleString()}</td>
                <td>{i.vat_amount.toLocaleString()}</td>
                <td className="muted">{i.status}</td>
              </tr>
            ))}
            {invoices.length === 0 && <tr><td colSpan={6} className="muted">등록된 세금계산서가 없습니다.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
