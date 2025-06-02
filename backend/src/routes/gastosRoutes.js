import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getGastosPorCategoria } from '../controllers/gastos-por-categoria.js';

const router = express.Router();

router.get('/gastos-por-categoria', verifyToken, getGastosPorCategoria);

export default router;
