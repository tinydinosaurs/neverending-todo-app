import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Toast } from '@components/Toast';
import { system } from '../../components/theme';

const renderWithChakra = (ui: React.ReactElement) =>
	render(<ChakraProvider value={system}>{ui}</ChakraProvider>);

describe('Toast', () => {
	it('renders the toast message', () => {
		renderWithChakra(<Toast message="Hello, world!" onClose={jest.fn()} />);
		expect(screen.getByText(/hello, world!/i)).toBeInTheDocument();
	});

	it('calls onClose after duration', async () => {
		jest.useFakeTimers();
		const handleClose = jest.fn();
		renderWithChakra(
			<Toast
				message="Hello, world!"
				onClose={handleClose}
				duration={3000}
			/>
		);
		expect(handleClose).toHaveBeenCalledTimes(0);
		jest.advanceTimersByTime(3000);
		expect(handleClose).toHaveBeenCalledTimes(1);

		jest.useRealTimers();
	});

	it('does not render if message is empty', () => {
		renderWithChakra(<Toast message={''} onClose={jest.fn()} />);

		expect(screen.queryByText(/hello, world!/i)).not.toBeInTheDocument();
	});

	it('has proper accessibility attributes', () => {
		renderWithChakra(
			<Toast message="Accessible toast" onClose={jest.fn()} />
		);
		const toast = screen.getByRole('status');
		expect(toast).toBeInTheDocument();
		expect(toast).toHaveAttribute('aria-live', 'polite');
		// If your Toast uses tabIndex for focus management:
		expect(toast).toHaveAttribute('tabindex', '0');
		// The message should be present
		expect(toast).toHaveTextContent('Accessible toast');
	});
});
