import React, { useEffect, useState } from "react";
import { apiGet } from "../../api/client";
import { VatReturnSummary } from "../../types";

function currentQuarter(month: number) {
  return Math.floor(month / 3) + 1;
}

export function VatReturnPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [quarter, setQuarter] = useState(currentQuarter(now.getMonth()));
  const [summary, setSummary] = useState<VatReturnSummary | null>(null);
  const [error, setError] = useState("");

  async function refresh() {
    setError("");
    try {
      setSummary(await apiGet<VatReturnSummary>(`/tax/vat-return?year=${year}&quarter=${quarter}`));
    } catch (e: any) {
      setError("조회 실패: " + e.message);
    }
  }
  useEffect(() => { refresh().catch(console.error); }, [year, quarter]);

  return (
    <>
      <div className="h1">부가가치세 신고 지원</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row" style={{ flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 100 }}>
            <div className="muted">연도</div>
            <input className="input" type="number" value={year} onChange={e => setYear(Number(e.target.value))} />
          </div>
          <div style={{ flex: 1, minWidth: 100 }}>
            <div className="muted">분기</div>
            <select className="select" style={{ width: "100%" }} value={quarter} onChange={e => setQuarter(Number(e.target.value))}>
              {[1, 2, 3, 4].map(q => <option key={q} value={q}>{q}분기</option>)}
            </select>
          </div>
        </div>
        {error && <div className="muted" style={{ color: "#b91c1c", marginTop: 8 }}>{error}</div>}
      </div>

      {summary && (
        <>
          <div className="muted" style={{ marginBottom: 10 }}>
            과세기간: {summary.period_start} ~ {summary.period_end} (세금계산서 {summary.invoice_count}건)
          </div>
          <div className="kpi-grid">
            <div className="kpi-card"><div className="kpi-label">매출 공급가액</div><div className="kpi-value">{summary.sales_supply_total.toLocaleString()}</div></div>
            <div className="kpi-card"><div className="kpi-label">매출세액</div><div className="kpi-value">{summary.sales_vat_total.toLocaleString()}</div></div>
            <div className="kpi-card"><div className="kpi-label">매입 공급가액</div><div className="kpi-value">{summary.purchase_supply_total.toLocaleString()}</div></div>
            <div className="kpi-card"><div className="kpi-label">매입세액</div><div className="kpi-value">{summary.purchase_vat_total.toLocaleString()}</div></div>
            <div className="kpi-card">
              <div className="kpi-label">{summary.vat_payable >= 0 ? "납부세액" : "환급세액"}</div>
              <div className="kpi-value" style={{ color: summary.vat_payable >= 0 ? "#b91c1c" : "#059669" }}>
                {Math.abs(summary.vat_payable).toLocaleString()}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
