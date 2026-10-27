class LoginPage {
  #selectors = {
    email: '#email',
    password: '#password',
    submit: 'button[type="submit"]',
  };

  visit() {
    return cy.visit('/login').then(() => this);
  }

  login(email, password) {
    cy.intercept('POST', '**/login').as('loginRequest');
    cy.get(this.#selectors.email).clear().type(email);
    cy.get(this.#selectors.password).clear().type(password, { log: false });
    cy.get(this.#selectors.submit).click();
    return cy.wait('@loginRequest').then(() => this);
  }
}

module.exports = { LoginPage };