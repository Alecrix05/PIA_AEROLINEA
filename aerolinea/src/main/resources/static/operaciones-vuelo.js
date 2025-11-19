// ============================================
// MÓDULO UNIFICADO: OPERACIONES DE VUELO
// Incluye: Rutas, Vuelos e Instancias de Vuelo
// ============================================

// ============================================
// RUTAS
// ============================================
let rutaIdActual = null;

async function cargarRutas() {
    try {
        const response = await fetch(`${API_BASE_URL}/rutas`);
        const rutas = await response.json();
        
        const tbody = document.getElementById('tablaRutas');
        tbody.innerHTML = '';
        
        rutas.forEach(ruta => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ruta.idRuta}</td>
                <td>${ruta.origen?.nombre || 'N/A'} (${ruta.origen?.codigoIATA || 'N/A'})</td>
                <td>${ruta.destino?.nombre || 'N/A'} (${ruta.destino?.codigoIATA || 'N/A'})</td>
                <td>${ruta.distancia ? ruta.distancia.toFixed(2) + ' km' : 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarRuta(${ruta.idRuta})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarRuta(${ruta.idRuta})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar rutas:', error);
        alert('Error al cargar rutas');
    }
}

async function cargarAeropuertosSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/aeropuertos`);
        const aeropuertos = await response.json();
        
        const selectOrigen = document.getElementById('rutaOrigen');
        const selectDestino = document.getElementById('rutaDestino');
        
        selectOrigen.innerHTML = '<option value="">Seleccione aeropuerto de origen...</option>';
        selectDestino.innerHTML = '<option value="">Seleccione aeropuerto de destino...</option>';
        
        aeropuertos.forEach(aeropuerto => {
            const option1 = document.createElement('option');
            option1.value = aeropuerto.idAeropuerto;
            option1.textContent = `${aeropuerto.nombre} (${aeropuerto.codigoIATA})`;
            selectOrigen.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = aeropuerto.idAeropuerto;
            option2.textContent = `${aeropuerto.nombre} (${aeropuerto.codigoIATA})`;
            selectDestino.appendChild(option2);
        });
    } catch (error) {
        console.error('Error al cargar aeropuertos:', error);
    }
}

async function guardarRuta(event) {
    event.preventDefault();
    
    const idOrigen = document.getElementById('rutaOrigen').value;
    const idDestino = document.getElementById('rutaDestino').value;
    const distancia = parseFloat(document.getElementById('rutaDistancia').value);
    
    if (!idOrigen) {
        mostrarError('Debe seleccionar un aeropuerto de origen');
        return;
    }
    
    if (!idDestino) {
        mostrarError('Debe seleccionar un aeropuerto de destino');
        return;
    }
    
    if (idOrigen === idDestino) {
        mostrarError('El aeropuerto de origen y destino deben ser diferentes');
        return;
    }
    
    const validacionDistancia = validarDecimal(distancia, 'Distancia');
    if (!validacionDistancia.valido) {
        mostrarError(validacionDistancia.mensaje);
        return;
    }
    
    const ruta = {
        origen: { idAeropuerto: parseInt(idOrigen) },
        destino: { idAeropuerto: parseInt(idDestino) },
        distancia
    };
    
    try {
        const url = rutaIdActual 
            ? `${API_BASE_URL}/rutas/${rutaIdActual}`
            : `${API_BASE_URL}/rutas`;
        
        const method = rutaIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ruta)
        });
        
        if (response.ok) {
            mostrarExito(rutaIdActual ? 'Ruta actualizada correctamente' : 'Ruta registrada correctamente');
            document.getElementById('formRuta').reset();
            rutaIdActual = null;
            document.getElementById('btnCancelarRuta').style.display = 'none';
            cargarRutas();
        } else {
            const error = await response.text();
            mostrarError('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al guardar ruta');
    }
}

async function editarRuta(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/rutas/${id}`);
        const ruta = await response.json();
        
        document.getElementById('rutaOrigen').value = ruta.origen?.idAeropuerto || '';
        document.getElementById('rutaDestino').value = ruta.destino?.idAeropuerto || '';
        document.getElementById('rutaDistancia').value = ruta.distancia || '';
        
        rutaIdActual = id;
        document.getElementById('btnCancelarRuta').style.display = 'inline-block';
        
        document.getElementById('formRuta').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar ruta');
    }
}

async function eliminarRuta(id) {
    const confirmacion = await mostrarConfirmacion('¿Está seguro de eliminar esta ruta?');
    if (!confirmacion.isConfirmed) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/rutas/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            mostrarExito('Ruta eliminada correctamente');
            cargarRutas();
        } else {
            const error = await response.text();
            mostrarError('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al eliminar ruta');
    }
}

function cancelarRuta() {
    document.getElementById('formRuta').reset();
    rutaIdActual = null;
    document.getElementById('btnCancelarRuta').style.display = 'none';
}

// ============================================
// VUELOS
// ============================================
let vueloIdActual = null;

async function cargarVuelos() {
    try {
        const response = await fetch(`${API_BASE_URL}/vuelos`);
        const vuelos = await response.json();
        
        const tbody = document.getElementById('tablaVuelos');
        tbody.innerHTML = '';
        
        vuelos.forEach(vuelo => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${vuelo.idVuelo}</td>
                <td>${vuelo.numeroVuelo}</td>
                <td>${vuelo.ruta ? `${vuelo.ruta.origen?.codigoIATA} → ${vuelo.ruta.destino?.codigoIATA}` : 'N/A'}</td>
                <td>${vuelo.duracion || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarVuelo(${vuelo.idVuelo})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarVuelo(${vuelo.idVuelo})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar vuelos:', error);
        alert('Error al cargar vuelos');
    }
}

async function cargarRutasSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/rutas`);
        const rutas = await response.json();
        
        const select = document.getElementById('vueloRuta');
        select.innerHTML = '<option value="">Seleccione ruta (opcional)...</option>';
        
        rutas.forEach(ruta => {
            const option = document.createElement('option');
            option.value = ruta.idRuta;
            option.textContent = `${ruta.origen?.codigoIATA} → ${ruta.destino?.codigoIATA} (${ruta.distancia?.toFixed(0)} km)`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar rutas:', error);
    }
}

async function guardarVuelo(event) {
    event.preventDefault();
    
    const numeroVuelo = document.getElementById('vueloNumero').value.trim();
    const duracion = document.getElementById('vueloDuracion').value.trim();
    const idRuta = document.getElementById('vueloRuta').value;
    
    const validacionNumero = validarTexto(numeroVuelo, 'Número de Vuelo');
    if (!validacionNumero.valido) {
        mostrarError(validacionNumero.mensaje);
        return;
    }
    
    const vuelo = {
        numeroVuelo,
        duracion: duracion || null,
        ruta: idRuta ? { idRuta: parseInt(idRuta) } : null
    };
    
    try {
        const url = vueloIdActual 
            ? `${API_BASE_URL}/vuelos/${vueloIdActual}`
            : `${API_BASE_URL}/vuelos`;
        
        const method = vueloIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vuelo)
        });
        
        if (response.ok) {
            mostrarExito(vueloIdActual ? 'Vuelo actualizado correctamente' : 'Vuelo registrado correctamente');
            document.getElementById('formVuelo').reset();
            vueloIdActual = null;
            document.getElementById('btnCancelarVuelo').style.display = 'none';
            cargarVuelos();
        } else {
            const error = await response.text();
            mostrarError('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al guardar vuelo');
    }
}

async function editarVuelo(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/vuelos/${id}`);
        const vuelo = await response.json();
        
        document.getElementById('vueloNumero').value = vuelo.numeroVuelo;
        document.getElementById('vueloDuracion').value = vuelo.duracion || '';
        document.getElementById('vueloRuta').value = vuelo.ruta?.idRuta || '';
        
        vueloIdActual = id;
        document.getElementById('btnCancelarVuelo').style.display = 'inline-block';
        
        document.getElementById('formVuelo').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar vuelo');
    }
}

async function eliminarVuelo(id) {
    const confirmacion = await mostrarConfirmacion('¿Está seguro de eliminar este vuelo?');
    if (!confirmacion.isConfirmed) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/vuelos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            mostrarExito('Vuelo eliminado correctamente');
            cargarVuelos();
        } else {
            const error = await response.text();
            mostrarError('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al eliminar vuelo');
    }
}

function cancelarVuelo() {
    document.getElementById('formVuelo').reset();
    vueloIdActual = null;
    document.getElementById('btnCancelarVuelo').style.display = 'none';
}

// ============================================
// INSTANCIAS DE VUELO
// ============================================
let instanciaIdActual = null;

async function cargarInstancias() {
    try {
        const response = await fetch(`${API_BASE_URL}/instancias-vuelo`);
        const instancias = await response.json();
        
        const tbody = document.getElementById('tablaInstancias');
        tbody.innerHTML = '';
        
        instancias.forEach(instancia => {
            const tr = document.createElement('tr');
            const fechaSalida = instancia.fechaSalida ? new Date(instancia.fechaSalida).toLocaleString('es-MX') : 'N/A';
            const fechaLlegada = instancia.fechaLlegada ? new Date(instancia.fechaLlegada).toLocaleString('es-MX') : 'N/A';
            
            tr.innerHTML = `
                <td>${instancia.idInstanciaVuelo}</td>
                <td>${instancia.vuelo?.numeroVuelo || 'N/A'}</td>
                <td>${instancia.avion?.modelo || 'N/A'}</td>
                <td>${fechaSalida}</td>
                <td>${fechaLlegada}</td>
                <td><span class="badge bg-${instancia.estadoVuelo === 'PROGRAMADO' ? 'success' : instancia.estadoVuelo === 'RETRASADO' ? 'warning' : 'info'}">${instancia.estadoVuelo}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarInstancia(${instancia.idInstanciaVuelo})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarInstancia(${instancia.idInstanciaVuelo})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar instancias:', error);
        alert('Error al cargar instancias');
    }
}

async function cargarVuelosSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/vuelos`);
        const vuelos = await response.json();
        
        const select = document.getElementById('instanciaVuelo');
        select.innerHTML = '<option value="">Seleccione vuelo...</option>';
        
        vuelos.forEach(vuelo => {
            const option = document.createElement('option');
            option.value = vuelo.idVuelo;
            option.textContent = `${vuelo.numeroVuelo} - ${vuelo.duracion || 'Sin duración'}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar vuelos:', error);
    }
}

async function cargarAvionesSelectInstancia() {
    try {
        const response = await fetch(`${API_BASE_URL}/aviones`);
        const aviones = await response.json();
        
        const select = document.getElementById('instanciaAvion');
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

async function cargarTripulacionesSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/tripulaciones`);
        const tripulaciones = await response.json();
        
        const select = document.getElementById('instanciaTripulacion');
        select.innerHTML = '<option value="">Seleccione tripulación (opcional)...</option>';
        
        tripulaciones.forEach(tripulacion => {
            const option = document.createElement('option');
            option.value = tripulacion.idTripulacion;
            option.textContent = tripulacion.nombreTripulacion;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar tripulaciones:', error);
    }
}

async function guardarInstancia(event) {
    event.preventDefault();
    
    const idVuelo = document.getElementById('instanciaVuelo').value;
    const idAvion = document.getElementById('instanciaAvion').value;
    const fechaSalida = document.getElementById('instanciaFechaSalida').value;
    const fechaLlegada = document.getElementById('instanciaFechaLlegada').value;
    const estadoVuelo = document.getElementById('instanciaEstado').value;
    const idTripulacion = document.getElementById('instanciaTripulacion').value;
    
    if (!idVuelo) {
        mostrarError('Debe seleccionar un vuelo');
        return;
    }
    
    if (!idAvion) {
        mostrarError('Debe seleccionar un avión');
        return;
    }
    
    const validacionFechaSalida = validarTexto(fechaSalida, 'Fecha y Hora de Salida');
    if (!validacionFechaSalida.valido) {
        mostrarError(validacionFechaSalida.mensaje);
        return;
    }
    
    const validacionFechaLlegada = validarTexto(fechaLlegada, 'Fecha y Hora de Llegada');
    if (!validacionFechaLlegada.valido) {
        mostrarError(validacionFechaLlegada.mensaje);
        return;
    }
    
    if (!estadoVuelo) {
        mostrarError('Debe seleccionar un estado');
        return;
    }
    
    // Validar que la fecha de llegada sea posterior a la de salida
    if (new Date(fechaLlegada) <= new Date(fechaSalida)) {
        mostrarError('La fecha de llegada debe ser posterior a la fecha de salida');
        return;
    }
    
    const instancia = {
        vuelo: { idVuelo: parseInt(idVuelo) },
        avion: { idAvion: parseInt(idAvion) },
        fechaSalida,
        fechaLlegada,
        estadoVuelo,
        tripulacion: idTripulacion ? { idTripulacion: parseInt(idTripulacion) } : null
    };
    
    try {
        const url = instanciaIdActual 
            ? `${API_BASE_URL}/instancias-vuelo/${instanciaIdActual}`
            : `${API_BASE_URL}/instancias-vuelo`;
        
        const method = instanciaIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(instancia)
        });
        
        if (response.ok) {
            mostrarExito(instanciaIdActual ? 'Instancia actualizada correctamente' : 'Instancia registrada correctamente');
            document.getElementById('formInstancia').reset();
            instanciaIdActual = null;
            document.getElementById('btnCancelarInstancia').style.display = 'none';
            cargarInstancias();
        } else {
            const error = await response.text();
            mostrarError('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al guardar instancia');
    }
}

async function editarInstancia(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/instancias-vuelo/${id}`);
        const instancia = await response.json();
        
        document.getElementById('instanciaVuelo').value = instancia.vuelo?.idVuelo || '';
        document.getElementById('instanciaAvion').value = instancia.avion?.idAvion || '';
        document.getElementById('instanciaFechaSalida').value = instancia.fechaSalida ? instancia.fechaSalida.slice(0, 16) : '';
        document.getElementById('instanciaFechaLlegada').value = instancia.fechaLlegada ? instancia.fechaLlegada.slice(0, 16) : '';
        document.getElementById('instanciaEstado').value = instancia.estadoVuelo || '';
        document.getElementById('instanciaTripulacion').value = instancia.tripulacion?.idTripulacion || '';
        
        instanciaIdActual = id;
        document.getElementById('btnCancelarInstancia').style.display = 'inline-block';
        
        document.getElementById('formInstancia').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar instancia');
    }
}

async function eliminarInstancia(id) {
    const confirmacion = await mostrarConfirmacion('¿Está seguro de eliminar esta instancia de vuelo?');
    if (!confirmacion.isConfirmed) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/instancias-vuelo/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            mostrarExito('Instancia eliminada correctamente');
            cargarInstancias();
        } else {
            const error = await response.text();
            mostrarError('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al eliminar instancia');
    }
}

function cancelarInstancia() {
    document.getElementById('formInstancia').reset();
    instanciaIdActual = null;
    document.getElementById('btnCancelarInstancia').style.display = 'none';
}

// ============================================
// INICIALIZACIÓN DEL MÓDULO
// ============================================
function inicializarModuloOperaciones() {
    // Cargar contenido HTML de cada pestaña
    cargarHTMLRutas();
    cargarHTMLVuelos();
    cargarHTMLInstancias();
    
    // Cargar datos para selects
    cargarAeropuertosSelect();
    cargarRutasSelect();
    cargarVuelosSelect();
    cargarAvionesSelectInstancia();
    cargarTripulacionesSelect();
}

// Cargar HTML de la pestaña Rutas
function cargarHTMLRutas() {
    const contenedor = document.getElementById('rutas-content');
    contenedor.innerHTML = `
        <div class="card mb-3">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-plus"></i> Nueva Ruta
            </div>
            <div class="card-body">
                <form id="formRuta" onsubmit="event.preventDefault(); guardarRuta(event);">
                    <div class="row">
                        <div class="col-md-5">
                            <div class="mb-3">
                                <label class="form-label">Aeropuerto de Origen *</label>
                                <select class="form-control" id="rutaOrigen" required>
                                    <option value="">Seleccione aeropuerto de origen...</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="mb-3">
                                <label class="form-label">Aeropuerto de Destino *</label>
                                <select class="form-control" id="rutaDestino" required>
                                    <option value="">Seleccione aeropuerto de destino...</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="mb-3">
                                <label class="form-label">Distancia (km) *</label>
                                <input type="number" step="0.01" class="form-control" id="rutaDistancia" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Guardar Ruta
                        </button>
                        <button type="button" class="btn btn-secondary" id="btnCancelarRuta" style="display:none;" onclick="cancelarRuta()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="card">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-list"></i> Lista de Rutas
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Distancia</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaRutas"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    cargarRutas();
}

// Cargar HTML de la pestaña Vuelos
function cargarHTMLVuelos() {
    const contenedor = document.getElementById('vuelos-content');
    contenedor.innerHTML = `
        <div class="card mb-3">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-plus"></i> Nuevo Vuelo
            </div>
            <div class="card-body">
                <form id="formVuelo" onsubmit="event.preventDefault(); guardarVuelo(event);">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Número de Vuelo *</label>
                                <input type="text" class="form-control" id="vueloNumero" maxlength="20" placeholder="Ej: AA123" required>
                                <small class="form-text text-muted">Código único del vuelo</small>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Duración</label>
                                <input type="text" class="form-control" id="vueloDuracion" placeholder="HH:MM:SS (ej: 02:30:00)">
                                <small class="form-text text-muted">Formato: HH:MM:SS</small>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Ruta</label>
                                <select class="form-control" id="vueloRuta">
                                    <option value="">Seleccione una ruta (opcional)</option>
                                </select>
                                <small class="form-text text-muted">Origen → Destino</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Guardar Vuelo
                        </button>
                        <button type="button" class="btn btn-secondary" id="btnCancelarVuelo" style="display:none;" onclick="cancelarVuelo()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="card">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-list"></i> Lista de Vuelos
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Número Vuelo</th>
                                <th>Ruta</th>
                                <th>Duración</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaVuelos"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    cargarVuelos();
}

// Cargar HTML de la pestaña Instancias
function cargarHTMLInstancias() {
    const contenedor = document.getElementById('instancias-content');
    contenedor.innerHTML = `
        <div class="card mb-3">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-plus"></i> Nueva Instancia de Vuelo
            </div>
            <div class="card-body">
                <form id="formInstancia" onsubmit="event.preventDefault(); guardarInstancia(event);">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Vuelo *</label>
                                <select class="form-control" id="instanciaVuelo" required>
                                    <option value="">Seleccione un vuelo</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Avión *</label>
                                <select class="form-control" id="instanciaAvion" required>
                                    <option value="">Seleccione un avión</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Tripulación</label>
                                <select class="form-control" id="instanciaTripulacion">
                                    <option value="">Seleccione tripulación (opcional)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Fecha y Hora de Salida *</label>
                                <input type="datetime-local" class="form-control" id="instanciaFechaSalida" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Fecha y Hora de Llegada *</label>
                                <input type="datetime-local" class="form-control" id="instanciaFechaLlegada" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Estado *</label>
                                <select class="form-control" id="instanciaEstado" required>
                                    <option value="PROGRAMADO">Programado</option>
                                    <option value="EN_VUELO">En Vuelo</option>
                                    <option value="COMPLETADO">Completado</option>
                                    <option value="CANCELADO">Cancelado</option>
                                    <option value="RETRASADO">Retrasado</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Guardar Instancia
                        </button>
                        <button type="button" class="btn btn-secondary" id="btnCancelarInstancia" style="display:none;" onclick="cancelarInstancia()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="card">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-list"></i> Lista de Instancias
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Vuelo</th>
                                <th>Avión</th>
                                <th>Fecha Salida</th>
                                <th>Fecha Llegada</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaInstancias"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    cargarInstancias();
}

// Exponer funciones al scope global
window.inicializarModuloOperaciones = inicializarModuloOperaciones;
window.guardarRuta = guardarRuta;
window.cancelarRuta = cancelarRuta;
window.editarRuta = editarRuta;
window.eliminarRuta = eliminarRuta;
window.guardarVuelo = guardarVuelo;
window.cancelarVuelo = cancelarVuelo;
window.editarVuelo = editarVuelo;
window.eliminarVuelo = eliminarVuelo;
window.guardarInstancia = guardarInstancia;
window.cancelarInstancia = cancelarInstancia;
window.editarInstancia = editarInstancia;
window.eliminarInstancia = eliminarInstancia;