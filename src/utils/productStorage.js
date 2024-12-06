import { uploadImageToBlob } from './blobStorage';
import { processAndUploadImage } from './imageOptimizer';

// Cache de productos para evitar llamadas innecesarias a la API
let productsCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    } text-white z-50`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

/**
 * Saves products to API and handles image optimization
 * @param {Array} products - Array of products to save
 * @returns {Promise<Object>} - Result of the save operation
 */
export async function saveProducts(products) {
    try {
        // Process any new images that are in base64 format
        const processedProducts = await Promise.all(products.map(async (product) => {
            // If the image is already a URL, don't process it again
            if (product.image.startsWith('http')) {
                return product;
            }

            // Process and upload the image
            const imageUrl = await processAndUploadImage(
                product.image,
                product.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
            );

            return {
                ...product,
                image: imageUrl
            };
        }));

        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(processedProducts)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Error al guardar los productos');
        }
        
        // Actualizar el cache
        productsCache = processedProducts;
        lastFetchTime = Date.now();
        
        showNotification('Productos guardados exitosamente', 'success');
        return result;
    } catch (error) {
        console.error('Error saving products:', error);
        showNotification('Error al guardar los productos', 'error');
        throw error;
    }
}

/**
 * Retrieves products from API
 * @param {boolean} [forceRefresh=false] - Whether to force a refresh of the data
 * @returns {Promise<Array>} - Array of products
 */
export async function getProducts(forceRefresh = false) {
    try {
        // Usar cache si está disponible y no ha expirado
        const now = Date.now();
        if (!forceRefresh && productsCache && (now - lastFetchTime < CACHE_DURATION)) {
            return productsCache;
        }

        const response = await fetch('/api/products', {
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al obtener los productos');
        }
        
        const products = await response.json();
        
        // Actualizar el cache solo si la respuesta es válida
        if (Array.isArray(products)) {
            productsCache = products;
            lastFetchTime = now;
        } else {
            throw new Error('Formato de productos inválido');
        }
        
        return products;
    } catch (error) {
        console.error('Error getting products:', error);
        showNotification('Error al cargar los productos', 'error');
        
        // Si hay un error, devolver el cache si existe
        if (productsCache) {
            console.log('Returning cached products due to error');
            return productsCache;
        }
        return [];
    }
}

/**
 * Optimizes an image for storage
 * @param {string} imageData - Base64 image data
 * @returns {Promise<string>} - Optimized image data
 */
export async function optimizeImageForStorage(imageData) {
    try {
        const imageUrl = await processAndUploadImage(
            imageData,
            'temp-' + new Date().getTime()
        );
        return imageUrl;
    } catch (error) {
        console.error('Error optimizing image:', error);
        showNotification('Error al optimizar la imagen', 'error');
        throw error;
    }
}
