import 'jest-axe/extend-expect';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ErrorMessage } from '@components/ErrorMessage';
import userEvent from '@testing-library/user-event';

expect.extend(toHaveNoViolations);
describe('ErrorMessage', () => {
	it('renders error message and error icon', () => {
		render(<ErrorMessage message="Something went wrong" />);
		expect(screen.getByText('Something went wrong')).toBeInTheDocument();
	});

	it('renders retry button if onRetry is passed as a prop', () => {
		const handleRetry = jest.fn();
		render(
			<ErrorMessage
				message="Something went wrong"
				onRetry={handleRetry}
			/>
		);
		expect(
			screen.getByRole('button', { name: /retry/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /retry loading content/i })
		).toBeInTheDocument();
	});

	it('does not render retry button if onRetry is not provided', () => {
		render(<ErrorMessage message="Something went wrong" />);
		expect(
			screen.queryByRole('button', { name: /retry/i })
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole('button', { name: /retry loading content/i })
		).not.toBeInTheDocument();
	});

	it('retry button calls onRetry when clicked', async () => {
		const handleRetry = jest.fn();
		render(
			<ErrorMessage
				message="Something went wrong"
				onRetry={handleRetry}
			/>
		);
		const button = screen.getByRole('button', { name: /retry/i });
		await userEvent.click(button);
		expect(handleRetry).toHaveBeenCalledTimes(1);
	});

	it('ErrorMessage is accessible', async () => {
		const { container } = render(<ErrorMessage message="Oops!" />);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('renders default aria-label if ariaLabel prop is not provided', () => {
		render(<ErrorMessage message="Something went wrong" />);
		expect(screen.getByRole('alert')).toHaveAttribute(
			'aria-label',
			'Error occurred'
		);
	});

	it('renders provided aria-label if ariaLabel prop is given', () => {
		render(
			<ErrorMessage
				message="Something went wrong"
				ariaLabel="Custom error label"
			/>
		);
		expect(screen.getByRole('alert')).toHaveAttribute(
			'aria-label',
			'Custom error label'
		);
	});
});
