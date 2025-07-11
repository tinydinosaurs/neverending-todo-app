import { apiRequest } from '@services/apiHelper';

global.fetch = jest.fn();

describe('apiRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return parsed JSON response for successful request', async () => {
		const mockResponse = { data: 'test' };
		const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockResponse,
		} as unknown as Response);

		const result = await apiRequest<typeof mockResponse>('/test');

		expect(result).toEqual(mockResponse);
		expect(mockFetch).toHaveBeenCalledWith('/test', undefined);
	});

	it('should handle request options', async () => {
		const mockResponse = { data: 'test' };
		const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockResponse,
		} as unknown as Response);

		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ test: 'data' }),
		};

		await apiRequest('/test', options);

		expect(mockFetch).toHaveBeenCalledWith('/test', options);
	});

	it('should throw error for non-ok response with error message from JSON', async () => {
		const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 400,
			json: async () => ({ error: 'Bad Request' }),
		} as unknown as Response);

		await expect(apiRequest('/test')).rejects.toThrow('Bad Request');
	});

	it('should throw default error message when JSON parsing fails', async () => {
		const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 500,
			json: async () => {
				throw new Error('JSON parse error');
			},
		} as unknown as Response);

		await expect(apiRequest('/test')).rejects.toThrow('API error');
	});

	it('should throw default error message when response has no error field', async () => {
		const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 404,
			json: async () => ({ message: 'Not found' }),
		} as unknown as Response);

		await expect(apiRequest('/test')).rejects.toThrow('API error');
	});
});
