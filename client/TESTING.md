# Testing Guide for TaskFlow

This document outlines the testing strategy and setup for the TaskFlow application.

## Testing Strategy

We use a multi-layered testing approach:

1. **Unit Tests (Jest)** - For utility functions, helpers, and pure logic
2. **Component Tests (Cypress)** - For React component behavior and interactions
3. **E2E Tests (Cypress)** - For full user workflows and integration

## Test Types

### Unit Tests (Jest)

**Purpose**: Test utility functions, helpers, and pure logic
**Location**: `src/**/__tests__/*.test.ts` or `src/**/*.test.ts`
**Run**: `npm test`

**Examples**:

-   `formatEnum` utility function
-   `apiRequest` helper function
-   Constants and type definitions

**What to test**:

-   Input/output transformations
-   Error handling
-   Edge cases
-   Pure functions

### Component Tests (Cypress)

**Purpose**: Test React component behavior in isolation
**Location**: `cypress/component/*.cy.tsx`
**Run**: `npm run test:component`

**Examples**:

-   `TaskForm.cy.tsx` - Form validation and submission
-   `TaskFilters.cy.tsx` - Filter interactions and state

**What to test**:

-   Component rendering
-   User interactions
-   Props and callbacks
-   Accessibility features
-   Form validation

### E2E Tests (Cypress)

**Purpose**: Test full user workflows and integration
**Location**: `cypress/e2e/*.cy.ts`
**Run**: `npm run test:e2e`

**Examples**:

-   `task-management.cy.ts` - Complete task management workflow

**What to test**:

-   User journeys
-   Integration between components
-   API interactions
-   Accessibility compliance
-   Cross-browser compatibility

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Component Tests

```bash
# Run component tests headlessly
npm run test:component

# Open Cypress component test runner
npm run test:component:open
```

### E2E Tests

```bash
# Run E2E tests headlessly
npm run test:e2e

# Open Cypress E2E test runner
npm run test:e2e:open
```

## Test Structure

### Unit Test Structure

```typescript
import { functionToTest } from '../path/to/function';

describe('Function Name', () => {
	beforeEach(() => {
		// Setup
	});

	it('should do something specific', () => {
		// Arrange
		const input = 'test';

		// Act
		const result = functionToTest(input);

		// Assert
		expect(result).toBe('expected');
	});
});
```

### Component Test Structure

```typescript
import React from 'react';
import { ComponentName } from '../../src/components/ComponentName';

describe('ComponentName', () => {
	const mockProps = {
		// Mock props
	};

	beforeEach(() => {
		cy.mount(<ComponentName {...mockProps} />);
	});

	it('should render correctly', () => {
		// Test rendering
	});

	it('should handle user interactions', () => {
		// Test interactions
	});
});
```

### E2E Test Structure

```typescript
describe('Feature Name', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
	});

	it('should complete user workflow', () => {
		// Test complete workflow
	});
});
```

## Testing Best Practices

### Unit Tests

-   Test one thing at a time
-   Use descriptive test names
-   Test edge cases and error conditions
-   Mock external dependencies
-   Keep tests fast and isolated

### Component Tests

-   Test component behavior, not implementation
-   Focus on user interactions
-   Test accessibility features
-   Use data-testid attributes sparingly
-   Test error states and loading states

### E2E Tests

-   Test complete user workflows
-   Don't test implementation details
-   Focus on business value
-   Keep tests independent
-   Use realistic data

## Accessibility Testing

All tests should include accessibility checks:

### Component Tests

-   Check ARIA attributes
-   Verify keyboard navigation
-   Test screen reader announcements
-   Validate semantic HTML

### E2E Tests

-   Test keyboard-only navigation
-   Verify skip links work
-   Check focus management
-   Test with screen readers

## Mocking Strategy

### API Calls

-   Mock fetch in unit tests
-   Use cy.intercept() in E2E tests
-   Mock error responses
-   Test loading states

### External Dependencies

-   Mock browser APIs
-   Mock timers for async operations
-   Mock localStorage/sessionStorage

## Continuous Integration

Tests are configured to run in CI/CD:

1. Unit tests run on every commit
2. Component tests run on pull requests
3. E2E tests run on main branch
4. Coverage reports are generated

## Debugging Tests

### Unit Tests

-   Use `console.log` or debugger
-   Run specific test: `npm test -- --testNamePattern="test name"`

### Cypress Tests

-   Use `cy.debug()` or `cy.pause()`
-   Open Cypress runner for interactive debugging
-   Check Cypress logs for detailed error messages

## Common Issues

### Cypress Component Tests

-   Ensure Vite is configured correctly
-   Check that all dependencies are imported
-   Verify component providers are set up

### Jest Tests

-   Check TypeScript configuration
-   Ensure mocks are properly typed
-   Verify test environment setup

## Adding New Tests

1. **Unit Tests**: Add to existing `__tests__` folder or create new one
2. **Component Tests**: Create new `.cy.tsx` file in `cypress/component/`
3. **E2E Tests**: Create new `.cy.ts` file in `cypress/e2e/`

Follow the existing patterns and naming conventions.
