describe('Changelog Subscribe Form', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/docs/changelog');
  });

  it('allows users to subscribe at changelog page', () => {
    cy.formSuccessSubmit();

    cy.get('.sticky > #changelog-form').within(() => {
      cy.get("input[name='email']").type('test+skipform@hubspot.com', { force: true });
      cy.get('form').submit();
    });

    cy.wait('@formSuccessSubmit');
    cy.getByData('success-message').should('exist');
  });

  it('displays an error message when the form is submitted with no email', () => {
    cy.get('.sticky > #changelog-form').within(() => {
      cy.get('input[name="email"]').type(' ', { force: true });
      cy.get('form').submit();
    });

    cy.getByData('error-message').should('exist');
  });

  it('displays an error message when the form is submitted with no valid email', () => {
    cy.get('.sticky > #changelog-form').within(() => {
      cy.get('input[name="email"]').type('test-email', { force: true });
      cy.get('form').submit();
    });

    cy.getByData('error-message').should('exist');
  });

  it('displays an error message when there is server error', () => {
    cy.formErrorSubmit();

    cy.get('.sticky > #changelog-form').within(() => {
      cy.get("input[name='email']").type('test+skipform@hubspot.com', { force: true });
      cy.get('form').submit();
    });

    cy.wait('@formErrorSubmit');
    cy.getByData('error-message').should('exist');
  });
});
