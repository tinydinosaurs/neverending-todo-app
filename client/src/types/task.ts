// src/types/task.ts

export interface Task {
	id: number;
	title: string;
	description: string;
	due_date: string;
	status: 'Not Started' | 'In Progress' | 'Completed';
	priority: 'Low' | 'Medium' | 'High';
	created_at: string;
	updated_at: string;
}

export enum TaskStatus {
	NOTSTARTED = 'Not Started',
	INPROGRESS = 'In Progress',
	COMPLETED = 'Completed',
}

export enum TaskPriority {
	LOW = 'Low',
	MEDIUM = 'Medium',
	HIGH = 'High',
}
