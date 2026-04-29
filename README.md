### 제조업에서 AI Agent를 구축할 때 필요한 팀 구성원과 역할을 정리해드릴게요. 
### 제조업은 IT 도메인과 OT(Operational Technology, 현장 운영 기술) 도메인이 모두 얽혀있어서 일반적인 AI 프로젝트보다 팀 구성이 더 다양합니다.

1. 리더십 / 기획 영역

Project Manager (PM) / Product Owner
프로젝트 전체 일정, 예산, 리소스를 관리하고 이해관계자 사이의 커뮤니케이션을 책임집니다. 제조업 특성상 현장(공장)과 본사 IT, 경영진 사이의 우선순위 조율이 중요한 역할이에요.

Domain Expert (제조 도메인 전문가)
공정 엔지니어, 품질 관리자, 생산 관리자 등 현장을 가장 잘 아는 사람입니다. AI Agent가 풀어야 할 진짜 문제가 무엇인지 정의하고, 모델이 내놓은 결과가 현장에서 말이 되는지 검증하는 역할을 합니다. 제조업 AI 프로젝트에서 이 역할이 빠지면 거의 실패한다고 봐도 될 정도로 중요해요.

Business Analyst
도메인 전문가의 요구사항을 기술팀이 이해할 수 있는 형태로 변환하고, ROI 분석과 KPI 설계를 담당합니다.

2. AI / 데이터 영역

AI/ML Engineer
LLM 기반 Agent의 핵심 로직을 구현합니다. Prompt engineering, RAG 파이프라인 구축, Tool calling 설계, Agent orchestration(LangChain, LangGraph 등) 등을 담당해요.

Data Scientist
제조 데이터(센서, 품질, 생산 실적 등)를 분석하고 예측 모델을 만듭니다. 이상 탐지, 수율 예측, 예지 보전 같은 전통적 ML 모델이 Agent의 도구로 쓰이는 경우가 많아요.

Data Engineer
MES, ERP, SCADA, 센서 데이터 등 분산된 제조 데이터 소스를 통합하는 데이터 파이프라인을 구축합니다. 제조업에서는 데이터가 여러 시스템에 흩어져 있고 형식도 제각각이라 이 역할의 비중이 큽니다.

MLOps Engineer
모델 배포, 모니터링, 재학습 파이프라인을 관리합니다. 제조 환경은 데이터 분포가 시간에 따라 변하므로(센서 노후화, 원자재 변경 등) 지속적인 모니터링이 필수예요.

3. 엔지니어링 / 인프라 영역

Backend Engineer
Agent API, 인증, 데이터베이스, 외부 시스템 연동을 담당합니다. ERP/MES 같은 기간계 시스템과의 안전한 연동이 핵심 과제예요.

Frontend Engineer
현장 작업자, 관리자가 Agent와 상호작용하는 UI를 만듭니다. 공장 현장에서는 태블릿, 키오스크, HMI 화면 등 다양한 디바이스를 고려해야 합니다.

DevOps / Cloud Engineer
인프라 구축과 운영을 담당합니다. 제조업은 보안 이슈로 온프레미스나 하이브리드 클라우드를 쓰는 경우가 많아 일반 SaaS와는 환경이 다릅니다.

OT/IoT Engineer
PLC, SCADA, 산업용 게이트웨이 등 현장 설비와 IT 시스템을 연결하는 역할입니다. OPC-UA, Modbus 같은 산업용 프로토콜을 다루며, 일반 IT 엔지니어와는 다른 전문성이 필요해요.

4. 품질 / 보안 / 규제 영역

QA Engineer
Agent의 응답 품질, 정확도, 안정성을 검증합니다. 제조업에서는 Agent의 잘못된 판단이 실제 생산 라인을 멈추거나 불량을 만들 수 있어서 일반 챗봇보다 훨씬 엄격한 테스트가 필요합니다.

Security Engineer
산업 제어 시스템(ICS) 보안, 데이터 유출 방지, 접근 권한 관리를 담당합니다. 제조업은 IT/OT 융합 보안이라는 특수성이 있어요.

Compliance / Legal
ISO 9001, IATF 16949(자동차), GMP(제약), 또는 EU AI Act, GDPR 등 산업별 규제를 검토합니다. 특히 안전 관련 의사결정에 AI가 개입할 때는 법적 책임 소재까지 고려해야 합니다.

5. 변화 관리 영역

Change Management / Training Lead
현장 작업자와 관리자가 새 시스템을 받아들이도록 교육하고, 저항을 관리합니다. 제조업은 보수적인 조직 문화가 많아서 기술이 좋아도 현장이 안 쓰면 실패하기 때문에 의외로 비중이 큰 역할입니다.
프로젝트 규모별 추천 구성
전체 인원을 다 갖추긴 어려우니 규모에 따라 조정합니다.
소규모 PoC 단계라면 PM 1명, 도메인 전문가 1명, AI Engineer 1~2명, Data Engineer 1명, OT Engineer 1명 정도로 5~6명이면 시작 가능합니다. 한 사람이 여러 역할을 겸하는 경우가 많아요.
본격적인 양산 도입 단계에서는 위에 나열한 역할이 대부분 필요하고, 보통 15~25명 규모로 운영됩니다. 특히 MLOps, Security, Change Management가 이 단계에서 추가로 강화돼요.

제조업 특화 주의사항
일반 IT 프로젝트와 다른 점 몇 가지를 강조하면, 도메인 전문가 비중이 매우 커야 한다는 점, OT 영역 전문가가 반드시 포함되어야 한다는 점, 현장 작업자의 디지털 리터러시 차이를 고려한 UX와 교육 계획이 필요하다는 점입니다. AI 기술 자체보다 이런 부분에서 프로젝트 성패가 갈리는 경우가 더 많아요.

---


# Exam AI Pipeline MVP (On-Prem, Docker Compose)

시험 데이터(시계열)를 **입수 → 전처리 → 학습 → 평가**까지 자동으로 수행하고, **관리자 대시보드**에서 상태/이력/지표를 확인할 수 있는 **MVP 레포**입니다.

![](./workflow.png)

## MVP에서 제공하는 것
- **데이터 입수 등록**: 로컬 파일 경로 기반(온프레미스 파일서버/공유폴더 마운트 가정)
- **파이프라인 실행**: `preprocess → train → evaluate` (Celery worker)
- **상태/이력/로그/지표 저장**: PostgreSQL + 파일 로그
- **관리자 UI**: 대시보드(최근 실행), 데이터셋 목록, 실행 목록, 실행 상세(스텝 상태/로그/지표)
- **API 문서**: FastAPI Swagger(`/api/docs`)

> 실제 모델/전처리 로직은 `pipelines/` 폴더의 예시(**sentence-transformers 기반 텍스트 분류**)로 구성되어 있으며,
> 여러분의 도메인 전처리/모델로 대체하도록 설계했습니다.

---

## sentence-transformers 파이프라인

현재 파이프라인은 CSV의 텍스트 컬럼을 [`paraphrase-multilingual-MiniLM-L12-v2`](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2) 모델로 임베딩하여 분류합니다.

### 입력 데이터 형식 (`data/inbound/*.csv`)
```
text,label
"다음 중 광합성의 산물로 옳은 것은?",science
"이차방정식 x^2 - 5x + 6 = 0 의 두 근의 합은?",math
...
```
- `text` 컬럼: 임베딩할 텍스트 (문제, 답변 등). `question`, `answer`, `content`, `sentence`도 자동 인식합니다.
- `label` 컬럼: 분류 대상 레이블 (필수)

샘플 파일: `data/inbound/sample.csv`

### 파이프라인 단계
| 단계 | 파일 | 설명 |
|------|------|------|
| preprocess | `pipelines/preprocess.py` | 텍스트 → 384차원 임베딩 벡터(emb_0~emb_383) 변환 |
| train | `pipelines/train.py` | 임베딩 피처로 LogisticRegression 학습 |
| evaluate | `pipelines/evaluate.py` | accuracy / f1 / precision / recall 산출 |

---

## 빠른 시작
### 1) 요구사항
- Docker Desktop(또는 Docker Engine) + Docker Compose

### 2) 실행
```bash
cd exam-ai-pipeline-mvp
cp .env.example .env
docker compose up -d --build
```

### 3) 접속
- Admin UI: http://localhost:8080
- API (Swagger): http://localhost:8080/api/docs

### 4) 샘플 데이터 생성 & 실행
```bash
docker compose exec api python scripts/generate_sample_data.py
docker compose exec api bash scripts/seed_and_run_sample.sh
```

---

## 주요 폴더 구조
```
apps/
  api/        # FastAPI + SQLAlchemy + Celery(작업 트리거)
  web/        # React(Vite) 관리자 페이지
pipelines/    # preprocess/train/evaluate 예시 파이프라인
scripts/      # 샘플 데이터 생성/실행 스크립트
data/         # (볼륨) inbound/processed/models/logs 저장
infra/        # nginx, db init
```

---

## 파이프라인 동작 개요
1. `POST /api/datasets` 로 데이터셋 등록 (예: inbound 폴더 내 파일)
2. `POST /api/runs` 로 실행 생성 (dataset_id + model_type)
3. Celery worker가 스텝을 순서대로 수행
   - preprocess: 정제/변환 후 processed로 저장
   - train: 모델 학습 후 models로 저장
   - evaluate: 성능 지표 산출(metrics.json) + DB 업데이트
4. UI에서 상태/이력/로그/지표 조회

---

## 커스터마이징 포인트
- 전처리: `pipelines/preprocess.py`
- 학습: `pipelines/train.py`
- 평가/지표: `pipelines/evaluate.py`
- 실행 정책/스텝 체인: `apps/api/app/workers/tasks.py`
- 데이터 입수 방식(폴더 감시, SFTP, NAS 등): `apps/api/app/services/ingest.py` (MVP는 경로 기반)

---

## API 요약
- `GET /api/health`
- `POST /api/datasets` / `GET /api/datasets`
- `POST /api/runs` / `GET /api/runs` / `GET /api/runs/{run_id}`
- `GET /api/runs/{run_id}/logs` (tail)

---

## 라이선스
Internal MVP template. 필요에 따라 사내 정책에 맞춰 조정하세요.

---

## NAS 폴더 감시(Watcher) 동작
이 레포는 `watcher` 서비스가 `/data/inbound` 폴더를 감시하여 파일이 들어오면 자동으로:
1) 파일 완전성 체크(크기 변화가 STABLE_SECONDS 동안 없으면 완료)
2) Dataset 자동 등록 (`POST /api/datasets`)
3) Run 자동 생성 + 파이프라인 실행 (`POST /api/runs`)

### 설정(환경변수)
- `STABLE_SECONDS`: 업로드 완료 판단 기준(초)
- `USE_DONE_FILE=true` 로 설정하면 `*.csv.done` 같은 완료 파일이 존재할 때만 처리합니다.
- `INCLUDE_EXT`: 감시 대상 확장자

### 테스트
```bash
# 샘플 데이터 생성(컨테이너 내부 /data/inbound)
docker compose exec api python scripts/generate_sample_data.py

# watcher 로그 확인
docker compose logs -f watcher
```
---
