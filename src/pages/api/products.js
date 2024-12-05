import { put, list } from '@vercel/blob';

const PRODUCTS_FILE = 'products.json';

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
        
        // Guardar los productos
        const productsJson = JSON.stringify(products);
        await put(PRODUCTS_FILE, productsJson, {
            access: 'public',
            addRandomSuffix: false,
            token: process.env.BLOB_READ_WRITE_TOKEN
        });

        return new Response(JSON.stringify({ 
            success: true, 
            products: products 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return handleError(error);
    }
}
