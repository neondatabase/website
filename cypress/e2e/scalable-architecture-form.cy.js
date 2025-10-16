describe('Scalable Architecture Contact Us Form', () => {
  beforeEach(() => {
    cy.visit('/scalable-architecture');
  });

  it('allows users to submit the form successfully', () => {
    cy.formSuccessSubmit();

    cy.get('#scalable-architecture-form').within(() => {
      cy.get("input[name='name']").type('John Doe');
      cy.get("input[name='email']").type('test+skipform@hubspot.com');
      cy.get("select[name='companySize']").select('1_4');
      cy.get("textarea[name='message']").type('This is a test message for scalable architecture.');
      cy.root().submit();
    });

    cy.wait('@formSuccessSubmit');
    cy.get('#scalable-architecture-form button[type="submit"]').should('contain', 'Submitted');
  });

  it('displays validation errors when required fields are missing', () => {
    cy.get('#scalable-architecture-form').within(() => {
      cy.get("input[name='name']").type('John Doe');
      cy.root().submit();
    });

    cy.getByData('error-field-message').should('have.length', 3);
  });

  it('displays validation error for invalid email format', () => {
    cy.get('#scalable-architecture-form').within(() => {
      cy.get("input[name='name']").type('John Doe');
      cy.get("input[name='email']").type('invalid-email');
      cy.get("select[name='companySize']").select('1_4');
      cy.get("textarea[name='message']").type('This is a test message for scalable architecture.');
      cy.root().submit();
    });

    cy.getByData('error-field-message').should('contain', 'Please enter a valid email');
  });

  it('displays an error message when there is server error', () => {
    cy.formErrorSubmit();

    cy.get("#scalable-architecture-form input[name='name']").type('John Doe');
    cy.get("#scalable-architecture-form input[name='email']").type('test+skipform@hubspot.com');
    cy.get("#scalable-architecture-form select[name='companySize']").select('1_4');
    cy.get("#scalable-architecture-form textarea[name='message']").type(
      'This is a test message for scalable architecture.'
    );
    cy.get('#scalable-architecture-form').submit();

    cy.wait('@formErrorSubmit');
    cy.getByData('error-message')
      .should('exist')
      .and('contain', 'Please reload the page and try again');
  });
});
