module.exports = {
	testEnvironment: 'jsdom',
	resetMocks: true,
	moduleFileExtensions: [
		'js',
		'json',
		'ts',
		'tsx'
	],
	testPathIgnorePatterns : [
		"<rootDir>/src/__tests__/svgTransform.js" 
	],
	transform: {
		'\\.(ts|tsx)$': 'ts-jest',
		"^.+\\.svg$": "<rootDir>/src/__tests__/svgTransform.js"
	}
}