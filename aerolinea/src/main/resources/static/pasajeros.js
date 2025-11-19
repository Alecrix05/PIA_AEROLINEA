let pasajeros = [];
let pasajerosFiltrados = [];
let editandoPasajeroId = null;

async function loadPasajeros() {
    try {
        pasajeros = await fetchAPI(ENDPOINTS.pasajeros);
        pasajerosFiltrados = pasajeros;
        renderPasajerosTable();
    } catch (error) {
        console.error('Error loading pasajeros:', error);
        showAlert('error', 'Error al cargar pasajeros');
    }
}

function filtrarPasajeros(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        pasajerosFiltrados = pasajeros;
    } else {
        pasajerosFiltrados = pasajeros.filter(pasajero => {
            const nombreCompleto = `${pasajero.nombre} ${pasajero.apellidoP} ${pasajero.apellidoM || ''}`.toLowerCase();
            const pasaporte = (pasajero.pasaporte || '').toLowerCase();
            const nacionalidad = (pasajero.nacionalidad || '').toLowerCase();
            
            return nombreCompleto.includes(texto) || 
                   pasaporte.includes(texto) || 
                   nacionalidad.includes(texto);
        });
    }
    
    renderPasajerosTable();
}

function renderPasajerosTable() {
    const tbody = document.getElementById('tablaPasajeros');
    if (!tbody) return;

    if (pasajerosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron pasajeros</td></tr>';
        return;
    }

    tbody.innerHTML = pasajerosFiltrados.map(pasajero => {
        const nombreCompleto = `${pasajero.nombre} ${pasajero.apellidoP} ${pasajero.apellidoM || ''}`.trim();
        const fechaNac = pasajero.fechaNacimiento ? new Date(pasajero.fechaNacimiento).toLocaleDateString() : 'N/A';
        
        return `
            <tr>
                <td>${pasajero.idPasajero}</td>
                <td>${nombreCompleto}</td>
                <td>${pasajero.pasaporte || 'N/A'}</td>
                <td>${fechaNac}</td>
                <td>${pasajero.nacionalidad || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editPasajero(${pasajero.idPasajero})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletePasajero(${pasajero.idPasajero})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editPasajero(id) {
    const pasajero = pasajeros.find(p => p.idPasajero === id);
    if (!pasajero) return;

    editandoPasajeroId = id;
    
    document.getElementById('pasajeroNombre').value = pasajero.nombre || '';
    document.getElementById('pasajeroApellidoP').value = pasajero.apellidoP || '';
    document.getElementById('pasajeroApellidoM').value = pasajero.apellidoM || '';
    
    if (pasajero.fechaNacimiento) {
        const fecha = new Date(pasajero.fechaNacimiento);
        document.getElementById('pasajeroFechaNac').value = fecha.toISOString().split('T')[0];
    }
    
    document.getElementById('pasajeroNacionalidad').value = pasajero.nacionalidad || '';
    document.getElementById('pasajeroPasaporte').value = pasajero.pasaporte || '';
    
    const submitButton = document.querySelector('#formPasajero button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Pasajero';
    
    document.getElementById('formPasajero').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetPasajeroForm() {
    const form = document.getElementById('formPasajero');
    form.reset();
    editandoPasajeroId = null;
    
    limpiarErroresValidacionPasajero();
    
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Guardar Pasajero';
}

function limpiarErroresValidacionPasajero() {
    document.querySelectorAll('#formPasajero .is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('#formPasajero .invalid-feedback').forEach(el => el.remove());
}

function mostrarErrorCampoPasajero(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    if (!campo) return;
    
    campo.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = mensaje;
    campo.parentNode.appendChild(errorDiv);
}

function validarPasajero(pasajeroData) {
    limpiarErroresValidacionPasajero();
    let esValido = true;
    
    // Validar nombre - solo letras y espacios
    if (!pasajeroData.nombre || pasajeroData.nombre.trim().length === 0) {
        mostrarErrorCampoPasajero('pasajeroNombre', 'El nombre es requerido');
        esValido = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(pasajeroData.nombre)) {
        mostrarErrorCampoPasajero('pasajeroNombre', 'El nombre solo puede contener letras y espacios');
        esValido = false;
    } else if (pasajeroData.nombre.length > 50) {
        mostrarErrorCampoPasajero('pasajeroNombre', 'El nombre no puede exceder 50 caracteres');
        esValido = false;
    }
    
    // Validar apellido paterno - solo letras y espacios
    if (!pasajeroData.apellidoP || pasajeroData.apellidoP.trim().length === 0) {
        mostrarErrorCampoPasajero('pasajeroApellidoP', 'El apellido paterno es requerido');
        esValido = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(pasajeroData.apellidoP)) {
        mostrarErrorCampoPasajero('pasajeroApellidoP', 'El apellido paterno solo puede contener letras y espacios');
        esValido = false;
    } else if (pasajeroData.apellidoP.length > 50) {
        mostrarErrorCampoPasajero('pasajeroApellidoP', 'El apellido paterno no puede exceder 50 caracteres');
        esValido = false;
    }
    
    // Validar apellido materno - solo letras y espacios (opcional)
    if (pasajeroData.apellidoM) {
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(pasajeroData.apellidoM)) {
            mostrarErrorCampoPasajero('pasajeroApellidoM', 'El apellido materno solo puede contener letras y espacios');
            esValido = false;
        } else if (pasajeroData.apellidoM.length > 50) {
            mostrarErrorCampoPasajero('pasajeroApellidoM', 'El apellido materno no puede exceder 50 caracteres');
            esValido = false;
        }
    }
    
    // Validar fecha de nacimiento
    if (!pasajeroData.fechaNacimiento) {
        mostrarErrorCampoPasajero('pasajeroFechaNac', 'La fecha de nacimiento es requerida');
        esValido = false;
    } else {
        const fechaNac = new Date(pasajeroData.fechaNacimiento);
        const hoy = new Date();
        if (fechaNac > hoy) {
            mostrarErrorCampoPasajero('pasajeroFechaNac', 'La fecha de nacimiento no puede ser futura');
            esValido = false;
        }
    }
    
    // Validar nacionalidad - solo letras y espacios (opcional)
    if (pasajeroData.nacionalidad && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(pasajeroData.nacionalidad)) {
        mostrarErrorCampoPasajero('pasajeroNacionalidad', 'La nacionalidad solo puede contener letras y espacios');
        esValido = false;
    }
    
    // Validar pasaporte - alfanumérico (opcional)
    if (pasajeroData.pasaporte) {
        if (!/^[a-zA-Z0-9]+$/.test(pasajeroData.pasaporte)) {
            mostrarErrorCampoPasajero('pasajeroPasaporte', 'El pasaporte solo puede contener letras y números sin espacios');
            esValido = false;
        } else if (pasajeroData.pasaporte.length > 50) {
            mostrarErrorCampoPasajero('pasajeroPasaporte', 'El pasaporte no puede exceder 50 caracteres');
            esValido = false;
        }
    }
    
    return esValido;
}

async function deletePasajero(id) {
    if (!confirm('¿Está seguro de eliminar este pasajero?')) return;

    try {
        await fetchAPI(`${ENDPOINTS.pasajeros}/${id}`, {
            method: 'DELETE'
        });
        showAlert('success', 'Pasajero eliminado exitosamente');
        loadPasajeros();
    } catch (error) {
        console.error('Error deleting pasajero:', error);
        showAlert('error', error.message || 'Error al eliminar pasajero');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formPasajero');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const pasajeroData = {
                nombre: document.getElementById('pasajeroNombre').value.trim(),
                apellidoP: document.getElementById('pasajeroApellidoP').value.trim(),
                apellidoM: document.getElementById('pasajeroApellidoM').value.trim() || null,
                fechaNacimiento: document.getElementById('pasajeroFechaNac').value || null,
                nacionalidad: document.getElementById('pasajeroNacionalidad').value.trim() || null,
                pasaporte: document.getElementById('pasajeroPasaporte').value.trim() || null
            };

            if (!validarPasajero(pasajeroData)) {
                showAlert('warning', 'Por favor, corrige los errores en el formulario');
                return;
            }

            try {
                if (editandoPasajeroId) {
                    await fetchAPI(`${ENDPOINTS.pasajeros}/${editandoPasajeroId}`, {
                        method: 'PUT',
                        body: JSON.stringify(pasajeroData)
                    });
                    showAlert('success', 'Pasajero actualizado exitosamente');
                    resetPasajeroForm();
                } else {
                    await fetchAPI(ENDPOINTS.pasajeros, {
                        method: 'POST',
                        body: JSON.stringify(pasajeroData)
                    });
                    showAlert('success', 'Pasajero creado exitosamente');
                    form.reset();
                }
                
                loadPasajeros();
            } catch (error) {
                console.error('Error saving pasajero:', error);
                
                if (error.errors) {
                    const mapaCampos = {
                        'nombre': 'pasajeroNombre',
                        'apellidoP': 'pasajeroApellidoP',
                        'apellidoM': 'pasajeroApellidoM',
                        'fechaNacimiento': 'pasajeroFechaNac',
                        'nacionalidad': 'pasajeroNacionalidad',
                        'pasaporte': 'pasajeroPasaporte'
                    };
                    
                    Object.entries(error.errors).forEach(([campo, mensaje]) => {
                        const campoId = mapaCampos[campo];
                        if (campoId) {
                            mostrarErrorCampoPasajero(campoId, mensaje);
                        }
                    });
                    
                    showAlert('error', error.message || 'Error de validación');
                } else {
                    showAlert('error', error.message || 'Error al guardar pasajero');
                }
            }
        });
    }

    const buscarInput = document.getElementById('buscarPasajero');
    if (buscarInput) {
        buscarInput.addEventListener('input', function(e) {
            filtrarPasajeros(e.target.value);
        });
    }
    
    const campos = ['pasajeroNombre', 'pasajeroApellidoP', 'pasajeroApellidoM', 
                    'pasajeroFechaNac', 'pasajeroNacionalidad', 'pasajeroPasaporte'];
    
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
