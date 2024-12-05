import { put, list, del } from '@vercel/blob';

export async function GET() {
    try {
        const { blobs } = await list();
        const productBlob = blobs.find(blob => blob.pathname === 'products.json');
        
        if (!productBlob) {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const response = await fetch(productBlob.url);
        const products = await response.json();
        
        return new Response(JSON.stringify(products), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error getting products:', error);
        return new Response(JSON.stringify({ error: 'Error fetching products', details: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export async function POST({ request }) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return new Response(JSON.stringify({ error: 'Missing Vercel Blob configuration' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        const products = await request.json();
        const productsJson = JSON.stringify(products);
        
        // Crear un blob con los datos
        const { url } = await put('products.json', productsJson, {
            access: 'public',
            addRandomSuffix: false, // Mantener el mismo nombre de archivo
            token: process.env.BLOB_READ_WRITE_TOKEN
        });
        
        return new Response(JSON.stringify({ success: true, url }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error saving products:', error);
        return new Response(JSON.stringify({ 
            error: 'Error saving products', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
