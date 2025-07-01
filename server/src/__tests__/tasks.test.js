const request = require('supertest');
const { Pool } = require('pg');
const {
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
} = require('./testUtils');

// Load environment variables from .env.test
require('dotenv').config({ path: '.env.test' });

// Import the app
let app;
let pool;
let appPool;

describe('Tasks API', () => {
	beforeAll(async () => {
		// Import the app
		app = require('../index');
		appPool = require('../index').pool;

		// Debug: Print the DATABASE_URL being used
		console.log('DATABASE_URL being used:', process.env.DATABASE_URL);

		// Create a test database connection
		pool = new Pool({
			connectionString: process.env.DATABASE_URL,
		});
	});

	beforeEach(async () => {
		// Clean up before each test
		await pool.query('DELETE FROM tasks');
	});

	afterAll(async () => {
		// Close both pools
		if (pool) {
			await pool.end();
		}
		if (appPool) {
			await appPool.end();
		}
		// Add a small delay to ensure all connections are properly closed
		await new Promise((resolve) => setTimeout(resolve, 100));
	});

	describe('GET /api/tasks', () => {
		it('should return an empty array when no tasks exist', async () => {
			const response = await request(app).get('/api/tasks').expect(200);

			expect(response.body.tasks).toEqual([]);
			verifyPagination(response.body.pagination, {
				total: 0,
				page: 1,
				limit: 10,
				totalPages: 0,
			});
		});

		it('should return tasks when they exist', async () => {
			// Create a test task
			const createdTask = await createTask(app);

			// Get all tasks
			const response = await request(app).get('/api/tasks').expect(200);

			expect(response.body.tasks).toHaveLength(1);
			verifyTaskProperties(response.body.tasks[0], {
				title: defaultTask.title,
				description: defaultTask.description,
				status: defaultTask.status,
				priority: defaultTask.priority,
			});
			verifyPagination(response.body.pagination, {
				total: 1,
				page: 1,
				limit: 10,
				totalPages: 1,
			});
		});
	});

	describe('GET /api/tasks/:id', () => {
		it('should return a single task when it exists', async () => {
			// Create a test task
			const createdTask = await createTask(app);

			// Get the specific task
			const response = await request(app)
				.get(`/api/tasks/${createdTask.id}`)
				.expect(200);

			verifyTaskProperties(response.body, {
				id: createdTask.id,
				title: defaultTask.title,
				description: defaultTask.description,
				status: defaultTask.status,
				priority: defaultTask.priority,
			});
			expect(response.body.created_at).toBeDefined();
			expect(response.body.updated_at).toBeDefined();
		});

		it('should return 404 when task does not exist', async () => {
			const response = await request(app)
				.get('/api/tasks/999999')
				.expect(404);

			expect(response.body.error).toBe('Task not found');
		});
	});

	describe('POST /api/tasks', () => {
		it('should create a new task with valid data', async () => {
			const response = await request(app)
				.post('/api/tasks')
				.send(defaultTask)
				.expect(201);

			expect(response.body.id).toBeDefined();
			verifyTaskProperties(response.body, {
				title: defaultTask.title,
				description: defaultTask.description,
				status: defaultTask.status,
				priority: defaultTask.priority,
			});
			expect(response.body.due_date).toBeDefined();
			expect(response.body.created_at).toBeDefined();
			expect(response.body.updated_at).toBeDefined();
		});

		it('should create a task with minimal required data', async () => {
			const minimalTask = { title: 'Minimal Task' };

			const response = await request(app)
				.post('/api/tasks')
				.send(minimalTask)
				.expect(201);

			verifyTaskProperties(response.body, {
				title: 'Minimal Task',
				description: null,
				status: 'Not Started',
				priority: 'Medium',
				due_date: null,
			});
		});

		it('should return 500 for invalid status value', async () => {
			const invalidTask = { ...defaultTask, status: 'InvalidStatus' };

			await withSuppressedConsoleError(async () => {
				const response = await request(app)
					.post('/api/tasks')
					.send(invalidTask)
					.expect(500);

				expect(response.body.error).toBe('Internal server error');
			});
		});

		it('should return 500 for invalid priority value', async () => {
			const invalidTask = { ...defaultTask, priority: 'InvalidPriority' };

			await withSuppressedConsoleError(async () => {
				const response = await request(app)
					.post('/api/tasks')
					.send(invalidTask)
					.expect(500);

				expect(response.body.error).toBe('Internal server error');
			});
		});
	});

	describe('PUT /api/tasks/:id', () => {
		it('should update an existing task with valid data', async () => {
			// Create a task first
			const createdTask = await createTask(app);

			// Update the task
			const updatedTask = {
				title: 'Updated Task Title',
				description: 'Updated Description',
				status: 'In Progress',
				priority: 'High',
				due_date: '2024-02-01',
			};

			const response = await request(app)
				.put(`/api/tasks/${createdTask.id}`)
				.send(updatedTask)
				.expect(200);

			verifyTaskProperties(response.body, {
				id: createdTask.id,
				...updatedTask,
			});
			expect(response.body.due_date).toBeDefined();
			expect(response.body.updated_at).toBeDefined();

			// Verify the task was actually updated in the database
			const getResponse = await request(app)
				.get(`/api/tasks/${createdTask.id}`)
				.expect(200);

			verifyTaskProperties(getResponse.body, {
				title: updatedTask.title,
				status: updatedTask.status,
			});
		});

		it('should update a task with partial data', async () => {
			// Create a task first
			const createdTask = await createTask(app);

			// Update only the title
			const partialUpdate = { title: 'Partially Updated Title' };

			const response = await request(app)
				.put(`/api/tasks/${createdTask.id}`)
				.send(partialUpdate)
				.expect(200);

			verifyTaskProperties(response.body, {
				title: partialUpdate.title,
				description: defaultTask.description,
				status: defaultTask.status,
				priority: defaultTask.priority,
			});
		});

		it('should return 404 when updating non-existent task', async () => {
			const updatedTask = {
				title: 'Updated Task',
				description: 'Updated Description',
				status: 'In Progress',
				priority: 'High',
				due_date: '2024-02-01',
			};

			const response = await request(app)
				.put('/api/tasks/999999')
				.send(updatedTask)
				.expect(404);

			expect(response.body.error).toBe('Task not found');
		});

		it('should return 500 for invalid status value', async () => {
			// Create a task first
			const createdTask = await createTask(app);

			const invalidUpdate = { ...defaultTask, status: 'InvalidStatus' };

			await withSuppressedConsoleError(async () => {
				const response = await request(app)
					.put(`/api/tasks/${createdTask.id}`)
					.send(invalidUpdate)
					.expect(500);

				expect(response.body.error).toBe('Internal server error');
			});
		});

		it('should return 500 for invalid priority value', async () => {
			// Create a task first
			const createdTask = await createTask(app);

			const invalidUpdate = {
				...defaultTask,
				priority: 'InvalidPriority',
			};

			await withSuppressedConsoleError(async () => {
				const response = await request(app)
					.put(`/api/tasks/${createdTask.id}`)
					.send(invalidUpdate)
					.expect(500);

				expect(response.body.error).toBe('Internal server error');
			});
		});
	});

	describe('DELETE /api/tasks/:id', () => {
		it('should delete an existing task', async () => {
			// Create a task first
			const createdTask = await createTask(app);

			// Verify the task exists
			await request(app).get(`/api/tasks/${createdTask.id}`).expect(200);

			// Delete the task
			const response = await request(app)
				.delete(`/api/tasks/${createdTask.id}`)
				.expect(200);

			expect(response.body.message).toBe('Task deleted successfully');

			// Verify the task is actually deleted
			await request(app).get(`/api/tasks/${createdTask.id}`).expect(404);
		});

		it('should return 404 when deleting non-existent task', async () => {
			const response = await request(app)
				.delete('/api/tasks/999999')
				.expect(404);

			expect(response.body.error).toBe('Task not found');
		});

		it('should handle multiple deletions correctly', async () => {
			// Create multiple tasks
			const task1 = await createTask(app);
			const task2 = await createTask(app, { title: 'Second Task' });

			// Verify both tasks exist
			const getResponse = await request(app)
				.get('/api/tasks')
				.expect(200);

			expect(getResponse.body.tasks).toHaveLength(2);

			// Delete first task
			await request(app).delete(`/api/tasks/${task1.id}`).expect(200);

			// Verify only one task remains
			const getResponse2 = await request(app)
				.get('/api/tasks')
				.expect(200);

			expect(getResponse2.body.tasks).toHaveLength(1);
			expect(getResponse2.body.tasks[0].id).toBe(task2.id);

			// Delete second task
			await request(app).delete(`/api/tasks/${task2.id}`).expect(200);

			// Verify no tasks remain
			const getResponse3 = await request(app)
				.get('/api/tasks')
				.expect(200);

			expect(getResponse3.body.tasks).toHaveLength(0);
		});
	});

	describe('GET /api/tasks with query parameters', () => {
		it('should search tasks by title or description', async () => {
			// Create tasks with different titles and descriptions
			await createMultipleTasks(app, createSearchTestData());

			// Search for 'JavaScript'
			const response = await request(app)
				.get('/api/tasks?search=JavaScript')
				.expect(200);

			expect(response.body.tasks).toHaveLength(2); // Matches title and description
			expect(response.body.pagination.total).toBe(2);
		});

		it('should filter tasks by date range', async () => {
			// Create tasks with different due dates
			await createMultipleTasks(app, createDateTestData());

			// Filter by date range
			const response = await request(app)
				.get('/api/tasks?startDate=2024-02-01&endDate=2024-05-01')
				.expect(200);

			expect(response.body.tasks).toHaveLength(1);
			expect(response.body.tasks[0].title).toBe('Later Task');
			expect(response.body.pagination.total).toBe(1);
		});

		it('should sort tasks by due_date in ascending order', async () => {
			// Create tasks with different due dates
			await createMultipleTasks(app, createDateTestData());

			// Sort by due_date ascending
			const response = await request(app)
				.get('/api/tasks?sortBy=due_date&sortOrder=asc')
				.expect(200);

			expect(response.body.tasks).toHaveLength(3);
			expect(response.body.tasks[0].title).toBe('Test Task');
			expect(response.body.tasks[1].title).toBe('Later Task');
			expect(response.body.tasks[2].title).toBe('Much Later Task');
		});

		it('should sort tasks by priority in descending order', async () => {
			// Create tasks with different priorities
			await createMultipleTasks(app, createPriorityTestData());

			// Sort by priority descending
			const response = await request(app)
				.get('/api/tasks?sortBy=priority&sortOrder=desc')
				.expect(200);

			expect(response.body.tasks).toHaveLength(3);
			expect(response.body.tasks[0].priority).toBe('Medium');
			expect(response.body.tasks[1].priority).toBe('Low');
			expect(response.body.tasks[2].priority).toBe('High');
		});

		it('should paginate results correctly', async () => {
			// Create multiple tasks
			const tasks = [];
			for (let i = 1; i <= 15; i++) {
				const task = await createTask(app, { title: `Task ${i}` });
				tasks.push(task);
			}

			// Get first page with 5 items
			const response1 = await request(app)
				.get('/api/tasks?page=1&limit=5')
				.expect(200);

			expect(response1.body.tasks).toHaveLength(5);
			verifyPagination(response1.body.pagination, {
				total: 15,
				page: 1,
				limit: 5,
				totalPages: 3,
			});

			// Get second page
			const response2 = await request(app)
				.get('/api/tasks?page=2&limit=5')
				.expect(200);

			expect(response2.body.tasks).toHaveLength(5);
			verifyPagination(response2.body.pagination, {
				total: 15,
				page: 2,
				limit: 5,
				totalPages: 3,
			});

			// Get third page (should have remaining 5 items)
			const response3 = await request(app)
				.get('/api/tasks?page=3&limit=5')
				.expect(200);

			expect(response3.body.tasks).toHaveLength(5);
			verifyPagination(response3.body.pagination, {
				total: 15,
				page: 3,
				limit: 5,
				totalPages: 3,
			});
		});

		it('should handle invalid sort parameters gracefully', async () => {
			// Create a task
			await createTask(app);

			// Try to sort by invalid field
			const response = await request(app)
				.get('/api/tasks?sortBy=invalid_field&sortOrder=asc')
				.expect(200);

			// Should still return results with default sorting
			expect(response.body.tasks).toHaveLength(1);
			expect(response.body.pagination.total).toBe(1);
		});

		it('should handle database errors gracefully', async () => {
			// Try to get tasks with an invalid date format that causes DB error
			const response = await request(app)
				.get('/api/tasks?startDate=invalid-date-format')
				.expect(500); // Invalid date format causes database error

			expect(response.body.error).toBe('Internal server error');
		});
	});

	describe('GET /api/tasks filtering', () => {
		test.each([
			{
				label: 'status',
				createData: createStatusTestData,
				query: 'status=Not Started',
				field: 'status',
				value: 'Not Started',
			},
			{
				label: 'priority',
				createData: createPriorityTestData,
				query: 'priority=High',
				field: 'priority',
				value: 'High',
			},
		])(
			'should filter tasks by $label',
			async ({ createData, query, field, value }) => {
				await createMultipleTasks(app, createData());
				const response = await request(app)
					.get(`/api/tasks?${query}`)
					.expect(200);
				expect(response.body.tasks).toHaveLength(1);
				expect(response.body.tasks[0][field]).toBe(value);
				expect(response.body.pagination.total).toBe(1);
			}
		);
	});

	describe('Error handling', () => {
		it('should handle invalid task ID format', async () => {
			await withSuppressedConsoleError(async () => {
				const response = await request(app)
					.get('/api/tasks/invalid-id')
					.expect(500);

				expect(response.body.error).toBe('Internal server error');
			});
		});

		it('should handle invalid task ID format for PUT', async () => {
			await withSuppressedConsoleError(async () => {
				const response = await request(app)
					.put('/api/tasks/invalid-id')
					.send(defaultTask)
					.expect(500);

				expect(response.body.error).toBe('Internal server error');
			});
		});

		it('should handle invalid task ID format for DELETE', async () => {
			await withSuppressedConsoleError(async () => {
				const response = await request(app)
					.delete('/api/tasks/invalid-id')
					.expect(500);

				expect(response.body.error).toBe('Internal server error');
			});
		});

		it('should test the root endpoint', async () => {
			const response = await request(app).get('/').expect(200);

			expect(response.body.message).toBe('Welcome to TaskFlow API');
		});
	});
});
