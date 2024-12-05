/**
 * Optimiza una imagen redimensionándola y comprimiéndola
 * @param {File} file - El archivo de imagen a optimizar
 * @param {Object} options - Opciones de optimización
 * @returns {Promise<Object>} - La imagen optimizada con metadatos
 */
export async function optimizeImage(file, options = {}) {
    const {
        maxWidth = 800,
        maxHeight = 800,
        quality = 0.8,
        format = 'webp'
    } = options;

    try {
        // Crear un objeto URL para la imagen
        const imageUrl = URL.createObjectURL(file);
        
        // Cargar la imagen
        const img = new Image();
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageUrl;
        });

        // Liberar el objeto URL
        URL.revokeObjectURL(imageUrl);

        // Calcular las nuevas dimensiones manteniendo el aspect ratio
        let { width, height } = calculateDimensions(img.width, img.height, maxWidth, maxHeight);

        // Crear un canvas para la optimización
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Establecer dimensiones del canvas
        canvas.width = width;
        canvas.height = height;

        // Dibujar la imagen optimizada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a formato especificado
        const mimeType = `image/${format}`;
        const dataUrl = canvas.toDataURL(mimeType, quality);

        // Validar el tamaño resultante
        const sizeInMB = (dataUrl.length * 0.75) / (1024 * 1024); // Convertir de base64 a MB
        if (sizeInMB > 5) {
            // Si la imagen es mayor a 5MB, reoptimizar con menor calidad
            return optimizeImage(file, { 
                ...options, 
                quality: Math.max(0.5, quality - 0.2),
                maxWidth: Math.floor(width * 0.8),
                maxHeight: Math.floor(height * 0.8)
            });
        }

        return {
            dataUrl,
            width,
            height,
            size: sizeInMB,
            format,
            quality
        };
    } catch (error) {
        console.error('Error optimizing image:', error);
        throw new Error('No se pudo optimizar la imagen. Por favor intenta con otra imagen.');
    }
}

function calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
    let width = originalWidth;
    let height = originalHeight;

    // Reducir si excede el ancho máximo
    if (width > maxWidth) {
        height = Math.floor(height * (maxWidth / width));
        width = maxWidth;
    }

    // Reducir si aún excede el alto máximo
    if (height > maxHeight) {
        width = Math.floor(width * (maxHeight / height));
        height = maxHeight;
    }

    return { width, height };
}

/**
 * Obtiene información sobre el tamaño de una imagen en base64
 * @param {string} base64String - La imagen en formato base64
 * @returns {string} - Tamaño formateado
 */
export function getBase64Size(base64String) {
    const sizeInBytes = (base64String.length * 0.75);
    if (sizeInBytes < 1024) {
        return `${sizeInBytes.toFixed(2)}B`;
    } else if (sizeInBytes < 1024 * 1024) {
        return `${(sizeInBytes / 1024).toFixed(2)}KB`;
    } else {
        return `${(sizeInBytes / 1024 / 1024).toFixed(2)}MB`;
    }
}
