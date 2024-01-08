describe('Contact Form', () => {
  beforeEach(() => {
    cy.visit('/contact-sales');
  });

  it('allows users to contact sales', () => {
    cy.formSuccessSubmit();

    cy.get("input[name='name']").type('Autotest');
    cy.get("input[name='email']").type('info@example.com');
    cy.get("textarea[name='message']").type('This is a test message');
    cy.get('form').submit();

    cy.wait('@formSuccessSubmit');
    cy.getByData('success-message').should('exist');
  });

  it('displays an error message when the form is submitted with no required fields filled in', () => {
    cy.get("input[name='name']").type('Autotest');
    cy.get('form').submit();
    cy.getByData('error-field-message').should('exist').contains('a required field');
  });

  it('displays an error message when there is server error', () => {
    cy.formErrorSubmit();

    cy.get("input[name='name']").type('Autotest');
    cy.get("input[name='email']").type('info@example.com');
    cy.get("textarea[name='message']").type('This is a test message');
    cy.get('form').submit();

    cy.wait('@formErrorSubmit');
    cy.getByData('error-message').should('exist').contains('Something went wrong');
  });
});
