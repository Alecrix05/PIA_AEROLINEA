// ===================================================================
// MÓDULO: ASIENTOS
// ===================================================================

let asientos = [];
let asientosFiltrados = [];
let editandoAsientoId = null;
let avionesParaAsientos = [];

async function loadAsientos() {
    try {
        [asientos, avionesParaAsientos] = await Promise.all([
            fetchAPI(ENDPOINTS.asientos),
            fetchAPI(ENDPOINTS.aviones)
        ]);
        asientosFiltrados = asientos;
        renderAsientosTable();
        cargarAvionesSelect();
    } catch (error) {
        console.error('Error al cargar asientos:', error);
        mostrarError('Error al cargar los asientos');
    }
}

function cargarAvionesSelect() {
    const select = document.getElementById('asientoAvion');
    if (!select) return;
    
    select.innerHTML = '<option value="">Seleccione un avión</option>' +
        avionesParaAsientos.map(avion => 
            `<option value="${avion.idAvion}">${avion.matricula} - ${avion.modelo}</option>`
        ).join('');
}

function filtrarAsientos(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        asientosFiltrados = asientos;
    } else {
        asientosFiltrados = asientos.filter(asiento => {
            const codigo = (asiento.codigoAsiento || '').toLowerCase();
            const clase = (asiento.clase || '').toLowerCase();
            
            return codigo.includes(texto) || clase.includes(texto);
        });
    }
    
    renderAsientosTable();
}

function renderAsientosTable() {
    const tbody = document.getElementById('tablaAsientos');
    if (!tbody) return;

    if (asientosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron asientos</td></tr>';
        return;
    }

    tbody.innerHTML = asientosFiltrados.map(asiento => {
        const avion = avionesParaAsientos.find(a => a.idAvion === asiento.avion?.idAvion);
        const matriculaAvion = avion ? avion.matricula : 'N/A';
        
        const claseBadge = asiento.clase === 'Primera' ? 'bg-warning' : 
                          asiento.clase === 'Ejecutiva' ? 'bg-info' : 'bg-secondary';
        
        return `
            <tr>
                <td>${asiento.idAsiento}</td>
                <td>${matriculaAvion}</td>
                <td><span class="badge bg-primary">${asiento.codigoAsiento}</span></td>
                <td>${asiento.fila || 'N/A'}</td>
                <td>${asiento.columna || 'N/A'}</td>
                <td><span class="badge ${claseBadge}">${asiento.clase}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editAsiento(${asiento.idAsiento})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAsiento(${asiento.idAsiento})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editAsiento(id) {
    const asiento = asientos.find(a => a.idAsiento === id);
    if (!asiento) return;

    editandoAsientoId = id;
    
    document.getElementById('asientoAvion').value = asiento.avion?.idAvion || '';
    document.getElementById('asientoCodigo').value = asiento.codigoAsiento || '';
    document.getElementById('asientoFila').value = asiento.fila || '';
    document.getElementById('asientoColumna').value = asiento.columna || '';
    document.getElementById('asientoClase').value = asiento.clase || 'Económica';
    document.getElementById('asientoUbicacion').value = asiento.ubicacion || '';

    const submitButton = document.querySelector('#formAsiento button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Asiento';
    
    document.getElementById('formAsiento').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetAsientoForm() {
    document.getElementById('formAsiento').reset();
    editandoAsientoId = null;
    
    const submitButton = document.querySelector('#formAsiento button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-plus"></i> Agregar Asiento';
}

async function saveAsiento(event) {
    event.preventDefault();
    
    const avionId = document.getElementById('asientoAvion').value;
    const codigo = document.getElementById('asientoCodigo').value.trim();
    const fila = document.getElementById('asientoFila').value.trim();
    const columna = document.getElementById('asientoColumna').value.trim();
    const clase = document.getElementById('asientoClase').value;
    const ubicacion = document.getElementById('asientoUbicacion').value.trim();
    
    // Validaciones
    if (!avionId) {
        mostrarError('Debe seleccionar un avión');
        return;
    }
    
    let validacion = validarTexto(codigo, 'Código del asiento');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    if (fila) {
        validacion = validarEnteroPositivo(fila, 'Fila', false);
        if (!validacion.valido) {
            mostrarError(validacion.mensaje);
            return;
        }
    }
    
    const asiento = {
        avion: { idAvion: parseInt(avionId) },
        codigoAsiento: normalizarMayusculas(codigo),
        fila: fila ? parseInt(fila) : null,
        columna: columna ? normalizarMayusculas(columna) : null,
        clase: clase,
        ubicacion: ubicacion || null
    };
    
    try {
        if (editandoAsientoId) {
            await fetchAPI(`${ENDPOINTS.asientos}/${editandoAsientoId}`, 'PUT', asiento);
            mostrarExito('Asiento actualizado exitosamente');
        } else {
            await fetchAPI(ENDPOINTS.asientos, 'POST', asiento);
            mostrarExito('Asiento agregado exitosamente');
        }
        
        resetAsientoForm();
        await loadAsientos();
    } catch (error) {
        mostrarError(error.message || 'Error al guardar el asiento');
    }
}

async function deleteAsiento(id) {
    const result = await mostrarConfirmacion('¿Está seguro de eliminar este asiento? Esta acción no se puede deshacer.');
    
    if (result.isConfirmed) {
        try {
            await fetchAPI(`${ENDPOINTS.asientos}/${id}`, 'DELETE');
            mostrarExito('Asiento eliminado exitosamente');
            await loadAsientos();
        } catch (error) {
            mostrarError(error.message || 'Error al eliminar el asiento');
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const formAsiento = document.getElementById('formAsiento');
    if (formAsiento) {
        formAsiento.addEventListener('submit', saveAsiento);
    }
    
    const btnNuevoAsiento = document.getElementById('btnNuevoAsiento');
    if (btnNuevoAsiento) {
        btnNuevoAsiento.addEventListener('click', resetAsientoForm);
    }
    
    const searchAsiento = document.getElementById('searchAsiento');
    if (searchAsiento) {
        searchAsiento.addEventListener('input', (e) => filtrarAsientos(e.target.value));
    }
});
