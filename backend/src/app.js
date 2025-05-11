import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import financeiroRoutes from './routes/financeiroRoutes.js'
import orcamentoRoutes from './routes/orcamentoRoutes.js';


dotenv.config();

const app = express(); // ✅ Cria o app primeiro
app.use(cors());
app.use(express.json());


app.use('/api/categorias', categoriaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/orcamento', orcamentoRoutes);



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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
