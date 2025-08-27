describe('Booking Detail Flow', () => {
  it('should view a booking detail page', () => {
    // Intercept the API calls
    cy.intercept('GET', '/api/bookings/1', { fixture: 'booking.json' }).as('getBooking');
    cy.intercept('GET', '/api/stations/BER', { fixture: 'station-berlin.json' }).as('getStation');

    // Visit the booking detail page
    cy.visit('/booking/1');
    cy.wait('@getBooking');
    cy.wait('@getStation');

    // Verify that the booking details are visible
    cy.contains('Booking Details').should('be.visible');
    cy.contains('John Doe').should('be.visible');
  });
});
