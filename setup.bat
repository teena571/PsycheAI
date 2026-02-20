@echo off
echo ========================================
echo PsycheAI Setup Script
echo ========================================
echo.

echo [1/3] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/3] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo [3/3] Setup Complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Set up your .env files (see QUICK_START.md)
echo 2. Set up your database
echo 3. Run: npm run generate (in backend folder)
echo 4. Run: npm run migrate (in backend folder)
echo 5. Start backend: npm run dev (in backend folder)
echo 6. Start frontend: npm run dev (in frontend folder)
echo.
echo See QUICK_START.md for detailed instructions
echo ========================================
pause
