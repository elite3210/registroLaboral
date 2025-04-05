import { guardarRegistro, onGetRegistroLaboral } from './firebase.js';
import { Datatable } from './dataTable.js';
import { db } from './firebase.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// 📌 GUARDAR REGISTRO DESDE FORMULARIO CON VALIDACIONES
const tareaForm = document.getElementById('form1');

tareaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const input_work = tareaForm['input_work'].value;
    const output_work = tareaForm['output_work'].value;
    const employed_id = tareaForm['employed_id'].value.trim();

    // VALIDACIONES
    if (!employed_id || !input_work || !output_work) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const dniRegex = /^[0-9]{8}$/;
    if (!dniRegex.test(employed_id)) {
        alert("El DNI debe tener exactamente 8 dígitos numéricos.");
        return;
    }

    const entrada = new Date(input_work);
    const salida = new Date(output_work);

    if (isNaN(entrada) || isNaN(salida)) {
        alert("Las fechas ingresadas no son válidas.");
        return;
    }

    if (entrada >= salida) {
        alert("La hora de entrada debe ser menor que la hora de salida.");
        return;
    }

    // ✅ Guardar en Firebase
    guardarRegistro(employed_id, input_work, output_work, false);
    tareaForm.reset();
});

// 📌 MOSTRAR LISTADO DE REGISTROS EN TABLA
onGetRegistroLaboral((querySnapshot) => {
    const items = [];

    if (querySnapshot) {
        querySnapshot.forEach(doc => {
            let obj = {};
            obj.id = doc.id;
            obj.values = doc.data();
            items.push(obj);
        });
    }

    const titulo = {
        ' ': '',
        CODIGO: 'employed_id',
        ENTRADA: 'input_work',
        SALIDA: 'output_work'
    };

    const dt = new Datatable('#dataTableRegistro', [
        { id: 'btnEdit', text: 'editar', icon: 'edit', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); editProduct(elementos); } },
        { id: 'dtnDelete', text: 'delete', icon: 'delete', action: function () { const elementos = dt.getSelected(); eliminarProducto(elementos); } },
        { id: 'dtnDuplicar', text: 'clonar', icon: 'content_copy', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); clonarProduct(elementos); } },
        { id: 'dtnCrear', text: 'nuevo', icon: 'post_add', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); /*createProduct()*/ } },
        { id: 'brnView', text: 'ver', icon: 'contract', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); viewProduct(elementos); } }
    ]);

    dt.setData(items, titulo);
    dt.makeTable();
});

// 📌 FUNCIONALIDAD PARA REPORTE SEMANAL CON MONEDA EN SOLES
export async function generarReporteSemanal(dniEmpleado) {
    const registrosRef = collection(db, "RegistroLaboral");
    const empleadosRef = collection(db, "Empleados");

    const q = query(registrosRef, where("employed_id", "==", dniEmpleado));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        document.getElementById("reporteSemanal").innerHTML = `
            <p class="text-danger">No se encontraron registros para el código <strong>${dniEmpleado}</strong>.</p>`;
        return;
    }

    let totalHoras = 0;
    let registrosInvalidos = 0;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const entrada = new Date(data.input_work);
        const salida = new Date(data.output_work);

        if (!isNaN(entrada) && !isNaN(salida)) {
            const horasTrabajadas = (salida - entrada) / (1000 * 60 * 60);
            totalHoras += horasTrabajadas;
        } else {
            registrosInvalidos++;
        }
    });

    const tq = query(empleadosRef, where("employed_id", "==", dniEmpleado));
    const tarifaSnapshot = await getDocs(tq);

    let tarifaHora = 0;

    if (!tarifaSnapshot.empty) {
        tarifaSnapshot.forEach((doc) => {
            tarifaHora = doc.data().tarifaHora || 10;
        });
    } else {
        tarifaHora = 10;
    }

    const montoTotal = totalHoras * tarifaHora;

    const reporteDiv = document.getElementById("reporteSemanal");
    reporteDiv.innerHTML = `
        <p><strong>Código:</strong> ${dniEmpleado}</p>
        <p><strong>Total de horas trabajadas:</strong> ${totalHoras.toFixed(2)} hs</p>
        <p><strong>Tarifa por hora:</strong> S/${tarifaHora}</p>
        <p><strong>Total estimado a cobrar:</strong> S/${montoTotal.toFixed(2)}</p>
    `;

    if (registrosInvalidos > 0) {
        reporteDiv.innerHTML += `<p class="text-warning">${registrosInvalidos} registro(s) fueron ignorados por tener formato inválido.</p>`;
    }
}
