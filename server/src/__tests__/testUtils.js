const request = require('supertest');

// Default test task data
const defaultTask = {
	title: 'Test Task',
	description: 'Test Description',
	status: 'Not Started',
	priority: 'Medium',
	due_date: '2024-01-15',
};

/**
 * Create a task with optional overrides
 * @param {Object} overrides - Properties to override in the default task
 * @param {Object} app - Express app instance
 * @returns {Promise<Object>} The created task response
 */
async function createTask(app, overrides = {}) {
	const taskData = { ...defaultTask, ...overrides };
	const response = await request(app)
		.post('/api/tasks')
		.send(taskData)
		.expect(201);
	return response.body;
}

/**
 * Create multiple tasks with different data
 * @param {Object} app - Express app instance
 * @param {Array<Object>} tasksData - Array of task data objects
 * @returns {Promise<Array>} Array of created task responses
 */
async function createMultipleTasks(app, tasksData) {
	const tasks = [];
	for (const taskData of tasksData) {
		const task = await createTask(app, taskData);
		tasks.push(task);
	}
	return tasks;
}

/**
 * Suppress console.error for a test and restore it after
 * @param {Function} testFn - The test function to run with suppressed console.error
 * @returns {Promise} The result of the test function
 */
async function withSuppressedConsoleError(testFn) {
	const originalConsoleError = console.error;
	console.error = jest.fn();

	try {
		return await testFn();
	} finally {
		console.error = originalConsoleError;
	}
}

/**
 * Create test data for different statuses
 * @returns {Array} Array of task data with different statuses
 */
function createStatusTestData() {
	return [
		{ status: 'Not Started' },
		{ title: 'In Progress Task', status: 'In Progress' },
		{ title: 'Completed Task', status: 'Completed' },
	];
}

/**
 * Create test data for different priorities
 * @returns {Array} Array of task data with different priorities
 */
function createPriorityTestData() {
	return [
		{ priority: 'Low' },
		{ title: 'Medium Task', priority: 'Medium' },
		{ title: 'High Task', priority: 'High' },
	];
}

/**
 * Create test data for different due dates
 * @returns {Array} Array of task data with different due dates
 */
function createDateTestData() {
	return [
		{ due_date: '2024-01-15' },
		{ title: 'Later Task', due_date: '2024-03-15' },
		{ title: 'Much Later Task', due_date: '2024-06-15' },
	];
}

/**
 * Create test data for search functionality
 * @returns {Array} Array of task data for search tests
 */
function createSearchTestData() {
	return [
		{ title: 'JavaScript Project' },
		{ title: 'Python Script', description: 'Write a JavaScript utility' },
		{ title: 'Database Setup' },
	];
}

/**
 * Verify task properties match expected values
 * @param {Object} task - The task object to verify
 * @param {Object} expected - Expected task properties
 */
function verifyTaskProperties(task, expected) {
	Object.entries(expected).forEach(([key, value]) => {
		if (key === 'due_date' && value && task[key]) {
			// For date comparisons, compare only the date part
			const taskDate = new Date(task[key]).toISOString().split('T')[0];
			const expectedDate = new Date(value).toISOString().split('T')[0];
			expect(taskDate).toBe(expectedDate);
		} else {
			expect(task[key]).toBe(value);
		}
	});
}

/**
 * Verify pagination properties
 * @param {Object} pagination - The pagination object to verify
 * @param {Object} expected - Expected pagination properties
 */
function verifyPagination(pagination, expected) {
	Object.entries(expected).forEach(([key, value]) => {
		expect(pagination[key]).toBe(value);
	});
}

module.exports = {
	defaultTask,
	createTask,
	createMultipleTasks,
	withSuppressedConsoleError,
	createStatusTestData,
	createPriorityTestData,
	createDateTestData,
	createSearchTestData,
	verifyTaskProperties,
	verifyPagination,
};
