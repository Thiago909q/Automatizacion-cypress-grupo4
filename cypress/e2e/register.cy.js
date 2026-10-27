import { LoginPage } from '../support/pages/LoginPage';
import { RegisterPage } from '../support/pages/RegisterPage';
import { createTestUser } from '../support/testUser';

describe('RegisterPage', () => {
  it('creates a client account and starts a session', () => {
    const user = createTestUser();
    new LoginPage().visit().then(login => login.openRegistration())
      .then(register => register.register(user))
      .then(dashboard => {
        cy.location('pathname').should('eq', '/dashboard');
        dashboard.greeting().should('have.text', '¡Hola, Usuario!');
        dashboard.panelType().should('have.text', 'Panel personal');
        return dashboard.openProfile();
      })
      .then(profile => profile.nameField().should('have.value', user.name));
  });

  it('rejects a mismatched password confirmation', () => {
    const user = { ...createTestUser(), passwordConfirmation: 'AnotherPass123!' };
    new RegisterPage().visit().then(register => register.submit(user))
      .then(register => {
        register.passwordError().should('have.text', 'La confirmación de la contraseña no coincide.');
        cy.location('pathname').should('eq', '/register');
      });
  });

  it('rejects a weak password', () => {
    const user = { ...createTestUser(), password: 'password', passwordConfirmation: 'password' };
    new RegisterPage().visit().then(register => register.submit(user))
      .then(register => {
        register.passwordError().should('be.visible').and('not.be.empty');
        cy.location('pathname').should('eq', '/register');
      });
  });

  it('rejects an email that is already registered', () => {
    const user = createTestUser();
    new RegisterPage().visit().then(register => register.register(user))
      .then(dashboard => dashboard.logout())
      .then(login => login.openRegistration())
      .then(register => register.submit(user))
      .then(register => register.emailError().should('have.text', 'Este correo electrónico ya está registrado.'));
  });
});
