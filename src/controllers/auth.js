import * as authService from '../services/auth.js';
import createError from 'http-errors';
import bcrypt from 'bcrypt';

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) throw createError(409, 'Email in use');

        const user = await authService.registerUser({ name, email, password });

        res.status(201).json({
            status: 201,
            message: 'Successfully registered a user!',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await authService.findUserByEmail(email);
        if (!user) throw createError(401, 'Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw createError(401, 'Invalid credentials');

        const { accessToken, refreshToken } = await authService.login(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: 200,
            message: 'Successfully logged in an user!',
            data: { accessToken },
        });
    } catch (error) {
        console.error('Login error:', error); // Додаємо лог
        next(error);
    }
};

export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        console.log('Refresh token:', refreshToken); // Додаємо лог
        if (!refreshToken) throw createError(401, 'Refresh token missing');

        const session = await authService.findSessionByRefreshToken(refreshToken);
        console.log('Session:', session); // Додаємо лог
        if (!session) throw createError(401, 'Invalid refresh token');

        const { accessToken, refreshToken: newRefreshToken } = await authService.refreshSession(session);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: 200,
            message: 'Successfully refreshed a session!',
            data: { accessToken },
        });
    } catch (error) {
        console.error('Refresh error:', error); // Додаємо лог
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        console.log('Logout refresh token:', refreshToken); // Додаємо лог
        if (!refreshToken) throw createError(401, 'Refresh token missing');

        await authService.deleteSession(refreshToken);

        res.clearCookie('refreshToken');
        res.status(204).send();
    } catch (error) {
        console.error('Logout error:', error); // Додаємо лог
        next(error);
    }
};