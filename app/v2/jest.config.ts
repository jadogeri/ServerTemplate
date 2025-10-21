module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ['./tests/setupTests.ts',// './tests/v2/setupTests.ts'

    ],
    testMatch: [
      '<rootDir>/tests/**/*.test.ts',
    ],

  };