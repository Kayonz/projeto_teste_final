import pool from '../config/database.js';

export const getGastosPorCategoria = async (req, res) => {
  try {
    const userId = req.userId; // pega o usuário autenticado

    const result = await pool.query(
      `
      SELECT c.nome AS categoria, g.descricao, g.valor, g.data_compra
      FROM gastos g
      JOIN categorias c ON g.categoria_id = c.id
      WHERE c.usuario_id = $1
      ORDER BY g.data_compra DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar gastos por categoria:', error);
    res.status(500).json({ error: 'Erro ao buscar gastos por categoria' });
  }
};
