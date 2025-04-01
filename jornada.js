import { guardarRegistro, onGetRegistroLaboral } from './firebase.js'
import { Datatable } from './dataTable.js';


//llamando a la funcion traer consulta que incluye la tabla grid js
const boton = document.getElementById('boton');
let acumulador = document.getElementById('acumulador');

//para guaradr los registo en firebase
const tareaForm = document.getElementById('form1')

tareaForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const input_work = tareaForm['input_work'].value;
    const output_work = tareaForm['output_work'].value;
    const employed_id = tareaForm['employed_id'].value;
    let status = false;

    guardarRegistro(employed_id.trim(), input_work, output_work, status)
    tareaForm.reset()
})


//traer los datos de la coleccion Registrolaboral
const registroLaboral = onGetRegistroLaboral((querySnapshot) => {

    const items = [];

    if (querySnapshot) {
        querySnapshot.forEach(doc => {
            let obj = {};
            obj.id = doc.id;
            obj.values = doc.data();
            items.push(obj);
        })
    };
    console.log('datos firebase traido:', items);


    const titulo = { ' ': '', CODIGO: 'employed_id', ENTRADA: 'input_work', SALIDA: 'output_work'}
    const dt = new Datatable('#dataTableRegistro',
        [
            { id: 'btnEdit', text: 'editar', icon: 'edit', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); editProduct(elementos) } },
            //{ id: 'btnBarcode', text: 'barcode', icon: 'barcode',targetModal:'#myModal', action: function () { const elementos = dt.getSelected(); pintarBarcode(elementos); } },
            { id: 'dtnDelete', text: 'delete', icon: 'delete', action: function () { const elementos = dt.getSelected(); eliminarProducto(elementos) } },
            { id: 'dtnDuplicar', text: 'clonar', icon: 'content_copy', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); clonarProduct(elementos) } },
            { id: 'dtnCrear', text: 'nuevo', icon: 'post_add', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); /*createProduct()*/ } },
            { id: 'brnView', text: 'nuevo', icon: 'contract', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); viewProduct(elementos) } }
        ]
    );
    dt.setData(items, titulo);
    dt.makeTable();
});