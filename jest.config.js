module.exports = {
	verbose: true,
	testURL: 'https://localhost',
	testEnvironment: 'jsdom',
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$': '<rootDir>/tests/__mocks__/fileMock.js',
      '\\.(css|less)$': '<rootDir>/tests/__mocks__/styleMock.js'
    }	
};