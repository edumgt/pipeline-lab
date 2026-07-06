export type PageKey =
  | "dashboard"
  | "mfg-production"
  | "mfg-equipment"
  | "mfg-quality"
  | "mfg-ai"
  | "acc-journal"
  | "acc-accounts"
  | "acc-ledger"
  | "acc-financials"
  | "tax-invoices"
  | "tax-vat";

export type NavItem = { key: PageKey; label: string };
export type NavGroup = { key: string; label: string; icon: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    key: "home",
    label: "대시보드",
    icon: "🏠",
    items: [{ key: "dashboard", label: "전체 요약" }],
  },
  {
    key: "mfg",
    label: "제조",
    icon: "🏭",
    items: [
      { key: "mfg-production", label: "생산실적" },
      { key: "mfg-equipment", label: "설비관리" },
      { key: "mfg-quality", label: "품질검사" },
      { key: "mfg-ai", label: "AI 분석 파이프라인" },
    ],
  },
  {
    key: "acc",
    label: "회계",
    icon: "📒",
    items: [
      { key: "acc-journal", label: "전표입력" },
      { key: "acc-accounts", label: "계정과목" },
      { key: "acc-ledger", label: "원장조회" },
      { key: "acc-financials", label: "재무제표" },
    ],
  },
  {
    key: "tax",
    label: "세무",
    icon: "🧾",
    items: [
      { key: "tax-invoices", label: "세금계산서" },
      { key: "tax-vat", label: "부가세 신고" },
    ],
  },
];

export function pageLabel(key: PageKey): string {
  for (const g of NAV_GROUPS) {
    for (const it of g.items) if (it.key === key) return it.label;
  }
  return key;
}
