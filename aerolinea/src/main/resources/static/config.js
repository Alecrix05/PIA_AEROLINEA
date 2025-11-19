const API_BASE_URL = 'http://localhost:8080/api';

const ENDPOINTS = {
    // Clientes y Pasajeros
    clientes: `${API_BASE_URL}/clientes`,
    pasajeros: `${API_BASE_URL}/pasajeros`,
    
    // Configuración - Geografía
    ciudades: `${API_BASE_URL}/ciudades`,
    aeropuertos: `${API_BASE_URL}/aeropuertos`,
    rutas: `${API_BASE_URL}/rutas`,
    
    // Configuración - Flota
    aviones: `${API_BASE_URL}/aviones`,
    asientos: `${API_BASE_URL}/asientos`,
    
    // Configuración - Tarifas
    tarifas: `${API_BASE_URL}/tarifas`,
    
    // Recursos Humanos
    departamentos: `${API_BASE_URL}/departamentos`,
    empleados: `${API_BASE_URL}/empleados`,
    tripulaciones: `${API_BASE_URL}/tripulaciones`,
    
    // Operaciones
    vuelos: `${API_BASE_URL}/vuelos`,
    instanciasVuelo: `${API_BASE_URL}/instancias-vuelo`,
    
    // Ventas
    reservas: `${API_BASE_URL}/reservas`,
    boletos: `${API_BASE_URL}/boletos`,
    ventas: `${API_BASE_URL}/ventas`,
    ventasDetalle: `${API_BASE_URL}/ventas-detalle`,
    
    // Pagos e Impuestos
    metodosPago: `${API_BASE_URL}/metodos-pago`,
    impuestos: `${API_BASE_URL}/impuestos`,
    pagos: `${API_BASE_URL}/pagos`,
    ventasImpuesto: `${API_BASE_URL}/ventas-impuesto`,
    
    // Búsqueda y Compra
    busqueda: `${API_BASE_URL}/busqueda/vuelos`,
    compra: `${API_BASE_URL}/compra/procesar`
};

async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const error = await response.json();
            
            // Extraer mensaje de validación más limpio
            if (error.message && error.message.includes('ConstraintViolationImpl')) {
                const match = error.message.match(/interpolatedMessage='([^']+)'/g);
                if (match) {
                    const mensajes = match.map(m => m.replace(/interpolatedMessage='([^']+)'/, '$1'));
                    throw { message: 'Error de validación:\n' + mensajes.join('\n') };
                }
            }
            
            // Si hay errores de validación múltiples, crear un mensaje detallado
            if (error.errors) {
                const errores = Object.entries(error.errors)
                    .map(([campo, mensaje]) => `${campo}: ${mensaje}`)
                    .join('\n');
                throw { message: error.message || 'Error de validación', errors: error.errors, detalle: errores };
            }
            
            throw { message: error.message || `HTTP Error: ${response.status}` };
        }

        // Verificar si la respuesta tiene contenido antes de parsear JSON
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        
        if (contentLength === '0' || !contentType || !contentType.includes('application/json')) {
            return null; // Respuesta vacía o sin JSON
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        // No mostrar alert aquí, dejar que el código que llama maneje el error
        throw error;
    }
}

function showAlert(type, message) {
    const alertTypes = {
        success: 'alert-success',
        error: 'alert-danger',
        warning: 'alert-warning',
        info: 'alert-info'
    };

    // Limpiar mensaje de caracteres HTML codificados
    let cleanMessage = message
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
    
    // Limpiar mensajes redundantes comunes
    cleanMessage = cleanMessage
        .replace(/Ingrese los datos del pasajero que viajará \(puede ser diferente al cliente que paga\)/g, 'Datos del Pasajero')
        .replace(/Revise todos los detalles antes de confirmar la compra/g, 'Confirmar Compra')
        .replace(/Cliente \(el que paga\)/g, 'Cliente')
        .replace(/Cliente \(el que viaja\)/g, 'Pasajero')
        .replace(/Seleccione el método de pago para procesar la compra/g, 'Método de Pago');

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertTypes[type]} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.maxWidth = '500px';
    alertDiv.innerHTML = `
        <div style="white-space: pre-line;">${cleanMessage}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 7000);
}
