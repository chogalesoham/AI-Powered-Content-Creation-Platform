#!/bin/bash

echo "========================================"
echo "AI-Powered Content Creation Platform"
echo "========================================"
echo

echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "Waiting for backend to initialize..."
sleep 3

echo "Starting frontend development server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo
echo "========================================"
echo "Servers are starting up!"
echo "========================================"
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo
echo "Demo Account:"
echo "Email:    demo@contentai.com"
echo "Password: demo123"
echo

# Wait a bit more for servers to fully start
sleep 5

echo "Running setup validation..."
node test-setup.js

echo
echo "Setup complete! Visit http://localhost:5173 to get started."
echo
echo "To stop the servers, press Ctrl+C"

# Keep script running
wait
