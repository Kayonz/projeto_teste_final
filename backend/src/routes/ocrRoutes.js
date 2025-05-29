import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { processarCupom } from '../controllers/ocrController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

const dir = 'src/uploads_cupons';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

// ocrRoutes.js
router.post('/', verifyToken, upload.single('imagem'), processarCupom);


export default router;
