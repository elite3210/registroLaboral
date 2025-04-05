import { 
    db,
    doc,
    deleteDoc,
    obtenerEmpleado, 
    guardarRegistro, 
    obtenerRegistrosPorFecha, 
    obtenerTodosEmpleados,
    onGetEmpleados
  } from './firebase-config.js';
  
  document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const introScreen = document.getElementById("intro-screen");
    const appContainer = document.querySelector(".app-container");
    
    // Mostrar animación inicial
    setTimeout(() => {
      // Animación de desvanecimiento para la pantalla de inicio
      introScreen.style.animation = "fadeOutIntro 1s ease-in-out forwards";
      
      // Mostrar el contenido principal después de la animación
      setTimeout(() => {
        introScreen.style.display = "none";
        appContainer.style.display = "flex";
        
        // Inicializar la aplicación normalmente
        initApp();
      }, 1000);
    }, 3500); // Duración total de la animación de entrada
  });
  
  function initApp() {
    // Elementos del DOM
    const loginSection = document.getElementById("login-section");
    const registroSection = document.getElementById("registro-section");
    const formLogin = document.getElementById("form-login");
    const dniInput = document.getElementById("dni");
    const dniError = document.getElementById("dni-error");
  
    // Variables de estado
    let empleadoActual = null;
    let fechaFiltro = null;
  
    // Evento para el formulario de login
    formLogin.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (validateDNI()) {
        const dni = dniInput.value.trim();
        const empleado = await obtenerEmpleado(dni);
        
        if (empleado) {
          empleadoActual = empleado;
          showRegistroInterface(empleado);
        } else {
          showError("DNI no registrado en el sistema");
        }
      }
    });
  
    // Validar DNI
    function validateDNI() {
      const dni = dniInput.value.trim();
      
      if (!dni) {
        dniError.textContent = "";
        return false;
      }
      
      if (!/^\d{8}$/.test(dni)) {
        dniError.textContent = "El DNI debe contener 8 dígitos";
        return false;
      }
      
      dniError.textContent = "";
      return true;
    }
  
    // Mostrar interfaz de registro
    function showRegistroInterface(empleado) {
      loginSection.style.display = "none";
      registroSection.innerHTML = createRegistroInterface(empleado);
      registroSection.style.display = "block";
      
      // Configurar eventos para la nueva interfaz
      setupRegistroInterface();
      loadEmpleados();
      loadRegistros(new Date());
    }
  
    // Configurar eventos de la interfaz de registro
    function setupRegistroInterface() {
      const formRegistro = document.getElementById("form-registro");
      fechaFiltro = document.getElementById("fecha-filtro");
      
      // Establecer fecha actual por defecto
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      fechaFiltro.value = today;
      
      // Configurar fecha y hora automáticas
      const fechaInput = document.getElementById("fecha");
      const horaEntradaInput = document.getElementById("hora-entrada");
      const horaSalidaInput = document.getElementById("hora-salida");
      
      fechaInput.value = today;
      
      // Función para establecer hora actual
      const setCurrentTime = (element) => {
        const now = new Date();
        const horas = String(now.getHours()).padStart(2, '0');
        const minutos = String(now.getMinutes()).padStart(2, '0');
        element.value = `${horas}:${minutos}`;
      };
      
      // Botón para hora actual en entrada
      const ahoraEntradaBtn = document.createElement('button');
      ahoraEntradaBtn.type = 'button';
      ahoraEntradaBtn.className = 'time-now-btn';
      ahoraEntradaBtn.textContent = 'Ahora';
      ahoraEntradaBtn.onclick = () => setCurrentTime(horaEntradaInput);
      horaEntradaInput.parentNode.appendChild(ahoraEntradaBtn);
      
      // Botón para hora actual en salida
      const ahoraSalidaBtn = document.createElement('button');
      ahoraSalidaBtn.type = 'button';
      ahoraSalidaBtn.className = 'time-now-btn';
      ahoraSalidaBtn.textContent = 'Ahora';
      ahoraSalidaBtn.onclick = () => setCurrentTime(horaSalidaInput);
      horaSalidaInput.parentNode.appendChild(ahoraSalidaBtn);
  
      // Evento para filtrar por fecha
      fechaFiltro.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        loadRegistros(selectedDate);
      });
      
      // Evento para el formulario de registro
      formRegistro.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const fecha = document.getElementById("fecha").value;
        const horaEntrada = document.getElementById("hora-entrada").value;
        const horaSalida = document.getElementById("hora-salida").value;
        
        if (!fecha) {
          showMessage("Debe seleccionar una fecha", true);
          return;
        }
        
        if (!horaEntrada && !horaSalida) {
          showMessage("Debe ingresar al menos una hora (entrada o salida)", true);
          return;
        }
        
        try {
          // Buscar si ya existe un registro para esta fecha
          const registrosHoy = await obtenerRegistrosPorFecha(
            empleadoActual.employed_id, 
            fecha
          );
          
          if (registrosHoy.length > 0) {
            // Actualizar registro existente
            const registroExistente = registrosHoy[0];
            await updateDoc(doc(db, 'RegistroLaboral', registroExistente.id), {
              input_work: horaEntrada || registroExistente.input_work,
              output_work: horaSalida || registroExistente.output_work,
              status: !!horaSalida
            });
            showMessage("Registro actualizado correctamente");
          } else {
            // Crear nuevo registro
            await guardarRegistro(
              empleadoActual.employed_id,
              horaEntrada,
              horaSalida,
              !!horaSalida,
              fecha
            );
            showMessage("Registro creado correctamente");
          }
          
          // Recargar registros
          loadRegistros(new Date(fechaFiltro.value));
          
          // Limpiar solo las horas, mantener la fecha
          horaEntradaInput.value = "";
          horaSalidaInput.value = "";
          
        } catch (error) {
          showMessage("Error al guardar el registro: " + error.message, true);
        }
      });
    }
  
    // Cargar lista de empleados
    async function loadEmpleados() {
      const empleadosContainer = document.getElementById("empleados-container");
      empleadosContainer.innerHTML = "<p>Cargando empleados...</p>";
      
      const empleados = await obtenerTodosEmpleados();
      
      if (empleados.length === 0) {
        empleadosContainer.innerHTML = "<p>No hay empleados registrados</p>";
        return;
      }
      
      empleadosContainer.innerHTML = "";
      empleados.forEach(emp => {
        const empCard = document.createElement('div');
        empCard.className = 'empleado-card';
        empCard.innerHTML = `
          <h4>${emp.names}</h4>
          <p>${emp.employed_id}</p>
        `;
        empleadosContainer.appendChild(empCard);
      });
    }
  
    // Cargar registros por fecha
    async function loadRegistros(date) {
      const registrosList = document.getElementById("registros-list");
      registrosList.innerHTML = "<p>Cargando registros...</p>";
      
      if (!empleadoActual) return;
      
      const fechaStr = date.toISOString().split('T')[0];
      const registros = await obtenerRegistrosPorFecha(empleadoActual.employed_id, fechaStr);
      
      if (registros.length === 0) {
        registrosList.innerHTML = `<p>No hay registros para ${fechaStr}</p>`;
        return;
      }
      
      registrosList.innerHTML = "";
      registros.forEach(reg => {
        const regItem = document.createElement('div');
        regItem.className = 'registro-item';
        
        let contenido = `
          <div class="registro-header">
            <p><strong>Fecha:</strong> ${reg.fecha}</p>
            <button class="delete-btn" data-id="${reg.id}">×</button>
          </div>
        `;
        
        if (reg.input_work) {
          contenido += `<p><strong>Entrada:</strong> ${reg.input_work}</p>`;
        }
        
        if (reg.output_work) {
          contenido += `<p><strong>Salida:</strong> ${reg.output_work}</p>`;
          
          if (reg.input_work) {
            const entradaTime = new Date(`${reg.fecha}T${reg.input_work}`);
            const salidaTime = new Date(`${reg.fecha}T${reg.output_work}`);
            const horas = calculateHorasTrabajadas(entradaTime, salidaTime);
            contenido += `<p><strong>Horas trabajadas:</strong> ${horas}</p>`;
          }
        }
        
        regItem.innerHTML = contenido;
        registrosList.appendChild(regItem);
      });
  
      // Agregar eventos a los botones de eliminar
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          if (confirm("¿Está seguro que desea eliminar este registro?")) {
            const registroId = e.target.dataset.id;
            try {
              await deleteDoc(doc(db, 'RegistroLaboral', registroId));
              showMessage("Registro eliminado correctamente");
              // Actualizar la lista inmediatamente después de eliminar
              loadRegistros(new Date(fechaFiltro.value));
            } catch (error) {
              showMessage("Error al eliminar el registro: " + error.message, true);
            }
          }
        });
      });
    }
  
    // Crear interfaz de registro
    function createRegistroInterface(empleado) {
      return `
        <div class="registro-interface">
          <div class="registro-main">
            <h2>Registro de Horas</h2>
            <p class="empleado-info">Empleado: ${empleado.names} ${empleado.surnames}</p>
            
            <form id="form-registro">
              <div class="form-group">
                <label for="fecha">Fecha:</label>
                <input type="date" id="fecha" name="fecha" required />
              </div>
  
              <div class="dual-time-input">
                <div class="form-group">
                  <label for="hora-entrada">Hora de Entrada:</label>
                  <input type="time" id="hora-entrada" name="hora-entrada" />
                </div>
  
                <div class="form-group">
                  <label for="hora-salida">Hora de Salida:</label>
                  <input type="time" id="hora-salida" name="hora-salida" />
                </div>
              </div>
  
              <button type="submit" class="submit-btn">Guardar Registro</button>
            </form>
  
            <div id="registro-info" class="registro-info"></div>
          </div>
  
          <div class="registro-sidebar">
            <div class="sidebar-header">
              <h3>Historial de Registros</h3>
              <input type="date" id="fecha-filtro" class="date-filter" />
            </div>
            <div class="registros-list" id="registros-list"></div>
          </div>
  
          <div class="empleados-list">
            <h3>Empleados Registrados</h3>
            <div class="empleados-container" id="empleados-container"></div>
          </div>
        </div>
      `;
    }
  
    // Mostrar mensaje de error
    function showError(mensaje) {
      dniError.textContent = mensaje;
      dniError.style.color = "var(--error-color)";
    }
  
    // Mostrar mensaje en la interfaz de registro
    function showMessage(mensaje, isError = false) {
      const registroInfo = document.getElementById("registro-info");
      if (registroInfo) {
        registroInfo.textContent = mensaje;
        registroInfo.className = isError ? "registro-info error" : "registro-info success";
        registroInfo.style.display = "block";
        
        setTimeout(() => {
          registroInfo.style.display = "none";
        }, 5000);
      }
    }
  
    // Calcular horas trabajadas
    function calculateHorasTrabajadas(entrada, salida) {
      const diffMs = salida - entrada;
      const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
      const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
      return `${diffHrs} horas y ${diffMins} minutos`;
    }
  }

