import React from 'react';
import { screen } from '@testing-library/react';
import { TaskList } from '@components/TaskList';
import { renderWithProviders } from '../utils/test-utils';

describe('TaskList', () => {
	it('renders loading component if loading', () => {
		renderWithProviders(<TaskList />, { contextValue: { loading: true } });
		expect(
			screen.getByText('Loading tasks, please wait')
		).toBeInTheDocument();
	});

	it('renders error component if error', () => {
		renderWithProviders(<TaskList />, {
			contextValue: { error: 'Something went wrong', loading: false },
		});
		expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
	});

	it('renders heading', () => {
		renderWithProviders(<TaskList />, {
			contextValue: { loading: false, error: null, tasks: [] },
		});
		expect(screen.getByText(/My Tasks \(0\)/i)).toBeInTheDocument();
	});

	it('renders no tasks message if no tasks', () => {
		renderWithProviders(<TaskList />, {
			contextValue: { loading: false, error: null, tasks: [] },
		});
		expect(
			screen.getByText(
				'No tasks found. Create your first task to get started!'
			)
		).toBeInTheDocument();
	});

	it('renders the correct number of TaskItem components', () => {
		const mockTasks = [
			{
				id: 1,
				title: 'Task 1',
				description: 'Desc 1',
				due_date: '',
				status: 'Not Started' as const,
				priority: 'Low' as const,
				created_at: '',
				updated_at: '',
			},
			{
				id: 2,
				title: 'Task 2',
				description: 'Desc 2',
				due_date: '',
				status: 'In Progress' as const,
				priority: 'Medium' as const,
				created_at: '',
				updated_at: '',
			},
		];
		renderWithProviders(<TaskList />, {
			contextValue: { loading: false, error: null, tasks: mockTasks },
		});
		// TaskItem renders a heading with the task title
		mockTasks.forEach((task) => {
			expect(screen.getByText(task.title)).toBeInTheDocument();
		});
	});

	it('renders task filters', () => {
		renderWithProviders(<TaskList />, {
			contextValue: { loading: false, error: null, tasks: [] },
		});
		expect(screen.getByText('Filter Tasks')).toBeInTheDocument();
	});
});
