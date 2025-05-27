export const getGastosPorCategoria = async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      `
      SELECT c.nome AS categoria, 
             COALESCE(SUM(g.valor), 0) AS valor
      FROM categorias c
      LEFT JOIN gastos g ON g.categoria_id = c.id AND g.usuario_id = $1
      WHERE c.usuario_id = $1
      GROUP BY c.nome
      ORDER BY valor DESC;
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar gastos por categoria:", error);
    res.status(500).json({ message: "Erro ao buscar dados" });
  }
};
