import { isAuthentication, login, logout, register, resetPassword, sendResetOtp, sendverifyOtp, testEmail, verifyEmail } from "../controllers/authController.js";
import express from 'express';
import userAuth from "../middleware/userAuth.js";

 const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendverifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthentication);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/test-email', testEmail); // Add test email route


export default authRouter;