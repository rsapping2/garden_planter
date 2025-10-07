# 🌱 Garden Planner

A comprehensive garden planning application with interactive layouts, task scheduling, and plant management.

## ✨ Features

- **Interactive Garden Layout**: Drag and drop plants to design your garden
- **Task Scheduling**: Create and manage planting, watering, and harvest tasks
- **Plant Database**: Browse 30+ plants with growing information
- **USDA Zone Support**: Automatic zone detection and recommendations
- **Local Storage**: Your designs persist between sessions
- **Mock Notifications**: Preview notification system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- Firebase CLI (for emulators)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd garden_planter

# Install dependencies
npm install

# Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# Copy environment file and configure Firebase
cp env.development.example .env.local
# Edit .env.local with your Firebase project credentials if needed
```

### Development

```bash
# Start with Firebase emulators (recommended - simulates production)
npm start

# Or start with localStorage only (faster startup)
npm run start:local

# Or start components separately:
npm run emulators        # Firebase emulators only
npm run start:frontend   # React app only
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **Firebase UI**: http://localhost:4000 (when using emulators)

### Development Modes

#### Firebase Emulators (Default)
- **Command**: `npm start`
- **Ports**: Frontend (3000), Auth (9099), Firestore (8080), Firebase UI (4000)
- **Benefits**: Simulates production environment, persistent data, real Firebase features
- **Use when**: Testing Firebase features, preparing for production

#### localStorage Mode  
- **Command**: `npm run start:local`
- **Ports**: Frontend (3000) only
- **Benefits**: Faster startup, no dependencies, works offline
- **Use when**: Quick development, working on UI only

### Testing

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only
```

### Building

```bash
# Build frontend for production
npm run build
```

## 📁 Project Structure

```
garden_planter/
├── src/                    # Frontend React application
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── contexts/          # React Context providers
│   ├── services/          # API and external services
│   ├── utils/             # Utility functions
│   └── __tests__/         # Frontend tests
├── backend/               # Node.js backend (for future use)
├── tests/                 # E2E and smoke tests (Playwright)
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🔧 Environment Variables

Copy `env.development.example` to `.env.local` and customize:

```bash
# Firebase Configuration (for emulators)
REACT_APP_FIREBASE_API_KEY=demo-key
REACT_APP_FIREBASE_PROJECT_ID=demo-project

# Development mode
REACT_APP_USE_EMULATORS=true
REACT_APP_ENV=development

# Force localStorage mode (optional)
# REACT_APP_USE_LOCALSTORAGE=true
```

## 📚 Documentation

### Local Development
- This README - Local development setup and daily workflow

### Deployment Guides
- **[Cloudflare Deployment](docs/CLOUDFLARE_DEPLOYMENT.md)** - Deploy frontend to Cloudflare Pages
- **[Firebase Setup](docs/FIREBASE_SETUP.md)** - Configure Firebase for production
- **[Full Stack Deployment](docs/DEPLOYMENT_GUIDE.md)** - Complete production setup

### Additional Guides
- **[Email Setup](docs/EMAIL_SETUP.md)** - Configure email notifications
- **[GitHub CI/CD](docs/GITHUB_CI_SETUP.md)** - Automated testing and deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Need help with deployment?** Check the [docs/](docs/) folder for detailed deployment guides.