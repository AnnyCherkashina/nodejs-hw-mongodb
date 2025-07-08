import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const generateTokens = (userId) => {
    const sessionId = uuidv4();
    const accessToken = jwt.sign(
        { userId, sessionId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { userId, sessionId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '30d' }
    );
    return { accessToken, refreshToken, sessionId };
};