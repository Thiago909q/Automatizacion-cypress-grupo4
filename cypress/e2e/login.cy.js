import { DashboardPage } from '../support/pages/DashboardPage';
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

  it('rejects an email that has no account', () => {
    const user = createTestUser();
    new LoginPage().visit().then(login => login.submit(user.email, user.password))
      .then(login => {
        login.emailError().should('have.text', 'El correo electrónico o la contraseña no son correctos.');
        cy.location('pathname').should('eq', '/login');
      });
    new DashboardPage().visit();
    cy.location('pathname').should('eq', '/login');
  });

  it('rejects an incomplete email address', () => {
    new LoginPage().visit().then(login => login.submit('usuario@dominio', 'TestPass123!'))
      .then(login => {
        login.emailError().should('have.text', 'Ingresá un correo electrónico completo, por ejemplo nombre@gmail.com.');
        cy.location('pathname').should('eq', '/login');
      });
  });

  it('normalizes uppercase letters and surrounding spaces in the email', () => {
    const user = createTestUser();
    new RegisterPage().visit().then(register => register.register(user))
      .then(dashboard => dashboard.logout())
      .then(login => login.login(`  ${user.email.toUpperCase()}  `, user.password))
      .then(dashboard => {
        cy.location('pathname').should('eq', '/dashboard');
        dashboard.greeting().should('have.text', '¡Hola, Usuario!');
      });
  });

  it('redirects an authenticated user away from login', () => {
    new RegisterPage().visit().then(register => register.register(createTestUser()));
    new LoginPage().visit();
    cy.location('pathname').should('eq', '/dashboard');
  });

  it('allows a successful login after correcting an incorrect password', () => {
    const user = createTestUser();
    new RegisterPage().visit().then(register => register.register(user))
      .then(dashboard => dashboard.logout())
      .then(login => login.submit(user.email, 'WrongPass123!'))
      .then(login => {
        login.emailError().should('be.visible');
        login.passwordField().should('have.value', '');
        return login.login(user.email, user.password);
      })
      .then(dashboard => {
        cy.location('pathname').should('eq', '/dashboard');
        dashboard.greeting().should('have.text', '¡Hola, Usuario!');
      });
  });
});
