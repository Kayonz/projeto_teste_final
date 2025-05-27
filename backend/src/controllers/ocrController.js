export const processarCupom = async (req, res) => {
  const imagem = req.file?.path;
  const userId = req.userId;
  const { categoriaId } = req.body;

  if (!imagem) {
    return res.status(400).json({ message: 'Nenhuma imagem enviada' });
  }

  if (!categoriaId) {
    return res.status(400).json({ message: 'Categoria não informada' });
  }

  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imagem, 'por');

    fs.unlinkSync(imagem); // Remove a imagem após processar

    const produtos = extrairProdutos(text);

    if (produtos.length === 0) {
      return res.status(400).json({ message: 'Nenhum produto encontrado no cupom' });
    }

    for (const item of produtos) {
      await pool.query(
        'INSERT INTO gastos (usuario_id, categoria_id, descricao, valor) VALUES ($1, $2, $3, $4)',
        [userId, categoriaId, item.nome, item.valor]
      );
    }

    res.json({ message: 'Cupom processado com sucesso!', produtos });
  } catch (error) {
    console.error('Erro no OCR:', error);
    res.status(500).json({ message: 'Erro ao processar cupom' });
  }
};
