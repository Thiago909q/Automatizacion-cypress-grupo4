import { RegisterPage } from '../support/pages/RegisterPage';
import { UserProfilePage } from '../support/pages/UserProfilePage';
import { createTestUser } from '../support/testUser';

describe('UserProfilePage', () => {
  it('saves the new name and keeps it after reloading', () => {
    const user = createTestUser();
    new RegisterPage().visit().then(register => register.register(user))
      .then(dashboard => dashboard.openProfile())
      .then(profile => profile.updateName('Nombre Actualizado'))
      .then(profile => {
        profile.savedMessage().should('be.visible').and('have.text', 'Guardado');
        cy.reload();
        profile.nameField().should('have.value', 'Nombre Actualizado');
      });
  });

  it('keeps the email masked and read only', () => {
    const user = createTestUser();
    new RegisterPage().visit().then(register => register.register(user))
      .then(dashboard => dashboard.openProfile())
      .then(profile => {
        profile.nameField().should('have.value', user.name);
        profile.emailField().should('be.disabled').and('have.value', `qa${'*'.repeat(user.email.split('@')[0].length - 2)}@example.com`);
        profile.emailNote().should('contain.text', 'El correo no se puede cambiar desde aquí.');
      });
  });

  it('rejects numbers in the name and keeps the original value', () => {
    const user = createTestUser();
    new RegisterPage().visit().then(register => register.register(user))
      .then(dashboard => dashboard.openProfile())
      .then(profile => profile.updateName('Usuario 123'))
      .then(profile => {
        profile.nameError().should('be.visible').and('not.be.empty');
        cy.reload();
        profile.nameField().should('have.value', user.name);
      });
  });

  it('redirects guests to the login page', () => {
    new UserProfilePage().visit();
    cy.location('pathname').should('eq', '/login');
  });

  const invalidNames = [
    { description: 'a name containing only spaces', name: '   ' },
    { description: 'a one character name', name: 'A' },
    { description: 'a name longer than 100 characters', name: 'A'.repeat(101) },
  ];

  invalidNames.forEach(({ description, name }) => {
    it(`rejects ${description} without changing the stored profile`, () => {
      const user = createTestUser();
      new RegisterPage().visit().then(register => register.register(user))
        .then(dashboard => dashboard.openProfile())
        .then(profile => profile.updateName(name))
        .then(profile => {
          profile.nameError().should('be.visible').and('not.be.empty');
          cy.reload();
          profile.nameField().should('have.value', user.name);
        });
    });
  });

  const validNames = [
    { description: 'the minimum two character name', name: 'Al' },
    { description: 'the maximum 100 character name', name: 'A'.repeat(100) },
    { description: 'accents, apostrophes, hyphens and periods', name: "María-José D'Ángelo Jr." },
  ];

  validNames.forEach(({ description, name }) => {
    it(`accepts ${description} and persists it after reloading`, () => {
      new RegisterPage().visit().then(register => register.register(createTestUser()))
        .then(dashboard => dashboard.openProfile())
        .then(profile => profile.updateName(name))
        .then(profile => {
          profile.savedMessage().should('have.text', 'Guardado');
          cy.reload();
          profile.nameField().should('have.value', name);
        });
    });
  });

  it('trims the name and collapses repeated spaces', () => {
    new RegisterPage().visit().then(register => register.register(createTestUser()))
      .then(dashboard => dashboard.openProfile())
      .then(profile => profile.updateName('  María   López  '))
      .then(profile => {
        profile.savedMessage().should('have.text', 'Guardado');
        cy.reload();
        profile.nameField().should('have.value', 'María López');
      });
  });

  it('allows correcting an invalid name and sends only the editable name', () => {
    const user = createTestUser();
    new RegisterPage().visit().then(register => register.register(user))
      .then(dashboard => dashboard.openProfile())
      .then(profile => profile.updateName('Usuario 123'))
      .then(profile => {
        profile.nameError().should('be.visible');
        cy.intercept('PATCH', '**/settings/profile').as('correctedProfile');
        return profile.updateName('Nombre Corregido');
      })
      .then(profile => {
        cy.wait('@correctedProfile').its('request.body').should('deep.equal', { name: 'Nombre Corregido' });
        profile.savedMessage().should('have.text', 'Guardado');
        profile.nameError().should('not.exist');
        cy.reload();
        profile.nameField().should('have.value', 'Nombre Corregido');
        profile.emailField().should('be.disabled');
      });
  });
});
