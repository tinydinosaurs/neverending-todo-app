import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TaskProvider, useTaskContext } from '../../contexts/TaskContext';
import { taskApi } from '../../services/api';
import { TaskStatus, TaskPriority } from '../../types/task';

// Mock the API
jest.mock('../../services/api', () => ({
	taskApi: {
		getTasks: jest.fn(),
		createTask: jest.fn(),
		deleteTask: jest.fn(),
		updateTask: jest.fn(),
	},
}));

const mockTasks = [
	{
		id: 1,
		title: 'Test Task 1',
		description: 'Test Description 1',
		status: TaskStatus.NOTSTARTED,
		priority: TaskPriority.MEDIUM,
		due_date: '2024-01-01',
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-01-01T00:00:00Z',
	},
	{
		id: 2,
		title: 'Test Task 2',
		description: 'Test Description 2',
		status: TaskStatus.INPROGRESS,
		priority: TaskPriority.HIGH,
		due_date: '2024-01-02',
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-01-01T00:00:00Z',
	},
];

// Test component to use the context
const TestComponent = () => {
	const {
		tasks,
		loading,
		error,
		statusFilter,
		priorityFilter,
		toast,
		setStatusFilter,
		setPriorityFilter,
		createTask,
		deleteTask,
		updateTask,
		clearFilters,
		refreshTasks,
		clearToast,
	} = useTaskContext();

	return (
		<div>
			<div data-testid="tasks-count">{tasks.length}</div>
			<div data-testid="loading">{loading.toString()}</div>
			<div data-testid="error">{error || 'no-error'}</div>
			<div data-testid="status-filter">{statusFilter}</div>
			<div data-testid="priority-filter">{priorityFilter}</div>
			<div data-testid="toast">{toast || 'no-toast'}</div>
			<button
				onClick={() => setStatusFilter('Not Started')}
				data-testid="set-status"
			>
				Set Status
			</button>
			<button
				onClick={() => setPriorityFilter('High')}
				data-testid="set-priority"
			>
				Set Priority
			</button>
			<button
				onClick={() =>
					createTask({
						title: 'New Task',
						description: 'New Description',
						status: TaskStatus.NOTSTARTED,
						priority: TaskPriority.MEDIUM,
						dueDate: null,
					})
				}
				data-testid="create-task"
			>
				Create Task
			</button>
			<button
				onClick={() =>
					createTask({
						title: 'Task With Date',
						description: 'Task with real due date',
						status: TaskStatus.NOTSTARTED,
						priority: TaskPriority.MEDIUM,
						dueDate: '2024-12-31',
					})
				}
				data-testid="create-task-with-date"
			>
				Create Task With Date
			</button>
			<button onClick={() => deleteTask(1)} data-testid="delete-task">
				Delete Task
			</button>
			<button
				onClick={() =>
					updateTask(1, {
						title: 'Updated Task',
						description: 'Updated Description',
						status: TaskStatus.COMPLETED,
						priority: TaskPriority.HIGH,
						dueDate: null,
					})
				}
				data-testid="update-task"
			>
				Update Task
			</button>
			<button onClick={clearFilters} data-testid="clear-filters">
				Clear Filters
			</button>
			<button onClick={refreshTasks} data-testid="refresh-tasks">
				Refresh Tasks
			</button>
			<button onClick={clearToast} data-testid="clear-toast">
				Clear Toast
			</button>
		</div>
	);
};

describe('TaskContext', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(taskApi.getTasks as jest.Mock).mockResolvedValue(mockTasks);
		(taskApi.createTask as jest.Mock).mockResolvedValue(mockTasks[0]);
		(taskApi.deleteTask as jest.Mock).mockResolvedValue(undefined);
		(taskApi.updateTask as jest.Mock).mockResolvedValue(mockTasks[0]);
	});

	it('provides initial state', async () => {
		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		// Initially loading
		expect(screen.getByTestId('loading')).toHaveTextContent('true');

		// Wait for tasks to load
		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		expect(screen.getByTestId('tasks-count')).toHaveTextContent('2');
		expect(screen.getByTestId('error')).toHaveTextContent('no-error');
		expect(screen.getByTestId('status-filter')).toHaveTextContent('');
		expect(screen.getByTestId('priority-filter')).toHaveTextContent('');
		expect(screen.getByTestId('toast')).toHaveTextContent('no-toast');
	});

	it('handles setStatusFilter', async () => {
		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		const setStatusButton = screen.getByTestId('set-status');
		setStatusButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('status-filter')).toHaveTextContent(
				'Not Started'
			);
		});
	});

	it('handles setPriorityFilter', async () => {
		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		const setPriorityButton = screen.getByTestId('set-priority');
		setPriorityButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('priority-filter')).toHaveTextContent(
				'High'
			);
		});
	});

	it('handles createTask', async () => {
		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		const createTaskButton = screen.getByTestId('create-task');
		createTaskButton.click();

		await waitFor(() => {
			expect(taskApi.createTask).toHaveBeenCalledWith({
				title: 'New Task',
				description: 'New Description',
				status: TaskStatus.NOTSTARTED,
				priority: TaskPriority.MEDIUM,
				due_date: '',
			});
		});

		// Should show toast after successful creation
		await waitFor(() => {
			expect(screen.getByTestId('toast')).toHaveTextContent(
				'Task added!'
			);
		});
	});

	it('handles deleteTask', async () => {
		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		const deleteTaskButton = screen.getByTestId('delete-task');
		deleteTaskButton.click();

		await waitFor(() => {
			expect(taskApi.deleteTask).toHaveBeenCalledWith(1);
		});

		// Should show toast after successful deletion
		await waitFor(() => {
			expect(screen.getByTestId('toast')).toHaveTextContent(
				'Task deleted!'
			);
		});
	});

	it('handles updateTask', async () => {
		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		const updateTaskButton = screen.getByTestId('update-task');
		updateTaskButton.click();

		await waitFor(() => {
			expect(taskApi.updateTask).toHaveBeenCalledWith(1, {
				title: 'Updated Task',
				description: 'Updated Description',
				status: TaskStatus.COMPLETED,
				priority: TaskPriority.HIGH,
				due_date: '',
			});
		});

		// Should show toast after successful update
		await waitFor(() => {
			expect(screen.getByTestId('toast')).toHaveTextContent(
				'Task updated!'
			);
		});
	});

	it('handles clearFilters', async () => {
		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		// Set some filters first
		const setStatusButton = screen.getByTestId('set-status');
		const setPriorityButton = screen.getByTestId('set-priority');
		setStatusButton.click();
		setPriorityButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('status-filter')).toHaveTextContent(
				'Not Started'
			);
		});
		await waitFor(() => {
			expect(screen.getByTestId('priority-filter')).toHaveTextContent(
				'High'
			);
		});

		// Clear filters
		const clearFiltersButton = screen.getByTestId('clear-filters');
		clearFiltersButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('status-filter')).toHaveTextContent('');
		});
		await waitFor(() => {
			expect(screen.getByTestId('priority-filter')).toHaveTextContent('');
		});
	});

	it('handles clearToast', async () => {
		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		// Create a task to show toast
		const createTaskButton = screen.getByTestId('create-task');
		createTaskButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('toast')).toHaveTextContent(
				'Task added!'
			);
		});

		// Clear toast
		const clearToastButton = screen.getByTestId('clear-toast');
		clearToastButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('toast')).toHaveTextContent('no-toast');
		});
	});

	it('handles API errors', async () => {
		const errorMessage = 'API Error';
		(taskApi.getTasks as jest.Mock).mockRejectedValue(
			new Error(errorMessage)
		);

		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
	});

	it('sets error when createTask fails', async () => {
		(taskApi.createTask as jest.Mock).mockRejectedValue(
			new Error('Create failed')
		);

		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		const createTaskButton = screen.getByTestId('create-task');
		createTaskButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('error')).toHaveTextContent(
				'Create failed'
			);
		});
	});

	it('sets error when deleteTask fails', async () => {
		(taskApi.deleteTask as jest.Mock).mockRejectedValue(
			new Error('Delete failed')
		);

		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		const deleteTaskButton = screen.getByTestId('delete-task');
		deleteTaskButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('error')).toHaveTextContent(
				'Delete failed'
			);
		});
	});

	it('sets error when updateTask fails', async () => {
		(taskApi.updateTask as jest.Mock).mockRejectedValue(
			new Error('Update failed')
		);

		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		const updateTaskButton = screen.getByTestId('update-task');
		updateTaskButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('error')).toHaveTextContent(
				'Update failed'
			);
		});
	});

	it('sets fallback error message when createTask throws non-Error', async () => {
		(taskApi.createTask as jest.Mock).mockRejectedValue('not-an-error');

		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		const createTaskButton = screen.getByTestId('create-task');
		createTaskButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('error')).toHaveTextContent(
				'An error occurred'
			);
		});
	});

	it('sets fallback error message when deleteTask throws non-Error', async () => {
		(taskApi.deleteTask as jest.Mock).mockRejectedValue('not-an-error');

		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		const deleteTaskButton = screen.getByTestId('delete-task');
		deleteTaskButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('error')).toHaveTextContent(
				'An error occurred'
			);
		});
	});

	it('sets fallback error message when updateTask throws non-Error', async () => {
		(taskApi.updateTask as jest.Mock).mockRejectedValue('not-an-error');

		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		const updateTaskButton = screen.getByTestId('update-task');
		updateTaskButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('error')).toHaveTextContent(
				'An error occurred'
			);
		});
	});

	it('sets fallback error message when getTasks throws non-Error', async () => {
		(taskApi.getTasks as jest.Mock).mockRejectedValue('not-an-error');

		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		expect(screen.getByTestId('error')).toHaveTextContent(
			'An error occurred'
		);
	});

	it('passes due_date value from form.dueDate when provided', async () => {
		render(
			<TaskProvider>
				<TestComponent />
			</TaskProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('loading')).toHaveTextContent('false');
		});

		const createTaskWithDateButton = screen.getByTestId(
			'create-task-with-date'
		);
		createTaskWithDateButton.click();

		await waitFor(() => {
			expect(taskApi.createTask).toHaveBeenCalledWith(
				expect.objectContaining({
					due_date: '2024-12-31',
				})
			);
		});
	});

	it('throws error when useTaskContext is used outside TaskProvider', () => {
		// Suppress console.error for this test
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		expect(() => {
			render(<TestComponent />);
		}).toThrow('useTaskContext must be used within a TaskProvider');

		consoleSpy.mockRestore();
	});
});
