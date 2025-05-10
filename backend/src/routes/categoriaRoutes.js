import express from 'express';
import { getCategorias } from '../controllers/categoriaController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getCategorias);

export default router;
