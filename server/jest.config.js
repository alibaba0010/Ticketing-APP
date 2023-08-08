// jest.config.js
const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@app/common(.*)$": "<rootDir>/path/to/common$1", // Adjust the path as needed
    // Add more aliases as needed
  },
};
