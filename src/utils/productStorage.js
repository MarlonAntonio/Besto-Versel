// Función para guardar productos
export async function saveProducts(products) {
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(products)
        });
        
        if (!response.ok) {
            throw new Error('Error saving products');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error saving products:', error);
        throw error;
    }
}

// Función para obtener productos
export async function getProducts() {
    try {
        const response = await fetch('/api/products');
        
        if (!response.ok) {
            throw new Error('Error fetching products');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error getting products:', error);
        return [];
    }
}
