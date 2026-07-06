#!/usr/bin/env bash
set -euo pipefail

API_BASE="http://localhost:8080/api"

jget() { python3 -c "import sys, json; print(json.load(sys.stdin)$1)"; }

echo "[제조] 설비 등록..."
curl -s -X POST "${API_BASE}/manufacturing/equipment" -H "Content-Type: application/json" \
  -d '{"name":"사출성형기 #1","line":"A라인","equipment_type":"사출","status":"running"}' > /dev/null
curl -s -X POST "${API_BASE}/manufacturing/equipment" -H "Content-Type: application/json" \
  -d '{"name":"조립로봇 #2","line":"B라인","equipment_type":"조립","status":"maintenance"}' > /dev/null

echo "[제조] 생산실적 등록..."
TODAY=$(date +%F)
curl -s -X POST "${API_BASE}/manufacturing/production-records" -H "Content-Type: application/json" \
  -d "{\"line\":\"A라인\",\"product_name\":\"엔진커버\",\"work_date\":\"${TODAY}\",\"shift\":\"day\",\"planned_qty\":1000,\"actual_qty\":950,\"defect_qty\":18}" > /dev/null

echo "[제조] 품질검사 등록..."
curl -s -X POST "${API_BASE}/manufacturing/quality-inspections" -H "Content-Type: application/json" \
  -d '{"lot_no":"LOT-2026-0001","product_name":"엔진커버","inspector":"김검사","result":"pass"}' > /dev/null
curl -s -X POST "${API_BASE}/manufacturing/quality-inspections" -H "Content-Type: application/json" \
  -d '{"lot_no":"LOT-2026-0002","product_name":"엔진커버","inspector":"김검사","result":"fail","defect_reason":"치수 불량"}' > /dev/null

echo "[회계] 계정과목 등록..."
CASH_ID=$(curl -s -X POST "${API_BASE}/accounting/accounts" -H "Content-Type: application/json" \
  -d '{"code":"101","name":"현금","type":"asset"}' | jget "['id']")
AR_ID=$(curl -s -X POST "${API_BASE}/accounting/accounts" -H "Content-Type: application/json" \
  -d '{"code":"102","name":"매출채권","type":"asset"}' | jget "['id']")
AP_ID=$(curl -s -X POST "${API_BASE}/accounting/accounts" -H "Content-Type: application/json" \
  -d '{"code":"201","name":"미지급금","type":"liability"}' | jget "['id']")
CAP_ID=$(curl -s -X POST "${API_BASE}/accounting/accounts" -H "Content-Type: application/json" \
  -d '{"code":"301","name":"자본금","type":"equity"}' | jget "['id']")
SALES_ID=$(curl -s -X POST "${API_BASE}/accounting/accounts" -H "Content-Type: application/json" \
  -d '{"code":"401","name":"매출","type":"revenue"}' | jget "['id']")
COGS_ID=$(curl -s -X POST "${API_BASE}/accounting/accounts" -H "Content-Type: application/json" \
  -d '{"code":"501","name":"매출원가","type":"expense"}' | jget "['id']")

echo "  cash=${CASH_ID} ar=${AR_ID} ap=${AP_ID} capital=${CAP_ID} sales=${SALES_ID} cogs=${COGS_ID}"

echo "[회계] 전표(분개) 등록..."
curl -s -X POST "${API_BASE}/accounting/journal-entries" -H "Content-Type: application/json" \
  -d "{\"entry_date\":\"${TODAY}\",\"description\":\"자본금 출자\",\"lines\":[{\"account_id\":${CASH_ID},\"debit\":10000000,\"credit\":0},{\"account_id\":${CAP_ID},\"debit\":0,\"credit\":10000000}]}" > /dev/null

curl -s -X POST "${API_BASE}/accounting/journal-entries" -H "Content-Type: application/json" \
  -d "{\"entry_date\":\"${TODAY}\",\"description\":\"제품 매출\",\"lines\":[{\"account_id\":${AR_ID},\"debit\":5500000,\"credit\":0},{\"account_id\":${SALES_ID},\"debit\":0,\"credit\":5000000},{\"account_id\":${AP_ID},\"debit\":0,\"credit\":500000}]}" > /dev/null

curl -s -X POST "${API_BASE}/accounting/journal-entries" -H "Content-Type: application/json" \
  -d "{\"entry_date\":\"${TODAY}\",\"description\":\"매출원가 대체\",\"lines\":[{\"account_id\":${COGS_ID},\"debit\":3000000,\"credit\":0},{\"account_id\":${CASH_ID},\"debit\":0,\"credit\":3000000}]}" > /dev/null

echo "[세무] 세금계산서 등록..."
curl -s -X POST "${API_BASE}/tax/invoices" -H "Content-Type: application/json" \
  -d "{\"invoice_type\":\"sales\",\"partner_name\":\"(주)거래처A\",\"partner_biz_no\":\"123-45-67890\",\"issue_date\":\"${TODAY}\",\"supply_amount\":5000000}" > /dev/null
curl -s -X POST "${API_BASE}/tax/invoices" -H "Content-Type: application/json" \
  -d "{\"invoice_type\":\"purchase\",\"partner_name\":\"(주)원자재B\",\"partner_biz_no\":\"234-56-78901\",\"issue_date\":\"${TODAY}\",\"supply_amount\":3000000}" > /dev/null

echo "[OK] 샘플 데이터 등록 완료. 포탈에서 확인하세요: http://localhost:8080"
