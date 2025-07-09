import {
    registerUser,
    loginUser,
    refreshUserSession,
    logoutUser,
} from '../services/auth.js';

export const registerController = async (req, res) => {
    const user = await registerUser(req.body);
    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
    });
};

export const loginController = async (req, res) => {
    const {
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    } = await loginUser(req.body);

    res
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            expires: refreshTokenValidUntil,
            sameSite: 'None',
        })
        .cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            expires: accessTokenValidUntil,
            sameSite: 'None',
        })
        .status(200)
        .json({
            status: 200,
            message: 'Successfully logged in a user!',
            data: {
                accessToken,
            },
        });
};

export const refreshController = async (req, res) => {
    const { refreshToken } = req.cookies;
    const {
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    } = await refreshUserSession(refreshToken);

    res
        .cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            expires: refreshTokenValidUntil,
            sameSite: 'None',
        })
        .cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            expires: accessTokenValidUntil,
            sameSite: 'None',
        })
        .status(200)
        .json({
            status: 200,
            message: 'Successfully refreshed a session!',
            data: {
                accessToken,
            },
        });
};

export const logoutController = async (req, res) => {
    const { refreshToken } = req.cookies;
    await logoutUser(refreshToken);

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    res.status(204).send();
};
