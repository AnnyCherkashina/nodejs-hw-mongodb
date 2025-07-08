
import { User } from '../db/models/user.js';
import createHttpError from 'http-errors';

import { Session } from '../db/models/session.js';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';

const JWT_SECRET = getEnvVar('JWT_SECRET');
const JWT_ACCESS_EXPIRES_IN = getEnvVar('JWT_ACCESS_EXPIRES_IN', '15m');
const JWT_REFRESH_EXPIRES_IN = getEnvVar('JWT_REFRESH_EXPIRES_IN', '30d');

export const registerUser = async (payload) => {
    const { email } = payload;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw createHttpError(409, 'Email in use');
    }

    const newUser = await User.create(payload);

    return {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
    };
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(401, 'Unauthorized');
    }

    const passwordCompare = await user.comparePassword(password);
    if (!passwordCompare) {
        throw createHttpError(401, 'Unauthorized');
    }

    await Session.deleteOne({ userId: user._id });


    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });
    const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });


    const accessTokenValidUntil = new Date(Date.now() + (jwt.decode(accessToken).exp * 1000 - Date.now()));
    const refreshTokenValidUntil = new Date(Date.now() + (jwt.decode(refreshToken).exp * 1000 - Date.now()));


    const newSession = await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    });

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
        user,
    };
};

export const refreshUserSession = async (refreshToken) => {
    let payload;
    try {
        payload = jwt.verify(refreshToken, JWT_SECRET);
    } catch (err) {
        throw createHttpError(401, 'Unauthorized - Invalid refresh token');
    }

    const session = await Session.findOne({ refreshToken });
    if (!session) {
        throw createHttpError(401, 'Unauthorized - Session not found');
    }


    if (new Date() > session.refreshTokenValidUntil) {
        throw createHttpError(401, 'Unauthorized - Refresh token expired');
    }


    await Session.deleteOne({ _id: session._id });

    const user = await User.findById(payload.userId);
    if (!user) {
        throw createHttpError(401, 'Unauthorized - User not found');
    }


    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });
    const newRefreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

    const accessTokenValidUntil = new Date(Date.now() + (jwt.decode(accessToken).exp * 1000 - Date.now()));
    const refreshTokenValidUntil = new Date(Date.now() + (jwt.decode(newRefreshToken).exp * 1000 - Date.now()));

    const newSession = await Session.create({
        userId: user._id,
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    });

    return {
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
        user,
    };
};

export const logoutUser = async (refreshToken) => {

    await Session.deleteOne({ refreshToken });
};