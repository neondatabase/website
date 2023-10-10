describe('Apply Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/partners');
  });

  it('allows users to apply to become a partner', () => {
    cy.get("input[name='integration_type']").click({ force: true });
    cy.get("input[name='firstname']").type('Marques');
    cy.get("input[name='lastname']").type('Hansen');
    cy.get("input[name='email']").type('info@example.com');
    cy.get("input[name='company']").type('Example, Inc.');
    cy.get("textarea[name='message']").type('I would like to become a partner.');
  });
});
