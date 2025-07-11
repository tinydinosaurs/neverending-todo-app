import React from 'react';
import { screen } from '@testing-library/react';
import { TaskDialogButton } from '@components/TaskDialog';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/test-utils';
import { within } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { mockTaskContextValue } from '../contexts/MockTaskProvider';

describe('TaskDialog', () => {
	it('renders the add task button', () => {
		renderWithProviders(<TaskDialogButton />);
		// Get all buttons and find the trigger button (type="button")
		const buttons = screen.getAllByRole('button', { name: /add task/i });
		const triggerButton = buttons.find(
			(button) => button.getAttribute('type') === 'button'
		);
		expect(triggerButton).toBeInTheDocument();
	});

	it('opens dialog when button is clicked', async () => {
		const user = userEvent;
		renderWithProviders(<TaskDialogButton />);
		// Get all buttons and find the trigger button (type="button")
		const buttons = screen.getAllByRole('button', { name: /add task/i });
		const addButton = buttons.find(
			(button) => button.getAttribute('type') === 'button'
		);
		await user.click(addButton!);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByText(/add a new task/i)).toBeInTheDocument();
	});

	it('renders TaskForm inside dialog', async () => {
		const user = userEvent;
		renderWithProviders(<TaskDialogButton />);
		// Get all buttons and find the trigger button (type="button")
		const buttons = screen.getAllByRole('button', { name: /add task/i });
		const addButton = buttons.find(
			(button) => button.getAttribute('type') === 'button'
		);
		await user.click(addButton!);
		// Check for form fields
		const dialog = screen.getByRole('dialog');
		expect(
			within(dialog).getByLabelText(/task title/i)
		).toBeInTheDocument();
		expect(
			within(dialog).getByLabelText(/description/i)
		).toBeInTheDocument();
		expect(within(dialog).getByLabelText(/status/i)).toBeInTheDocument();
		expect(within(dialog).getByLabelText(/priority/i)).toBeInTheDocument();
		expect(within(dialog).getByLabelText(/due date/i)).toBeInTheDocument();
		expect(
			within(dialog).getByRole('button', { name: /add task/i })
		).toBeInTheDocument();
	});

	it('has close button in dialog', async () => {
		const user = userEvent;
		renderWithProviders(<TaskDialogButton />);
		// Get all buttons and find the trigger button (type="button")
		const buttons = screen.getAllByRole('button', { name: /add task/i });
		const addButton = buttons.find(
			(button) => button.getAttribute('type') === 'button'
		);
		await user.click(addButton!);

		// Verify dialog is open
		expect(screen.getByRole('dialog')).toBeInTheDocument();

		// Verify close button exists and is accessible
		const closeBtn = screen.getByRole('button', { name: /close dialog/i });
		expect(closeBtn).toBeInTheDocument();
		expect(closeBtn).toHaveAttribute('aria-label', 'Close dialog');
	});

	it('dialog opens and shows form', async () => {
		renderWithProviders(<TaskDialogButton />);

		// The dialog is already open when component mounts
		const dialog = screen.getByRole('dialog');
		expect(dialog).toBeInTheDocument();

		// Verify dialog is open
		expect(dialog).toHaveAttribute('data-state', 'open');

		// Verify form is present
		expect(
			within(dialog).getByLabelText(/task title/i)
		).toBeInTheDocument();
		expect(
			within(dialog).getByLabelText(/description/i)
		).toBeInTheDocument();
		expect(within(dialog).getByLabelText(/status/i)).toBeInTheDocument();
		expect(within(dialog).getByLabelText(/priority/i)).toBeInTheDocument();
		expect(within(dialog).getByLabelText(/due date/i)).toBeInTheDocument();
	});

	it('has proper accessibility attributes', async () => {
		const user = userEvent;
		renderWithProviders(<TaskDialogButton />);
		// Get all buttons and find the trigger button (type="button")
		const buttons = screen.getAllByRole('button', { name: /add task/i });
		const addButton = buttons.find(
			(button) => button.getAttribute('type') === 'button'
		);
		await user.click(addButton!);
		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
		// The dialog should be labelled by the title
		const title = screen.getByText(/add a new task/i);
		expect(title).toBeInTheDocument();
	});

	it('submits form and calls createTask', async () => {
		const user = userEvent;

		// Clear the mock before the test
		mockTaskContextValue.createTask.mockClear();

		// Use the default mock context
		renderWithProviders(<TaskDialogButton />);

		// Get the dialog and form
		const dialog = screen.getByRole('dialog');

		// Fill out the form
		const titleInput = within(dialog).getByLabelText(/task title/i);
		await user.type(titleInput, 'Test Task');

		const descriptionInput = within(dialog).getByLabelText(/description/i);
		await user.type(descriptionInput, 'Test Description');

		// Submit the form
		const submitButton = within(dialog).getByRole('button', {
			name: /add task/i,
		});
		await user.click(submitButton);

		// Verify createTask was called with the form data
		await waitFor(() => {
			expect(mockTaskContextValue.createTask).toHaveBeenCalledWith({
				title: 'Test Task',
				description: 'Test Description',
				status: 'Not Started',
				priority: 'Medium',
				dueDate: null,
			});
		});
	});
});
