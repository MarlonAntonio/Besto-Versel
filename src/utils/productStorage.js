import { uploadImageToBlob } from './blobStorage';

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

// Función para guardar productos
export async function saveProducts(products) {
    try {
        showNotification('Guardando productos...', 'info');

        // Procesar cada producto para guardar las imágenes en Vercel Blob
        const processedProducts = await Promise.all(products.map(async (product) => {
            try {
                // Si la imagen es un data URL, subirla a Vercel Blob
                if (product.image && product.image.startsWith('data:image')) {
                    const imageUrl = await uploadImageToBlob(product.image);
                    return { ...product, image: imageUrl };
                }
                return product;
            } catch (error) {
                console.error('Error processing product image:', error);
                throw new Error(`Error al procesar la imagen de ${product.title}`);
            }
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
        showNotification(error.message || 'Error al guardar los productos', 'error');
        throw error;
    }
}

// Función para obtener productos
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

// Función para optimizar imágenes antes de guardar
export async function optimizeImageForStorage(imageDataUrl) {
    try {
        // Crear un elemento imagen para manipular la imagen
        const img = new Image();
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageDataUrl;
        });

        // Crear un canvas para la optimización
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calcular dimensiones máximas manteniendo el aspect ratio
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
            }
        }

        // Configurar el canvas con las nuevas dimensiones
        canvas.width = width;
        canvas.height = height;

        // Dibujar la imagen optimizada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a JPEG con calidad 0.8 para reducir el tamaño
        return canvas.toDataURL('image/jpeg', 0.8);
    } catch (error) {
        console.error('Error optimizing image:', error);
        showNotification('Error al optimizar la imagen', 'error');
        throw error;
    }
}
