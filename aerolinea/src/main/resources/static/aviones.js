// ===================================================================
// MÓDULO: AVIONES
// ===================================================================

let aviones = [];
let avionesFiltrados = [];
let editandoAvionId = null;

async function loadAviones() {
    try {
        aviones = await fetchAPI(ENDPOINTS.aviones);
        avionesFiltrados = aviones;
        renderAvionesTable();
    } catch (error) {
        console.error('Error al cargar aviones:', error);
        mostrarError('Error al cargar los aviones');
    }
}

function filtrarAviones(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        avionesFiltrados = aviones;
    } else {
        avionesFiltrados = aviones.filter(avion => {
            const matricula = (avion.matricula || '').toLowerCase();
            const modelo = (avion.modelo || '').toLowerCase();
            const estado = (avion.estadoOperativo || '').toLowerCase();
            
            return matricula.includes(texto) || modelo.includes(texto) || estado.includes(texto);
        });
    }
    
    renderAvionesTable();
}

function renderAvionesTable() {
    const tbody = document.getElementById('tablaAviones');
    if (!tbody) return;

    if (avionesFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron aviones</td></tr>';
        return;
    }

    tbody.innerHTML = avionesFiltrados.map(avion => {
        const estadoBadge = avion.estadoOperativo === 'Operativo' ? 'bg-success' : 'bg-warning';
        
        return `
            <tr>
                <td>${avion.idAvion}</td>
                <td><span class="badge bg-primary">${avion.matricula}</span></td>
                <td>${avion.modelo}</td>
                <td>${avion.capacidad}</td>
                <td><span class="badge ${estadoBadge}">${avion.estadoOperativo}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editAvion(${avion.idAvion})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAvion(${avion.idAvion})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editAvion(id) {
    const avion = aviones.find(a => a.idAvion === id);
    if (!avion) return;

    editandoAvionId = id;
    
    document.getElementById('avionMatricula').value = avion.matricula || '';
    document.getElementById('avionModelo').value = avion.modelo || '';
    document.getElementById('avionCapacidad').value = avion.capacidad || '';
    document.getElementById('avionEstado').value = avion.estadoOperativo || 'Operativo';

    const submitButton = document.querySelector('#formAvion button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Avión';
    
    document.getElementById('formAvion').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetAvionForm() {
    document.getElementById('formAvion').reset();
    editandoAvionId = null;
    
    const submitButton = document.querySelector('#formAvion button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-plus"></i> Agregar Avión';
}

async function saveAvion(event) {
    event.preventDefault();
    
    const matricula = document.getElementById('avionMatricula').value.trim();
    const modelo = document.getElementById('avionModelo').value.trim();
    const capacidad = document.getElementById('avionCapacidad').value.trim();
    const estado = document.getElementById('avionEstado').value;
    
    // Validaciones
    let validacion = validarMatricula(matricula, 'Matrícula');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    validacion = validarTexto(modelo, 'Modelo');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    validacion = validarEnteroPositivo(capacidad, 'Capacidad');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    const avion = {
        matricula: normalizarMayusculas(matricula),
        modelo: modelo,
        capacidad: parseInt(capacidad),
        estadoOperativo: estado
    };
    
    try {
        if (editandoAvionId) {
            await fetchAPI(`${ENDPOINTS.aviones}/${editandoAvionId}`, 'PUT', avion);
            mostrarExito('Avión actualizado exitosamente');
        } else {
            await fetchAPI(ENDPOINTS.aviones, 'POST', avion);
            mostrarExito('Avión agregado exitosamente');
        }
        
        resetAvionForm();
        await loadAviones();
    } catch (error) {
        mostrarError(error.message || 'Error al guardar el avión');
    }
}

async function deleteAvion(id) {
    const result = await mostrarConfirmacion('¿Está seguro de eliminar este avión? Esta acción no se puede deshacer.');
    
    if (result.isConfirmed) {
        try {
            await fetchAPI(`${ENDPOINTS.aviones}/${id}`, 'DELETE');
            mostrarExito('Avión eliminado exitosamente');
            await loadAviones();
        } catch (error) {
            mostrarError(error.message || 'Error al eliminar el avión');
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const formAvion = document.getElementById('formAvion');
    if (formAvion) {
        formAvion.addEventListener('submit', saveAvion);
    }
    
    const btnNuevoAvion = document.getElementById('btnNuevoAvion');
    if (btnNuevoAvion) {
        btnNuevoAvion.addEventListener('click', resetAvionForm);
    }
    
    const searchAvion = document.getElementById('searchAvion');
    if (searchAvion) {
        searchAvion.addEventListener('input', (e) => filtrarAviones(e.target.value));
    }
});
