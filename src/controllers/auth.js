
import { registerUser, loginUser, refreshUserSession, logoutUser } from '../services/auth.js';

export const registerController = async (req, res) => {
    const user = await registerUser(req.body);
    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
    });
};

export const loginController = async (req, res) => {
    const { accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil, user } = await loginUser(req.body);
    console.log('Access Token Valid Until:', accessTokenValidUntil);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        expires: refreshTokenValidUntil,
        sameSite: 'None',
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        },
    });
};

export const refreshController = async (req, res) => {
    const { refreshToken } = req.cookies;
    const { accessToken, refreshToken: newRefreshToken, accessTokenValidUntil, refreshTokenValidUntil, user } = await refreshUserSession(refreshToken);


    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        expires: refreshTokenValidUntil,
        sameSite: 'None',
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        },
    });
};

export const logoutController = async (req, res) => {
    const { refreshToken } = req.cookies;
    await logoutUser(refreshToken);

    res.clearCookie('refreshToken');

    res.status(204).send();
};