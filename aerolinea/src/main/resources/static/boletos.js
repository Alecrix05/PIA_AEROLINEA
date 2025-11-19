let boletos = [];
let boletosFiltrados = [];
let editandoBoletoId = null;
let pasajerosDisponibles = [];
let reservasDisponibles = [];
let instanciasDisponibles = [];

async function loadBoletos() {
    try {
        [boletos, pasajerosDisponibles, reservasDisponibles, instanciasDisponibles] = await Promise.all([
            fetchAPI(ENDPOINTS.boletos),
            fetchAPI(ENDPOINTS.pasajeros),
            fetchAPI(ENDPOINTS.reservas),
            fetchAPI(ENDPOINTS.instanciasVuelo)
        ]);
        boletosFiltrados = boletos;
        renderBoletosTable();
        cargarSelectsBoleto();
    } catch (error) {
        console.error('Error loading boletos:', error);
        showAlert('error', 'Error al cargar boletos');
    }
}

function cargarSelectsBoleto() {
    // Cargar pasajeros
    const selectPasajero = document.getElementById('boletoPasajero');
    if (selectPasajero) {
        selectPasajero.innerHTML = '<option value="">Seleccione un pasajero</option>' +
            pasajerosDisponibles.map(p => 
                `<option value="${p.idPasajero}">${p.nombre} ${p.apellidoP} - ${p.pasaporte || 'Sin pasaporte'}</option>`
            ).join('');
    }
    
    // Cargar reservas
    const selectReserva = document.getElementById('boletoReserva');
    if (selectReserva) {
        selectReserva.innerHTML = '<option value="">Seleccione una reserva</option>' +
            reservasDisponibles.map(r => 
                `<option value="${r.idReserva}">${r.codigoReserva} - ${r.estado}</option>`
            ).join('');
    }
    
    // Cargar instancias de vuelo
    const selectInstancia = document.getElementById('boletoInstancia');
    if (selectInstancia) {
        selectInstancia.innerHTML = '<option value="">Seleccione una instancia de vuelo</option>' +
            instanciasDisponibles.map(i => {
                const vuelo = i.vuelo ? i.vuelo.numeroVuelo : 'N/A';
                const fecha = i.fechaSalida ? new Date(i.fechaSalida).toLocaleDateString() : '';
                return `<option value="${i.idInstanciaVuelo}">Vuelo ${vuelo} - ${fecha}</option>`;
            }).join('');
    }
}

function filtrarBoletos(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        boletosFiltrados = boletos;
    } else {
        boletosFiltrados = boletos.filter(boleto => {
            const numero = (boleto.numeroBoleto || '').toLowerCase();
            const estado = (boleto.estado || '').toLowerCase();
            const clase = (boleto.clase || '').toLowerCase();
            const pasajero = boleto.pasajero ? 
                `${boleto.pasajero.nombre} ${boleto.pasajero.apellidoP}`.toLowerCase() : '';
            
            return numero.includes(texto) || 
                   estado.includes(texto) || 
                   clase.includes(texto) ||
                   pasajero.includes(texto);
        });
    }
    
    renderBoletosTable();
}

function renderBoletosTable() {
    const tbody = document.getElementById('tablaBoletos');
    if (!tbody) return;

    if (boletosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron boletos</td></tr>';
        return;
    }

    tbody.innerHTML = boletosFiltrados.map(boleto => {
        const pasajeroNombre = boleto.pasajero ? 
            `${boleto.pasajero.nombre} ${boleto.pasajero.apellidoP}` : 'N/A';
        const fecha = boleto.fechaEmision ? 
            new Date(boleto.fechaEmision).toLocaleDateString() : 'N/A';
        const precio = boleto.precio ? `$${boleto.precio}` : 'N/A';
        const estadoClass = {
            'EMITIDO': 'badge bg-success',
            'USADO': 'badge bg-secondary',
            'CANCELADO': 'badge bg-danger'
        }[boleto.estado] || 'badge bg-secondary';
        
        return `
            <tr>
                <td>${boleto.idBoleto}</td>
                <td><strong>${boleto.numeroBoleto}</strong></td>
                <td>${pasajeroNombre}</td>
                <td>${fecha}</td>
                <td>${precio}</td>
                <td><span class="badge bg-info">${boleto.clase}</span></td>
                <td><span class="${estadoClass}">${boleto.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editBoleto(${boleto.idBoleto})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBoleto(${boleto.idBoleto})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editBoleto(id) {
    const boleto = boletos.find(b => b.idBoleto === id);
    if (!boleto) return;

    editandoBoletoId = id;
    
    document.getElementById('boletoNumero').value = boleto.numeroBoleto || '';
    
    if (boleto.pasajero && boleto.pasajero.idPasajero) {
        document.getElementById('boletoPasajero').value = boleto.pasajero.idPasajero;
    }
    
    if (boleto.reserva && boleto.reserva.idReserva) {
        document.getElementById('boletoReserva').value = boleto.reserva.idReserva;
    }
    
    if (boleto.instanciaVuelo && boleto.instanciaVuelo.idInstanciaVuelo) {
        document.getElementById('boletoInstancia').value = boleto.instanciaVuelo.idInstanciaVuelo;
    }
    
    if (boleto.fechaEmision) {
        const fecha = new Date(boleto.fechaEmision);
        document.getElementById('boletoFecha').value = fecha.toISOString().split('T')[0];
    }
    
    document.getElementById('boletoPrecio').value = boleto.precio || '';
    document.getElementById('boletoClase').value = boleto.clase || 'ECONOMICA';
    document.getElementById('boletoEstado').value = boleto.estado || 'EMITIDO';
    
    const submitButton = document.querySelector('#formBoleto button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Boleto';
    
    document.getElementById('formBoleto').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetBoletoForm() {
    const form = document.getElementById('formBoleto');
    form.reset();
    editandoBoletoId = null;
    
    limpiarErroresValidacionBoleto();
    
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Guardar Boleto';
    
    // Generar nuevo número de boleto
    generarNumeroBoleto();
}

function limpiarErroresValidacionBoleto() {
    document.querySelectorAll('#formBoleto .is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('#formBoleto .invalid-feedback').forEach(el => el.remove());
}

function mostrarErrorCampoBoleto(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    if (!campo) return;
    
    campo.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = mensaje;
    campo.parentNode.appendChild(errorDiv);
}

function generarNumeroBoleto() {
    const fecha = new Date();
    const numero = `BLT-${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    document.getElementById('boletoNumero').value = numero;
}

function validarBoleto(boletoData) {
    limpiarErroresValidacionBoleto();
    let esValido = true;
    
    // Validar número de boleto - alfanumérico con guiones
    if (!boletoData.numeroBoleto || boletoData.numeroBoleto.trim().length === 0) {
        mostrarErrorCampoBoleto('boletoNumero', 'El número de boleto es requerido');
        esValido = false;
    } else if (!/^[a-zA-Z0-9\-]+$/.test(boletoData.numeroBoleto)) {
        mostrarErrorCampoBoleto('boletoNumero', 'El número de boleto solo puede contener letras, números y guiones');
        esValido = false;
    }
    
    if (!boletoData.pasajero || !boletoData.pasajero.idPasajero) {
        mostrarErrorCampoBoleto('boletoPasajero', 'Debe seleccionar un pasajero');
        esValido = false;
    }
    
    if (!boletoData.fechaEmision) {
        mostrarErrorCampoBoleto('boletoFecha', 'La fecha de emisión es requerida');
        esValido = false;
    } else {
        const fechaEmision = new Date(boletoData.fechaEmision);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fechaEmision > hoy) {
            mostrarErrorCampoBoleto('boletoFecha', 'La fecha de emisión no puede ser futura');
            esValido = false;
        }
    }
    
    // Validar precio - solo números decimales positivos
    if (!boletoData.precio) {
        mostrarErrorCampoBoleto('boletoPrecio', 'El precio es requerido');
        esValido = false;
    } else {
        const precio = parseFloat(boletoData.precio);
        if (isNaN(precio) || precio <= 0) {
            mostrarErrorCampoBoleto('boletoPrecio', 'El precio debe ser un número mayor a 0');
            esValido = false;
        } else if (precio > 100000) {
            mostrarErrorCampoBoleto('boletoPrecio', 'El precio no puede exceder $100,000');
            esValido = false;
        }
    }
    
    if (!boletoData.clase) {
        mostrarErrorCampoBoleto('boletoClase', 'Debe seleccionar una clase');
        esValido = false;
    }
    
    if (!boletoData.estado) {
        mostrarErrorCampoBoleto('boletoEstado', 'Debe seleccionar un estado');
        esValido = false;
    }
    
    return esValido;
}

async function deleteBoleto(id) {
    if (!confirm('¿Está seguro de eliminar este boleto?')) return;

    try {
        await fetchAPI(`${ENDPOINTS.boletos}/${id}`, {
            method: 'DELETE'
        });
        showAlert('success', 'Boleto eliminado exitosamente');
        loadBoletos();
        loadDashboardData();
    } catch (error) {
        console.error('Error deleting boleto:', error);
        showAlert('error', error.message || 'Error al eliminar boleto');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formBoleto');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const pasajeroId = document.getElementById('boletoPasajero').value;
            const reservaId = document.getElementById('boletoReserva').value;
            const instanciaId = document.getElementById('boletoInstancia').value;
            
            const boletoData = {
                numeroBoleto: document.getElementById('boletoNumero').value.trim(),
                fechaEmision: document.getElementById('boletoFecha').value || null,
                precio: parseFloat(document.getElementById('boletoPrecio').value) || 0,
                clase: document.getElementById('boletoClase').value,
                estado: document.getElementById('boletoEstado').value,
                pasajero: pasajeroId ? { idPasajero: parseInt(pasajeroId) } : null,
                reserva: reservaId ? { idReserva: parseInt(reservaId) } : null,
                instanciaVuelo: instanciaId ? { idInstanciaVuelo: parseInt(instanciaId) } : null
            };

            if (!validarBoleto(boletoData)) {
                showAlert('warning', 'Por favor, corrige los errores en el formulario');
                return;
            }

            try {
                if (editandoBoletoId) {
                    await fetchAPI(`${ENDPOINTS.boletos}/${editandoBoletoId}`, {
                        method: 'PUT',
                        body: JSON.stringify(boletoData)
                    });
                    showAlert('success', 'Boleto actualizado exitosamente');
                    resetBoletoForm();
                } else {
                    await fetchAPI(ENDPOINTS.boletos, {
                        method: 'POST',
                        body: JSON.stringify(boletoData)
                    });
                    showAlert('success', 'Boleto creado exitosamente');
                    form.reset();
                    generarNumeroBoleto();
                }
                
                loadBoletos();
                loadDashboardData();
            } catch (error) {
                console.error('Error saving boleto:', error);
                
                if (error.errors) {
                    const mapaCampos = {
                        'numeroBoleto': 'boletoNumero',
                        'fechaEmision': 'boletoFecha',
                        'precio': 'boletoPrecio',
                        'clase': 'boletoClase',
                        'estado': 'boletoEstado',
                        'pasajero': 'boletoPasajero'
                    };
                    
                    Object.entries(error.errors).forEach(([campo, mensaje]) => {
                        const campoId = mapaCampos[campo];
                        if (campoId) {
                            mostrarErrorCampoBoleto(campoId, mensaje);
                        }
                    });
                    
                    showAlert('error', error.message || 'Error de validación');
                } else {
                    showAlert('error', error.message || 'Error al guardar boleto');
                }
            }
        });
        
        // Generar número automáticamente al cargar
        generarNumeroBoleto();
    }

    const buscarInput = document.getElementById('buscarBoleto');
    if (buscarInput) {
        buscarInput.addEventListener('input', function(e) {
            filtrarBoletos(e.target.value);
        });
    }
    
    const campos = ['boletoNumero', 'boletoPasajero', 'boletoReserva', 'boletoInstancia',
                    'boletoFecha', 'boletoPrecio', 'boletoClase', 'boletoEstado'];
    
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
