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

  it('validates all required registration fields', () => {
    new RegisterPage().visit().then(register => register.submit({}))
      .then(register => {
        register.nameError().should('have.text', 'El nombre es obligatorio.');
        register.emailError().should('have.text', 'El correo electrónico es obligatorio.');
        register.passwordError().should('have.text', 'La contraseña es obligatoria.');
        cy.location('pathname').should('eq', '/register');
      });
  });

  it('rejects an incomplete registration email', () => {
    const user = { ...createTestUser(), email: 'usuario@dominio' };
    new RegisterPage().visit().then(register => register.submit(user))
      .then(register => {
        register.emailError().should('have.text', 'Ingresá un correo electrónico completo, por ejemplo nombre@gmail.com.');
        cy.location('pathname').should('eq', '/register');
      });
  });

  it('rejects numbers in the registration name', () => {
    const user = { ...createTestUser(), name: 'Usuario 123' };
    new RegisterPage().visit().then(register => register.submit(user))
      .then(register => {
        register.nameError().should('have.text', 'El nombre solo puede contener letras, espacios, puntos, apóstrofes y guiones.');
        cy.location('pathname').should('eq', '/register');
      });
  });

  it('rejects a registration name shorter than two characters', () => {
    const user = { ...createTestUser(), name: 'A' };
    new RegisterPage().visit().then(register => register.submit(user))
      .then(register => {
        register.nameError().should('have.text', 'El nombre debe tener al menos 2 caracteres.');
        cy.location('pathname').should('eq', '/register');
      });
  });

  const invalidPasswords = [
    { description: 'fewer than eight characters', password: 'Abc1234' },
    { description: 'no uppercase letter', password: 'testpass123' },
    { description: 'no lowercase letter', password: 'TESTPASS123' },
    { description: 'no number', password: 'TestPassword' },
  ];

  invalidPasswords.forEach(({ description, password }) => {
    it(`rejects a password with ${description}`, () => {
      const user = { ...createTestUser(), password, passwordConfirmation: password };
      new RegisterPage().visit().then(register => register.submit(user))
        .then(register => {
          register.passwordError().should('be.visible').and('not.be.empty');
          cy.location('pathname').should('eq', '/register');
        });
    });
  });

  it('accepts an eight character password with uppercase, lowercase and numbers', () => {
    const user = { ...createTestUser(), password: 'Abcd1234', passwordConfirmation: 'Abcd1234' };
    new RegisterPage().visit().then(register => register.register(user))
      .then(dashboard => dashboard.logout())
      .then(login => login.login(user.email, user.password))
      .then(dashboard => {
        cy.location('pathname').should('eq', '/dashboard');
        dashboard.greeting().should('have.text', '¡Hola, Usuario!');
      });
  });

  it('normalizes the name and email before creating the account', () => {
    const user = createTestUser();
    const registration = { ...user, name: '  María   López  ', email: `  ${user.email.toUpperCase()}  ` };
    new RegisterPage().visit().then(register => register.register(registration))
      .then(dashboard => dashboard.logout())
      .then(login => login.login(user.email, user.password))
      .then(dashboard => {
        dashboard.greeting().should('have.text', '¡Hola, María!');
        return dashboard.openProfile();
      })
      .then(profile => profile.nameField().should('have.value', 'María López'));
  });

  it('toggles password and confirmation visibility independently', () => {
    const user = createTestUser();
    new RegisterPage().visit().then(register => register.fill(user))
      .then(register => {
        register.passwordField().should('have.attr', 'type', 'password');
        register.confirmationField().should('have.attr', 'type', 'password');
        register.togglePasswordVisibility();
        register.passwordField().should('have.attr', 'type', 'text').and('have.value', user.password);
        register.confirmationField().should('have.attr', 'type', 'password');
        register.toggleConfirmationVisibility();
        register.confirmationField().should('have.attr', 'type', 'text').and('have.value', user.password);
        register.togglePasswordVisibility();
        register.toggleConfirmationVisibility();
        register.passwordField().should('have.attr', 'type', 'password');
        register.confirmationField().should('have.attr', 'type', 'password');
      });
  });

  it('redirects an authenticated user away from registration', () => {
    new RegisterPage().visit().then(register => register.register(createTestUser()));
    new RegisterPage().visit();
    cy.location('pathname').should('eq', '/dashboard');
  });
});
