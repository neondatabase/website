Cypress.Commands.add('getByData', (selector) => cy.get(`[data-test=${selector}]`));

Cypress.Commands.add('formSuccessSubmit', () => {
  // Intercept HubSpot form submission and simulate success
  cy.intercept('POST', '/api/hubspot', {
    statusCode: 200,
    body: {},
  }).as('formSuccessSubmit');

  // Mock zaraz for successful gtag events
  cy.window().then((win) => {
    Object.assign(win, {
      zaraz: {
        track: cy.stub().resolves().as('zarazTrackSpy'),
      },
    });
  });
});

Cypress.Commands.add('formErrorSubmit', () => {
  // Intercept HubSpot form submission and simulate server error
  cy.intercept('POST', '/api/hubspot', {
    statusCode: 500,
    body: { message: 'Server error' },
  }).as('formErrorSubmit');

  // Mock zaraz for failed gtag events
  cy.window().then((win) => {
    Object.assign(win, {
      zaraz: {
        track: cy.stub().rejects(new Error('Network error')).as('zarazTrackSpy'),
      },
    });
  });
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
