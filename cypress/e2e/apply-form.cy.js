describe('Apply Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/partners');
  });

  it('allows users to apply to become a partner', () => {
    cy.get("input[name='integration_type']").click({ force: true });
    cy.get("input[name='firstname']").type('Test');
    cy.get("input[name='lastname']").type('Test');
    cy.get("input[name='email']").type('info@example.com');
    cy.get("input[name='company']").type('Example, Inc.');
    cy.get("textarea[name='message']").type('I would like to become a partner.');
    cy.getByData('submit-button').click();
    cy.getByData('submit-button').should('exist').contains('Applied!');
  });

  it('displays an error message when the form is submitted with no required fields filled in', () => {
    cy.get("input[name='integration_type']").click({ force: true });
    cy.get("input[name='firstname']").type('Test');
    cy.get("input[name='lastname']").type('Test');
    cy.get('form').submit();
    cy.getByData('submit-button').should('exist').contains('Apply');
    cy.getByData('error-field-message').should('exist').contains('This is a required field');
  });

  it('displays an error message when there is server error', () => {
    cy.intercept(
      {
        method: 'POST', // or whatever method the form uses
        url: `https://api.hsforms.com/submissions/v3/integration/submit/26233105/03763d80-c254-482e-95cc-75ec64e3ef16`,
      },
      {
        statusCode: 500,
        body: {
          error: 'Internal server error',
        },
      }
    ).as('formSubmit');

    cy.get("input[name='integration_type']").click({ force: true });
    cy.get("input[name='firstname']").type('Test');
    cy.get("input[name='lastname']").type('Test');
    cy.get("input[name='email']").type('info@example.com');
    cy.get("input[name='company']").type('Example, Inc.');
    cy.get("textarea[name='message']").type('I would like to become a partner.');
    cy.get('form').submit();

    cy.wait('@formSubmit');
    cy.getByData('error-message')
      .should('exist')
      .contains('Something went wrong. Please reload the page and try again.');
  });
});
