const package = require('./package');

module.exports = {
    moduleFileExtensions: ['js', 'ts'],
    transform: {
        '\\.(ts|tsx)$': 'ts-jest',
    },
    testPathIgnorePatterns: ['\\.snap$', 'node_modules/'],
    cacheDirectory: '<rootDir>/.jest/cache',
    reporters: ['default'],
    coverageThreshold: {
        global: {
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85,
        },
    },
    coveragePathIgnorePatterns: ['node_modules'],
    // setupFiles: ['<rootDir>/jest/globals.ts'],
    coverageReporters: ['lcov', 'json', 'text'],
    coverageDirectory: '<rootDir>/coverage',
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.json',
        },
        window: {},
    },
    verbose: true,
    name: package.name,
    displayName: package.name,
};
