import os
from pathlib import Path
from typing import Literal, Optional

import joblib
import numpy as np
try:
    import pandas as pd  # optional, only used for fallback pipeline path
except Exception:  # pragma: no cover
    pd = None
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator


# -----------------------------
# Configuration
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent
DEFAULT_MODEL_PATH = BASE_DIR / "autism_model.pkl"
MODEL_PATH = Path(os.environ.get("MODEL_PATH", str(DEFAULT_MODEL_PATH)))

ALLOWED_ORIGINS = os.environ.get("CORS_ORIGINS", "*")
CORS_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS.split(",") if origin.strip()]


# -----------------------------
# Data Schemas
# -----------------------------
class ASDRequest(BaseModel):
    # Core demographics
    age: int = Field(..., ge=1, le=120)
    gender: Literal["M", "F"]
    ethnicity: str
    country_of_residence: str

    # Medical/family history
    jaundice: Literal["Yes", "No"]
    family_history_asd: Literal["Yes", "No"]

    # App usage and relation
    used_app_before: Literal["Yes", "No"]
    relation: Literal[
        "Self", "Parent", "Relative", "Healthcare professional", "Others"
    ]

    # AQ-10 answers (binary 0/1 after scoring)
    a1: int = Field(..., ge=0, le=1)
    a2: int = Field(..., ge=0, le=1)
    a3: int = Field(..., ge=0, le=1)
    a4: int = Field(..., ge=0, le=1)
    a5: int = Field(..., ge=0, le=1)
    a6: int = Field(..., ge=0, le=1)
    a7: int = Field(..., ge=0, le=1)
    a8: int = Field(..., ge=0, le=1)
    a9: int = Field(..., ge=0, le=1)
    a10: int = Field(..., ge=0, le=1)

    @field_validator("ethnicity", "country_of_residence")
    def _strip_lower(cls, value: str) -> str:
        return value.strip()


class ASDResponse(BaseModel):
    prediction: Literal["Likely ASD", "Not ASD"]
    probability: float = Field(..., ge=0.0, le=1.0)


# -----------------------------
# App and Model Loading
# -----------------------------
app = FastAPI(title="Autism Prediction System API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if CORS_ORIGINS == ["*"] or not CORS_ORIGINS else CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_model: Optional[object] = None


def _load_model() -> object:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model file not found at {MODEL_PATH}. Set MODEL_PATH env var or place 'autism_model.pkl' under backend/."
        )
    model = joblib.load(MODEL_PATH)
    return model


@app.on_event("startup")
def startup_event() -> None:
    global _model
    _model = _load_model()


# -----------------------------
# Preprocessing
# -----------------------------
RELATION_TO_ONEHOT = {
    "Self": "relation_Self",
    "Parent": "relation_Parent",
    "Relative": "relation_Relative",
    "Healthcare professional": "relation_Healthcare",
    "Others": "relation_Others",
}

FEATURE_COLUMNS = [
    "age",
    # gender one-hot
    "gender_M",
    "gender_F",
    # binary flags
    "jaundice_Yes",
    "family_history_asd_Yes",
    "used_app_before_Yes",
    # AQ-10
    "a1",
    "a2",
    "a3",
    "a4",
    "a5",
    "a6",
    "a7",
    "a8",
    "a9",
    "a10",
    # relation one-hot
    "relation_Self",
    "relation_Parent",
    "relation_Relative",
    "relation_Healthcare",
    "relation_Others",
]


def _preprocess_to_array(payload: ASDRequest) -> np.ndarray:
    gender_onehot = [1 if payload.gender == "M" else 0, 1 if payload.gender == "F" else 0]
    binary_flags = [
        1 if payload.jaundice == "Yes" else 0,
        1 if payload.family_history_asd == "Yes" else 0,
        1 if payload.used_app_before == "Yes" else 0,
    ]
    aq = [payload.a1, payload.a2, payload.a3, payload.a4, payload.a5,
          payload.a6, payload.a7, payload.a8, payload.a9, payload.a10]

    relation_onehot = [0, 0, 0, 0, 0]
    relation_index_map = {
        "Self": 0,
        "Parent": 1,
        "Relative": 2,
        "Healthcare professional": 3,
        "Others": 4,
    }
    relation_idx = relation_index_map.get(payload.relation, 4)
    relation_onehot[relation_idx] = 1

    values = [payload.age] + gender_onehot + binary_flags + aq + relation_onehot
    X = np.array(values, dtype=float).reshape(1, -1)
    return X


# -----------------------------
# Routes
# -----------------------------
@app.get("/")
def root() -> dict:
    return {
        "name": "Autism Prediction System API",
        "version": "1.0.0",
        "model_path": str(MODEL_PATH),
        "status": "ok",
    }


@app.post("/predict", response_model=ASDResponse)
def predict(payload: ASDRequest) -> ASDResponse:
    if _model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # Primary path: use NumPy array with fixed feature order
    X = _preprocess_to_array(payload)

    try:
        if hasattr(_model, "predict_proba"):
            proba = float(_model.predict_proba(X)[0][1])
            pred_class = int(_model.predict(X)[0])
        else:
            pred = _model.predict(X)[0]
            pred_class = int(pred)
            proba = 1.0 if pred_class == 1 else 0.0
    except Exception:
        # Secondary path: only attempt if pandas is available and model expects DataFrame with column names
        if pd is None:
            raise HTTPException(status_code=400, detail="Prediction failed and pandas is not available for fallback path.")
        try:
            row = {
                "age": payload.age,
                "gender": payload.gender,
                "ethnicity": payload.ethnicity,
                "country_of_residence": payload.country_of_residence,
                "jaundice": payload.jaundice,
                "family_history_asd": payload.family_history_asd,
                "used_app_before": payload.used_app_before,
                "relation": payload.relation,
                "a1": payload.a1,
                "a2": payload.a2,
                "a3": payload.a3,
                "a4": payload.a4,
                "a5": payload.a5,
                "a6": payload.a6,
                "a7": payload.a7,
                "a8": payload.a8,
                "a9": payload.a9,
                "a10": payload.a10,
            }
            raw_df = pd.DataFrame([row])
            if hasattr(_model, "predict_proba"):
                proba = float(_model.predict_proba(raw_df)[0][1])
                pred_class = int(_model.predict(raw_df)[0])
            else:
                pred = _model.predict(raw_df)[0]
                pred_class = int(pred)
                proba = 1.0 if pred_class == 1 else 0.0
        except Exception as inner:
            raise HTTPException(status_code=400, detail=f"Prediction failed: {inner}") from inner

    label = "Likely ASD" if pred_class == 1 else "Not ASD"
    proba = max(0.0, min(1.0, proba))
    return ASDResponse(prediction=label, probability=proba)