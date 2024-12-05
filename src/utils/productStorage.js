import { put, list, del } from '@vercel/blob';

export async function uploadProductsToBlob(products) {
    try {
        // Convertir los productos a JSON
        const productsJson = JSON.stringify(products);
        
        // Crear un Blob con los datos
        const blob = new Blob([productsJson], { type: 'application/json' });
        
        // Subir a Vercel Blob
        const { url } = await put('products.json', blob, { access: 'public' });
        
        return url;
    } catch (error) {
        console.error('Error uploading products:', error);
        throw error;
    }
}

export async function getProductsFromBlob() {
    try {
        const { blobs } = await list();
        const productBlob = blobs.find(blob => blob.pathname === 'products.json');
        
        if (!productBlob) {
            return [];
        }

        const response = await fetch(productBlob.url);
        const products = await response.json();
        
        return products;
    } catch (error) {
        console.error('Error getting products:', error);
        return [];
    }
}
