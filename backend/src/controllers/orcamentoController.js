import pool from '../config/database.js';


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

export const zerarOrcamento = async (req, res) => {
  const userId = req.userId;

  try {
    await pool.query(
      'UPDATE categorias SET limite = 0 WHERE usuario_id = $1',
      [userId]
    );

    res.json({ message: 'Orçamento zerado com sucesso.' });
  } catch (error) {
    console.error('Erro ao zerar orçamento:', error);
    res.status(500).json({ error: 'Erro ao zerar orçamento.' });
  }
};


export const salvarOrcamento = async (req, res) => {
  const userId = req.userId;
  const { valor } = req.body;

  try {
    // Pega todas as categorias do usuário
    const result = await pool.query(
      'SELECT id, limite FROM categorias WHERE usuario_id = $1',
      [userId]
    );

    const categorias = result.rows;

    const totalAtual = categorias.reduce((acc, cat) => acc + parseFloat(cat.limite), 0);

    if (totalAtual === 0) {
      // Se orçamento atual for 0, distribui igualmente
      const novoLimite = valor / categorias.length;

      await Promise.all(
        categorias.map((cat) =>
          pool.query(
            'UPDATE categorias SET limite = $1 WHERE id = $2',
            [novoLimite, cat.id]
          )
        )
      );
    } else {
      // Proporcional ao limite atual
      await Promise.all(
        categorias.map((cat) => {
          const proporcao = parseFloat(cat.limite) / totalAtual;
          const novoLimite = proporcao * valor;

          return pool.query(
            'UPDATE categorias SET limite = $1 WHERE id = $2',
            [novoLimite, cat.id]
          );
        })
      );
    }

    res.json({ message: 'Orçamento atualizado proporcionalmente com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar orçamento:', error);
    res.status(500).json({ message: 'Erro ao salvar orçamento' });
  }
};