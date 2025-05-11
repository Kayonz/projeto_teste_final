import express from 'express';
import { getCategorias } from '../controllers/categoriaController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { updateCategoria } from '../controllers/categoriaController.js';

const router = express.Router();

router.get('/', verifyToken, getCategorias);
router.put('/:id', verifyToken, updateCategoria);

export default router;
