module.exports = {
	// Test environment
	testEnvironment: 'node',

	// Test file patterns - only match actual test files
	testMatch: [
		'**/__tests__/**/*.test.js',
		'**/__tests__/**/*.spec.js',
		'**/?(*.)+(spec|test).js',
	],
	testPathIgnorePatterns: ['/testUtils\\.js$/', '/utils\\.js$/'],

	// Coverage settings
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	collectCoverageFrom: [
		'src/**/*.js',
		'!src/**/*.test.js',
		'!src/**/*.spec.js',
	],

	// Test timeout (in milliseconds)
	testTimeout: 10000,

	// Clear mocks between tests
	clearMocks: true,

	// Verbose output
	verbose: true,
};
