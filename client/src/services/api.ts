import { apiRequest } from './apiHelper';
import { Task } from '../types/task';
import { TaskFilters, TaskListResponse } from '../types/api';

const API_URL = 'http://localhost:5001/api';

export const taskApi = {
	getTasks: async (filters?: TaskFilters): Promise<Task[]> => {
		const params = new URLSearchParams();
		if (filters?.status) params.append('status', filters.status);
		if (filters?.priority) params.append('priority', filters.priority);
		const url = `${API_URL}/tasks?${params.toString()}`;
		const data: TaskListResponse = await apiRequest<TaskListResponse>(url);
		return data.tasks;
	},

	deleteTask: async (id: number): Promise<void> => {
		await apiRequest<void>(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
	},

	createTask: async (
		task: Omit<Task, 'id' | 'created_at' | 'updated_at'>
	): Promise<Task> => {
		return apiRequest<Task>(`${API_URL}/tasks`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(task),
		});
	},

	updateTask: async (
		id: number,
		task: Omit<Task, 'id' | 'created_at' | 'updated_at'>
	): Promise<Task> => {
		return apiRequest<Task>(`${API_URL}/tasks/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(task),
		});
	},
};
