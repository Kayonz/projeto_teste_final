import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/authControllers.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js'; 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getUserProfile);
router.patch('/me', verifyToken, upload.single('fotoPerfil'), updateUserProfile);

export default router;
