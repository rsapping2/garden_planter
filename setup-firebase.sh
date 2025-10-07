#!/bin/bash

echo "🔥 Firebase Setup for Garden Planner"
echo "===================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI already installed"
fi

# Check if Firebase packages are installed
if [ ! -d "node_modules/firebase" ]; then
    echo "📦 Installing Firebase packages..."
    npm install firebase
else
    echo "✅ Firebase packages already installed"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Run: firebase login"
echo "2. Run: firebase init"
echo "   - Select: Authentication, Firestore Database"
echo "   - Use existing project or create new one"
echo "3. Copy src/config/firebase.js.example to src/config/firebase.js"
echo "4. Add your Firebase config from the Firebase Console"
echo "5. Deploy to Vercel: vercel --prod"
echo ""
echo "📚 Documentation:"
echo "- Firebase Console: https://console.firebase.google.com"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo ""
echo "💰 Cost: $0.00 (completely free!)"
echo ""
echo "🎉 Your app will be hosted for FREE with:"
echo "   ✅ Authentication & Email Verification"
echo "   ✅ Real-time Database"
echo "   ✅ Global CDN"
echo "   ✅ Custom Domain Support"
