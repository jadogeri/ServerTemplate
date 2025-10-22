
 import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
//   transformIgnorePatterns: ["/node_modules/(?!(@josephadogeridev/auth-credential-validator-ts)/)"],
  globalTeardown: '<rootDir>/tests/global-teardown-unit.ts',
  setupFilesAfterEnv: ['<rootDir>/setup.unit.ts'],
  globalSetup: '<rootDir>/tests/global-teardown.ts',
  testRunner: "jest-circus/runner",
  workerIdleMemoryLimit: "512MB",
  coveragePathIgnorePatterns: [
      "<rootDir>/tests/"
  ]

};

       