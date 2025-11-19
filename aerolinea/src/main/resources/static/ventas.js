let ventas = [];
let ventasFiltradas = [];
let editandoVentaId = null;
let clientesDisponibles = [];
let boletosDisponibles = [];

async function loadVentas() {
    try {
        [ventas, clientesDisponibles, boletosDisponibles] = await Promise.all([
            fetchAPI(ENDPOINTS.ventas),
            fetchAPI(ENDPOINTS.clientes),
            fetchAPI(ENDPOINTS.boletos)
        ]);
        ventasFiltradas = ventas;
        renderVentasTable();
        cargarSelectsVenta();
    } catch (error) {
        console.error('Error loading ventas:', error);
        showAlert('error', 'Error al cargar ventas');
    }
}

function cargarSelectsVenta() {
    const selectCliente = document.getElementById('ventaCliente');
    if (selectCliente) {
        selectCliente.innerHTML = '<option value="">Seleccione un cliente</option>' +
            clientesDisponibles.map(c => 
                `<option value="${c.idCliente}">${c.nombre} ${c.apellidoP} - ${c.correo}</option>`
            ).join('');
    }
}

function filtrarVentas(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        ventasFiltradas = ventas;
    } else {
        ventasFiltradas = ventas.filter(venta => {
            const cliente = venta.cliente ? 
                `${venta.cliente.nombre} ${venta.cliente.apellidoP}`.toLowerCase() : '';
            const estado = (venta.estadoVenta || '').toLowerCase();
            const formaPago = (venta.formaPago || '').toLowerCase();
            
            return cliente.includes(texto) || 
                   estado.includes(texto) || 
                   formaPago.includes(texto);
        });
    }
    
    renderVentasTable();
}

function renderVentasTable() {
    const tbody = document.getElementById('tablaVentas');
    if (!tbody) return;

    if (ventasFiltradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron ventas</td></tr>';
        return;
    }

    tbody.innerHTML = ventasFiltradas.map(venta => {
        const clienteNombre = venta.cliente ? 
            `${venta.cliente.nombre} ${venta.cliente.apellidoP}` : 'N/A';
        const fecha = venta.fechaVenta ? 
            new Date(venta.fechaVenta).toLocaleDateString() : 'N/A';
        const total = venta.total ? `$${parseFloat(venta.total).toFixed(2)}` : 'N/A';
        const estadoClass = {
            'COMPLETADA': 'badge bg-success',
            'PENDIENTE': 'badge bg-warning',
            'CANCELADA': 'badge bg-danger'
        }[venta.estadoVenta] || 'badge bg-secondary';
        
        return `
            <tr>
                <td>${venta.idVenta}</td>
                <td>${clienteNombre}</td>
                <td>${fecha}</td>
                <td><strong>${total}</strong></td>
                <td><span class="badge bg-info">${venta.formaPago}</span></td>
                <td><span class="${estadoClass}">${venta.estadoVenta}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewVenta(${venta.idVenta})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editVenta(${venta.idVenta})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteVenta(${venta.idVenta})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewVenta(id) {
    const venta = ventas.find(v => v.idVenta === id);
    if (!venta) return;
    
    const clienteNombre = venta.cliente ? 
        `${venta.cliente.nombre} ${venta.cliente.apellidoP}` : 'N/A';
    const fecha = venta.fechaVenta ? 
        new Date(venta.fechaVenta).toLocaleDateString() : 'N/A';
    const total = venta.total ? `$${parseFloat(venta.total).toFixed(2)}` : 'N/A';
    
    const detalleHTML = `
        <div class="modal fade" id="modalDetalleVenta" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="fas fa-receipt"></i> Detalle de Venta #${venta.idVenta}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-2">
                            <div class="col-6"><strong>Cliente:</strong></div>
                            <div class="col-6">${clienteNombre}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-6"><strong>Fecha:</strong></div>
                            <div class="col-6">${fecha}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-6"><strong>Forma de Pago:</strong></div>
                            <div class="col-6">${venta.formaPago}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-6"><strong>Canal:</strong></div>
                            <div class="col-6">${venta.canalVenta || 'N/A'}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-6"><strong>Estado:</strong></div>
                            <div class="col-6"><span class="badge bg-success">${venta.estadoVenta}</span></div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-6"><strong>Total:</strong></div>
                            <div class="col-6"><h4>${total}</h4></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal anterior si existe
    const modalAnterior = document.getElementById('modalDetalleVenta');
    if (modalAnterior) modalAnterior.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', detalleHTML);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalDetalleVenta'));
    modal.show();
    
    // Limpiar modal al cerrar
    document.getElementById('modalDetalleVenta').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

function editVenta(id) {
    const venta = ventas.find(v => v.idVenta === id);
    if (!venta) return;

    editandoVentaId = id;
    
    if (venta.cliente && venta.cliente.idCliente) {
        document.getElementById('ventaCliente').value = venta.cliente.idCliente;
    }
    
    if (venta.fechaVenta) {
        const fecha = new Date(venta.fechaVenta);
        document.getElementById('ventaFecha').value = fecha.toISOString().split('T')[0];
    }
    
    document.getElementById('ventaFormaPago').value = venta.formaPago || '';
    document.getElementById('ventaCanal').value = venta.canalVenta || '';
    document.getElementById('ventaTotal').value = venta.total || '';
    document.getElementById('ventaEstado').value = venta.estadoVenta || 'PENDIENTE';
    
    const submitButton = document.querySelector('#formVenta button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Venta';
    
    document.getElementById('formVenta').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetVentaForm() {
    const form = document.getElementById('formVenta');
    form.reset();
    editandoVentaId = null;
    
    limpiarErroresValidacionVenta();
    
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Guardar Venta';
}

function limpiarErroresValidacionVenta() {
    document.querySelectorAll('#formVenta .is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('#formVenta .invalid-feedback').forEach(el => el.remove());
}

function mostrarErrorCampoVenta(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    if (!campo) return;
    
    campo.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = mensaje;
    campo.parentNode.appendChild(errorDiv);
}

function validarVenta(ventaData) {
    limpiarErroresValidacionVenta();
    let esValido = true;
    
    if (!ventaData.cliente || !ventaData.cliente.idCliente) {
        mostrarErrorCampoVenta('ventaCliente', 'Debe seleccionar un cliente');
        esValido = false;
    }
    
    if (!ventaData.fechaVenta) {
        mostrarErrorCampoVenta('ventaFecha', 'La fecha de venta es requerida');
        esValido = false;
    } else {
        const fechaVenta = new Date(ventaData.fechaVenta);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fechaVenta > hoy) {
            mostrarErrorCampoVenta('ventaFecha', 'La fecha de venta no puede ser futura');
            esValido = false;
        }
    }
    
    // Validar forma de pago - solo letras, espacios y guiones
    if (!ventaData.formaPago || ventaData.formaPago.trim().length === 0) {
        mostrarErrorCampoVenta('ventaFormaPago', 'La forma de pago es requerida');
        esValido = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$/.test(ventaData.formaPago)) {
        mostrarErrorCampoVenta('ventaFormaPago', 'La forma de pago solo puede contener letras, espacios y guiones');
        esValido = false;
    }
    
    // Validar canal de venta - solo letras, espacios y guiones (opcional)
    if (ventaData.canalVenta && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$/.test(ventaData.canalVenta)) {
        mostrarErrorCampoVenta('ventaCanal', 'El canal de venta solo puede contener letras, espacios y guiones');
        esValido = false;
    }
    
    // Validar total - solo números decimales positivos
    if (!ventaData.total) {
        mostrarErrorCampoVenta('ventaTotal', 'El total es requerido');
        esValido = false;
    } else {
        const total = parseFloat(ventaData.total);
        if (isNaN(total) || total <= 0) {
            mostrarErrorCampoVenta('ventaTotal', 'El total debe ser un número mayor a 0');
            esValido = false;
        } else if (total > 1000000) {
            mostrarErrorCampoVenta('ventaTotal', 'El total no puede exceder $1,000,000');
            esValido = false;
        }
    }
    
    if (!ventaData.estadoVenta) {
        mostrarErrorCampoVenta('ventaEstado', 'El estado es requerido');
        esValido = false;
    }
    
    return esValido;
}

async function deleteVenta(id) {
    if (!confirm('¿Está seguro de eliminar esta venta?')) return;

    try {
        await fetchAPI(`${ENDPOINTS.ventas}/${id}`, {
            method: 'DELETE'
        });
        showAlert('success', 'Venta eliminada exitosamente');
        loadVentas();
        loadDashboardData();
    } catch (error) {
        console.error('Error deleting venta:', error);
        showAlert('error', error.message || 'Error al eliminar venta');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formVenta');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const clienteId = document.getElementById('ventaCliente').value;
            
            const ventaData = {
                fechaVenta: document.getElementById('ventaFecha').value || null,
                formaPago: document.getElementById('ventaFormaPago').value.trim(),
                canalVenta: document.getElementById('ventaCanal').value.trim() || null,
                total: parseFloat(document.getElementById('ventaTotal').value) || 0,
                estadoVenta: document.getElementById('ventaEstado').value,
                cliente: clienteId ? { idCliente: parseInt(clienteId) } : null
            };

            if (!validarVenta(ventaData)) {
                showAlert('warning', 'Por favor, corrige los errores en el formulario');
                return;
            }

            try {
                if (editandoVentaId) {
                    await fetchAPI(`${ENDPOINTS.ventas}/${editandoVentaId}`, {
                        method: 'PUT',
                        body: JSON.stringify(ventaData)
                    });
                    showAlert('success', 'Venta actualizada exitosamente');
                    resetVentaForm();
                } else {
                    await fetchAPI(ENDPOINTS.ventas, {
                        method: 'POST',
                        body: JSON.stringify(ventaData)
                    });
                    showAlert('success', 'Venta creada exitosamente');
                    form.reset();
                }
                
                loadVentas();
                loadDashboardData();
            } catch (error) {
                console.error('Error saving venta:', error);
                
                if (error.errors) {
                    const mapaCampos = {
                        'fechaVenta': 'ventaFecha',
                        'formaPago': 'ventaFormaPago',
                        'canalVenta': 'ventaCanal',
                        'total': 'ventaTotal',
                        'estadoVenta': 'ventaEstado',
                        'cliente': 'ventaCliente'
                    };
                    
                    Object.entries(error.errors).forEach(([campo, mensaje]) => {
                        const campoId = mapaCampos[campo];
                        if (campoId) {
                            mostrarErrorCampoVenta(campoId, mensaje);
                        }
                    });
                    
                    showAlert('error', error.message || 'Error de validación');
                } else {
                    showAlert('error', error.message || 'Error al guardar venta');
                }
            }
        });
    }

    const buscarInput = document.getElementById('buscarVenta');
    if (buscarInput) {
        buscarInput.addEventListener('input', function(e) {
            filtrarVentas(e.target.value);
        });
    }
    
    const campos = ['ventaCliente', 'ventaFecha', 'ventaFormaPago', 'ventaCanal', 'ventaTotal', 'ventaEstado'];
    
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
