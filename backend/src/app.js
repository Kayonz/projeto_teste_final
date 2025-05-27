import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import financeiroRoutes from './routes/financeiroRoutes.js';
import orcamentoRoutes from './routes/orcamentoRoutes.js';
import orcRoutes from './routes/ocrRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Outras rotas
app.use('/api/categorias', categoriaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/orcamento', orcamentoRoutes);
app.use('/api', orcRoutes);
app.use('/api/auth/me', authRoutes);

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
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
