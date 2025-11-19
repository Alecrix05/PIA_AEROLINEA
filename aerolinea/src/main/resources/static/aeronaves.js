// ============================================
// MÓDULO UNIFICADO: GESTIÓN DE AERONAVES
// Incluye: Aviones y Asientos
// ============================================

// ============================================
// AVIONES
// ============================================
let avionIdActual = null;

async function cargarAviones() {
    try {
        const response = await fetch(`${API_BASE_URL}/aviones`);
        const aviones = await response.json();
        
        const tbody = document.getElementById('tablaAviones');
        tbody.innerHTML = '';
        
        aviones.forEach(avion => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${avion.idAvion}</td>
                <td>${avion.matricula || 'N/A'}</td>
                <td>${avion.modelo}</td>
                <td>${avion.capacidad}</td>
                <td><span class="badge bg-${avion.estadoOperativo === 'ACTIVO' ? 'success' : avion.estadoOperativo === 'MANTENIMIENTO' ? 'warning' : 'secondary'}">${avion.estadoOperativo}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarAvion(${avion.idAvion})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarAvion(${avion.idAvion})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="window.verAsientos(${avion.idAvion}, '${avion.modelo}')">
                        <i class="fas fa-chair"></i> Asientos
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar aviones:', error);
        alert('Error al cargar aviones');
    }
}

async function guardarAvion(event) {
    event.preventDefault();
    
    const matricula = document.getElementById('avionMatricula').value.trim();
    const modelo = document.getElementById('avionModelo').value.trim();
    const capacidad = parseInt(document.getElementById('avionCapacidad').value);
    const estadoOperativo = document.getElementById('avionEstado').value.trim();
    
    const validacionMatricula = validarTexto(matricula, 'Matrícula');
    if (!validacionMatricula.valido) {
        mostrarError(validacionMatricula.mensaje);
        return;
    }
    
    const validacionModelo = validarTexto(modelo, 'Modelo');
    if (!validacionModelo.valido) {
        mostrarError(validacionModelo.mensaje);
        return;
    }
    
    const validacionCapacidad = validarEnteroPositivo(capacidad, 'Capacidad');
    if (!validacionCapacidad.valido) {
        mostrarError(validacionCapacidad.mensaje);
        return;
    }
    
    if (!estadoOperativo) {
        mostrarError('Debe seleccionar un estado operativo');
        return;
    }
    
    if (capacidad < 1 || capacidad > 1000) {
        mostrarError('La capacidad debe estar entre 1 y 1000 pasajeros');
        return;
    }
    
    const avion = {
        matricula,
        modelo,
        capacidad,
        estadoOperativo
    };
    
    try {
        const url = avionIdActual 
            ? `${API_BASE_URL}/aviones/${avionIdActual}`
            : `${API_BASE_URL}/aviones`;
        
        const method = avionIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(avion)
        });
        
        if (response.ok) {
            alert(avionIdActual ? 'Avión actualizado correctamente' : 'Avión registrado correctamente');
            document.getElementById('formAvion').reset();
            avionIdActual = null;
            document.getElementById('btnCancelarAvion').style.display = 'none';
            cargarAviones();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar avión');
    }
}

async function editarAvion(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/aviones/${id}`);
        const avion = await response.json();
        
        document.getElementById('avionMatricula').value = avion.matricula || '';
        document.getElementById('avionModelo').value = avion.modelo;
        document.getElementById('avionCapacidad').value = avion.capacidad;
        document.getElementById('avionEstado').value = avion.estadoOperativo || '';
        
        avionIdActual = id;
        document.getElementById('btnCancelarAvion').style.display = 'inline-block';
        
        document.getElementById('formAvion').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar avión');
    }
}

async function eliminarAvion(id) {
    if (!confirm('¿Está seguro de eliminar este avión? Esto también eliminará sus asientos.')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/aviones/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Avión eliminado correctamente');
            cargarAviones();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar avión');
    }
}

function cancelarAvion() {
    document.getElementById('formAvion').reset();
    avionIdActual = null;
    document.getElementById('btnCancelarAvion').style.display = 'none';
}

// ============================================
// ASIENTOS
// ============================================
let asientoIdActual = null;
let avionIdSeleccionado = null;

async function verAsientos(idAvion, modeloAvion) {
    avionIdSeleccionado = idAvion;
    document.getElementById('tituloAsientos').textContent = `Asientos del Avión: ${modeloAvion}`;
    document.getElementById('seccionAsientos').style.display = 'block';
    
    // Cargar aviones en el select del formulario
    await cargarAvionesSelect();
    
    // Preseleccionar el avión
    document.getElementById('asientoAvion').value = idAvion;
    
    cargarAsientos();
}

async function cargarAsientos() {
    if (!avionIdSeleccionado) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/asientos/avion/${avionIdSeleccionado}`);
        const asientos = await response.json();
        
        const tbody = document.getElementById('tablaAsientos');
        tbody.innerHTML = '';
        
        asientos.forEach(asiento => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${asiento.idAsiento}</td>
                <td>${asiento.codigoAsiento}</td>
                <td>${asiento.fila || 'N/A'}</td>
                <td>${asiento.columna || 'N/A'}</td>
                <td>${asiento.clase}</td>
                <td>${asiento.ubicacion || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarAsiento(${asiento.idAsiento})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarAsiento(${asiento.idAsiento})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar asientos:', error);
        alert('Error al cargar asientos');
    }
}

async function cargarAvionesSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/aviones`);
        const aviones = await response.json();
        
        const select = document.getElementById('asientoAvion');
        select.innerHTML = '<option value="">Seleccione avión...</option>';
        
        aviones.forEach(avion => {
            const option = document.createElement('option');
            option.value = avion.idAvion;
            option.textContent = `${avion.modelo} (${avion.matricula || 'Sin matrícula'})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar aviones:', error);
    }
}

async function guardarAsiento(event) {
    event.preventDefault();
    
    const codigoAsiento = document.getElementById('asientoNumero').value.trim();
    const fila = document.getElementById('asientoFila').value ? parseInt(document.getElementById('asientoFila').value) : null;
    const columna = document.getElementById('asientoColumna').value.trim();
    const clase = document.getElementById('asientoClase').value.trim();
    const ubicacion = document.getElementById('asientoUbicacion').value.trim();
    const idAvion = document.getElementById('asientoAvion').value;
    
    const validacionCodigo = validarTexto(codigoAsiento, 'Código de Asiento');
    if (!validacionCodigo.valido) {
        mostrarError(validacionCodigo.mensaje);
        return;
    }
    
    if (!clase) {
        mostrarError('Debe seleccionar una clase');
        return;
    }
    
    if (!idAvion) {
        alert('Debe seleccionar un avión');
        return;
    }
    
    const asiento = {
        codigoAsiento,
        fila,
        columna,
        clase,
        ubicacion,
        avion: { idAvion: parseInt(idAvion) }
    };
    
    try {
        const url = asientoIdActual 
            ? `${API_BASE_URL}/asientos/${asientoIdActual}`
            : `${API_BASE_URL}/asientos`;
        
        const method = asientoIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(asiento)
        });
        
        if (response.ok) {
            alert(asientoIdActual ? 'Asiento actualizado correctamente' : 'Asiento registrado correctamente');
            document.getElementById('formAsiento').reset();
            asientoIdActual = null;
            document.getElementById('btnCancelarAsiento').style.display = 'none';
            document.getElementById('asientoAvion').value = avionIdSeleccionado;
            cargarAsientos();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar asiento');
    }
}

async function editarAsiento(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/asientos/${id}`);
        const asiento = await response.json();
        
        document.getElementById('asientoNumero').value = asiento.codigoAsiento;
        document.getElementById('asientoFila').value = asiento.fila || '';
        document.getElementById('asientoColumna').value = asiento.columna || '';
        document.getElementById('asientoClase').value = asiento.clase || '';
        document.getElementById('asientoUbicacion').value = asiento.ubicacion || '';
        document.getElementById('asientoAvion').value = asiento.avion?.idAvion || '';
        
        asientoIdActual = id;
        document.getElementById('btnCancelarAsiento').style.display = 'inline-block';
        
        document.getElementById('formAsiento').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar asiento');
    }
}

async function eliminarAsiento(id) {
    if (!confirm('¿Está seguro de eliminar este asiento?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/asientos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Asiento eliminado correctamente');
            cargarAsientos();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar asiento');
    }
}

function cancelarAsiento() {
    document.getElementById('formAsiento').reset();
    asientoIdActual = null;
    document.getElementById('btnCancelarAsiento').style.display = 'none';
    document.getElementById('asientoAvion').value = avionIdSeleccionado;
}

function cerrarAsientos() {
    document.getElementById('seccionAsientos').style.display = 'none';
    avionIdSeleccionado = null;
    document.getElementById('formAsiento').reset();
    asientoIdActual = null;
}

// ============================================
// INICIALIZACIÓN DEL MÓDULO
// ============================================
function inicializarModuloAeronaves() {
    // Cargar contenido HTML de cada pestaña
    cargarHTMLAviones();
    cargarHTMLAsientos();
}

// Cargar HTML de la pestaña Aviones
function cargarHTMLAviones() {
    const contenedor = document.getElementById('aviones-content');
    contenedor.innerHTML = `
        <div class="card mb-3">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-plus"></i> Nuevo Avión
            </div>
            <div class="card-body">
                <form id="formAvion" onsubmit="event.preventDefault(); guardarAvion(event);">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Matrícula *</label>
                                <input type="text" class="form-control" id="avionMatricula" maxlength="20" required>
                                <small class="form-text text-muted">Ej: XA-ABC, N123AB</small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Modelo *</label>
                                <input type="text" class="form-control" id="avionModelo" maxlength="50" required>
                                <small class="form-text text-muted">Ej: Boeing 737, Airbus A320</small>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Capacidad *</label>
                                <input type="number" class="form-control" id="avionCapacidad" min="1" max="1000" required>
                                <small class="form-text text-muted">Número de pasajeros</small>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="mb-3">
                                <label class="form-label">Estado Operativo *</label>
                                <select class="form-control" id="avionEstado" required>
                                    <option value="">Seleccione estado...</option>
                                    <option value="ACTIVO">Activo</option>
                                    <option value="MANTENIMIENTO">En Mantenimiento</option>
                                    <option value="INACTIVO">Inactivo</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Guardar Avión
                        </button>
                        <button type="button" class="btn btn-secondary" id="btnCancelarAvion" style="display:none;" onclick="cancelarAvion()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="card">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-list"></i> Lista de Aviones
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Matrícula</th>
                                <th>Modelo</th>
                                <th>Capacidad</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaAviones"></tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Sección de Asientos (oculta inicialmente) -->
        <div id="seccionAsientos" class="mt-4" style="display:none;">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 id="tituloAsientos">Asientos</h4>
                <button class="btn btn-secondary" onclick="cerrarAsientos()">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
            
            <div class="card mb-3">
                <div class="card-header bg-success text-white">
                    <i class="fas fa-chair"></i> Nuevo Asiento
                </div>
                <div class="card-body">
                    <form id="formAsiento" onsubmit="event.preventDefault(); guardarAsiento(event);">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Avión *</label>
                                    <select class="form-control" id="asientoAvion" required>
                                        <option value="">Seleccione avión...</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">Código Asiento *</label>
                                    <input type="text" class="form-control" id="asientoNumero" maxlength="10" placeholder="12A" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">Fila</label>
                                    <input type="number" class="form-control" id="asientoFila" min="1" max="100">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">Columna</label>
                                    <input type="text" class="form-control" id="asientoColumna" maxlength="5" placeholder="A">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">Clase *</label>
                                    <select class="form-control" id="asientoClase" required>
                                        <option value="">Seleccione clase...</option>
                                        <option value="Económica">Económica</option>
                                        <option value="Ejecutiva">Ejecutiva</option>
                                        <option value="Primera">Primera Clase</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Ubicación</label>
                                    <select class="form-control" id="asientoUbicacion">
                                        <option value="">Seleccione ubicación...</option>
                                        <option value="Ventana">Ventana</option>
                                        <option value="Pasillo">Pasillo</option>
                                        <option value="Centro">Centro</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-success">
                                <i class="fas fa-save"></i> Guardar Asiento
                            </button>
                            <button type="button" class="btn btn-secondary" id="btnCancelarAsiento" style="display:none;" onclick="cancelarAsiento()">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="card">
                <div class="card-header bg-success text-white">
                    <i class="fas fa-list"></i> Lista de Asientos
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Código</th>
                                    <th>Fila</th>
                                    <th>Columna</th>
                                    <th>Clase</th>
                                    <th>Ubicación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tablaAsientos"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    cargarAviones();
}

// Cargar HTML de la pestaña Asientos (vacía, se usa la sección dinámica)
function cargarHTMLAsientos() {
    const contenedor = document.getElementById('asientos-content');
    contenedor.innerHTML = `
        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <strong>Gestión de Asientos</strong><br>
            Para gestionar asientos, vaya a la pestaña de <strong>Aviones</strong> y haga clic en el botón "Asientos" del avión correspondiente.
        </div>
    `;
}

// Exponer funciones al scope global
window.inicializarModuloAeronaves = inicializarModuloAeronaves;
window.guardarAvion = guardarAvion;
window.cancelarAvion = cancelarAvion;
window.editarAvion = editarAvion;
window.eliminarAvion = eliminarAvion;
window.verAsientos = verAsientos;
window.guardarAsiento = guardarAsiento;
window.cancelarAsiento = cancelarAsiento;
window.cerrarAsientos = cerrarAsientos;
window.editarAsiento = editarAsiento;
window.eliminarAsiento = eliminarAsiento;
