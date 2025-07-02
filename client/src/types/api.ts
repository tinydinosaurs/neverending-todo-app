// src/types/api.ts
import { Task } from './task';

export interface TaskFilters {
	status?: string;
	priority?: string;
}

export interface TaskListResponse {
	tasks: Task[];
	// Add pagination info if your API returns it, e.g.:
	// pagination?: { total: number; page: number; limit: number; totalPages: number };
}
