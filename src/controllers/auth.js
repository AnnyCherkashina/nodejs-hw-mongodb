import * as authService from '../services/auth.js';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    // Додайте secure: false для порту 587, якщо його немає, або secure: true для 465
    // Це гарна практика, хоча для 587 це за замовчуванням false
    secure: process.env.SMTP_PORT === '465' ? true : false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

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


        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw createError(400, 'Invalid email format');
        }

        const normalizedEmail = email.toLowerCase();
        console.log('Login attempt:', { email: normalizedEmail, password });

        const user = await authService.findUserByEmail(normalizedEmail);
        if (!user) throw createError(401, 'Invalid credentials');

        console.log('Stored password hash:', user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
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
        console.error('Login error:', error);
        next(error);
    }
};

export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) throw createError(401, 'Refresh token missing');

        const session = await authService.findSessionByRefreshToken(refreshToken);
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
        console.error('Refresh error:', error);
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) throw createError(401, 'Refresh token missing');

        await authService.deleteSession(refreshToken);

        res.clearCookie('refreshToken');
        res.status(204).send();
    } catch (error) {
        console.error('Logout error:', error);
        next(error);
    }
};

export const sendResetEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await authService.findUserByEmail(email);
        if (!user) throw createError(404, 'User not found!');

        const token = jwt.sign({ email }, process.env.JWT_SECRET_RESET, { expiresIn: '5m' });

        // >>>>>>>>>>>>> ДОДАЙТЕ ЦЕЙ РЯДОК <<<<<<<<<<<<<
        const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Password Reset Request',
            text: `Click the following link to reset your password: ${resetLink}`,
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            status: 200,
            message: 'Reset password email has been successfully sent.',
            data: {},
        });
    } catch (error) {
        console.error('Send reset email error:', error);
        // Тут ми вже знаємо, що помилка була ReferenceError, а не проблема з надсиланням листа
        // Тому краще логувати її детальніше або передавати далі
        // Якщо це дійсно помилка SMTP, то 500 з повідомленням "Failed to send the email..." підійде.
        // Але зараз виправлення ReferenceError є пріоритетом.
        next(createError(500, 'Failed to send the email, please try again later.'));
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_RESET);
        } catch (error) {
            throw createError(401, 'Token is expired or invalid.');
        }

        const user = await authService.findUserByEmail(decoded.email);
        if (!user) throw createError(404, 'User not found!');

        user.password = await bcrypt.hash(password, 10);
        await user.save();


        await authService.deleteSessionByUserId(user._id);

        res.status(200).json({
            status: 200,
            message: 'Password has been successfully reset.',
            data: {},
        });
    } catch (error) {
        console.error('Reset password error:', error);
        next(error);
    }
};