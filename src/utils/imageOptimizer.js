/**
 * Optimiza una imagen redimensionándola y comprimiéndola
 * @param {File} file - El archivo de imagen a optimizar
 * @param {Object} options - Opciones de optimización
 * @returns {Promise<string>} - La imagen optimizada en formato base64
 */
export async function optimizeImage(file, options = {}) {
    const {
        maxWidth = 800,
        maxHeight = 800,
        quality = 0.8,
        format = 'jpeg'
    } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Calcular dimensiones manteniendo proporción
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }

                // Crear canvas para redimensionar
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                // Dibujar imagen redimensionada
                ctx.drawImage(img, 0, 0, width, height);

                // Convertir a base64 con compresión
                const optimizedImage = canvas.toDataURL(`image/${format}`, quality);

                // Verificar tamaño
                const sizeInMB = (optimizedImage.length * 0.75) / 1024 / 1024;
                console.log(`Tamaño optimizado: ${sizeInMB.toFixed(2)}MB`);

                resolve(optimizedImage);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
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
