@echo off
echo ========================================
echo   PsycheAI AI Service - Setup
echo ========================================
echo.

echo Step 1: Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)
echo Virtual environment created!

echo.
echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Step 3: Installing dependencies...
echo This may take 5-10 minutes...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 4: Creating environment file...
if not exist ".env" (
    copy .env.example .env
    echo Environment file created!
) else (
    echo Environment file already exists.
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To start the AI service:
echo   1. Activate virtual environment: venv\Scripts\activate
echo   2. Run the service: python main.py
echo.
echo To test crisis detection:
echo   1. Start the service in one terminal
echo   2. In another terminal: python test_crisis_detection.py
echo.
pause
