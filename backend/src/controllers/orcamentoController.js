// controllers/orcamentoController.js
import pool from '../config/database.js';

export const getOrcamento = async (req, res) => {
  try {
    const userId = req.userId; 
    const result = await pool.query('SELECT valor FROM orcamento WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.json({ orcamento: 0 });
    }

    res.json({ orcamento: result.rows[0].valor });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar orçamento' });
  }
};

export const salvarOrcamento = async (req, res) => {
  try {
    const userId = req.userId;  // idem aqui
    const { valor } = req.body;

    const result = await pool.query('SELECT * FROM orcamento WHERE user_id = $1', [userId]);

    if (result.rows.length > 0) {
      await pool.query('UPDATE orcamento SET valor = $1 WHERE user_id = $2', [valor, userId]);
    } else {
      await pool.query('INSERT INTO orcamento (user_id, valor) VALUES ($1, $2)', [userId, valor]);
    }

    res.json({ message: 'Orçamento salvo com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar orçamento' });
  }
};
