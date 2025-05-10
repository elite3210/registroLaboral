import { Datatable } from './dataTable.js';

//para guaradr los registo en firebase
const tarifaForm = document.getElementById('tarifaForm')

tarifaForm.addEventListener('submit', async (e) => {
    console.log('se ejecuto submit...');
    
    e.preventDefault();
    const job_id = tarifaForm['job_id'].value;
    const description_job = tarifaForm['description_job'].value;
    const price_hour = tarifaForm['price_hour'].value;
    let status = false;

    await guardarTarifa(job_id.trim(), description_job, price_hour);
    tarifaForm.reset();
})

async function guardarTarifa(job_id, description_job, price_hour) {
    const response = await fetch('/api/tarifas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id, description_job, price_hour })
    });
    return await response.json();
}

async function obtenerTarifas() {
    const response = await fetch('/api/tarifas');
    return await response.json();
}

let editStatus = false;

//traer los datos de la coleccion Registrolaboral
const tarifas = await obtenerTarifas();
const items = [];

if (tarifas) {
    tarifas.forEach(doc => {
        let obj = {};
        obj.id = doc.id;
        obj.values = doc;
        items.push(obj);
    })
};

//sincronizarLocalStorage(items,'tarifasLS')


const titulo = {CODIGO: 'job_id', DESCRIPCION: 'description_job', IMPORTE: 'price_hour'}
const dt = new Datatable('#dataTableTarifas',
    [   
        { id: 'brnView', text: 'nuevo', icon: 'contract', targetModal: '#myModal', action: function () { const elementos2 = dt.getSelected(); viewProduct(elementos2) } },
        { id: 'dtnCrear', text: 'nuevo', icon: 'post_add', targetModal: '#myModal', action: function () { const elementos2 = dt.getSelected(); crearModalEmpleado() } },
        { id: 'btnEdit', text: 'editar', icon: 'edit', targetModal: '#myModal', action: function () { const elementos2 = dt.getSelected(); editEmpleado(elementos2) } },
        { id: 'dtnDelete', text: 'delete', icon: 'delete',targetModal: '#myModal',action: function () { const elementos2 = dt.getSelected(); eliminarEmpleado(elementos2) } }
    ]
);
dt.setData(items, titulo);
dt.makeTable2();

