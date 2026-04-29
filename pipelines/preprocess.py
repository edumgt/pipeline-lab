from __future__ import annotations
from pathlib import Path
import pandas as pd
from sentence_transformers import SentenceTransformer

# SentenceTransformer 모델 (경량 다국어 지원 모델)
_MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

# 임베딩 대상 텍스트 컬럼 우선순위 (CSV에 포함된 첫 번째 컬럼 사용)
_TEXT_COLUMN_CANDIDATES = ["text", "question", "answer", "content", "sentence"]

# 모듈 수준 싱글톤 캐시 (반복 초기화/다운로드 방지)
_model: SentenceTransformer | None = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer(_MODEL_NAME)
    return _model


def _detect_text_column(df: pd.DataFrame) -> str:
    """CSV에서 임베딩할 텍스트 컬럼을 자동 감지."""
    for col in _TEXT_COLUMN_CANDIDATES:
        if col in df.columns:
            return col
    # 후보 없으면 문자열 컬럼 중 첫 번째 사용
    str_cols = [c for c in df.columns if df[c].dtype == object and c != "label"]
    if str_cols:
        return str_cols[0]
    raise ValueError(
        f"임베딩할 텍스트 컬럼을 찾을 수 없습니다. "
        f"CSV에 {_TEXT_COLUMN_CANDIDATES} 중 하나의 컬럼이 있어야 합니다."
    )


def preprocess(source_path: str, out_dir: str, run_id: int) -> str:
    """
    sentence_transformers 전처리:
    - CSV 읽기
    - 텍스트 컬럼을 SentenceTransformer 임베딩 벡터(384차원)로 변환
    - 임베딩 벡터를 열(emb_0 ~ emb_383)로 펼쳐 processed.csv 저장
    - label 컬럼은 그대로 유지
    """
    src = Path(source_path)
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(src)
    if "label" not in df.columns:
        raise ValueError("CSV에 'label' 컬럼이 필요합니다.")

    text_col = _detect_text_column(df)

    # 결측치를 빈 문자열로 대체
    texts = df[text_col].fillna("").astype(str).tolist()

    model = _get_model()
    embeddings = model.encode(texts, show_progress_bar=True, batch_size=64)

    emb_dim = embeddings.shape[1]
    emb_cols = {f"emb_{i}": embeddings[:, i] for i in range(emb_dim)}
    result_df = pd.DataFrame(emb_cols)
    result_df["label"] = df["label"].values

    processed_path = out / "processed.csv"
    result_df.to_csv(processed_path, index=False)
    return str(processed_path)
