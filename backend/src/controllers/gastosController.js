import pool from '../config/database.js';

export const getGastosPorCategoriaAgrupados = async (req, res) => {
  try {
    const userId = req.userId; // usuário autenticado

    const result = await pool.query(
      `
      SELECT c.nome AS categoria, SUM(g.valor) AS valor
      FROM gastos g
      JOIN categorias c ON g.categoria_id = c.id
      WHERE c.usuario_id = $1
      GROUP BY c.nome
      ORDER BY c.nome
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar gastos agrupados por categoria:', error);
    res.status(500).json({ error: 'Erro ao buscar gastos agrupados por categoria' });
  }
};
