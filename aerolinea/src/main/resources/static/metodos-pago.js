// ===================================================================
// MÓDULO: MÉTODOS DE PAGO
// ===================================================================

let metodosPago = [];
let metodosPagoFiltrados = [];
let editandoMetodoPagoId = null;

async function loadMetodosPago() {
    try {
        metodosPago = await fetchAPI(ENDPOINTS.metodosPago);
        metodosPagoFiltrados = metodosPago;
        renderMetodosPagoTable();
    } catch (error) {
        console.error('Error al cargar métodos de pago:', error);
        mostrarError('Error al cargar los métodos de pago');
    }
}

function filtrarMetodosPago(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        metodosPagoFiltrados = metodosPago;
    } else {
        metodosPagoFiltrados = metodosPago.filter(metodo => {
            const nombre = (metodo.nombre || '').toLowerCase();
            const descripcion = (metodo.descripcion || '').toLowerCase();
            
            return nombre.includes(texto) || descripcion.includes(texto);
        });
    }
    
    renderMetodosPagoTable();
}

function renderMetodosPagoTable() {
    const tbody = document.getElementById('tablaMetodosPago');
    if (!tbody) return;

    if (metodosPagoFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No se encontraron métodos de pago</td></tr>';
        return;
    }

    tbody.innerHTML = metodosPagoFiltrados.map(metodo => `
        <tr>
            <td>${metodo.idMetodoPago}</td>
            <td>${metodo.nombre}</td>
            <td>${metodo.descripcion || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editMetodoPago(${metodo.idMetodoPago})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteMetodoPago(${metodo.idMetodoPago})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function editMetodoPago(id) {
    const metodo = metodosPago.find(m => m.idMetodoPago === id);
    if (!metodo) return;

    editandoMetodoPagoId = id;
    
    document.getElementById('metodoPagoNombre').value = metodo.nombre || '';
    document.getElementById('metodoPagoDescripcion').value = metodo.descripcion || '';

    const submitButton = document.querySelector('#formMetodoPago button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Método de Pago';
    
    document.getElementById('formMetodoPago').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetMetodoPagoForm() {
    document.getElementById('formMetodoPago').reset();
    editandoMetodoPagoId = null;
    
    const submitButton = document.querySelector('#formMetodoPago button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-plus"></i> Agregar Método de Pago';
}

async function saveMetodoPago(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('metodoPagoNombre').value.trim();
    const descripcion = document.getElementById('metodoPagoDescripcion').value.trim();
    
    // Validaciones
    const validacion = validarTexto(nombre, 'Nombre del método de pago');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    const metodo = {
        nombre: capitalizarTexto(nombre),
        descripcion: descripcion || null
    };
    
    try {
        if (editandoMetodoPagoId) {
            await fetchAPI(`${ENDPOINTS.metodosPago}/${editandoMetodoPagoId}`, 'PUT', metodo);
            mostrarExito('Método de pago actualizado exitosamente');
        } else {
            await fetchAPI(ENDPOINTS.metodosPago, 'POST', metodo);
            mostrarExito('Método de pago agregado exitosamente');
        }
        
        resetMetodoPagoForm();
        await loadMetodosPago();
    } catch (error) {
        mostrarError(error.message || 'Error al guardar el método de pago');
    }
}

async function deleteMetodoPago(id) {
    const result = await mostrarConfirmacion('¿Está seguro de eliminar este método de pago? Esta acción no se puede deshacer.');
    
    if (result.isConfirmed) {
        try {
            await fetchAPI(`${ENDPOINTS.metodosPago}/${id}`, 'DELETE');
            mostrarExito('Método de pago eliminado exitosamente');
            await loadMetodosPago();
        } catch (error) {
            mostrarError(error.message || 'Error al eliminar el método de pago');
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const formMetodo = document.getElementById('formMetodoPago');
    if (formMetodo) {
        formMetodo.addEventListener('submit', saveMetodoPago);
    }
    
    const btnNuevoMetodo = document.getElementById('btnNuevoMetodoPago');
    if (btnNuevoMetodo) {
        btnNuevoMetodo.addEventListener('click', resetMetodoPagoForm);
    }
    
    const searchMetodo = document.getElementById('searchMetodoPago');
    if (searchMetodo) {
        searchMetodo.addEventListener('input', (e) => filtrarMetodosPago(e.target.value));
    }
});
