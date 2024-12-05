import { put } from '@vercel/blob';

const IMAGES_FOLDER = 'images/';

export async function uploadImageToBlob(imageDataUrl) {
    try {
        // Extraer el tipo de imagen y los datos base64
        const [, mimeType, base64Data] = imageDataUrl.match(/^data:([a-z/]+);base64,(.+)$/i);
        
        // Generar un nombre único para la imagen
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const extension = mimeType.split('/')[1];
        const imageFileName = `${IMAGES_FOLDER}${timestamp}-${randomString}.${extension}`;

        // Convertir base64 a Buffer
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Subir a Vercel Blob
        const { url } = await put(imageFileName, imageBuffer, {
            access: 'public',
            addRandomSuffix: false,
            contentType: mimeType
        });

        return url;
    } catch (error) {
        console.error('Error uploading image to Vercel Blob:', error);
        throw new Error('Error al subir la imagen. Por favor intenta de nuevo.');
    }
}
