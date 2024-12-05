import { put, list, del } from '@vercel/blob';

const PRODUCTS_FILE = 'products.json';
const IMAGES_FOLDER = 'images/';

// Función auxiliar para manejar errores
function handleError(error) {
    console.error('API Error:', error);
    return new Response(
        JSON.stringify({
            error: error.message || 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }),
        {
            status: error.status || 500,
            headers: { 'Content-Type': 'application/json' }
        }
    );
}

export async function GET() {
    try {
        const { blobs } = await list();
        const productBlob = blobs.find(blob => blob.pathname === PRODUCTS_FILE);
        
        if (!productBlob) {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const response = await fetch(productBlob.url);
        const products = await response.json();
        
        return new Response(JSON.stringify(products), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST({ request }) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return handleError(new Error('Missing Vercel Blob configuration'));
    }

    try {
        const products = await request.json();

        // Procesar cada producto para guardar las imágenes por separado
        const processedProducts = await Promise.all(products.map(async (product) => {
            if (product.image && product.image.startsWith('data:image')) {
                // Generar un nombre único para la imagen
                const timestamp = Date.now();
                const randomString = Math.random().toString(36).substring(7);
                const imageFileName = `${IMAGES_FOLDER}${timestamp}-${randomString}.webp`;

                // Convertir data URL a Blob
                const base64Data = product.image.split(',')[1];
                const imageBlob = Buffer.from(base64Data, 'base64');

                // Subir la imagen a Vercel Blob
                const { url } = await put(imageFileName, imageBlob, {
                    access: 'public',
                    addRandomSuffix: false,
                    token: process.env.BLOB_READ_WRITE_TOKEN
                });

                // Reemplazar el data URL con la URL de la imagen
                return { ...product, image: url };
            }
            return product;
        }));

        // Guardar los productos actualizados
        const productsJson = JSON.stringify(processedProducts);
        await put(PRODUCTS_FILE, productsJson, {
            access: 'public',
            addRandomSuffix: false,
            token: process.env.BLOB_READ_WRITE_TOKEN
        });

        return new Response(JSON.stringify({ 
            success: true, 
            products: processedProducts 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return handleError(error);
    }
}
