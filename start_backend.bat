@echo off
title Sports AI Backend Service
echo ========================================================
echo   SPORTS PLATFORM - Starting FastAPI ML Backend (8000)
echo ========================================================
echo.
echo Server URL: http://127.0.0.1:8000/
echo OpenAPI Docs: http://127.0.0.1:8000/docs
echo.
py -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
pause

