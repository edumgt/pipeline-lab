[한국어](./readme-kr.md)

# Manufacturing AI Agent Team Composition Guide

Manufacturing spans both the IT domain and the OT (Operational Technology) domain, so team composition is more diverse than in a typical AI project.

## 1) Leadership / Planning

- **Project Manager (PM) / Product Owner**  
  Manages the overall schedule, budget, and resources, and owns communication among stakeholders. In manufacturing, aligning priorities among the shop floor (the plant), corporate IT, and executives is a critical part of this role.
- **Domain Expert (Manufacturing Domain Specialist)**  
  Process engineers, quality managers, production managers, and others who know the shop floor best. They define the real problems an AI agent must solve and validate whether model outputs are sound in the field.
- **Business Analyst**  
  Translates domain-expert requirements into a form the technical team can understand, and owns ROI analysis and KPI design.

## 2) AI / Data

- **AI/ML Engineer**  
  Implements the core logic of LLM-based agents. Responsible for prompt engineering, building the RAG pipeline, designing tool calling, and agent orchestration (LangChain, LangGraph, and similar).
- **Data Scientist**  
  Analyzes manufacturing data (sensors, quality, production results, and so on) and builds predictive models. Traditional ML models such as anomaly detection, yield prediction, and predictive maintenance are often used as tools of the agent.
- **Data Engineer**  
  Builds data pipelines that integrate distributed manufacturing data sources such as MES, ERP, SCADA, and sensor data.
- **MLOps Engineer**  
  Manages model deployment, monitoring, and retraining pipelines. In manufacturing, data distributions drift over time, so continuous monitoring is essential.

## 3) Engineering / Infrastructure

- **Backend Engineer**  
  Owns the agent API, authentication, databases, and integration with external systems. Safe integration with systems of record such as ERP and MES is essential.
- **Frontend Engineer**  
  Builds the UI through which shop-floor operators and managers interact with the agent. Must account for a range of devices, including tablets, kiosks, and HMI screens.
- **DevOps / Cloud Engineer**  
  Builds and operates infrastructure. For security reasons, manufacturing often uses on-premises or hybrid cloud.
- **OT/IoT Engineer**  
  Connects shop-floor equipment such as PLCs, SCADA, and industrial gateways to IT systems. Requires expertise in industrial protocols such as OPC-UA and Modbus.

## 4) Quality / Security / Compliance

- **QA Engineer**  
  Validates the agent's response quality, accuracy, and stability. In manufacturing, a wrong decision can directly affect the production line, so testing must be stricter.
- **Security Engineer**  
  Owns industrial control system (ICS) security, data-leak prevention, and access control.
- **Compliance / Legal**  
  Reviews industry-specific regulations such as ISO 9001, IATF 16949 (automotive), GMP (pharmaceuticals), the EU AI Act, and GDPR.

## 5) Change Management

- **Change Management / Training Lead**  
  Trains shop-floor operators and managers to adopt the new system and manages resistance to change.

## Recommended Composition by Project Scale

It is rarely practical to staff every role, so adjust the team by scale.

- **Small PoC stage**: Can start with about 5–6 people — 1 PM, 1 domain expert, 1–2 AI engineers, 1 data engineer, and 1 OT engineer
- **Production rollout stage**: Most roles are required, typically a team of 15–25, with extra emphasis on MLOps, security, and change management

## Manufacturing-Specific Cautions

Compared with a typical IT project, the share of domain experts must be much larger, an OT specialist must be included, and the UX and training plan must account for differences in digital literacy among shop-floor operators.

---

# Internal Operations Portal (Manufacturing · Accounting · Tax)

This repository started as an AI pipeline MVP for exam data and has been evolved into an **internal operations portal spanning manufacturing, accounting, and tax**.
It provides a **portal-style UI** for moving between domains from the left sidebar. Each domain is an independent module with its own database tables, API, and screens.

## Portal Structure

- **Dashboard**: A single-screen summary of key manufacturing, accounting, and tax metrics
- **🏭 Manufacturing**
  - Production results (enter and query planned, actual, and defect quantities)
  - Equipment management (register equipment; manage running, inspection, and failure status)
  - Quality inspection (pass/fail decisions per LOT; record defect reasons)
  - AI analysis pipeline (the existing exam-data ML pipeline MVP: register a dataset → preprocess → train → evaluate)
- **📒 Accounting**
  - Journal entry (double-entry bookkeeping; debit/credit total validation)
  - Chart of accounts (manage the five classes: assets, liabilities, equity, revenue, and expenses)
  - Ledger inquiry (transaction history and balance tracking by account)
  - Financial statements (summary) — balance sheet and income statement summaries, plus a check that the trial balance agrees
- **🧾 Tax**
  - Register and query tax invoices (purchase and sales); VAT at 10% is calculated automatically
  - VAT return support — quarterly aggregation of output tax, input tax, and tax payable (or refundable)

## Backend Structure by Domain

Under `apps/api/app/domains/{manufacturing,accounting,tax}/`, each domain independently has `models.py` (SQLAlchemy), `schemas.py` (Pydantic), `crud.py`, and `routes.py`. To add a new domain, copy this pattern and add only the router and model imports in `apps/api/app/main.py`.

## Generating Sample Data

```bash
docker compose exec api bash scripts/seed_domain_data.sh
```
Registers sample data for manufacturing (equipment, production records, and quality inspections), accounting (chart of accounts and journal entries), and tax (tax invoices) in one step.

---

# Exam AI Pipeline MVP (On-Prem, Docker Compose)

An **MVP repository** that automatically runs exam (time-series) data through **ingest → preprocess → train → evaluate**, and lets you inspect status, history, and metrics from an **admin dashboard**. Inside the portal, open it from **Manufacturing > AI Analysis Pipeline**.

![](./workflow.png)

## What the MVP Provides
- **Dataset registration**: Based on a local file path (assumes an on-premises file server or a mounted shared folder)
- **Pipeline execution**: `preprocess → train → evaluate` (Celery worker)
- **Status, history, logs, and metrics storage**: PostgreSQL + file logs
- **Admin UI**: Dashboard (recent runs), dataset list, run list, and run detail (step status, logs, and metrics)
- **API docs**: FastAPI Swagger (`/api/docs`)

> The actual model and preprocessing logic is an example in the `pipelines/` folder (**text classification based on sentence-transformers**),
> and is designed so you can replace it with preprocessing and models for your own domain.

---

## sentence-transformers Pipeline

The current pipeline embeds the text column of a CSV with the [`paraphrase-multilingual-MiniLM-L12-v2`](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2) model and classifies it.

### Input Data Format (`data/inbound/*.csv`)
```
text,label
"다음 중 광합성의 산물로 옳은 것은?",science
"이차방정식 x^2 - 5x + 6 = 0 의 두 근의 합은?",math
...
```
- `text` column: text to embed (questions, answers, and so on). `question`, `answer`, `content`, and `sentence` are also recognized automatically.
- `label` column: classification label (required)

Sample file: `data/inbound/sample.csv`

### Pipeline Stages
| Stage | File | Description |
|------|------|------|
| preprocess | `pipelines/preprocess.py` | Convert text into 384-dimensional embedding vectors (`emb_0`–`emb_383`) |
| train | `pipelines/train.py` | Train LogisticRegression on the embedding features |
| evaluate | `pipelines/evaluate.py` | Compute accuracy, F1, precision, and recall |

---

## Quick Start
### 1) Requirements
- Docker Desktop (or Docker Engine) + Docker Compose

### 2) Run
```bash
cd exam-ai-pipeline-mvp
cp .env.example .env
docker compose up -d --build
```

### 3) Access
- Admin UI: http://localhost:8080
- API (Swagger): http://localhost:8080/api/docs

### 4) Generate and Run Sample Data
```bash
docker compose exec api python scripts/generate_sample_data.py
docker compose exec api bash scripts/seed_and_run_sample.sh
```

---

## Key Folder Structure
```
apps/
  api/
    app/
      domains/
        manufacturing/  # equipment / production records / quality inspections (models/schemas/crud/routes)
        accounting/     # chart of accounts / journal entries / ledger / financial statements
        tax/            # tax invoices / VAT return
      routes/, models.py, crud.py, schemas.py  # existing AI pipeline (Dataset/Run)
  web/
    src/
      pages/
        manufacturing/  # ProductionPage, EquipmentPage, QualityPage, AiPipelinePage
        accounting/     # AccountsPage, JournalPage, LedgerPage, FinancialsPage
        tax/            # InvoicesPage, VatReturnPage
      nav.ts, components/Sidebar.tsx  # portal sidebar navigation
pipelines/    # example preprocess/train/evaluate pipeline (used by the AI analysis pipeline module)
scripts/      # sample data generation and run scripts (includes seed_domain_data.sh)
data/         # (volume) storage for inbound/processed/models/logs
infra/        # nginx, db init
```

---

## Pipeline Flow
1. Register a dataset with `POST /api/datasets` (for example, a file in the inbound folder)
2. Create a run with `POST /api/runs` (`dataset_id` + `model_type`)
3. The Celery worker executes the steps in order
   - preprocess: clean and transform, then save to processed
   - train: train the model and save it to models
   - evaluate: compute performance metrics (`metrics.json`) and update the database
4. Query status, history, logs, and metrics in the UI

---

## Customization Points
- Preprocessing: `pipelines/preprocess.py`
- Training: `pipelines/train.py`
- Evaluation and metrics: `pipelines/evaluate.py`
- Execution policy and step chain: `apps/api/app/workers/tasks.py`
- Data ingest method (folder watch, SFTP, NAS, and so on): `apps/api/app/services/ingest.py` (the MVP is path-based)

---

## API Summary

### AI Analysis Pipeline (Manufacturing > AI Analysis)
- `GET /api/health`
- `POST /api/datasets` / `GET /api/datasets`
- `POST /api/runs` / `GET /api/runs` / `GET /api/runs/{run_id}`
- `GET /api/runs/{run_id}/logs` (tail)

### Manufacturing (Production Management)
- `GET /api/manufacturing/summary`
- `POST /api/manufacturing/equipment` / `GET /api/manufacturing/equipment` / `PATCH /api/manufacturing/equipment/{id}/status?status=`
- `POST /api/manufacturing/production-records` / `GET /api/manufacturing/production-records`
- `POST /api/manufacturing/quality-inspections` / `GET /api/manufacturing/quality-inspections`

### Accounting
- `POST /api/accounting/accounts` / `GET /api/accounting/accounts`
- `POST /api/accounting/journal-entries` / `GET /api/accounting/journal-entries` (returns 422 if debit and credit totals do not match)
- `GET /api/accounting/accounts/{id}/ledger?as_of=`
- `GET /api/accounting/financial-statements?as_of=`

### Tax
- `POST /api/tax/invoices` / `GET /api/tax/invoices?invoice_type=sales|purchase`
- `GET /api/tax/vat-return?year=&quarter=`

---

## License
Internal MVP template. Adjust it to match internal policy as needed.

---

## NAS Folder Watcher
The `watcher` service in this repository watches `/data/inbound`. When a file arrives, it automatically:
1) Checks file completeness (treats the upload as finished if the size does not change for `STABLE_SECONDS`)
2) Registers a dataset (`POST /api/datasets`)
3) Creates a run and starts the pipeline (`POST /api/runs`)

### Settings (environment variables)
- `STABLE_SECONDS`: seconds used to decide that an upload is complete
- When `USE_DONE_FILE=true`, a file is processed only if a completion marker such as `*.csv.done` exists
- `INCLUDE_EXT`: file extensions to watch

### Test
```bash
# Generate sample data (inside the container at /data/inbound)
docker compose exec api python scripts/generate_sample_data.py

# Check watcher logs
docker compose logs -f watcher
```
---
