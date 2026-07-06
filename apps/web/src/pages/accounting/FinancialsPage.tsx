import React, { useEffect, useState } from "react";
import { apiGet } from "../../api/client";
import { FinancialStatementSummary } from "../../types";

export function FinancialsPage() {
  const [summary, setSummary] = useState<FinancialStatementSummary | null>(null);
  const [asOf, setAsOf] = useState(new Date().toISOString().slice(0, 10));

  async function refresh() {
    setSummary(await apiGet<FinancialStatementSummary>(`/accounting/financial-statements?as_of=${asOf}`));
  }
  useEffect(() => { refresh().catch(console.error); }, [asOf]);

  return (
    <>
      <div className="h1">재무제표 (요약)</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="muted">기준일</div>
        <input className="input" type="date" style={{ maxWidth: 220 }} value={asOf} onChange={e => setAsOf(e.target.value)} />
      </div>

      {summary && (
        <>
          <div className="section-title">재무상태표 (요약)</div>
          <div className="kpi-grid" style={{ marginBottom: 20 }}>
            <div className="kpi-card"><div className="kpi-label">자산 총계</div><div className="kpi-value">{summary.assets_total.toLocaleString()}</div></div>
            <div className="kpi-card"><div className="kpi-label">부채 총계</div><div className="kpi-value">{summary.liabilities_total.toLocaleString()}</div></div>
            <div className="kpi-card"><div className="kpi-label">자본 총계</div><div className="kpi-value">{summary.equity_total.toLocaleString()}</div></div>
            <div className="kpi-card">
              <div className="kpi-label">대차 일치 여부</div>
              <div className="kpi-value" style={{ color: summary.balance_check ? "#059669" : "#b91c1c" }}>
                {summary.balance_check ? "일치" : "불일치"}
              </div>
            </div>
          </div>

          <div className="section-title">손익계산서 (요약)</div>
          <div className="kpi-grid">
            <div className="kpi-card"><div className="kpi-label">매출/수익 총계</div><div className="kpi-value">{summary.revenue_total.toLocaleString()}</div></div>
            <div className="kpi-card"><div className="kpi-label">비용 총계</div><div className="kpi-value">{summary.expense_total.toLocaleString()}</div></div>
            <div className="kpi-card"><div className="kpi-label">당기순이익</div><div className="kpi-value" style={{ color: summary.net_income >= 0 ? "#059669" : "#b91c1c" }}>{summary.net_income.toLocaleString()}</div></div>
          </div>
        </>
      )}
    </>
  );
}
