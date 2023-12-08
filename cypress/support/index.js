Cypress.on('uncaught:exception', (err) => {
  // Return false to prevent the test from failing
  if (err.message.includes('analytics.user is not a function')) {
    return false;
  }

  // Optional: Log the error for debugging purposes
  console.error('Uncaught exception detected:', err);
});
