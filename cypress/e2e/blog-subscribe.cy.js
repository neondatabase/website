describe('Blog Index Subscribe Form', () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    cy.visit('/blog');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.setTimeout(() => {}, 0);
    });
  });

  it('allows users to subscribe to blog index page', () => {
    cy.formSuccessSubmit();

    cy.get('#changelog-form').within(() => {
      cy.get("input[name='email']").type('test+skipform@hubspot.com');
      cy.get('form').submit();
    });

    cy.wait('@formSuccessSubmit');
    cy.getByData('success-message').should('exist');
  });

  it('displays an error message when the form is submitted with no email', () => {
    cy.get('#changelog-form').within(() => {
      cy.get('form').submit();
    });

    cy.getByData('error-message').should('exist');
  });

  it('displays an error message when the form is submitted with no valid email', () => {
    cy.get('#changelog-form').within(() => {
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('form').submit();
    });

    cy.getByData('error-message').should('exist');
  });

  it('displays an error message when there is server error', () => {
    cy.formErrorSubmit();

    cy.get('#changelog-form').within(() => {
      cy.get("input[name='email']").type('test+skipform@hubspot.com');
      cy.get('form').submit();
    });

    cy.wait('@formErrorSubmit');
    cy.getByData('error-message').should('exist').contains('Please reload the page and try again');
  });
});
