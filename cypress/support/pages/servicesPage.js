class ServicesPage {
  visitCatalog() {
    cy.visit("/services/browse?location_mode=none");
  }

  heading() {
    return cy.get("main h1");
  }

  cards() {
    return cy.get('a[href^="/services/"]:not([href*="/browse"])');
  }

  searchField() {
    return cy.get('input[name="search"]');
  }

  categoryField() {
    return cy.get('select[name="category"]');
  }

  minimumPriceField() {
    return cy.get('input[name="min_price"]');
  }

  maximumPriceField() {
    return cy.get('input[name="max_price"]');
  }

  openPriceOptions() {
    cy.contains("Cualquier precio").click();
  }

  sortField() {
    return cy.get('select[name="sort"]');
  }

  submitSearch() {
    cy.get('button[type="submit"]').contains("Buscar").click();
  }
}

export default ServicesPage;
