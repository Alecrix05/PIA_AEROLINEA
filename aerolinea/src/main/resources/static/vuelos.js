let vuelos = [];
let vuelosFiltrados = [];
let editandoVueloId = null;
let rutasDisponibles = [];

async function loadVuelos() {
    try {
        [vuelos, rutasDisponibles] = await Promise.all([
            fetchAPI(ENDPOINTS.vuelos),
            fetchAPI(`${API_BASE_URL}/rutas`)
        ]);
        vuelosFiltrados = vuelos;
        renderVuelosTable();
        cargarRutasSelect();
    } catch (error) {
        console.error('Error loading vuelos:', error);
        showAlert('error', 'Error al cargar vuelos');
    }
}

function cargarRutasSelect() {
    const select = document.getElementById('vueloRuta');
    if (!select) return;
    
    select.innerHTML = '<option value="">Seleccione una ruta</option>' +
        rutasDisponibles.map(r => {
            const origen = r.origen ? r.origen.nombre : 'N/A';
            const destino = r.destino ? r.destino.nombre : 'N/A';
            return `<option value="${r.idRuta}">${origen} → ${destino} (${r.distancia} km)</option>`;
        }).join('');
}

function filtrarVuelos(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        vuelosFiltrados = vuelos;
    } else {
        vuelosFiltrados = vuelos.filter(vuelo => {
            const numero = (vuelo.numeroVuelo || '').toLowerCase();
            const duracion = (vuelo.duracion || '').toLowerCase();
            
            return numero.includes(texto) || duracion.includes(texto);
        });
    }
    
    renderVuelosTable();
}

function renderVuelosTable() {
    const tbody = document.getElementById('tablaVuelos');
    if (!tbody) return;

    if (vuelosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron vuelos</td></tr>';
        return;
    }

    tbody.innerHTML = vuelosFiltrados.map(vuelo => {
        let rutaInfo = 'N/A';
        if (vuelo.ruta) {
            const origen = vuelo.ruta.origen ? vuelo.ruta.origen.nombre : 'N/A';
            const destino = vuelo.ruta.destino ? vuelo.ruta.destino.nombre : 'N/A';
            rutaInfo = `${origen} → ${destino}`;
        }
        
        return `
            <tr>
                <td>${vuelo.idVuelo}</td>
                <td><strong>${vuelo.numeroVuelo}</strong></td>
                <td>${rutaInfo}</td>
                <td>${vuelo.duracion || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editVuelo(${vuelo.idVuelo})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteVuelo(${vuelo.idVuelo})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editVuelo(id) {
    const vuelo = vuelos.find(v => v.idVuelo === id);
    if (!vuelo) return;

    editandoVueloId = id;
    
    document.getElementById('vueloNumero').value = vuelo.numeroVuelo || '';
    document.getElementById('vueloDuracion').value = vuelo.duracion || '';
    
    if (vuelo.ruta && vuelo.ruta.idRuta) {
        document.getElementById('vueloRuta').value = vuelo.ruta.idRuta;
    }
    
    const submitButton = document.querySelector('#formVuelo button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Vuelo';
    
    document.getElementById('formVuelo').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetVueloForm() {
    const form = document.getElementById('formVuelo');
    form.reset();
    editandoVueloId = null;
    
    limpiarErroresValidacionVuelo();
    
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Guardar Vuelo';
}

function limpiarErroresValidacionVuelo() {
    document.querySelectorAll('#formVuelo .is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('#formVuelo .invalid-feedback').forEach(el => el.remove());
}

function mostrarErrorCampoVuelo(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    if (!campo) return;
    
    campo.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = mensaje;
    campo.parentNode.appendChild(errorDiv);
}

function validarVuelo(vueloData) {
    limpiarErroresValidacionVuelo();
    let esValido = true;
    
    if (!vueloData.numeroVuelo || vueloData.numeroVuelo.trim().length === 0) {
        mostrarErrorCampoVuelo('vueloNumero', 'El número de vuelo es requerido');
        esValido = false;
    } else if (vueloData.numeroVuelo.length > 20) {
        mostrarErrorCampoVuelo('vueloNumero', 'El número de vuelo no puede exceder 20 caracteres');
        esValido = false;
    }
    
    if (vueloData.duracion) {
        // Validar formato HH:MM:SS
        const duracionRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
        if (!duracionRegex.test(vueloData.duracion)) {
            mostrarErrorCampoVuelo('vueloDuracion', 'La duración debe tener formato HH:MM:SS (ej: 02:30:00)');
            esValido = false;
        }
    }
    
    return esValido;
}

async function deleteVuelo(id) {
    if (!confirm('¿Está seguro de eliminar este vuelo?')) return;

    try {
        await fetchAPI(`${ENDPOINTS.vuelos}/${id}`, {
            method: 'DELETE'
        });
        showAlert('success', 'Vuelo eliminado exitosamente');
        loadVuelos();
        loadDashboardData();
    } catch (error) {
        console.error('Error deleting vuelo:', error);
        showAlert('error', error.message || 'Error al eliminar vuelo');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formVuelo');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const rutaId = document.getElementById('vueloRuta').value;
            
            const vueloData = {
                numeroVuelo: document.getElementById('vueloNumero').value.trim(),
                duracion: document.getElementById('vueloDuracion').value.trim() || null,
                ruta: rutaId ? { idRuta: parseInt(rutaId) } : null
            };

            if (!validarVuelo(vueloData)) {
                showAlert('warning', 'Por favor, corrige los errores en el formulario');
                return;
            }

            try {
                if (editandoVueloId) {
                    await fetchAPI(`${ENDPOINTS.vuelos}/${editandoVueloId}`, {
                        method: 'PUT',
                        body: JSON.stringify(vueloData)
                    });
                    showAlert('success', 'Vuelo actualizado exitosamente');
                    resetVueloForm();
                } else {
                    await fetchAPI(ENDPOINTS.vuelos, {
                        method: 'POST',
                        body: JSON.stringify(vueloData)
                    });
                    showAlert('success', 'Vuelo creado exitosamente');
                    form.reset();
                }
                
                loadVuelos();
                loadDashboardData();
            } catch (error) {
                console.error('Error saving vuelo:', error);
                
                if (error.errors) {
                    const mapaCampos = {
                        'numeroVuelo': 'vueloNumero',
                        'duracion': 'vueloDuracion',
                        'ruta': 'vueloRuta'
                    };
                    
                    Object.entries(error.errors).forEach(([campo, mensaje]) => {
                        const campoId = mapaCampos[campo];
                        if (campoId) {
                            mostrarErrorCampoVuelo(campoId, mensaje);
                        }
                    });
                    
                    showAlert('error', error.message || 'Error de validación');
                } else {
                    showAlert('error', error.message || 'Error al guardar vuelo');
                }
            }
        });
    }

    const buscarInput = document.getElementById('buscarVuelo');
    if (buscarInput) {
        buscarInput.addEventListener('input', function(e) {
            filtrarVuelos(e.target.value);
        });
    }
    
    const campos = ['vueloNumero', 'vueloDuracion', 'vueloRuta'];
    
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
