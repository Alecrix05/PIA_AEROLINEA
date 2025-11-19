// ============================================
// MÓDULO UNIFICADO: GESTIÓN DE VENTAS
// Incluye: Proceso de venta completo
// ============================================

function inicializarModuloGestionVentas() {
    cargarHTMLGestionVentas();
}

function cargarHTMLGestionVentas() {
    const contenedor = document.getElementById('procesoVentaContent');
    contenedor.innerHTML = `
        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <strong>Proceso de Venta</strong><br>
            Este módulo permite realizar el proceso completo de venta de boletos, desde la búsqueda de vuelos hasta el procesamiento del pago.
        </div>
        
        <div class="card">
            <div class="card-header bg-success text-white">
                <i class="fas fa-shopping-cart"></i> Proceso de Venta Simplificado
            </div>
            <div class="card-body">
                <p class="mb-3">Para realizar una venta completa, utilice el módulo de <strong>Búsqueda</strong> que incluye:</p>
                <ul>
                    <li>Registro de cliente</li>
                    <li>Búsqueda de vuelos disponibles</li>
                    <li>Selección de asientos</li>
                    <li>Procesamiento de pago</li>
                    <li>Generación de boletos</li>
                </ul>
                
                <div class="mt-4">
                    <button class="btn btn-success btn-lg" onclick="showSection('busqueda')">
                        <i class="fas fa-search"></i> Ir a Búsqueda y Venta
                    </button>
                </div>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <i class="fas fa-chart-bar"></i> Estadísticas de Ventas
                    </div>
                    <div class="card-body">
                        <div id="estadisticasVentas">
                            <p class="text-muted">Cargando estadísticas...</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <i class="fas fa-ticket-alt"></i> Últimos Boletos Vendidos
                    </div>
                    <div class="card-body">
                        <div id="ultimosBoletos">
                            <p class="text-muted">Cargando boletos...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Cargar estadísticas
    cargarEstadisticasVentas();
    cargarUltimosBoletos();
}

async function cargarEstadisticasVentas() {
    try {
        const [ventasResponse, boletosResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/ventas`).catch(() => ({ json: () => [] })),
            fetch(`${API_BASE_URL}/boletos`).catch(() => ({ json: () => [] }))
        ]);
        
        const ventas = ventasResponse.ok ? await ventasResponse.json() : [];
        const boletos = boletosResponse.ok ? await boletosResponse.json() : [];
        
        const hoy = new Date().toISOString().split('T')[0];
        const ventasHoy = ventas.filter(v => v.fechaVenta && v.fechaVenta.startsWith(hoy));
        const boletosHoy = boletos.filter(b => b.fechaEmision && b.fechaEmision.startsWith(hoy));
        
        const totalVentas = ventas.reduce((sum, v) => sum + (v.total || 0), 0);
        const totalVentasHoy = ventasHoy.reduce((sum, v) => sum + (v.total || 0), 0);
        
        const contenedor = document.getElementById('estadisticasVentas');
        contenedor.innerHTML = `
            <div class="row text-center">
                <div class="col-6">
                    <h4 class="text-primary">${ventas.length}</h4>
                    <small>Total Ventas</small>
                </div>
                <div class="col-6">
                    <h4 class="text-success">${ventasHoy.length}</h4>
                    <small>Ventas Hoy</small>
                </div>
            </div>
            <hr>
            <div class="row text-center">
                <div class="col-6">
                    <h4 class="text-info">$${totalVentas.toFixed(2)}</h4>
                    <small>Ingresos Totales</small>
                </div>
                <div class="col-6">
                    <h4 class="text-warning">$${totalVentasHoy.toFixed(2)}</h4>
                    <small>Ingresos Hoy</small>
                </div>
            </div>
            <hr>
            <div class="text-center">
                <h4 class="text-secondary">${boletos.length}</h4>
                <small>Boletos Emitidos</small>
            </div>
        `;
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        document.getElementById('estadisticasVentas').innerHTML = '<p class="text-danger">Error al cargar estadísticas</p>';
    }
}

async function cargarUltimosBoletos() {
    try {
        const response = await fetch(`${API_BASE_URL}/boletos`);
        if (!response.ok) throw new Error('Error al cargar boletos');
        
        const boletos = await response.json();
        const ultimosBoletos = boletos
            .sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision))
            .slice(0, 5);
        
        const contenedor = document.getElementById('ultimosBoletos');
        
        if (ultimosBoletos.length === 0) {
            contenedor.innerHTML = '<p class="text-muted">No hay boletos registrados</p>';
            return;
        }
        
        let html = '<div class="list-group list-group-flush">';
        ultimosBoletos.forEach(boleto => {
            const fecha = boleto.fechaEmision ? new Date(boleto.fechaEmision).toLocaleDateString('es-MX') : 'N/A';
            html += `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${boleto.numeroBoleto}</strong><br>
                        <small class="text-muted">${fecha} - $${boleto.precio ? boleto.precio.toFixed(2) : '0.00'}</small>
                    </div>
                    <span class="badge bg-${boleto.estado === 'EMITIDO' ? 'success' : boleto.estado === 'USADO' ? 'info' : 'secondary'} rounded-pill">
                        ${boleto.estado || 'N/A'}
                    </span>
                </div>
            `;
        });
        html += '</div>';
        
        contenedor.innerHTML = html;
    } catch (error) {
        console.error('Error al cargar últimos boletos:', error);
        document.getElementById('ultimosBoletos').innerHTML = '<p class="text-danger">Error al cargar boletos</p>';
    }
}

// Exponer funciones al scope global
window.inicializarModuloGestionVentas = inicializarModuloGestionVentas;