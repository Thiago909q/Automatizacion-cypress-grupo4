import { UserProfilePage } from '../support/pages/UserProfilePage';
import { DashboardPage } from '../support/pages/DashboardPage';
import { RegisterPage } from '../support/pages/RegisterPage';
import { createTestUser } from '../support/testUser';

describe('DashboardPage', () => {
  it('does not let guests access the dashboard', () => {
    new DashboardPage().visit();
    cy.location('pathname').should('eq', '/login');
  });

  it('logs out and prevents access to a protected page', () => {
    const user = createTestUser();
    new RegisterPage().visit().then(register => register.register(user))
      .then(dashboard => dashboard.logout())
      .then(login => {
        cy.location('pathname').should('eq', '/login');
        login.emailField().should('be.visible');
      });
    new DashboardPage().visit();
    cy.location('pathname').should('eq', '/login');
  });

  it('shows the current user name and the client panel', () => {
    const user = { ...createTestUser(), name: 'Lucía Alonso' };
    new RegisterPage().visit().then(register => register.register(user))
      .then(dashboard => {
        dashboard.greeting().should('have.text', '¡Hola, Lucía!');
        dashboard.panelType().should('have.text', 'Panel personal');
      });
  });

  it('keeps the authenticated session after reloading the dashboard', () => {
    new RegisterPage().visit().then(register => register.register(createTestUser()))
      .then(dashboard => {
        cy.reload();
        cy.location('pathname').should('eq', '/dashboard');
        dashboard.greeting().should('have.text', '¡Hola, Usuario!');
        dashboard.panelType().should('have.text', 'Panel personal');
      });
  });

  it('opens the current user profile from the account menu', () => {
    const user = { ...createTestUser(), name: 'Ana Martínez' };
    new RegisterPage().visit().then(register => register.register(user))
      .then(dashboard => dashboard.openProfile())
      .then(profile => {
        cy.location('pathname').should('eq', '/settings/profile');
        profile.nameField().should('have.value', user.name);
        profile.emailField().should('be.disabled');
      });
  });

  it('prevents profile access after logging out', () => {
    new RegisterPage().visit().then(register => register.register(createTestUser()))
      .then(dashboard => dashboard.logout());
    new UserProfilePage().visit();
    cy.location('pathname').should('eq', '/login');
  });
});
