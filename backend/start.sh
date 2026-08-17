#!/usr/bin/env bash
# Render start script — MUST bind to $PORT
set -euo pipefail
echo "Starting Today's Mandi Prices API on port ${PORT:-8000}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
