import { guardarRegistro, onGetRegistroLaboral, getOneEmployed, deleteRegistroLaboral} from './firebase.js'
import { Datatable } from './dataTable.js';
import { formularioEmpleados,clearHTML } from './empleados.js';


//llamando a la funcion traer consulta que incluye la tabla grid js
let empleados = JSON.parse(localStorage.getItem('empleadosLS'));
console.log('empleadosLS',empleados);


//para guaradr los registo en firebase
const tareaForm = document.getElementById('form1')

tareaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input_work = tareaForm['input_work'].value;
    const output_work = tareaForm['output_work'].value;
    const employed_id = tareaForm['employed_id'].value;
    let status = false;

    guardarRegistro(employed_id.trim(), input_work, output_work, status);
    tareaForm.reset();
})


//traer los datos de la coleccion Registrolaboral y renderizar la tabla instatneamente
const registroLaboral = onGetRegistroLaboral((querySnapshot) => {
    const items = [];

    if (querySnapshot) {
        querySnapshot.forEach(doc => {
            let obj = {};
            obj.id = doc.id;
            obj.values = doc.data();
            let objetoEmpleado=empleados.filter(objeto=>objeto['values'].employed_id==obj['values'].employed_id)[0]
            obj['values'].nombres = objetoEmpleado ? objetoEmpleado['values'].names:'s/n';
            console.log('trajosss:',obj['values'].nombres);

            items.push(obj);
        })
    };
    console.log('datos firebase traido:', items);

    //let productoCaliente=await traeroneProduct(producto.id)
    //let stockProducto=productoCaliente.data().stock

    //datos para rendizar la tabla
    const titulo = {'':'',CODIGO: 'employed_id', NOMBRES: 'nombres', ENTRADA: 'input_work', SALIDA: 'output_work' }
    const dt = new Datatable('#dataTableRegistro',
        [
            { id: 'dtnCrear', text: 'nuevo', icon: 'post_add', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); /*createProduct()*/ } },
            { id: 'btnEdit', text: 'editar', icon: 'edit', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); /*editProduct(elementos)*/ } },
            //{ id: 'btnBarcode', text: 'barcode', icon: 'barcode',targetModal:'#myModal', action: function () { const elementos = dt.getSelected(); pintarBarcode(elementos); } },
            { id: 'dtnDelete', text: 'delete', icon: 'delete',targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); eliminarRegistroLaboral(elementos)} }
        ]
    );
    dt.setData(items, titulo);
    dt.makeTable();
});

//const ages = [{nombre:'Mariela', age:32}, {nombre:'Rocio', age:33}, {nombre:'Mirella', age:16}, {nombre:'Angela', age:28}];
//const result = ages.filter(obj=>obj.nombre=='Angela');
//console.log('result:', result);

function eliminarRegistroLaboral(arrayObj){
    let id = arrayObj.id;
    const modalBody = document.querySelector('.modal-body');
    const modalFooter = document.querySelector('.modal-footer');
    clearHTML(modalBody);
    clearHTML(modalFooter);
    console.log('id id id ',id );
    
    modalBody.appendChild(formularioEmpleados());//funcion que renderiza el formulario para crear y editar producto

    const btnDelete=document.createElement('button');
    btnDelete.setAttribute('id','btn-delete');
    btnDelete.setAttribute('class','btn btn-danger');
    btnDelete.addEventListener('click',()=>deleteRegistroLaboral(id))
    modalFooter.appendChild(btnDelete);           
    btnDelete.textContent = 'Eliminar'

    
}


