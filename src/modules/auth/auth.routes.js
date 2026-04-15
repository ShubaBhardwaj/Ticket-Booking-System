import { Router } from "express";
import validate from "../../common/middleware/validate.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";
import VerifyEmailDto from "./dto/verifyEmail.dto.js";
import ForgotPasswordDto from "./dto/forgotPassword.dto.js";
import ResetPasswordDto from "./dto/resetPassword.dto.js";
import * as authController from './auth.controller.js';
import { authenticate } from "./auth.middleware.js";

const router = Router();

router.post("/register", validate(RegisterDto), authController.register);
router.post("/verify-email", validate(VerifyEmailDto), authController.verifyEmail);
router.post("/forgot-password", validate(ForgotPasswordDto), authController.forgotPassword);
router.post("/reset-password", validate(ResetPasswordDto), authController.resetPassword);
router.post("/login", validate(LoginDto), authController.login);
router.post("/logout", authenticate, authController.logout);
router.post("/refresh", authenticate, authController.refresh);

router.get("/me", authenticate, authController.getme);

export default router;