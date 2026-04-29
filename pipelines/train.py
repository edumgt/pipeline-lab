from __future__ import annotations
from pathlib import Path
import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


def train(processed_path: str, out_dir: str, run_id: int, model_type: str = "sentence_transformers_lr") -> str:
    """
    sentence_transformers 임베딩 기반 학습:
    - processed.csv의 emb_* 컬럼을 피처로 사용
    - LogisticRegression 학습 (임베딩 위에서 선형 분류가 효율적)
    - model.joblib 저장
    """
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(processed_path)
    if "label" not in df.columns:
        raise ValueError("processed data must contain 'label' column")

    emb_cols = [c for c in df.columns if c.startswith("emb_")]
    if not emb_cols:
        raise ValueError("임베딩 컬럼(emb_*)이 없습니다. preprocess 단계를 먼저 실행하세요.")

    X = df[emb_cols].values
    y = df["label"]

    le = LabelEncoder()
    y_enc = le.fit_transform(y)

    X_train, X_val, y_train, y_val = train_test_split(X, y_enc, test_size=0.2, random_state=42, stratify=y_enc)

    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_train, y_train)

    model_path = out / "model.joblib"
    joblib.dump(
        {
            "model": model,
            "columns": emb_cols,
            "label_encoder": le,
        },
        model_path,
    )
    return str(model_path)
