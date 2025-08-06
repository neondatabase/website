describe('Redirects', () => {
  it('directs vists to /discord to invite page', () => {
    cy.on('uncaught:exception', () => false);
    cy.visit('/discord');
    cy.url().should('eq', 'https://discord.com/invite/92vNTzKDGp');
  });

  it('directs visits to /hipaa-baa to ironclad app', () => {
    cy.on('uncaught:exception', () => false);
    cy.visit('/hipaa-baa');
    cy.url().should('eq', 'https://ironcladapp.com/public-launch/6884048e9f9f2acee1cf6353');
  });
});
