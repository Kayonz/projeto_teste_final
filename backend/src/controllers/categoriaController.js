import pool from '../config/database.js';

// GET /api/categorias
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

// PUT /api/categorias/:id
export const updateCategoria = async (req, res) => {
  const userId = req.userId;
  const categoriaId = req.params.id;
  const { limite } = req.body;

  try {
    const check = await pool.query(
      'SELECT * FROM categorias WHERE id = $1 AND usuario_id = $2',
      [categoriaId, userId]
    );
    if (check.rowCount === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada ou não pertence ao usuário' });
    }

    // Atualiza o limite
    await pool.query(
      'UPDATE categorias SET limite = $1 WHERE id = $2',
      [limite, categoriaId]
    );

    res.json({ message: 'Limite atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
