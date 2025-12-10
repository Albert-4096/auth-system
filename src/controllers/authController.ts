import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema } from '../utils/validation';

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const validatedData = registerSchema.parse(req.body);

            const existingUser = await AuthService.findUserByEmail(validatedData.email);
            if (existingUser) {
                return res.status(409).json({ message: 'Email already exists' });
            }

            const passwordHash = await AuthService.hashPassword(validatedData.password);
            const user = await AuthService.createUser(validatedData.email, passwordHash);

            const tokens = AuthService.generateTokens(user);

            // Save refresh token
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            await AuthService.saveRefreshToken(user.id, tokens.refreshToken, expiresAt);

            res.status(201).json({ user, ...tokens });
        } catch (error: any) {
            if (error.code === '23505') { // Unique violation mostly for username in race conditions
                return res.status(409).json({ message: 'Email already exists' });
            }
            res.status(400).json({ message: error.message || 'Registration failed' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const validatedData = loginSchema.parse(req.body);

            const user = await AuthService.findUserByEmail(validatedData.email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const validPassword = await AuthService.verifyPassword(user.password_hash, validatedData.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const tokens = AuthService.generateTokens(user);
            // Save refresh token
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            await AuthService.saveRefreshToken(user.id, tokens.refreshToken, expiresAt);

            // Exclude password hash from response
            const { password_hash, ...userWithoutPassword } = user;

            res.json({ user: userWithoutPassword, ...tokens });
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Login failed' });
        }
    }

    static async me(req: any, res: Response) {
        try {
            const user = await AuthService.findUserById(req.user.id);
            if (!user) return res.sendStatus(404);
            res.json(user);
        } catch (e) {
            res.sendStatus(500);
        }
    }
}
