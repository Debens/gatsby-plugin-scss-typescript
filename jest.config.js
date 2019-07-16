const package = require('./package');

module.exports = {
    cacheDirectory: '<rootDir>/test/.jest/cache',
    coverageDirectory: '<rootDir>/test/coverage',
    coveragePathIgnorePatterns: ['node_modules'],
    // setupFiles: ['<rootDir>/jest/globals.ts'],
    coverageReporters: ['lcov', 'json', 'text'],
    coverageThreshold: {
        global: {
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85,
        },
    },
    displayName: package.name,
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.json',
        },
        window: {},
    },
    moduleFileExtensions: ['js', 'ts'],
    name: package.name,
    reporters: ['default'],
    snapshotSerializers: ['<rootDir>/test/serializer.ts'],
    testPathIgnorePatterns: ['\\.snap$', 'node_modules/'],
    transform: {
        '\\.(ts|tsx)$': 'ts-jest',
    },
    verbose: true,
};
