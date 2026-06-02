describe('Contact Form', () => {
  beforeEach(() => {
    cy.visit('/contact-sales');
  });

  it('allows users to contact sales', () => {
    // Mock zaraz for successful gtag events
    cy.window().then((win) => {
      Object.assign(win, {
        zaraz: {
          track: cy.stub().resolves().as('zarazTrackSpy'),
        },
      });
    });

    cy.get("input[name='firstname']").type('John');
    cy.get("input[name='lastname']").type('Doe');
    cy.get("input[name='email']").type('test+skipform@hubspot.com');
    cy.get("select[name='companySize']").select('0_1');
    cy.get("select[name='reasonForContact']").select('Demo/POC');
    cy.get("textarea[name='message']").type('This is a test message');
    cy.get('form').submit();

    cy.get('button').should('contain', 'Sent!');
  });

  it('displays validation errors when form is submitted empty', () => {
    cy.get("input[name='firstname']").type('John');
    cy.get('form').submit();

    cy.getByData('error-field-message').should('have.length', 5);
    cy.getByData('error-field-message').should('exist').contains('a required field');
  });

  it('displays validation error for invalid email format', () => {
    cy.get("input[name='firstname']").type('John');
    cy.get("input[name='lastname']").type('Doe');
    cy.get("input[name='email']").type('invalid-email');
    cy.get("select[name='companySize']").select('0_1');
    cy.get("select[name='reasonForContact']").select('Demo/POC');
    cy.get("textarea[name='message']").type('This is a test message');
    cy.get('form').submit();

    cy.getByData('error-field-message').should('contain', 'Please enter a valid email');
  });

  it('displays an error message when there is server error', () => {
    // Mock zaraz for failed gtag events
    cy.window().then((win) => {
      Object.assign(win, {
        zaraz: {
          track: cy.stub().rejects(new Error('Network error')).as('zarazTrackSpy'),
        },
      });
    });

    cy.get("input[name='firstname']").type('John');
    cy.get("input[name='lastname']").type('Doe');
    cy.get("input[name='email']").type('test+skipform@hubspot.com');
    cy.get("select[name='companySize']").select('0_1');
    cy.get("select[name='reasonForContact']").select('Demo/POC');
    cy.get("textarea[name='message']").type('This is a test message');
    cy.get('form').submit();

    cy.getByData('error-message').should('exist').contains('technical problem');
  });
});
