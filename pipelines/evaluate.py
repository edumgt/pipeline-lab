from __future__ import annotations
import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split

def evaluate(processed_path: str, model_path: str, out_dir: str, run_id: int) -> dict:
    """
    sentence_transformers 임베딩 기반 평가:
    - train/val split을 동일 방식으로 다시 나누어 val 지표 산출
    - LabelEncoder가 bundle에 포함된 경우 label 인코딩 적용
    """
    bundle = joblib.load(model_path)
    model = bundle["model"]
    cols = bundle["columns"]
    le = bundle.get("label_encoder")

    df = pd.read_csv(processed_path)
    X = df[cols].values
    y = df["label"]

    # train.py와 동일한 방식으로 label 인코딩 후 분리
    y_enc = le.transform(y) if le is not None else y

    _, X_val, _, y_val = train_test_split(X, y_enc, test_size=0.2, random_state=42, stratify=y_enc)

    pred = model.predict(X_val)
    return {
        "accuracy": float(accuracy_score(y_val, pred)),
        "f1": float(f1_score(y_val, pred, average="weighted")),
        "precision": float(precision_score(y_val, pred, average="weighted", zero_division=0)),
        "recall": float(recall_score(y_val, pred, average="weighted", zero_division=0)),
        "val_samples": int(len(y_val)),
    }
