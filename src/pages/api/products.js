import { handleResponse } from '../../utils/apiHelpers';

const PRODUCTS_FILE = 'products.json';

// Función auxiliar para manejar errores
function handleError(error) {
    console.error('API Error:', error);
    return handleResponse({
        error: error.message || 'Internal server error',
        status: 500
    });
}

export async function GET({ request, env }) {
    try {
        // Aquí implementaremos la lógica para obtener productos desde una base de datos
        const products = [
            {
                id: 1,
                name: "Producto de ejemplo",
                description: "Este es un producto de ejemplo",
                imageUrl: `${env.R2_PUBLIC_URL}/example-product.jpg`,
                amazonUSUrl: "https://amazon.com/example",
                amazonMXUrl: "https://amazon.com.mx/example"
            }
        ];

        return handleResponse({
            data: products,
            status: 200
        });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST({ request, env }) {
    try {
        const data = await request.json();
        const { name, description, imageUrl, amazonUSUrl, amazonMXUrl } = data;

        if (!name || !description || !imageUrl || !amazonUSUrl || !amazonMXUrl) {
            return handleResponse({
                error: 'Missing required fields',
                status: 400
            });
        }

        // Aquí implementaremos la lógica para guardar en una base de datos
        const newProduct = {
            id: Date.now(),
            name,
            description,
            imageUrl,
            amazonUSUrl,
            amazonMXUrl
        };

        return handleResponse({
            data: newProduct,
            status: 201
        });
    } catch (error) {
        return handleError(error);
    }
}
