describe('Blog Post Subscribe Form', () => {
  beforeEach(() => {
    cy.visit('/blog/neon-serverless-postgres-is-live');
  });

  it('allows users to subscribe to blog post', () => {
    cy.formSuccessSubmit();
    cy.get("input[name='email']").type('info@example.com');
    cy.get('form').submit();

    cy.wait('@formSuccessSubmit');
    cy.getByData('success-message').should('exist');
  });

  it('displays an error message when the form is submitted with no valid email', () => {
    cy.get('input[name="email"]').type('info');
    cy.get('form').submit();

    cy.getByData('error-message').should('exist');
  });

  it('displays an error message when the form is submitted with no email', () => {
    cy.get('button[type="submit"]').click();
    cy.get('[data-test=error-message]').should('exist');
  });

  it('displays an error message when there is server error', () => {
    cy.formErrorSubmit();
    cy.get("input[name='email']").type('info@example.com');
    cy.get('form').submit();

    cy.wait('@formErrorSubmit');
    cy.getByData('error-message').should('exist').contains('Please reload the page and try again');
  });
});
