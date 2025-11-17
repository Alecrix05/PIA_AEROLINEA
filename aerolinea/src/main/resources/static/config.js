const API_BASE_URL = 'http://localhost:8080/api';

const ENDPOINTS = {
    clientes: `${API_BASE_URL}/clientes`,
    pasajeros: `${API_BASE_URL}/pasajeros`,
    reservas: `${API_BASE_URL}/reservas`,
    boletos: `${API_BASE_URL}/boletos`,
    vuelos: `${API_BASE_URL}/vuelos`,
    instanciasVuelo: `${API_BASE_URL}/instancias-vuelo`,
    ventas: `${API_BASE_URL}/ventas`,
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

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertTypes[type]} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
