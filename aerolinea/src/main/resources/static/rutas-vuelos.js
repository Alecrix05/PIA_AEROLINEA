// ============================================
// MÓDULO UNIFICADO: GESTIÓN DE RUTAS Y VUELOS
// Incluye: Rutas, Vuelos e Instancias de Vuelo
// ============================================

import { API_BASE_URL } from './config.js';
import { validarSoloLetrasYNumeros, validarSoloNumeros, validarDecimal, validarFecha, validarHora } from './validaciones.js';

// ============================================
// RUTAS
// ============================================
let rutaIdActual = null;

export async function cargarRutas() {
    try {
        const response = await fetch(`${API_BASE_URL}/rutas`);
        const rutas = await response.json();
        
        const tbody = document.getElementById('tablaRutas');
        tbody.innerHTML = '';
        
        rutas.forEach(ruta => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ruta.idRuta}</td>
                <td>${ruta.aeropuertoOrigen?.nombre || 'N/A'} (${ruta.aeropuertoOrigen?.codigoIATA || ''})</td>
                <td>${ruta.aeropuertoDestino?.nombre || 'N/A'} (${ruta.aeropuertoDestino?.codigoIATA || ''})</td>
                <td>${ruta.duracionEstimada || 'N/A'}</td>
                <td>${ruta.distanciaKm || 0} km</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarRuta(${ruta.idRuta})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarRuta(${ruta.idRuta})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar rutas:', error);
        alert('Error al cargar rutas');
    }
}

export async function cargarAeropuertosSelectRuta() {
    try {
        const response = await fetch(`${API_BASE_URL}/aeropuertos`);
        const aeropuertos = await response.json();
        
        const selectOrigen = document.getElementById('rutaOrigen');
        const selectDestino = document.getElementById('rutaDestino');
        
        selectOrigen.innerHTML = '<option value="">Seleccione aeropuerto origen...</option>';
        selectDestino.innerHTML = '<option value="">Seleccione aeropuerto destino...</option>';
        
        aeropuertos.forEach(aero => {
            const option1 = document.createElement('option');
            option1.value = aero.idAeropuerto;
            option1.textContent = `${aero.nombre} (${aero.codigoIATA}) - ${aero.ciudad?.nombreCiudad || ''}`;
            selectOrigen.appendChild(option1);
            
            const option2 = option1.cloneNode(true);
            selectDestino.appendChild(option2);
        });
    } catch (error) {
        console.error('Error al cargar aeropuertos:', error);
    }
}

export async function guardarRuta(event) {
    event.preventDefault();
    
    const idOrigen = document.getElementById('rutaOrigen').value;
    const idDestino = document.getElementById('rutaDestino').value;
    const duracionEstimada = document.getElementById('rutaDuracion').value;
    const distanciaKm = parseInt(document.getElementById('rutaDistancia').value);
    
    if (!idOrigen || !idDestino) {
        alert('Debe seleccionar aeropuerto de origen y destino');
        return;
    }
    
    if (idOrigen === idDestino) {
        alert('El aeropuerto de origen y destino no pueden ser el mismo');
        return;
    }
    
    if (duracionEstimada && !validarHora(duracionEstimada, 'Duración Estimada')) return;
    if (!validarSoloNumeros(distanciaKm.toString(), 'Distancia')) return;
    
    const ruta = {
        aeropuertoOrigen: { idAeropuerto: parseInt(idOrigen) },
        aeropuertoDestino: { idAeropuerto: parseInt(idDestino) },
        duracionEstimada,
        distanciaKm
    };
    
    try {
        const url = rutaIdActual 
            ? `${API_BASE_URL}/rutas/${rutaIdActual}`
            : `${API_BASE_URL}/rutas`;
        
        const method = rutaIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ruta)
        });
        
        if (response.ok) {
            alert(rutaIdActual ? 'Ruta actualizada correctamente' : 'Ruta registrada correctamente');
            document.getElementById('formRuta').reset();
            rutaIdActual = null;
            document.getElementById('btnCancelarRuta').style.display = 'none';
            cargarRutas();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar ruta');
    }
}

export async function editarRuta(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/rutas/${id}`);
        const ruta = await response.json();
        
        document.getElementById('rutaOrigen').value = ruta.aeropuertoOrigen?.idAeropuerto || '';
        document.getElementById('rutaDestino').value = ruta.aeropuertoDestino?.idAeropuerto || '';
        document.getElementById('rutaDuracion').value = ruta.duracionEstimada || '';
        document.getElementById('rutaDistancia').value = ruta.distanciaKm || '';
        
        rutaIdActual = id;
        document.getElementById('btnCancelarRuta').style.display = 'inline-block';
        
        document.getElementById('formRuta').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar ruta');
    }
}

export async function eliminarRuta(id) {
    if (!confirm('¿Está seguro de eliminar esta ruta?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/rutas/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Ruta eliminada correctamente');
            cargarRutas();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar ruta');
    }
}

export function cancelarRuta() {
    document.getElementById('formRuta').reset();
    rutaIdActual = null;
    document.getElementById('btnCancelarRuta').style.display = 'none';
}

// ============================================
// VUELOS
// ============================================
let vueloIdActual = null;

export async function cargarVuelos() {
    try {
        const response = await fetch(`${API_BASE_URL}/vuelos`);
        const vuelos = await response.json();
        
        const tbody = document.getElementById('tablaVuelos');
        tbody.innerHTML = '';
        
        vuelos.forEach(vuelo => {
            const tr = document.createElement('tr');
            const rutaTexto = vuelo.ruta 
                ? `${vuelo.ruta.aeropuertoOrigen?.codigoIATA || ''} → ${vuelo.ruta.aeropuertoDestino?.codigoIATA || ''}`
                : 'N/A';
            
            tr.innerHTML = `
                <td>${vuelo.idVuelo}</td>
                <td>${vuelo.numeroVuelo || 'N/A'}</td>
                <td>${rutaTexto}</td>
                <td>${vuelo.avion?.modelo || 'N/A'}</td>
                <td>${vuelo.horaSalida || 'N/A'}</td>
                <td>${vuelo.horaLlegada || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarVuelo(${vuelo.idVuelo})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarVuelo(${vuelo.idVuelo})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar vuelos:', error);
        alert('Error al cargar vuelos');
    }
}

export async function cargarRutasSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/rutas`);
        const rutas = await response.json();
        
        const select = document.getElementById('vueloRuta');
        select.innerHTML = '<option value="">Seleccione ruta...</option>';
        
        rutas.forEach(ruta => {
            const option = document.createElement('option');
            option.value = ruta.idRuta;
            const origen = ruta.aeropuertoOrigen?.codigoIATA || 'N/A';
            const destino = ruta.aeropuertoDestino?.codigoIATA || 'N/A';
            option.textContent = `${origen} → ${destino} (${ruta.distanciaKm} km)`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar rutas:', error);
    }
}

export async function cargarAvionesSelectVuelo() {
    try {
        const response = await fetch(`${API_BASE_URL}/aviones`);
        const aviones = await response.json();
        
        const select = document.getElementById('vueloAvion');
        select.innerHTML = '<option value="">Seleccione avión...</option>';
        
        aviones.forEach(avion => {
            const option = document.createElement('option');
            option.value = avion.idAvion;
            option.textContent = `${avion.modelo} (${avion.numeroSerie})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar aviones:', error);
    }
}

export async function guardarVuelo(event) {
    event.preventDefault();
    
    const numeroVuelo = document.getElementById('vueloNumero').value.trim();
    const idRuta = document.getElementById('vueloRuta').value;
    const idAvion = document.getElementById('vueloAvion').value;
    const horaSalida = document.getElementById('vueloHoraSalida').value;
    const horaLlegada = document.getElementById('vueloHoraLlegada').value;
    
    if (!validarSoloLetrasYNumeros(numeroVuelo, 'Número de Vuelo')) return;
    if (!idRuta || !idAvion) {
        alert('Debe seleccionar ruta y avión');
        return;
    }
    if (!validarHora(horaSalida, 'Hora de Salida')) return;
    if (!validarHora(horaLlegada, 'Hora de Llegada')) return;
    
    const vuelo = {
        numeroVuelo,
        ruta: { idRuta: parseInt(idRuta) },
        avion: { idAvion: parseInt(idAvion) },
        horaSalida,
        horaLlegada
    };
    
    try {
        const url = vueloIdActual 
            ? `${API_BASE_URL}/vuelos/${vueloIdActual}`
            : `${API_BASE_URL}/vuelos`;
        
        const method = vueloIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vuelo)
        });
        
        if (response.ok) {
            alert(vueloIdActual ? 'Vuelo actualizado correctamente' : 'Vuelo registrado correctamente');
            document.getElementById('formVuelo').reset();
            vueloIdActual = null;
            document.getElementById('btnCancelarVuelo').style.display = 'none';
            cargarVuelos();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar vuelo');
    }
}

export async function editarVuelo(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/vuelos/${id}`);
        const vuelo = await response.json();
        
        document.getElementById('vueloNumero').value = vuelo.numeroVuelo || '';
        document.getElementById('vueloRuta').value = vuelo.ruta?.idRuta || '';
        document.getElementById('vueloAvion').value = vuelo.avion?.idAvion || '';
        document.getElementById('vueloHoraSalida').value = vuelo.horaSalida || '';
        document.getElementById('vueloHoraLlegada').value = vuelo.horaLlegada || '';
        
        vueloIdActual = id;
        document.getElementById('btnCancelarVuelo').style.display = 'inline-block';
        
        document.getElementById('formVuelo').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar vuelo');
    }
}

export async function eliminarVuelo(id) {
    if (!confirm('¿Está seguro de eliminar este vuelo?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/vuelos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Vuelo eliminado correctamente');
            cargarVuelos();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar vuelo');
    }
}

export function cancelarVuelo() {
    document.getElementById('formVuelo').reset();
    vueloIdActual = null;
    document.getElementById('btnCancelarVuelo').style.display = 'none';
}

// ============================================
// INSTANCIAS DE VUELO
// ============================================
let instanciaIdActual = null;

export async function cargarInstancias() {
    try {
        const response = await fetch(`${API_BASE_URL}/instancias-vuelo`);
        const instancias = await response.json();
        
        const tbody = document.getElementById('tablaInstancias');
        tbody.innerHTML = '';
        
        instancias.forEach(inst => {
            const tr = document.createElement('tr');
            const vueloTexto = inst.vuelo?.numeroVuelo || 'N/A';
            const estadoBadge = inst.estado === 'Activo' 
                ? '<span class="badge bg-success">Activo</span>'
                : '<span class="badge bg-secondary">Inactivo</span>';
            
            tr.innerHTML = `
                <td>${inst.idInstanciaVuelo}</td>
                <td>${vueloTexto}</td>
                <td>${inst.fechaSalida || 'N/A'}</td>
                <td>${inst.fechaLlegada || 'N/A'}</td>
                <td>${estadoBadge}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="window.editarInstancia(${inst.idInstanciaVuelo})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.eliminarInstancia(${inst.idInstanciaVuelo})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar instancias:', error);
        alert('Error al cargar instancias de vuelo');
    }
}

export async function cargarVuelosSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/vuelos`);
        const vuelos = await response.json();
        
        const select = document.getElementById('instanciaVuelo');
        select.innerHTML = '<option value="">Seleccione vuelo...</option>';
        
        vuelos.forEach(vuelo => {
            const option = document.createElement('option');
            option.value = vuelo.idVuelo;
            const origen = vuelo.ruta?.aeropuertoOrigen?.codigoIATA || 'N/A';
            const destino = vuelo.ruta?.aeropuertoDestino?.codigoIATA || 'N/A';
            option.textContent = `${vuelo.numeroVuelo} (${origen} → ${destino})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar vuelos:', error);
    }
}

export async function guardarInstancia(event) {
    event.preventDefault();
    
    const idVuelo = document.getElementById('instanciaVuelo').value;
    const fechaSalida = document.getElementById('instanciaFechaSalida').value;
    const fechaLlegada = document.getElementById('instanciaFechaLlegada').value;
    const estado = document.getElementById('instanciaEstado').value;
    
    if (!idVuelo) {
        alert('Debe seleccionar un vuelo');
        return;
    }
    
    if (!validarFecha(fechaSalida, 'Fecha de Salida')) return;
    if (!validarFecha(fechaLlegada, 'Fecha de Llegada')) return;
    
    if (new Date(fechaSalida) > new Date(fechaLlegada)) {
        alert('La fecha de salida no puede ser posterior a la fecha de llegada');
        return;
    }
    
    const instancia = {
        vuelo: { idVuelo: parseInt(idVuelo) },
        fechaSalida,
        fechaLlegada,
        estado
    };
    
    try {
        const url = instanciaIdActual 
            ? `${API_BASE_URL}/instancias-vuelo/${instanciaIdActual}`
            : `${API_BASE_URL}/instancias-vuelo`;
        
        const method = instanciaIdActual ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(instancia)
        });
        
        if (response.ok) {
            alert(instanciaIdActual ? 'Instancia actualizada correctamente' : 'Instancia registrada correctamente');
            document.getElementById('formInstancia').reset();
            instanciaIdActual = null;
            document.getElementById('btnCancelarInstancia').style.display = 'none';
            cargarInstancias();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar instancia de vuelo');
    }
}

export async function editarInstancia(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/instancias-vuelo/${id}`);
        const inst = await response.json();
        
        document.getElementById('instanciaVuelo').value = inst.vuelo?.idVuelo || '';
        document.getElementById('instanciaFechaSalida').value = inst.fechaSalida || '';
        document.getElementById('instanciaFechaLlegada').value = inst.fechaLlegada || '';
        document.getElementById('instanciaEstado').value = inst.estado || '';
        
        instanciaIdActual = id;
        document.getElementById('btnCancelarInstancia').style.display = 'inline-block';
        
        document.getElementById('formInstancia').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar instancia de vuelo');
    }
}

export async function eliminarInstancia(id) {
    if (!confirm('¿Está seguro de eliminar esta instancia de vuelo?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/instancias-vuelo/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Instancia de vuelo eliminada correctamente');
            cargarInstancias();
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar instancia de vuelo');
    }
}

export function cancelarInstancia() {
    document.getElementById('formInstancia').reset();
    instanciaIdActual = null;
    document.getElementById('btnCancelarInstancia').style.display = 'none';
}

// Exponer funciones al scope global
window.editarRuta = editarRuta;
window.eliminarRuta = eliminarRuta;
window.editarVuelo = editarVuelo;
window.eliminarVuelo = eliminarVuelo;
window.editarInstancia = editarInstancia;
window.eliminarInstancia = eliminarInstancia;
