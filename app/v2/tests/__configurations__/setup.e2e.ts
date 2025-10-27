// setup.e2e.ts

beforeEach(() => {
  console.log("running e2e global setup........................");
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.setTimeout(15000);
}); 