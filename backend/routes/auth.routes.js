import express from 'express'
import { forgotPassword, login, logout, resetPassword, signup, verifyEmail } from '../controllers/auth.controlers.js';

const router = express.Router();


router.post('/signup',signup)  

router.post('/login', login)  

router.post('/logout',logout)  

router.post('/verifyEmail',verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token',resetPassword)

export default router;