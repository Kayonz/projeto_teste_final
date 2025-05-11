import express from 'express';
import { atualizarOrcamento } from '../controllers/orcamentoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put('/', verifyToken, atualizarOrcamento);

export default router;
