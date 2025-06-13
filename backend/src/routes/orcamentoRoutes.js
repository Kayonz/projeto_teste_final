// routes/orcamentoRoutes.js
import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getOrcamento, salvarOrcamento, zerarOrcamento } from '../controllers/orcamentoController.js';

const router = express.Router();

router.put('/zerar', verifyToken, zerarOrcamento);
router.get('/', verifyToken, getOrcamento);
router.post('/', verifyToken, salvarOrcamento);

export default router;
