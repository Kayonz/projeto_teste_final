import express from 'express';
import { getResumoFinanceiro } from '../controllers/financeiroController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/resumo', verifyToken, getResumoFinanceiro);

export default router;
