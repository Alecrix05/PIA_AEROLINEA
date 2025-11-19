// ============================================
// MÓDULO UNIFICADO: GESTIÓN DE PERSONAL
// Incluye: Empleados y Tripulaciones
// ============================================

// ============================================
// EMPLEADOS
// ============================================
let empleadoIdActual = null;

async function cargarEmpleados() {
    try {
        const response = await fetch(`${API_BASE_URL}/empleados`);
        const empleados = await response.json();
        
        const tbody = document.getElementById('tablaEmpleados');
        tbody.innerHTML = '';
        
        empleados.forEach(empleado => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${empleado.idEmpleado}</td>
                <td>${empleado.nombre} ${empleado.apellidoP} ${empleado.apellidoM || ''}</td>
                <td>${empleado.puesto}</td>
                <td>${empleado.departamento?.nombreDepartamento || 'N/A'}</td>
                <td>$${empleado.salario ? empleado.salario.toFixed(2) : '0.00'}</td>
                <td>${empleado.fechaContratacion || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarEmpleado(${empleado.idEmpleado})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarEmpleado(${empleado.idEmpleado})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar empleados:', error);
        alert('Error al cargar empleados');
    }
}

async function cargarDepartamentosSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/departamentos`);
        const departamentos = await response.json();
        
        const select = document.getElementById('empleadoDepartamento');
        select.innerHTML = '<option value="">Seleccione departamento...</option>';
        
        departamentos.forEach(depto => {
            const option = document.createElement('option');
            option.value = depto.idDepartamento;
            option.textContent = depto.nombreDepartamento;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar departamentos:', error);
    }
}

async function guardarEmpleado(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('empleadoNombre').value.trim();
    const apellidoP = document.getElementById('empleadoApellidoP').value.trim();
    const apellidoM = document.getElementById('empleadoApellidoM').value.trim();
    const puesto = document.getElementById('empleadoPuesto').value.trim();
    const salario = parseFloat(document.getElementById('empleadoSalario').value);
    const fechaContratacion = document.getElementById('empleadoFecha').value;
    const idDepartamento = document.getElementById('empleadoDepartamento').value;
    
    // Validaciones
    const validacionNombre = validarSoloLetras(nombre, 'Nombre');
    if (!validacionNombre.valido) {
        mostrarError(validacionNombre.mensaje);
        return;
    }
    
    const validacionApellidoP = validarSoloLetras(apellidoP, 'Apellido Paterno');
    if (!validacionApellidoP.valido) {
        mostrarError(validacionApellidoP.mensaje);
        return;
    }
    
    if (apellidoM) {
        const validacionApellidoM = validarSoloLetras(apellidoM, 'Apellido Materno');
        if (!validacionApellidoM.valido) {
            mostrarError(validacionApellidoM.mensaje);
            return;
        }
    }
    
    const validacionPuesto = validarTexto(puesto, 'Puesto');
    if (!validacionPuesto.valido) {
        mostrarError(validacionPuesto.mensaje);
        return;
    }
    
    const validacionSalario = validarDecimal(salario, 'Salario');
    if (!validacionSalario.valido) {
        mostrarError(validacionSalario.mensaje);
        return;
    }
    
    const validacionFecha = validarFecha(fechaContratacion, 'Fecha de Contratación');
    if (!validacionFecha.valido) {
        mostrarError(validacionFecha.mensaje);
        return;
    }
    
    if (!idDepartamento) {
        mostrarError('Debe seleccionar un departamento');
        return;
    }
    
    const empleado = {
        nombre,
        apellidoP,
        apellidoM,
        puesto,
        salario,
        fechaContratacion,
        departamento: { idDepartamento: parseInt(idDepartamento) }
    };
    
    try {
        const url = empleadoIdActual 
            ? `${API_BASE_URL}/empleados/${empleadoIdActual}`
            : `${API_BASE_URL}/empleados`;
        
        const method = empleadoIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(empleado)
        });
        
        if (response.ok) {
            mostrarExito(empleadoIdActual ? 'Empleado actualizado correctamente' : 'Empleado registrado correctamente');
            document.getElementById('formEmpleado').reset();
            empleadoIdActual = null;
            document.getElementById('btnCancelarEmpleado').style.display = 'none';
            cargarEmpleados();
        } else {
            const error = await response.text();
            mostrarError('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al guardar empleado');
    }
}

async function editarEmpleado(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/empleados/${id}`);
        const empleado = await response.json();
        
        document.getElementById('empleadoNombre').value = empleado.nombre;
        document.getElementById('empleadoApellidoP').value = empleado.apellidoP;
        document.getElementById('empleadoApellidoM').value = empleado.apellidoM || '';
        document.getElementById('empleadoPuesto').value = empleado.puesto;
        document.getElementById('empleadoSalario').value = empleado.salario;
        document.getElementById('empleadoFecha').value = empleado.fechaContratacion;
        document.getElementById('empleadoDepartamento').value = empleado.departamento?.idDepartamento || '';
        
        empleadoIdActual = id;
        document.getElementById('btnCancelarEmpleado').style.display = 'inline-block';
        
        document.getElementById('formEmpleado').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar empleado');
    }
}

async function eliminarEmpleado(id) {
    const confirmacion = await mostrarConfirmacion('¿Está seguro de eliminar este empleado?');
    if (!confirmacion.isConfirmed) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            mostrarExito('Empleado eliminado correctamente');
            cargarEmpleados();
        } else {
            const error = await response.text();
            mostrarError('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al eliminar empleado');
    }
}

function cancelarEmpleado() {
    document.getElementById('formEmpleado').reset();
    empleadoIdActual = null;
    document.getElementById('btnCancelarEmpleado').style.display = 'none';
}

// ============================================
// TRIPULACIONES
// ============================================
let tripulacionIdActual = null;

async function cargarTripulaciones() {
    try {
        const response = await fetch(`${API_BASE_URL}/tripulaciones`);
        const tripulaciones = await response.json();
        
        const tbody = document.getElementById('tablaTripulaciones');
        tbody.innerHTML = '';
        
        tripulaciones.forEach(tripulacion => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${tripulacion.idTripulacion}</td>
                <td>${tripulacion.nombreTripulacion}</td>
                <td>${tripulacion.piloto ? `${tripulacion.piloto.nombre} ${tripulacion.piloto.apellidoP}` : 'N/A'}</td>
                <td>${tripulacion.copiloto ? `${tripulacion.copiloto.nombre} ${tripulacion.copiloto.apellidoP}` : 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarTripulacion(${tripulacion.idTripulacion})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarTripulacion(${tripulacion.idTripulacion})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar tripulaciones:', error);
        alert('Error al cargar tripulaciones');
    }
}

async function cargarEmpleadosSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/empleados`);
        const empleados = await response.json();
        
        const selectPiloto = document.getElementById('tripulacionPiloto');
        const selectCopiloto = document.getElementById('tripulacionCopiloto');
        
        selectPiloto.innerHTML = '<option value="">Seleccione piloto...</option>';
        selectCopiloto.innerHTML = '<option value="">Seleccione copiloto...</option>';
        
        empleados.forEach(empleado => {
            const option1 = document.createElement('option');
            option1.value = empleado.idEmpleado;
            option1.textContent = `${empleado.nombre} ${empleado.apellidoP} - ${empleado.puesto}`;
            selectPiloto.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = empleado.idEmpleado;
            option2.textContent = `${empleado.nombre} ${empleado.apellidoP} - ${empleado.puesto}`;
            selectCopiloto.appendChild(option2);
        });
    } catch (error) {
        console.error('Error al cargar empleados:', error);
    }
}

async function guardarTripulacion(event) {
    event.preventDefault();
    
    const nombreTripulacion = document.getElementById('tripulacionNombre').value.trim();
    const idPiloto = document.getElementById('tripulacionPiloto').value;
    const idCopiloto = document.getElementById('tripulacionCopiloto').value;
    
    const validacionNombre = validarTexto(nombreTripulacion, 'Nombre de Tripulación');
    if (!validacionNombre.valido) {
        mostrarError(validacionNombre.mensaje);
        return;
    }
    
    if (!idPiloto) {
        mostrarError('Debe seleccionar un piloto');
        return;
    }
    
    if (!idCopiloto) {
        mostrarError('Debe seleccionar un copiloto');
        return;
    }
    
    if (idPiloto === idCopiloto) {
        mostrarError('El piloto y copiloto deben ser diferentes');
        return;
    }
    
    const tripulacion = {
        nombreTripulacion,
        piloto: { idEmpleado: parseInt(idPiloto) },
        copiloto: { idEmpleado: parseInt(idCopiloto) }
    };
    
    try {
        const url = tripulacionIdActual 
            ? `${API_BASE_URL}/tripulaciones/${tripulacionIdActual}`
            : `${API_BASE_URL}/tripulaciones`;
        
        const method = tripulacionIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tripulacion)
        });
        
        if (response.ok) {
            mostrarExito(tripulacionIdActual ? 'Tripulación actualizada correctamente' : 'Tripulación registrada correctamente');
            document.getElementById('formTripulacion').reset();
            tripulacionIdActual = null;
            document.getElementById('btnCancelarTripulacion').style.display = 'none';
            cargarTripulaciones();
        } else {
            const error = await response.text();
            mostrarError('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al guardar tripulación');
    }
}

async function editarTripulacion(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/tripulaciones/${id}`);
        const tripulacion = await response.json();
        
        document.getElementById('tripulacionNombre').value = tripulacion.nombreTripulacion;
        document.getElementById('tripulacionPiloto').value = tripulacion.piloto?.idEmpleado || '';
        document.getElementById('tripulacionCopiloto').value = tripulacion.copiloto?.idEmpleado || '';
        
        tripulacionIdActual = id;
        document.getElementById('btnCancelarTripulacion').style.display = 'inline-block';
        
        document.getElementById('formTripulacion').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar tripulación');
    }
}

async function eliminarTripulacion(id) {
    const confirmacion = await mostrarConfirmacion('¿Está seguro de eliminar esta tripulación?');
    if (!confirmacion.isConfirmed) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/tripulaciones/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            mostrarExito('Tripulación eliminada correctamente');
            cargarTripulaciones();
        } else {
            const error = await response.text();
            mostrarError('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al eliminar tripulación');
    }
}

function cancelarTripulacion() {
    document.getElementById('formTripulacion').reset();
    tripulacionIdActual = null;
    document.getElementById('btnCancelarTripulacion').style.display = 'none';
}

// ============================================
// INICIALIZACIÓN DEL MÓDULO
// ============================================
function inicializarModuloPersonal() {
    // Cargar contenido HTML de cada pestaña
    cargarHTMLEmpleados();
    cargarHTMLTripulaciones();
    
    // Cargar datos para selects
    cargarDepartamentosSelect();
    cargarEmpleadosSelect();
}

// Cargar HTML de la pestaña Empleados
function cargarHTMLEmpleados() {
    const contenedor = document.getElementById('empleados-content');
    contenedor.innerHTML = `
        <div class="card mb-3">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-plus"></i> Nuevo Empleado
            </div>
            <div class="card-body">
                <form id="formEmpleado" onsubmit="event.preventDefault(); guardarEmpleado(event);">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Nombre *</label>
                                <input type="text" class="form-control" id="empleadoNombre" maxlength="50" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Apellido Paterno *</label>
                                <input type="text" class="form-control" id="empleadoApellidoP" maxlength="50" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Apellido Materno</label>
                                <input type="text" class="form-control" id="empleadoApellidoM" maxlength="50">
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Puesto *</label>
                                <input type="text" class="form-control" id="empleadoPuesto" maxlength="50" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Departamento *</label>
                                <select class="form-control" id="empleadoDepartamento" required>
                                    <option value="">Seleccione departamento...</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Salario *</label>
                                <input type="number" step="0.01" class="form-control" id="empleadoSalario" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Fecha de Contratación *</label>
                                <input type="date" class="form-control" id="empleadoFecha" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Guardar Empleado
                        </button>
                        <button type="button" class="btn btn-secondary" id="btnCancelarEmpleado" style="display:none;" onclick="cancelarEmpleado()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="card">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-list"></i> Lista de Empleados
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre Completo</th>
                                <th>Puesto</th>
                                <th>Departamento</th>
                                <th>Salario</th>
                                <th>Fecha Contratación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaEmpleados"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    cargarEmpleados();
}

// Cargar HTML de la pestaña Tripulaciones
function cargarHTMLTripulaciones() {
    const contenedor = document.getElementById('tripulaciones-content');
    contenedor.innerHTML = `
        <div class="card mb-3">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-plus"></i> Nueva Tripulación
            </div>
            <div class="card-body">
                <form id="formTripulacion" onsubmit="event.preventDefault(); guardarTripulacion(event);">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="mb-3">
                                <label class="form-label">Nombre de la Tripulación *</label>
                                <input type="text" class="form-control" id="tripulacionNombre" maxlength="50" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Piloto *</label>
                                <select class="form-control" id="tripulacionPiloto" required>
                                    <option value="">Seleccione piloto...</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Copiloto *</label>
                                <select class="form-control" id="tripulacionCopiloto" required>
                                    <option value="">Seleccione copiloto...</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Guardar Tripulación
                        </button>
                        <button type="button" class="btn btn-secondary" id="btnCancelarTripulacion" style="display:none;" onclick="cancelarTripulacion()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="card">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-list"></i> Lista de Tripulaciones
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Piloto</th>
                                <th>Copiloto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaTripulaciones"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    cargarTripulaciones();
}

// Exponer funciones al scope global
window.inicializarModuloPersonal = inicializarModuloPersonal;
window.guardarEmpleado = guardarEmpleado;
window.cancelarEmpleado = cancelarEmpleado;
window.editarEmpleado = editarEmpleado;
window.eliminarEmpleado = eliminarEmpleado;
window.guardarTripulacion = guardarTripulacion;
window.cancelarTripulacion = cancelarTripulacion;
window.editarTripulacion = editarTripulacion;
window.eliminarTripulacion = eliminarTripulacion;