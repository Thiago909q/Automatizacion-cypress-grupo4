import { LoginPage } from '../support/pages/LoginPage';
import { RegisterPage } from '../support/pages/RegisterPage';
import { createTestUser } from '../support/testUser';

describe('LoginPage', () => {
  it('logs in with valid credentials', () => {
    const user = createTestUser();
    new RegisterPage().visit().then(register => register.register(user))
      .then(dashboard => dashboard.logout())
      .then(login => login.login(user.email, user.password))
      .then(dashboard => {
        cy.location('pathname').should('eq', '/dashboard');
        dashboard.greeting().should('have.text', '¡Hola, Usuario!');
      });
  });

  it('rejects an incorrect password', () => {
    const user = createTestUser();
    new RegisterPage().visit().then(register => register.register(user))
      .then(dashboard => dashboard.logout())
      .then(login => login.submit(user.email, 'WrongPass123!'))
      .then(login => {
        login.emailError().should('have.text', 'El correo electrónico o la contraseña no son correctos.');
        cy.location('pathname').should('eq', '/login');
      });
  });

  it('validates the required fields', () => {
    new LoginPage().visit().then(login => login.submit())
      .then(login => {
        login.emailError().should('have.text', 'El correo electrónico es obligatorio.');
        login.passwordError().should('have.text', 'La contraseña es obligatoria.');
      });
  });

  it('shows and hides the password', () => {
    const login = new LoginPage();
    login.visit();
    login.fillPassword('TestPass123!');
    login.passwordField().should('have.attr', 'type', 'password');
    login.togglePasswordVisibility();
    login.passwordField().should('have.attr', 'type', 'text');
    login.togglePasswordVisibility();
    login.passwordField().should('have.attr', 'type', 'password');
  });
});
