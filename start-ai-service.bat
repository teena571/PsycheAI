@echo off
echo ========================================
echo   PsycheAI - AI Service Startup
echo ========================================
echo.

cd ai-service

echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.9+ from python.org
    pause
    exit /b 1
)

echo.
echo Checking virtual environment...
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
)

echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Checking dependencies...
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    echo This may take 5-10 minutes on first run...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
) else (
    echo Dependencies already installed.
)

echo.
echo Checking environment file...
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo Environment file created!
)

echo.
echo ========================================
echo   Starting AI Service...
echo ========================================
echo.
echo Service will be available at:
echo   http://localhost:8000
echo.
echo API Documentation:
echo   http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the service
echo.
echo ========================================
echo.

python main.py

pause
