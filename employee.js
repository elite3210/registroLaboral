console.log('Dentro del script empleados.js...');

function calcularPago(tarifaPorHora, horasTrabajadas) {
    return tarifaPorHora * horasTrabajadas;
}

function calcularPagoExtra(tarifaPorHora, horasExtras) {
    return horasExtras * tarifaPorHora;
}