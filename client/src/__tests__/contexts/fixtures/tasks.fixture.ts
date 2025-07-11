import { Task } from '@utils/../types/task';

export const mockTasks: Task[] = [
	{
		id: 1,
		title: 'Test Task 1',
		description: 'Description 1',
		status: 'Not Started',
		priority: 'Medium',
		due_date: '2024-12-31',
		created_at: '2024-01-01',
		updated_at: '2024-01-01',
	},
	{
		id: 2,
		title: 'Test Task 2',
		description: 'Description 2',
		status: 'In Progress',
		priority: 'High',
		due_date: '2024-11-30',
		created_at: '2024-01-02',
		updated_at: '2024-01-02',
	},
];
