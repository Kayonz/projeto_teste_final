import express from 'express';
import { getMetricasFinanceiras } from './controllers/metricasController.js';
import authMiddleware from './middlewares/authMiddleware.js';

const router = express.Router();

router.get('/api/metricas', authMiddleware, getMetricasFinanceiras);

export default router;
