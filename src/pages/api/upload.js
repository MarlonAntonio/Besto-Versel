import { handleResponse, handleError } from '../../utils/apiHelpers';
import { authMiddleware } from '../../middleware/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST({ request, env }) {
    try {
        // Verificar autenticación
        const authResponse = await authMiddleware({ request });
        if (authResponse) return authResponse;

        const formData = await request.formData();
        const file = formData.get('file');
        
        if (!file) {
            return handleResponse({
                error: 'No file provided',
                status: 400
            });
        }

        // Obtener el nombre del archivo del FormData
        const filename = file.name;
        
        // Convertir el archivo a ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Subir a R2
        await env.PRODUCT_IMAGES.put(filename, arrayBuffer, {
            httpMetadata: {
                contentType: file.type
            }
        });

        // Construir la URL pública
        const imageUrl = `${env.R2_PUBLIC_URL}/${filename}`;

        return handleResponse({
            data: { url: imageUrl },
            status: 200
        });
    } catch (error) {
        console.error('Error handling file upload:', error);
        return handleError(error);
    }
}
