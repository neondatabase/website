Cypress.Commands.add('getByData', (selector) => cy.get(`[data-test=${selector}]`));

Cypress.Commands.add('formSuccessSubmit', () => {
  cy.intercept(
    {
      method: 'POST',
      url: `/api/hubspot`,
    },
    {
      statusCode: 200,
      body: {
        status: 'success',
      },
    }
  ).as('formSuccessSubmit');
});

Cypress.Commands.add('formErrorSubmit', () => {
  cy.intercept(
    {
      method: 'POST', // or whatever method the form uses
      url: `/api/hubspot`,
    },
    {
      statusCode: 500,
      body: {
        error: 'Internal server error',
      },
    }
  ).as('formErrorSubmit');
});

Cypress.on('uncaught:exception', (err) => {
  // expect the error message to include 'analytics.user is not a function'
  if (err.message.includes('analytics.user is not a functio')) {
    // returning false here prevents Cypress from failing the tes
    return false;
  }
  // If it's a different error, you might want to see it
  return true;
});
