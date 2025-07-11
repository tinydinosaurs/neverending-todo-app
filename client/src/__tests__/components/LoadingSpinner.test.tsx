import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '@components/LoadingSpinner';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('LoadingSpinner', () => {
	it('renders loading message', () => {
		render(<LoadingSpinner message="Loading content" />);
		expect(screen.getByText('Loading content')).toBeInTheDocument();
	});
	it('LoadingSpinner is accessible', async () => {
		const { container } = render(<LoadingSpinner />);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('renders default aria-label if ariaLabel prop is not provided', () => {
		render(<LoadingSpinner message="Loading content" />);
		expect(screen.getByRole('status')).toHaveAttribute(
			'aria-label',
			'Loading content'
		);
	});

	it('renders provided aria-label if ariaLabel prop is given', () => {
		render(
			<LoadingSpinner
				message="Loading content"
				ariaLabel="Custom loading label"
			/>
		);
		expect(screen.getByRole('status')).toHaveAttribute(
			'aria-label',
			'Custom loading label'
		);
	});
});
