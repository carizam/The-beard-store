const bcrypt = require('bcryptjs');

describe('Bcrypt Utilities', () => {
  const password = 'securePassword123';
  let hashedPassword;

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash(password, 10);
  });

  test('Se debe codificar la contraseña correctamente', async () => {
    expect(hashedPassword).not.toBe(password);
  });

  test('Comparar la contraseña hash con la contraseña original correctamente', async () => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    expect(isMatch).toBe(true);
  });

  test('no debería poder compararse si se modifica la contraseña hash', async () => {
    const alteredHashedPassword = hashedPassword.replace(/a/g, 'b');
    const isMatch = await bcrypt.compare(password, alteredHashedPassword);
    expect(isMatch).toBe(false);
  });
});