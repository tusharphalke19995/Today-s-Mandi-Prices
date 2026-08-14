@echo off
title Today's Mandi Prices - Backend API
echo Starting backend on http://localhost:8000
echo API docs: http://localhost:8000/docs
echo.

cd /d "%~dp0backend"

if not exist "venv\Scripts\uvicorn.exe" (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\pip install -r requirements.txt
)

call venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 8000 --reload
pause
