import express from 'express'
import { login, logout, signup, verifyEmail } from '../controllers/auth.controlers.js';

const router = express.Router();


router.post('/signup',signup)  

router.post('/login', login)  

router.post('/logout',logout)  

router.post('/verifyEmail',verifyEmail)

export default router;