import express from 'express';
import { getCategorias, updateCategoria, getGastosPorCategoria, getResumoGastosPorCategoria } from '../controllers/categoriaController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getCategorias);
router.put('/:id', verifyToken, updateCategoria);
router.get('/:id/gastos', verifyToken, getGastosPorCategoria);
router.get('/resumo-gastos-por-categoria', getResumoGastosPorCategoria);

export default router;
