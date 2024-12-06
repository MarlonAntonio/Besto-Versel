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
 * Guarda un nuevo producto
 * @param {Object} product - Datos del producto
 * @returns {Promise<Object>} - Producto guardado
 */
export async function saveProduct(product) {
    try {
        // Procesar y subir la imagen si existe
        let imageUrl = null;
        if (product.image) {
            imageUrl = await processAndUploadImage(product.image, `product-${Date.now()}`);
        }

        const productData = {
            ...product,
            imageUrl,
            createdAt: new Date().toISOString()
        };

        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error('Failed to save product');
        }

        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving product:', error);
        throw new Error('Failed to save product');
    }
}

/**
 * Obtiene todos los productos
 * @returns {Promise<Array>} - Lista de productos
 */
export async function getProducts() {
    try {
        // Usar cache si está disponible y no ha expirado
        const now = Date.now();
        if (productsCache && (now - lastFetchTime < CACHE_DURATION)) {
            return productsCache;
        }

        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const { data } = await response.json();
        productsCache = data;
        lastFetchTime = now;
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
}

/**
 * Elimina un producto
 * @param {string} productId - ID del producto a eliminar
 * @returns {Promise<void>}
 */
export async function deleteProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        throw new Error('Failed to delete product');
    }
}

/**
 * Actualiza un producto existente
 * @param {string} productId - ID del producto a actualizar
 * @param {Object} updates - Datos actualizados del producto
 * @returns {Promise<Object>} - Producto actualizado
 */
export async function updateProduct(productId, updates) {
    try {
        // Procesar y subir la nueva imagen si existe
        let imageUrl = updates.imageUrl;
        if (updates.image) {
            imageUrl = await processAndUploadImage(updates.image, `product-${Date.now()}`);
        }

        const productData = {
            ...updates,
            imageUrl,
            updatedAt: new Date().toISOString()
        };

        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error('Failed to update product');
        }

        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw new Error('Failed to update product');
    }
}
