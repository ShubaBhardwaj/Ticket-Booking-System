import * as authService from './auth.service.js';
import ApiResponse from '../../common/utils/api-response.js';

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const response = await authService.register({ name, email, password });
    return ApiResponse.created(res, response.message, response.data);
}

const verifyEmail = async (req, res) => {
    const { token } = req.body;
    const response = await authService.verifyEmail({ token });
    return ApiResponse.ok(res, response.message);
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const response = await authService.forgotPassword({ email });
    return ApiResponse.ok(res, response.message, response.data);
}

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const response = await authService.resetPassword({ token, newPassword });
    return ApiResponse.ok(res, response.message);
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const response = await authService.login({ email, password });

    res.cookie('refreshToken', response.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    return ApiResponse.ok(res, response.message, response.data);
}

const logout = async (req, res) => {
    const userId = req.user.id;
    await authService.logout(userId);
    res.clearCookie("refreshToken");
    return ApiResponse.ok(res, 'Logged out successfully');
}

const getme = async (req, res) => {
    const userId = req.user.id;
    const user = await authService.getMe(userId);
    return ApiResponse.ok(res, 'User details fetched successfully', user);
}

export {
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    login,
    logout,
    getme
}
