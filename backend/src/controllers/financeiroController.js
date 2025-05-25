import pool from '../config/database.js';

export const getResumoFinanceiro = async (req, res) => {
  const userId = req.userId;

  try {
    const [orcamentoResult, gastoResult, categoriasResult, quantidadeGastosResult] = await Promise.all([
      pool.query('SELECT SUM(limite) as total_orcamento FROM categorias WHERE usuario_id = $1', [userId]),
      pool.query('SELECT SUM(valor) as total_gastos FROM gastos WHERE usuario_id = $1', [userId]),
      pool.query('SELECT COUNT(*) as total_categorias FROM categorias WHERE usuario_id = $1', [userId]),
      pool.query('SELECT COUNT(*) as total_gastos FROM gastos WHERE usuario_id = $1', [userId]),
    ]);

    const orcamento = parseFloat(orcamentoResult.rows[0].total_orcamento || 0);
    const gastos = parseFloat(gastoResult.rows[0].total_gastos || 0);
    const totalCategorias = parseInt(categoriasResult.rows[0].total_categorias || 0);
    const quantidadeGastos = parseInt(quantidadeGastosResult.rows[0].total_gastos || 0);

    const saldo = orcamento - gastos;
    const percentualGasto = orcamento > 0 ? ((gastos / orcamento) * 100).toFixed(2) : 0;

    res.json({
      orcamento,
      gastos,
      saldo,
      percentualGasto: Number(percentualGasto), // em %
      totalCategorias,
      quantidadeGastos,
    });
  } catch (error) {
    console.error("Erro ao buscar resumo financeiro:", error);
    res.status(500).json({ message: "Erro ao buscar resumo financeiro" });
  }
};
