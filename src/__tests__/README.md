# Frontend Tests

This directory contains all frontend tests following React Testing Library conventions.

## Directory Structure

- `unit/` - Component unit tests and utility function tests
- `integration/` - Frontend integration tests for user workflows

## Testing Setup

Tests use:
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers

## Running Tests

```bash
# Run all frontend tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test types
npm run test:unit
npm run test:integration

# Run with coverage
npm test -- --coverage
```

## Test File Naming

- `*.test.js` - Standard test files
- `*.test.jsx` - React component test files
- `setup.js` - Test configuration and setup

## Example Test Structure

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
  
  test('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

## Current Test Status

- ✅ Test environment configured
- ✅ React Testing Library setup
- ⏳ Component tests needed
- ⏳ Integration tests needed
- ⏳ Context provider tests needed
