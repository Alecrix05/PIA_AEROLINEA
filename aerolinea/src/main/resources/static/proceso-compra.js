// Sistema de Compra de Boletos - Proceso Completo
console.log('Cargando proceso-compra.js');

// Variables globales del proceso
window.procesoCompra = {
    vueloSeleccionado: null,
    clienteSeleccionado: null,
    asientoSeleccionado: null,
    pasajeroData: null,
    metodoPagoSeleccionado: null,
    canalVenta: 'WEB',
    reservaCreada: null
};

function inicializarModuloBusqueda() {
    console.log('Inicializando módulo de búsqueda...');
    cargarAeropuertos();
}

async function cargarAeropuertos() {
    try {
        console.log('Cargando aeropuertos...');
        const response = await fetch(`${API_BASE_URL}/aeropuertos`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const aeropuertos = await response.json();
        console.log('Aeropuertos obtenidos:', aeropuertos.length);
        
        const selectOrigen = document.getElementById('busquedaOrigen');
        const selectDestino = document.getElementById('busquedaDestino');
        
        if (selectOrigen && selectDestino) {
            selectOrigen.innerHTML = '<option value="">Cualquier origen</option>';
            selectDestino.innerHTML = '<option value="">Cualquier destino</option>';
            
            aeropuertos.forEach(aeropuerto => {
                const option1 = new Option(`${aeropuerto.nombre} (${aeropuerto.codigoIATA})`, aeropuerto.idAeropuerto);
                const option2 = new Option(`${aeropuerto.nombre} (${aeropuerto.codigoIATA})`, aeropuerto.idAeropuerto);
                
                selectOrigen.add(option1);
                selectDestino.add(option2);
            });
            
            console.log('Aeropuertos cargados correctamente');
            
            // Agregar listeners para actualización en tiempo real
            selectOrigen.addEventListener('change', actualizarDestinosDisponibles);
            selectDestino.addEventListener('change', actualizarOrigenesDisponibles);
        }
    } catch (error) {
        console.error('Error al cargar aeropuertos:', error);
        alert('Error al cargar aeropuertos: ' + error.message);
    }
}

async function buscarVuelos() {
    console.log('Buscando vuelos...');
    
    const origen = document.getElementById('busquedaOrigen').value;
    const destino = document.getElementById('busquedaDestino').value;
    const fecha = document.getElementById('busquedaFecha').value;
    
    if (!origen && !destino && !fecha) {
        alert('Seleccione al menos un criterio de búsqueda');
        return;
    }
    
    try {
        let url = 'http://localhost:8080/api/busqueda/vuelos-flexible?';
        const params = [];
        
        if (origen) params.push(`origen=${origen}`);
        if (destino) params.push(`destino=${destino}`);
        if (fecha) params.push(`fecha=${fecha}`);
        params.push('pasajeros=1');
        
        url += params.join('&');
        
        const response = await fetch(url);
        const vuelos = await response.json();
        
        mostrarResultadosVuelos(vuelos);
        
    } catch (error) {
        console.error('Error al buscar vuelos:', error);
        alert('Error al buscar vuelos');
    }
}

function mostrarResultadosVuelos(vuelos) {
    const contenedor = document.getElementById('resultadosBusqueda');
    const lista = document.getElementById('listaResultados');
    
    if (vuelos.length === 0) {
        lista.innerHTML = '<div class="alert alert-warning">No se encontraron vuelos disponibles</div>';
    } else {
        let html = `<div class="alert alert-success">Se encontraron ${vuelos.length} vuelo(s) disponible(s)</div>`;
        html += '<table class="table table-striped">';
        html += '<thead><tr><th>Vuelo</th><th>Salida</th><th>Llegada</th><th>Origen</th><th>Destino</th><th>Disponibles</th><th>Acción</th></tr></thead>';
        html += '<tbody>';
        
        vuelos.forEach(vuelo => {
            const fechaSalida = vuelo.fechaSalida ? new Date(vuelo.fechaSalida).toLocaleString('es-MX') : 'N/A';
            const fechaLlegada = vuelo.fechaLlegada ? new Date(vuelo.fechaLlegada).toLocaleString('es-MX') : 'N/A';
            
            html += `<tr>
                <td><strong>${vuelo.numeroVuelo}</strong></td>
                <td>${fechaSalida}</td>
                <td>${fechaLlegada}</td>
                <td>${vuelo.origen}</td>
                <td>${vuelo.destino}</td>
                <td><span class="badge bg-${vuelo.asientosDisponibles > 10 ? 'success' : 'warning'}">${vuelo.asientosDisponibles}/${vuelo.capacidad}</span></td>
                <td>
                    ${vuelo.asientosDisponibles > 0 ? 
                        `<button class="btn btn-primary btn-sm" onclick="seleccionarVuelo(${vuelo.idInstanciaVuelo})">
                            <i class="fas fa-plane"></i> Seleccionar
                        </button>` : 
                        '<span class="text-muted">Sin disponibilidad</span>'
                    }
                </td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        lista.innerHTML = html;
    }
    
    contenedor.style.display = 'block';
}

async function seleccionarVuelo(idInstanciaVuelo) {
    console.log('Vuelo seleccionado:', idInstanciaVuelo);
    
    try {
        // Obtener detalles del vuelo
        const response = await fetch(`http://localhost:8080/api/instancias-vuelo/${idInstanciaVuelo}`);
        const instanciaVuelo = await response.json();
        
        // Guardar vuelo seleccionado
        window.procesoCompra.vueloSeleccionado = instanciaVuelo;
        
        // Mostrar paso 2: Selección de cliente
        document.getElementById('seleccionClienteCard').style.display = 'block';
        document.getElementById('seleccionClienteCard').scrollIntoView({ behavior: 'smooth' });
        
        // Mostrar mensaje de éxito
        alert(`Vuelo ${instanciaVuelo.vuelo?.numeroVuelo} seleccionado. Ahora seleccione el cliente.`);
        
    } catch (error) {
        console.error('Error al seleccionar vuelo:', error);
        alert('Error al obtener detalles del vuelo');
    }
}

async function buscarClientes() {
    console.log('Función buscarClientes ejecutada');
    const termino = document.getElementById('buscarClienteInput').value.trim();
    console.log('Término de búsqueda:', termino);
    
    if (!termino || termino.length < 2) {
        document.getElementById('listaClientes').style.display = 'none';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const clientes = await response.json();
        console.log('Clientes obtenidos:', clientes.length);
        
        const clientesFiltrados = clientes.filter(cliente => {
            const nombre = (cliente.nombre || '').toLowerCase();
            const apellidoP = (cliente.apellidoP || '').toLowerCase();
            const apellidoM = (cliente.apellidoM || '').toLowerCase();
            const correo = (cliente.correo || '').toLowerCase();
            const telefono = (cliente.telefono || '').toLowerCase();
            const terminoBusqueda = termino.toLowerCase();
            
            return nombre.includes(terminoBusqueda) ||
                   apellidoP.includes(terminoBusqueda) ||
                   apellidoM.includes(terminoBusqueda) ||
                   correo.includes(terminoBusqueda) ||
                   telefono.includes(terminoBusqueda);
        });
        
        console.log('Clientes filtrados:', clientesFiltrados.length);
        mostrarListaClientes(clientesFiltrados);
        
    } catch (error) {
        console.error('Error al buscar clientes:', error);
        alert('Error al buscar clientes: ' + error.message);
    }
}

function mostrarListaClientes(clientes) {
    const lista = document.getElementById('listaClientes');
    
    if (clientes.length === 0) {
        lista.innerHTML = '<div class="alert alert-warning">No se encontraron clientes</div>';
    } else {
        let html = '<div class="table-responsive"><table class="table table-sm table-hover">';
        html += '<thead><tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Acción</th></tr></thead><tbody>';
        
        clientes.forEach(cliente => {
            const nombreCompleto = `${cliente.nombre} ${cliente.apellidoP} ${cliente.apellidoM || ''}`.trim();
            html += `<tr>
                <td>${nombreCompleto}</td>
                <td>${cliente.correo || 'N/A'}</td>
                <td>${cliente.telefono || 'N/A'}</td>
                <td><button class="btn btn-success btn-sm" onclick="seleccionarCliente(${cliente.idCliente}, '${nombreCompleto}')">
                    <i class="fas fa-user-check"></i> Seleccionar
                </button></td>
            </tr>`;
        });
        
        html += '</tbody></table></div>';
        lista.innerHTML = html;
    }
    
    lista.style.display = 'block';
}

async function seleccionarCliente(idCliente, nombreCliente) {
    console.log('Cliente seleccionado:', idCliente, nombreCliente);
    
    try {
        // Obtener detalles del cliente
        const response = await fetch(`http://localhost:8080/api/clientes/${idCliente}`);
        const cliente = await response.json();
        
        // Guardar cliente seleccionado
        window.procesoCompra.clienteSeleccionado = cliente;
        
        // Mostrar paso 3: Selección de asiento
        await mostrarSeleccionAsientos();
        
        alert(`Cliente ${nombreCliente} seleccionado. Ahora seleccione un asiento.`);
        
    } catch (error) {
        console.error('Error al seleccionar cliente:', error);
        alert('Error al obtener detalles del cliente');
    }
}

async function mostrarSeleccionAsientos() {
    try {
        // Obtener asientos del avión
        const idAvion = window.procesoCompra.vueloSeleccionado.avion.idAvion;
        const response = await fetch(`http://localhost:8080/api/asientos`);
        const todosAsientos = await response.json();
        
        // Filtrar asientos del avión específico
        const asientosAvion = todosAsientos.filter(asiento => asiento.avion && asiento.avion.idAvion === idAvion);
        
        // Obtener asientos ocupados para esta instancia de vuelo
        const boletosResponse = await fetch(`http://localhost:8080/api/boletos`);
        const boletos = await boletosResponse.json();
        
        const asientosOcupados = boletos
            .filter(boleto => boleto.instanciaVuelo && boleto.instanciaVuelo.idInstanciaVuelo === window.procesoCompra.vueloSeleccionado.idInstanciaVuelo)
            .map(boleto => boleto.asiento ? boleto.asiento.idAsiento : null)
            .filter(id => id !== null);
        
        mostrarMapaAsientos(asientosAvion, asientosOcupados);
        
        // Mostrar la sección de selección de asientos
        document.getElementById('seleccionAsientoCard').style.display = 'block';
        document.getElementById('seleccionAsientoCard').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error al cargar asientos:', error);
        alert('Error al cargar mapa de asientos');
    }
}

function mostrarMapaAsientos(asientos, asientosOcupados) {
    const mapa = document.getElementById('mapaAsientos');
    
    if (asientos.length === 0) {
        mapa.innerHTML = '<div class="alert alert-warning">No hay asientos configurados para este avión</div>';
        return;
    }
    
    // Agrupar asientos por fila
    const asientosPorFila = {};
    asientos.forEach(asiento => {
        if (!asientosPorFila[asiento.fila]) {
            asientosPorFila[asiento.fila] = [];
        }
        asientosPorFila[asiento.fila].push(asiento);
    });
    
    let html = '<div class="row">';
    html += '<div class="col-12 mb-3">';
    html += '<div class="d-flex gap-3 justify-content-center">';
    html += '<span><i class="fas fa-square text-success"></i> Disponible</span>';
    html += '<span><i class="fas fa-square text-danger"></i> Ocupado</span>';
    html += '<span><i class="fas fa-square text-primary"></i> Seleccionado</span>';
    html += '</div></div>';
    html += '<div class="col-12">';
    
    // Mostrar asientos por fila
    Object.keys(asientosPorFila).sort((a, b) => parseInt(a) - parseInt(b)).forEach(fila => {
        html += `<div class="mb-2"><strong>Fila ${fila}:</strong> `;
        
        asientosPorFila[fila].sort((a, b) => a.columna.localeCompare(b.columna)).forEach(asiento => {
            const ocupado = asientosOcupados.includes(asiento.idAsiento);
            const claseBtn = ocupado ? 'btn-danger' : 'btn-outline-success';
            const disabled = ocupado ? 'disabled' : '';
            
            html += `<button class="btn ${claseBtn} btn-sm me-1 mb-1 asiento-btn" 
                        data-asiento-id="${asiento.idAsiento}"
                        data-codigo="${asiento.codigoAsiento}"
                        onclick="seleccionarAsiento(${asiento.idAsiento}, '${asiento.codigoAsiento}', '${asiento.clase}')"
                        ${disabled}>
                        ${asiento.codigoAsiento}
                    </button>`;
        });
        
        html += '</div>';
    });
    
    html += '</div></div>';
    mapa.innerHTML = html;
}

function seleccionarAsiento(idAsiento, codigoAsiento, claseAsiento) {
    console.log('Asiento seleccionado:', idAsiento, codigoAsiento, claseAsiento);
    
    // Limpiar selección anterior
    document.querySelectorAll('.asiento-btn').forEach(btn => {
        if (btn.classList.contains('btn-primary')) {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-success');
        }
    });
    
    // Marcar asiento seleccionado
    const btnAsiento = document.querySelector(`[data-asiento-id="${idAsiento}"]`);
    btnAsiento.classList.remove('btn-outline-success');
    btnAsiento.classList.add('btn-primary');
    
    // Guardar asiento seleccionado
    window.procesoCompra.asientoSeleccionado = {
        idAsiento: idAsiento,
        codigo: codigoAsiento,
        clase: claseAsiento
    };
    
    // Mostrar paso 4: Datos del pasajero
    mostrarDatosPasajero();
}

function mostrarDatosPasajero() {
    // Pre-llenar con datos del cliente por defecto
    const cliente = window.procesoCompra.clienteSeleccionado;
    document.getElementById('pasajeroNombre').value = cliente.nombre;
    document.getElementById('pasajeroApellidoP').value = cliente.apellidoP;
    document.getElementById('pasajeroApellidoM').value = cliente.apellidoM || '';
    
    // Mostrar sección de datos del pasajero
    document.getElementById('datosPasajeroCard').style.display = 'block';
    document.getElementById('datosPasajeroCard').scrollIntoView({ behavior: 'smooth' });
    
    alert('Asiento seleccionado. Ahora ingrese los datos del pasajero.');
}

function copiarDatosCliente() {
    const cliente = window.procesoCompra.clienteSeleccionado;
    document.getElementById('pasajeroNombre').value = cliente.nombre;
    document.getElementById('pasajeroApellidoP').value = cliente.apellidoP;
    document.getElementById('pasajeroApellidoM').value = cliente.apellidoM || '';
    document.getElementById('pasajeroNacionalidad').value = 'Mexicana';
    
    // Establecer fecha de nacimiento por defecto (adulto)
    const fechaDefecto = new Date();
    fechaDefecto.setFullYear(fechaDefecto.getFullYear() - 30);
    document.getElementById('pasajeroFechaNacimiento').value = fechaDefecto.toISOString().split('T')[0];
}

function continuarConPasajero() {
    // Validar datos del pasajero
    const nombre = document.getElementById('pasajeroNombre').value.trim();
    const apellidoP = document.getElementById('pasajeroApellidoP').value.trim();
    const fechaNacimiento = document.getElementById('pasajeroFechaNacimiento').value;
    
    if (!nombre || !apellidoP || !fechaNacimiento) {
        alert('Complete los campos obligatorios del pasajero');
        return;
    }
    
    // Guardar datos del pasajero
    window.procesoCompra.pasajeroData = {
        nombre: nombre,
        apellidoP: apellidoP,
        apellidoM: document.getElementById('pasajeroApellidoM').value.trim(),
        fechaNacimiento: fechaNacimiento,
        nacionalidad: document.getElementById('pasajeroNacionalidad').value.trim() || 'Mexicana',
        pasaporte: document.getElementById('pasajeroPasaporte').value.trim()
    };
    
    // Mostrar paso 5: Método de pago
    mostrarMetodoPago();
}

async function mostrarMetodoPago() {
    try {
        // Cargar métodos de pago disponibles
        const response = await fetch('http://localhost:8080/api/metodos-pago');
        const metodosPago = await response.json();
        
        const select = document.getElementById('metodoPagoSelect');
        select.innerHTML = '<option value="">Seleccione un método</option>';
        
        metodosPago.forEach(metodo => {
            const option = new Option(metodo.nombre, metodo.idMetodoPago);
            select.add(option);
        });
        
        // Mostrar sección de método de pago
        document.getElementById('metodoPagoCard').style.display = 'block';
        document.getElementById('metodoPagoCard').scrollIntoView({ behavior: 'smooth' });
        
        alert('Datos del pasajero guardados. Seleccione el método de pago.');
        
    } catch (error) {
        console.error('Error al cargar métodos de pago:', error);
        alert('Error al cargar métodos de pago');
    }
}

function continuarConPago() {
    const metodoPago = document.getElementById('metodoPagoSelect').value;
    const canal = document.getElementById('canalVenta').value;
    
    if (!metodoPago) {
        alert('Seleccione un método de pago');
        return;
    }
    
    // Guardar método de pago
    window.procesoCompra.metodoPagoSeleccionado = metodoPago;
    window.procesoCompra.canalVenta = canal;
    
    // Mostrar confirmación final
    mostrarConfirmacionFinal();
}

async function mostrarConfirmacionFinal() {
    const resumen = document.getElementById('resumenCompleto');
    const vuelo = window.procesoCompra.vueloSeleccionado;
    const cliente = window.procesoCompra.clienteSeleccionado;
    const asiento = window.procesoCompra.asientoSeleccionado;
    const pasajero = window.procesoCompra.pasajeroData;
    
    // Obtener precio de la tarifa por clase
    let precioBase = 1500.00; // Precio por defecto
    try {
        const tarifaResponse = await fetch('http://localhost:8080/api/tarifas');
        const tarifas = await tarifaResponse.json();
        const tarifaClase = tarifas.find(t => t.clase === asiento.clase && t.activo);
        if (tarifaClase) {
            precioBase = tarifaClase.precioBase;
        }
    } catch (error) {
        console.error('Error al obtener tarifas:', error);
    }
    
    const impuestos = precioBase * 0.16;
    const total = precioBase + impuestos;
    
    const fechaSalida = new Date(vuelo.fechaSalida).toLocaleString('es-MX');
    const fechaLlegada = new Date(vuelo.fechaLlegada).toLocaleString('es-MX');
    const nombreCliente = `${cliente.nombre} ${cliente.apellidoP} ${cliente.apellidoM || ''}`.trim();
    const nombrePasajero = `${pasajero.nombre} ${pasajero.apellidoP} ${pasajero.apellidoM || ''}`.trim();
    
    // Obtener nombre del método de pago
    const selectMetodo = document.getElementById('metodoPagoSelect');
    const nombreMetodoPago = selectMetodo.options[selectMetodo.selectedIndex].text;
    
    let html = `
        <div class="row">
            <div class="col-md-6">
                <h5><i class="fas fa-plane"></i> Detalles del Vuelo</h5>
                <ul class="list-unstyled">
                    <li><strong>Vuelo:</strong> ${vuelo.vuelo?.numeroVuelo}</li>
                    <li><strong>Salida:</strong> ${fechaSalida}</li>
                    <li><strong>Llegada:</strong> ${fechaLlegada}</li>
                    <li><strong>Asiento:</strong> ${asiento.codigo} (${asiento.clase})</li>
                </ul>
            </div>
            <div class="col-md-6">
                <h5><i class="fas fa-user"></i> Cliente</h5>
                <ul class="list-unstyled">
                    <li><strong>Nombre:</strong> ${nombreCliente}</li>
                    <li><strong>Correo:</strong> ${cliente.correo || 'N/A'}</li>
                    <li><strong>Teléfono:</strong> ${cliente.telefono || 'N/A'}</li>
                </ul>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-6">
                <h5><i class="fas fa-user-friends"></i> Pasajero</h5>
                <ul class="list-unstyled">
                    <li><strong>Nombre:</strong> ${nombrePasajero}</li>
                    <li><strong>Fecha Nac.:</strong> ${new Date(pasajero.fechaNacimiento).toLocaleDateString('es-MX')}</li>
                    <li><strong>Nacionalidad:</strong> ${pasajero.nacionalidad}</li>
                    ${pasajero.pasaporte ? `<li><strong>Pasaporte:</strong> ${pasajero.pasaporte}</li>` : ''}
                </ul>
            </div>
            <div class="col-md-6">
                <h5><i class="fas fa-credit-card"></i> Pago y Total</h5>
                <ul class="list-unstyled">
                    <li><strong>Método:</strong> ${nombreMetodoPago}</li>
                    <li><strong>Canal:</strong> ${window.procesoCompra.canalVenta}</li>
                    <li><strong>Tarifa Base:</strong> $${precioBase.toFixed(2)}</li>
                    <li><strong>Impuestos:</strong> $${impuestos.toFixed(2)}</li>
                    <li><strong>Total:</strong> <span class="text-success fs-5">$${total.toFixed(2)}</span></li>
                </ul>
            </div>
        </div>
    `;
    
    resumen.innerHTML = html;
    
    // Mostrar confirmación final
    document.getElementById('confirmacionFinalCard').style.display = 'block';
    document.getElementById('confirmacionFinalCard').scrollIntoView({ behavior: 'smooth' });
    
    alert('Revise todos los detalles antes de confirmar la compra.');
}

async function procesarCompraFinal() {
    console.log('Procesando compra final...');
    
    try {
        const vuelo = window.procesoCompra.vueloSeleccionado;
        const cliente = window.procesoCompra.clienteSeleccionado;
        const asiento = window.procesoCompra.asientoSeleccionado;
        const pasajeroData = window.procesoCompra.pasajeroData;
        const metodoPago = window.procesoCompra.metodoPagoSeleccionado;
        const canal = window.procesoCompra.canalVenta;
        
        console.log('Datos completos del proceso:', {
            vuelo: vuelo.idInstanciaVuelo,
            cliente: cliente.idCliente,
            asiento: asiento.idAsiento,
            pasajero: pasajeroData,
            metodoPago: metodoPago,
            canal: canal
        });
        
        // 1. Crear pasajero con los datos ingresados
        const pasajero = await crearPasajeroCompleto(pasajeroData, cliente.idCliente);
        console.log('Pasajero creado:', pasajero);
        
        // 2. Crear reserva
        const reserva = await crearReserva(cliente.idCliente);
        console.log('Reserva creada:', reserva);
        
        // 3. Crear boleto
        const boleto = await crearBoleto(pasajero.idPasajero, reserva.idReserva, vuelo.idInstanciaVuelo, asiento.idAsiento);
        console.log('Boleto creado:', boleto);
        
        // 4. Crear venta con método de pago seleccionado
        const precioBase = boleto.precio || 1500.00;
        const totalConImpuestos = precioBase * 1.16;
        const venta = await crearVentaCompleta(cliente.idCliente, totalConImpuestos, metodoPago, canal);
        console.log('Venta creada:', venta);
        
        // 5. Crear detalles de venta para cada boleto
        for (const boletoCreado of [boleto]) {
            // Usar el precio real del boleto creado
            const precioReal = boletoCreado.precio || 1500.00;
            await crearVentaDetalle(venta.idVenta, boletoCreado.idBoleto, precioReal);
        }
        
        // 6. Mostrar resultado exitoso
        mostrarResultadoExitoso(reserva, boleto, venta);
        
    } catch (error) {
        console.error('Error al procesar compra:', error);
        alert('Error al procesar la compra: ' + error.message);
    }
}

async function crearPasajeroCompleto(pasajeroData, idCliente) {
    try {
        console.log('Creando pasajero con datos completos:', pasajeroData);
        
        const nuevoPasajero = {
            nombre: pasajeroData.nombre,
            apellidoP: pasajeroData.apellidoP,
            apellidoM: pasajeroData.apellidoM || '',
            fechaNacimiento: pasajeroData.fechaNacimiento,
            nacionalidad: pasajeroData.nacionalidad || 'Mexicana',
            pasaporte: pasajeroData.pasaporte || null,
            cliente: { idCliente: idCliente }
        };
        
        console.log('Enviando datos del pasajero:', nuevoPasajero);
        
        const response = await fetch('http://localhost:8080/api/pasajeros/con-pasaporte', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoPasajero)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error al crear pasajero:', errorText);
            throw new Error(`Error al crear pasajero: ${response.status} - ${errorText}`);
        }
        
        const pasajero = await response.json();
        console.log('Pasajero creado exitosamente:', pasajero);
        return pasajero;
        
    } catch (error) {
        console.error('Error en crearPasajeroCompleto:', error);
        throw new Error('Error al crear pasajero: ' + error.message);
    }
}

async function crearReserva(idCliente) {
    try {
        const reservaData = {
            codigoReserva: `RES-${Date.now()}`,
            fechaReserva: new Date().toISOString().split('T')[0],
            estado: 'CONFIRMADA',
            cliente: { idCliente: idCliente }
        };
        
        const response = await fetch('http://localhost:8080/api/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservaData)
        });
        
        if (!response.ok) {
            throw new Error('Error al crear reserva');
        }
        
        return await response.json();
    } catch (error) {
        throw new Error('Error al crear reserva: ' + error.message);
    }
}

async function crearBoleto(idPasajero, idReserva, idInstanciaVuelo, idAsiento) {
    try {
        const claseAsiento = window.procesoCompra.asientoSeleccionado.clase;
        
        // Usar fecha actual del servidor (hoy)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Asegurar que sea inicio del día
        const fechaEmision = hoy.toISOString().split('T')[0];
        
        const boletoData = {
            numeroBoleto: `BLT-${Date.now()}`,
            fechaEmision: fechaEmision,
            // El precio se obtendrá de la tarifa por clase
            precio: 0, // Se actualizará después
            clase: claseAsiento,
            estado: 'EMITIDO',
            pasajero: { idPasajero: idPasajero },
            reserva: { idReserva: idReserva },
            instanciaVuelo: { idInstanciaVuelo: idInstanciaVuelo },
            asiento: { idAsiento: idAsiento }
        };
        
        console.log('Creando boleto con datos:', JSON.stringify(boletoData, null, 2));
        
        // Obtener precio de tarifa por clase
        const tarifaResponse = await fetch('http://localhost:8080/api/tarifas');
        const tarifas = await tarifaResponse.json();
        const tarifaClase = tarifas.find(t => t.clase === claseAsiento && t.activo);
        
        if (tarifaClase) {
            boletoData.precio = tarifaClase.precioBase;
        } else {
            // Precio por defecto si no se encuentra tarifa
            boletoData.precio = claseAsiento === 'Ejecutiva' ? 2500.00 : 
                               claseAsiento === 'Primera' ? 4000.00 : 1500.00;
        }
        
        const response = await fetch('http://localhost:8080/api/boletos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(boletoData)
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response body:', errorText);
            throw new Error(`Error HTTP ${response.status}: ${errorText}`);
        }
        
        const boleto = await response.json();
        console.log('Boleto creado exitosamente:', boleto);
        return boleto;
        
    } catch (error) {
        console.error('Error completo al crear boleto:', error);
        throw new Error('Error al crear boleto: ' + error.message);
    }
}

async function crearVentaDetalle(idVenta, idBoleto, precio) {
    try {
        const precioBase = precio;
        const impuestos = precioBase * 0.16;
        const subtotal = precioBase + impuestos;
        
        const detalleData = {
            precioUnitario: precioBase,
            impuestos: impuestos,
            subtotal: subtotal,
            venta: { idVenta: idVenta },
            boleto: { idBoleto: idBoleto }
        };
        
        console.log('Creando detalle de venta:', detalleData);
        
        const response = await fetch('http://localhost:8080/api/venta-detalle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(detalleData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al crear detalle: ${response.status} - ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en crearVentaDetalle:', error);
        throw new Error('Error al crear detalle de venta: ' + error.message);
    }
}

async function crearVentaCompleta(idCliente, total, idMetodoPago, canal) {
    try {
        // Obtener el nombre del método de pago
        const metodoResponse = await fetch(`http://localhost:8080/api/metodos-pago/${idMetodoPago}`);
        const metodoPago = await metodoResponse.json();
        
        const ventaData = {
            fechaVenta: new Date().toISOString().split('T')[0],
            total: total,
            formaPago: metodoPago.nombre || 'TARJETA_CREDITO',
            canalVenta: canal,
            estadoVenta: 'COMPLETADA',
            cliente: { idCliente: idCliente }
        };
        
        console.log('Creando venta con datos:', ventaData);
        
        const response = await fetch('http://localhost:8080/api/ventas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ventaData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al crear venta: ${response.status} - ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en crearVentaCompleta:', error);
        throw new Error('Error al crear venta: ' + error.message);
    }
}

function mostrarResultadoExitoso(reserva, boleto, venta) {
    const detalles = document.getElementById('detallesBoleto');
    const vuelo = window.procesoCompra.vueloSeleccionado;
    const cliente = window.procesoCompra.clienteSeleccionado;
    const asiento = window.procesoCompra.asientoSeleccionado;
    
    const fechaSalida = new Date(vuelo.fechaSalida).toLocaleString('es-MX');
    const nombreCliente = `${cliente.nombre} ${cliente.apellidoP} ${cliente.apellidoM || ''}`.trim();
    
    let html = `
        <div class="alert alert-success">
            <h4><i class="fas fa-check-circle"></i> ¡Reserva Confirmada Exitosamente!</h4>
        </div>
        <div class="row">
            <div class="col-md-6">
                <h5><i class="fas fa-ticket-alt"></i> Información del Boleto</h5>
                <ul class="list-unstyled">
                    <li><strong>Número de Boleto:</strong> ${boleto.numeroBoleto}</li>
                    <li><strong>Código de Reserva:</strong> ${reserva.codigoReserva}</li>
                    <li><strong>Fecha de Emisión:</strong> ${new Date(boleto.fechaEmision).toLocaleDateString('es-MX')}</li>
                    <li><strong>Estado:</strong> <span class="badge bg-success">${boleto.estado}</span></li>
                </ul>
            </div>
            <div class="col-md-6">
                <h5><i class="fas fa-plane"></i> Detalles del Vuelo</h5>
                <ul class="list-unstyled">
                    <li><strong>Vuelo:</strong> ${vuelo.vuelo?.numeroVuelo}</li>
                    <li><strong>Pasajero:</strong> ${nombreCliente}</li>
                    <li><strong>Asiento:</strong> ${asiento.codigo} (${asiento.clase})</li>
                    <li><strong>Salida:</strong> ${fechaSalida}</li>
                </ul>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <h5><i class="fas fa-receipt"></i> Resumen de Pago</h5>
                <ul class="list-unstyled">
                    <li><strong>Total Pagado:</strong> <span class="text-success fs-5">$${venta.total.toFixed(2)}</span></li>
                    <li><strong>Método de Pago:</strong> ${venta.formaPago}</li>
                    <li><strong>Estado de Pago:</strong> <span class="badge bg-success">${venta.estadoVenta}</span></li>
                </ul>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-12">
                <h5><i class="fas fa-print"></i> Documentos</h5>
                <div class="d-flex gap-3 flex-wrap">
                    <button class="btn btn-primary" onclick="imprimirTicketCompra(${venta.idVenta})">
                        <i class="fas fa-receipt"></i> Imprimir Ticket de Compra
                    </button>
                    <button class="btn btn-success" onclick="imprimirPaseAbordar(${boleto.idBoleto})">
                        <i class="fas fa-plane"></i> Imprimir Pase de Abordar
                    </button>
                </div>
                <small class="text-muted mt-2 d-block">
                    <i class="fas fa-info-circle"></i> Los documentos se abrirán en una nueva ventana como archivos PDF
                </small>
            </div>
        </div>
    `;
    
    detalles.innerHTML = html;
    
    // Mostrar resultado final
    document.getElementById('resultadoFinalCard').style.display = 'block';
    document.getElementById('resultadoFinalCard').scrollIntoView({ behavior: 'smooth' });
}

function cancelarProceso() {
    if (confirm('¿Está seguro de que desea cancelar el proceso de compra?')) {
        nuevaCompra();
    }
}

function nuevaCompra() {
    // Limpiar variables del proceso
    window.procesoCompra = {
        vueloSeleccionado: null,
        clienteSeleccionado: null,
        asientoSeleccionado: null,
        pasajeroData: null,
        metodoPagoSeleccionado: null,
        canalVenta: 'WEB',
        reservaCreada: null
    };
    
    // Limpiar formularios
    document.getElementById('formBusquedaVuelos').reset();
    document.getElementById('buscarClienteInput').value = '';
    document.getElementById('formPasajero').reset();
    document.getElementById('metodoPagoSelect').selectedIndex = 0;
    document.getElementById('canalVenta').selectedIndex = 0;
    
    // Ocultar todas las secciones del proceso
    document.getElementById('resultadosBusqueda').style.display = 'none';
    document.getElementById('seleccionClienteCard').style.display = 'none';
    document.getElementById('seleccionAsientoCard').style.display = 'none';
    document.getElementById('datosPasajeroCard').style.display = 'none';
    document.getElementById('metodoPagoCard').style.display = 'none';
    document.getElementById('confirmacionFinalCard').style.display = 'none';
    document.getElementById('resultadoFinalCard').style.display = 'none';
    document.getElementById('listaClientes').style.display = 'none';
    
    // Scroll al inicio
    document.querySelector('h2').scrollIntoView({ behavior: 'smooth' });
    
    alert('Proceso reiniciado. Puede realizar una nueva búsqueda.');
}

// Funciones de impresión
function imprimirTicketCompra(idVenta) {
    console.log('Imprimiendo ticket de compra para venta:', idVenta);
    
    try {
        const url = `http://localhost:8080/api/compra/ticket/${idVenta}`;
        window.open(url, '_blank');
        
        // Mostrar mensaje de confirmación
        setTimeout(() => {
            alert('El ticket de compra se está generando. Se abrirá en una nueva ventana.');
        }, 500);
        
    } catch (error) {
        console.error('Error al generar ticket:', error);
        alert('Error al generar el ticket de compra');
    }
}

function imprimirPaseAbordar(idBoleto) {
    console.log('Imprimiendo pase de abordar para boleto:', idBoleto);
    
    try {
        const url = `http://localhost:8080/api/compra/pase-abordar/${idBoleto}`;
        window.open(url, '_blank');
        
        // Mostrar mensaje de confirmación
        setTimeout(() => {
            alert('El pase de abordar se está generando. Se abrirá en una nueva ventana.');
        }, 500);
        
    } catch (error) {
        console.error('Error al generar pase de abordar:', error);
        alert('Error al generar el pase de abordar');
    }
}

// Funciones globales para campos dependientes
window.actualizarDestinosDisponibles = actualizarDestinosDisponibles;
window.actualizarOrigenesDisponibles = actualizarOrigenesDisponibles;
window.configurarBusquedaClientesTiempoReal = configurarBusquedaClientesTiempoReal;

// Exponer funciones globalmente
window.inicializarModuloBusqueda = inicializarModuloBusqueda;
window.buscarVuelos = buscarVuelos;
window.seleccionarVuelo = seleccionarVuelo;
window.buscarClientes = buscarClientes;
window.seleccionarCliente = seleccionarCliente;
window.seleccionarAsiento = seleccionarAsiento;
window.copiarDatosCliente = copiarDatosCliente;
window.continuarConPasajero = continuarConPasajero;
window.continuarConPago = continuarConPago;
window.procesarCompraFinal = procesarCompraFinal;
window.cancelarProceso = cancelarProceso;
window.nuevaCompra = nuevaCompra;
window.imprimirTicketCompra = imprimirTicketCompra;
window.imprimirPaseAbordar = imprimirPaseAbordar;

// Función para convertir automáticamente a mayúsculas
function initializeUppercaseInputs() {
    // Seleccionar todos los inputs de texto excepto los que tienen data-no-uppercase
    const inputs = document.querySelectorAll('input[type="text"]:not([data-no-uppercase]), textarea:not([data-no-uppercase])');
    
    inputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const cursorPosition = e.target.selectionStart;
            const value = e.target.value.toUpperCase();
            e.target.value = value;
            e.target.setSelectionRange(cursorPosition, cursorPosition);
        });
    });
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', initializeUppercaseInputs);

// Reinicializar cuando se cambia de sección (para inputs dinámicos)
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            initializeUppercaseInputs();
        }
    });
});

// Observar cambios en el DOM
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Funciones para campos dependientes
function actualizarDestinosDisponibles() {
    const origenSeleccionado = document.getElementById('busquedaOrigen').value;
    const selectDestino = document.getElementById('busquedaDestino');
    
    // Habilitar todas las opciones primero
    Array.from(selectDestino.options).forEach(option => {
        option.disabled = false;
        option.style.display = 'block';
    });
    
    // Si hay origen seleccionado, deshabilitar esa opción en destino
    if (origenSeleccionado) {
        Array.from(selectDestino.options).forEach(option => {
            if (option.value === origenSeleccionado) {
                option.disabled = true;
                option.style.display = 'none';
            }
        });
        
        // Si el destino actual es igual al origen, limpiarlo
        if (selectDestino.value === origenSeleccionado) {
            selectDestino.value = '';
        }
    }
}

function actualizarOrigenesDisponibles() {
    const destinoSeleccionado = document.getElementById('busquedaDestino').value;
    const selectOrigen = document.getElementById('busquedaOrigen');
    
    // Habilitar todas las opciones primero
    Array.from(selectOrigen.options).forEach(option => {
        option.disabled = false;
        option.style.display = 'block';
    });
    
    // Si hay destino seleccionado, deshabilitar esa opción en origen
    if (destinoSeleccionado) {
        Array.from(selectOrigen.options).forEach(option => {
            if (option.value === destinoSeleccionado) {
                option.disabled = true;
                option.style.display = 'none';
            }
        });
        
        // Si el origen actual es igual al destino, limpiarlo
        if (selectOrigen.value === destinoSeleccionado) {
            selectOrigen.value = '';
        }
    }
}

// Búsqueda de clientes en tiempo real
function configurarBusquedaClientesTiempoReal() {
    const inputBusqueda = document.getElementById('buscarClienteInput');
    if (inputBusqueda) {
        let timeoutId;
        inputBusqueda.addEventListener('input', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                buscarClientes();
            }, 300); // Buscar después de 300ms de inactividad
        });
    }
}

// Configurar campos dependientes cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        configurarBusquedaClientesTiempoReal();
    }, 1000);
});

console.log('proceso-compra.js cargado correctamente');