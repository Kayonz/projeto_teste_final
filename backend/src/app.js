import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import pool from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import financeiroRoutes from './routes/financeiroRoutes.js';
import orcamentoRoutes from './routes/orcamentoRoutes.js';
import ocrRoutes from './routes/ocrRoutes.js';
import gastosRoutes from './routes/gastosRoutes.js';
import metricasRoutes from './routes/metricasRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/orcamento', orcamentoRoutes);
app.use('/api/cupom', ocrRoutes);
app.use('/api', gastosRoutes);
app.use('/api/gastos-por-categoria', gastosRoutes);
app.use('/api/gastos-agrupados', gastosRoutes);;
app.use('api/orcamento/zerar', orcamentoRoutes);
app.use('/api/metricas', metricasRoutes);

app.get('/', (req, res) => {
  res.send('API Finance funcionando!');
});

app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));
