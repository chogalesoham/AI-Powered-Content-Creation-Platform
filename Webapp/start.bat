@echo off
echo ========================================
echo AI-Powered Content Creation Platform
echo ========================================
echo.

echo Starting backend server...
cd backend
start "Backend Server" cmd /k "npm run dev"
cd ..

echo Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo Starting frontend development server...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo Servers are starting up!
echo ========================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Demo Account:
echo Email:    demo@contentai.com
echo Password: demo123
echo.
echo Press any key to run setup test...
pause > nul

echo.
echo Running setup validation...
node test-setup.js

echo.
echo Setup complete! Visit http://localhost:5173 to get started.
pause
