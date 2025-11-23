#!/bin/bash

# Autotask Web Frontend Startup Script
# This script starts both the backend API server and frontend development server

echo "======================================"
echo "Starting Autotask Web Application"
echo "======================================"
echo ""

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo "⚠️  WARNING: backend/.env not found!"
    echo "Please copy backend/.env.example to backend/.env and configure your Autotask credentials"
    echo ""
    echo "Run: cp backend/.env.example backend/.env"
    echo "Then edit backend/.env with your credentials"
    exit 1
fi

# Check if node_modules exists in frontend
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    echo "✅ Frontend dependencies installed"
    echo ""
fi

# Check if Python dependencies are installed
echo "🔍 Checking Python dependencies..."
python3 -c "import flask, flask_cors, httpx" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📦 Installing backend dependencies..."
    pip3 install -r backend/requirements.txt
    echo "✅ Backend dependencies installed"
    echo ""
fi

# Start backend server in background
echo "🚀 Starting backend API server on http://localhost:5000..."
cd backend
python3 api_server.py &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend server started (PID: $BACKEND_PID)"
else
    echo "❌ Failed to start backend server"
    exit 1
fi

echo ""

# Start frontend server
echo "🚀 Starting frontend dev server on http://localhost:3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "======================================"
echo "✅ Application Started Successfully!"
echo "======================================"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Register cleanup function
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
