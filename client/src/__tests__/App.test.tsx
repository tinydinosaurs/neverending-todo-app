import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import App from '../App';
import { AppContent } from '../App';
import { system } from '../components/theme';
import { MockTaskProvider } from './contexts/MockTaskProvider';

// Mock the components to avoid testing their internal logic
jest.mock('../components/TaskList', () => ({
	TaskList: () => <div data-testid="task-list">TaskList Component</div>,
}));

jest.mock('../components/TaskDialog', () => ({
	TaskDialogButton: () => (
		<button data-testid="task-dialog-button">Add Task</button>
	),
	NewTaskDialog: {
		Viewport: () => (
			<div data-testid="task-dialog-viewport">Dialog Viewport</div>
		),
	},
}));

jest.mock('../components/Toast', () => ({
	Toast: ({ message }: { message: string }) => (
		<div data-testid="toast">{message}</div>
	),
}));

const renderWithChakra = (ui: React.ReactElement) =>
	render(<ChakraProvider value={system}>{ui}</ChakraProvider>);

describe('App', () => {
	it('renders the main app structure', async () => {
		renderWithChakra(
			<MockTaskProvider>
				<App />
			</MockTaskProvider>
		);

		// Wait for main heading to appear
		await screen.findByRole('heading', { name: /taskflow/i });

		// Check main content area
		expect(screen.getByRole('main')).toBeInTheDocument();

		// Check that components are rendered
		expect(screen.getByTestId('task-list')).toBeInTheDocument();
		expect(screen.getByTestId('task-dialog-button')).toBeInTheDocument();
		expect(screen.getByTestId('task-dialog-viewport')).toBeInTheDocument();
	});

	it('has proper accessibility structure', () => {
		renderWithChakra(
			<MockTaskProvider>
				<AppContent />
			</MockTaskProvider>
		);

		// Check skip link
		const skipLink = screen.getByRole('link', {
			name: /skip to main content/i,
		});
		expect(skipLink).toBeInTheDocument();
		expect(skipLink).toHaveAttribute('href', '#main-content');

		// Check header
		expect(screen.getByRole('banner')).toBeInTheDocument();

		// Check main content
		const mainContent = screen.getByRole('main');
		expect(mainContent).toHaveAttribute('id', 'main-content');
		expect(mainContent).toHaveAttribute('tabIndex', '-1');
	});

	it('renders toast when toast state is present', async () => {
		renderWithChakra(
			<MockTaskProvider value={{ toast: 'Test Toast' }}>
				<AppContent />
			</MockTaskProvider>
		);
		expect(screen.getByTestId('toast')).toBeInTheDocument();
	});

	it('does not render toast when toast state is null', () => {
		renderWithChakra(
			<MockTaskProvider value={{ toast: null }}>
				<AppContent />
			</MockTaskProvider>
		);

		expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
	});

	it('has proper semantic HTML structure', () => {
		renderWithChakra(
			<MockTaskProvider>
				<AppContent />
			</MockTaskProvider>
		);

		// Check container
		expect(screen.getByRole('main')).toBeInTheDocument();

		// Check header structure
		const header = screen.getByRole('banner');
		expect(header).toBeInTheDocument();

		// Check heading hierarchy
		const h1 = screen.getByRole('heading', { level: 1 });
		expect(h1).toHaveTextContent('TaskFlow');
	});
});
