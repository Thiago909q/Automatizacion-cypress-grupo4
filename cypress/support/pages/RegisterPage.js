import { DashboardPage } from './DashboardPage';

export class RegisterPage {
  #selectors = {
    name: '#name',
    email: '#email',
    password: '#password',
    passwordConfirmation: '#password_confirmation',
    submit: 'form button[type="submit"]',
    emailError: '[data-testid="register-email-error"]',
    passwordError: '[data-testid="register-password-error"]',
  };

  visit() {
    cy.visit('/register');
    return this.waitUntilLoaded();
  }

  waitUntilLoaded() {
    cy.get(this.#selectors.name);
    return cy.wrap(this, { log: false });
  }

  submit(user) {
    cy.intercept('POST', '**/register').as('registerRequest');
    cy.get(this.#selectors.name).clear().type(user.name);
    cy.get(this.#selectors.email).clear().type(user.email);
    cy.get(this.#selectors.password).clear().type(user.password, { log: false });
    cy.get(this.#selectors.passwordConfirmation).clear().type(user.passwordConfirmation ?? user.password, { log: false });
    cy.get(this.#selectors.submit).click();
    cy.wait('@registerRequest');
    return cy.wrap(this, { log: false });
  }

  register(user) {
    this.submit(user);
    return new DashboardPage().waitUntilLoaded();
  }

  emailError() { return cy.get(this.#selectors.emailError); }
  passwordError() { return cy.get(this.#selectors.passwordError); }
  nameField() { return cy.get(this.#selectors.name); }
}
