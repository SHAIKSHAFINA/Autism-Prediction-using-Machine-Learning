# Autism Prediction System (Full Stack)

Full-stack application for ASD prediction using a pre-trained ML classifier.

## Structure
- `/backend` — FastAPI service that loads `autism_model.pkl` and exposes `/predict`
- `/frontend` — React + Vite + Tailwind UI

## Quick Start
### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install --upgrade pip
pip install -r requirements.txt
# Place your model at backend/autism_model.pkl (or set MODEL_PATH)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open `http://localhost:5173` and ensure `VITE_API_URL` points to the backend (`http://localhost:8000`).

## API
- `POST /predict` with JSON body (see `backend/README.md`)

## Integration Notes
- CORS is enabled on the backend. For production, set `CORS_ORIGINS` to your frontend domain(s).
- Frontend reads API base URL from `VITE_API_URL`.

## Deployment
- Backend: Render or Railway (see `backend/README.md`)
- Frontend: Vercel or Netlify (see `frontend/README.md`)

After deployment, update the frontend env `VITE_API_URL` to the deployed backend URL and redeploy the frontend.

