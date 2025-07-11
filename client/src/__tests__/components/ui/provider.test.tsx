import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from '../../../components/ui/provider';

// Mock the color-mode component
jest.mock('../../../components/ui/color-mode', () => ({
	ColorModeProvider: ({
		children,
		...props
	}: {
		children: React.ReactNode;
	}) => (
		<div
			data-testid="color-mode-provider"
			{...Object.fromEntries(
				Object.entries(props).map(([k, v]) => [
					k,
					typeof v === 'boolean' ? String(v) : v,
				])
			)}
		>
			{children}
		</div>
	),
}));

describe('Provider', () => {
	it('renders ChakraProvider and ColorModeProvider', () => {
		render(
			<Provider>
				<div>Test content</div>
			</Provider>
		);

		expect(screen.getByTestId('color-mode-provider')).toBeInTheDocument();
		expect(screen.getByText('Test content')).toBeInTheDocument();
	});

	it('passes props to ColorModeProvider', () => {
		render(
			<Provider defaultTheme="dark">
				<div>Test content</div>
			</Provider>
		);

		const colorModeProvider = screen.getByTestId('color-mode-provider');
		expect(colorModeProvider).toHaveAttribute('defaultTheme', 'dark');
	});

	it('renders children correctly', () => {
		render(
			<Provider>
				<div data-testid="child-content">Child content</div>
			</Provider>
		);

		expect(screen.getByTestId('child-content')).toBeInTheDocument();
		expect(screen.getByText('Child content')).toBeInTheDocument();
	});

	it('handles multiple children', () => {
		render(
			<Provider>
				<div data-testid="child-1">Child 1</div>
				<div data-testid="child-2">Child 2</div>
			</Provider>
		);

		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
		expect(screen.getByText('Child 1')).toBeInTheDocument();
		expect(screen.getByText('Child 2')).toBeInTheDocument();
	});

	it('passes through all ColorModeProviderProps', () => {
		const props = {
			defaultTheme: 'dark' as const,
			enableSystem: false,
			disableTransitionOnChange: true,
		};

		render(
			<Provider {...props}>
				<div>Test content</div>
			</Provider>
		);

		const colorModeProvider = screen.getByTestId('color-mode-provider');
		expect(colorModeProvider).toHaveAttribute('defaultTheme', 'dark');
		expect(colorModeProvider).toHaveAttribute('enableSystem', 'false');
		expect(colorModeProvider).toHaveAttribute(
			'disableTransitionOnChange',
			'true'
		);
	});
});
