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
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
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
                headers: { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
                }
            });
        }

        const response = await fetch(productBlob.url);
        if (!response.ok) {
            throw new Error('Failed to fetch products data');
        }
        
        const products = await response.json();
        
        return new Response(JSON.stringify(products), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
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
        
        // Validar la estructura de los productos
        if (!Array.isArray(products)) {
            return handleError(new Error('Products must be an array'));
        }

        // Validar cada producto
        for (const product of products) {
            if (!product.title || !product.image || !product.urlUSA || !product.urlMexico) {
                return handleError(new Error('Invalid product data: missing required fields'));
            }
        }
        
        // Guardar los productos
        const productsJson = JSON.stringify(products);
        const blob = await put(PRODUCTS_FILE, productsJson, {
            access: 'public',
            addRandomSuffix: false,
            token: process.env.BLOB_READ_WRITE_TOKEN,
            contentType: 'application/json'
        });

        if (!blob || !blob.url) {
            throw new Error('Failed to save products to storage');
        }

        return new Response(JSON.stringify({ 
            success: true, 
            products: products,
            url: blob.url
        }), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
        });
    } catch (error) {
        return handleError(error);
    }
}
