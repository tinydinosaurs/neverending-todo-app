import React, {
	createContext,
	useContext,
	useCallback,
	useState,
	useEffect,
	ReactNode,
} from 'react';

import { Task } from '../types/task';
import { taskApi } from '../services/api';
import { TaskFormState } from '../components/TaskForm';

interface TaskContextType {
	// State
	tasks: Task[];
	loading: boolean;
	error: string | null;
	statusFilter: string;
	priorityFilter: string;
	toast: string;

	// Actions
	setStatusFilter: (status: string) => void;
	setPriorityFilter: (priority: string) => void;
	createTask: (form: TaskFormState) => Promise<void>;
	deleteTask: (id: number) => Promise<void>;
	updateTask: (id: number, form: TaskFormState) => Promise<void>;
	clearFilters: () => void;
	refreshTasks: () => Promise<void>;
	clearToast: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
	children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [priorityFilter, setPriorityFilter] = useState<string>('');
	const [toast, setToast] = useState<string>('');

	const fetchTasks = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const tasks = await taskApi.getTasks({
				status: statusFilter,
				priority: priorityFilter,
			});
			setTasks(tasks);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	}, [statusFilter, priorityFilter]);

	const createTask = useCallback(
		async (form: TaskFormState) => {
			try {
				setError(null);
				await taskApi.createTask({
					...form,
					due_date: form.dueDate,
				});
				await fetchTasks();
				setToast('Task added!');
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'An error occurred'
				);
			}
		},
		[fetchTasks]
	);

	const deleteTask = useCallback(
		async (id: number) => {
			try {
				setError(null);
				await taskApi.deleteTask(id);
				await fetchTasks();
				setToast('Task deleted!');
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'An error occurred'
				);
			}
		},
		[fetchTasks]
	);

	const updateTask = useCallback(
		async (id: number, form: TaskFormState) => {
			try {
				setError(null);
				await taskApi.updateTask(id, {
					title: form.title,
					description: form.description,
					status: form.status,
					priority: form.priority,
					due_date: form.dueDate,
				});
				await fetchTasks();
				setToast('Task updated!');
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'An error occurred'
				);
			}
		},
		[fetchTasks]
	);

	const clearFilters = useCallback(() => {
		setPriorityFilter('');
		setStatusFilter('');
	}, []);

	const clearToast = useCallback(() => setToast(''), []);

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	const value: TaskContextType = {
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
		refreshTasks: fetchTasks,
		clearToast,
	};

	return (
		<TaskContext.Provider value={value}>{children}</TaskContext.Provider>
	);
};

export const useTaskContext = () => {
	const context = useContext(TaskContext);
	if (context === undefined) {
		throw new Error('useTaskContext must be used within a TaskProvider');
	}
	return context;
};
