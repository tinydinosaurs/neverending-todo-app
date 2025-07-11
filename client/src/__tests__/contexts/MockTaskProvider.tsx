import React, { ReactNode } from 'react';
import { TaskContext } from '../../contexts/TaskContext';
import { Task } from '../../types/task';

// Fill in all the context values and methods your components use
export const mockTaskContextValue = {
	tasks: [] as Task[],
	loading: false,
	error: null as string | null,
	statusFilter: '',
	setStatusFilter: jest.fn(),
	priorityFilter: '',
	setPriorityFilter: jest.fn(),
	deleteTask: jest.fn(),
	updateTask: jest.fn(),
	clearFilters: jest.fn(),
	refreshTasks: jest.fn(),
	toast: null as string | null,
	createTask: jest.fn(),
	clearToast: jest.fn(),
	// Add any additional context values as needed
};

interface MockTaskProviderProps {
	children: ReactNode;
	value?: Partial<typeof mockTaskContextValue>;
}

export const MockTaskProvider = ({
	children,
	value = {},
}: MockTaskProviderProps) => {
	return (
		<TaskContext.Provider value={{ ...mockTaskContextValue, ...value }}>
			{children}
		</TaskContext.Provider>
	);
};
