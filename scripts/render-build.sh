#!/usr/bin/env bash
# Render build: install backend deps, build React frontend, copy into backend/static
set -euo pipefail

pip install -r backend/requirements.txt

cd frontend
npm ci
VITE_API_BASE_URL=/api/v1 npm run build:render

cd ..
rm -rf backend/static
mkdir -p backend/static
cp -r frontend/dist/* backend/static/

echo "Build complete — static files in backend/static"
