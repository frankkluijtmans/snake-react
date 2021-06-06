module.exports = {
	testEnvironment: 'jsdom',
	moduleFileExtensions: [
		'js',
		'json',
		'ts',
		'tsx'
	],
	setupFiles: [
		"<rootDir>/src/__tests__/setup.ts"
	],
	testPathIgnorePatterns : [
		"<rootDir>/src/__tests__/svgTransform.js",
		"<rootDir>/src/__tests__/setup.ts"
	],
	transform: {
		'\\.(ts|tsx)$': 'ts-jest',
		"^.+\\.svg$": "<rootDir>/src/__tests__/svgTransform.js"
	}
}