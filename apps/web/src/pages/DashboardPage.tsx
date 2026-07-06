import React, { useEffect, useState } from "react";
import { apiGet } from "../api/client";
import { ManufacturingSummary, FinancialStatementSummary, VatReturnSummary, Run } from "../types";
import { PageKey } from "../nav";

function currentQuarter(month: number) {
  return Math.floor(month / 3) + 1;
}

export function DashboardPage({ onNavigate }: { onNavigate: (p: PageKey) => void }) {
  const [mfg, setMfg] = useState<ManufacturingSummary | null>(null);
  const [fin, setFin] = useState<FinancialStatementSummary | null>(null);
  const [vat, setVat] = useState<VatReturnSummary | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);

  useEffect(() => {
    const now = new Date();
    const asOf = now.toISOString().slice(0, 10);
    const quarter = currentQuarter(now.getMonth());
    Promise.all([
      apiGet<ManufacturingSummary>("/manufacturing/summary").catch(() => null),
      apiGet<FinancialStatementSummary>(`/accounting/financial-statements?as_of=${asOf}`).catch(() => null),
      apiGet<VatReturnSummary>(`/tax/vat-return?year=${now.getFullYear()}&quarter=${quarter}`).catch(() => null),
      apiGet<Run[]>("/runs").catch(() => []),
    ]).then(([m, f, v, r]) => { setMfg(m); setFin(f); setVat(v); setRuns(r); });
  }, []);

  return (
    <>
      <div className="h1">사내 업무 포탈 - 전체 요약</div>

      <div className="section-title">🏭 제조</div>
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <div className="kpi-card" style={{ cursor: "pointer" }} onClick={() => onNavigate("mfg-equipment")}>
          <div className="kpi-label">가동 중 설비</div>
          <div className="kpi-value">{mfg ? (mfg.equipment_by_status["running"] || 0) : "-"} / {mfg?.equipment_total ?? "-"}</div>
        </div>
        <div className="kpi-card" style={{ cursor: "pointer" }} onClick={() => onNavigate("mfg-production")}>
          <div className="kpi-label">금일 생산실적</div>
          <div className="kpi-value">{mfg?.today_actual_qty ?? 0} / {mfg?.today_planned_qty ?? 0}</div>
        </div>
        <div className="kpi-card" style={{ cursor: "pointer" }} onClick={() => onNavigate("mfg-quality")}>
          <div className="kpi-label">금일 불량률</div>
          <div className="kpi-value">{mfg?.defect_rate ?? 0}%</div>
        </div>
        <div className="kpi-card" style={{ cursor: "pointer" }} onClick={() => onNavigate("mfg-ai")}>
          <div className="kpi-label">AI 파이프라인 실행</div>
          <div className="kpi-value">{runs.length}건</div>
        </div>
      </div>

      <div className="section-title">📒 회계</div>
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <div className="kpi-card" style={{ cursor: "pointer" }} onClick={() => onNavigate("acc-financials")}>
          <div className="kpi-label">자산 총계</div>
          <div className="kpi-value">{fin ? fin.assets_total.toLocaleString() : "-"}</div>
        </div>
        <div className="kpi-card" style={{ cursor: "pointer" }} onClick={() => onNavigate("acc-financials")}>
          <div className="kpi-label">당기순이익</div>
          <div className="kpi-value" style={{ color: fin && fin.net_income < 0 ? "#b91c1c" : "#059669" }}>
            {fin ? fin.net_income.toLocaleString() : "-"}
          </div>
        </div>
        <div className="kpi-card" style={{ cursor: "pointer" }} onClick={() => onNavigate("acc-journal")}>
          <div className="kpi-label">대차 일치 여부</div>
          <div className="kpi-value">{fin ? (fin.balance_check ? "일치" : "불일치") : "-"}</div>
        </div>
      </div>

      <div className="section-title">🧾 세무</div>
      <div className="kpi-grid">
        <div className="kpi-card" style={{ cursor: "pointer" }} onClick={() => onNavigate("tax-vat")}>
          <div className="kpi-label">이번 분기 부가세 납부(예상)</div>
          <div className="kpi-value">{vat ? Math.abs(vat.vat_payable).toLocaleString() : "-"}</div>
        </div>
        <div className="kpi-card" style={{ cursor: "pointer" }} onClick={() => onNavigate("tax-invoices")}>
          <div className="kpi-label">이번 분기 세금계산서</div>
          <div className="kpi-value">{vat?.invoice_count ?? "-"}건</div>
        </div>
      </div>
    </>
  );
}
