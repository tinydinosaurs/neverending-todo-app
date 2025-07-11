import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { TaskFilters } from '@components/TaskFilters';
import { system } from '../../components/theme';

// Simple render function for components that only need ChakraProvider
const renderWithChakra = (ui: React.ReactElement) => {
	return render(<ChakraProvider value={system}>{ui}</ChakraProvider>);
};

describe('TaskFilters', () => {
	const defaultProps = {
		status: '',
		setStatus: jest.fn(),
		priority: '',
		setPriority: jest.fn(),
		onClear: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders filter controls', () => {
		renderWithChakra(<TaskFilters {...defaultProps} />);

		expect(screen.getByText('Filter Tasks')).toBeInTheDocument();
		expect(
			screen.getByLabelText(/filter by task status/i)
		).toBeInTheDocument();
		expect(
			screen.getByLabelText(/filter by task priority/i)
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /clear all filters/i })
		).toBeInTheDocument();
	});

	it('calls setStatus when status filter changes', () => {
		renderWithChakra(<TaskFilters {...defaultProps} />);

		const statusSelect = screen.getByLabelText(/filter by task status/i);
		fireEvent.change(statusSelect, { target: { value: 'Not Started' } });

		expect(defaultProps.setStatus).toHaveBeenCalledWith('Not Started');
	});

	it('calls setPriority when priority filter changes', () => {
		renderWithChakra(<TaskFilters {...defaultProps} />);

		const prioritySelect = screen.getByLabelText(
			/filter by task priority/i
		);
		fireEvent.change(prioritySelect, { target: { value: 'High' } });

		expect(defaultProps.setPriority).toHaveBeenCalledWith('High');
	});

	it('calls onClear when clear filters button is clicked', () => {
		renderWithChakra(<TaskFilters {...defaultProps} />);

		const clearButton = screen.getByRole('button', {
			name: /clear all filters/i,
		});
		fireEvent.click(clearButton);

		expect(defaultProps.onClear).toHaveBeenCalledTimes(1);
	});

	it('displays current filter values', () => {
		renderWithChakra(
			<TaskFilters
				{...defaultProps}
				status="Not Started"
				priority="High"
			/>
		);

		const statusSelect = screen.getByLabelText(
			/filter by task status/i
		) as HTMLSelectElement;
		const prioritySelect = screen.getByLabelText(
			/filter by task priority/i
		) as HTMLSelectElement;

		expect(statusSelect.value).toBe('Not Started');
		expect(prioritySelect.value).toBe('High');
	});

	it('renders all status options', () => {
		renderWithChakra(<TaskFilters {...defaultProps} />);

		const statusSelect = screen.getByLabelText(/filter by task status/i);
		const options = within(statusSelect).getAllByRole('option');

		expect(options).toHaveLength(4); // "All Statuses" + 3 status options
		expect(options[0]).toHaveTextContent('All Statuses');
		expect(options[1]).toHaveTextContent('Not Started');
		expect(options[2]).toHaveTextContent('In Progress');
		expect(options[3]).toHaveTextContent('Completed');
	});

	it('renders all priority options', () => {
		renderWithChakra(<TaskFilters {...defaultProps} />);

		const prioritySelect = screen.getByLabelText(
			/filter by task priority/i
		);
		const options = within(prioritySelect).getAllByRole('option');

		expect(options).toHaveLength(4); // "All Priorities" + 3 priority options
		expect(options[0]).toHaveTextContent('All Priorities');
		expect(options[1]).toHaveTextContent('Low');
		expect(options[2]).toHaveTextContent('Medium');
		expect(options[3]).toHaveTextContent('High');
	});

	it('does not render clear button when onClear is not provided', () => {
		const { onClear, ...propsWithoutClear } = defaultProps;
		renderWithChakra(<TaskFilters {...propsWithoutClear} />);

		expect(
			screen.queryByRole('button', { name: /Clear all filters/i })
		).not.toBeInTheDocument();
	});

	it('has proper accessibility attributes', () => {
		renderWithChakra(<TaskFilters {...defaultProps} />);

		// Check that the fieldset has proper structure
		const fieldset = screen.getByRole('group');
		expect(fieldset).toBeInTheDocument();

		// Check that selects have proper labels
		expect(
			screen.getByLabelText(/filter by task status/i)
		).toBeInTheDocument();
		expect(
			screen.getByLabelText(/filter by task priority/i)
		).toBeInTheDocument();

		// Check that clear button has proper aria-label
		expect(
			screen.getByRole('button', { name: /clear all filters/i })
		).toBeInTheDocument();
	});
});
