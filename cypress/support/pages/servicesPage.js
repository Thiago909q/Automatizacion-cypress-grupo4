class ServicesPage {
  #selectors = {
    heading: 'main h1',
    cards: 'main a[href^="/services/"]:not([href*="/browse"])',
    search: 'input[name="search"]',
    category: 'select[name="category"]',
    minimumPrice: 'input[name="min_price"]',
    maximumPrice: 'input[name="max_price"]',
    priceOptions: 'summary#price',
    sort: 'select[name="sort"]',
    submit: 'main form button[type="submit"]',
  };

  visitCatalog() {
    return cy.visit("/services/browse?location_mode=none&view=list").then(() => this);
  }

  heading() {
    return cy.get(this.#selectors.heading);
  }

  cards() {
    return cy.get(this.#selectors.cards);
  }

  searchField() {
    return cy.get(this.#selectors.search);
  }

  categoryField() {
    return cy.get(this.#selectors.category);
  }

  minimumPriceField() {
    return cy.get(this.#selectors.minimumPrice);
  }

  maximumPriceField() {
    return cy.get(this.#selectors.maximumPrice);
  }

  openPriceOptions() {
    return cy.get(this.#selectors.priceOptions).click().then(() => this);
  }

  sortField() {
    return cy.get(this.#selectors.sort);
  }

  submitSearch() {
    cy.intercept('GET', '**/services/browse*').as('filterServices');
    cy.contains(this.#selectors.submit, 'Buscar').click();
    cy.wait('@filterServices');
    cy.get(this.#selectors.submit).should('not.be.disabled');
    return cy.wrap(this, { log: false });
  }
}

export default ServicesPage;
