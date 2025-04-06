import {onGetTarifas, guardarTarifa} from './firebase.js'
import { Datatable } from './dataTable.js';

//para guaradr los registo en firebase
const tarifaForm = document.getElementById('tarifaForm')

tarifaForm.addEventListener('submit', (e) => {
    console.log('se ejecuto submit...');
    
    e.preventDefault();
    const job_id = tarifaForm['job_id'].value;
    const description_job = tarifaForm['description_job'].value;
    const price_hour = tarifaForm['price_hour'].value;
    let status = false;

    guardarTarifa(job_id.trim(),description_job, price_hour);
    tarifaForm.reset();
})


let editStatus = false;

//traer los datos de la coleccion Registrolaboral
const tarifas = onGetTarifas ((querySnapshot) => {
    const items = [];

    if (querySnapshot) {
        querySnapshot.forEach(doc => {
            let obj = {};
            obj.id = doc.id;
            obj.values = doc.data();
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
});

