describe('Redirects', () => {
  it('directs vists to /discord to invite page', () => {
    cy.on('uncaught:exception', () => false);
    cy.visit('/discord');
    cy.url().should('eq', 'https://discord.com/invite/92vNTzKDGp');
  });
});
