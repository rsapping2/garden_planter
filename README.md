# Garden Planner

A modern **React + Firebase** garden planning tool that helps you design, schedule, and track plant growth. Whether you’re a home gardener, hobbyist, or community organizer, Garden Planner makes it easy to bring your garden to life.

---

## Live Demo
--> [garden-planter.pages.dev](https://garden-planter.pages.dev) 

---

## Features
- **Interactive Garden Layout** – Drag and drop plants to design your garden
- **Task Scheduling** – Plan and track planting, watering, and harvest tasks
- **Plant Database** – Browse 30+ plants with detailed growing information
- **USDA Zone Detection** – Automatic hardiness zone and planting recommendations
- **Cloud Storage Support** – Save your garden designs between sessions
- **Notification Preview** – Simulated reminders for upcoming tasks

---

## Tech Stack

**Frontend:** React, Context API, TailwindCSS  
**Backend:** Firebase (Auth, Firestore, Hosting) with Local Emulators  
**CI/CD:** GitHub Actions  
**Hosting:** Cloudflare Pages  
**Testing:** Jest (Unit & integration) + Playwright (UI & Automation)
**Package Management:** npm  

--

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- Firebase CLI (for emulators)

### Installation

```bash
# Clone the repository
git clone git@github.com:rsapping2/garden_planter.git
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

# Or start components separately:
npm run emulators        # Firebase emulators only
npm run start:frontend   # React app only
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **Firebase UI**: http://localhost:4000 (when using emulators)

### Code Quality

#### Linting
```bash
# Run ESLint on all files
npx eslint .

# Run ESLint with auto-fix
npx eslint . --fix

# Run ESLint on specific files/directories
npx eslint src/
npx eslint src/components/
```

### Development Modes

#### Firebase Emulators
- **Command**: `npm start`
- **Ports**: Frontend (3000), Auth (9099), Firestore (8080), Firebase UI (4000)
- **Benefits**: Simulates production environment, persistent data, real Firebase features
- **Use when**: Testing Firebase features, preparing for production

### Testing

#### Frontend Tests
```bash
# Run tests in WATCH mode (continuous, for development)
npm test

# Run tests ONCE and exit
npm run test:ci

# Run tests with coverage report
npm run test:coverage

# Run specific test types
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only
```

**Note**: 
- `npm test` runs in **watch mode** - it keeps running and re-runs tests when files change. Press `q` to quit.
- `npm run test:ci` runs tests **once and exits** - use this for quick verification or CI/CD pipelines.

#### Backend Tests
```bash
# Navigate to backend directory
cd backend

# Run all backend tests
npm test

# Run with coverage report
npm run test:coverage

# Run specific test types
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only

# Watch mode for development
npm run test:watch
```

**Note**: Backend tests are currently skipped as the API implementation is pending. See `backend/tests/STATUS.md` for details.

#### End-to-End (E2E) Tests
```bash
# Install Playwright browsers (first time only)
npm run test:e2e:install

# Run E2E tests against local development
npm run test:e2e

# Run E2E tests with UI (interactive mode)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Run E2E tests against production
npm run test:e2e:prod
```

**E2E Test Configuration:**
- **Local Testing**: Tests run against `http://localhost:3000` (default)
- **Production Testing**: Set `PLAYWRIGHT_BASE_URL` environment variable
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Reports**: HTML reports generated in `playwright-report/`

### Building

```bash
# Build frontend for production
npm run build
```

### Deploying Firestore Rules

**Important**: The Firestore security rules must be deployed before production use:

```bash
# Deploy Firestore rules only
firebase deploy --only firestore:rules

# Deploy everything (rules + hosting + functions)
firebase deploy
```

See `FIRESTORE_RULES_VALIDATION.md` for details on the validation rules.

## Project Structure

```
garden_planter/
├── src/                           # Frontend React application
│   ├── components/                # Reusable React components (modals, grid, cards)
│   ├── pages/                     # Page components (Dashboard, PlantLibrary, etc.)
│   ├── contexts/                  # React Context providers (Auth, Garden)
│   ├── services/                  # External services (email, notifications, plants)
│   ├── utils/                     # Utility functions (dates, USDA zones)
│   ├── data/                      # Static data (plant information)
│   ├── config/                    # Configuration (Firebase, environment)
│   ├── __tests__/                 # Frontend unit and integration tests
├── backend/                       # Backend tests and API (Node.js)
├── tests/                         # E2E, smoke, and UI tests (Playwright)
├── public/                        # Static assets (HTML, favicon, manifest)
├── firebase.json                  # Firebase configuration
├── tailwind.config.js             # TailwindCSS configuration
└── package.json                   # Frontend dependencies and scripts
```

## Environment Variables

Copy `env.development.example` to `.env.local` and customize:

```bash
# Firebase Configuration (for emulators)
REACT_APP_FIREBASE_API_KEY=demo-key
REACT_APP_FIREBASE_PROJECT_ID=demo-project

# Development mode
REACT_APP_USE_EMULATORS=true
REACT_APP_ENV=development
```

## GitHub Actions & CI/CD

### E2E Tests in GitHub Actions

The project includes Playwright E2E tests that run in GitHub Actions:

**Local vs Production Testing:**
- **Default**: Tests run against local development server
- **Production**: Set `PLAYWRIGHT_BASE_URL` environment variable
- **CI/CD**: Automatically runs against local server in GitHub Actions

**GitHub Actions Workflow:**
```yaml
# .github/workflows/e2e-tests.yml
- name: Install Playwright Browsers
  run: npm run test:e2e:install

- name: Run E2E Tests
  run: npm run test:e2e

- name: Upload Test Results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

**Production Testing Setup:**
```bash
# Test against production
PLAYWRIGHT_BASE_URL=https://your-app.vercel.app npm run test:e2e

# Or use the npm script
npm run test:e2e:prod
```

## Documentation

### Local Development
- This README - Local development setup and daily workflow

### Deployment Guides
- **[Cloudflare Deployment](docs/CLOUDFLARE_DEPLOYMENT.md)** - Deploy frontend to Cloudflare Pages
- **[Firebase Setup](docs/FIREBASE_SETUP.md)** - Configure Firebase for production
- **[Full Stack Deployment](docs/DEPLOYMENT_GUIDE.md)** - Complete production setup

### Additional Guides
- **[Email Setup](docs/EMAIL_SETUP.md)** - Configure email notifications
- **[GitHub CI/CD](docs/GITHUB_CI_SETUP.md)** - Automated testing and deployment

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.
