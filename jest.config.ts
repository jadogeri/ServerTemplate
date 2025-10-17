module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ['./tests/v1/setupTests.ts',// './tests/v2/setupTests.ts'

    ],
    testMatch: [
      '<rootDir>/tests/v1/**/*.test.ts',
      '<rootDir>/tests/v2/**/*.test.ts'
    ],

  };