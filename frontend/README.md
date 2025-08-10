# Autism Prediction System - Frontend (React + Vite + Tailwind)

A responsive React app that collects inputs and calls the FastAPI backend to predict ASD likelihood.

## Prerequisites
- Node.js 18+
- Backend API running (see `../backend/README.md`)

## Setup
```bash
cd frontend
npm install
cp .env.example .env        # then edit VITE_API_URL if needed
```

## Run locally
```bash
npm run dev
```
Open the URL printed by Vite (default `http://localhost:5173`).

## Environment
- `VITE_API_URL`: Base URL of the backend API. Example: `http://localhost:8000` or your deployed URL.

`.env.example`:
```
VITE_API_URL=http://localhost:8000
```

## Build
```bash
npm run build
npm run preview
```

## Deploy
### Vercel
1. Import the repo
2. Project root: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variable: `VITE_API_URL` set to your backend URL

### Netlify
1. New site from Git
2. Base directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable `VITE_API_URL`

## Notes
- This project uses Vite React plugin configured in `vite.config.js`.