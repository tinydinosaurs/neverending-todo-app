import { formatEnum } from '@utils/format';

describe('formatEnum', () => {
	it('should format enum values with spaces before capital letters', () => {
		expect(formatEnum('InProgress')).toBe('In Progress');
		expect(formatEnum('NotStarted')).toBe('Not Started');
		expect(formatEnum('HighPriority')).toBe('High Priority');
	});

	it('should capitalize the first letter', () => {
		expect(formatEnum('low')).toBe('Low');
		expect(formatEnum('medium')).toBe('Medium');
		expect(formatEnum('high')).toBe('High');
	});

	it('should handle already formatted strings', () => {
		expect(formatEnum('Not Started')).toBe('Not Started');
		expect(formatEnum('In Progress')).toBe('In Progress');
		expect(formatEnum('Completed')).toBe('Completed');
	});

	it('should handle null and undefined values', () => {
		expect(formatEnum(null)).toBe('');
		expect(formatEnum(undefined)).toBe('');
	});

	it('should handle empty strings', () => {
		expect(formatEnum('')).toBe('');
	});

	it('should handle single characters', () => {
		expect(formatEnum('A')).toBe('A');
		expect(formatEnum('a')).toBe('A');
	});

	it('should handle strings with numbers', () => {
		expect(formatEnum('Task1')).toBe('Task 1');
		expect(formatEnum('Priority2')).toBe('Priority 2');
	});

	it('should handle multiple consecutive capitals', () => {
		expect(formatEnum('APIResponse')).toBe('API Response');
		expect(formatEnum('HTTPRequest')).toBe('HTTP Request');
	});
});
