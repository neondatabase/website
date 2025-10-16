describe('AI Agents Use-case - Program Form', () => {
  beforeEach(() => {
    cy.visit('/use-cases/ai-agents');
  });

  it('allows users to submit the AI Agents form successfully', () => {
    cy.formSuccessSubmit();

    cy.get('#agent-form form').within(() => {
      cy.get("input[name='url']").type('https://example.com/agent-app');
      cy.get("input[name='email']").type('test+skipform@hubspot.com');
      cy.root().submit();
    });

    cy.getByData('success-message').should('exist');

    cy.get('@zarazTrackSpy').should('have.been.calledWith', 'identify', {
      email: 'test+skipform@hubspot.com',
    });
    cy.get('@zarazTrackSpy').should('have.been.calledWith', 'Agent Plan Application Submitted', {
      email: 'test+skipform@hubspot.com',
      url: 'https://example.com/agent-app',
    });
  });

  it('displays validation errors when required fields are missing', () => {
    cy.get('#agent-form form').within(() => {
      cy.get("input[name='url']").type('https://example.com/agent-app');
      cy.root().submit();
    });

    cy.getByData('error-field-message').should('exist');
  });

  it('displays validation error for invalid email format', () => {
    cy.get('#agent-form form').within(() => {
      cy.get("input[name='url']").type('https://example.com/agent-app');
      cy.get("input[name='email']").type('invalid-email');
      cy.root().submit();
    });

    cy.getByData('error-field-message').should('contain', 'Please enter a valid email address');
  });

  it('displays validation error for invalid URL format', () => {
    cy.get('#agent-form form').within(() => {
      cy.get("input[name='url']").type('not-a-url');
      cy.get("input[name='email']").type('test+skipform@hubspot.com');
      cy.root().submit();
    });

    cy.getByData('error-field-message').should('contain', 'Please enter a valid URL');
  });

  it('does not show success when analytics fails and attempts analytics calls', () => {
    cy.formErrorSubmit();

    cy.get('#agent-form form').within(() => {
      cy.get("input[name='url']").type('https://example.com/agent-app');
      cy.get("input[name='email']").type('test+skipform@hubspot.com');
      cy.root().submit();
    });

    cy.getByData('success-message').should('not.exist');
    cy.get('@zarazTrackSpy').should('have.been.calledWith', 'identify', {
      email: 'test+skipform@hubspot.com',
    });
  });
});
