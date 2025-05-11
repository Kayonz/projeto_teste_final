import pool from '../config/database.js';

export const getResumoFinanceiro = async (req, res) => {
  const userId = req.userId;

  try {
    const orcamentoResult = await pool.query(
      'SELECT SUM(limite) as total_orcamento FROM categorias WHERE usuario_id = $1',
      [userId]
    );

    const gastoResult = await pool.query(
      'SELECT SUM(valor) as total_gastos FROM gastos WHERE usuario_id = $1',
      [userId]
    );

    res.json({
      orcamento: orcamentoResult.rows[0].total_orcamento || 0,
      gastos: gastoResult.rows[0].total_gastos || 0
    });
  } catch (error) {
    console.error("Erro ao buscar resumo financeiro:", error);
    res.status(500).json({ message: "Erro ao buscar resumo financeiro" });
  }
};
