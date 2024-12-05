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
        return new Response(JSON.stringify({ error: 'Error fetching products' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export async function POST({ request }) {
    try {
        const products = await request.json();
        const productsJson = JSON.stringify(products);
        const blob = new Blob([productsJson], { type: 'application/json' });
        
        const { url } = await put('products.json', blob, { access: 'public' });
        
        return new Response(JSON.stringify({ success: true, url }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error saving products:', error);
        return new Response(JSON.stringify({ error: 'Error saving products' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
