import express from 'express';
import { getGastosAgrupados } from '../controllers/gastosAgrupadosController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/gastos-agrupados', verifyToken, getGastosAgrupados);

export default router;