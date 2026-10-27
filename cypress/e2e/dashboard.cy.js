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
});
