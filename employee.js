console.log('Dentro del script empleados.js...');

function calcularPago(tarifaPorHora, horasTrabajadas) {
    const horasNormales = Math.min(horasTrabajadas, 8);
    const horasExtras = Math.max(0, horasTrabajadas - 8);
    const pagoNormal = horasNormales * tarifaPorHora;
    const pagoExtra = horasExtras * tarifaPorHora * 1.5;
    return pagoNormal + pagoExtra;
}

function calcularPagoExtra(tarifaPorHora, horasExtras) {
    //implementado el pago de horas extras, segun ley se paga 50% mas
    return horasExtras * tarifaPorHora * 1.5;
}