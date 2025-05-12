const { calcularPago } = require('./employee');

describe('Pruebas para calcularPago', () => {
    test('Debe calcular correctamente el pago sin horas extras', () => {
        const resultado = calcularPago(10, 8); // 10 por hora, 8 horas trabajadas
        expect(resultado).toBe(80); // 10 * 8
    });

    test('Debe calcular correctamente el pago con horas extras', () => {
        const resultado = calcularPago(10, 10); // 10 por hora, 10 horas trabajadas
        expect(resultado).toBe(110); // 10 * 8 + (10 * 1.5 * 2)
    });

    test('Debe lanzar un error si la tarifa por hora es negativa', () => {
        expect(() => calcularPago(-5, 8)).toThrow('La tarifa por hora no puede ser negativa.');
    });

    test('Debe calcular correctamente el pago si las horas trabajadas son 0', () => {
        const resultado = calcularPago(10, 0); // 10 por hora, 0 horas trabajadas
        expect(resultado).toBe(0);
    });
});