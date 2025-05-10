import { validarDNI } from './validarDNI.js';

describe('validarDNI', () => {
  test('debería devolver true para un DNI válido', () => {
    expect(validarDNI('12345678')).toBe(true);
  });

  test('debería devolver false para un DNI con menos de 8 dígitos', () => {
    expect(validarDNI('1234567')).toBe(false);
  });

  test('debería devolver false para un DNI con más de 8 dígitos', () => {
    expect(validarDNI('123456789')).toBe(false);
  });

  test('debería devolver false para un DNI con caracteres no numéricos', () => {
    expect(validarDNI('1234abcd')).toBe(false);
  });

  test('debería devolver false para un DNI vacío', () => {
    expect(validarDNI('')).toBe(false);
  });

  test('debería devolver false para un DNI nulo', () => {
    expect(validarDNI(null)).toBe(false);
  });

  test('debería devolver false para un DNI indefinido', () => {
    expect(validarDNI(undefined)).toBe(false);
  });
});