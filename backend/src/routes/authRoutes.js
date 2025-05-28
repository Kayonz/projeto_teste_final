import express from 'express';
import multer from 'multer';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/authControllers.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getUserProfile);
router.patch('/me', verifyToken, upload.single('fotoPerfil'), updateUserProfile);

export default router;
