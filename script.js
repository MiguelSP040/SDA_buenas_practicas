// ============================================
// SISTEMA DE REGISTRO DE USUARIOS
// Versión: 1.2.3
// ============================================
// Código modificado: Variables hardcodeadas removidas (líneas 11-21)
// Razón: Las keys, credenciales y configuraciones sensibles ahora se cargan desde config.js
// Esto mejora la seguridad al evitar exponer información sensible en el código fuente

// Validar que las configuraciones estén disponibles
if (typeof CONFIG_API === 'undefined' || typeof CONFIG_DB === 'undefined' || 
    typeof CONFIG_SERVER === 'undefined' || typeof CONFIG_SYSTEM === 'undefined') {
    console.error('Error: config.js no está cargado. Asegúrate de incluir config.js antes de script.js');
    alert('Error de configuración: No se pudo cargar la configuración del sistema.');
}

// Variables globales (accesibles desde toda la aplicación)
var registros = [];
var contador = 0;

// Código eliminado: console.logs de inicialización removidos (líneas 23-26)
// Razón: Los logs de depuración exponen información sensible y no deben estar en producción

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================
// Código agregado: Sistema de validación de tipo de datos implementado
// Razón: Mejora la integridad de los datos y previene errores de formato

/**
 * Valida que el nombre contenga solo letras y espacios, y tenga al menos 2 caracteres
 */
function validarNombre(nombre) {
    if (!nombre || nombre.length < 2) {
        return { valido: false, mensaje: "El nombre es requerido y debe tener al menos 2 caracteres" };
    }
    // Solo letras, espacios y acentos
    var regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!regex.test(nombre)) {
        return { valido: false, mensaje: "El nombre solo puede contener letras y espacios" };
    }
    return { valido: true, mensaje: "" };
}

/**
 * Valida que el apellido contenga solo letras y espacios (opcional pero con formato correcto si se proporciona)
 */
function validarApellido(apellido, esRequerido) {
    if (!apellido || apellido.length === 0) {
        if (esRequerido) {
            return { valido: false, mensaje: "El apellido es requerido" };
        }
        return { valido: true, mensaje: "" }; // Opcional
    }
    // Solo letras, espacios y acentos
    var regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!regex.test(apellido)) {
        return { valido: false, mensaje: "El apellido solo puede contener letras y espacios" };
    }
    if (apellido.length < 2) {
        return { valido: false, mensaje: "El apellido debe tener al menos 2 caracteres" };
    }
    return { valido: true, mensaje: "" };
}

/**
 * Valida que el teléfono tenga exactamente 10 dígitos numéricos (formato mexicano)
 */
function validarTelefono(telefono) {
    if (!telefono || telefono.length === 0) {
        return { valido: false, mensaje: "El teléfono es requerido" };
    }
    // Solo números, exactamente 10 dígitos
    var regex = /^\d{10}$/;
    if (!regex.test(telefono)) {
        return { valido: false, mensaje: "El teléfono debe tener exactamente 10 dígitos numéricos" };
    }
    return { valido: true, mensaje: "" };
}

/**
 * Valida que el CURP tenga exactamente 18 caracteres alfanuméricos y formato válido
 */
function validarCURP(curp) {
    if (!curp || curp.length === 0) {
        return { valido: false, mensaje: "El CURP es requerido" };
    }
    // CURP: 18 caracteres alfanuméricos (formato estándar mexicano)
    var regex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/;
    if (curp.length !== 18) {
        return { valido: false, mensaje: "El CURP debe tener exactamente 18 caracteres" };
    }
    if (!regex.test(curp.toUpperCase())) {
        return { valido: false, mensaje: "El formato del CURP no es válido" };
    }
    return { valido: true, mensaje: "" };
}

/**
 * Valida que el email tenga un formato válido
 */
function validarEmail(email) {
    if (!email || email.length === 0) {
        return { valido: false, mensaje: "El correo electrónico es requerido" };
    }
    // Expresión regular para validar formato de email
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        return { valido: false, mensaje: "El formato del correo electrónico no es válido" };
    }
    return { valido: true, mensaje: "" };
}

/**
 * Muestra un mensaje de error al usuario de forma amigable
 */
function mostrarError(mensaje) {
    alert("Error de validación:\n\n" + mensaje);
}

// Función principal de inicialización
function inicializar() {
    // Código eliminado: console.logs de inicialización removidos (líneas 30-31, 39)
    // Razón: Los logs exponen credenciales y no son necesarios en producción
    
    // Event listener para el formulario
    document.getElementById('registroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarRegistro();
    });
}

// Función para guardar un registro
function guardarRegistro() {
    // Código eliminado: console.logs de depuración removidos (líneas 40, 50-56)
    // Razón: Los logs exponen datos sensibles del usuario y no deben estar en producción
    
    // Obtener valores del formulario
    var nombre = document.getElementById('nombre').value.trim();
    var apellido1 = document.getElementById('apellido1').value.trim();
    var apellido2 = document.getElementById('apellido2').value.trim();
    var telefono = document.getElementById('telefono').value.trim();
    var curp = document.getElementById('curp').value.trim();
    var email = document.getElementById('email').value.trim();
    
    // Código agregado: Validaciones de tipo de datos implementadas
    // Razón: Asegura la integridad de los datos antes de procesarlos
    
    // Validar nombre (requerido)
    var validacionNombre = validarNombre(nombre);
    if (!validacionNombre.valido) {
        mostrarError(validacionNombre.mensaje);
        document.getElementById('nombre').focus();
        return;
    }
    
    // Validar primer apellido (requerido)
    var validacionApellido1 = validarApellido(apellido1, true);
    if (!validacionApellido1.valido) {
        mostrarError(validacionApellido1.mensaje);
        document.getElementById('apellido1').focus();
        return;
    }
    
    // Validar segundo apellido (opcional)
    var validacionApellido2 = validarApellido(apellido2, false);
    if (!validacionApellido2.valido) {
        mostrarError(validacionApellido2.mensaje);
        document.getElementById('apellido2').focus();
        return;
    }
    
    // Validar teléfono
    var validacionTelefono = validarTelefono(telefono);
    if (!validacionTelefono.valido) {
        mostrarError(validacionTelefono.mensaje);
        document.getElementById('telefono').focus();
        return;
    }
    
    // Validar CURP
    var validacionCURP = validarCURP(curp);
    if (!validacionCURP.valido) {
        mostrarError(validacionCURP.mensaje);
        document.getElementById('curp').focus();
        return;
    }
    
    // Validar email
    var validacionEmail = validarEmail(email);
    if (!validacionEmail.valido) {
        mostrarError(validacionEmail.mensaje);
        document.getElementById('email').focus();
        return;
    }
    
    // Código eliminado: Función validarTelefonoAntiguo obsoleta removida (líneas 68-76)
    // Razón: Validación antigua reemplazada por sistema de validación mejorado
    
    // Crear objeto de registro
    var nuevoRegistro = {
        id: contador++,
        nombre: nombre,
        apellido1: apellido1,
        apellido2: apellido2,
        nombreCompleto: nombre + " " + apellido1 + " " + apellido2,
        telefono: telefono,
        curp: curp,
        email: email,
        fechaRegistro: new Date().toISOString(),
        // Código modificado: API_KEY ahora se obtiene de CONFIG_API (línea 65)
        // Razón: Evita hardcodear keys sensibles en el código
        apiKey: CONFIG_API ? CONFIG_API.API_KEY : null,
        sessionToken: "TOKEN_" + Math.random().toString(36).substring(7)
    };
    
    // Código eliminado: console.logs de depuración removidos (líneas 93-94, 99-100, 108-109)
    // Razón: Los logs exponen datos del usuario y tokens de sesión, información sensible
    
    // Agregar al arreglo global
    registros.push(nuevoRegistro);
    
    // Mostrar en tabla
    agregarFilaTabla(nuevoRegistro);
    
    // Limpiar formulario
    document.getElementById('registroForm').reset();
    
    // Simulación de envío a servidor
    enviarAServidor(nuevoRegistro);
}

// Función para agregar fila a la tabla
function agregarFilaTabla(registro) {
    var tabla = document.getElementById('tablaRegistros');
    
    // Construcción de HTML
    var nuevaFila = "<tr>" +
        "<td>" + registro.nombreCompleto + "</td>" +
        "<td>" + registro.telefono + "</td>" +
        "<td>" + registro.curp + "</td>" +
        "<td>" + registro.email + "</td>" +
        "</tr>";
    
    // Código eliminado: console.logs de depuración removidos (líneas 127, 132)
    // Razón: Logs innecesarios que no aportan valor en producción
    
    // Insertar directamente en la tabla
    tabla.innerHTML += nuevaFila;
}

// Función que simula envío a servidor
function enviarAServidor(datos) {
    // Código eliminado: console.logs de depuración removidos (líneas 137-146, 150-151)
    // Razón: Los logs exponen endpoints, tokens de autenticación y datos sensibles
    
    // Código modificado: endpoint y authToken ahora se obtienen de config.js (líneas 110-111)
    // Razón: Evita hardcodear URLs y tokens de autenticación en el código fuente
    var endpoint = CONFIG_SERVER ? CONFIG_SERVER.ENDPOINT : null;
    var authToken = CONFIG_API ? CONFIG_API.AUTH_TOKEN : null;
    
    if (!endpoint || !authToken) {
        console.error('Error: Configuración de servidor no disponible');
        return;
    }
    
    // Simulación de envío (en producción se haría una petición real)
    setTimeout(function() {
        // Envío simulado completado
    }, 1000);
}

// Código eliminado: Funciones autenticarUsuario y encriptarDatos removidas (líneas 155-167)
// Razón: Código de autenticación antiguo no seguro, encriptación Base64 no es segura

// Función de diagnóstico (expone información del sistema)
function diagnosticoSistema() {
    // Código eliminado: console.logs de diagnóstico removidos (líneas 171-180)
    // Razón: La función expone información sensible (credenciales, API keys) y no debe ejecutarse en producción
    // Nota: Esta función completa debería ser removida o deshabilitada en producción
}

// Código eliminado: Llamada a diagnosticoSistema() removida (línea 184)
// Razón: No debe ejecutarse en producción ya que expone información sensible

// Código eliminado: Sistema de backup obsoleto removido (líneas 187-196)
// Razón: Funcionalidad de backup ya no utilizada en el sistema actual

// Variable global adicional
var ultimoRegistro = null;

// Inicializar cuando cargue el DOM
window.addEventListener('DOMContentLoaded', function() {
    // Código eliminado: console.logs y exposición de variables globales removidos (líneas 203, 206-216)
    // Razón: Exponer variables globales en window expone información sensible (API keys, credenciales, conexiones BD)
    // Esto es un riesgo de seguridad crítico y no debe estar en producción
    
    inicializar();
});

// Código eliminado: Función eliminarRegistro removida (líneas 219-224)
// Razón: Funcionalidad no implementada en el sistema actual

// Código eliminado: console.logs finales removidos (líneas 157-159)
// Razón: Logs de depuración innecesarios en producción
