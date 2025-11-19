// ===================================================================
// MÓDULO: DEPARTAMENTOS
// ===================================================================

let departamentos = [];
let departamentosFiltrados = [];
let editandoDepartamentoId = null;

async function loadDepartamentos() {
    try {
        departamentos = await fetchAPI(ENDPOINTS.departamentos);
        departamentosFiltrados = departamentos;
        renderDepartamentosTable();
    } catch (error) {
        console.error('Error al cargar departamentos:', error);
        mostrarError('Error al cargar los departamentos');
    }
}

function filtrarDepartamentos(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        departamentosFiltrados = departamentos;
    } else {
        departamentosFiltrados = departamentos.filter(depto => {
            const nombre = (depto.nombreDepartamento || '').toLowerCase();
            const descripcion = (depto.descripcion || '').toLowerCase();
            
            return nombre.includes(texto) || descripcion.includes(texto);
        });
    }
    
    renderDepartamentosTable();
}

function renderDepartamentosTable() {
    const tbody = document.getElementById('tablaDepartamentos');
    if (!tbody) return;

    if (departamentosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No se encontraron departamentos</td></tr>';
        return;
    }

    tbody.innerHTML = departamentosFiltrados.map(depto => `
        <tr>
            <td>${depto.idDepartamento}</td>
            <td>${depto.nombreDepartamento}</td>
            <td>${depto.descripcion || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editDepartamento(${depto.idDepartamento})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteDepartamento(${depto.idDepartamento})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function editDepartamento(id) {
    const depto = departamentos.find(d => d.idDepartamento === id);
    if (!depto) return;

    editandoDepartamentoId = id;
    
    document.getElementById('deptoNombre').value = depto.nombreDepartamento || '';
    document.getElementById('deptoDescripcion').value = depto.descripcion || '';

    const submitButton = document.querySelector('#formDepartamento button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Departamento';
    
    document.getElementById('formDepartamento').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetDepartamentoForm() {
    document.getElementById('formDepartamento').reset();
    editandoDepartamentoId = null;
    
    const submitButton = document.querySelector('#formDepartamento button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-plus"></i> Agregar Departamento';
}

async function saveDepartamento(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('deptoNombre').value.trim();
    const descripcion = document.getElementById('deptoDescripcion').value.trim();
    
    // Validaciones
    const validacion = validarSoloLetras(nombre, 'Nombre del departamento');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    const depto = {
        nombreDepartamento: capitalizarTexto(nombre),
        descripcion: descripcion || null
    };
    
    try {
        if (editandoDepartamentoId) {
            await fetchAPI(`${ENDPOINTS.departamentos}/${editandoDepartamentoId}`, 'PUT', depto);
            mostrarExito('Departamento actualizado exitosamente');
        } else {
            await fetchAPI(ENDPOINTS.departamentos, 'POST', depto);
            mostrarExito('Departamento agregado exitosamente');
        }
        
        resetDepartamentoForm();
        await loadDepartamentos();
    } catch (error) {
        mostrarError(error.message || 'Error al guardar el departamento');
    }
}

async function deleteDepartamento(id) {
    const result = await mostrarConfirmacion('¿Está seguro de eliminar este departamento? Esta acción no se puede deshacer.');
    
    if (result.isConfirmed) {
        try {
            await fetchAPI(`${ENDPOINTS.departamentos}/${id}`, 'DELETE');
            mostrarExito('Departamento eliminado exitosamente');
            await loadDepartamentos();
        } catch (error) {
            mostrarError(error.message || 'Error al eliminar el departamento');
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const formDepto = document.getElementById('formDepartamento');
    if (formDepto) {
        formDepto.addEventListener('submit', saveDepartamento);
    }
    
    const btnNuevoDepto = document.getElementById('btnNuevoDepartamento');
    if (btnNuevoDepto) {
        btnNuevoDepto.addEventListener('click', resetDepartamentoForm);
    }
    
    const searchDepto = document.getElementById('searchDepartamento');
    if (searchDepto) {
        searchDepto.addEventListener('input', (e) => filtrarDepartamentos(e.target.value));
    }
});
