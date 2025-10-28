
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
  globalTeardown: '<rootDir>/tests/__configurations__/global-teardown-e2e.ts',
  setupFilesAfterEnv: ['<rootDir>/tests/__configurations__/setupFilesAfterEnv-e2d.ts'],
  globalSetup: '<rootDir>/tests/__configurations__/global-setup-e2e.ts',
  testRunner: "jest-circus/runner",
  workerIdleMemoryLimit: "512MB",
  coveragePathIgnorePatterns: [
      "<rootDir>/src/tests/"
  ]

};

       