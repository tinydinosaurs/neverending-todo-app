// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
if (typeof global.structuredClone !== 'function') {
	global.structuredClone = (obj) => {
		if (obj === undefined) return undefined;
		return JSON.parse(JSON.stringify(obj));
	};
}

beforeAll(() => {
	jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
	if (jest.isMockFunction(console.error)) {
		(console.error as jest.Mock).mockRestore();
	}
});
