describe('Startups Contact Form', () => {
  beforeEach(() => {
    cy.visit('/startups');
  });

  it('allows users to submit the startups form successfully', () => {
    cy.formSuccessSubmit();

    cy.get("input[name='firstname']").type('John');
    cy.get("input[name='lastname']").type('Doe');
    cy.get("input[name='email']").type('john.doe@startup.com');
    cy.get("input[name='companyWebsite']").type('startup.example.com');
    cy.get("input[name='investor']").type('Y Combinator');
    cy.get('form').submit();

    cy.wait('@formSuccessSubmit');
    cy.get('button').should('contain', 'Applied!');
  });

  it('displays validation errors when required fields are missing', () => {
    cy.get("input[name='firstname']").type('John');
    cy.get('form').submit();

    cy.getByData('error-field-message').should('have.length', 4);
    cy.getByData('error-field-message').should('contain', 'Required field');
  });

  it('displays validation error for invalid email format', () => {
    cy.get("input[name='firstname']").type('John');
    cy.get("input[name='lastname']").type('Doe');
    cy.get("input[name='email']").type('invalid-email');
    cy.get("input[name='companyWebsite']").type('startup.example.com');
    cy.get("input[name='investor']").type('Y Combinator');
    cy.get('form').submit();

    cy.getByData('error-field-message').should('contain', 'Please enter a valid email');
  });

  it('displays an error message when there is server error', () => {
    cy.formErrorSubmit();

    cy.get("input[name='firstname']").type('John');
    cy.get("input[name='lastname']").type('Doe');
    cy.get("input[name='email']").type('john.doe@startup.com');
    cy.get("input[name='companyWebsite']").type('startup.example.com');
    cy.get("input[name='investor']").type('Y Combinator');
    cy.get('form').submit();

    cy.wait('@formErrorSubmit');
    cy.getByData('error-message').should('exist');
  });
});
