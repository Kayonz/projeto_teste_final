import pool from '../config/database.js';


export const getCategorias = async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      'SELECT id, nome, limite FROM categorias WHERE usuario_id = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: 'Erro ao buscar categorias' });
  }
};
export const updateCategoria = async (req, res) => {
  try {
    const userId = req.userId;
    const categoriaId = req.params.id;
    const { limite } = req.body;

    const result = await pool.query(
      'UPDATE categorias SET limite = $1 WHERE id = $2 AND usuario_id = $3 RETURNING *',
      [limite, categoriaId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada ou sem permissão' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
};

// 🔸 Lista os gastos de uma categoria específica
export const getGastosPorCategoria = async (req, res) => {
  try {
    const userId = req.userId;
    const categoriaId = req.params.id;

    const result = await pool.query(
      `SELECT descricao, valor, data_compra 
       FROM gastos 
       WHERE usuario_id = $1 AND categoria_id = $2
       ORDER BY data_compra DESC`,
      [userId, categoriaId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar gastos por categoria:', error);
    res.status(500).json({ error: 'Erro ao buscar gastos por categoria' });
  }
};


export const getResumoGastosPorCategoria = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `
      SELECT 
        c.id as categoria_id,
        c.nome as categoria,
        COALESCE(SUM(g.valor), 0) as total_gasto
      FROM categorias c
      LEFT JOIN gastos g 
        ON g.categoria_id = c.id AND g.usuario_id = $1
      WHERE c.usuario_id = $1
      GROUP BY c.id, c.nome
      ORDER BY c.nome;
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar resumo de gastos por categoria:', error);
    res.status(500).json({ error: 'Erro ao buscar resumo de gastos por categoria' });
  }
};
