// Búsqueda de vuelos - Versión simple
console.log('Cargando busqueda-simple.js');

function inicializarModuloBusqueda() {
    console.log('Inicializando búsqueda...');
    cargarAeropuertos();
}

async function cargarAeropuertos() {
    try {
        console.log('Cargando aeropuertos...');
        const response = await fetch('http://localhost:8080/api/aeropuertos');
        const aeropuertos = await response.json();
        console.log('Aeropuertos:', aeropuertos);
        
        const selectOrigen = document.getElementById('busquedaOrigen');
        const selectDestino = document.getElementById('busquedaDestino');
        
        if (selectOrigen && selectDestino) {
            // Limpiar opciones
            selectOrigen.innerHTML = '<option value="">Cualquier origen</option>';
            selectDestino.innerHTML = '<option value="">Cualquier destino</option>';
            
            // Agregar aeropuertos
            aeropuertos.forEach(aeropuerto => {
                const option1 = new Option(`${aeropuerto.nombre} (${aeropuerto.codigoIATA})`, aeropuerto.idAeropuerto);
                const option2 = new Option(`${aeropuerto.nombre} (${aeropuerto.codigoIATA})`, aeropuerto.idAeropuerto);
                
                selectOrigen.add(option1);
                selectDestino.add(option2);
            });
            
            console.log('Aeropuertos cargados en selects');
        } else {
            console.error('No se encontraron los selects');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar aeropuertos: ' + error.message);
    }
}

async function buscarVuelos() {
    console.log('Buscando vuelos...');
    
    const origen = document.getElementById('busquedaOrigen').value;
    const destino = document.getElementById('busquedaDestino').value;
    const fecha = document.getElementById('busquedaFecha').value;
    
    console.log('Criterios:', { origen, destino, fecha });
    
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
        console.log('URL:', url);
        
        const response = await fetch(url);
        const vuelos = await response.json();
        console.log('Vuelos encontrados:', vuelos);
        
        mostrarResultados(vuelos);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al buscar vuelos: ' + error.message);
    }
}

function mostrarResultados(vuelos) {
    const contenedor = document.getElementById('resultadosBusqueda');
    const lista = document.getElementById('listaResultados');
    
    if (vuelos.length === 0) {
        lista.innerHTML = '<div class="alert alert-warning">No se encontraron vuelos</div>';
    } else {
        let html = `<div class="alert alert-success">Se encontraron ${vuelos.length} vuelo(s)</div>`;
        html += '<table class="table table-striped">';
        html += '<thead><tr><th>Vuelo</th><th>Origen</th><th>Destino</th><th>Acción</th></tr></thead>';
        html += '<tbody>';
        
        vuelos.forEach(vuelo => {
            html += `<tr>
                <td>${vuelo.numeroVuelo}</td>
                <td>${vuelo.origen}</td>
                <td>${vuelo.destino}</td>
                <td><button class="btn btn-primary btn-sm" onclick="seleccionarVuelo(${vuelo.idInstanciaVuelo})">Seleccionar</button></td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        lista.innerHTML = html;
    }
    
    contenedor.style.display = 'block';
}

function seleccionarVuelo(idVuelo) {
    console.log('Vuelo seleccionado:', idVuelo);
    window.instanciaVueloSeleccionada = idVuelo;
    
    // Mostrar formulario de cliente
    document.getElementById('formClienteCard').style.display = 'block';
    document.getElementById('formClienteCard').scrollIntoView({ behavior: 'smooth' });
    
    alert('Vuelo seleccionado. Complete los datos del cliente.');
}

async function buscarClientes() {
    const termino = document.getElementById('buscarClienteInput').value.trim();
    if (!termino) {
        alert('Ingrese un término de búsqueda');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:8080/api/clientes');
        const clientes = await response.json();
        
        // Filtrar clientes por término de búsqueda
        const clientesFiltrados = clientes.filter(cliente => 
            cliente.nombre.toLowerCase().includes(termino.toLowerCase()) ||
            cliente.apellidoP.toLowerCase().includes(termino.toLowerCase()) ||
            (cliente.correo && cliente.correo.toLowerCase().includes(termino.toLowerCase()))
        );
        
        mostrarListaClientes(clientesFiltrados);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al buscar clientes: ' + error.message);
    }
}

function mostrarListaClientes(clientes) {
    const lista = document.getElementById('listaClientes');
    
    if (clientes.length === 0) {
        lista.innerHTML = '<div class="alert alert-warning">No se encontraron clientes</div>';
    } else {
        let html = '<div class="table-responsive"><table class="table table-sm table-hover">';
        html += '<thead><tr><th>Nombre</th><th>Correo</th><th>Acción</th></tr></thead><tbody>';
        
        clientes.forEach(cliente => {
            const nombreCompleto = `${cliente.nombre} ${cliente.apellidoP} ${cliente.apellidoM || ''}`;
            html += `<tr>
                <td>${nombreCompleto}</td>
                <td>${cliente.correo || 'N/A'}</td>
                <td><button class="btn btn-primary btn-sm" onclick="seleccionarCliente(${cliente.idCliente}, '${nombreCompleto}')">
                    <i class="fas fa-check"></i> Seleccionar
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
    
    if (!window.instanciaVueloSeleccionada) {
        alert('Error: No hay vuelo seleccionado');
        return;
    }
    
    try {
        // Buscar o crear pasajero para este cliente
        const response = await fetch('http://localhost:8080/api/pasajeros');
        const pasajeros = await response.json();
        
        let pasajero = pasajeros.find(p => p.cliente && p.cliente.idCliente === idCliente);
        
        if (!pasajero) {
            // Crear pasajero si no existe
            const clienteResponse = await fetch(`http://localhost:8080/api/clientes/${idCliente}`);
            const cliente = await clienteResponse.json();
            
            const nuevoPasajero = {
                nombre: cliente.nombre,
                apellidoP: cliente.apellidoP,
                apellidoM: cliente.apellidoM,
                cliente: { idCliente: cliente.idCliente }
            };
            
            const pasajeroResponse = await fetch('http://localhost:8080/api/pasajeros', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoPasajero)
            });
            pasajero = await pasajeroResponse.json();
        }
        
        // Procesar compra
        const compraData = {
            idCliente: idCliente,
            idInstanciaVuelo: window.instanciaVueloSeleccionada,
            idMetodoPago: 1,
            pasajeros: [{
                idPasajero: pasajero.idPasajero,
                clase: 'Económica',
                asiento: 'AUTO'
            }]
        };
        
        const compraResponse = await fetch('http://localhost:8080/api/compra/procesar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(compraData)
        });
        const resultado = await compraResponse.json();
        
        alert(`¡Compra exitosa para ${nombreCliente}!\nCódigo de reserva: ${resultado.reserva}`);
        
        // Limpiar formularios
        limpiarFormularios();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar la compra: ' + error.message);
    }
}

async function procesarCompraConNuevoCliente() {
    if (!window.instanciaVueloSeleccionada) {
        alert('Debe seleccionar un vuelo primero');
        return;
    }
    
    const nombre = document.getElementById('clienteNombre').value;
    const apellidoP = document.getElementById('clienteApellidoP').value;
    const correo = document.getElementById('clienteCorreo').value;
    
    if (!nombre || !apellidoP || !correo) {
        alert('Complete los campos obligatorios');
        return;
    }
    
    try {
        // Crear cliente
        const cliente = { nombre, apellidoP, correo };
        const clienteResponse = await fetch('http://localhost:8080/api/clientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
        const clienteCreado = await clienteResponse.json();
        
        // Crear pasajero
        const pasajero = { nombre, apellidoP, cliente: { idCliente: clienteCreado.idCliente } };
        const pasajeroResponse = await fetch('http://localhost:8080/api/pasajeros', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pasajero)
        });
        const pasajeroCreado = await pasajeroResponse.json();
        
        // Procesar compra
        const compraData = {
            idCliente: clienteCreado.idCliente,
            idInstanciaVuelo: window.instanciaVueloSeleccionada,
            idMetodoPago: 1,
            pasajeros: [{
                idPasajero: pasajeroCreado.idPasajero,
                clase: 'Económica',
                asiento: 'AUTO'
            }]
        };
        
        const compraResponse = await fetch('http://localhost:8080/api/compra/procesar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(compraData)
        });
        const resultado = await compraResponse.json();
        
        alert(`¡Compra exitosa!\nCódigo de reserva: ${resultado.reserva}`);
        
        // Limpiar formularios
        limpiarFormularios();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar la compra: ' + error.message);
    }
}

function limpiarFormularios() {
    document.getElementById('formBusquedaVuelos').reset();
    document.getElementById('formCliente').reset();
    document.getElementById('buscarClienteInput').value = '';
    document.getElementById('resultadosBusqueda').style.display = 'none';
    document.getElementById('formClienteCard').style.display = 'none';
    document.getElementById('listaClientes').style.display = 'none';
    window.instanciaVueloSeleccionada = null;
}

// Exponer funciones globalmente
window.inicializarModuloBusqueda = inicializarModuloBusqueda;
window.buscarVuelos = buscarVuelos;
window.seleccionarVuelo = seleccionarVuelo;
window.buscarClientes = buscarClientes;
window.seleccionarCliente = seleccionarCliente;
window.procesarCompraConNuevoCliente = procesarCompraConNuevoCliente;

console.log('busqueda-simple.js cargado');