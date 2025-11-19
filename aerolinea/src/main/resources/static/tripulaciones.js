// ===================================================================
// MÓDULO: TRIPULACIONES
// ===================================================================

let tripulaciones = [];
let tripulacionesFiltradas = [];
let editandoTripulacionId = null;
let empleadosParaTripulacion = [];

async function loadTripulaciones() {
    try {
        [tripulaciones, empleadosParaTripulacion] = await Promise.all([
            fetchAPI(ENDPOINTS.tripulaciones),
            fetchAPI(ENDPOINTS.empleados)
        ]);
        tripulacionesFiltradas = tripulaciones;
        renderTripulacionesTable();
        cargarPilotosSelect();
    } catch (error) {
        console.error('Error al cargar tripulaciones:', error);
        mostrarError('Error al cargar las tripulaciones');
    }
}

function cargarPilotosSelect() {
    const selectPiloto = document.getElementById('tripulacionPiloto');
    const selectCopiloto = document.getElementById('tripulacionCopiloto');
    
    if (!selectPiloto || !selectCopiloto) return;
    
    const pilotos = empleadosParaTripulacion.filter(emp => 
        emp.puesto && (emp.puesto.toLowerCase().includes('piloto') || emp.puesto.toLowerCase().includes('capitán'))
    );
    
    const opciones = '<option value="">Seleccione un piloto</option>' +
        pilotos.map(piloto => {
            const nombreCompleto = `${piloto.nombre} ${piloto.apellidoP} ${piloto.apellidoM || ''}`.trim();
            return `<option value="${piloto.idEmpleado}">${nombreCompleto} - ${piloto.puesto}</option>`;
        }).join('');
    
    selectPiloto.innerHTML = opciones;
    selectCopiloto.innerHTML = opciones;
}

function filtrarTripulaciones(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        tripulacionesFiltradas = tripulaciones;
    } else {
        tripulacionesFiltradas = tripulaciones.filter(trip => {
            const nombre = (trip.nombreTripulacion || '').toLowerCase();
            return nombre.includes(texto);
        });
    }
    
    renderTripulacionesTable();
}

function renderTripulacionesTable() {
    const tbody = document.getElementById('tablaTripulaciones');
    if (!tbody) return;

    if (tripulacionesFiltradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron tripulaciones</td></tr>';
        return;
    }

    tbody.innerHTML = tripulacionesFiltradas.map(trip => {
        const piloto = empleadosParaTripulacion.find(e => e.idEmpleado === trip.piloto?.idEmpleado);
        const copiloto = empleadosParaTripulacion.find(e => e.idEmpleado === trip.copiloto?.idEmpleado);
        
        const nombrePiloto = piloto ? `${piloto.nombre} ${piloto.apellidoP}` : 'N/A';
        const nombreCopiloto = copiloto ? `${copiloto.nombre} ${copiloto.apellidoP}` : 'N/A';
        
        return `
            <tr>
                <td>${trip.idTripulacion}</td>
                <td>${trip.nombreTripulacion}</td>
                <td>${nombrePiloto}</td>
                <td>${nombreCopiloto}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editTripulacion(${trip.idTripulacion})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTripulacion(${trip.idTripulacion})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editTripulacion(id) {
    const trip = tripulaciones.find(t => t.idTripulacion === id);
    if (!trip) return;

    editandoTripulacionId = id;
    
    document.getElementById('tripulacionNombre').value = trip.nombreTripulacion || '';
    document.getElementById('tripulacionPiloto').value = trip.piloto?.idEmpleado || '';
    document.getElementById('tripulacionCopiloto').value = trip.copiloto?.idEmpleado || '';

    const submitButton = document.querySelector('#formTripulacion button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Tripulación';
    
    document.getElementById('formTripulacion').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetTripulacionForm() {
    document.getElementById('formTripulacion').reset();
    editandoTripulacionId = null;
    
    const submitButton = document.querySelector('#formTripulacion button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-plus"></i> Agregar Tripulación';
}

async function saveTripulacion(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('tripulacionNombre').value.trim();
    const pilotoId = document.getElementById('tripulacionPiloto').value;
    const copilotoId = document.getElementById('tripulacionCopiloto').value;
    
    // Validaciones
    const validacion = validarTexto(nombre, 'Nombre de la tripulación');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    if (!pilotoId) {
        mostrarError('Debe seleccionar un piloto');
        return;
    }
    
    if (!copilotoId) {
        mostrarError('Debe seleccionar un copiloto');
        return;
    }
    
    if (pilotoId === copilotoId) {
        mostrarError('El piloto y copiloto no pueden ser la misma persona');
        return;
    }
    
    const tripulacion = {
        nombreTripulacion: nombre,
        piloto: { idEmpleado: parseInt(pilotoId) },
        copiloto: { idEmpleado: parseInt(copilotoId) }
    };
    
    try {
        if (editandoTripulacionId) {
            await fetchAPI(`${ENDPOINTS.tripulaciones}/${editandoTripulacionId}`, 'PUT', tripulacion);
            mostrarExito('Tripulación actualizada exitosamente');
        } else {
            await fetchAPI(ENDPOINTS.tripulaciones, 'POST', tripulacion);
            mostrarExito('Tripulación agregada exitosamente');
        }
        
        resetTripulacionForm();
        await loadTripulaciones();
    } catch (error) {
        mostrarError(error.message || 'Error al guardar la tripulación');
    }
}

async function deleteTripulacion(id) {
    const result = await mostrarConfirmacion('¿Está seguro de eliminar esta tripulación? Esta acción no se puede deshacer.');
    
    if (result.isConfirmed) {
        try {
            await fetchAPI(`${ENDPOINTS.tripulaciones}/${id}`, 'DELETE');
            mostrarExito('Tripulación eliminada exitosamente');
            await loadTripulaciones();
        } catch (error) {
            mostrarError(error.message || 'Error al eliminar la tripulación');
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const formTripulacion = document.getElementById('formTripulacion');
    if (formTripulacion) {
        formTripulacion.addEventListener('submit', saveTripulacion);
    }
    
    const btnNuevaTripulacion = document.getElementById('btnNuevaTripulacion');
    if (btnNuevaTripulacion) {
        btnNuevaTripulacion.addEventListener('click', resetTripulacionForm);
    }
    
    const searchTripulacion = document.getElementById('searchTripulacion');
    if (searchTripulacion) {
        searchTripulacion.addEventListener('input', (e) => filtrarTripulaciones(e.target.value));
    }
});
