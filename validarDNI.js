/**
 * Valida si un DNI es válido.
 * @param {string} dni - El DNI a validar.
 * @returns {boolean} - True si el DNI es válido, false en caso contrario.
 */
export function validarDNI(dni) {
  if (!dni) return false; // Manejar casos nulos o indefinidos
  const regex = /^\d{8}$/;
  return regex.test(dni);
}