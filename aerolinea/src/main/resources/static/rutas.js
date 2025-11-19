// ===================================================================
// MÓDULO: RUTAS
// ===================================================================

let rutas = [];
let rutasFiltradas = [];
let editandoRutaId = null;
let aeropuertosParaRutas = [];

async function loadRutas() {
    try {
        [rutas, aeropuertosParaRutas] = await Promise.all([
            fetchAPI(ENDPOINTS.rutas),
            fetchAPI(ENDPOINTS.aeropuertos)
        ]);
        rutasFiltradas = rutas;
        renderRutasTable();
        cargarAeropuertosSelect();
    } catch (error) {
        console.error('Error al cargar rutas:', error);
        mostrarError('Error al cargar las rutas');
    }
}

function cargarAeropuertosSelect() {
    const selectOrigen = document.getElementById('rutaOrigen');
    const selectDestino = document.getElementById('rutaDestino');
    
    if (!selectOrigen || !selectDestino) return;
    
    const opciones = '<option value="">Seleccione un aeropuerto</option>' +
        aeropuertosParaRutas.map(aeropuerto => 
            `<option value="${aeropuerto.idAeropuerto}">${aeropuerto.nombre} (${aeropuerto.codigoIATA})</option>`
        ).join('');
    
    selectOrigen.innerHTML = opciones;
    selectDestino.innerHTML = opciones;
}

function filtrarRutas(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        rutasFiltradas = rutas;
    } else {
        rutasFiltradas = rutas.filter(ruta => {
            const origen = (ruta.origen?.nombre || '').toLowerCase();
            const destino = (ruta.destino?.nombre || '').toLowerCase();
            const codigoOrigen = (ruta.origen?.codigoIATA || '').toLowerCase();
            const codigoDestino = (ruta.destino?.codigoIATA || '').toLowerCase();
            
            return origen.includes(texto) || destino.includes(texto) || 
                   codigoOrigen.includes(texto) || codigoDestino.includes(texto);
        });
    }
    
    renderRutasTable();
}

function renderRutasTable() {
    const tbody = document.getElementById('tablaRutas');
    if (!tbody) return;

    if (rutasFiltradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron rutas</td></tr>';
        return;
    }

    tbody.innerHTML = rutasFiltradas.map(ruta => {
        const origen = ruta.origen ? `${ruta.origen.nombre} (${ruta.origen.codigoIATA})` : 'N/A';
        const destino = ruta.destino ? `${ruta.destino.nombre} (${ruta.destino.codigoIATA})` : 'N/A';
        
        return `
            <tr>
                <td>${ruta.idRuta}</td>
                <td>${origen}</td>
                <td>${destino}</td>
                <td>${ruta.distancia} km</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editRuta(${ruta.idRuta})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteRuta(${ruta.idRuta})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editRuta(id) {
    const ruta = rutas.find(r => r.idRuta === id);
    if (!ruta) return;

    editandoRutaId = id;
    
    document.getElementById('rutaOrigen').value = ruta.origen?.idAeropuerto || '';
    document.getElementById('rutaDestino').value = ruta.destino?.idAeropuerto || '';
    document.getElementById('rutaDistancia').value = ruta.distancia || '';

    const submitButton = document.querySelector('#formRuta button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Ruta';
    
    document.getElementById('formRuta').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetRutaForm() {
    document.getElementById('formRuta').reset();
    editandoRutaId = null;
    
    const submitButton = document.querySelector('#formRuta button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-plus"></i> Agregar Ruta';
}

async function saveRuta(event) {
    event.preventDefault();
    
    const origenId = document.getElementById('rutaOrigen').value;
    const destinoId = document.getElementById('rutaDestino').value;
    const distancia = document.getElementById('rutaDistancia').value.trim();
    
    // Validaciones
    if (!origenId) {
        mostrarError('Debe seleccionar un aeropuerto de origen');
        return;
    }
    
    if (!destinoId) {
        mostrarError('Debe seleccionar un aeropuerto de destino');
        return;
    }
    
    if (origenId === destinoId) {
        mostrarError('El aeropuerto de origen y destino no pueden ser el mismo');
        return;
    }
    
    const validacion = validarDecimal(distancia, 'Distancia');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    const ruta = {
        origen: { idAeropuerto: parseInt(origenId) },
        destino: { idAeropuerto: parseInt(destinoId) },
        distancia: parseFloat(distancia)
    };
    
    try {
        if (editandoRutaId) {
            await fetchAPI(`${ENDPOINTS.rutas}/${editandoRutaId}`, 'PUT', ruta);
            mostrarExito('Ruta actualizada exitosamente');
        } else {
            await fetchAPI(ENDPOINTS.rutas, 'POST', ruta);
            mostrarExito('Ruta agregada exitosamente');
        }
        
        resetRutaForm();
        await loadRutas();
    } catch (error) {
        mostrarError(error.message || 'Error al guardar la ruta');
    }
}

async function deleteRuta(id) {
    const result = await mostrarConfirmacion('¿Está seguro de eliminar esta ruta? Esta acción no se puede deshacer.');
    
    if (result.isConfirmed) {
        try {
            await fetchAPI(`${ENDPOINTS.rutas}/${id}`, 'DELETE');
            mostrarExito('Ruta eliminada exitosamente');
            await loadRutas();
        } catch (error) {
            mostrarError(error.message || 'Error al eliminar la ruta');
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const formRuta = document.getElementById('formRuta');
    if (formRuta) {
        formRuta.addEventListener('submit', saveRuta);
    }
    
    const btnNuevaRuta = document.getElementById('btnNuevaRuta');
    if (btnNuevaRuta) {
        btnNuevaRuta.addEventListener('click', resetRutaForm);
    }
    
    const searchRuta = document.getElementById('searchRuta');
    if (searchRuta) {
        searchRuta.addEventListener('input', (e) => filtrarRutas(e.target.value));
    }
});
