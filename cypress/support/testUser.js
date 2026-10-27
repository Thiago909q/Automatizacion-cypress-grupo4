export function createTestUser() {
  const uniqueId = `${Date.now()}-${crypto.randomUUID()}`;
  return {
    name: 'Usuario Prueba',
    email: `qa-${uniqueId}@example.com`,
    password: 'TestPass123!',
    passwordConfirmation: 'TestPass123!',
  };
}
