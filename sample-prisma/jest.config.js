/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "@quramy/jest-prisma-node/environment",
  testEnvironmentOptions: {
    verboseQuery: true,
  },
  setupFilesAfterEnv: ["<rootDir>/setup-prisma.js"],
};
