# Today's Mandi Prices

A modern, production-ready agriculture web application that helps farmers find today's mandi (market) prices across India.

## Architecture

Clean Architecture with separated layers:

```
├── backend/          # FastAPI + PostgreSQL + SQLAlchemy 2
│   └── app/
│       ├── api/          # REST endpoints
│       ├── core/         # Configuration
│       ├── database/     # DB session & base
│       ├── models/       # SQLAlchemy models
│       ├── schemas/      # Pydantic v2 schemas
│       ├── repositories/ # Data access layer
│       ├── services/     # Business logic
│       └── utils/        # Helpers
│
└── frontend/         # React 19 + Vite + MUI
    └── src/
        ├── app/          # App root
        ├── components/   # Shared UI
        ├── features/     # Feature modules (market)
        ├── layouts/      # Page layouts
        ├── pages/        # Route pages
        ├── routes/       # React Router
        ├── store/        # Zustand state
        ├── theme/        # MUI theme
        └── utils/        # Formatters, debounce
```

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, TypeScript, MUI, React Router, TanStack Query, Axios, Zustand, Recharts |
| Backend | FastAPI, PostgreSQL, SQLAlchemy 2, Alembic, Pydantic v2, httpx |
| Data Source | Government of India Agmarknet via [data.gov.in](https://data.gov.in) |

## Features

- **Dashboard** — Responsive commodity price cards with modal/min/max prices
- **Search** — Debounced commodity search
- **Filters** — State, District, Market (APMC), Commodity with auto-refresh
- **Commodity Details** — Full price info with placeholder charts for future trends
- **Dark/Light Mode** — Persistent theme toggle
- **Caching** — 30-minute PostgreSQL cache layer
- **Multi-language** — Hindi, Marathi, English (farmer-friendly)
- **Loading States** — Skeleton loaders, empty/error/offline states

## 🌐 Free Public Hosting (₹0)

Deploy online for farmers to use from any phone:

| Service | Free tier | Hosts |
|---------|-----------|-------|
| [Neon](https://neon.tech) | PostgreSQL free | Database |
| [Render](https://render.com) | Web service free | Backend API |
| [Vercel](https://vercel.com) | Unlimited free | Frontend |

**Full step-by-step guide:** see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

Quick flow: GitHub → Neon (DB) → Render (API) → Vercel (website)

## Quick Start (Local)

### Prerequisites

- Docker & Docker Compose (recommended), OR
- Node.js 20+, Python 3.12+, PostgreSQL 16

### Option 1: Docker (Recommended)

```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services
docker-compose up -d

# Access the app
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Development (Windows — easiest)

Double-click these files in the project folder:

1. **`start-backend.bat`** — starts API at http://localhost:8000
2. **`start-frontend.bat`** — starts UI at http://localhost:5173

Keep both windows open while using the app.

### Option 3: pgAdmin + Local PostgreSQL

1. **Open pgAdmin** and connect to your local PostgreSQL server.

2. **Create the database** — open Query Tool and run:
   `backend/scripts/setup_pgadmin.sql`

3. **Configure `backend/.env`** — comment out SQLite and set PostgreSQL:
   ```env
   # DATABASE_URL=sqlite:///./mandi_prices.db
   DATABASE_URL=postgresql://postgres:YOUR_PGADMIN_PASSWORD@localhost:5432/mandi_prices
   ```
   Replace `YOUR_PGADMIN_PASSWORD` with your pgAdmin/PostgreSQL password.

4. **Test the connection:**
   ```bash
   cd backend
   venv\Scripts\python scripts\test_db_connection.py
   ```

5. **Start the backend** with `start-backend.bat` or:
   ```bash
   venv\Scripts\uvicorn app.main:app --port 8000 --reload
   ```

6. **Verify** — open http://localhost:8000/health  
   You should see `"database": "connected"`.

Tables are created automatically on first startup. Sample mandi prices are seeded if the database is empty.

### Option 4: Manual Local Development

**Backend:**

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env

# Start PostgreSQL (or use Docker for DB only)
docker-compose up -d postgres redis

# Run the API
uvicorn app.main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/states` | List available states |
| GET | `/api/v1/districts?state={state}` | Districts for a state |
| GET | `/api/v1/markets?district={district}` | Markets for a district |
| GET | `/api/v1/commodities` | List commodities |
| GET | `/api/v1/today-prices` | Today's prices (supports filters & pagination) |
| GET | `/api/v1/today-prices/{id}` | Single price record |
| GET | `/health` | Health check |

### Query Parameters for `/today-prices`

- `state`, `district`, `market`, `commodity`, `search`
- `page` (default: 1), `page_size` (default: 20, max: 100)

## Database Tables

- `states` — Indian states
- `districts` — Districts linked to states
- `markets` — APMC markets linked to districts
- `commodities` — Agricultural commodities
- `market_prices` — Daily price records
- `price_cache` — API response cache (30 min TTL)

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `DATA_GOV_API_KEY` | data.gov.in API key |
| `CACHE_TTL_SECONDS` | Cache duration (default: 1800) |
| `CORS_ORIGINS` | Allowed frontend origins |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL |

## Future Modules (Architecture Ready)

The modular structure supports easy addition of:

- Weather Forecast & Rain Alerts
- Government Schemes
- Crop Recommendation & AI Disease Detection
- Expense Tracker & Farm Management
- Market Trends & Notifications
- AI Chatbot & Multi-language Support
- Admin Dashboard & Farmer Profile

## License

MIT
