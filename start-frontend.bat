@echo off
title Today's Mandi Prices - Frontend
echo Starting frontend on http://localhost:5173
echo.

cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

call npm run dev
pause
