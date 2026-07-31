describe('Startups Apply Link', () => {
  beforeEach(() => {
    cy.visit('/startups');
  });

  it('renders the apply CTA linking to the external application form', () => {
    cy.get('#startups-form')
      .find('a')
      .contains('Apply Now')
      .should('have.attr', 'href', 'https://sites.google.com/databricks.com/startup-program-apply')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');
  });
});
