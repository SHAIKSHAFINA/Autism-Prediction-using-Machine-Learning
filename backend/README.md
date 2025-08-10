# Autism Prediction System - Backend (FastAPI)

This FastAPI service loads a pre-trained classifier from `autism_model.pkl` and exposes a `/predict` endpoint.

## Features
- Loads model once at startup using joblib
- Minimal preprocessing to align with training features
- CORS enabled for frontend integration

## Requirements
- Python 3.10+

## Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\\Scripts\\activate
pip install --upgrade pip
pip install -r requirements.txt
```

Place your trained model file at:
- `backend/autism_model.pkl` (default), or
- configure a custom path via env var `MODEL_PATH`.

## Run locally
```bash
# From backend directory
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

- API root: `http://localhost:8000/`
- Predict: `POST http://localhost:8000/predict`

### Request schema (JSON)
```json
{
  "age": 30,
  "gender": "M",
  "ethnicity": "White",
  "country_of_residence": "United Kingdom",
  "jaundice": "No",
  "family_history_asd": "Yes",
  "used_app_before": "No",
  "relation": "Self",
  "a1": 1, "a2": 0, "a3": 1, "a4": 0, "a5": 1,
  "a6": 0, "a7": 1, "a8": 0, "a9": 1, "a10": 0
}
```

### Response
```json
{
  "prediction": "Likely ASD",
  "probability": 0.83
}
```

## Environment variables
- `MODEL_PATH`: Optional absolute/relative path to the model file. Defaults to `backend/autism_model.pkl`.
- `CORS_ORIGINS`: Comma-separated list of allowed origins. Defaults to `*`.

## Deploy (Render)
1. Create new Web Service
2. Connect your repo
3. Root Directory: `backend`
4. Environment: `Python 3.10`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Add env vars as needed (`MODEL_PATH`, `CORS_ORIGINS`)

## Deploy (Railway)
1. Create a new project, select Deploy from GitHub
2. Service root: `backend`
3. Add variables: `PORT` (Railway provides), `MODEL_PATH`, `CORS_ORIGINS`
4. Nixpacks will detect Python. If using Docker, use a simple Dockerfile:

```Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV PORT=8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "${PORT}"]
```

Upload your `autism_model.pkl` to the service (using persistent storage or commit to repo if allowed).