@echo off
title AI-Powered Sports Management Platform Launcher
echo ========================================================
echo   AI-POWERED SPORTS MANAGEMENT PLATFORM
echo ========================================================
echo.
echo [1/2] Starting Python FastAPI ML Backend on http://127.0.0.1:8000 ...
start "Sports AI Backend (8000)" start_backend.bat

echo [2/2] Starting React Vite Frontend on http://127.0.0.1:5173 ...
start "Sports AI Frontend (5173)" start_frontend.bat

echo.
echo Launching browser in 4 seconds...
timeout /t 4 /nobreak >nul
start http://127.0.0.1:5173/
echo All systems running! Press any key to exit this launcher window.
pause >nul
