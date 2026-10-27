const { ReviewFormPage } = require('./ReviewFormPage');

class ServiceReviewsPage {
  #selectors = {
    serviceTitle: 'h1',
    reviewsHeading: 'h2',
    averageRating: 'span',
    createReviewLink: 'a',
    reviewCard: 'article',
    editReviewButton: 'button[aria-label="Editar reseña"]',
    deleteReviewButton: 'button[aria-label="Eliminar reseña"]',
    emptyState: 'No hay reseñas para este servicio todavía.',
  };

  visit(serviceId) {
    return cy.visit(`/reviews/service/${serviceId}`).then(() => this);
  }

  openReviewForm() {
    cy.contains(this.#selectors.createReviewLink, 'Escribir reseña').click();
    return new ReviewFormPage().waitUntilLoaded();
  }

  reviewableBookingAction() {
    return cy.contains(this.#selectors.createReviewLink, 'Dejar reseña');
  }

  reviewsHeading() {
    return cy.contains(this.#selectors.reviewsHeading, 'Reseñas del servicio');
  }

  serviceTitle() {
    return cy.get(this.#selectors.serviceTitle);
  }

  averageRating() {
    return cy.contains(this.#selectors.averageRating, /^\d+\.\d$/);
  }

  reviewCards() {
    return cy.get(this.#selectors.reviewCard);
  }

  reviewCard(comment) {
    return cy.contains(this.#selectors.reviewCard, comment);
  }

  reviewDetailsComment(comment) {
    return cy.contains(comment);
  }

  emptyState() {
    return cy.contains(this.#selectors.emptyState);
  }

  editReview(comment) {
    this.reviewCard(comment).find(this.#selectors.editReviewButton).click();
    return new ReviewFormPage().waitUntilLoaded();
  }

  deleteReview(comment) {
    return this.reviewCard(comment).find(this.#selectors.deleteReviewButton).click();
  }
}

module.exports = { ServiceReviewsPage };