import * as authService from './auth.service.js';
import ApiResponse from '../../common/utils/api-response.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    const response = await authService.register({ name, email, password });
    return ApiResponse.created(res, response.message, response.data);
}

export const verifyEmail = async (req, res) => {
    const { token } = req.body;
    const response = await authService.verifyEmail({ token });
    return ApiResponse.ok(res, response.message);
}