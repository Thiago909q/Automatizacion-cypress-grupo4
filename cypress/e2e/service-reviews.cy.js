const { LoginPage } = require('../support/pages/LoginPage');
const { ServiceReviewsPage } = require('../support/pages/ServiceReviewsPage');
const { ReviewsIndexPage } = require('../support/pages/ReviewsIndexPage');

function missingConfiguration() {
  const requiredValues = [
    ['REVIEW_SERVICE_ID', 'CYPRESS_REVIEW_SERVICE_ID'],
    ['REVIEW_BOOKING_ID', 'CYPRESS_REVIEW_BOOKING_ID'],
  ];
  const missing = requiredValues
    .filter(([key]) => !Cypress.expose(key))
    .map(([, variableName]) => variableName);

  if (!Cypress.config('baseUrl')) missing.push('CYPRESS_BASE_URL');
  if (!Cypress.expose('REVIEW_CREDENTIALS_CONFIGURED')) {
    missing.push('CYPRESS_REVIEW_EMAIL', 'CYPRESS_REVIEW_PASSWORD');
  }

  return missing;
}

function signIn() {
  return cy.env(['REVIEW_EMAIL', 'REVIEW_PASSWORD']).then(({ REVIEW_EMAIL, REVIEW_PASSWORD }) => {
    if (!REVIEW_EMAIL || !REVIEW_PASSWORD) {
      throw new Error('Configurá CYPRESS_REVIEW_EMAIL y CYPRESS_REVIEW_PASSWORD para los casos autenticados.');
    }

    return new LoginPage()
      .visit()
      .then((loginPage) => loginPage.login(REVIEW_EMAIL, REVIEW_PASSWORD));
  });
}

function verifyReviewListing(page, pageTitle, listTitle) {
  page.pageHeading().should('have.text', pageTitle);
  page.averageValue().should('be.visible').then(($value) => {
    expect($value.text().trim()).to.match(/^(?:—|\d+\.\d)\s*\/\s*5$/);
  });
  page.sectionHeading(listTitle).should('be.visible');
  page.reviewCards().then(($cards) => {
    if ($cards.length === 0) {
      page.emptyState().should('be.visible');
    } else {
      cy.wrap($cards.first()).should('be.visible');
    }
  });
}

describe('Service reviews', () => {
  before(() => {
    const missing = missingConfiguration();
    if (missing.length > 0) {
      throw new Error(`Validación funcional no ejecutada. Configurá: ${missing.join(', ')}`);
    }
  });

  it('shows the full reviews index with its summary and list state', () => {
    signIn()
      .then(() => new ReviewsIndexPage().visitAllReviews())
      .then((page) => verifyReviewListing(page, 'Reseñas y calificaciones', 'Opiniones de la comunidad'));
  });

  it('shows the signed-in user review list with its summary and list state', () => {
    signIn()
      .then(() => new ReviewsIndexPage().visitMyReviews())
      .then((page) => verifyReviewListing(page, 'Mis reseñas', 'Tus experiencias'));
  });

  it('shows the service heading, average rating, and reviews or the empty state', function () {
    const reviewsPage = new ServiceReviewsPage();
    reviewsPage.visit(Cypress.expose('REVIEW_SERVICE_ID'));

    reviewsPage.serviceTitle().should('be.visible').and('not.be.empty');
    reviewsPage.reviewsHeading().should('be.visible');
    reviewsPage.averageRating().should('be.visible');
    reviewsPage.reviewCards().then(($cards) => {
      if ($cards.length === 0) {
        reviewsPage.emptyState().should('be.visible');
      } else {
        cy.wrap($cards.first()).should('be.visible');
      }
    });
  });

  it('requires a rating before a review can be submitted', function () {
    signIn()
      .then(() => new ServiceReviewsPage().visit(Cypress.expose('REVIEW_SERVICE_ID')))
      .then((reviewsPage) => reviewsPage.openReviewForm())
      .then((formPage) => {
        formPage.chooseBooking(Cypress.expose('REVIEW_BOOKING_ID'));
        formPage.submitButton().should('be.disabled');
      });
  });

  it('creates, edits, cancels deletion, and deletes its own review', function () {
    const serviceId = Cypress.expose('REVIEW_SERVICE_ID');
    const originalComment = `Cypress review ${Date.now()}`;
    const editedComment = `${originalComment} edited`;
    const reviewsPage = new ServiceReviewsPage();
    let confirmDeletion = false;
    cy.on('window:confirm', () => confirmDeletion);

    signIn()
      .then(() => reviewsPage.visit(serviceId))
      .then((page) => page.openReviewForm())
      .then((formPage) => {
        formPage.chooseBooking(Cypress.expose('REVIEW_BOOKING_ID'));
        formPage.chooseRating(5);
        formPage.writeComment(originalComment);
        return formPage.submit();
      });

    cy.location('pathname').should('eq', `/services/${serviceId}`);
    reviewsPage.visit(serviceId).then((page) => {
      page.reviewCard(originalComment).should('be.visible').and('contain.text', '5 de 5');
      return page.editReview(originalComment);
    }).then((formPage) => {
      formPage.chooseRating(4);
      formPage.writeComment(editedComment);
      return formPage.saveChanges();
    });

    cy.location('pathname').should('match', /^\/reviews\/\d+$/);
    reviewsPage.reviewDetailsComment(editedComment).should('be.visible');
    reviewsPage.visit(serviceId)
      .then((page) => {
        page.reviewCard(editedComment).should('be.visible').and('contain.text', '4 de 5');
        return page.deleteReview(editedComment);
      })
      .then(() => {
        reviewsPage.reviewCard(editedComment).should('be.visible');
        confirmDeletion = true;
        return reviewsPage.deleteReview(editedComment);
      })
      .then(() => {
        reviewsPage.reviewCard(editedComment).should('not.exist');
        reviewsPage.reviewableBookingAction().should('be.visible');
      });
  });
});