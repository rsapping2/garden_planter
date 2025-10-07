#!/bin/bash

echo "🌱 Garden Planner - Local Setup Script"
echo "======================================"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI found"
fi

# Copy environment files if they don't exist
if [ ! -f .env.development ]; then
    echo "📝 Creating .env.development..."
    cp env.development.example .env.development
    echo "✅ Created .env.development"
else
    echo "✅ .env.development already exists"
fi

if [ ! -f .env.production ]; then
    echo "📝 Creating .env.production..."
    cp env.production.example .env.production
    echo "✅ Created .env.production"
else
    echo "✅ .env.production already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Run 'firebase login' to authenticate with Firebase"
echo "2. Run 'firebase init' to set up your Firebase project"
echo "3. Run 'npm run dev' to start development with emulators"
echo ""
echo "🔗 Useful URLs:"
echo "   App: http://localhost:3000"
echo "   Firebase Emulator UI: http://localhost:4000"
echo ""
echo "Happy gardening! 🌱"


