import { Router } from "express";
import validate from "../../common/middleware/validate.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import * as authController from './auth.controller.js';

const router = Router();

router.post("/register", validate(RegisterDto), authController.register);
router.post("/verify-email", authController.verifyEmail);

export default router;