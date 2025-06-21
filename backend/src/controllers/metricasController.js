// routes/metricasController.js
import pool from '../config/database.js';
import dayjs from 'dayjs';

export const getMetricasFinanceiras = async (req, res) => {
  const userId = req.userId;

  try {
    // 1. Total gasto no mês atual
    const inicioMes = dayjs().startOf('month').format('YYYY-MM-DD');
    const fimMes = dayjs().endOf('month').format('YYYY-MM-DD');

    const gastosResult = await pool.query(
      `
      SELECT SUM(valor) AS total_gastos
      FROM gastos
      WHERE usuario_id = $1 AND data_compra BETWEEN $2 AND $3
      `,
      [userId, inicioMes, fimMes]
    );

    const totalGastos = parseFloat(gastosResult.rows[0].total_gastos) || 0;

    // 2. Total orçamento disponível (soma dos limites das categorias)
    const orcamentoResult = await pool.query(
      `
      SELECT SUM(limite) AS total_orcamento
      FROM categorias
      WHERE usuario_id = $1
      `,
      [userId]
    );

    const totalOrcamento = parseFloat(orcamentoResult.rows[0].total_orcamento) || 0;

    // 3. Valor poupado
    const valorPoupado = Math.max(0, totalOrcamento - totalGastos);

    // 4. Simulação de rendimento no CDI (média mensal ~0.93%)
    const rendimentoCDI = valorPoupado * 0.0093;

    res.json({
      totalGastos,
      valorPoupado,
      rendimentoCDI,
    });
  } catch (error) {
    console.error('Erro ao calcular métricas financeiras:', error);
    res.status(500).json({ message: 'Erro ao calcular métricas financeiras' });
  }
};
