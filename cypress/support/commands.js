Cypress.Commands.add('getByData', (selector) => cy.get(`[data-test=${selector}]`));

Cypress.Commands.add('formSuccessSubmit', () => {
  cy.window()
    .then((win) => {
      // Mock zaraz for successful gtag events
      Object.assign(win, {
        zaraz: {
          track: cy.stub().resolves().as('zarazTrackSpy'),
        },
      });
    })
    .as('formSuccessSubmit');
});

Cypress.Commands.add('formErrorSubmit', () => {
  cy.window()
    .then((win) => {
      // Mock zaraz for failed gtag events
      Object.assign(win, {
        zaraz: {
          track: cy.stub().rejects(new Error('Network error')).as('zarazTrackSpy'),
        },
      });
    })
    .as('formErrorSubmit');
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
