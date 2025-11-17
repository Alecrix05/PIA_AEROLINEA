let instancias = [];
let instanciasFiltradas = [];
let editandoInstanciaId = null;
let vuelosDisponibles = [];
let avionesDisponibles = [];

async function loadInstancias() {
    try {
        [instancias, vuelosDisponibles, avionesDisponibles] = await Promise.all([
            fetchAPI(ENDPOINTS.instanciasVuelo),
            fetchAPI(ENDPOINTS.vuelos),
            fetchAPI(`${API_BASE_URL}/aviones`)
        ]);
        instanciasFiltradas = instancias;
        renderInstanciasTable();
        cargarSelectsInstancia();
    } catch (error) {
        console.error('Error loading instancias:', error);
        showAlert('error', 'Error al cargar instancias de vuelo');
    }
}

function cargarSelectsInstancia() {
    // Cargar vuelos
    const selectVuelo = document.getElementById('instanciaVuelo');
    if (selectVuelo) {
        selectVuelo.innerHTML = '<option value="">Seleccione un vuelo</option>' +
            vuelosDisponibles.map(v => 
                `<option value="${v.idVuelo}">${v.numeroVuelo} - ${v.duracion || 'N/A'}</option>`
            ).join('');
    }
    
    // Cargar aviones
    const selectAvion = document.getElementById('instanciaAvion');
    if (selectAvion) {
        selectAvion.innerHTML = '<option value="">Seleccione un avión</option>' +
            avionesDisponibles.map(a => 
                `<option value="${a.idAvion}">${a.modelo} (${a.matricula}) - Cap: ${a.capacidad}</option>`
            ).join('');
    }
}

function filtrarInstancias(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase().trim();
    
    if (!texto) {
        instanciasFiltradas = instancias;
    } else {
        instanciasFiltradas = instancias.filter(instancia => {
            const vuelo = instancia.vuelo ? instancia.vuelo.numeroVuelo.toLowerCase() : '';
            const estado = (instancia.estadoVuelo || '').toLowerCase();
            const avion = instancia.avion ? instancia.avion.matricula.toLowerCase() : '';
            
            return vuelo.includes(texto) || 
                   estado.includes(texto) || 
                   avion.includes(texto);
        });
    }
    
    renderInstanciasTable();
}

function renderInstanciasTable() {
    const tbody = document.getElementById('tablaInstancias');
    if (!tbody) return;

    if (instanciasFiltradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron instancias de vuelo</td></tr>';
        return;
    }

    tbody.innerHTML = instanciasFiltradas.map(instancia => {
        const vuelo = instancia.vuelo ? instancia.vuelo.numeroVuelo : 'N/A';
        const avion = instancia.avion ? `${instancia.avion.modelo} (${instancia.avion.matricula})` : 'N/A';
        const salida = instancia.fechaSalida ? 
            new Date(instancia.fechaSalida).toLocaleString() : 'N/A';
        const llegada = instancia.fechaLlegada ? 
            new Date(instancia.fechaLlegada).toLocaleString() : 'N/A';
        const estadoClass = {
            'PROGRAMADO': 'badge bg-info',
            'EN_VUELO': 'badge bg-warning',
            'COMPLETADO': 'badge bg-success',
            'CANCELADO': 'badge bg-danger',
            'RETRASADO': 'badge bg-warning'
        }[instancia.estadoVuelo] || 'badge bg-secondary';
        
        return `
            <tr>
                <td>${instancia.idInstanciaVuelo}</td>
                <td><strong>${vuelo}</strong></td>
                <td>${avion}</td>
                <td><small>${salida}</small></td>
                <td><small>${llegada}</small></td>
                <td><span class="${estadoClass}">${instancia.estadoVuelo}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editInstancia(${instancia.idInstanciaVuelo})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteInstancia(${instancia.idInstanciaVuelo})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editInstancia(id) {
    const instancia = instancias.find(i => i.idInstanciaVuelo === id);
    if (!instancia) return;

    editandoInstanciaId = id;
    
    if (instancia.vuelo && instancia.vuelo.idVuelo) {
        document.getElementById('instanciaVuelo').value = instancia.vuelo.idVuelo;
    }
    
    if (instancia.avion && instancia.avion.idAvion) {
        document.getElementById('instanciaAvion').value = instancia.avion.idAvion;
    }
    
    if (instancia.fechaSalida) {
        const fecha = new Date(instancia.fechaSalida);
        document.getElementById('instanciaFechaSalida').value = fecha.toISOString().slice(0, 16);
    }
    
    if (instancia.fechaLlegada) {
        const fecha = new Date(instancia.fechaLlegada);
        document.getElementById('instanciaFechaLlegada').value = fecha.toISOString().slice(0, 16);
    }
    
    document.getElementById('instanciaEstado').value = instancia.estadoVuelo || 'PROGRAMADO';
    
    const submitButton = document.querySelector('#formInstancia button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Instancia';
    
    document.getElementById('formInstancia').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetInstanciaForm() {
    const form = document.getElementById('formInstancia');
    form.reset();
    editandoInstanciaId = null;
    
    limpiarErroresValidacionInstancia();
    
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<i class="fas fa-save"></i> Guardar Instancia';
}

function limpiarErroresValidacionInstancia() {
    document.querySelectorAll('#formInstancia .is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('#formInstancia .invalid-feedback').forEach(el => el.remove());
}

function mostrarErrorCampoInstancia(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    if (!campo) return;
    
    campo.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = mensaje;
    campo.parentNode.appendChild(errorDiv);
}

function validarInstancia(instanciaData) {
    limpiarErroresValidacionInstancia();
    let esValido = true;
    
    if (!instanciaData.vuelo || !instanciaData.vuelo.idVuelo) {
        mostrarErrorCampoInstancia('instanciaVuelo', 'Debe seleccionar un vuelo');
        esValido = false;
    }
    
    if (!instanciaData.avion || !instanciaData.avion.idAvion) {
        mostrarErrorCampoInstancia('instanciaAvion', 'Debe seleccionar un avión');
        esValido = false;
    }
    
    if (!instanciaData.fechaSalida) {
        mostrarErrorCampoInstancia('instanciaFechaSalida', 'La fecha de salida es requerida');
        esValido = false;
    }
    
    if (!instanciaData.fechaLlegada) {
        mostrarErrorCampoInstancia('instanciaFechaLlegada', 'La fecha de llegada es requerida');
        esValido = false;
    }
    
    if (instanciaData.fechaSalida && instanciaData.fechaLlegada) {
        const salida = new Date(instanciaData.fechaSalida);
        const llegada = new Date(instanciaData.fechaLlegada);
        if (llegada <= salida) {
            mostrarErrorCampoInstancia('instanciaFechaLlegada', 'La fecha de llegada debe ser posterior a la de salida');
            esValido = false;
        }
    }
    
    if (!instanciaData.estadoVuelo) {
        mostrarErrorCampoInstancia('instanciaEstado', 'Debe seleccionar un estado');
        esValido = false;
    }
    
    return esValido;
}

async function deleteInstancia(id) {
    if (!confirm('¿Está seguro de eliminar esta instancia de vuelo?')) return;

    try {
        await fetchAPI(`${ENDPOINTS.instanciasVuelo}/${id}`, {
            method: 'DELETE'
        });
        showAlert('success', 'Instancia de vuelo eliminada exitosamente');
        loadInstancias();
        loadDashboardData();
    } catch (error) {
        console.error('Error deleting instancia:', error);
        showAlert('error', error.message || 'Error al eliminar instancia');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formInstancia');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const vueloId = document.getElementById('instanciaVuelo').value;
            const avionId = document.getElementById('instanciaAvion').value;
            
            const instanciaData = {
                fechaSalida: document.getElementById('instanciaFechaSalida').value || null,
                fechaLlegada: document.getElementById('instanciaFechaLlegada').value || null,
                estadoVuelo: document.getElementById('instanciaEstado').value,
                vuelo: vueloId ? { idVuelo: parseInt(vueloId) } : null,
                avion: avionId ? { idAvion: parseInt(avionId) } : null
            };

            if (!validarInstancia(instanciaData)) {
                showAlert('warning', 'Por favor, corrige los errores en el formulario');
                return;
            }

            try {
                if (editandoInstanciaId) {
                    await fetchAPI(`${ENDPOINTS.instanciasVuelo}/${editandoInstanciaId}`, {
                        method: 'PUT',
                        body: JSON.stringify(instanciaData)
                    });
                    showAlert('success', 'Instancia actualizada exitosamente');
                    resetInstanciaForm();
                } else {
                    await fetchAPI(ENDPOINTS.instanciasVuelo, {
                        method: 'POST',
                        body: JSON.stringify(instanciaData)
                    });
                    showAlert('success', 'Instancia creada exitosamente');
                    form.reset();
                }
                
                loadInstancias();
                loadDashboardData();
            } catch (error) {
                console.error('Error saving instancia:', error);
                
                if (error.errors) {
                    const mapaCampos = {
                        'fechaSalida': 'instanciaFechaSalida',
                        'fechaLlegada': 'instanciaFechaLlegada',
                        'estadoVuelo': 'instanciaEstado',
                        'vuelo': 'instanciaVuelo',
                        'avion': 'instanciaAvion'
                    };
                    
                    Object.entries(error.errors).forEach(([campo, mensaje]) => {
                        const campoId = mapaCampos[campo];
                        if (campoId) {
                            mostrarErrorCampoInstancia(campoId, mensaje);
                        }
                    });
                    
                    showAlert('error', error.message || 'Error de validación');
                } else {
                    showAlert('error', error.message || 'Error al guardar instancia');
                }
            }
        });
    }

    const buscarInput = document.getElementById('buscarInstancia');
    if (buscarInput) {
        buscarInput.addEventListener('input', function(e) {
            filtrarInstancias(e.target.value);
        });
    }
    
    const campos = ['instanciaVuelo', 'instanciaAvion', 'instanciaFechaSalida', 
                    'instanciaFechaLlegada', 'instanciaEstado'];
    
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
