#!/usr/bin/env bash
# Render build: install backend deps, build React frontend, copy into backend/static
set -euo pipefail

pip install -r backend/requirements.txt

cd frontend
npm ci
npm run build

cd ..
rm -rf backend/static
mkdir -p backend/static
cp -r frontend/dist/* backend/static/

echo "Build complete — static files in backend/static"
