import { guardarRegistro, onGetRegistroLaboral, onGetEmpleados, deleteRegistroLaboral, updateRegistroLaboral } from './firebase.js';
import { Datatable } from './dataTable.js';
import { formularioEmpleados, clearHTML, sincronizarLocalStorage } from './empleados.js';

// Función para mostrar errores
function mostrarError(mensaje, error = null) {
    console.error(`Error: ${mensaje}`, error);
    alert(`Error: ${mensaje}`);
}

// Obtener empleados del localStorage con manejo de excepciones
let empleados = [];
try {
    const empleadosLS = localStorage.getItem('empleadosLS');
    empleados = empleadosLS ? JSON.parse(empleadosLS) : [];
    console.log('empleadosLS', empleados);
} catch (error) {
    mostrarError('Error al cargar empleados del almacenamiento local', error);
    empleados = [];
}

// Para guardar los registros en firebase
const tareaForm = document.getElementById('form1');
if (!tareaForm) {
    mostrarError('No se encontró el formulario con ID "form1"');
} else {
    tareaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
            const input_work = tareaForm['input_work'].value;
            const output_work = tareaForm['output_work'].value;
            const employed_id = tareaForm['employed_id'].value;
            
            if (!employed_id || employed_id.trim() === '') {
                throw new Error('El ID de empleado es obligatorio');
            }
            
            let status = false;
            guardarRegistro(employed_id.trim(), input_work, output_work, status);
            tareaForm.reset();
        } catch (error) {
            mostrarError('Error al guardar el registro', error);
        }
    });
}

// Obtener empleados con manejo de excepciones
try {
    const empleados2 = onGetEmpleados((querySnapshot) => {
        try {
            const items = [];

            if (querySnapshot) {
                querySnapshot.forEach(doc => {
                    let obj = {};
                    obj.id = doc.id;
                    obj.values = doc.data();
                    items.push(obj);
                });
            }

            sincronizarLocalStorage(items, 'empleadosLS');
            renderDatalist(items);
        } catch (error) {
            mostrarError('Error al procesar los datos de empleados', error);
        }
    });
} catch (error) {
    mostrarError('Error al obtener empleados', error);
}

// Traer los datos de la colección RegistroLaboral con manejo de excepciones
try {
    const registroLaboral = onGetRegistroLaboral((querySnapshot) => {
        try {
            const items = [];

            if (querySnapshot) {
                querySnapshot.forEach(doc => {
                    try {
                        let obj = {};
                        obj.id = doc.id;
                        obj.values = doc.data();
                        
                        // Manejo seguro para encontrar el empleado correspondiente
                        let objetoEmpleado = null;
                        if (empleados && Array.isArray(empleados)) {
                            objetoEmpleado = empleados.filter(
                                objeto => objeto['values'] && 
                                objeto['values'].employed_id === obj['values'].employed_id
                            )[0];
                        }
                        
                        obj['values'].nombres = objetoEmpleado ? objetoEmpleado['values'].names : 's/n';
                        items.push(obj);
                    } catch (docError) {
                        console.error('Error al procesar un documento de registro laboral', docError);
                        // Continuar con el siguiente documento
                    }
                });
            }
            console.log('datos firebase traído:', items);

            // Datos para renderizar la tabla
            const titulo = { '': '', NOMBRES: 'nombres', ENTRADA: 'input_work', SALIDA: 'output_work' };
            
            try {
                const dt = new Datatable('#dataTableRegistro',
                    [
                        { 
                            id: 'btnEdit', 
                            text: 'editar', 
                            icon: 'edit', 
                            targetModal: '#myModal', 
                            action: function () { 
                                try {
                                    const elementos = dt.getSelected(); 
                                    if (elementos) {
                                        editRegistroLaboral(elementos);
                                    } else {
                                        mostrarError('No se ha seleccionado ningún elemento para editar');
                                    }
                                } catch (actionError) {
                                    mostrarError('Error al editar el registro', actionError);
                                }
                            } 
                        },
                        { 
                            id: 'dtnDelete', 
                            text: 'delete', 
                            icon: 'delete', 
                            targetModal: '#myModal', 
                            action: function () { 
                                try {
                                    const elementos = dt.getSelected(); 
                                    if (elementos) {
                                        eliminarRegistroLaboral(elementos);
                                    } else {
                                        mostrarError('No se ha seleccionado ningún elemento para eliminar');
                                    }
                                } catch (actionError) {
                                    mostrarError('Error al eliminar el registro', actionError);
                                }
                            } 
                        }
                    ]
                );
                dt.setData(items, titulo);
                dt.makeTable();
            } catch (tableError) {
                mostrarError('Error al crear la tabla de datos', tableError);
            }
        } catch (error) {
            mostrarError('Error al procesar los datos de registro laboral', error);
        }
    });
} catch (error) {
    mostrarError('Error al obtener el registro laboral', error);
}

function eliminarRegistroLaboral(arrayObj) {
    try {
        if (!arrayObj || !arrayObj.id) {
            throw new Error('No se ha proporcionado un ID válido para eliminar');
        }
        
        let id = arrayObj.id;
        const modalBody = document.querySelector('.modal-body');
        const modalFooter = document.querySelector('.modal-footer');
        
        if (!modalBody || !modalFooter) {
            throw new Error('No se encontraron los elementos del modal');
        }
        
        clearHTML(modalBody);
        clearHTML(modalFooter);
        
        modalBody.textContent = 'Desea eliminar el registro de ingreso y salida?';

        const btnDelete = document.createElement('button');
        btnDelete.setAttribute('id', 'btn-delete');
        btnDelete.setAttribute('class', 'btn btn-danger');
        btnDelete.addEventListener('click', async () => {
            try {
                await deleteRegistroLaboral(id);
                const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'));
                if (modal) {
                    modal.hide();
                } else {
                    throw new Error('No se pudo encontrar la instancia del modal');
                }
            } catch (deleteError) {
                mostrarError('Error al eliminar el registro', deleteError);
            }
        });
        modalFooter.appendChild(btnDelete);
        btnDelete.textContent = 'Eliminar';
    } catch (error) {
        mostrarError('Error al preparar la eliminación del registro', error);
    }
}

function renderDatalist(items) {
    const datalist = document.getElementById('colaborador');
    if (!datalist) {
        throw new Error('No se encontró el elemento datalist con ID "colaborador"');
    }

    datalist.innerHTML = items.map(item => 
        `<option value="${item.values.employed_id}">${item.values.names}</option>`
    ).join('');
}

function editRegistroLaboral(elementos) {
    try {
        if (!elementos || !elementos.id) {
            throw new Error('No se ha proporcionado un elemento válido para editar');
        }
        
        console.log('se actualizará:', elementos.id);
        
        const modalBody = document.querySelector('.modal-body');
        const modalFooter = document.querySelector('.modal-footer');
        
        if (!modalBody || !modalFooter) {
            throw new Error('No se encontraron los elementos del modal');
        }
        
        clearHTML(modalBody);
        clearHTML(modalFooter);

        const formularioRegistroHTML = `
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
        `;
        modalBody.innerHTML = formularioRegistroHTML;

        const registroForm = document.getElementById('formRegistro');
        if (!registroForm) {
            throw new Error('No se pudo crear el formulario de registro');
        }

        // Verificar que los valores existan antes de asignarlos
        if (elementos['values'] && elementos['values'].employed_id) {
            registroForm['employed_id'].value = elementos['values'].employed_id;
        }
        
        if (elementos['values'] && elementos['values'].input_work) {
            registroForm['input_work'].value = elementos['values'].input_work;
        }
        
        if (elementos['values'] && elementos['values'].output_work) {
            registroForm['output_work'].value = elementos['values'].output_work;
        }

        const btnUpdate = document.createElement('button');
        btnUpdate.setAttribute('id', 'btn-Update');
        btnUpdate.setAttribute('class', 'btn btn-danger');
        btnUpdate.textContent = 'Actualizar';
        modalFooter.appendChild(btnUpdate);

        btnUpdate.addEventListener('click', async () => {
            try {
                // Validar que los campos requeridos tengan valores
                const input_work = registroForm['input_work'].value;
                const output_work = registroForm['output_work'].value;
                
                if (!input_work || !output_work) {
                    throw new Error('Los campos de entrada y salida son obligatorios');
                }
                
                const id = elementos.id;
                await updateRegistroLaboral(id, { input_work: input_work, output_work: output_work });
                
                const modal = bootstrap.Modal.getInstance(document.querySelector('#myModal'));
                if (modal) {
                    modal.hide();
                } else {
                    throw new Error('No se pudo encontrar la instancia del modal');
                }
            } catch (updateError) {
                mostrarError('Error al actualizar el registro', updateError);
            }
        });
    } catch (error) {
        mostrarError('Error al preparar la edición del registro', error);
    }
}





