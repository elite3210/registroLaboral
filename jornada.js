import { guardarRegistro, onGetRegistroLaboral, onGetEmpleados, deleteRegistroLaboral,updateRegistroLaboral} from './firebase.js';
import { Datatable } from './dataTable.js';
import { formularioEmpleados,clearHTML,sincronizarLocalStorage} from './empleados.js';


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

const empleados2 = onGetEmpleados((querySnapshot) => {
    const items = [];

    if (querySnapshot) {
        querySnapshot.forEach(doc => {
            let obj = {};
            obj.id = doc.id;
            obj.values = doc.data();
            items.push(obj);
        })
    };

    sincronizarLocalStorage(items,'empleadosLS');
    renderDatalist(items);
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
            { id: 'btnEdit', text: 'editar', icon: 'edit', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); editRegistroLaboral(elementos) } },
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
    //console.log('id id id ',id );
    
    //modalBody.appendChild(formularioEmpleados());//funcion que renderiza el formulario para crear y editar producto

    //const formModal=document.getElementById('employed-form');
    //const btnSend=document.getElementById('btn-send');
    //btnSend.textContent = 'Eliminar';
    modalBody.textContent='Desea eliminar el registro de ingreso y salida?';


    const btnDelete=document.createElement('button');
    btnDelete.setAttribute('id','btn-delete');
    btnDelete.setAttribute('class','btn btn-danger');
    btnDelete.addEventListener('click',()=>{
        deleteRegistroLaboral(id);
        const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'));
        modal.hide();
    })
    modalFooter.appendChild(btnDelete);           
    btnDelete.textContent = 'Eliminar'

    
}

function renderDatalist(items) {
    const datalist = document.getElementById('colaborador');
    clearHTML(datalist);
    let html ='';

    items.forEach(element => {
        html +=`
        <option value=${element['values'].employed_id}>${element['values'].names}</option>
        `
    });

    datalist.innerHTML=html;

}

function editRegistroLaboral(elementos){
    console.log('se actualizará:',elementos.id);
    
    const modalBody = document.querySelector('.modal-body');
    const modalFooter = document.querySelector('.modal-footer');
    clearHTML(modalBody);
    clearHTML(modalFooter);

    const formularioRegistroHTML=`
            <form id="formRegistro" class="form">

                <div class="input-group">
                    <label for="employed_id">DNI:</label>
                    <input type="text" list="colaborador" name="car" id="employed_id" disabled>
                </div>
                <div class="input-group">
                    <label for="input_work">Entrada :</label>
                    <input class="fecha" type="datetime-local" id='input_work' required>
                </div>
                <div class="input-group">
                    <label for="output_work">Salida :</label>
                    <input class="fecha" type="datetime-local" id='output_work' required>
                </div>
            </form>
`
modalBody.innerHTML=formularioRegistroHTML;

const registroForm = document.getElementById('formRegistro');

registroForm['employed_id'].value=elementos['values'].employed_id;
registroForm['input_work'].value = elementos['values'].input_work;
registroForm['output_work'].value=elementos['values'].output_work;

const btnUpdate=document.createElement('button');
    btnUpdate.setAttribute('id','btn-Update');
    btnUpdate.setAttribute('class','btn btn-danger');
    btnUpdate.textContent='Actualizar';
    modalFooter.appendChild(btnUpdate);

    btnUpdate.addEventListener('click',()=>{
        const input_work = registroForm['input_work'].value;
        const output_work = registroForm['output_work'].value;
        const id = elementos.id;
        updateRegistroLaboral(id,{input_work:input_work,output_work:output_work});
        const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'));
        modal.hide();   
    })
    
}





