import { validateCredentials, generateToken } from '../../utils/auth';

export async function post({ request }) {
    try {
        const data = await request.json();
        const { password } = data;

        if (!password) {
            return new Response(JSON.stringify({ error: 'Password is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const isValid = await validateCredentials(password);
        if (!isValid) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const token = generateToken();
        return new Response(JSON.stringify({ token }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Auth error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
