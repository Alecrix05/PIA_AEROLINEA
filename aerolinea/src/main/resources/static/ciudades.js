// ===================================================================
// MÓDULO: CIUDADES
// ===================================================================

let ciudades = [];
let ciudadesFiltradas = [];
let editandoCiudadId = null;

async function loadCiudades() {
    try {
        ciudades = await fetchAPI(ENDPOINTS.ciudades);
        ciudadesFiltradas = ciudades;
        renderCiudadesTable();
    } catch (error) {
        console.error('Error al cargar ciudades:', error);
        mostrarError('Error al cargar las ciudades');
    }
}

function filtrarCiudades(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        ciudadesFiltradas = ciudades;
    } else {
        ciudadesFiltradas = ciudades.filter(ciudad => {
            const nombre = (ciudad.nombreCiudad || '').toLowerCase();
            const estado = (ciudad.estado || '').toLowerCase();
            const pais = (ciudad.pais || '').toLowerCase();
            
            return nombre.includes(texto) || estado.includes(texto) || pais.includes(texto);
        });
    }
    
    renderCiudadesTable();
}

function renderCiudadesTable() {
    const tbody = document.getElementById('tablaCiudades');
    if (!tbody) return;

    if (ciudadesFiltradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron ciudades</td></tr>';
        return;
    }

    tbody.innerHTML = ciudadesFiltradas.map(ciudad => `
        <tr>
            <td>${ciudad.idCiudad}</td>
            <td>${ciudad.nombreCiudad}</td>
            <td>${ciudad.estado}</td>
            <td>${ciudad.pais}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editCiudad(${ciudad.idCiudad})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCiudad(${ciudad.idCiudad})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function editCiudad(id) {
    const ciudad = ciudades.find(c => c.idCiudad === id);
    if (!ciudad) return;

    editandoCiudadId = id;
    
    document.getElementById('ciudadNombre').value = ciudad.nombreCiudad || '';
    document.getElementById('ciudadEstado').value = ciudad.estado || '';
    document.getElementById('ciudadPais').value = ciudad.pais || '';

    const submitButton = document.querySelector('#formCiudad button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Ciudad';
    
    document.getElementById('formCiudad').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetCiudadForm() {
    document.getElementById('formCiudad').reset();
    editandoCiudadId = null;
    
    const submitButton = document.querySelector('#formCiudad button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-plus"></i> Agregar Ciudad';
}

async function saveCiudad(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('ciudadNombre').value.trim();
    const estado = document.getElementById('ciudadEstado').value.trim();
    const pais = document.getElementById('ciudadPais').value.trim();
    
    // Validaciones
    let validacion = validarSoloLetras(nombre, 'Nombre de la ciudad');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    validacion = validarSoloLetras(estado, 'Estado');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    validacion = validarSoloLetras(pais, 'País');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    const ciudad = {
        nombreCiudad: capitalizarTexto(nombre),
        estado: capitalizarTexto(estado),
        pais: capitalizarTexto(pais)
    };
    
    try {
        if (editandoCiudadId) {
            await fetchAPI(`${ENDPOINTS.ciudades}/${editandoCiudadId}`, 'PUT', ciudad);
            mostrarExito('Ciudad actualizada exitosamente');
        } else {
            await fetchAPI(ENDPOINTS.ciudades, 'POST', ciudad);
            mostrarExito('Ciudad agregada exitosamente');
        }
        
        resetCiudadForm();
        await loadCiudades();
    } catch (error) {
        mostrarError(error.message || 'Error al guardar la ciudad');
    }
}

async function deleteCiudad(id) {
    const result = await mostrarConfirmacion('¿Está seguro de eliminar esta ciudad? Esta acción no se puede deshacer.');
    
    if (result.isConfirmed) {
        try {
            await fetchAPI(`${ENDPOINTS.ciudades}/${id}`, 'DELETE');
            mostrarExito('Ciudad eliminada exitosamente');
            await loadCiudades();
        } catch (error) {
            mostrarError(error.message || 'Error al eliminar la ciudad');
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const formCiudad = document.getElementById('formCiudad');
    if (formCiudad) {
        formCiudad.addEventListener('submit', saveCiudad);
    }
    
    const btnNuevaCiudad = document.getElementById('btnNuevaCiudad');
    if (btnNuevaCiudad) {
        btnNuevaCiudad.addEventListener('click', resetCiudadForm);
    }
    
    const searchCiudad = document.getElementById('searchCiudad');
    if (searchCiudad) {
        searchCiudad.addEventListener('input', (e) => filtrarCiudades(e.target.value));
    }
});
