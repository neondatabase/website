describe('Redirects', () => {
  it('directs vists to /discord to https://discord.gg/92vNTzKDGp', () => {
    cy.visit('/discord');
    cy.url().should('eq', 'https://discord.gg/92vNTzKDGp');
  });
});
