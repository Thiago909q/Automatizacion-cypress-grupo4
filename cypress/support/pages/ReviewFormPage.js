class ReviewFormPage {
  #selectors = {
    pageHeading: 'h1',
    booking: '#booking_id',
    comment: '#comment',
    rating: (value) => `button[aria-label="${value} ${value === 1 ? 'estrella' : 'estrellas'}"]`,
    createButton: 'button[type="submit"]',
    updateButton: 'button[type="submit"]',
  };

  waitUntilLoaded() {
    return cy.contains(this.#selectors.pageHeading, /Compartí tu experiencia|Editar reseña/).then(() => this);
  }

  chooseBooking(bookingId) {
    cy.get(this.#selectors.booking).select(String(bookingId));
    return cy.wrap(this, { log: false });
  }

  chooseRating(value) {
    cy.get(this.#selectors.rating(value)).click();
    return cy.wrap(this, { log: false });
  }

  writeComment(comment) {
    cy.get(this.#selectors.comment).clear().type(comment);
    return cy.wrap(this, { log: false });
  }

  submitButton() {
    return cy.contains(this.#selectors.createButton, 'Crear reseña');
  }

  submit() {
    return this.submitButton().click();
  }

  saveChanges() {
    return cy.contains(this.#selectors.updateButton, 'Guardar Cambios').click();
  }
}

module.exports = { ReviewFormPage };