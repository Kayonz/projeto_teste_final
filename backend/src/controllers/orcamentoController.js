import pool from '../config/database.js';

export const atualizarOrcamento = async (req, res) => {
  const userId = req.userId;
  const { valor } = req.body;

  if (!valor || isNaN(valor)) {
    return res.status(400).json({ message: "Valor inválido" });
  }

  try {
    await pool.query(
      'UPDATE users SET orcamento_total = $1 WHERE id = $2',
      [valor, userId]
    );

    res.json({ message: "Orçamento atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar orçamento:", error);
    res.status(500).json({ message: "Erro ao atualizar orçamento" });
  }
};