const { defineConfig } = require("cypress");

module.exports = defineConfig({
  expose: {
    REVIEW_SERVICE_ID: process.env.CYPRESS_REVIEW_SERVICE_ID || null,
    REVIEW_BOOKING_ID: process.env.CYPRESS_REVIEW_BOOKING_ID || null,
    REVIEW_CREDENTIALS_CONFIGURED: Boolean(process.env.CYPRESS_REVIEW_EMAIL && process.env.CYPRESS_REVIEW_PASSWORD),
  },
  e2e: {
    ...(process.env.CYPRESS_BASE_URL ? { baseUrl: process.env.CYPRESS_BASE_URL } : {}),
    specPattern: "cypress/e2e/**/*.cy.js",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
