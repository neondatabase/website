import 'dotenv/config';

describe('Apply Form', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env('NEXT_PUBLIC_DEFAULT_SITE_URL')}/partners`);
  });

  it('allows users to apply to become a partner', () => {
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

    cy.get("input[name='integration_type']").click({ force: true });
    cy.get("input[name='firstname']").type('Autotest');
    cy.get("input[name='lastname']").type('Autotest');
    cy.get("input[name='email']").type('info@example.com');
    cy.get("input[name='company']").type('Example, Inc.');
    cy.get("textarea[name='message']").type('I would like to become a partner.');
    cy.get('form').submit();

    cy.wait('@formSuccessSubmit');

    cy.getByData('submit-button').should('exist').contains('Applied!');
  });

  it('displays an error message when the form is submitted with no required fields filled in', () => {
    cy.get("input[name='integration_type']").click({ force: true });
    cy.get("input[name='firstname']").type('Autotest');
    cy.get("input[name='lastname']").type('Autotest');
    cy.get('form').submit();
    cy.getByData('submit-button').should('exist').contains('Apply');
    cy.getByData('error-field-message').should('exist').contains('This is a required field');
  });

  it('displays an error message when there is server error', () => {
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

    cy.get("input[name='integration_type']").click({ force: true });
    cy.get("input[name='firstname']").type('Autotest');
    cy.get("input[name='lastname']").type('Autotest');
    cy.get("input[name='email']").type('info@example.com');
    cy.get("input[name='company']").type('Example, Inc.');
    cy.get("textarea[name='message']").type('I would like to become a partner.');
    cy.get('form').submit();

    cy.wait('@formErrorSubmit');
    cy.getByData('error-message')
      .should('exist')
      .contains('Something went wrong. Please reload the page and try again.');
  });
});
