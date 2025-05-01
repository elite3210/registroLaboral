console.log('Dentro del script empleados.js...');

function calcularPagoExtra(tarifaPorHora, horasExtras) {
    return horasExtras * tarifaPorHora * 1.5;
}

function calcularPago(tarifaPorHora, horasTrabajadas) {
    if (tarifaPorHora < 0) {
        throw new Error('La tarifa por hora no puede ser negativa.');
    }
    const horasNormales = Math.min(horasTrabajadas, 8);
    const horasExtras = Math.max(0, horasTrabajadas - 8);
    const pagoNormal = horasNormales * tarifaPorHora;
    const pagoExtra = calcularPagoExtra(tarifaPorHora, horasExtras);
    return pagoNormal + pagoExtra;
}