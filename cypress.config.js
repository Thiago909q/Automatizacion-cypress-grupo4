const { defineConfig } = require("cypress");
const { baseUrl } = require("./scripts/settings.cjs");

module.exports = defineConfig({
  viewportWidth: 1366,
  viewportHeight: 900,
  screenshotOnRunFailure: true,
  video: false,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 30000,
  e2e: {
    baseUrl,
    specPattern: "cypress/e2e/**/*.cy.js",
    testIsolation: true,
  },
});
