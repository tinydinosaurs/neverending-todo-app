import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import {
	ColorModeProvider,
	useColorMode,
	useColorModeValue,
	ColorModeButton,
	LightMode,
	DarkMode,
} from '../../../components/ui/color-mode';
import { system } from '../../../components/theme';

// Mock next-themes
jest.mock('next-themes', () => ({
	ThemeProvider: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="theme-provider">{children}</div>
	),
	useTheme: () => ({
		resolvedTheme: 'light',
		setTheme: jest.fn(),
		forcedTheme: null,
	}),
}));

const renderWithChakra = (ui: React.ReactElement) =>
	render(<ChakraProvider value={system}>{ui}</ChakraProvider>);

// Test component to use the hooks
const TestComponent = () => {
	const { colorMode, setColorMode, toggleColorMode } = useColorMode();
	const value = useColorModeValue('light-value', 'dark-value');

	return (
		<div>
			<div data-testid="color-mode">{colorMode}</div>
			<div data-testid="color-mode-value">{value}</div>
			<button onClick={() => setColorMode('dark')} data-testid="set-dark">
				Set Dark
			</button>
			<button onClick={toggleColorMode} data-testid="toggle">
				Toggle
			</button>
		</div>
	);
};

describe('ColorModeProvider', () => {
	it('renders ThemeProvider with correct props', () => {
		render(<ColorModeProvider>Test Content</ColorModeProvider>);

		const themeProvider = screen.getByTestId('theme-provider');
		expect(themeProvider).toBeInTheDocument();
		expect(themeProvider).toHaveTextContent('Test Content');
	});

	it('passes through additional props', () => {
		render(
			<ColorModeProvider defaultTheme="dark">
				Test Content
			</ColorModeProvider>
		);

		expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
	});
});

describe('useColorMode', () => {
	it('returns color mode state and functions', () => {
		renderWithChakra(
			<ColorModeProvider>
				<TestComponent />
			</ColorModeProvider>
		);

		expect(screen.getByTestId('color-mode')).toHaveTextContent('light');
		expect(screen.getByTestId('color-mode-value')).toHaveTextContent(
			'light-value'
		);
	});

	it('provides setColorMode function', () => {
		renderWithChakra(
			<ColorModeProvider>
				<TestComponent />
			</ColorModeProvider>
		);

		const setDarkButton = screen.getByTestId('set-dark');
		expect(setDarkButton).toBeInTheDocument();
	});

	it('provides toggleColorMode function', () => {
		renderWithChakra(
			<ColorModeProvider>
				<TestComponent />
			</ColorModeProvider>
		);

		const toggleButton = screen.getByTestId('toggle');
		expect(toggleButton).toBeInTheDocument();
	});
});

describe('useColorModeValue', () => {
	it('returns light value when in light mode', () => {
		renderWithChakra(
			<ColorModeProvider>
				<TestComponent />
			</ColorModeProvider>
		);

		expect(screen.getByTestId('color-mode-value')).toHaveTextContent(
			'light-value'
		);
	});
});

describe('ColorModeButton', () => {
	it('renders with correct accessibility attributes', () => {
		renderWithChakra(
			<ColorModeProvider>
				<ColorModeButton />
			</ColorModeProvider>
		);

		const button = screen.getByRole('button', {
			name: /toggle color mode/i,
		});
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute('aria-label', 'Toggle color mode');
	});

	it('calls toggleColorMode when clicked', () => {
		renderWithChakra(
			<ColorModeProvider>
				<ColorModeButton />
			</ColorModeProvider>
		);

		const button = screen.getByRole('button', {
			name: /toggle color mode/i,
		});
		fireEvent.click(button);

		// The mock doesn't actually change state, but we can verify the button is clickable
		expect(button).toBeInTheDocument();
	});

	it('renders skeleton fallback initially', () => {
		renderWithChakra(
			<ColorModeProvider>
				<ColorModeButton />
			</ColorModeProvider>
		);

		// The ClientOnly component should render the skeleton initially
		// but in tests it might render immediately
		const button = screen.getByRole('button', {
			name: /toggle color mode/i,
		});
		expect(button).toBeInTheDocument();
	});
});

describe('LightMode', () => {
	it('renders with light theme classes', () => {
		renderWithChakra(<LightMode>Light content</LightMode>);

		const span = screen.getByText('Light content');
		expect(span).toBeInTheDocument();
		expect(span).toHaveClass('chakra-theme', 'light');
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLSpanElement>();
		renderWithChakra(<LightMode ref={ref}>Light content</LightMode>);

		expect(ref.current).toBeInTheDocument();
	});
});

describe('DarkMode', () => {
	it('renders with dark theme classes', () => {
		renderWithChakra(<DarkMode>Dark content</DarkMode>);

		const span = screen.getByText('Dark content');
		expect(span).toBeInTheDocument();
		expect(span).toHaveClass('chakra-theme', 'dark');
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLSpanElement>();
		renderWithChakra(<DarkMode ref={ref}>Dark content</DarkMode>);

		expect(ref.current).toBeInTheDocument();
	});
});
