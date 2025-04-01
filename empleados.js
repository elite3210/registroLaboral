import {guardarEmpleados, onGetEmpleados } from './firebase.js'
import { Datatable } from './dataTable.js';

const modalBody = document.querySelector('.modal-body');
const modalFooter = document.querySelector('.modal-footer');
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
    console.log('datos firebase traido:', items);


    const titulo = { ' ': '', CODIGO: 'employed_id', NOMBRES: 'names', APELLIDOS: 'surnames', NACIMIENTO:'birth', EMAIL:'email',TELEFONO:'phone'}
    const dt = new Datatable('#dataTableEmpleados',
        [
            { id: 'btnEdit', text: 'editar', icon: 'edit', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); editProduct(elementos) } },
            //{ id: 'btnBarcode', text: 'barcode', icon: 'barcode',targetModal:'#myModal', action: function () { const elementos = dt.getSelected(); pintarBarcode(elementos); } },
            { id: 'dtnDelete', text: 'delete', icon: 'delete', action: function () { const elementos = dt.getSelected(); eliminarProducto(elementos) } },
            { id: 'dtnDuplicar', text: 'clonar', icon: 'content_copy', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); clonarProduct(elementos) } },
            { id: 'dtnCrear', text: 'nuevo', icon: 'post_add', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); crearEmpleado() } },
            { id: 'brnView', text: 'nuevo', icon: 'contract', targetModal: '#myModal', action: function () { const elementos = dt.getSelected(); viewProduct(elementos) } }
        ]
    );
    dt.setData(items, titulo);
    dt.makeTable();
});

function crearEmpleadoFirebase(e) {
    e.preventDefault()
    console.log('dentro funcion crearEmpleadoFirebase:', editStatus);
    const formModal=document.getElementById('employed-form');
    const btnSend=document.getElementById('btn-send');

    const employed_id = formModal['employed_id'].value;
    const names = formModal['names'].value;
    const surnames = formModal['surnames'].value;
    const birth = formModal['birth'].value;
    const email = formModal['email'].value;
    const phone = formModal['phone'].value;
    

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

        const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'))
        modal.hide()
        //showMessage(`Se creo y guardó un nuevo producto:${codigo}`,'success')
    } else {
        console.log('entre a else de actualizar id:', id);
        updateProduct(id, {
            employed_id:employed_id,
            names:names,
            surnames:surnames,
            birth:birth,
            email:email,
            phone:phone
                })
        editStatus = false
        btnSend.value = 'Crear';
        //cerrar modal y mostrar mensaje de operacion realizada        
        const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'))
        modal.hide()
        //showMessage(`Se edito con exito el producto:${id}`,'success')
    };

    formModal.reset()
    formModal.innerHTML = ''
};



function formularioEmpleados() {
    //creando elementos html para meterlo al modal
    const formContainer=document.createElement('div');
    formContainer.setAttribute('class','container');
    modalBody.appendChild(formContainer);
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
    //const formProduct =document.getElementById('')
    formContainer.innerHTML = formularioEmpleado;
}

function crearEmpleado() {
    clearHTML(modalBody);
    clearHTML(modalFooter);
    formularioEmpleados();//funcion que renderiza el formulario para crear y editar producto
    //const formModal=document.getElementById('tarea-form');
    const btnSend=document.createElement('button');
    btnSend.setAttribute('id','btn-send');
    btnSend.setAttribute('class','btn btn-primary');
    btnSend.addEventListener('click',crearEmpleadoFirebase)
    modalFooter.appendChild(btnSend);           

    editStatus = false;
    btnSend.textContent = 'Guardar'
};

function clearHTML(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild)
    }
};