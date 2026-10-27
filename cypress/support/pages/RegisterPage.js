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
    nameError: '#name ~ p.text-red-600',
    passwordToggle: 'button[aria-label="Mostrar contraseña"], button[aria-label="Ocultar contraseña"]',
    confirmationToggle: 'button[aria-label="Mostrar confirmación de contraseña"], button[aria-label="Ocultar confirmación de contraseña"]',
  };

  visit() {
    return cy.visit('/register').then(() => this);
  }

  waitUntilLoaded() {
    cy.get(this.#selectors.name);
    return cy.wrap(this, { log: false });
  }

  submit(user) {
    cy.intercept('POST', '**/register').as('registerRequest');
    this.fill(user);
    cy.get(this.#selectors.submit).click();
    cy.wait('@registerRequest');
    return cy.wrap(this, { log: false });
  }

  register(user) {
    this.submit(user);
    return new DashboardPage().waitUntilLoaded();
  }

  fill(user) {
    const values = {
      name: user.name ?? '',
      email: user.email ?? '',
      password: user.password ?? '',
      passwordConfirmation: user.passwordConfirmation ?? user.password ?? '',
    };
    for (const [field, value] of Object.entries(values)) {
      cy.get(this.#selectors[field]).clear();
      if (value) cy.get(this.#selectors[field]).type(value, { log: !field.startsWith('password') });
    }
    return cy.wrap(this, { log: false });
  }

  togglePasswordVisibility() {
    cy.get(this.#selectors.passwordToggle).click();
    return cy.wrap(this, { log: false });
  }

  toggleConfirmationVisibility() {
    cy.get(this.#selectors.confirmationToggle).click();
    return cy.wrap(this, { log: false });
  }

  emailError() { return cy.get(this.#selectors.emailError); }
  passwordError() { return cy.get(this.#selectors.passwordError); }
  nameField() { return cy.get(this.#selectors.name); }
  nameError() { return cy.get(this.#selectors.nameError); }
  passwordField() { return cy.get(this.#selectors.password); }
  confirmationField() { return cy.get(this.#selectors.passwordConfirmation); }
}
