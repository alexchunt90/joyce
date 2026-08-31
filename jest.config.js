module.exports = {
	verbose: true,
	testEnvironment: 'jsdom',
	// Replaces the removed `testURL` option (Jest 28+). The app builds absolute API
	// URLs from the host, and src/modules/api.js reads document.cookie for CSRF,
	// so tests need a real origin rather than "about:blank".
	testEnvironmentOptions: {
		url: 'https://localhost'
	},
	testPathIgnorePatterns: ['/node_modules/'],
	// Polyfills jsdom is missing that draft-convert's dependencies need at import time.
	setupFiles: ['<rootDir>/tests/setup.js'],
	moduleNameMapper: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$': '<rootDir>/tests/__mocks__/fileMock.js',
		'\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js'
	}
}
