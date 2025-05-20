const tsconfig = require("./tsconfig.json");
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

// jest.config.js
const baseConfig = {
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transformIgnorePatterns: [],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    ...moduleNameMapper,
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.(t|j)sx?$|.mjs$": ["@swc/jest"],
  },
  maxWorkers: "50%",
};

module.exports = {
  projects: [
    {
      ...baseConfig,
      displayName: "react-tests",
      testMatch: ["<rootDir>/src/**/*.test.tsx"],
      setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
      testEnvironment: "jsdom",
    },
    {
      ...baseConfig,
      displayName: "non-react-tests",
      testMatch: ["<rootDir>/src/**/*.test.[jt]s"],
      testEnvironment: "node",
    },
  ],
};
