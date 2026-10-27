class BookingPage {
  heading() {
    return cy.get("h1");
  }

  serviceSelect() {
    return cy.get("#service_id");
  }

  selectFirstAvailableService() {
    this.serviceSelect()
      .find("option")
      .eq(1)
      .then(($option) => this.serviceSelect().select($option.val()));
  }

  amountInput() {
    return cy.get("#amount");
  }

  dateInput() {
    return cy.get("#booking-date");
  }

  timeInput() {
    return cy.get("#booking-time");
  }

  createButton() {
    return cy.contains("button", "Crear Reserva");
  }
}

module.exports = new BookingPage();
