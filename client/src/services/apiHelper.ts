// client/src/services/apiHelper.ts
export async function apiRequest<T>(
	url: string,
	options?: RequestInit
): Promise<T> {
	const response = await fetch(url, options);
	if (!response.ok) {
		let errorMsg = 'API error';
		try {
			const errorData = await response.json();
			errorMsg = errorData.error || errorMsg;
		} catch {}
		throw new Error(errorMsg);
	}
	return response.json();
}
