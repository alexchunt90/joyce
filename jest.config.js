module.exports = {
	verbose: true,
	testEnvironment: 'jsdom',
	// Replaces the removed `testURL` option (Jest 28+). The app builds absolute API
	// URLs from the host, and src/modules/api.js reads document.cookie for CSRF,
	// so tests need a real origin rather than "about:blank".
	testEnvironmentOptions: {
		url: 'https://localhost'
	},
	// tests/smoke/ talks to a live server and mutates real data — never part of the
	// default run. Use `npm run test:smoke` to run it deliberately.
	testPathIgnorePatterns: [
		'/node_modules/',
		'<rootDir>/tests/smoke/'
	],
	moduleNameMapper: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$': '<rootDir>/tests/__mocks__/fileMock.js',
		'\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js'
	}
}
