
 import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!(@josephadogeridev/auth-credential-validator-ts)/)"],
  globalTeardown: '<rootDir>/src/tests/global-teardown.ts',
  setupFilesAfterEnv: ['<rootDir>/tests/__configurations__/setup.e2e.ts'],
  globalSetup: '<rootDir>/tests/__configurations__/global-teardown-e2e.ts',
  testRunner: "jest-circus/runner",
  workerIdleMemoryLimit: "512MB",
  coveragePathIgnorePatterns: [
      "<rootDir>/src/tests/"
  ]

};

       