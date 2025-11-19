// ============================================
// MÓDULO UNIFICADO: BÚSQUEDA Y VENTA
// Incluye: Búsqueda de vuelos y proceso de venta
// ============================================

function inicializarModuloBusqueda() {
    console.log('Inicializando módulo de búsqueda');
    cargarAeropuertosBusqueda();
}

async function cargarAeropuertosBusqueda() {
    console.log('Cargando aeropuertos...');
    try {
        const response = await fetch(`${API_BASE_URL}/aeropuertos`);
        console.log('Response aeropuertos:', response);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const aeropuertos = await response.json();
        console.log('Aeropuertos cargados:', aeropuertos);
        
        const selectOrigen = document.getElementById('busquedaOrigen');
        const selectDestino = document.getElementById('busquedaDestino');
        
        if (selectOrigen && selectDestino) {
            selectOrigen.innerHTML = '<option value="">Cualquier origen</option>';
            selectDestino.innerHTML = '<option value="">Cualquier destino</option>';
            
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
            console.log('Aeropuertos agregados a los selects');
        } else {
            console.error('No se encontraron los elementos select');
        }
    } catch (error) {
        console.error('Error al cargar aeropuertos:', error);
        showAlert('error', 'Error al cargar aeropuertos: ' + error.message);
    }
}

async function buscarVuelos() {
    console.log('=== BUSCAR VUELOS ===');
    
    const origen = document.getElementById('busquedaOrigen')?.value || '';
    const destino = document.getElementById('busquedaDestino')?.value || '';
    const fecha = document.getElementById('busquedaFecha')?.value || '';
    
    console.log('Valores obtenidos:', { origen, destino, fecha });
    
    // Validar que al menos un criterio esté seleccionado
    if (!origen && !destino && !fecha) {
        console.log('No hay criterios de búsqueda');
        alert('Debe seleccionar al menos un criterio de búsqueda (origen, destino o fecha)');
        return;
    }
    
    console.log('Validación pasada, continuando...');
    
    // Si ambos origen y destino están seleccionados, validar que sean diferentes
    if (origen && destino && origen === destino) {
        showAlert('error', 'El aeropuerto de origen y destino deben ser diferentes');
        return;
    }
    
    // Si hay fecha, validar que no sea en el pasado
    if (fecha) {
        const fechaSeleccionada = new Date(fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        if (fechaSeleccionada < hoy) {
            showAlert('error', 'La fecha de viaje no puede ser en el pasado');
            return;
        }
    }
    
    try {
        // Construir URL de búsqueda con parámetros opcionales
        let url = `${API_BASE_URL}/busqueda/vuelos-flexible?`;
        const params = [];
        
        if (origen) params.push(`origen=${origen}`);
        if (destino) params.push(`destino=${destino}`);
        if (fecha) params.push(`fecha=${fecha}`);
        params.push('pasajeros=1');
        
        url += params.join('&');
        
        console.log('URL de búsqueda:', url);
        
        const response = await fetch(url);
        console.log('Response:', response);
        
        if (!response.ok) {
            console.error('Error en response:', response.status, response.statusText);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const vuelos = await response.json();
        console.log('Vuelos encontrados:', vuelos);
        mostrarResultadosBusqueda(vuelos, { origen, destino, fecha });
        
    } catch (error) {
        console.error('Error al buscar vuelos:', error);
        showAlert('error', 'Error al buscar vuelos. Intente nuevamente.');
    }
}

function mostrarResultadosBusqueda(vuelos, criterios = {}) {
    console.log('=== MOSTRAR RESULTADOS ===');
    console.log('Vuelos recibidos:', vuelos);
    console.log('Criterios:', criterios);
    
    const contenedor = document.getElementById('resultadosBusqueda');
    const listaResultados = document.getElementById('listaResultados');
    
    console.log('Contenedor encontrado:', contenedor);
    console.log('Lista resultados encontrada:', listaResultados);
    
    // Mostrar criterios de búsqueda utilizados
    let criteriosTexto = [];
    if (criterios.origen) {
        const origenSelect = document.getElementById('busquedaOrigen');
        const origenTexto = origenSelect.options[origenSelect.selectedIndex].text;
        criteriosTexto.push(`Origen: ${origenTexto}`);
    }
    if (criterios.destino) {
        const destinoSelect = document.getElementById('busquedaDestino');
        const destinoTexto = destinoSelect.options[destinoSelect.selectedIndex].text;
        criteriosTexto.push(`Destino: ${destinoTexto}`);
    }
    if (criterios.fecha) {
        const fechaFormateada = new Date(criterios.fecha).toLocaleDateString('es-MX');
        criteriosTexto.push(`Fecha: ${fechaFormateada}`);
    }
    
    const infoCriterios = criteriosTexto.length > 0 ? 
        `<div class="alert alert-info mb-3">
            <i class="fas fa-search"></i> <strong>Búsqueda por:</strong> ${criteriosTexto.join(' | ')}
        </div>` : '';
    
    if (vuelos.length === 0) {
        listaResultados.innerHTML = `
            <div class="alert alert-warning">
                <h4>No se encontraron vuelos</h4>
                <p>No se encontraron vuelos disponibles para los criterios seleccionados.</p>
            </div>
        `;
        contenedor.style.display = 'block';
        contenedor.style.visibility = 'visible';
        contenedor.scrollIntoView({ behavior: 'smooth' });
        console.log('No se encontraron vuelos, mostrando mensaje');
        return;
    }
    
    // Mostrar información de criterios utilizados
    let criteriosTexto = [];
    if (criterios.origen) {
        const origenSelect = document.getElementById('busquedaOrigen');
        const origenTexto = origenSelect.options[origenSelect.selectedIndex].text;
        criteriosTexto.push(`Origen: ${origenTexto}`);
    }
    if (criterios.destino) {
        const destinoSelect = document.getElementById('busquedaDestino');
        const destinoTexto = destinoSelect.options[destinoSelect.selectedIndex].text;
        criteriosTexto.push(`Destino: ${destinoTexto}`);
    }
    if (criterios.fecha) {
        const fechaFormateada = new Date(criterios.fecha).toLocaleDateString('es-MX');
        criteriosTexto.push(`Fecha: ${fechaFormateada}`);
    }
    
    const infoCriterios = criteriosTexto.length > 0 ? 
        `<div class="alert alert-info mb-3">
            <i class="fas fa-search"></i> <strong>Búsqueda por:</strong> ${criteriosTexto.join(' | ')}
        </div>` : '';
    
    let html = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Vuelo</th>
                    <th>Salida</th>
                    <th>Llegada</th>
                    <th>Duración</th>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Asientos Disponibles</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    vuelos.forEach(vuelo => {
        const fechaSalida = vuelo.fechaSalida ? new Date(vuelo.fechaSalida).toLocaleString('es-MX') : 'N/A';
        const fechaLlegada = vuelo.fechaLlegada ? new Date(vuelo.fechaLlegada).toLocaleString('es-MX') : 'N/A';
        
        html += `
            <tr>
                <td><strong>${vuelo.numeroVuelo}</strong></td>
                <td>${fechaSalida}</td>
                <td>${fechaLlegada}</td>
                <td>${vuelo.duracion || 'N/A'}</td>
                <td>${vuelo.origen}</td>
                <td>${vuelo.destino}</td>
                <td>
                    <span class="badge bg-${vuelo.asientosDisponibles > 10 ? 'success' : vuelo.asientosDisponibles > 0 ? 'warning' : 'danger'}">
                        ${vuelo.asientosDisponibles}/${vuelo.capacidad}
                    </span>
                </td>
                <td>
                    ${vuelo.asientosDisponibles > 0 ? 
                        `<button class="btn btn-primary btn-sm" onclick="seleccionarVuelo(${vuelo.idInstanciaVuelo})">
                            <i class="fas fa-plane"></i> Seleccionar
                        </button>` : 
                        '<span class="text-muted">Sin disponibilidad</span>'
                    }
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    listaResultados.innerHTML = infoCriterios + html;
    
    vuelos.forEach(vuelo => {
        const fechaSalida = vuelo.fechaSalida ? new Date(vuelo.fechaSalida).toLocaleString('es-MX') : 'N/A';
        const fechaLlegada = vuelo.fechaLlegada ? new Date(vuelo.fechaLlegada).toLocaleString('es-MX') : 'N/A';
        
        html += `
            <tr>
                <td><strong>${vuelo.numeroVuelo}</strong></td>
                <td>${fechaSalida}</td>
                <td>${fechaLlegada}</td>
                <td>${vuelo.duracion || 'N/A'}</td>
                <td>${vuelo.origen}</td>
                <td>${vuelo.destino}</td>
                <td>
                    <span class="badge bg-${vuelo.asientosDisponibles > 10 ? 'success' : vuelo.asientosDisponibles > 0 ? 'warning' : 'danger'}">
                        ${vuelo.asientosDisponibles}/${vuelo.capacidad}
                    </span>
                </td>
                <td>
                    ${vuelo.asientosDisponibles > 0 ? 
                        `<button class="btn btn-primary btn-sm" onclick="seleccionarVuelo(${vuelo.idInstanciaVuelo})">
                            <i class="fas fa-plane"></i> Seleccionar
                        </button>` : 
                        '<span class="text-muted">Sin disponibilidad</span>'
                    }
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    contenedor.style.display = 'block';
    contenedor.style.visibility = 'visible';
    contenedor.scrollIntoView({ behavior: 'smooth' });
    
    console.log('Tabla de vuelos mostrada correctamente');
}

async function seleccionarVuelo(idInstanciaVuelo) {
    try {
        const response = await fetch(`${API_BASE_URL}/instancias-vuelo/${idInstanciaVuelo}`);
        if (!response.ok) throw new Error('Error al obtener información del vuelo');
        
        const instanciaVuelo = await response.json();
        
        showAlert('success', `Vuelo ${instanciaVuelo.vuelo?.numeroVuelo} seleccionado. Proceda a buscar el cliente.`);
        
        window.instanciaVueloSeleccionada = idInstanciaVuelo;
        
        document.getElementById('seleccionClienteCard').style.display = 'block';
        document.getElementById('seleccionClienteCard').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error al seleccionar vuelo:', error);
        showAlert('error', 'Error al seleccionar el vuelo');
    }
}

async function guardarClienteYProcesarCompra(event) {
    event.preventDefault();
    
    if (!window.instanciaVueloSeleccionada) {
        showAlert('error', 'Debe seleccionar un vuelo primero');
        return;
    }
    
    // Obtener datos del formulario
    const nombre = document.getElementById('clienteNombre').value.trim();
    const apellidoP = document.getElementById('clienteApellidoP').value.trim();
    const apellidoM = document.getElementById('clienteApellidoM').value.trim();
    const correo = document.getElementById('clienteCorreo').value.trim();
    const telefono = document.getElementById('clienteTelefono').value.trim();
    const calle = document.getElementById('clienteCalle').value.trim();
    const numero = document.getElementById('clienteNumero').value.trim();
    const colonia = document.getElementById('clienteColonia').value.trim();
    const ciudad = document.getElementById('clienteCiudad').value.trim();
    const estado = document.getElementById('clienteEstado').value.trim();
    const codigoPostal = document.getElementById('clienteCodigoPostal').value.trim();
    
    // Validaciones básicas
    if (!nombre || !apellidoP || !correo) {
        showAlert('error', 'Los campos Nombre, Apellido Paterno y Correo son obligatorios');
        return;
    }
    
    const validacionCorreo = validarEmail(correo, 'Correo Electrónico');
    if (!validacionCorreo.valido) {
        showAlert('error', validacionCorreo.mensaje);
        return;
    }
    
    try {
        // 1. Crear o buscar cliente
        const cliente = {
            nombre,
            apellidoP,
            apellidoM,
            correo,
            telefono,
            calle,
            numero,
            colonia,
            ciudad,
            estado,
            codigoPostal
        };
        
        const clienteResponse = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
        
        if (!clienteResponse.ok) {
            throw new Error('Error al registrar cliente');
        }
        
        const clienteCreado = await clienteResponse.json();
        
        // 2. Crear pasajero (mismo que el cliente por simplicidad)
        const pasajero = {
            nombre,
            apellidoP,
            apellidoM,
            fechaNacimiento: null, // Se puede agregar al formulario si se necesita
            nacionalidad: 'Mexicana',
            pasaporte: null,
            cliente: { idCliente: clienteCreado.idCliente }
        };
        
        const pasajeroResponse = await fetch(`${API_BASE_URL}/pasajeros`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pasajero)
        });
        
        if (!pasajeroResponse.ok) {
            throw new Error('Error al registrar pasajero');
        }
        
        const pasajeroCreado = await pasajeroResponse.json();
        
        // 3. Procesar compra usando el endpoint de compra
        const compraData = {
            idCliente: clienteCreado.idCliente,
            idInstanciaVuelo: window.instanciaVueloSeleccionada,
            idMetodoPago: 1, // Asumimos método de pago por defecto
            pasajeros: [
                {
                    idPasajero: pasajeroCreado.idPasajero,
                    clase: 'Económica',
                    asiento: 'AUTO' // El sistema asignará automáticamente
                }
            ]
        };
        
        const compraResponse = await fetch(`${API_BASE_URL}/compra/procesar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(compraData)
        });
        
        if (!compraResponse.ok) {
            throw new Error('Error al procesar la compra');
        }
        
        const resultado = await compraResponse.json();
        
        // 4. Mostrar resultado exitoso
        mostrarResultadoCompra(resultado);
        
        // 5. Limpiar formularios
        resetClienteForm();
        
    } catch (error) {
        console.error('Error en el proceso de compra:', error);
        showAlert('error', 'Error al procesar la compra: ' + error.message);
    }
}

function mostrarResultadoCompra(resultado) {
    let mensaje = `
        <div class="alert alert-success">
            <h4><i class="fas fa-check-circle"></i> ¡Compra Exitosa!</h4>
            <p><strong>Código de Reserva:</strong> ${resultado.reserva}</p>
            <p><strong>Total:</strong> $${resultado.total?.toFixed(2) || '0.00'}</p>
    `;
    
    if (resultado.boletos && resultado.boletos.length > 0) {
        mensaje += '<h5>Boletos Generados:</h5><ul>';
        resultado.boletos.forEach(boleto => {
            mensaje += `
                <li>
                    <strong>${boleto.numeroBoleto}</strong> - 
                    ${boleto.pasajero} - 
                    Asiento: ${boleto.asiento} - 
                    $${boleto.precio?.toFixed(2) || '0.00'}
                </li>
            `;
        });
        mensaje += '</ul>';
    }
    
    mensaje += '</div>';
    
    // Mostrar el mensaje en la parte superior de la página
    const contenedor = document.createElement('div');
    contenedor.innerHTML = mensaje;
    contenedor.style.position = 'fixed';
    contenedor.style.top = '20px';
    contenedor.style.left = '50%';
    contenedor.style.transform = 'translateX(-50%)';
    contenedor.style.zIndex = '9999';
    contenedor.style.maxWidth = '600px';
    
    document.body.appendChild(contenedor);
    
    // Remover el mensaje después de 10 segundos
    // Agregar botón para nueva compra
    const botonNuevaCompra = document.createElement('button');
    botonNuevaCompra.className = 'btn btn-primary mt-3';
    botonNuevaCompra.innerHTML = '<i class="fas fa-plus"></i> Nueva Compra';
    botonNuevaCompra.onclick = () => {
        contenedor.remove();
        resetClienteForm();
    };
    
    const alertDiv = contenedor.querySelector('.alert');
    alertDiv.appendChild(botonNuevaCompra);
    
    setTimeout(() => {
        contenedor.remove();
    }, 15000);
}

function resetClienteForm() {
    document.getElementById('formBusquedaVuelos').reset();
    window.instanciaVueloSeleccionada = null;
    window.clienteSeleccionado = null;
    window.asientoSeleccionado = null;
    document.getElementById('resultadosBusqueda').style.display = 'none';
    document.getElementById('seleccionClienteCard').style.display = 'none';
    document.getElementById('seleccionAsientoCard').style.display = 'none';
    document.getElementById('datosPasajeroCard').style.display = 'none';
    document.getElementById('metodoPagoCard').style.display = 'none';
    document.getElementById('confirmacionFinalCard').style.display = 'none';
    document.getElementById('resultadoFinalCard').style.display = 'none';
    
    // Limpiar también el input y lista de clientes
    const inputBusqueda = document.getElementById('buscarClienteInput');
    const listaClientes = document.getElementById('listaClientes');
    if (inputBusqueda) inputBusqueda.value = '';
    if (listaClientes) {
        listaClientes.innerHTML = '';
        listaClientes.style.display = 'none';
    }
}

async function buscarClientes() {
    console.log('=== BUSCAR CLIENTES ===');
    
    const input = document.getElementById('buscarClienteInput');
    console.log('Input encontrado:', input);
    
    if (!input) {
        console.error('No se encontró el input buscarClienteInput');
        showAlert('error', 'Error: No se encontró el campo de búsqueda');
        return;
    }
    
    const termino = input.value.trim();
    console.log('Término de búsqueda:', termino);
    
    if (!termino) {
        showAlert('error', 'Ingrese un término de búsqueda');
        return;
    }
    
    try {
        console.log('Haciendo petición a:', `${API_BASE_URL}/clientes`);
        const response = await fetch(`${API_BASE_URL}/clientes`);
        console.log('Response:', response);
        
        if (!response.ok) throw new Error('Error al buscar clientes');
        
        const clientes = await response.json();
        console.log('Clientes obtenidos:', clientes.length);
        
        const clientesFiltrados = clientes.filter(cliente => 
            cliente.nombre.toLowerCase().includes(termino.toLowerCase()) ||
            cliente.apellidoP.toLowerCase().includes(termino.toLowerCase()) ||
            cliente.correo.toLowerCase().includes(termino.toLowerCase())
        );
        
        console.log('Clientes filtrados:', clientesFiltrados.length);
        mostrarListaClientes(clientesFiltrados);
        
    } catch (error) {
        console.error('Error al buscar clientes:', error);
        showAlert('error', 'Error al buscar clientes: ' + error.message);
    }
}

function mostrarListaClientes(clientes) {
    console.log('=== MOSTRAR LISTA CLIENTES ===');
    
    const lista = document.getElementById('listaClientes');
    console.log('Lista elemento encontrado:', lista);
    
    if (!lista) {
        console.error('No se encontró el elemento listaClientes');
        showAlert('error', 'Error: No se encontró el contenedor de la lista');
        return;
    }
    
    if (clientes.length === 0) {
        lista.innerHTML = '<div class="alert alert-warning">No se encontraron clientes</div>';
        lista.style.display = 'block';
        console.log('No se encontraron clientes');
        return;
    }
    
    let html = '<div class="table-responsive"><table class="table table-hover"><thead><tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Acción</th></tr></thead><tbody>';
    
    clientes.forEach(cliente => {
        html += `
            <tr>
                <td>${cliente.nombre} ${cliente.apellidoP} ${cliente.apellidoM || ''}</td>
                <td>${cliente.correo}</td>
                <td>${cliente.telefono || 'N/A'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="seleccionarCliente(${cliente.idCliente})">
                        <i class="fas fa-check"></i> Seleccionar
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    lista.innerHTML = html;
    lista.style.display = 'block';
    console.log('Lista de clientes mostrada correctamente');
}

function seleccionarCliente(idCliente) {
    window.clienteSeleccionado = idCliente;
    showAlert('success', 'Cliente seleccionado correctamente');
    
    document.getElementById('seleccionAsientoCard').style.display = 'block';
    document.getElementById('seleccionAsientoCard').scrollIntoView({ behavior: 'smooth' });
    
    if (window.instanciaVueloSeleccionada) {
        cargarMapaAsientos(window.instanciaVueloSeleccionada);
    }
}

async function cargarMapaAsientos(idInstanciaVuelo) {
    try {
        const response = await fetch(`${API_BASE_URL}/busqueda/vuelos/${idInstanciaVuelo}/asientos`);
        if (!response.ok) throw new Error('Error al cargar asientos');
        
        const data = await response.json();
        mostrarMapaAsientos(data.asientos);
        
    } catch (error) {
        console.error('Error al cargar mapa de asientos:', error);
        showAlert('error', 'Error al cargar mapa de asientos');
    }
}

function mostrarMapaAsientos(asientos) {
    const mapa = document.getElementById('mapaAsientos');
    
    if (!asientos || asientos.length === 0) {
        mapa.innerHTML = '<div class="alert alert-info">No hay asientos configurados para este vuelo</div>';
        return;
    }
    
    let html = '<div class="row">';
    
    asientos.forEach(asiento => {
        const disponible = asiento.disponible;
        const claseColor = disponible ? 'btn-outline-success' : 'btn-outline-danger';
        const disabled = disponible ? '' : 'disabled';
        
        html += `
            <div class="col-2 mb-2">
                <button class="btn ${claseColor} btn-sm w-100" ${disabled} onclick="seleccionarAsiento(${asiento.idAsiento}, '${asiento.codigo}')">
                    ${asiento.codigo}
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    mapa.innerHTML = html;
}

function seleccionarAsiento(idAsiento, codigo) {
    window.asientoSeleccionado = { id: idAsiento, codigo: codigo };
    showAlert('success', `Asiento ${codigo} seleccionado`);
    
    document.getElementById('datosPasajeroCard').style.display = 'block';
    document.getElementById('datosPasajeroCard').scrollIntoView({ behavior: 'smooth' });
}

// Exponer funciones al scope global
window.inicializarModuloBusqueda = inicializarModuloBusqueda;
window.buscarVuelos = buscarVuelos;
window.seleccionarVuelo = seleccionarVuelo;
window.guardarClienteYProcesarCompra = guardarClienteYProcesarCompra;
window.resetClienteForm = resetClienteForm;
window.buscarClientes = buscarClientes;
window.seleccionarCliente = seleccionarCliente;
window.seleccionarAsiento = seleccionarAsiento;

// Debug: Verificar que las funciones estén disponibles
console.log('Funciones de búsqueda expuestas:', {
    buscarClientes: typeof window.buscarClientes,
    seleccionarCliente: typeof window.seleccionarCliente
});

// Asegurar que las funciones estén disponibles globalmente
if (typeof window !== 'undefined') {
    window.buscarClientes = buscarClientes;
    window.seleccionarCliente = seleccionarCliente;
    window.seleccionarAsiento = seleccionarAsiento;
}