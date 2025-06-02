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

// Atualiza limite da categoria
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
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
};

// Pega os gastos de uma categoria específica para o usuário logado
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
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar gastos por categoria' });
  }
};
