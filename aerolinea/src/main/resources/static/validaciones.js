// ===================================================================
// VALIDACIONES GLOBALES DEL SISTEMA
// ===================================================================

const VALIDACIONES = {
    // Solo letras (con acentos, ñ y espacios)
    soloLetras: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    
    // Solo números
    soloNumeros: /^[0-9]+$/,
    
    // Email válido
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    
    // Código IATA (3 letras mayúsculas)
    codigoIATA: /^[A-Z]{3}$/,
    
    // Teléfono (10 dígitos)
    telefono: /^[0-9]{10}$/,
    
    // Código postal (5 dígitos)
    codigoPostal: /^[0-9]{5}$/,
    
    // Alfanumérico (con acentos)
    alfanumerico: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/,
    
    // Matrícula de avión (formato: XX-ABC o similar)
    matricula: /^[A-Z0-9]{2,3}-[A-Z0-9]{3,4}$/,
    
    // Número de vuelo (formato: AA1234)
    numeroVuelo: /^[A-Z]{2}[0-9]{1,4}$/,
    
    // Pasaporte (alfanumérico 6-12 caracteres)
    pasaporte: /^[A-Z0-9]{6,12}$/,
    
    // Decimales positivos
    decimal: /^\d+(\.\d{1,2})?$/,
    
    // Entero positivo
    enteroPositivo: /^[1-9]\d*$/
};

/**
 * Valida que un campo solo contenga letras
 */
function validarSoloLetras(valor, nombreCampo) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    if (!VALIDACIONES.soloLetras.test(valor.trim())) {
        return { valido: false, mensaje: `El campo ${nombreCampo} solo puede contener letras y espacios` };
    }
    return { valido: true };
}

/**
 * Valida que un campo solo contenga números
 */
function validarSoloNumeros(valor, nombreCampo, requerido = true) {
    if (requerido && (!valor || valor.trim() === '')) {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    if (valor && !VALIDACIONES.soloNumeros.test(valor.trim())) {
        return { valido: false, mensaje: `El campo ${nombreCampo} solo puede contener números` };
    }
    return { valido: true };
}

/**
 * Valida formato de email
 */
function validarEmail(valor, nombreCampo, requerido = true) {
    if (requerido && (!valor || valor.trim() === '')) {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    if (valor && !VALIDACIONES.email.test(valor.trim())) {
        return { valido: false, mensaje: `El campo ${nombreCampo} debe ser un correo electrónico válido` };
    }
    return { valido: true };
}

/**
 * Valida código IATA (3 letras mayúsculas)
 */
function validarCodigoIATA(valor, nombreCampo) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    const valorLimpio = valor.trim().toUpperCase();
    if (valorLimpio.length !== 3) {
        return { valido: false, mensaje: `El campo ${nombreCampo} debe tener exactamente 3 caracteres` };
    }
    if (!VALIDACIONES.codigoIATA.test(valorLimpio)) {
        return { valido: false, mensaje: `El campo ${nombreCampo} debe ser 3 letras mayúsculas sin espacios (ej: MEX, GDL)` };
    }
    return { valido: true };
}

/**
 * Valida teléfono (10 dígitos)
 */
function validarTelefono(valor, nombreCampo, requerido = true) {
    if (requerido && (!valor || valor.trim() === '')) {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    if (valor && !VALIDACIONES.telefono.test(valor.trim())) {
        return { valido: false, mensaje: `El campo ${nombreCampo} debe tener 10 dígitos` };
    }
    return { valido: true };
}

/**
 * Valida código postal (5 dígitos)
 */
function validarCodigoPostal(valor, nombreCampo, requerido = true) {
    if (requerido && (!valor || valor.trim() === '')) {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    if (valor && !VALIDACIONES.codigoPostal.test(valor.trim())) {
        return { valido: false, mensaje: `El campo ${nombreCampo} debe tener 5 dígitos` };
    }
    return { valido: true };
}

/**
 * Valida matrícula de avión
 */
function validarMatricula(valor, nombreCampo) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    if (!VALIDACIONES.matricula.test(valor.trim().toUpperCase())) {
        return { valido: false, mensaje: `El campo ${nombreCampo} debe tener formato XX-ABC (ej: XA-ABC, N1-234)` };
    }
    return { valido: true };
}

/**
 * Valida número de vuelo
 */
function validarNumeroVuelo(valor, nombreCampo) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    if (!VALIDACIONES.numeroVuelo.test(valor.trim().toUpperCase())) {
        return { valido: false, mensaje: `El campo ${nombreCampo} debe tener formato AA1234 (ej: AM123, VB4567)` };
    }
    return { valido: true };
}

/**
 * Valida número decimal positivo
 */
function validarDecimal(valor, nombreCampo, requerido = true) {
    if (requerido && (!valor || valor.toString().trim() === '')) {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    if (valor && !VALIDACIONES.decimal.test(valor.toString())) {
        return { valido: false, mensaje: `El campo ${nombreCampo} debe ser un número válido` };
    }
    if (valor && parseFloat(valor) <= 0) {
        return { valido: false, mensaje: `El campo ${nombreCampo} debe ser mayor a 0` };
    }
    return { valido: true };
}

/**
 * Valida entero positivo
 */
function validarEnteroPositivo(valor, nombreCampo, requerido = true) {
    if (requerido && (!valor || valor.toString().trim() === '')) {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    if (valor && !VALIDACIONES.enteroPositivo.test(valor.toString())) {
        return { valido: false, mensaje: `El campo ${nombreCampo} debe ser un número entero mayor a 0` };
    }
    return { valido: true };
}

/**
 * Valida fecha (no vacía y formato válido)
 */
function validarFecha(valor, nombreCampo, requerido = true) {
    if (requerido && (!valor || valor.trim() === '')) {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    if (valor) {
        const fecha = new Date(valor);
        if (isNaN(fecha.getTime())) {
            return { valido: false, mensaje: `El campo ${nombreCampo} debe ser una fecha válida` };
        }
    }
    return { valido: true };
}

/**
 * Valida campo de texto genérico (no vacío)
 */
function validarTexto(valor, nombreCampo, requerido = true) {
    if (requerido && (!valor || valor.trim() === '')) {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    return { valido: true };
}

/**
 * Muestra mensaje de error
 */
function mostrarError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: mensaje,
        confirmButtonColor: '#d33'
    });
}

/**
 * Muestra mensaje de éxito
 */
function mostrarExito(mensaje) {
    Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: mensaje,
        confirmButtonColor: '#28a745',
        timer: 2000
    });
}

/**
 * Muestra mensaje de confirmación
 */
function mostrarConfirmacion(mensaje) {
    return Swal.fire({
        title: '¿Está seguro?',
        text: mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
    });
}

/**
 * Normaliza texto a mayúsculas sin espacios extras
 */
function normalizarMayusculas(texto) {
    return texto ? texto.trim().toUpperCase() : '';
}

/**
 * Normaliza texto capitalizando primera letra de cada palabra
 */
function capitalizarTexto(texto) {
    if (!texto) return '';
    return texto.trim().toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Validación global para nombres (permite letras y espacios)
 */
function validarNombre(valor, nombreCampo, requerido = true) {
    if (requerido && (!valor || valor.trim() === '')) {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    if (valor && !VALIDACIONES.soloLetras.test(valor.trim())) {
        return { valido: false, mensaje: `El campo ${nombreCampo} solo puede contener letras y espacios` };
    }
    return { valido: true };
}

/**
 * Validación para campos alfanuméricos (letras, números y espacios)
 */
function validarAlfanumerico(valor, nombreCampo, requerido = false) {
    if (requerido && (!valor || valor.trim() === '')) {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    if (valor && !VALIDACIONES.alfanumerico.test(valor.trim())) {
        return { valido: false, mensaje: `El campo ${nombreCampo} solo puede contener letras, números y espacios` };
    }
    return { valido: true };
}

/**
 * Validación para matrículas de aviones
 */
function validarMatriculaAvion(valor, nombreCampo) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio` };
    }
    if (!VALIDACIONES.matricula.test(valor.trim().toUpperCase())) {
        return { valido: false, mensaje: `El campo ${nombreCampo} debe tener formato XX-ABC (ej: XA-ABC, N1-234)` };
    }
    return { valido: true };
}

/**
 * Aplicar validación en tiempo real a todos los formularios
 */
function aplicarValidacionGlobal() {
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', agregarValidacionTiempoReal);
    } else {
        agregarValidacionTiempoReal();
    }
}

// Aplicar validación global automáticamente
aplicarValidacionGlobal();
