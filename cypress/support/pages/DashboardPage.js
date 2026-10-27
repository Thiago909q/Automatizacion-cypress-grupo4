import { LoginPage } from './LoginPage';
import { UserProfilePage } from './UserProfilePage';

export class DashboardPage {
  #selectors = {
    greeting: '[data-testid="dashboard-greeting"]',
    panelType: '[data-testid="dashboard-panel-type"]',
    accountMenu: 'button[aria-label="Abrir menú de cuenta"]',
    settingsLink: 'header aside a[href$="/settings/profile"]',
    logoutButton: 'header aside button',
  };

  visit() {
    return cy.visit('/dashboard').then(() => this);
  }

  waitUntilLoaded() {
    cy.get(this.#selectors.greeting);
    return cy.wrap(this, { log: false });
  }

  openProfile() {
    cy.get(this.#selectors.accountMenu).click();
    cy.get(this.#selectors.settingsLink).click();
    return new UserProfilePage().waitUntilLoaded();
  }

  logout() {
    cy.intercept('POST', '**/logout').as('logoutRequest');
    cy.get(this.#selectors.accountMenu).click();
    cy.contains(this.#selectors.logoutButton, 'Cerrar sesión').click();
    cy.wait('@logoutRequest');
    return new LoginPage().visit();
  }

  greeting() { return cy.get(this.#selectors.greeting); }
  panelType() { return cy.get(this.#selectors.panelType); }
}
