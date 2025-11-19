// ============================================
// MÓDULO UNIFICADO: GESTIÓN COMERCIAL
// Incluye: Clientes y Pasajeros
// ============================================

// ============================================
// CLIENTES
// ============================================
let clienteIdActual = null;

async function cargarClientes() {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`);
        const clientes = await response.json();
        
        const tbody = document.getElementById('tablaClientes');
        tbody.innerHTML = '';
        
        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.idCliente}</td>
                <td>${cliente.nombre} ${cliente.apellidoP} ${cliente.apellidoM || ''}</td>
                <td>${cliente.correo || 'N/A'}</td>
                <td>${cliente.telefono || 'N/A'}</td>
                <td>${cliente.ciudad || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarCliente(${cliente.idCliente})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarCliente(${cliente.idCliente})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="window.verPasajeros(${cliente.idCliente}, '${cliente.nombre} ${cliente.apellidoP}')">
                        <i class="fas fa-user-friends"></i> Pasajeros
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        alert('Error al cargar clientes');
    }
}

async function buscarCliente() {
    const termino = document.getElementById('buscarClienteInput').value.trim();
    
    if (!termino) {
        alert('Ingrese un término de búsqueda (nombre, apellido o correo)');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/buscar?termino=${encodeURIComponent(termino)}`);
        const clientes = await response.json();
        
        const tbody = document.getElementById('tablaClientes');
        tbody.innerHTML = '';
        
        if (clientes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron clientes</td></tr>';
            return;
        }
        
        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.idCliente}</td>
                <td>${cliente.nombre} ${cliente.apellidoP} ${cliente.apellidoM || ''}</td>
                <td>${cliente.correo || 'N/A'}</td>
                <td>${cliente.telefono || 'N/A'}</td>
                <td>${cliente.ciudad || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarCliente(${cliente.idCliente})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarCliente(${cliente.idCliente})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="window.verPasajeros(${cliente.idCliente}, '${cliente.nombre} ${cliente.apellidoP}')">
                        <i class="fas fa-user-friends"></i> Pasajeros
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al buscar clientes:', error);
        alert('Error al buscar clientes');
    }
}

async function guardarCliente(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('clienteNombre').value.trim();
    const apellidoP = document.getElementById('clienteApellidoP').value.trim();
    const apellidoM = document.getElementById('clienteApellidoM').value.trim();
    const telefono = document.getElementById('clienteTelefono').value.trim();
    const correo = document.getElementById('clienteCorreo').value.trim();
    const calle = document.getElementById('clienteCalle').value.trim();
    const numero = document.getElementById('clienteNumero').value.trim();
    const colonia = document.getElementById('clienteColonia').value.trim();
    const ciudad = document.getElementById('clienteCiudad').value.trim();
    const estado = document.getElementById('clienteEstado').value.trim();
    const codigoPostal = document.getElementById('clienteCodigoPostal').value.trim();
    
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
    
    if (telefono) {
        const validacionTelefono = validarTelefono(telefono, 'Teléfono', false);
        if (!validacionTelefono.valido) {
            mostrarError(validacionTelefono.mensaje);
            return;
        }
    }
    
    const validacionCorreo = validarEmail(correo, 'Correo Electrónico');
    if (!validacionCorreo.valido) {
        mostrarError(validacionCorreo.mensaje);
        return;
    }
    
    if (numero) {
        const validacionNumero = validarSoloNumeros(numero, 'Número', false);
        if (!validacionNumero.valido) {
            mostrarError(validacionNumero.mensaje);
            return;
        }
    }
    
    if (colonia) {
        const validacionColonia = validarSoloLetras(colonia, 'Colonia');
        if (!validacionColonia.valido) {
            mostrarError(validacionColonia.mensaje);
            return;
        }
    }
    
    if (ciudad) {
        const validacionCiudad = validarSoloLetras(ciudad, 'Ciudad');
        if (!validacionCiudad.valido) {
            mostrarError(validacionCiudad.mensaje);
            return;
        }
    }
    
    if (estado) {
        const validacionEstado = validarSoloLetras(estado, 'Estado');
        if (!validacionEstado.valido) {
            mostrarError(validacionEstado.mensaje);
            return;
        }
    }
    
    if (codigoPostal) {
        const validacionCP = validarCodigoPostal(codigoPostal, 'Código Postal', false);
        if (!validacionCP.valido) {
            mostrarError(validacionCP.mensaje);
            return;
        }
    }
    
    const cliente = {
        nombre,
        apellidoP,
        apellidoM,
        telefono,
        correo,
        calle,
        numero,
        colonia,
        ciudad,
        estado,
        codigoPostal
    };
    
    try {
        const url = clienteIdActual 
            ? `${API_BASE_URL}/clientes/${clienteIdActual}`
            : `${API_BASE_URL}/clientes`;
        
        const method = clienteIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
        
        if (response.ok) {
            alert(clienteIdActual ? 'Cliente actualizado correctamente' : 'Cliente registrado correctamente');
            document.getElementById('formCliente').reset();
            clienteIdActual = null;
            document.getElementById('btnCancelarCliente').style.display = 'none';
            cargarClientes();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar cliente');
    }
}

async function editarCliente(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
        const cliente = await response.json();
        
        document.getElementById('clienteNombre').value = cliente.nombre;
        document.getElementById('clienteApellidoP').value = cliente.apellidoP;
        document.getElementById('clienteApellidoM').value = cliente.apellidoM || '';
        document.getElementById('clienteTelefono').value = cliente.telefono || '';
        document.getElementById('clienteCorreo').value = cliente.correo || '';
        document.getElementById('clienteCalle').value = cliente.calle || '';
        document.getElementById('clienteNumero').value = cliente.numero || '';
        document.getElementById('clienteColonia').value = cliente.colonia || '';
        document.getElementById('clienteCiudad').value = cliente.ciudad || '';
        document.getElementById('clienteEstado').value = cliente.estado || '';
        document.getElementById('clienteCodigoPostal').value = cliente.codigoPostal || '';
        
        clienteIdActual = id;
        document.getElementById('btnCancelarCliente').style.display = 'inline-block';
        
        document.getElementById('formCliente').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar cliente');
    }
}

async function eliminarCliente(id) {
    if (!confirm('¿Está seguro de eliminar este cliente? Esto también eliminará sus pasajeros asociados.')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Cliente eliminado correctamente');
            cargarClientes();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar cliente');
    }
}

function cancelarCliente() {
    document.getElementById('formCliente').reset();
    clienteIdActual = null;
    document.getElementById('btnCancelarCliente').style.display = 'none';
}

// ============================================
// PASAJEROS
// ============================================
let pasajeroIdActual = null;
let clienteIdSeleccionado = null;

async function verPasajeros(idCliente, nombreCliente) {
    clienteIdSeleccionado = idCliente;
    document.getElementById('tituloPasajeros').textContent = `Pasajeros de: ${nombreCliente}`;
    document.getElementById('seccionPasajeros').style.display = 'block';
    
    // Cargar clientes en el select del formulario
    await cargarClientesSelect();
    
    // Preseleccionar el cliente
    document.getElementById('pasajeroCliente').value = idCliente;
    
    cargarPasajeros();
}

async function cargarPasajeros() {
    if (!clienteIdSeleccionado) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/pasajeros/cliente/${clienteIdSeleccionado}`);
        const pasajeros = await response.json();
        
        const tbody = document.getElementById('tablaPasajeros');
        tbody.innerHTML = '';
        
        pasajeros.forEach(pasajero => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pasajero.idPasajero}</td>
                <td>${pasajero.nombre} ${pasajero.apellidoP} ${pasajero.apellidoM || ''}</td>
                <td>${pasajero.fechaNacimiento || 'N/A'}</td>
                <td>${pasajero.nacionalidad || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarPasajero(${pasajero.idPasajero})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarPasajero(${pasajero.idPasajero})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar pasajeros:', error);
        alert('Error al cargar pasajeros');
    }
}

async function cargarClientesSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`);
        const clientes = await response.json();
        
        const select = document.getElementById('pasajeroCliente');
        select.innerHTML = '<option value="">Seleccione cliente...</option>';
        
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.idCliente;
            option.textContent = `${cliente.nombre} ${cliente.apellidoP} ${cliente.apellidoM || ''}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}

async function guardarPasajero(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('pasajeroNombre').value.trim();
    const apellidoP = document.getElementById('pasajeroApellidoP').value.trim();
    const apellidoM = document.getElementById('pasajeroApellidoM').value.trim();
    const fechaNacimiento = document.getElementById('pasajeroFechaNacimiento').value;
    const nacionalidad = document.getElementById('pasajeroNacionalidad').value.trim();
    const pasaporte = document.getElementById('pasajeroPasaporte').value.trim();
    const idCliente = document.getElementById('pasajeroCliente').value;
    
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
    
    const validacionFecha = validarFecha(fechaNacimiento, 'Fecha de Nacimiento');
    if (!validacionFecha.valido) {
        mostrarError(validacionFecha.mensaje);
        return;
    }
    
    if (nacionalidad) {
        const validacionNacionalidad = validarSoloLetras(nacionalidad, 'Nacionalidad');
        if (!validacionNacionalidad.valido) {
            mostrarError(validacionNacionalidad.mensaje);
            return;
        }
    }
    
    if (!idCliente) {
        alert('Debe seleccionar un cliente');
        return;
    }
    
    const pasajeroData = {
        nombre,
        apellidoP,
        apellidoM,
        fechaNacimiento,
        nacionalidad,
        pasaporte,
        cliente: { idCliente: parseInt(idCliente) }
    };
    
    try {
        const url = pasajeroIdActual 
            ? `${API_BASE_URL}/pasajeros/${pasajeroIdActual}`
            : `${API_BASE_URL}/pasajeros`;
        
        const method = pasajeroIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pasajeroData)
        });
        
        if (response.ok) {
            alert(pasajeroIdActual ? 'Pasajero actualizado correctamente' : 'Pasajero registrado correctamente');
            document.getElementById('formPasajero').reset();
            pasajeroIdActual = null;
            document.getElementById('btnCancelarPasajero').style.display = 'none';
            document.getElementById('pasajeroCliente').value = clienteIdSeleccionado;
            cargarPasajeros();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar pasajero');
    }
}

async function editarPasajero(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/pasajeros/${id}`);
        const pasajero = await response.json();
        
        document.getElementById('pasajeroNombre').value = pasajero.nombre;
        document.getElementById('pasajeroApellidoP').value = pasajero.apellidoP;
        document.getElementById('pasajeroApellidoM').value = pasajero.apellidoM || '';
        document.getElementById('pasajeroFechaNacimiento').value = pasajero.fechaNacimiento || '';
        document.getElementById('pasajeroNacionalidad').value = pasajero.nacionalidad || '';
        document.getElementById('pasajeroPasaporte').value = pasajero.pasaporte || '';
        document.getElementById('pasajeroCliente').value = pasajero.cliente?.idCliente || '';
        
        pasajeroIdActual = id;
        document.getElementById('btnCancelarPasajero').style.display = 'inline-block';
        
        document.getElementById('formPasajero').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar pasajero');
    }
}

async function eliminarPasajero(id) {
    if (!confirm('¿Está seguro de eliminar este pasajero?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/pasajeros/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Pasajero eliminado correctamente');
            cargarPasajeros();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar pasajero');
    }
}

function cancelarPasajero() {
    document.getElementById('formPasajero').reset();
    pasajeroIdActual = null;
    document.getElementById('btnCancelarPasajero').style.display = 'none';
    document.getElementById('pasajeroCliente').value = clienteIdSeleccionado;
}

function cerrarPasajeros() {
    document.getElementById('seccionPasajeros').style.display = 'none';
    clienteIdSeleccionado = null;
    document.getElementById('formPasajero').reset();
    pasajeroIdActual = null;
}

// ============================================
// INICIALIZACIÓN DEL MÓDULO
// ============================================
function inicializarModuloComercial() {
    // Cargar contenido HTML de cada pestaña
    cargarHTMLClientes();
    cargarHTMLPasajeros();
}

// Cargar HTML de la pestaña Clientes
function cargarHTMLClientes() {
    const contenedor = document.getElementById('clientes-content');
    contenedor.innerHTML = `
        <div class="card mb-3">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-plus"></i> Nuevo Cliente
            </div>
            <div class="card-body">
                <form id="formCliente" onsubmit="event.preventDefault(); guardarCliente(event);">
                    <h5 class="mb-3 text-primary">Datos Personales</h5>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Nombre *</label>
                                <input type="text" class="form-control" id="clienteNombre" maxlength="50" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Apellido Paterno *</label>
                                <input type="text" class="form-control" id="clienteApellidoP" maxlength="50" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Apellido Materno</label>
                                <input type="text" class="form-control" id="clienteApellidoM" maxlength="50">
                            </div>
                        </div>
                    </div>
                    
                    <h5 class="mb-3 text-primary">Contacto</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Correo Electrónico *</label>
                                <input type="email" class="form-control" id="clienteCorreo" maxlength="100" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Teléfono</label>
                                <input type="tel" class="form-control" id="clienteTelefono" maxlength="15">
                            </div>
                        </div>
                    </div>
                    
                    <h5 class="mb-3 text-primary">Dirección</h5>
                    <div class="row">
                        <div class="col-md-8">
                            <div class="mb-3">
                                <label class="form-label">Calle</label>
                                <input type="text" class="form-control" id="clienteCalle" maxlength="100">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Número</label>
                                <input type="text" class="form-control" id="clienteNumero" maxlength="10">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Colonia</label>
                                <input type="text" class="form-control" id="clienteColonia" maxlength="50">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Ciudad</label>
                                <input type="text" class="form-control" id="clienteCiudad" maxlength="50">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Estado</label>
                                <input type="text" class="form-control" id="clienteEstado" maxlength="50">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Código Postal</label>
                                <input type="text" class="form-control" id="clienteCodigoPostal" maxlength="10">
                            </div>
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Guardar Cliente
                        </button>
                        <button type="button" class="btn btn-secondary" id="btnCancelarCliente" style="display:none;" onclick="cancelarCliente()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="card">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-list"></i> Lista de Clientes
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-search"></i></span>
                        <input type="text" class="form-control" id="buscarClienteInput" placeholder="Buscar por nombre, correo...">
                        <button class="btn btn-outline-secondary" type="button" onclick="buscarCliente()">
                            <i class="fas fa-search"></i> Buscar
                        </button>
                        <button class="btn btn-outline-secondary" type="button" onclick="cargarClientes()">
                            <i class="fas fa-refresh"></i> Todos
                        </button>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre Completo</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Ciudad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaClientes"></tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Sección de Pasajeros (oculta inicialmente) -->
        <div id="seccionPasajeros" class="mt-4" style="display:none;">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 id="tituloPasajeros">Pasajeros</h4>
                <button class="btn btn-secondary" onclick="cerrarPasajeros()">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
            
            <div class="card mb-3">
                <div class="card-header bg-success text-white">
                    <i class="fas fa-user-plus"></i> Nuevo Pasajero
                </div>
                <div class="card-body">
                    <form id="formPasajero" onsubmit="event.preventDefault(); guardarPasajero(event);">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Cliente *</label>
                                    <select class="form-control" id="pasajeroCliente" required>
                                        <option value="">Seleccione cliente...</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">Nombre *</label>
                                    <input type="text" class="form-control" id="pasajeroNombre" maxlength="50" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">Apellido Paterno *</label>
                                    <input type="text" class="form-control" id="pasajeroApellidoP" maxlength="50" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">Apellido Materno</label>
                                    <input type="text" class="form-control" id="pasajeroApellidoM" maxlength="50">
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">Fecha de Nacimiento *</label>
                                    <input type="date" class="form-control" id="pasajeroFechaNacimiento" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">Nacionalidad</label>
                                    <input type="text" class="form-control" id="pasajeroNacionalidad" maxlength="50">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">Pasaporte</label>
                                    <input type="text" class="form-control" id="pasajeroPasaporte" maxlength="50">
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-success">
                                <i class="fas fa-save"></i> Guardar Pasajero
                            </button>
                            <button type="button" class="btn btn-secondary" id="btnCancelarPasajero" style="display:none;" onclick="cancelarPasajero()">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="card">
                <div class="card-header bg-success text-white">
                    <i class="fas fa-list"></i> Lista de Pasajeros
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre Completo</th>
                                    <th>Fecha Nacimiento</th>
                                    <th>Nacionalidad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tablaPasajeros"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    cargarClientes();
}

// Cargar HTML de la pestaña Pasajeros (vacía, se usa la sección dinámica)
function cargarHTMLPasajeros() {
    const contenedor = document.getElementById('pasajeros-content');
    contenedor.innerHTML = `
        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <strong>Gestión de Pasajeros</strong><br>
            Para gestionar pasajeros, vaya a la pestaña de <strong>Clientes</strong> y haga clic en el botón "Pasajeros" del cliente correspondiente.
        </div>
    `;
}

// Exponer funciones al scope global
window.inicializarModuloComercial = inicializarModuloComercial;
window.guardarCliente = guardarCliente;
window.cancelarCliente = cancelarCliente;
window.buscarCliente = buscarCliente;
window.editarCliente = editarCliente;
window.eliminarCliente = eliminarCliente;
window.verPasajeros = verPasajeros;
window.guardarPasajero = guardarPasajero;
window.cancelarPasajero = cancelarPasajero;
window.cerrarPasajeros = cerrarPasajeros;
window.editarPasajero = editarPasajero;
window.eliminarPasajero = eliminarPasajero;
