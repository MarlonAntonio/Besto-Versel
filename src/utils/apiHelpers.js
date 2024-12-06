/**
 * Genera una respuesta estandarizada para las APIs
 * @param {Object} options - Opciones de respuesta
 * @param {Object} [options.data] - Datos a enviar
 * @param {string} [options.error] - Mensaje de error
 * @param {number} options.status - Código de estado HTTP
 * @returns {Response} - Respuesta formateada
 */
export function handleResponse({ data, error, status = 200 }) {
    const body = {
        success: !error,
        ...(data && { data }),
        ...(error && { error })
    };

    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}

/**
 * Maneja errores de API de forma estandarizada
 * @param {Error} error - Error a manejar
 * @returns {Response} - Respuesta de error formateada
 */
export function handleError(error) {
    console.error('API Error:', error);
    
    return handleResponse({
        error: error.message || 'Internal server error',
        status: error.status || 500
    });
}
