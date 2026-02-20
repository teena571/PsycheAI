@echo off
echo ========================================
echo   Starting PsycheAI Platform
echo ========================================
echo.

echo This will open 3 terminal windows:
echo 1. AI Service (Python)
echo 2. Backend (Node.js)
echo 3. Frontend (React)
echo.
echo Press any key to continue...
pause > nul

echo.
echo Starting AI Service...
start "PsycheAI - AI Service" cmd /k "cd ai-service && venv\Scripts\activate && python main.py"

timeout /t 3 > nul

echo Starting Backend...
start "PsycheAI - Backend" cmd /k "cd backend && npm start"

timeout /t 3 > nul

echo Starting Frontend...
start "PsycheAI - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   All services starting...
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo AI Service: http://localhost:8000
echo.
echo Press any key to exit this window...
pause > nul
