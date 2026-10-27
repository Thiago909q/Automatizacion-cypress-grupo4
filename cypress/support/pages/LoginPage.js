import { DashboardPage } from './DashboardPage';
import { RegisterPage } from './RegisterPage';

export class LoginPage {
  #selectors = {
    email: '#email',
    password: '#password',
    submit: 'form button[type="submit"]',
    emailError: '[data-testid="login-email-error"]',
    passwordError: '[data-testid="login-password-error"]',
    passwordToggle: 'button[aria-label="Mostrar contraseña"], button[aria-label="Ocultar contraseña"]',
    registerLink: 'a[href$="/register"]',
  };

  visit() {
    return cy.visit('/login').then(() => this);
  }

  submit(email = '', password = '') {
    cy.intercept('POST', '**/login').as('loginRequest');
    cy.get(this.#selectors.email).clear();
    if (email) cy.get(this.#selectors.email).type(email);
    cy.get(this.#selectors.password).clear();
    if (password) cy.get(this.#selectors.password).type(password, { log: false });
    cy.get(this.#selectors.submit).click();
    cy.wait('@loginRequest');
    return cy.wrap(this, { log: false });
  }

  login(email, password) {
    this.submit(email, password);
    return new DashboardPage().waitUntilLoaded();
  }

  openRegistration() {
    cy.get(this.#selectors.registerLink).click();
    return new RegisterPage().waitUntilLoaded();
  }

  fillPassword(password) {
    cy.get(this.#selectors.password).clear().type(password, { log: false });
    return cy.wrap(this, { log: false });
  }

  togglePasswordVisibility() {
    cy.get(this.#selectors.passwordToggle).click();
    return cy.wrap(this, { log: false });
  }

  emailField() { return cy.get(this.#selectors.email); }
  passwordField() { return cy.get(this.#selectors.password); }
  emailError() { return cy.get(this.#selectors.emailError); }
  passwordError() { return cy.get(this.#selectors.passwordError); }
}
