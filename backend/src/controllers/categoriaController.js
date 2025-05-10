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
