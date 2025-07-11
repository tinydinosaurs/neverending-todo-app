/**
 * Formats an enum value for display by inserting spaces before capital letters and capitalizing the first letter.
 * This improves readability for users and accessibility for screen readers.
 * Example: 'InProgress' -> 'In Progress', 'NOTSTARTED' -> 'NOTSTARTED'
 */
export function formatEnum(value: string | null | undefined): string {
	if (!value) return '';
	return (
		value
			// Insert space before a capital letter that follows a sequence of capitals and is followed by a lowercase letter
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
			// Insert space before a capital letter that follows a lowercase or number
			.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
			// Insert space between a letter and a number
			.replace(/([A-Za-z])([0-9])/g, '$1 $2')
			.replace(/^./, (s) => s.toUpperCase())
			.trim()
	);
}
