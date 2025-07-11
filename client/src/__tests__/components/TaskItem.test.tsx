import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { TaskItem } from '@components/TaskItem';
import { NewTaskDialog } from '@components/TaskDialog';
import { system } from '../../components/theme';
import { TaskStatus, TaskPriority } from '../../types/task';
import { act } from 'react';
import { fireEvent } from '@testing-library/react';

const renderWithChakra = (ui: React.ReactElement) =>
	render(<ChakraProvider value={system}>{ui}</ChakraProvider>);

const now = new Date();
const tomorrowUTC = new Date(
	Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
);

const formattedDate = tomorrowUTC.toLocaleDateString();

const mockTask = {
	id: 1,
	title: 'Test Task',
	description: 'Test description',
	status: TaskStatus.NOTSTARTED,
	priority: TaskPriority.MEDIUM,
	due_date: formattedDate,
	created_at: '',
	updated_at: '',
};

describe('TaskItem', () => {
	const defaultProps = {
		task: mockTask,
		onDelete: jest.fn(),
		onUpdate: jest.fn(),
		onCancel: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders task details', () => {
		renderWithChakra(<TaskItem {...defaultProps} />);
		expect(screen.getByText(/test task/i)).toBeInTheDocument();
		expect(screen.getByText(/test description/i)).toBeInTheDocument();
		expect(screen.getByText(/Not Started/i)).toBeInTheDocument();
		expect(screen.getByText(/Medium/i)).toBeInTheDocument();
		expect(screen.getByText(formattedDate)).toBeInTheDocument();
	});

	it('calls onDelete when delete button is clicked', async () => {
		const handleDelete = jest.fn();
		renderWithChakra(
			<TaskItem {...defaultProps} onDelete={handleDelete} />
		);

		const button = screen.getByRole('button', { name: /delete/i });
		await userEvent.click(button);

		await waitFor(() => {
			expect(handleDelete).toHaveBeenCalledTimes(1);
		});
	});

	it('calls onUpdate when edit button is clicked and form is submitted', async () => {
		renderWithChakra(
			<>
				<TaskItem {...defaultProps} />
				<NewTaskDialog.Viewport />
			</>
		);
		// Click the edit button
		await userEvent.click(screen.getByRole('button', { name: /edit/i }));

		// Wait for the dialog/form to appear
		const titleInput = await screen.findByLabelText(/task title/i);

		// Optionally, change the value
		await userEvent.clear(titleInput);
		await userEvent.type(titleInput, 'Updated Task');

		// Click the save/submit button
		const saveButton = screen.getByRole('button', {
			name: /save changes/i,
		});
		await userEvent.click(saveButton);

		// Assert onUpdate was called
		await waitFor(() => {
			expect(defaultProps.onUpdate).toHaveBeenCalledTimes(1);
		});
	});

	it('closes the dialog when cancel button is clicked', async () => {
		renderWithChakra(
			<>
				<TaskItem {...defaultProps} />
				<NewTaskDialog.Viewport />
			</>
		);
		// Open the dialog
		await userEvent.click(screen.getByRole('button', { name: /edit/i }));

		// Wait for the dialog/form to appear
		const titleInput = await screen.findByLabelText(/task title/i);
		expect(titleInput).toBeInTheDocument();

		// Click the cancel button
		const cancelButton = screen.getByRole('button', { name: /cancel/i });
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			await userEvent.click(cancelButton);
		});

		// Wait for the dialog to close
		await waitFor(() => {
			expect(
				screen.queryByLabelText(/task title/i)
			).not.toBeInTheDocument();
		});
	});

	it('has proper accessibility attributes', () => {
		renderWithChakra(
			<>
				<TaskItem {...defaultProps} />
				<NewTaskDialog.Viewport />
			</>
		);

		// The title should be present and referenced
		expect(screen.getByText(/test task/i)).toBeInTheDocument();

		// Edit and Delete buttons should be accessible by name
		expect(
			screen.getByRole('button', { name: /edit/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /delete/i })
		).toBeInTheDocument();

		// Status, priority, and due date should be accessible
		expect(screen.getByLabelText(/task status is/i)).toHaveTextContent(
			'Not Started'
		);
		expect(screen.getByLabelText(/task priority is/i)).toHaveTextContent(
			'Medium'
		);
		expect(screen.getByLabelText(/task is due on/i)).toBeInTheDocument();
	});

	it('calls onDelete when Enter is pressed on the delete button and confirm is accepted', async () => {
		// Mock window.confirm to always return true
		window.confirm = jest.fn(() => true);

		renderWithChakra(
			<>
				<TaskItem {...defaultProps} />
				<NewTaskDialog.Viewport />
			</>
		);

		const deleteButton = screen.getByRole('button', { name: /delete/i });
		// Focus the button (optional, but realistic)
		deleteButton.focus();

		// Fire keyDown for Enter
		fireEvent.keyDown(deleteButton, {
			key: 'Enter',
			code: 'Enter',
			charCode: 13,
		});

		expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);

		// Optionally, test for space key as well
		fireEvent.keyDown(deleteButton, {
			key: ' ',
			code: 'Space',
			charCode: 32,
		});
		expect(defaultProps.onDelete).toHaveBeenCalledTimes(2);
	});
});
