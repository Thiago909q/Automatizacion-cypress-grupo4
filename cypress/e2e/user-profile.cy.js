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
});
