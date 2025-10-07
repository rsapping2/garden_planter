# Test Directory Structure

This directory contains all test files organized by test type:

## Directory Structure

- `unit/` - Unit tests for individual functions and components
- `integration/` - Integration tests for API endpoints and service interactions  
- `e2e/` - End-to-end tests using Playwright (planned)
- `ui/` - UI component and interaction tests using Playwright (planned)
- `smoke/` - Smoke tests for critical user journeys (planned)

## Current Test Setup

### Frontend Tests
- Located in `src/__tests__/` (follows React conventions)
- Uses Jest + React Testing Library
- Run with: `npm test`

### Backend Tests  
- Located in `backend/tests/`
- Uses Jest + Supertest
- Run with: `cd backend && npm test`

## Planned Test Setup

### Playwright Tests (Future)
The `e2e/`, `ui/`, and `smoke/` directories are placeholders for future Playwright test implementation.

Planned structure:
```
tests/
├── e2e/           # Full user journey tests
├── ui/            # Component interaction tests  
├── smoke/         # Critical path validation
├── fixtures/      # Test data and setup
├── utils/         # Test utilities and helpers
└── playwright.config.js
```

## Running Tests

```bash
# Frontend tests
npm test

# Backend tests  
cd backend && npm test

# All tests (future)
npm run test:all

# Playwright tests (future)
npx playwright test
```
