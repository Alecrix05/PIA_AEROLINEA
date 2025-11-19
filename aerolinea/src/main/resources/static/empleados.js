// ===================================================================
// MÓDULO: EMPLEADOS
// ===================================================================

let empleados = [];
let empleadosFiltrados = [];
let editandoEmpleadoId = null;
let departamentosParaEmpleados = [];

async function loadEmpleados() {
    try {
        [empleados, departamentosParaEmpleados] = await Promise.all([
            fetchAPI(ENDPOINTS.empleados),
            fetchAPI(ENDPOINTS.departamentos)
        ]);
        empleadosFiltrados = empleados;
        renderEmpleadosTable();
        cargarDepartamentosSelect();
    } catch (error) {
        console.error('Error al cargar empleados:', error);
        mostrarError('Error al cargar los empleados');
    }
}

function cargarDepartamentosSelect() {
    const select = document.getElementById('empleadoDepartamento');
    if (!select) return;
    
    select.innerHTML = '<option value="">Seleccione un departamento</option>' +
        departamentosParaEmpleados.map(depto => 
            `<option value="${depto.idDepartamento}">${depto.nombreDepartamento}</option>`
        ).join('');
}

function filtrarEmpleados(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        empleadosFiltrados = empleados;
    } else {
        empleadosFiltrados = empleados.filter(emp => {
            const nombreCompleto = `${emp.nombre} ${emp.apellidoP} ${emp.apellidoM || ''}`.toLowerCase();
            const puesto = (emp.puesto || '').toLowerCase();
            
            return nombreCompleto.includes(texto) || puesto.includes(texto);
        });
    }
    
    renderEmpleadosTable();
}

function renderEmpleadosTable() {
    const tbody = document.getElementById('tablaEmpleados');
    if (!tbody) return;

    if (empleadosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron empleados</td></tr>';
        return;
    }

    tbody.innerHTML = empleadosFiltrados.map(emp => {
        const nombreCompleto = `${emp.nombre} ${emp.apellidoP} ${emp.apellidoM || ''}`.trim();
        const depto = departamentosParaEmpleados.find(d => d.idDepartamento === emp.departamento?.idDepartamento);
        const nombreDepto = depto ? depto.nombreDepartamento : 'N/A';
        
        return `
            <tr>
                <td>${emp.idEmpleado}</td>
                <td>${nombreCompleto}</td>
                <td>${emp.puesto}</td>
                <td>$${emp.salario.toFixed(2)}</td>
                <td>${emp.fechaContratacion}</td>
                <td>${nombreDepto}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editEmpleado(${emp.idEmpleado})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEmpleado(${emp.idEmpleado})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editEmpleado(id) {
    const emp = empleados.find(e => e.idEmpleado === id);
    if (!emp) return;

    editandoEmpleadoId = id;
    
    document.getElementById('empleadoNombre').value = emp.nombre || '';
    document.getElementById('empleadoApellidoP').value = emp.apellidoP || '';
    document.getElementById('empleadoApellidoM').value = emp.apellidoM || '';
    document.getElementById('empleadoPuesto').value = emp.puesto || '';
    document.getElementById('empleadoSalario').value = emp.salario || '';
    document.getElementById('empleadoFechaContratacion').value = emp.fechaContratacion || '';
    document.getElementById('empleadoDepartamento').value = emp.departamento?.idDepartamento || '';

    const submitButton = document.querySelector('#formEmpleado button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Empleado';
    
    document.getElementById('formEmpleado').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetEmpleadoForm() {
    document.getElementById('formEmpleado').reset();
    editandoEmpleadoId = null;
    
    const submitButton = document.querySelector('#formEmpleado button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-plus"></i> Agregar Empleado';
}

async function saveEmpleado(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('empleadoNombre').value.trim();
    const apellidoP = document.getElementById('empleadoApellidoP').value.trim();
    const apellidoM = document.getElementById('empleadoApellidoM').value.trim();
    const puesto = document.getElementById('empleadoPuesto').value.trim();
    const salario = document.getElementById('empleadoSalario').value.trim();
    const fechaContratacion = document.getElementById('empleadoFechaContratacion').value;
    const deptoId = document.getElementById('empleadoDepartamento').value;
    
    // Validaciones
    let validacion = validarSoloLetras(nombre, 'Nombre');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    validacion = validarSoloLetras(apellidoP, 'Apellido paterno');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    if (apellidoM) {
        validacion = validarSoloLetras(apellidoM, 'Apellido materno');
        if (!validacion.valido) {
            mostrarError(validacion.mensaje);
            return;
        }
    }
    
    validacion = validarSoloLetras(puesto, 'Puesto');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    validacion = validarDecimal(salario, 'Salario');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    validacion = validarFecha(fechaContratacion, 'Fecha de contratación');
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    if (!deptoId) {
        mostrarError('Debe seleccionar un departamento');
        return;
    }
    
    const empleado = {
        nombre: capitalizarTexto(nombre),
        apellidoP: capitalizarTexto(apellidoP),
        apellidoM: apellidoM ? capitalizarTexto(apellidoM) : null,
        puesto: capitalizarTexto(puesto),
        salario: parseFloat(salario),
        fechaContratacion: fechaContratacion,
        departamento: { idDepartamento: parseInt(deptoId) }
    };
    
    try {
        if (editandoEmpleadoId) {
            await fetchAPI(`${ENDPOINTS.empleados}/${editandoEmpleadoId}`, 'PUT', empleado);
            mostrarExito('Empleado actualizado exitosamente');
        } else {
            await fetchAPI(ENDPOINTS.empleados, 'POST', empleado);
            mostrarExito('Empleado agregado exitosamente');
        }
        
        resetEmpleadoForm();
        await loadEmpleados();
    } catch (error) {
        mostrarError(error.message || 'Error al guardar el empleado');
    }
}

async function deleteEmpleado(id) {
    const result = await mostrarConfirmacion('¿Está seguro de eliminar este empleado? Esta acción no se puede deshacer.');
    
    if (result.isConfirmed) {
        try {
            await fetchAPI(`${ENDPOINTS.empleados}/${id}`, 'DELETE');
            mostrarExito('Empleado eliminado exitosamente');
            await loadEmpleados();
        } catch (error) {
            mostrarError(error.message || 'Error al eliminar el empleado');
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const formEmpleado = document.getElementById('formEmpleado');
    if (formEmpleado) {
        formEmpleado.addEventListener('submit', saveEmpleado);
    }
    
    const btnNuevoEmpleado = document.getElementById('btnNuevoEmpleado');
    if (btnNuevoEmpleado) {
        btnNuevoEmpleado.addEventListener('click', resetEmpleadoForm);
    }
    
    const searchEmpleado = document.getElementById('searchEmpleado');
    if (searchEmpleado) {
        searchEmpleado.addEventListener('input', (e) => filtrarEmpleados(e.target.value));
    }
});
