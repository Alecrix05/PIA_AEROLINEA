let clientes = [];
let clientesFiltrados = [];
let editandoClienteId = null;

async function loadClientes() {
    try {
        clientes = await fetchAPI(ENDPOINTS.clientes);
        clientesFiltrados = clientes;
        renderClientesTable();
    } catch (error) {
        console.error('Error loading clientes:', error);
    }
}

function filtrarClientes(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        clientesFiltrados = clientes;
    } else {
        clientesFiltrados = clientes.filter(cliente => {
            const nombreCompleto = `${cliente.nombre} ${cliente.apellidoP} ${cliente.apellidoM || ''}`.toLowerCase();
            const correo = (cliente.correo || '').toLowerCase();
            const ciudad = (cliente.ciudad || '').toLowerCase();
            const telefono = (cliente.telefono || '').toLowerCase();
            
            return nombreCompleto.includes(texto) || 
                   correo.includes(texto) || 
                   ciudad.includes(texto) ||
                   telefono.includes(texto);
        });
    }
    
    renderClientesTable();
}

function renderClientesTable() {
    const tbody = document.getElementById('tablaClientes');
    if (!tbody) return;

    if (clientesFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron clientes</td></tr>';
        return;
    }

    tbody.innerHTML = clientesFiltrados.map(cliente => {
        const nombreCompleto = `${cliente.nombre} ${cliente.apellidoP} ${cliente.apellidoM || ''}`.trim();
        const ciudad = cliente.ciudad || 'N/A';
        
        return `
            <tr>
                <td>${cliente.idCliente}</td>
                <td>${nombreCompleto}</td>
                <td>${cliente.correo}</td>
                <td>${cliente.telefono || 'N/A'}</td>
                <td>${ciudad}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editCliente(${cliente.idCliente})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCliente(${cliente.idCliente})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editCliente(id) {
    const cliente = clientes.find(c => c.idCliente === id);
    if (!cliente) return;

    editandoClienteId = id;
    
    // Llenar el formulario con los datos del cliente
    document.getElementById('clienteNombre').value = cliente.nombre || '';
    document.getElementById('clienteApellidoP').value = cliente.apellidoP || '';
    document.getElementById('clienteApellidoM').value = cliente.apellidoM || '';
    document.getElementById('clienteCorreo').value = cliente.correo || '';
    document.getElementById('clienteTelefono').value = cliente.telefono || '';
    document.getElementById('clienteCalle').value = cliente.calle || '';
    document.getElementById('clienteNumero').value = cliente.numero || '';
    document.getElementById('clienteColonia').value = cliente.colonia || '';
    document.getElementById('clienteCiudad').value = cliente.ciudad || '';
    document.getElementById('clienteEstado').value = cliente.estado || '';
    document.getElementById('clienteCodigoPostal').value = cliente.codigoPostal || '';

    // Cambiar el texto del botón
    const submitButton = document.querySelector('#formCliente button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Cliente';
    
    // Scroll al formulario
    document.getElementById('formCliente').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetClienteForm() {
    const form = document.getElementById('formCliente');
    form.reset();
    editandoClienteId = null;
    
    // Limpiar errores de validación
    limpiarErroresValidacion();
    
    // Restaurar el texto del botón
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Guardar Cliente';
}

function limpiarErroresValidacion() {
    // Remover todas las clases de error
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    // Remover todos los mensajes de error
    document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
}

function mostrarErrorCampo(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    if (!campo) return;
    
    // Marcar el campo como inválido
    campo.classList.add('is-invalid');
    
    // Crear y agregar mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = mensaje;
    campo.parentNode.appendChild(errorDiv);
}

function validarCliente(clienteData) {
    limpiarErroresValidacion();
    let esValido = true;
    
    // Validar nombre
    if (!clienteData.nombre || clienteData.nombre.trim().length === 0) {
        mostrarErrorCampo('clienteNombre', 'El nombre es requerido');
        esValido = false;
    } else if (clienteData.nombre.length > 50) {
        mostrarErrorCampo('clienteNombre', 'El nombre no puede exceder 50 caracteres');
        esValido = false;
    }
    
    // Validar apellido paterno
    if (!clienteData.apellidoP || clienteData.apellidoP.trim().length === 0) {
        mostrarErrorCampo('clienteApellidoP', 'El apellido paterno es requerido');
        esValido = false;
    } else if (clienteData.apellidoP.length > 50) {
        mostrarErrorCampo('clienteApellidoP', 'El apellido paterno no puede exceder 50 caracteres');
        esValido = false;
    }
    
    // Validar apellido materno (opcional pero con límite)
    if (clienteData.apellidoM && clienteData.apellidoM.length > 50) {
        mostrarErrorCampo('clienteApellidoM', 'El apellido materno no puede exceder 50 caracteres');
        esValido = false;
    }
    
    // Validar correo
    if (!clienteData.correo || clienteData.correo.trim().length === 0) {
        mostrarErrorCampo('clienteCorreo', 'El correo es requerido');
        esValido = false;
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(clienteData.correo)) {
            mostrarErrorCampo('clienteCorreo', 'El correo debe ser válido (ejemplo: usuario@dominio.com)');
            esValido = false;
        } else if (clienteData.correo.length > 100) {
            mostrarErrorCampo('clienteCorreo', 'El correo no puede exceder 100 caracteres');
            esValido = false;
        }
    }
    
    // Validar teléfono (opcional pero con formato)
    if (clienteData.telefono) {
        const telefonoRegex = /^[0-9]{10,15}$/;
        if (!telefonoRegex.test(clienteData.telefono)) {
            mostrarErrorCampo('clienteTelefono', 'El teléfono debe contener entre 10 y 15 dígitos numéricos');
            esValido = false;
        }
    }
    
    // Validar código postal (opcional pero con formato)
    if (clienteData.codigoPostal && clienteData.codigoPostal.length > 10) {
        mostrarErrorCampo('clienteCodigoPostal', 'El código postal no puede exceder 10 caracteres');
        esValido = false;
    }
    
    return esValido;
}

async function deleteCliente(id) {
    if (!confirm('¿Está seguro de eliminar este cliente?')) return;

    try {
        await fetchAPI(`${ENDPOINTS.clientes}/${id}`, {
            method: 'DELETE'
        });
        showAlert('success', 'Cliente eliminado exitosamente');
        loadClientes();
        loadDashboardData();
    } catch (error) {
        console.error('Error deleting cliente:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formCliente');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Recoger TODOS los datos del formulario
            const clienteData = {
                nombre: document.getElementById('clienteNombre').value.trim(),
                apellidoP: document.getElementById('clienteApellidoP').value.trim(),
                apellidoM: document.getElementById('clienteApellidoM').value.trim() || null,
                correo: document.getElementById('clienteCorreo').value.trim(),
                telefono: document.getElementById('clienteTelefono').value.trim() || null,
                calle: document.getElementById('clienteCalle').value.trim() || null,
                numero: document.getElementById('clienteNumero').value.trim() || null,
                colonia: document.getElementById('clienteColonia').value.trim() || null,
                ciudad: document.getElementById('clienteCiudad').value.trim() || null,
                estado: document.getElementById('clienteEstado').value.trim() || null,
                codigoPostal: document.getElementById('clienteCodigoPostal').value.trim() || null
            };

            // Validar datos antes de enviar
            if (!validarCliente(clienteData)) {
                showAlert('warning', 'Por favor, corrige los errores en el formulario');
                return;
            }

            try {
                if (editandoClienteId) {
                    // Actualizar cliente existente
                    await fetchAPI(`${ENDPOINTS.clientes}/${editandoClienteId}`, {
                        method: 'PUT',
                        body: JSON.stringify(clienteData)
                    });
                    showAlert('success', 'Cliente actualizado exitosamente');
                    resetClienteForm();
                } else {
                    // Crear nuevo cliente
                    await fetchAPI(ENDPOINTS.clientes, {
                        method: 'POST',
                        body: JSON.stringify(clienteData)
                    });
                    showAlert('success', 'Cliente creado exitosamente');
                    form.reset();
                }
                
                loadClientes();
                loadDashboardData();
            } catch (error) {
                console.error('Error saving cliente:', error);
                
                // Manejar errores específicos del backend
                if (error.errors) {
                    // Errores de validación del backend
                    const mapaCampos = {
                        'nombre': 'clienteNombre',
                        'apellidoP': 'clienteApellidoP',
                        'apellidoM': 'clienteApellidoM',
                        'correo': 'clienteCorreo',
                        'telefono': 'clienteTelefono',
                        'codigoPostal': 'clienteCodigoPostal'
                    };
                    
                    Object.entries(error.errors).forEach(([campo, mensaje]) => {
                        const campoId = mapaCampos[campo];
                        if (campoId) {
                            mostrarErrorCampo(campoId, mensaje);
                        }
                    });
                    
                    showAlert('error', error.message || 'Error de validación. Verifica los campos marcados.');
                } else if (error.message) {
                    // Error general con mensaje
                    if (error.message.includes('Correo ya registrado')) {
                        mostrarErrorCampo('clienteCorreo', 'Este correo ya está registrado');
                    }
                    showAlert('error', error.message);
                } else {
                    showAlert('error', 'Error al guardar el cliente. Verifica los datos.');
                }
            }
        });
    }

    // Event listener para el buscador de clientes
    const buscarInput = document.getElementById('buscarCliente');
    if (buscarInput) {
        buscarInput.addEventListener('input', function(e) {
            filtrarClientes(e.target.value);
        });
    }
    
    // Limpiar errores cuando el usuario empieza a escribir
    const campos = ['clienteNombre', 'clienteApellidoP', 'clienteApellidoM', 'clienteCorreo', 
                    'clienteTelefono', 'clienteCalle', 'clienteNumero', 'clienteColonia', 
                    'clienteCiudad', 'clienteEstado', 'clienteCodigoPostal'];
    
    campos.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', function() {
                // Limpiar error del campo cuando empieza a escribir
                this.classList.remove('is-invalid');
                const errorDiv = this.parentNode.querySelector('.invalid-feedback');
                if (errorDiv) {
                    errorDiv.remove();
                }
            });
        }
    });
});
