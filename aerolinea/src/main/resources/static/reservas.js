let reservas = [];
let reservasFiltradas = [];
let editandoReservaId = null;
let clientesDisponibles = [];

async function loadReservas() {
    try {
        [reservas, clientesDisponibles] = await Promise.all([
            fetchAPI(ENDPOINTS.reservas),
            fetchAPI(ENDPOINTS.clientes)
        ]);
        reservasFiltradas = reservas;
        renderReservasTable();
        cargarClientesSelect();
    } catch (error) {
        console.error('Error loading reservas:', error);
        showAlert('error', 'Error al cargar reservas');
    }
}

function cargarClientesSelect() {
    const select = document.getElementById('reservaCliente');
    if (!select) return;
    
    select.innerHTML = '<option value="">Seleccione un cliente</option>' +
        clientesDisponibles.map(cliente => 
            `<option value="${cliente.idCliente}">${cliente.nombre} ${cliente.apellidoP} - ${cliente.correo}</option>`
        ).join('');
}

function filtrarReservas(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        reservasFiltradas = reservas;
    } else {
        reservasFiltradas = reservas.filter(reserva => {
            const codigo = (reserva.codigoReserva || '').toLowerCase();
            const estado = (reserva.estado || '').toLowerCase();
            const clienteNombre = reserva.cliente ? 
                `${reserva.cliente.nombre} ${reserva.cliente.apellidoP}`.toLowerCase() : '';
            
            return codigo.includes(texto) || 
                   estado.includes(texto) || 
                   clienteNombre.includes(texto);
        });
    }
    
    renderReservasTable();
}

function renderReservasTable() {
    const tbody = document.getElementById('tablaReservas');
    if (!tbody) return;

    if (reservasFiltradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron reservas</td></tr>';
        return;
    }

    tbody.innerHTML = reservasFiltradas.map(reserva => {
        const clienteNombre = reserva.cliente ? 
            `${reserva.cliente.nombre} ${reserva.cliente.apellidoP}` : 'N/A';
        const fecha = reserva.fechaReserva ? 
            new Date(reserva.fechaReserva).toLocaleDateString() : 'N/A';
        const estadoClass = {
            'PENDIENTE': 'badge bg-warning',
            'CONFIRMADA': 'badge bg-success',
            'CANCELADA': 'badge bg-danger'
        }[reserva.estado] || 'badge bg-secondary';
        
        return `
            <tr>
                <td>${reserva.idReserva}</td>
                <td><strong>${reserva.codigoReserva}</strong></td>
                <td>${clienteNombre}</td>
                <td>${fecha}</td>
                <td><span class="${estadoClass}">${reserva.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editReserva(${reserva.idReserva})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteReserva(${reserva.idReserva})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editReserva(id) {
    const reserva = reservas.find(r => r.idReserva === id);
    if (!reserva) return;

    editandoReservaId = id;
    
    document.getElementById('reservaCodigo').value = reserva.codigoReserva || '';
    
    if (reserva.cliente && reserva.cliente.idCliente) {
        document.getElementById('reservaCliente').value = reserva.cliente.idCliente;
    }
    
    if (reserva.fechaReserva) {
        const fecha = new Date(reserva.fechaReserva);
        document.getElementById('reservaFecha').value = fecha.toISOString().split('T')[0];
    }
    
    document.getElementById('reservaEstado').value = reserva.estado || 'PENDIENTE';
    
    const submitButton = document.querySelector('#formReserva button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Reserva';
    
    document.getElementById('formReserva').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetReservaForm() {
    const form = document.getElementById('formReserva');
    form.reset();
    editandoReservaId = null;
    
    limpiarErroresValidacionReserva();
    
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Guardar Reserva';
    
    // Generar nuevo código
    generarCodigoReserva();
}

function limpiarErroresValidacionReserva() {
    document.querySelectorAll('#formReserva .is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('#formReserva .invalid-feedback').forEach(el => el.remove());
}

function mostrarErrorCampoReserva(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    if (!campo) return;
    
    campo.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = mensaje;
    campo.parentNode.appendChild(errorDiv);
}

function generarCodigoReserva() {
    const fecha = new Date();
    const codigo = `RES-${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    document.getElementById('reservaCodigo').value = codigo;
}

function validarReserva(reservaData) {
    limpiarErroresValidacionReserva();
    let esValido = true;
    
    if (!reservaData.codigoReserva || reservaData.codigoReserva.trim().length === 0) {
        mostrarErrorCampoReserva('reservaCodigo', 'El código de reserva es requerido');
        esValido = false;
    }
    
    if (!reservaData.cliente || !reservaData.cliente.idCliente) {
        mostrarErrorCampoReserva('reservaCliente', 'Debe seleccionar un cliente');
        esValido = false;
    }
    
    if (!reservaData.fechaReserva) {
        mostrarErrorCampoReserva('reservaFecha', 'La fecha de reserva es requerida');
        esValido = false;
    }
    
    if (!reservaData.estado) {
        mostrarErrorCampoReserva('reservaEstado', 'Debe seleccionar un estado');
        esValido = false;
    }
    
    return esValido;
}

async function deleteReserva(id) {
    if (!confirm('¿Está seguro de eliminar esta reserva?')) return;

    try {
        await fetchAPI(`${ENDPOINTS.reservas}/${id}`, {
            method: 'DELETE'
        });
        showAlert('success', 'Reserva eliminada exitosamente');
        loadReservas();
        loadDashboardData();
    } catch (error) {
        console.error('Error deleting reserva:', error);
        showAlert('error', error.message || 'Error al eliminar reserva');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formReserva');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const clienteId = document.getElementById('reservaCliente').value;
            
            const reservaData = {
                codigoReserva: document.getElementById('reservaCodigo').value.trim(),
                fechaReserva: document.getElementById('reservaFecha').value || null,
                estado: document.getElementById('reservaEstado').value,
                cliente: clienteId ? { idCliente: parseInt(clienteId) } : null
            };

            if (!validarReserva(reservaData)) {
                showAlert('warning', 'Por favor, corrige los errores en el formulario');
                return;
            }

            try {
                if (editandoReservaId) {
                    await fetchAPI(`${ENDPOINTS.reservas}/${editandoReservaId}`, {
                        method: 'PUT',
                        body: JSON.stringify(reservaData)
                    });
                    showAlert('success', 'Reserva actualizada exitosamente');
                    resetReservaForm();
                } else {
                    await fetchAPI(ENDPOINTS.reservas, {
                        method: 'POST',
                        body: JSON.stringify(reservaData)
                    });
                    showAlert('success', 'Reserva creada exitosamente');
                    form.reset();
                    generarCodigoReserva();
                }
                
                loadReservas();
                loadDashboardData();
            } catch (error) {
                console.error('Error saving reserva:', error);
                
                if (error.errors) {
                    const mapaCampos = {
                        'codigoReserva': 'reservaCodigo',
                        'fechaReserva': 'reservaFecha',
                        'estado': 'reservaEstado',
                        'cliente': 'reservaCliente'
                    };
                    
                    Object.entries(error.errors).forEach(([campo, mensaje]) => {
                        const campoId = mapaCampos[campo];
                        if (campoId) {
                            mostrarErrorCampoReserva(campoId, mensaje);
                        }
                    });
                    
                    showAlert('error', error.message || 'Error de validación');
                } else {
                    showAlert('error', error.message || 'Error al guardar reserva');
                }
            }
        });
        
        // Generar código automáticamente al cargar
        generarCodigoReserva();
    }

    const buscarInput = document.getElementById('buscarReserva');
    if (buscarInput) {
        buscarInput.addEventListener('input', function(e) {
            filtrarReservas(e.target.value);
        });
    }
    
    const campos = ['reservaCodigo', 'reservaCliente', 'reservaFecha', 'reservaEstado'];
    
    campos.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', function() {
                this.classList.remove('is-invalid');
                const errorDiv = this.parentNode.querySelector('.invalid-feedback');
                if (errorDiv) errorDiv.remove();
            });
        }
    });
});
