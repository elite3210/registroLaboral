import {guardarEmpleados, onGetEmpleados, updateEmployed, deleteEmployed } from './firebase.js'
import { Datatable } from './dataTable.js';


let editStatus = false;
//traer los datos de la coleccion Registrolaboral
const empleados = onGetEmpleados((querySnapshot) => {
    const items = [];

    if (querySnapshot) {
        querySnapshot.forEach(doc => {
            let obj = {};
            obj.id = doc.id;
            obj.values = doc.data();
            items.push(obj);
        })
    };
    
    sincronizarLocalStorage(items,'empleadosLS')
    //renderDatalist(items)

    const titulo = {CODIGO: 'employed_id', NOMBRES: 'names', APELLIDOS: 'surnames', NACIMIENTO:'birth', EMAIL:'email',TELEFONO:'phone'}
    const dt = new Datatable('#dataTableEmpleados',
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

function conexionFirebase(id) {

    const formModal=document.getElementById('employed-form');
    const employed_id     = formModal['employed_id'].value;
    const names     = formModal['names'].value;
    const surnames  = formModal['surnames'].value;
    const birth     = formModal['birth'].value;
    const email     = formModal['email'].value;
    const phone     = formModal['phone'].value;


    if (!editStatus) {
        console.log('se guaradá y no actualizara !editStatus');
        
        guardarEmpleados(
            employed_id,
            names,
            surnames,
            birth,
            email,
            phone
        );

        //const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'))
        //modal.hide()
        //showMessage(`Se creo y guardó un nuevo producto:${codigo}`,'success')
    } else {
        
        //console.log('entre a else de actualizar id:', id);
        updateEmployed(id, {
            employed_id:employed_id,
            names:names,
            surnames:surnames,
            birth:birth,
            email:email,
            phone:phone
                })
        editStatus = false
        //btnSend.value = 'Crear';
        //cerrar modal y mostrar mensaje de operacion realizada        
        //const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'))
        //modal.hide()
        //showMessage(`Se edito con exito el producto:${id}`,'success')
    };

    const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'))
    modal.hide()
    formModal.reset()
    formModal.innerHTML = ''
};

export function formularioEmpleados() {
    //creando elementos html para meterlo al modal
    const formContainer=document.createElement('div');
    formContainer.setAttribute('class','container');
    
    let formularioEmpleado = `
    <form class="form" id="employed-form">
                <div class="input-group">
                    <label class="input-group-text" for="employed_id" >DNI :</label>
                    <input class='form-control' type="text" id='employed_id' required>
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="names" >Nombres :</label>
                    <input class='form-control' type="text" id='names'  required>
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="surnames" >Apellidos :</label>
                    <input class='form-control' type="text" id='surnames'  required>
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="birth" >Nacimiento :</label>
                    <input class='form-control' type="date" id='birth'>
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="email" >email :</label>
                    <input class='form-control' type="email" id='email'>
                </div>
                <div class="input-group">
                    <label class="input-group-text" for="phone" >Telefono :</label>
                    <input class='form-control' type="text" id='phone'>
                </div>
    </form>
    `;

    formContainer.innerHTML = formularioEmpleado;
    return formContainer;
}

function crearModalEmpleado(id) {
    //let id = elementos2.id ? elementos2.id :'';
    //editStatus = false;
    const modalBody = document.querySelector('.modal-body');
    const modalFooter = document.querySelector('.modal-footer');
    clearHTML(modalBody);
    clearHTML(modalFooter);
    modalBody.appendChild(formularioEmpleados());//funcion que renderiza el formulario para crear y editar producto

    const btnSend=document.createElement('button');
    btnSend.setAttribute('id','btn-send');
    btnSend.setAttribute('class','btn btn-primary');
    btnSend.addEventListener('click',()=>conexionFirebase(id))
    modalFooter.appendChild(btnSend);           
    btnSend.textContent = 'Guardar'
    console.log('modal empleado creado');
    
};

export function clearHTML(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild)
    }
};

export function sincronizarLocalStorage(objInput, nameString) {
    console.log('sincronizando LS...')
    localStorage.removeItem(nameString);
    localStorage.setItem(nameString, JSON.stringify(objInput));
};

function editEmpleado(elementos2){
    let id = elementos2.id;
    crearModalEmpleado(id);
    editStatus = true;
    const formModal=document.getElementById('employed-form');
    const btnSend=document.getElementById('btn-send');
    btnSend.textContent = 'Actualizar';

    formModal['employed_id'].value  = elementos2['values'].employed_id;
    formModal['names'].value        = elementos2['values'].names;
    formModal['surnames'].value     = elementos2['values'].surnames;
    formModal['birth'].value        = elementos2['values'].birth;
    formModal['email'].value        = elementos2['values'].email;
    formModal['phone'].value        = elementos2['values'].phone;

    console.log('listo para editar empleados');
}

function eliminarEmpleado(elementos2){
    crearModalEmpleado(elementos2)
    editStatus = true;
    const formModal=document.getElementById('employed-form');

    const btnSend=document.getElementById('btn-send');
    btnSend.textContent = 'Eliminar';

    formModal['employed_id'].value = elementos2['values'].employed_id;
    const names = formModal['names'].value = elementos2['values'].names;
    const surnames = formModal['surnames'].value = elementos2['values'].surnames;
    const birth = formModal['birth'].value = elementos2['values'].birth;
    const email = formModal['email'].value = elementos2['values'].email;
    const phone = formModal['phone'].value = elementos2['values'].phone;
}

function crearEmpleadoFirebase(elementos2){
//e.preventDefault()
console.log('dentro funcion crearEmpleadoFirebase:', editStatus,elementos2);
const formModal=document.getElementById('employed-form');
const btnSend=document.getElementById('btn-send');

const employed_id = formModal['employed_id'].value;
const names = formModal['names'].value;
const surnames = formModal['surnames'].value;
const birth = formModal['birth'].value;
const email = formModal['email'].value;
const phone = formModal['phone'].value;
}
