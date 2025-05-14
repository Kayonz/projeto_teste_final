import express from 'express';
import multer from 'multer';
import { processarCupom } from '../controllers/ocrController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/upload-cupom', verifyToken, upload.single('imagem'), processarCupom);

export default router;
