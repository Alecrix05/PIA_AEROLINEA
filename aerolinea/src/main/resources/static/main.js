function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    const navItems = document.querySelectorAll('.list-group-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    const activeLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeLink && activeLink.classList.contains('list-group-item')) {
        activeLink.classList.add('active');
    }

    // Cargar/inicializar módulos según la sección
    const initializers = {
        'dashboard': loadDashboardData,
        'configuracion': () => {
            if (typeof window.inicializarModuloConfiguracion === 'function') {
                window.inicializarModuloConfiguracion();
            }
        },
        'aeronaves': () => {
            if (typeof window.inicializarModuloAeronaves === 'function') {
                window.inicializarModuloAeronaves();
            }
        },
        'personal': () => {
            if (typeof window.inicializarModuloPersonal === 'function') {
                window.inicializarModuloPersonal();
            }
        },
        'comercial': () => {
            if (typeof window.inicializarModuloComercial === 'function') {
                window.inicializarModuloComercial();
            }
        },
        'operaciones': () => {
            if (typeof window.inicializarModuloOperaciones === 'function') {
                window.inicializarModuloOperaciones();
            }
        },
        'gestion-ventas': () => {
            if (typeof window.inicializarModuloGestionVentas === 'function') {
                window.inicializarModuloGestionVentas();
            }
        },
        'busqueda': () => {
            if (typeof window.inicializarModuloBusqueda === 'function') {
                window.inicializarModuloBusqueda();
            }
        }
    };

    if (initializers[sectionId]) {
        initializers[sectionId]();
    }
}

async function loadDashboardData() {
    try {
        // Cargar estadísticas básicas
        const responses = await Promise.all([
            fetch(`${API_BASE_URL}/clientes`).catch(() => ({ json: () => [] })),
            fetch(`${API_BASE_URL}/aviones`).catch(() => ({ json: () => [] })),
            fetch(`${API_BASE_URL}/rutas`).catch(() => ({ json: () => [] })),
            fetch(`${API_BASE_URL}/ventas`).catch(() => ({ json: () => [] }))
        ]);

        const clientes = responses[0].ok ? await responses[0].json() : [];
        const aviones = responses[1].ok ? await responses[1].json() : [];
        const rutas = responses[2].ok ? await responses[2].json() : [];
        const ventas = responses[3].ok ? await responses[3].json() : [];

        // Actualizar contadores
        document.getElementById('totalClientes').textContent = clientes.length || 0;
        document.getElementById('totalAviones').textContent = aviones.length || 0;
        document.getElementById('totalRutas').textContent = rutas.length || 0;
        
        // Filtrar ventas de hoy
        const hoy = new Date().toISOString().split('T')[0];
        const ventasHoy = ventas.filter(v => v.fechaVenta && v.fechaVenta.startsWith(hoy));
        document.getElementById('totalVentasHoy').textContent = ventasHoy.length || 0;

        // Cargar próximos vuelos
        cargarProximosVuelos();
        
        // Cargar personal activo
        cargarPersonalActivo();
    } catch (error) {
        console.error('Error loading dashboard:', error);
        // Establecer valores por defecto
        document.getElementById('totalClientes').textContent = '0';
        document.getElementById('totalAviones').textContent = '0';
        document.getElementById('totalRutas').textContent = '0';
        document.getElementById('totalVentasHoy').textContent = '0';
    }
}

async function cargarProximosVuelos() {
    try {
        const response = await fetch(`${API_BASE_URL}/instancias-vuelo`);
        if (!response.ok) throw new Error('Error al cargar vuelos');
        
        const instancias = await response.json();
        const contenedor = document.getElementById('proximosVuelos');
        
        if (!instancias || instancias.length === 0) {
            contenedor.innerHTML = '<p class="text-muted">No hay vuelos programados</p>';
            return;
        }

        // Filtrar solo vuelos futuros y ordenar
        const ahora = new Date();
        const vuelosFuturos = instancias
            .filter(i => new Date(i.fechaSalida) > ahora)
            .sort((a, b) => new Date(a.fechaSalida) - new Date(b.fechaSalida))
            .slice(0, 5);

        if (vuelosFuturos.length === 0) {
            contenedor.innerHTML = '<p class="text-muted">No hay vuelos programados</p>';
            return;
        }

        let html = '<div class="list-group">';
        vuelosFuturos.forEach(instancia => {
            const fechaSalida = new Date(instancia.fechaSalida);
            const fechaFormateada = fechaSalida.toLocaleString('es-MX');
            
            html += `
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Vuelo ${instancia.vuelo?.numeroVuelo || 'N/A'}</h6>
                        <small>${fechaFormateada}</small>
                    </div>
                    <p class="mb-1 text-muted small">Avión: ${instancia.avion?.modelo || 'N/A'}</p>
                    <small class="badge bg-${instancia.estado === 'PROGRAMADO' ? 'success' : instancia.estado === 'RETRASADO' ? 'warning' : 'info'}">
                        ${instancia.estado}
                    </small>
                </div>
            `;
        });
        html += '</div>';
        
        contenedor.innerHTML = html;
    } catch (error) {
        console.error('Error al cargar próximos vuelos:', error);
        document.getElementById('proximosVuelos').innerHTML = '<p class="text-danger">Error al cargar vuelos</p>';
    }
}

async function cargarPersonalActivo() {
    try {
        const response = await fetch(`${API_BASE_URL}/empleados`);
        if (!response.ok) throw new Error('Error al cargar empleados');
        
        const empleados = await response.json();
        const contenedor = document.getElementById('personalActivo');
        
        if (!empleados || empleados.length === 0) {
            contenedor.innerHTML = '<p class="text-muted">No hay empleados registrados</p>';
            return;
        }

        // Agrupar por departamento
        const porDepartamento = {};
        empleados.forEach(emp => {
            const dept = emp.departamento?.nombreDepartamento || 'Sin Departamento';
            if (!porDepartamento[dept]) {
                porDepartamento[dept] = 0;
            }
            porDepartamento[dept]++;
        });

        let html = '<div class="list-group">';
        Object.entries(porDepartamento).forEach(([dept, cantidad]) => {
            html += `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    ${dept}
                    <span class="badge bg-primary rounded-pill">${cantidad}</span>
                </div>
            `;
        });
        html += '</div>';
        html += `<p class="mt-3 mb-0"><strong>Total: ${empleados.length} empleados</strong></p>`;
        
        contenedor.innerHTML = html;
    } catch (error) {
        console.error('Error al cargar personal activo:', error);
        document.getElementById('personalActivo').innerHTML = '<p class="text-danger">Error al cargar personal</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de Aerolínea inicializado');
    showSection('dashboard');
});
