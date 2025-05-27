import pool from '../config/database.js';

export const getGastosPorCategoria = async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      `
      SELECT c.nome AS categoria, SUM(g.valor) AS valor
      FROM gastos g
      JOIN categorias c ON g.categoria_id = c.id
      WHERE g.usuario_id = $1
      GROUP BY c.nome
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar gastos por categoria:', error);
    res.status(500).json({ message: 'Erro ao buscar gastos por categoria' });
  }
};
