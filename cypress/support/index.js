Cypress.on('uncaught:exception', (err) => {
  console.log('Uncaught exception:', err);
  return false; // Temporarily return false for all exceptions
});
