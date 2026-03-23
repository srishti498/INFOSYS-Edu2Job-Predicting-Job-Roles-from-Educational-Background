# Edu2Job Predictor

Production-ready SaaS web app that predicts best-fit job roles based on educational profile, skills, CGPA, internships, and certifications.

## Tech Stack

- Frontend: React + Vite + Tailwind + shadcn/ui + Axios
- Backend: FastAPI + SQLAlchemy + REST API + CORS
- Database: SQLite by default, PostgreSQL-ready via DATABASE_URL

## Project Structure

frontend (existing root Vite app)

- src/components: reusable UI and feature components
- src/pages/Index.tsx: dashboard page
- src/services/api.ts: API client
- src/utils/pdf.ts: PDF export utility

backend

- main.py: FastAPI app + CORS + routes
- routes/predict.py: API endpoints
- services/predictor.py: rule engine + ML-ready facade
- services/recommender.py: profile improvement logic
- services/history_service.py: persistence logic
- models/schemas.py: request/response schemas
- models/history.py: DB model

## Features

- Modern SaaS dashboard with industrial visual style
- Left input panel + right prediction panel layout
- Dark/Light theme toggle
- Rule-based top 3 role predictions with confidence bars
- Input validation on frontend and backend
- Toast notifications + loading state + API error handling
- Skill suggestions and profile improvement recommendations
- Save prediction history (backend DB + local cache)
- Export prediction report as PDF
- API contract ready for future ML model integration

## API Endpoints

Base URL: /api/v1

1) POST /predict

Request:

{
	"education": "Bachelors",
	"stream": "Computer Science",
	"cgpa": 8.4,
	"internships": 2,
	"certifications": 1,
	"skills": ["python", "sql", "machine learning"]
}

Response:

{
	"mode": "rule_based",
	"roles": [
		{"name": "Software Developer", "confidence": 24.2},
		{"name": "Data Scientist", "confidence": 21.7},
		{"name": "Data Analyst", "confidence": 20.1}
	],
	"skill_suggestions": ["..."],
	"recommendations": [{"title": "...", "detail": "..."}]
}

2) GET /predict/history?limit=10

Returns recent predictions from DB.

## Local Setup

### 1. Frontend

Install and run:

npm install
npm run dev

Create env file from template:

cp .env.example .env

### 2. Backend

cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000

## Environment Variables

Frontend (.env)

- VITE_API_BASE_URL=http://localhost:8000/api/v1

Backend (.env)

- APP_NAME=Edu2Job Predictor API
- ENVIRONMENT=development
- API_PREFIX=/api/v1
- DATABASE_URL=sqlite:///./edu2job.db
- CORS_ORIGINS=http://localhost:5173

To switch to PostgreSQL in production, set DATABASE_URL to:

postgresql+psycopg://user:password@host:5432/db_name

## Deployment

Frontend (Vercel)

- Build command: npm run build
- Output directory: dist
- Env: VITE_API_BASE_URL=https://<your-backend-domain>/api/v1

Backend (Render/Railway)

- Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
- Root directory: backend
- Env: DATABASE_URL, CORS_ORIGINS, API_PREFIX

## Future ML Integration

Current rule engine is isolated in backend/services/predictor.py. Replace MLReadyPredictorFacade internals with a model inference service while keeping endpoint contracts unchanged.
