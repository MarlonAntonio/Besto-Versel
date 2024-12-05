import { uploadImageToBlob } from './blobStorage';

// Cache de productos para evitar llamadas innecesarias a la API
let productsCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Función para guardar productos
export async function saveProducts(products) {
    try {
        // Procesar cada producto para guardar las imágenes en Vercel Blob
        const processedProducts = await Promise.all(products.map(async (product) => {
            // Si la imagen es un data URL, subirla a Vercel Blob
            if (product.image && product.image.startsWith('data:image')) {
                const imageUrl = await uploadImageToBlob(product.image);
                return { ...product, image: imageUrl };
            }
            return product;
        }));

        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(processedProducts)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error saving products');
        }
        
        // Actualizar el cache
        productsCache = processedProducts;
        lastFetchTime = Date.now();
        
        return await response.json();
    } catch (error) {
        console.error('Error saving products:', error);
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

        const response = await fetch('/api/products');
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error fetching products');
        }
        
        const products = await response.json();
        
        // Actualizar el cache
        productsCache = products;
        lastFetchTime = now;
        
        return products;
    } catch (error) {
        console.error('Error getting products:', error);
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
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }

        // Establecer dimensiones del canvas
        canvas.width = width;
        canvas.height = height;

        // Dibujar la imagen optimizada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a WebP con calidad optimizada
        return canvas.toDataURL('image/webp', 0.8);
    } catch (error) {
        console.error('Error optimizing image:', error);
        throw error;
    }
}
