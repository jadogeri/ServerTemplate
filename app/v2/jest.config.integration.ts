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
  globalTeardown: '<rootDir>/tests/__configurations__/global-teardown-integration.ts',
  setupFilesAfterEnv: ['<rootDir>/tests/__configurations__/setupFilesAfterEnv-integration.ts'],
  globalSetup: '<rootDir>/tests/__configurations__/global-setup-integration.ts',
  testRunner: "jest-circus/runner",
  workerIdleMemoryLimit: "512MB",
  coveragePathIgnorePatterns: [
      "<rootDir>/tests/"
  ]

};

       

