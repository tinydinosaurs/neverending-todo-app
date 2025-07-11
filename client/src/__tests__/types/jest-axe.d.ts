import 'jest-axe/extend-expect';

declare namespace jest {
	interface Matchers<R> {
		toHaveNoViolations(): R;
	}
}

declare module 'jest-axe' {
	export const axe: any;
	export const toHaveNoViolations: any;
}
