import { verifyToken, generateToken } from '../../utils/auth';

export async function post({ request }) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'No token provided' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const currentToken = authHeader.split(' ')[1];
        const { isValid, shouldRefresh } = verifyToken(currentToken);

        if (!isValid) {
            return new Response(JSON.stringify({ error: 'Invalid token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!shouldRefresh) {
            return new Response(JSON.stringify({ message: 'Token still valid', needsRefresh: false }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const newToken = generateToken();
        return new Response(JSON.stringify({ token: newToken, needsRefresh: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
