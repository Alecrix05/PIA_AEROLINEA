// ===================================================================
// MÓDULO: TARIFAS
// ===================================================================

let tarifas = [];
let tarifasFiltradas = [];
let editandoTarifaId = null;

async function loadTarifas() {
    try {
        tarifas = await fetchAPI(ENDPOINTS.tarifas);
        tarifasFiltradas = tarifas;
        renderTarifasTable();
    } catch (error) {
        console.error('Error al cargar tarifas:', error);
        mostrarError('Error al cargar las tarifas');
    }
}

function filtrarTarifas(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        tarifasFiltradas = tarifas;
    } else {
        tarifasFiltradas = tarifas.filter(tarifa => {
            const nombre = (tarifa.nombre || '').toLowerCase();
            const clase = (tarifa.clase || '').toLowerCase();
            
            return nombre.includes(texto) || clase.includes(texto);
        });
    }
    
    renderTarifasTable();
}

function renderTarifasTable() {
    const tbody = document.getElementById('tablaTarifas');
    if (!tbody) return;

    if (tarifasFiltradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron tarifas</td></tr>';
        return;
    }

    tbody.innerHTML = tarifasFiltradas.map(tarifa => {
        const claseBadge = tarifa.clase === 'Primera' ? 'bg-warning' : 
                          tarifa.clase === 'Ejecutiva' ? 'bg-info' : 'bg-secondary';
        const activoBadge = tarifa.activo ? 'bg-success' : 'bg-danger';
        const activoTexto = tarifa.activo ? 'Activa' : 'Inactiva';
        
        return `
            <tr>
                <td>${tarifa.idTarifa}</td>
                <td>${tarifa.nombre}</td>
                <td><span class="badge ${claseBadge}">${tarifa.clase}</span></td>
                <td>$${tarifa.precioBase.toFixed(2)}</td>
                <td><span class="badge ${activoBadge}">${activoTexto}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editTarifa(${tarifa.idTarifa})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTarifa(${tarifa.idTarifa})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editTarifa(id) {
    const tarifa = tarifas.find(t => t.idTarifa === id);
    if (!tarifa) return;

    editandoTarifaId = id;
    
    document.getElementById('tarifaNombre').value = tarifa.nombre || '';
    document.getElementById('tarifaClase').value = tarifa.clase || 'Económica';
    document.getElementById('tarifaPrecio').value = tarifa.precioBase || '';
    document.getElementById('tarifaDescripcion').value = tarifa.descripcion || '';
    document.getElementById('tarifaActivo').checked = tarifa.activo;

    const submitButton = document.querySelector('#formTarifa button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Tarifa';
    
    document.getElementById('formTarifa').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetTarifaForm() {
    document.getElementById('formTarifa').reset();
    editandoTarifaId = null;
    
    const submitButton = document.querySelector('#formTarifa button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-plus"></i> Agregar Tarifa';
}

async function saveTarifa(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('tarifaNombre').value.trim();
    const clase = document.getElementById('tarifaClase').value;
    const precio = document.getElementById('tarifaPrecio').value.trim();
    const descripcion = document.getElementById('tarifaDescripcion').value.trim();
    const activo = document.getElementById('tarifaActivo').checked;
    
    // Validaciones
    let validacion = validarTexto(nombre, 'Nombre');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    validacion = validarDecimal(precio, 'Precio base');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    const tarifa = {
        nombre: nombre,
        clase: clase,
        precioBase: parseFloat(precio),
        descripcion: descripcion || null,
        activo: activo
    };
    
    try {
        if (editandoTarifaId) {
            await fetchAPI(`${ENDPOINTS.tarifas}/${editandoTarifaId}`, 'PUT', tarifa);
            mostrarExito('Tarifa actualizada exitosamente');
        } else {
            await fetchAPI(ENDPOINTS.tarifas, 'POST', tarifa);
            mostrarExito('Tarifa agregada exitosamente');
        }
        
        resetTarifaForm();
        await loadTarifas();
    } catch (error) {
        mostrarError(error.message || 'Error al guardar la tarifa');
    }
}

async function deleteTarifa(id) {
    const result = await mostrarConfirmacion('¿Está seguro de eliminar esta tarifa? Esta acción no se puede deshacer.');
    
    if (result.isConfirmed) {
        try {
            await fetchAPI(`${ENDPOINTS.tarifas}/${id}`, 'DELETE');
            mostrarExito('Tarifa eliminada exitosamente');
            await loadTarifas();
        } catch (error) {
            mostrarError(error.message || 'Error al eliminar la tarifa');
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const formTarifa = document.getElementById('formTarifa');
    if (formTarifa) {
        formTarifa.addEventListener('submit', saveTarifa);
    }
    
    const btnNuevaTarifa = document.getElementById('btnNuevaTarifa');
    if (btnNuevaTarifa) {
        btnNuevaTarifa.addEventListener('click', resetTarifaForm);
    }
    
    const searchTarifa = document.getElementById('searchTarifa');
    if (searchTarifa) {
        searchTarifa.addEventListener('input', (e) => filtrarTarifas(e.target.value));
    }
});
