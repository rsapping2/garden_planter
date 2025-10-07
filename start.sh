#!/bin/bash

# Garden Planter Startup Script
echo "🌱 Starting Garden Planter..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies (if backend directory exists)
if [ -d "backend" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "⚙️ Creating .env.local file..."
    cat > .env.local << EOF
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Firebase (if using)
# REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
# REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# REACT_APP_FIREBASE_PROJECT_ID=your_project_id
# REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
# REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
# REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef

# Supabase (if using)
# REACT_APP_SUPABASE_URL=your_supabase_url
# REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF
    echo "✅ Created .env.local file. Please update with your API keys."
fi

# Create backend .env file if it doesn't exist
if [ -d "backend" ] && [ ! -f "backend/.env" ]; then
    echo "⚙️ Creating backend .env file..."
    cp backend/env.example backend/.env
    echo "✅ Created backend .env file. Please update with your configuration."
fi

echo ""
echo "🎉 Setup complete! You can now start the application:"
echo ""
echo "Frontend only:"
echo "  npm start"
echo ""
echo "With backend (in separate terminals):"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: npm start"
echo ""
echo "📚 See README.md for detailed setup instructions"
echo "📋 See OPS_SETUP.md for deployment options"
echo ""
echo "Happy Gardening! 🌱"

