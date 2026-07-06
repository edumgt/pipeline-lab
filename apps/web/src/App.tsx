import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { PageKey } from "./nav";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductionPage } from "./pages/manufacturing/ProductionPage";
import { EquipmentPage } from "./pages/manufacturing/EquipmentPage";
import { QualityPage } from "./pages/manufacturing/QualityPage";
import { AiPipelinePage } from "./pages/manufacturing/AiPipelinePage";
import { AccountsPage } from "./pages/accounting/AccountsPage";
import { JournalPage } from "./pages/accounting/JournalPage";
import { LedgerPage } from "./pages/accounting/LedgerPage";
import { FinancialsPage } from "./pages/accounting/FinancialsPage";
import { InvoicesPage } from "./pages/tax/InvoicesPage";
import { VatReturnPage } from "./pages/tax/VatReturnPage";

export default function App() {
  const [page, setPage] = useState<PageKey>("dashboard");

  return (
    <div className="portal">
      <Sidebar page={page} onNavigate={setPage} />
      <div className="portal-main">
        {page === "dashboard" && <DashboardPage onNavigate={setPage} />}
        {page === "mfg-production" && <ProductionPage />}
        {page === "mfg-equipment" && <EquipmentPage />}
        {page === "mfg-quality" && <QualityPage />}
        {page === "mfg-ai" && <AiPipelinePage />}
        {page === "acc-journal" && <JournalPage />}
        {page === "acc-accounts" && <AccountsPage />}
        {page === "acc-ledger" && <LedgerPage />}
        {page === "acc-financials" && <FinancialsPage />}
        {page === "tax-invoices" && <InvoicesPage />}
        {page === "tax-vat" && <VatReturnPage />}
      </div>
    </div>
  );
}
