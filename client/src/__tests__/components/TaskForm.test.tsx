import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { TaskForm } from '@components/TaskForm';
import { system } from '../../components/theme';
import { TaskStatus, TaskPriority } from '../../types/task';

const renderWithChakra = (ui: React.ReactElement) =>
	render(<ChakraProvider value={system}>{ui}</ChakraProvider>);

describe('TaskForm', () => {
	const defaultProps = {
		onSubmit: jest.fn(),
		initialValues: undefined,
		submitLabel: undefined,
		ariaLabel: undefined,
		onCancel: undefined,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders all form fields', () => {
		renderWithChakra(<TaskForm {...defaultProps} />);
		expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /add task/i })
		).toBeInTheDocument();
	});

	it('calls onSubmit with form values when submitted', async () => {
		const handleSubmit = jest.fn();
		renderWithChakra(
			<TaskForm {...defaultProps} onSubmit={handleSubmit} />
		);

		await userEvent.type(screen.getByLabelText(/task title/i), 'Test Task');
		await userEvent.selectOptions(
			screen.getByLabelText(/status/i),
			'Not Started'
		);
		await userEvent.selectOptions(
			screen.getByLabelText(/priority/i),
			'Medium'
		);

		const button = screen.getByRole('button', { name: /add task/i });
		await userEvent.click(button);

		await waitFor(() => {
			expect(handleSubmit).toHaveBeenCalledTimes(1);
		});
	});

	it('shows validation error if title is missing', async () => {
		renderWithChakra(<TaskForm {...defaultProps} />);
		const button = screen.getByRole('button', { name: /add task/i });
		await userEvent.click(button);
		expect(
			await screen.findByText(/title is required/i)
		).toBeInTheDocument();
	});

	it('renders with initial values if provided', () => {
		const initialValues = {
			title: 'Initial Title',
			description: 'Initial description',
			status: TaskStatus.INPROGRESS,
			priority: TaskPriority.HIGH,
			dueDate: '2026-07-01',
		};

		renderWithChakra(
			<TaskForm {...defaultProps} initialValues={initialValues} />
		);

		// Check that the input fields have the initial values
		expect(screen.getByLabelText(/task title/i)).toHaveValue(
			'Initial Title'
		);
		expect(screen.getByLabelText(/description/i)).toHaveValue(
			'Initial description'
		);
		expect(screen.getByLabelText(/status/i)).toHaveValue('In Progress');
		expect(screen.getByLabelText(/priority/i)).toHaveValue('High');
		expect(screen.getByLabelText(/due date/i)).toHaveValue('2026-07-01');
	});

	it('calls onCancel when cancel button is clicked', async () => {
		const handleCancel = jest.fn();
		const initialValues = {
			title: 'Edit Me',
			description: 'Edit description',
			status: TaskStatus.INPROGRESS,
			priority: TaskPriority.HIGH,
			dueDate: '2026-07-01',
		};

		renderWithChakra(
			<TaskForm
				{...defaultProps}
				initialValues={initialValues}
				onCancel={handleCancel}
			/>
		);

		const button = screen.getByRole('button', { name: /cancel/i });
		await userEvent.click(button);

		await waitFor(() => {
			expect(handleCancel).toHaveBeenCalledTimes(1);
		});
	});

	it('renders with custom submitLabel', () => {
		renderWithChakra(
			<TaskForm {...defaultProps} submitLabel="Save Changes" />
		);
		expect(
			screen.getByRole('button', { name: /save changes/i })
		).toBeInTheDocument();
	});

	it('has proper accessibility attributes', () => {
		renderWithChakra(<TaskForm {...defaultProps} ariaLabel="Task form" />);
		// The form should have the correct aria-label
		expect(
			screen.getByRole('form', { name: /task form/i })
		).toBeInTheDocument();

		// Each field should have a label
		expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();

		// The required indicator should be present for the title
		expect(screen.getByText('*')).toBeInTheDocument();
	});
});
