// UI Constants for consistent text across the application

export const BUTTON_LABELS = {
	ADD_TASK: 'Add Task',
	EDIT: 'Edit',
	DELETE: 'Delete',
	CANCEL: 'Cancel',
	SAVE_CHANGES: 'Save Changes',
	CLEAR_FILTERS: 'Clear Filters',
	RETRY: 'Retry',
} as const;

export const FORM_LABELS = {
	TASK_TITLE: 'Task Title',
	DESCRIPTION: 'Description',
	STATUS: 'Status',
	PRIORITY: 'Priority',
	DUE_DATE: 'Due Date',
} as const;

export const FILTER_LABELS = {
	FILTER_TASKS: 'Filter Tasks',
	ALL_STATUSES: 'All Statuses',
	ALL_PRIORITIES: 'All Priorities',
	STATUS: 'Status:',
	PRIORITY: 'Priority:',
} as const;

export const DIALOG_LABELS = {
	ADD_NEW_TASK: 'Add a new task',
	EDIT_TASK: 'Edit Task',
	CLOSE_DIALOG: 'Close dialog',
} as const;

export const STATUS_DISPLAY = {
	NOT_STARTED: 'Not Started',
	IN_PROGRESS: 'In Progress',
	COMPLETED: 'Completed',
} as const;

export const PRIORITY_DISPLAY = {
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: 'High',
} as const;

export const MESSAGES = {
	LOADING: 'Loading...',
	LOADING_TASKS: 'Loading tasks, please wait',
	NO_TASKS: 'No tasks found. Create your first task to get started!',
	TASK_DELETED: 'Task deleted!',
	DELETE_CONFIRMATION: 'Are you sure you want to delete',
	RETRY_LOADING: 'Retry loading content',
} as const;

export const ARIA_LABELS = {
	EDIT_TASK: 'Edit task:',
	DELETE_TASK: 'Delete task:',
	TASK_STATUS: 'Task status is',
	TASK_PRIORITY: 'Task priority is',
	TASK_DUE_DATE: 'Task is due on',
	FILTER_BY_STATUS: 'Filter by task status',
	FILTER_BY_PRIORITY: 'Filter by task priority',
	CLEAR_ALL_FILTERS: 'Clear all filters',
	RETRY_LOADING: 'Retry loading content',
} as const;

export const HELP_TEXT = {
	TITLE: 'Enter a descriptive title for your task',
	DESCRIPTION: 'Provide additional details about the task',
	STATUS: 'Select the current status of the task',
	PRIORITY: 'Select the priority level for the task',
	DUE_DATE: 'Select the date when the task should be completed',
	SUBMIT: 'Click to save the task',
} as const;
