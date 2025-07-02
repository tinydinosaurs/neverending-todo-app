/**
 * Formats an enum value for display by inserting spaces before capital letters and capitalizing the first letter.
 * This improves readability for users and accessibility for screen readers.
 * Example: 'InProgress' -> 'In Progress', 'NOTSTARTED' -> 'NOTSTARTED'
 */
export function formatEnum(value: string | null | undefined): string {
	if (!value) return '';
	// Insert a space before each uppercase letter, then capitalize the first letter
	return value
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, (s) => s.toUpperCase())
		.trim();
}
