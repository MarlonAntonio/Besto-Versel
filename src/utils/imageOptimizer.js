/**
 * Optimizes an image using Canvas API
 * @param {string} imageData - Base64 encoded image data
 * @returns {Promise<Blob>} - Optimized image blob
 */
export async function optimizeImage(imageData) {
    try {
        return new Promise((resolve, reject) => {
            // Create an image element
            const img = new Image();
            
            // Handle load event
            img.onload = () => {
                // Create canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions
                let { width, height } = img;
                const maxSize = 800;
                
                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    } else {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                }
                
                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;
                
                // Draw and optimize image
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to blob
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to convert canvas to blob'));
                        }
                    },
                    'image/jpeg',
                    0.8 // quality
                );
            };
            
            // Handle error
            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
            
            // Set image source
            img.src = imageData;
        });
    } catch (error) {
        console.error('Error optimizing image:', error);
        throw new Error('Failed to optimize image');
    }
}

/**
 * Uploads an image to Cloudflare R2
 * @param {Blob} imageBlob - Image blob to upload
 * @param {string} filename - Name for the uploaded file
 * @returns {Promise<string>} - URL of the uploaded image
 */
export async function uploadImage(imageBlob, filename) {
    try {
        const formData = new FormData();
        formData.append('file', imageBlob, filename);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to upload image');
        }

        const { url } = await response.json();
        return url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image to storage');
    }
}

/**
 * Processes and uploads an image
 * @param {string} imageData - Base64 encoded image data
 * @param {string} filename - Name for the uploaded file
 * @returns {Promise<string>} - URL of the processed and uploaded image
 */
export async function processAndUploadImage(imageData, filename) {
    try {
        // First optimize the image
        const optimizedBlob = await optimizeImage(imageData);
        
        // Generate unique filename
        const timestamp = new Date().getTime();
        const uniqueFilename = `${timestamp}-${filename}.jpg`;
        
        // Upload to R2
        const imageUrl = await uploadImage(optimizedBlob, uniqueFilename);
        
        return imageUrl;
    } catch (error) {
        console.error('Error processing and uploading image:', error);
        throw new Error('Failed to process and upload image');
    }
}
