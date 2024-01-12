Cypress.Commands.add('getByData', (selector) => cy.get(`[data-test=${selector}]`));

Cypress.Commands.add('formSuccessSubmit', () => {
  cy.intercept(
    {
      method: 'POST',
      url: `https://api.hsforms.com/submissions/v3/integration/submit/**`,
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
      url: `https://api.hsforms.com/submissions/v3/integration/submit/**`,
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
  if (err.message.includes('analytics.user is not a function')) {
    // returning false here prevents Cypress from failing the test
    return false;
  }
  // If it's a different error, you might want to see it
  return true;
});
