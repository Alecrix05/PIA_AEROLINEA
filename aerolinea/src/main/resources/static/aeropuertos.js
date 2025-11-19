// ===================================================================
// MÓDULO: AEROPUERTOS
// ===================================================================

let aeropuertos = [];
let aeropuertosFiltrados = [];
let editandoAeropuertoId = null;
let ciudadesParaAeropuerto = [];

async function loadAeropuertos() {
    try {
        [aeropuertos, ciudadesParaAeropuerto] = await Promise.all([
            fetchAPI(ENDPOINTS.aeropuertos),
            fetchAPI(ENDPOINTS.ciudades)
        ]);
        aeropuertosFiltrados = aeropuertos;
        renderAeropuertosTable();
        cargarCiudadesSelect();
    } catch (error) {
        console.error('Error al cargar aeropuertos:', error);
        mostrarError('Error al cargar los aeropuertos');
    }
}

function cargarCiudadesSelect() {
    const select = document.getElementById('aeropuertoCiudad');
    if (!select) return;
    
    select.innerHTML = '<option value="">Seleccione una ciudad</option>' +
        ciudadesParaAeropuerto.map(ciudad => 
            `<option value="${ciudad.idCiudad}">${ciudad.nombreCiudad}, ${ciudad.estado}, ${ciudad.pais}</option>`
        ).join('');
}

function filtrarAeropuertos(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        aeropuertosFiltrados = aeropuertos;
    } else {
        aeropuertosFiltrados = aeropuertos.filter(aeropuerto => {
            const nombre = (aeropuerto.nombre || '').toLowerCase();
            const codigo = (aeropuerto.codigoIATA || '').toLowerCase();
            
            return nombre.includes(texto) || codigo.includes(texto);
        });
    }
    
    renderAeropuertosTable();
}

function renderAeropuertosTable() {
    const tbody = document.getElementById('tablaAeropuertos');
    if (!tbody) return;

    if (aeropuertosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron aeropuertos</td></tr>';
        return;
    }

    tbody.innerHTML = aeropuertosFiltrados.map(aeropuerto => {
        const ciudad = ciudadesParaAeropuerto.find(c => c.idCiudad === aeropuerto.ciudad?.idCiudad);
        const nombreCiudad = ciudad ? `${ciudad.nombreCiudad}, ${ciudad.estado}` : 'N/A';
        
        return `
            <tr>
                <td>${aeropuerto.idAeropuerto}</td>
                <td>${aeropuerto.nombre}</td>
                <td><span class="badge bg-primary">${aeropuerto.codigoIATA}</span></td>
                <td>${nombreCiudad}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editAeropuerto(${aeropuerto.idAeropuerto})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAeropuerto(${aeropuerto.idAeropuerto})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editAeropuerto(id) {
    const aeropuerto = aeropuertos.find(a => a.idAeropuerto === id);
    if (!aeropuerto) return;

    editandoAeropuertoId = id;
    
    document.getElementById('aeropuertoNombre').value = aeropuerto.nombre || '';
    document.getElementById('aeropuertoCodigoIATA').value = aeropuerto.codigoIATA || '';
    document.getElementById('aeropuertoCiudad').value = aeropuerto.ciudad?.idCiudad || '';

    const submitButton = document.querySelector('#formAeropuerto button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Aeropuerto';
    
    document.getElementById('formAeropuerto').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetAeropuertoForm() {
    document.getElementById('formAeropuerto').reset();
    editandoAeropuertoId = null;
    
    const submitButton = document.querySelector('#formAeropuerto button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-plus"></i> Agregar Aeropuerto';
}

async function saveAeropuerto(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('aeropuertoNombre').value.trim();
    const codigoIATA = document.getElementById('aeropuertoCodigoIATA').value.trim();
    const ciudadId = document.getElementById('aeropuertoCiudad').value;
    
    // Validaciones
    let validacion = validarTexto(nombre, 'Nombre del aeropuerto');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    validacion = validarCodigoIATA(codigoIATA, 'Código IATA');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    if (!ciudadId) {
        mostrarError('Debe seleccionar una ciudad');
        return;
    }
    
    const aeropuerto = {
        nombre: capitalizarTexto(nombre),
        codigoIATA: normalizarMayusculas(codigoIATA),
        ciudad: { idCiudad: parseInt(ciudadId) }
    };
    
    try {
        if (editandoAeropuertoId) {
            await fetchAPI(`${ENDPOINTS.aeropuertos}/${editandoAeropuertoId}`, 'PUT', aeropuerto);
            mostrarExito('Aeropuerto actualizado exitosamente');
        } else {
            await fetchAPI(ENDPOINTS.aeropuertos, 'POST', aeropuerto);
            mostrarExito('Aeropuerto agregado exitosamente');
        }
        
        resetAeropuertoForm();
        await loadAeropuertos();
    } catch (error) {
        mostrarError(error.message || 'Error al guardar el aeropuerto');
    }
}

async function deleteAeropuerto(id) {
    const result = await mostrarConfirmacion('¿Está seguro de eliminar este aeropuerto? Esta acción no se puede deshacer.');
    
    if (result.isConfirmed) {
        try {
            await fetchAPI(`${ENDPOINTS.aeropuertos}/${id}`, 'DELETE');
            mostrarExito('Aeropuerto eliminado exitosamente');
            await loadAeropuertos();
        } catch (error) {
            mostrarError(error.message || 'Error al eliminar el aeropuerto');
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const formAeropuerto = document.getElementById('formAeropuerto');
    if (formAeropuerto) {
        formAeropuerto.addEventListener('submit', saveAeropuerto);
    }
    
    const btnNuevoAeropuerto = document.getElementById('btnNuevoAeropuerto');
    if (btnNuevoAeropuerto) {
        btnNuevoAeropuerto.addEventListener('click', resetAeropuertoForm);
    }
    
    const searchAeropuerto = document.getElementById('searchAeropuerto');
    if (searchAeropuerto) {
        searchAeropuerto.addEventListener('input', (e) => filtrarAeropuertos(e.target.value));
    }
});
