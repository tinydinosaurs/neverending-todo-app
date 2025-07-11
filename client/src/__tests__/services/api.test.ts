import { taskApi } from '../../services/api';
import { apiRequest } from '../../services/apiHelper';
import { TaskStatus, TaskPriority } from '../../types/task';

// Mock the apiHelper
jest.mock('../../services/apiHelper', () => ({
	apiRequest: jest.fn(),
}));

const mockApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('taskApi', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getTasks', () => {
		it('fetches tasks without filters', async () => {
			const mockTasks = [
				{
					id: 1,
					title: 'Test Task',
					description: 'Test Description',
					status: TaskStatus.NOTSTARTED,
					priority: TaskPriority.MEDIUM,
					due_date: '2024-01-01',
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
				},
			];

			mockApiRequest.mockResolvedValue({ tasks: mockTasks });

			const result = await taskApi.getTasks();

			expect(mockApiRequest).toHaveBeenCalledWith(
				'http://localhost:5001/api/tasks?'
			);
			expect(result).toEqual(mockTasks);
		});

		it('fetches tasks with status filter', async () => {
			const mockTasks = [
				{
					id: 1,
					title: 'Test Task',
					description: 'Test Description',
					status: TaskStatus.NOTSTARTED,
					priority: TaskPriority.MEDIUM,
					due_date: '2024-01-01',
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
				},
			];

			mockApiRequest.mockResolvedValue({ tasks: mockTasks });

			const result = await taskApi.getTasks({ status: 'Not Started' });

			expect(mockApiRequest).toHaveBeenCalledWith(
				'http://localhost:5001/api/tasks?status=Not+Started'
			);
			expect(result).toEqual(mockTasks);
		});

		it('fetches tasks with priority filter', async () => {
			const mockTasks = [
				{
					id: 1,
					title: 'Test Task',
					description: 'Test Description',
					status: TaskStatus.NOTSTARTED,
					priority: TaskPriority.HIGH,
					due_date: '2024-01-01',
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
				},
			];

			mockApiRequest.mockResolvedValue({ tasks: mockTasks });

			const result = await taskApi.getTasks({ priority: 'High' });

			expect(mockApiRequest).toHaveBeenCalledWith(
				'http://localhost:5001/api/tasks?priority=High'
			);
			expect(result).toEqual(mockTasks);
		});

		it('fetches tasks with both status and priority filters', async () => {
			const mockTasks = [
				{
					id: 1,
					title: 'Test Task',
					description: 'Test Description',
					status: TaskStatus.INPROGRESS,
					priority: TaskPriority.HIGH,
					due_date: '2024-01-01',
					created_at: '2024-01-01T00:00:00Z',
					updated_at: '2024-01-01T00:00:00Z',
				},
			];

			mockApiRequest.mockResolvedValue({ tasks: mockTasks });

			const result = await taskApi.getTasks({
				status: 'In Progress',
				priority: 'High',
			});

			expect(mockApiRequest).toHaveBeenCalledWith(
				'http://localhost:5001/api/tasks?status=In+Progress&priority=High'
			);
			expect(result).toEqual(mockTasks);
		});

		it('handles empty filters', async () => {
			const mockTasks: any[] = [];
			mockApiRequest.mockResolvedValue({ tasks: mockTasks });

			const result = await taskApi.getTasks({});

			expect(mockApiRequest).toHaveBeenCalledWith(
				'http://localhost:5001/api/tasks?'
			);
			expect(result).toEqual(mockTasks);
		});
	});

	describe('createTask', () => {
		it('creates a new task', async () => {
			const newTask = {
				title: 'New Task',
				description: 'New Description',
				status: TaskStatus.NOTSTARTED,
				priority: TaskPriority.MEDIUM,
				due_date: '2024-01-01',
			};

			const createdTask = {
				...newTask,
				id: 1,
				created_at: '2024-01-01T00:00:00Z',
				updated_at: '2024-01-01T00:00:00Z',
			};

			mockApiRequest.mockResolvedValue(createdTask);

			const result = await taskApi.createTask(newTask);

			expect(mockApiRequest).toHaveBeenCalledWith(
				'http://localhost:5001/api/tasks',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newTask),
				}
			);
			expect(result).toEqual(createdTask);
		});

		it('creates a task with empty due_date', async () => {
			const newTask = {
				title: 'New Task',
				description: 'New Description',
				status: TaskStatus.NOTSTARTED,
				priority: TaskPriority.MEDIUM,
				due_date: '',
			};

			const createdTask = {
				...newTask,
				id: 1,
				created_at: '2024-01-01T00:00:00Z',
				updated_at: '2024-01-01T00:00:00Z',
			};

			mockApiRequest.mockResolvedValue(createdTask);

			const result = await taskApi.createTask(newTask);

			expect(mockApiRequest).toHaveBeenCalledWith(
				'http://localhost:5001/api/tasks',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newTask),
				}
			);
			expect(result).toEqual(createdTask);
		});
	});

	describe('updateTask', () => {
		it('updates an existing task', async () => {
			const taskId = 1;
			const updatedTask = {
				title: 'Updated Task',
				description: 'Updated Description',
				status: TaskStatus.COMPLETED,
				priority: TaskPriority.HIGH,
				due_date: '2024-01-02',
			};

			const resultTask = {
				...updatedTask,
				id: taskId,
				created_at: '2024-01-01T00:00:00Z',
				updated_at: '2024-01-02T00:00:00Z',
			};

			mockApiRequest.mockResolvedValue(resultTask);

			const result = await taskApi.updateTask(taskId, updatedTask);

			expect(mockApiRequest).toHaveBeenCalledWith(
				`http://localhost:5001/api/tasks/${taskId}`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updatedTask),
				}
			);
			expect(result).toEqual(resultTask);
		});

		it('updates a task with empty due_date', async () => {
			const taskId = 1;
			const updatedTask = {
				title: 'Updated Task',
				description: 'Updated Description',
				status: TaskStatus.COMPLETED,
				priority: TaskPriority.HIGH,
				due_date: '',
			};

			const resultTask = {
				...updatedTask,
				id: taskId,
				created_at: '2024-01-01T00:00:00Z',
				updated_at: '2024-01-02T00:00:00Z',
			};

			mockApiRequest.mockResolvedValue(resultTask);

			const result = await taskApi.updateTask(taskId, updatedTask);

			expect(mockApiRequest).toHaveBeenCalledWith(
				`http://localhost:5001/api/tasks/${taskId}`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updatedTask),
				}
			);
			expect(result).toEqual(resultTask);
		});
	});

	describe('deleteTask', () => {
		it('deletes a task', async () => {
			const taskId = 1;
			mockApiRequest.mockResolvedValue(undefined);

			await taskApi.deleteTask(taskId);

			expect(mockApiRequest).toHaveBeenCalledWith(
				`http://localhost:5001/api/tasks/${taskId}`,
				{
					method: 'DELETE',
				}
			);
		});

		it('deletes a task with different ID', async () => {
			const taskId = 999;
			mockApiRequest.mockResolvedValue(undefined);

			await taskApi.deleteTask(taskId);

			expect(mockApiRequest).toHaveBeenCalledWith(
				`http://localhost:5001/api/tasks/${taskId}`,
				{
					method: 'DELETE',
				}
			);
		});
	});

	describe('error handling', () => {
		it('propagates errors from apiRequest', async () => {
			const error = new Error('API Error');
			mockApiRequest.mockRejectedValue(error);

			await expect(taskApi.getTasks()).rejects.toThrow('API Error');
		});

		it('handles network errors', async () => {
			const error = new Error('Network Error');
			mockApiRequest.mockRejectedValue(error);

			await expect(
				taskApi.createTask({
					title: 'Test',
					description: 'Test',
					status: TaskStatus.NOTSTARTED,
					priority: TaskPriority.MEDIUM,
					due_date: '',
				})
			).rejects.toThrow('Network Error');
		});
	});
});
