import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';

dotenv.config();


app.use('/api/categorias', categoriaRoutes);

const app = express();
app.use(cors());
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.send('API Finance funcionando!');
});

// Rota de teste para buscar usuários no banco
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// 🆕 Ativa as rotas de autenticação (ex: /api/auth/register)
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
