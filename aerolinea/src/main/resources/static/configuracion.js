// ============================================
// MÓDULO UNIFICADO: CONFIGURACIÓN DEL SISTEMA
// Incluye: Ciudades, Aeropuertos, Departamentos, 
// Métodos de Pago, Impuestos, Tarifas
// ============================================

// ============================================
// CIUDADES
// ============================================
let ciudadIdActual = null;

async function cargarCiudades() {
    try {
        const response = await fetch(`${API_BASE_URL}/ciudades`);
        const ciudades = await response.json();
        
        const tbody = document.getElementById('tablaCiudades');
        tbody.innerHTML = '';
        
        ciudades.forEach(ciudad => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ciudad.idCiudad}</td>
                <td>${ciudad.nombreCiudad}</td>
                <td>${ciudad.estado}</td>
                <td>${ciudad.pais}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarCiudad(${ciudad.idCiudad})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarCiudad(${ciudad.idCiudad})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar ciudades:', error);
        alert('Error al cargar ciudades');
    }
}

async function guardarCiudad(event) {
    event.preventDefault();
    
    const nombreCiudad = document.getElementById('ciudadNombre').value.trim();
    const estado = document.getElementById('ciudadEstado').value.trim();
    const pais = document.getElementById('ciudadPais').value.trim();
    
    const validacionNombre = validarSoloLetras(nombreCiudad, 'Nombre de Ciudad');
    if (!validacionNombre.valido) {
        mostrarError(validacionNombre.mensaje);
        return;
    }
    
    const validacionEstado = validarSoloLetras(estado, 'Estado');
    if (!validacionEstado.valido) {
        mostrarError(validacionEstado.mensaje);
        return;
    }
    
    const validacionPais = validarSoloLetras(pais, 'País');
    if (!validacionPais.valido) {
        mostrarError(validacionPais.mensaje);
        return;
    }
    
    const ciudad = { nombreCiudad, estado, pais };
    
    try {
        const url = ciudadIdActual 
            ? `${API_BASE_URL}/ciudades/${ciudadIdActual}`
            : `${API_BASE_URL}/ciudades`;
        
        const method = ciudadIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ciudad)
        });
        
        if (response.ok) {
            alert(ciudadIdActual ? 'Ciudad actualizada correctamente' : 'Ciudad registrada correctamente');
            document.getElementById('formCiudad').reset();
            ciudadIdActual = null;
            document.getElementById('btnCancelarCiudad').style.display = 'none';
            cargarCiudades();
            // Recargar select de ciudades para aeropuertos
            setTimeout(cargarCiudadesSelect, 500);
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar ciudad');
    }
}

async function editarCiudad(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/ciudades/${id}`);
        const ciudad = await response.json();
        
        document.getElementById('ciudadNombre').value = ciudad.nombreCiudad;
        document.getElementById('ciudadEstado').value = ciudad.estado;
        document.getElementById('ciudadPais').value = ciudad.pais;
        
        ciudadIdActual = id;
        document.getElementById('btnCancelarCiudad').style.display = 'inline-block';
        
        // Scroll al formulario
        document.getElementById('formCiudad').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar ciudad');
    }
}

async function eliminarCiudad(id) {
    if (!confirm('¿Está seguro de eliminar esta ciudad?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/ciudades/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Ciudad eliminada correctamente');
            cargarCiudades();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar ciudad');
    }
}

function cancelarCiudad() {
    document.getElementById('formCiudad').reset();
    ciudadIdActual = null;
    document.getElementById('btnCancelarCiudad').style.display = 'none';
}

// ============================================
// AEROPUERTOS
// ============================================
let aeropuertoIdActual = null;

async function cargarAeropuertosConfig() {
    try {
        console.log('Cargando aeropuertos...');
        const response = await fetch(`${API_BASE_URL}/aeropuertos`);
        console.log('Response status:', response.status);
        const aeropuertos = await response.json();
        console.log('Aeropuertos recibidos:', aeropuertos);
        
        const tbody = document.getElementById('tablaAeropuertos');
        if (!tbody) {
            console.error('No se encontró el elemento tablaAeropuertos');
            return;
        }
        tbody.innerHTML = '';
        
        console.log('Procesando', aeropuertos.length, 'aeropuertos');
        
        if (aeropuertos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay aeropuertos registrados</td></tr>';
            return;
        }
        
        aeropuertos.forEach((aeropuerto, index) => {
            console.log(`Procesando aeropuerto ${index + 1}:`, aeropuerto);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${aeropuerto.idAeropuerto || 'N/A'}</td>
                <td>${aeropuerto.nombre || 'N/A'}</td>
                <td>${aeropuerto.codigoIATA || 'N/A'}</td>
                <td>${aeropuerto.ciudad?.nombreCiudad || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarAeropuerto(${aeropuerto.idAeropuerto})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarAeropuerto(${aeropuerto.idAeropuerto})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        console.log('Aeropuertos cargados en la tabla exitosamente');
    } catch (error) {
        console.error('Error al cargar aeropuertos:', error);
        alert('Error al cargar aeropuertos');
    }
}

async function cargarCiudadesSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/ciudades`);
        const ciudades = await response.json();
        
        const select = document.getElementById('aeropuertoCiudad');
        if (!select) return;
        
        select.innerHTML = '<option value="">Seleccione ciudad...</option>';
        
        ciudades.forEach(ciudad => {
            const option = document.createElement('option');
            option.value = ciudad.idCiudad;
            option.textContent = `${ciudad.nombreCiudad}, ${ciudad.estado}, ${ciudad.pais}`;
            select.appendChild(option);
        });
        
        // Agregar listener para actualización en tiempo real
        select.addEventListener('change', function() {
            console.log('Ciudad seleccionada:', this.value);
        });
        
    } catch (error) {
        console.error('Error al cargar ciudades:', error);
    }
}

async function guardarAeropuerto(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('aeropuertoNombre').value.trim();
    const codigoIATA = document.getElementById('aeropuertoCodigo').value.trim().toUpperCase();
    const idCiudad = document.getElementById('aeropuertoCiudad').value;
    
    const validacionNombre = validarSoloLetras(nombre, 'Nombre del Aeropuerto');
    if (!validacionNombre.valido) {
        mostrarError(validacionNombre.mensaje);
        return;
    }
    
    const validacionCodigo = validarCodigoIATA(codigoIATA, 'Código IATA');
    if (!validacionCodigo.valido) {
        mostrarError(validacionCodigo.mensaje);
        return;
    }
    if (!idCiudad) {
        alert('Debe seleccionar una ciudad');
        return;
    }
    
    const aeropuerto = {
        nombre,
        codigoIATA,
        ciudad: { idCiudad: parseInt(idCiudad) }
    };
    
    try {
        const url = aeropuertoIdActual 
            ? `${API_BASE_URL}/aeropuertos/${aeropuertoIdActual}`
            : `${API_BASE_URL}/aeropuertos`;
        
        const method = aeropuertoIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(aeropuerto)
        });
        
        if (response.ok) {
            alert(aeropuertoIdActual ? 'Aeropuerto actualizado correctamente' : 'Aeropuerto registrado correctamente');
            document.getElementById('formAeropuerto').reset();
            aeropuertoIdActual = null;
            document.getElementById('btnCancelarAeropuerto').style.display = 'none';
            cargarAeropuertosConfig();
            // Recargar aeropuertos en otros módulos
            if (window.cargarAeropuertos) {
                setTimeout(window.cargarAeropuertos, 500);
            }
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar aeropuerto');
    }
}

async function editarAeropuerto(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/aeropuertos/${id}`);
        const aeropuerto = await response.json();
        
        document.getElementById('aeropuertoNombre').value = aeropuerto.nombre;
        document.getElementById('aeropuertoCodigo').value = aeropuerto.codigoIATA;
        document.getElementById('aeropuertoCiudad').value = aeropuerto.ciudad.idCiudad;
        
        aeropuertoIdActual = id;
        document.getElementById('btnCancelarAeropuerto').style.display = 'inline-block';
        
        document.getElementById('formAeropuerto').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar aeropuerto');
    }
}

async function eliminarAeropuerto(id) {
    if (!confirm('¿Está seguro de eliminar este aeropuerto?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/aeropuertos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Aeropuerto eliminado correctamente');
            cargarAeropuertosConfig();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar aeropuerto');
    }
}

function cancelarAeropuerto() {
    document.getElementById('formAeropuerto').reset();
    aeropuertoIdActual = null;
    document.getElementById('btnCancelarAeropuerto').style.display = 'none';
}

// ============================================
// DEPARTAMENTOS
// ============================================
let departamentoIdActual = null;

async function cargarDepartamentos() {
    try {
        const response = await fetch(`${API_BASE_URL}/departamentos`);
        const departamentos = await response.json();
        
        const tbody = document.getElementById('tablaDepartamentos');
        tbody.innerHTML = '';
        
        departamentos.forEach(depto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${depto.idDepartamento}</td>
                <td>${depto.nombreDepartamento}</td>
                <td>${depto.descripcion || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarDepartamento(${depto.idDepartamento})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarDepartamento(${depto.idDepartamento})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar departamentos:', error);
        alert('Error al cargar departamentos');
    }
}

async function guardarDepartamento(event) {
    event.preventDefault();
    
    const nombreDepartamento = document.getElementById('departamentoNombre').value.trim();
    const descripcion = document.getElementById('departamentoDescripcion').value.trim();
    
    const validacionNombre = validarSoloLetras(nombreDepartamento, 'Nombre de Departamento');
    if (!validacionNombre.valido) {
        mostrarError(validacionNombre.mensaje);
        return;
    }
    
    const departamento = { nombreDepartamento, descripcion };
    
    try {
        const url = departamentoIdActual 
            ? `${API_BASE_URL}/departamentos/${departamentoIdActual}`
            : `${API_BASE_URL}/departamentos`;
        
        const method = departamentoIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(departamento)
        });
        
        if (response.ok) {
            alert(departamentoIdActual ? 'Departamento actualizado correctamente' : 'Departamento registrado correctamente');
            document.getElementById('formDepartamento').reset();
            departamentoIdActual = null;
            document.getElementById('btnCancelarDepartamento').style.display = 'none';
            cargarDepartamentos();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar departamento');
    }
}

async function editarDepartamento(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/departamentos/${id}`);
        const departamento = await response.json();
        
        document.getElementById('departamentoNombre').value = departamento.nombreDepartamento;
        document.getElementById('departamentoDescripcion').value = departamento.descripcion || '';
        
        departamentoIdActual = id;
        document.getElementById('btnCancelarDepartamento').style.display = 'inline-block';
        
        document.getElementById('formDepartamento').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar departamento');
    }
}

async function eliminarDepartamento(id) {
    if (!confirm('¿Está seguro de eliminar este departamento?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/departamentos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Departamento eliminado correctamente');
            cargarDepartamentos();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar departamento');
    }
}

function cancelarDepartamento() {
    document.getElementById('formDepartamento').reset();
    departamentoIdActual = null;
    document.getElementById('btnCancelarDepartamento').style.display = 'none';
}

// ============================================
// MÉTODOS DE PAGO
// ============================================
let metodoPagoIdActual = null;

async function cargarMetodosPago() {
    try {
        const response = await fetch(`${API_BASE_URL}/metodos-pago`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const metodos = await response.json();
        
        const tbody = document.getElementById('tablaMetodosPago');
        tbody.innerHTML = '';
        
        if (!Array.isArray(metodos)) {
            console.error('Expected array but got:', metodos);
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error: Datos inválidos del servidor</td></tr>';
            return;
        }
        
        metodos.forEach(metodo => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${metodo.idMetodoPago}</td>
                <td>${metodo.nombre}</td>
                <td>${metodo.descripcion || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarMetodoPago(${metodo.idMetodoPago})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarMetodoPago(${metodo.idMetodoPago})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar métodos de pago:', error);
        alert('Error al cargar métodos de pago');
    }
}

async function guardarMetodoPago(event) {
    if (event) event.preventDefault();
    
    const nombre = document.getElementById('metodoPagoNombre').value.trim();
    const descripcion = document.getElementById('metodoPagoDescripcion').value.trim();
    
    const validacionNombre = validarSoloLetras(nombre, 'Nombre del Método de Pago');
    if (!validacionNombre.valido) {
        mostrarError(validacionNombre.mensaje);
        return;
    }
    
    if (descripcion) {
        const validacionDescripcion = validarAlfanumerico(descripcion, 'Descripción');
        if (!validacionDescripcion.valido) {
            mostrarError(validacionDescripcion.mensaje);
            return;
        }
    }
    
    const metodoPago = { nombre, descripcion: descripcion || null };
    
    try {
        const url = metodoPagoIdActual 
            ? `${API_BASE_URL}/metodos-pago/${metodoPagoIdActual}`
            : `${API_BASE_URL}/metodos-pago`;
        
        const method = metodoPagoIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(metodoPago)
        });
        
        if (response.ok) {
            alert(metodoPagoIdActual ? 'Método de pago actualizado correctamente' : 'Método de pago registrado correctamente');
            document.getElementById('formMetodoPago').reset();
            metodoPagoIdActual = null;
            document.getElementById('btnCancelarMetodoPago').style.display = 'none';
            cargarMetodosPago();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar método de pago');
    }
}

async function editarMetodoPago(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/metodos-pago/${id}`);
        const metodo = await response.json();
        
        document.getElementById('metodoPagoNombre').value = metodo.nombre;
        document.getElementById('metodoPagoDescripcion').value = metodo.descripcion || '';
        
        metodoPagoIdActual = id;
        document.getElementById('btnCancelarMetodoPago').style.display = 'inline-block';
        
        document.getElementById('formMetodoPago').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar método de pago');
    }
}

async function eliminarMetodoPago(id) {
    if (!confirm('¿Está seguro de eliminar este método de pago?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/metodos-pago/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Método de pago eliminado correctamente');
            cargarMetodosPago();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar método de pago');
    }
}

function cancelarMetodoPago() {
    document.getElementById('formMetodoPago').reset();
    metodoPagoIdActual = null;
    document.getElementById('btnCancelarMetodoPago').style.display = 'none';
}

// ============================================
// IMPUESTOS
// ============================================
let impuestoIdActual = null;

async function cargarImpuestos() {
    try {
        const response = await fetch(`${API_BASE_URL}/impuestos`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const impuestos = await response.json();
        
        const tbody = document.getElementById('tablaImpuestos');
        tbody.innerHTML = '';
        
        if (!Array.isArray(impuestos)) {
            console.error('Expected array but got:', impuestos);
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error: Datos inválidos del servidor</td></tr>';
            return;
        }
        
        impuestos.forEach(impuesto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${impuesto.idImpuesto}</td>
                <td>${impuesto.nombre}</td>
                <td>${impuesto.porcentaje}%</td>
                <td>${impuesto.descripcion || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarImpuesto(${impuesto.idImpuesto})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarImpuesto(${impuesto.idImpuesto})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar impuestos:', error);
        alert('Error al cargar impuestos');
    }
}

async function guardarImpuesto(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('impuestoNombre').value.trim();
    const porcentaje = parseFloat(document.getElementById('impuestoPorcentaje').value);
    const descripcion = document.getElementById('impuestoDescripcion').value.trim();
    
    const validacionNombre = validarSoloLetras(nombre, 'Nombre del Impuesto');
    if (!validacionNombre.valido) {
        mostrarError(validacionNombre.mensaje);
        return;
    }
    
    const validacionPorcentaje = validarDecimal(porcentaje, 'Porcentaje');
    if (!validacionPorcentaje.valido) {
        mostrarError(validacionPorcentaje.mensaje);
        return;
    }
    
    if (porcentaje < 0 || porcentaje > 100) {
        mostrarError('El porcentaje debe estar entre 0 y 100');
        return;
    }
    
    const impuesto = { nombre, porcentaje, descripcion };
    
    try {
        const url = impuestoIdActual 
            ? `${API_BASE_URL}/impuestos/${impuestoIdActual}`
            : `${API_BASE_URL}/impuestos`;
        
        const method = impuestoIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(impuesto)
        });
        
        if (response.ok) {
            alert(impuestoIdActual ? 'Impuesto actualizado correctamente' : 'Impuesto registrado correctamente');
            document.getElementById('formImpuesto').reset();
            impuestoIdActual = null;
            document.getElementById('btnCancelarImpuesto').style.display = 'none';
            cargarImpuestos();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar impuesto');
    }
}

async function editarImpuesto(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/impuestos/${id}`);
        const impuesto = await response.json();
        
        document.getElementById('impuestoNombre').value = impuesto.nombre;
        document.getElementById('impuestoPorcentaje').value = impuesto.porcentaje;
        document.getElementById('impuestoDescripcion').value = impuesto.descripcion || '';
        
        impuestoIdActual = id;
        document.getElementById('btnCancelarImpuesto').style.display = 'inline-block';
        
        document.getElementById('formImpuesto').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar impuesto');
    }
}

async function eliminarImpuesto(id) {
    if (!confirm('¿Está seguro de eliminar este impuesto?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/impuestos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Impuesto eliminado correctamente');
            cargarImpuestos();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar impuesto');
    }
}

function cancelarImpuesto() {
    document.getElementById('formImpuesto').reset();
    impuestoIdActual = null;
    document.getElementById('btnCancelarImpuesto').style.display = 'none';
}

// ============================================
// TARIFAS
// ============================================
let tarifaIdActual = null;

async function cargarTarifas() {
    try {
        const response = await fetch(`${API_BASE_URL}/tarifas`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tarifas = await response.json();
        
        const tbody = document.getElementById('tablaTarifas');
        tbody.innerHTML = '';
        
        if (!Array.isArray(tarifas)) {
            console.error('Expected array but got:', tarifas);
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error: Datos inválidos del servidor</td></tr>';
            return;
        }
        
        tarifas.forEach(tarifa => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${tarifa.idTarifa}</td>
                <td>${tarifa.nombre}</td>
                <td>${tarifa.descripcion || 'N/A'}</td>
                <td>${tarifa.clase}</td>
                <td>$${tarifa.precioBase.toFixed(2)}</td>
                <td>${tarifa.activo ? '<span class="badge bg-success">Activo</span>' : '<span class="badge bg-secondary">Inactivo</span>'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarTarifa(${tarifa.idTarifa})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarTarifa(${tarifa.idTarifa})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar tarifas:', error);
        alert('Error al cargar tarifas');
    }
}

async function guardarTarifa(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('tarifaNombre').value.trim();
    const descripcion = document.getElementById('tarifaDescripcion').value.trim();
    const precioBase = parseFloat(document.getElementById('tarifaPrecio').value);
    const clase = document.getElementById('tarifaClase').value.trim();
    const activo = document.getElementById('tarifaActivo').checked;
    
    const validacionNombre = validarSoloLetras(nombre, 'Nombre de la Tarifa');
    if (!validacionNombre.valido) {
        mostrarError(validacionNombre.mensaje);
        return;
    }
    
    const validacionPrecio = validarDecimal(precioBase, 'Precio Base');
    if (!validacionPrecio.valido) {
        mostrarError(validacionPrecio.mensaje);
        return;
    }
    
    if (precioBase < 100 || precioBase > 50000) {
        mostrarError('El precio base debe estar entre $100.00 y $50,000.00');
        return;
    }
    
    if (!clase) {
        mostrarError('Debe seleccionar una clase');
        return;
    }
    
    const tarifa = { nombre, descripcion, precioBase, clase, activo };
    
    try {
        const url = tarifaIdActual 
            ? `${API_BASE_URL}/tarifas/${tarifaIdActual}`
            : `${API_BASE_URL}/tarifas`;
        
        const method = tarifaIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarifa)
        });
        
        if (response.ok) {
            alert(tarifaIdActual ? 'Tarifa actualizada correctamente' : 'Tarifa registrada correctamente');
            document.getElementById('formTarifa').reset();
            tarifaIdActual = null;
            document.getElementById('btnCancelarTarifa').style.display = 'none';
            cargarTarifas();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar tarifa');
    }
}

async function editarTarifa(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/tarifas/${id}`);
        const tarifa = await response.json();
        
        document.getElementById('tarifaNombre').value = tarifa.nombre;
        document.getElementById('tarifaDescripcion').value = tarifa.descripcion || '';
        document.getElementById('tarifaPrecio').value = tarifa.precioBase;
        document.getElementById('tarifaClase').value = tarifa.clase || '';
        document.getElementById('tarifaActivo').checked = tarifa.activo;
        
        tarifaIdActual = id;
        document.getElementById('btnCancelarTarifa').style.display = 'inline-block';
        
        document.getElementById('formTarifa').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar tarifa');
    }
}

async function eliminarTarifa(id) {
    if (!confirm('¿Está seguro de eliminar esta tarifa?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/tarifas/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Tarifa eliminada correctamente');
            cargarTarifas();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar tarifa');
    }
}

function cancelarTarifa() {
    document.getElementById('formTarifa').reset();
    tarifaIdActual = null;
    document.getElementById('btnCancelarTarifa').style.display = 'none';
}

// Exponer funciones al scope global
window.editarCiudad = editarCiudad;
window.eliminarCiudad = eliminarCiudad;
window.editarAeropuerto = editarAeropuerto;
window.eliminarAeropuerto = eliminarAeropuerto;
window.editarDepartamento = editarDepartamento;
window.eliminarDepartamento = eliminarDepartamento;
window.editarMetodoPago = editarMetodoPago;
window.eliminarMetodoPago = eliminarMetodoPago;
window.editarImpuesto = editarImpuesto;
window.eliminarImpuesto = eliminarImpuesto;
window.editarTarifa = editarTarifa;
window.eliminarTarifa = eliminarTarifa;

// ============================================
// INICIALIZACIÓN DEL MÓDULO
// ============================================
function inicializarModuloConfiguracion() {
    console.log('Inicializando módulo de configuración...');
    // Cargar contenido HTML de cada pestaña
    cargarHTMLCiudades();
    cargarHTMLAeropuertos();
    cargarHTMLDepartamentos();
    cargarHTMLMetodosPago();
    cargarHTMLImpuestos();
    cargarHTMLTarifas();
    
    // Cargar ciudades selects para aeropuertos
    cargarCiudadesSelect();
    
    // Agregar validación en tiempo real
    setTimeout(agregarValidacionTiempoReal, 500);
    
    // Forzar carga de aeropuertos después de un delay
    setTimeout(() => {
        console.log('Forzando carga de aeropuertos...');
        cargarAeropuertosConfig();
    }, 1000);
}

// Cargar HTML de la pestaña Ciudades
function cargarHTMLCiudades() {
    const contenedor = document.getElementById('ciudades-content');
    contenedor.innerHTML = `
        <div class="card mb-3">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-plus"></i> Nueva Ciudad
            </div>
            <div class="card-body">
                <form id="formCiudad" onsubmit="event.preventDefault(); guardarCiudad(event);">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Nombre de la Ciudad *</label>
                                <input type="text" class="form-control" id="ciudadNombre" maxlength="100" title="Solo se permiten letras y espacios" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Estado *</label>
                                <input type="text" class="form-control" id="ciudadEstado" maxlength="100" title="Solo se permiten letras y espacios" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">País *</label>
                                <input type="text" class="form-control" id="ciudadPais" maxlength="100" title="Solo se permiten letras y espacios" required>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                        <button type="button" class="btn btn-secondary" id="btnCancelarCiudad" style="display:none;" onclick="cancelarCiudad()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-list"></i> Lista de Ciudades
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ciudad</th>
                                <th>Estado</th>
                                <th>País</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaCiudades"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    cargarCiudades();
}

// Cargar HTML de la pestaña Aeropuertos
function cargarHTMLAeropuertos() {
    const contenedor = document.getElementById('aeropuertos-content');
    contenedor.innerHTML = `
        <div class="card mb-3">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-plus"></i> Nuevo Aeropuerto
            </div>
            <div class="card-body">
                <form id="formAeropuerto" onsubmit="event.preventDefault(); guardarAeropuerto(event);">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Nombre del Aeropuerto *</label>
                                <input type="text" class="form-control" id="aeropuertoNombre" maxlength="200" title="Solo se permiten letras y espacios" required>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label class="form-label">Código IATA *</label>
                                <input type="text" class="form-control" id="aeropuertoCodigo" maxlength="3" minlength="3" pattern="[A-Z]{3}" placeholder="MEX" title="Exactamente 3 letras mayúsculas, sin espacios" required style="text-transform: uppercase;">
                                <small class="form-text text-muted">3 letras (ej: MEX, GDL, MTY)</small>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label class="form-label">Ciudad *</label>
                                <select class="form-control" id="aeropuertoCiudad" required>
                                    <option value="">Seleccione...</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                        <button type="button" class="btn btn-secondary" id="btnCancelarAeropuerto" style="display:none;" onclick="cancelarAeropuerto()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-list"></i> Lista de Aeropuertos
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Código IATA</th>
                                <th>Ciudad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaAeropuertos"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    cargarAeropuertosConfig();
}

// Cargar HTML de la pestaña Departamentos
function cargarHTMLDepartamentos() {
    const contenedor = document.getElementById('departamentos-content');
    contenedor.innerHTML = `
        <div class="card mb-3">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-plus"></i> Nuevo Departamento
            </div>
            <div class="card-body">
                <form id="formDepartamento" onsubmit="event.preventDefault(); guardarDepartamento(event);">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Nombre del Departamento *</label>
                                <input type="text" class="form-control" id="departamentoNombre" maxlength="100" minlength="3" title="Solo se permiten letras y espacios, mínimo 3 caracteres" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Descripción</label>
                                <input type="text" class="form-control" id="departamentoDescripcion" maxlength="255">
                            </div>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                        <button type="button" class="btn btn-secondary" id="btnCancelarDepartamento" style="display:none;" onclick="cancelarDepartamento()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-list"></i> Lista de Departamentos
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaDepartamentos"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    cargarDepartamentos();
}

// Cargar HTML de la pestaña Métodos de Pago
function cargarHTMLMetodosPago() {
    const contenedor = document.getElementById('metodos-pago-content');
    contenedor.innerHTML = `
        <div class="card mb-3">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-plus"></i> Nuevo Método de Pago
            </div>
            <div class="card-body">
                <form id="formMetodoPago">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Nombre del Método *</label>
                                <input type="text" class="form-control" id="metodoPagoNombre" maxlength="50" title="Solo se permiten letras y espacios" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Descripción</label>
                                <input type="text" class="form-control" id="metodoPagoDescripcion" maxlength="100" title="Solo se permiten letras, números y espacios">
                            </div>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-primary" onclick="guardarMetodoPago(event)">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                        <button type="button" class="btn btn-secondary" id="btnCancelarMetodoPago" style="display:none;" onclick="cancelarMetodoPago()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-list"></i> Lista de Métodos de Pago
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaMetodosPago"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    cargarMetodosPago();
}

// Cargar HTML de la pestaña Impuestos
function cargarHTMLImpuestos() {
    const contenedor = document.getElementById('impuestos-content');
    contenedor.innerHTML = `
        <div class="card mb-3">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-plus"></i> Nuevo Impuesto
            </div>
            <div class="card-body">
                <form id="formImpuesto" onsubmit="event.preventDefault(); guardarImpuesto(event);">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Nombre del Impuesto *</label>
                                <input type="text" class="form-control" id="impuestoNombre" maxlength="100" title="Solo se permiten letras y espacios" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Porcentaje (%) *</label>
                                <input type="number" step="0.01" min="0" max="100" class="form-control" id="impuestoPorcentaje" required>
                                <small class="form-text text-muted">Ejemplo: 16 para 16%</small>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label class="form-label">Descripción</label>
                                <input type="text" class="form-control" id="impuestoDescripcion" maxlength="255">
                            </div>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                        <button type="button" class="btn btn-secondary" id="btnCancelarImpuesto" style="display:none;" onclick="cancelarImpuesto()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-list"></i> Lista de Impuestos
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Porcentaje</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaImpuestos"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    cargarImpuestos();
}

// Cargar HTML de la pestaña Tarifas
function cargarHTMLTarifas() {
    const contenedor = document.getElementById('tarifas-content');
    contenedor.innerHTML = `
        <div class="card mb-3">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-plus"></i> Nueva Tarifa
            </div>
            <div class="card-body">
                <form id="formTarifa" onsubmit="event.preventDefault(); guardarTarifa(event);">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Nombre de la Tarifa *</label>
                                <input type="text" class="form-control" id="tarifaNombre" maxlength="100" title="Solo se permiten letras y espacios" required>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label class="form-label">Clase *</label>
                                <select class="form-control" id="tarifaClase" required>
                                    <option value="">Seleccione clase...</option>
                                    <option value="Económica">Económica</option>
                                    <option value="Ejecutiva">Ejecutiva</option>
                                    <option value="Primera">Primera</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label class="form-label">Precio Base ($) *</label>
                                <input type="number" step="0.01" min="100" max="50000" class="form-control" id="tarifaPrecio" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-9">
                            <div class="mb-3">
                                <label class="form-label">Descripción</label>
                                <input type="text" class="form-control" id="tarifaDescripcion" maxlength="255">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label class="form-label">Estado</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="tarifaActivo" checked>
                                    <label class="form-check-label" for="tarifaActivo">
                                        Activo
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                        <button type="button" class="btn btn-secondary" id="btnCancelarTarifa" style="display:none;" onclick="cancelarTarifa()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header bg-primary text-white">
                <i class="fas fa-list"></i> Lista de Tarifas
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Clase</th>
                                <th>Precio Base</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaTarifas"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    cargarTarifas();
}

// Validación en tiempo real global
function agregarValidacionTiempoReal() {
    // Campos que permiten letras y espacios (nombres, apellidos, ciudades, etc.)
    const camposNombres = [
        // Configuración
        'aeropuertoNombre', 'metodoPagoNombre', 'impuestoNombre', 
        'tarifaNombre', 'departamentoNombre', 'ciudadNombre', 
        'ciudadEstado', 'ciudadPais',
        // Clientes
        'clienteNombre', 'clienteApellidoP', 'clienteApellidoM',
        'clienteCiudad', 'clienteEstado', 'clienteColonia',
        // Empleados
        'empleadoNombre', 'empleadoApellidoP', 'empleadoApellidoM',
        // Pasajeros
        'pasajeroNombre', 'pasajeroApellidoP', 'pasajeroApellidoM',
        'pasajeroNacionalidad',
        // Aviones
        'avionModelo',
        // Otros campos de nombres
        'nombre', 'apellidoP', 'apellidoM', 'ciudad', 'estado', 'pais'
    ];
    
    // Campos alfanuméricos (letras, números y espacios)
    const camposAlfanumericos = [
        'metodoPagoDescripcion', 'impuestoDescripcion', 'tarifaDescripcion',
        'departamentoDescripcion', 'descripcion'
    ];
    
    camposNombres.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', function(e) {
                // Permitir letras (con acentos), ñ y espacios
                const valor = e.target.value;
                const valorLimpio = valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                if (valor !== valorLimpio) {
                    e.target.value = valorLimpio;
                }
            });
        }
    });
    
    // Campos alfanuméricos (letras, números y espacios)
    camposAlfanumericos.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', function(e) {
                // Permitir letras, números y espacios
                const valor = e.target.value;
                const valorLimpio = valor.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '');
                if (valor !== valorLimpio) {
                    e.target.value = valorLimpio;
                }
            });
        }
    });
    
    // Campos que solo permiten números
    const camposNumeros = [
        'clienteTelefono', 'clienteCodigoPostal', 'empleadoTelefono',
        'avionCapacidad', 'rutaDistancia', 'impuestoPorcentaje',
        'tarifaPrecio', 'telefono', 'capacidad'
    ];
    
    camposNumeros.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo && campo.type !== 'email') {
            campo.addEventListener('input', function(e) {
                // Solo números y punto decimal para campos numéricos
                const valor = e.target.value;
                const valorLimpio = valor.replace(/[^0-9.]/g, '');
                if (valor !== valorLimpio) {
                    e.target.value = valorLimpio;
                }
            });
        }
    });
    
    // Código IATA: solo 3 letras mayúsculas, sin espacios
    const campoIATA = document.getElementById('aeropuertoCodigo');
    if (campoIATA) {
        campoIATA.addEventListener('input', function(e) {
            let valor = e.target.value.toUpperCase();
            valor = valor.replace(/[^A-Z]/g, '').substring(0, 3);
            e.target.value = valor;
        });
    }
    
    // Matrículas de aviones: formato XX-ABC
    const campoMatricula = document.getElementById('avionMatricula');
    if (campoMatricula) {
        campoMatricula.addEventListener('input', function(e) {
            let valor = e.target.value.toUpperCase();
            // Permitir letras, números y guión
            valor = valor.replace(/[^A-Z0-9-]/g, '');
            e.target.value = valor;
        });
    }
}

// Event listeners para las pestañas
document.addEventListener('DOMContentLoaded', function() {
    // Agregar validación en tiempo real
    setTimeout(agregarValidacionTiempoReal, 1000);
    // Agregar listeners a las pestañas de configuración
    const configTabs = document.querySelectorAll('#configTabs button[data-bs-toggle="tab"]');
    configTabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(event) {
            const targetId = event.target.getAttribute('data-bs-target');
            console.log('Pestaña activada:', targetId);
            
            // Recargar datos según la pestaña
            switch(targetId) {
                case '#ciudades-content':
                    cargarCiudades();
                    break;
                case '#aeropuertos-content':
                    cargarAeropuertosConfig();
                    cargarCiudadesSelect();
                    break;
                case '#departamentos-content':
                    cargarDepartamentos();
                    break;
                case '#metodos-pago-content':
                    cargarMetodosPago();
                    break;
                case '#impuestos-content':
                    cargarImpuestos();
                    break;
                case '#tarifas-content':
                    cargarTarifas();
                    break;
            }
            // Aplicar validación en tiempo real después de cargar contenido
            setTimeout(agregarValidacionTiempoReal, 300);
        });
    });
});

// Exponer la función de inicialización
window.inicializarModuloConfiguracion = inicializarModuloConfiguracion;
window.guardarCiudad = guardarCiudad;
window.cancelarCiudad = cancelarCiudad;
window.guardarAeropuerto = guardarAeropuerto;
window.cancelarAeropuerto = cancelarAeropuerto;
window.guardarDepartamento = guardarDepartamento;
window.cancelarDepartamento = cancelarDepartamento;
window.guardarMetodoPago = guardarMetodoPago;
window.cancelarMetodoPago = cancelarMetodoPago;
window.guardarImpuesto = guardarImpuesto;
window.cancelarImpuesto = cancelarImpuesto;
window.guardarTarifa = guardarTarifa;
window.cancelarTarifa = cancelarTarifa;
