
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';

const JWT_SECRET = getEnvVar('JWT_SECRET');

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(createHttpError(401, 'Unauthorized - No Authorization header'));
    }

    const [bearer, accessToken] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !accessToken) {
        return next(createHttpError(401, 'Unauthorized - Invalid Authorization header format'));
    }

    let payload;
    try {
        payload = jwt.verify(accessToken, JWT_SECRET);
    } catch (err) {

        if (err.name === 'TokenExpiredError') {
            return next(createHttpError(401, 'Access token expired'));
        }
        return next(createHttpError(401, 'Unauthorized - Invalid access token'));
    }

    const user = await User.findById(payload.userId);
    if (!user) {
        return next(createHttpError(401, 'Unauthorized - User not found'));
    }


    const session = await Session.findOne({ accessToken });
    if (!session) {
        return next(createHttpError(401, 'Unauthorized - Session not found'));
    }


    req.user = user;
    req.session = session;
    next();
};