export type Dataset = { id: number; name: string; source_path: string; created_at: string; meta: any };
export type Step = { id: number; name: string; status: string; started_at?: string; finished_at?: string; message?: string };
export type Run = {
  id: number; dataset_id: number; model_type: string; status: string; created_at: string;
  started_at?: string; finished_at?: string; metrics: any; artifacts: any; error?: string; steps?: Step[];
};

export type Equipment = {
  id: number; name: string; line: string; equipment_type: string; status: string;
  last_check_at?: string; note?: string; created_at: string;
};
export type ProductionRecord = {
  id: number; line: string; product_name: string; work_date: string; shift: string;
  planned_qty: number; actual_qty: number; defect_qty: number; note?: string; created_at: string;
};
export type QualityInspection = {
  id: number; lot_no: string; product_name: string; inspector: string; result: string;
  defect_reason?: string; inspected_at: string;
};
export type ManufacturingSummary = {
  equipment_total: number; equipment_by_status: Record<string, number>;
  today_planned_qty: number; today_actual_qty: number; today_defect_qty: number;
  defect_rate: number; recent_inspection_fail_count: number;
};

export type Account = { id: number; code: string; name: string; type: string; created_at: string };
export type JournalEntryLine = { id: number; account_id: number; debit: number; credit: number; description?: string };
export type JournalEntry = { id: number; entry_date: string; description: string; created_at: string; lines: JournalEntryLine[] };
export type LedgerLine = { journal_entry_id: number; entry_date: string; description: string; debit: number; credit: number; balance: number };
export type FinancialStatementSummary = {
  as_of: string; assets_total: number; liabilities_total: number; equity_total: number;
  revenue_total: number; expense_total: number; net_income: number; balance_check: boolean;
};

export type TaxInvoice = {
  id: number; invoice_type: string; partner_name: string; partner_biz_no: string; issue_date: string;
  supply_amount: number; vat_amount: number; status: string; note?: string; created_at: string;
};
export type VatReturnSummary = {
  year: number; quarter: number; period_start: string; period_end: string;
  sales_supply_total: number; sales_vat_total: number; purchase_supply_total: number;
  purchase_vat_total: number; vat_payable: number; invoice_count: number;
};
