describe('template spec', () => {
  it('passes', () => {
    cy.visit('/')
    cy.title().should('eq', 'Campervan bookings')
  })
})
