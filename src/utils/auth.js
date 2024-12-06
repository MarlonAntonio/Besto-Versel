import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const HASHED_PASSWORD = '$2a$10$K.RrQqkDO0rKZXYW9jHcXOMWlvKsxOY7M2P3bVGNSXEGO0YoI.0Uy'; // hash of '90gupi90'
const TOKEN_EXPIRY = '24h';
const REFRESH_THRESHOLD = 60 * 60; // 1 hora en segundos

export async function validateCredentials(password) {
    try {
        const isValid = await bcrypt.compare(password, HASHED_PASSWORD);
        return isValid;
    } catch (error) {
        console.error('Error validating credentials:', error);
        return false;
    }
}

export function generateToken() {
    return jwt.sign({ authorized: true, iat: Math.floor(Date.now() / 1000) }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return {
            isValid: decoded.authorized === true,
            shouldRefresh: shouldRefreshToken(decoded),
            decoded
        };
    } catch (error) {
        return { isValid: false, shouldRefresh: false, decoded: null };
    }
}

function shouldRefreshToken(decoded) {
    if (!decoded.exp) return false;
    
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - now;
    
    return timeUntilExpiry < REFRESH_THRESHOLD;
}

export function invalidateToken(token) {
    // En una implementación completa, aquí se agregaría el token a una lista negra
    // Por ahora, solo verificamos que el token sea válido
    try {
        jwt.verify(token, JWT_SECRET);
        return true;
    } catch {
        return false;
    }
}
