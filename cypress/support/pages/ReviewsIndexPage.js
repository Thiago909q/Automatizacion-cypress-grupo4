class ReviewsIndexPage {
  #selectors = {
    pageHeading: 'h1',
    averageValue: 'p.text-6xl',
    sectionHeading: 'h2',
    reviewCard: 'article',
    emptyState: 'Todavía no hay reseñas disponibles.',
  };

  visitAllReviews() {
    return cy.visit('/reviews').then(() => this);
  }

  visitMyReviews() {
    return cy.visit('/my-reviews').then(() => this);
  }

  pageHeading() {
    return cy.get(this.#selectors.pageHeading);
  }

  averageValue() {
    return cy.get(this.#selectors.averageValue);
  }

  sectionHeading(text) {
    return cy.contains(this.#selectors.sectionHeading, text);
  }

  reviewCards() {
    return cy.get(this.#selectors.reviewCard);
  }

  emptyState() {
    return cy.contains(this.#selectors.emptyState);
  }
}

module.exports = { ReviewsIndexPage };