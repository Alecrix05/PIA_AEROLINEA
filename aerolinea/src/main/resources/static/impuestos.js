// ===================================================================
// MÓDULO: IMPUESTOS
// ===================================================================

let impuestos = [];
let impuestosFiltrados = [];
let editandoImpuestoId = null;

async function loadImpuestos() {
    try {
        impuestos = await fetchAPI(ENDPOINTS.impuestos);
        impuestosFiltrados = impuestos;
        renderImpuestosTable();
    } catch (error) {
        console.error('Error al cargar impuestos:', error);
        mostrarError('Error al cargar los impuestos');
    }
}

function filtrarImpuestos(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        impuestosFiltrados = impuestos;
    } else {
        impuestosFiltrados = impuestos.filter(impuesto => {
            const nombre = (impuesto.nombre || '').toLowerCase();
            const descripcion = (impuesto.descripcion || '').toLowerCase();
            
            return nombre.includes(texto) || descripcion.includes(texto);
        });
    }
    
    renderImpuestosTable();
}

function renderImpuestosTable() {
    const tbody = document.getElementById('tablaImpuestos');
    if (!tbody) return;

    if (impuestosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron impuestos</td></tr>';
        return;
    }

    tbody.innerHTML = impuestosFiltrados.map(impuesto => `
        <tr>
            <td>${impuesto.idImpuesto}</td>
            <td>${impuesto.nombre}</td>
            <td><span class="badge bg-info">${impuesto.porcentaje}%</span></td>
            <td>${impuesto.descripcion || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editImpuesto(${impuesto.idImpuesto})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteImpuesto(${impuesto.idImpuesto})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function editImpuesto(id) {
    const impuesto = impuestos.find(i => i.idImpuesto === id);
    if (!impuesto) return;

    editandoImpuestoId = id;
    
    document.getElementById('impuestoNombre').value = impuesto.nombre || '';
    document.getElementById('impuestoPorcentaje').value = impuesto.porcentaje || '';
    document.getElementById('impuestoDescripcion').value = impuesto.descripcion || '';

    const submitButton = document.querySelector('#formImpuesto button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Impuesto';
    
    document.getElementById('formImpuesto').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetImpuestoForm() {
    document.getElementById('formImpuesto').reset();
    editandoImpuestoId = null;
    
    const submitButton = document.querySelector('#formImpuesto button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-plus"></i> Agregar Impuesto';
}

async function saveImpuesto(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('impuestoNombre').value.trim();
    const porcentaje = document.getElementById('impuestoPorcentaje').value.trim();
    const descripcion = document.getElementById('impuestoDescripcion').value.trim();
    
    // Validaciones
    let validacion = validarTexto(nombre, 'Nombre del impuesto');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    validacion = validarDecimal(porcentaje, 'Porcentaje');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    const porcValue = parseFloat(porcentaje);
    if (porcValue < 0 || porcValue > 100) {
        mostrarError('El porcentaje debe estar entre 0 y 100');
        return;
    }
    
    const impuesto = {
        nombre: nombre,
        porcentaje: porcValue,
        descripcion: descripcion || null
    };
    
    try {
        if (editandoImpuestoId) {
            await fetchAPI(`${ENDPOINTS.impuestos}/${editandoImpuestoId}`, 'PUT', impuesto);
            mostrarExito('Impuesto actualizado exitosamente');
        } else {
            await fetchAPI(ENDPOINTS.impuestos, 'POST', impuesto);
            mostrarExito('Impuesto agregado exitosamente');
        }
        
        resetImpuestoForm();
        await loadImpuestos();
    } catch (error) {
        mostrarError(error.message || 'Error al guardar el impuesto');
    }
}

async function deleteImpuesto(id) {
    const result = await mostrarConfirmacion('¿Está seguro de eliminar este impuesto? Esta acción no se puede deshacer.');
    
    if (result.isConfirmed) {
        try {
            await fetchAPI(`${ENDPOINTS.impuestos}/${id}`, 'DELETE');
            mostrarExito('Impuesto eliminado exitosamente');
            await loadImpuestos();
        } catch (error) {
            mostrarError(error.message || 'Error al eliminar el impuesto');
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const formImpuesto = document.getElementById('formImpuesto');
    if (formImpuesto) {
        formImpuesto.addEventListener('submit', saveImpuesto);
    }
    
    const btnNuevoImpuesto = document.getElementById('btnNuevoImpuesto');
    if (btnNuevoImpuesto) {
        btnNuevoImpuesto.addEventListener('click', resetImpuestoForm);
    }
    
    const searchImpuesto = document.getElementById('searchImpuesto');
    if (searchImpuesto) {
        searchImpuesto.addEventListener('input', (e) => filtrarImpuestos(e.target.value));
    }
});
