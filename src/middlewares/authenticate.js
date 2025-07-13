import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/user.js';
import Session from '../models/session.js';

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        console.log('Authorization header:', authHeader);
        const [bearer, token] = authHeader.split(' ');

        if (bearer !== 'Bearer' || !token) {
            throw createError(401, 'Access token is missing');
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            console.log('JWT payload:', payload);
        } catch (error) {
            console.error('JWT verification error:', error);
            if (error.name === 'TokenExpiredError') {
                throw createError(401, 'Access token expired');
            }
            throw createError(401, 'Invalid access token');
        }

        const session = await Session.findOne({ accessToken: token, userId: payload.userId, sessionId: payload.sessionId });
        console.log('Session found:', session);
        if (!session) {
            throw createError(401, 'Session not found');
        }

        const user = await User.findById(payload.userId);
        if (!user) {
            throw createError(401, 'User not found');
        }

        req.user = user;
        req.session = session;

        next();
    } catch (error) {
        console.error('Authenticate error:', error);
        next(error);
    }
};

export default authenticate;