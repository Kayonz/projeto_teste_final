import fs from 'fs';
import pool from '../config/database.js';
import Tesseract from 'tesseract.js';

export const processarCupom = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Arquivo não enviado' });
    }

    const userId = req.userId;
    const categoriaId = req.body.categoriaId;
    const imagem = req.file.path;

    // Processa OCR
    const {
      data: { text },
    } = await Tesseract.recognize(imagem, 'por');

    fs.unlinkSync(imagem); // Deleta imagem após processar

    console.log('Texto OCR:', text);

    // Extrair produtos e valores
    const produtos = extrairProdutos(text);

    if (produtos.length === 0) {
      return res.status(400).json({ message: 'Nenhum produto encontrado no cupom' });
    }

    // Salva os produtos no banco
    for (const item of produtos) {
      await pool.query(
        'INSERT INTO gastos (usuario_id, categoria_id, descricao, valor) VALUES ($1, $2, $3, $4)',
        [userId, categoriaId, item.nome, item.valor]
      );
    }

    res.json({ message: 'Cupom processado com sucesso!', produtos });
  } catch (error) {
    console.error('Erro no processarCupom:', error);
    res.status(500).json({ message: 'Erro ao processar cupom' });
  }
};

// 🔥 Função interna para extrair os produtos do texto OCR
function extrairProdutos(texto) {
  const linhas = texto.split('\n');
  const produtos = [];

  const regex = /^(.+?)\s+([0-9]+(?:[.,][0-9]{2}))$/;

  linhas.forEach(linha => {
    const match = linha.trim().match(regex);
    if (match) {
      const nome = match[1].trim();
      const valorStr = match[2].replace(',', '.');
      const valor = parseFloat(valorStr);

      if (nome && !isNaN(valor)) {
        produtos.push({ nome, valor });
      }
    }
  });

  return produtos;
}
