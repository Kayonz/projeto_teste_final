import pool from '../config/database.js';

// Buscar orçamento total
export const getOrcamento = async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      'SELECT SUM(limite) as total_orcamento FROM categorias WHERE usuario_id = $1',
      [userId]
    );

    const orcamento = parseFloat(result.rows[0].total_orcamento) || 0;
    res.json({ orcamento });
  } catch (error) {
    console.error('Erro ao buscar orçamento:', error);
    res.status(500).json({ message: 'Erro ao buscar orçamento' });
  }
};

// Atualizar orçamento
export const salvarOrcamento = async (req, res) => {
  const userId = req.userId;
  const { valor } = req.body;

  try {
    // Atualiza todas as categorias proporcionalmente, ou se quiser faz de outro jeito
    await pool.query(
      'UPDATE categorias SET limite = $1 WHERE usuario_id = $2',
      [valor, userId]
    );

    res.json({ message: 'Orçamento atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar orçamento:', error);
    res.status(500).json({ message: 'Erro ao salvar orçamento' });
  }
};
