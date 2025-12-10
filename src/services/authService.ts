import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';

export class AuthService {
    static async hashPassword(password: string): Promise<string> {
        return argon2.hash(password);
    }

    static async verifyPassword(hash: string, plain: string): Promise<boolean> {
        return argon2.verify(hash, plain);
    }

    static generateTokens(user: any) {
        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );

        // In a real app, you might want a separate secret for refresh tokens
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    }

    static async createUser(email: string, passwordHash: string) {
        const result = await query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
            [email, passwordHash]
        );
        return result.rows[0];
    }

    static async findUserByEmail(email: string) {
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async findUserById(id: number) {
        const result = await query('SELECT id, email, created_at FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async saveRefreshToken(userId: number, token: string, expiresAt: Date) {
        await query(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [userId, token, expiresAt]
        );
    }
}
