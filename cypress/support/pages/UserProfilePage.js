export class UserProfilePage {
  #selectors = {
    name: '#name',
    email: '#email',
    emailNote: '#email-note',
    save: '[data-testid="profile-save"]',
    savedMessage: '[data-testid="profile-saved"]',
    nameError: '[data-testid="profile-name-error"]',
  };

  visit() {
    return cy.visit('/settings/profile').then(() => this);
  }

  waitUntilLoaded() {
    cy.get(this.#selectors.save);
    return cy.wrap(this, { log: false });
  }

  updateName(name) {
    cy.intercept('PATCH', '**/settings/profile').as('updateProfileRequest');
    cy.get(this.#selectors.name).clear();
    if (name) cy.get(this.#selectors.name).type(name);
    cy.get(this.#selectors.save).click();
    cy.wait('@updateProfileRequest');
    return cy.wrap(this, { log: false });
  }

  nameField() { return cy.get(this.#selectors.name); }
  emailField() { return cy.get(this.#selectors.email); }
  emailNote() { return cy.get(this.#selectors.emailNote); }
  savedMessage() { return cy.get(this.#selectors.savedMessage); }
  nameError() { return cy.get(this.#selectors.nameError); }
}
