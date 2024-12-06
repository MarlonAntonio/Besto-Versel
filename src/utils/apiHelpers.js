/**
 * Handles API response formatting
 * @param {Object} options - Response options
 * @param {Object} [options.data] - Response data
 * @param {string} [options.error] - Error message
 * @param {number} options.status - HTTP status code
 * @returns {Response} Formatted response
 */
export function handleResponse({ data, error, status }) {
    const body = error 
        ? { error, success: false } 
        : { data, success: true };

    return new Response(
        JSON.stringify(body),
        {
            status,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        }
    );
}
