import Tesseract from 'tesseract.js';
import fs from 'fs';
import pool from '../config/database.js';

export const processarCupom = async (req, res) => {
  const imagem = req.file?.path;
  const userId = req.userId;

  if (!imagem) {
    return res.status(400).json({ message: 'Nenhuma imagem enviada' });
  }

  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imagem, 'por');

    fs.unlinkSync(imagem); // Remove a imagem do servidor após processar

    const produtos = extrairProdutos(text);

    for (const item of produtos) {
      const categoriaNome = detectarCategoria(item.nome);

      // Verifica se a categoria existe
      const cat = await pool.query(
        'SELECT id FROM categorias WHERE usuario_id = $1 AND nome ILIKE $2 LIMIT 1',
        [userId, categoriaNome]
      );

      const categoriaId = cat.rows[0]?.id || null;

      // Insere o gasto
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

// Função para extrair nome e valor de cada item do texto do cupom
function extrairProdutos(texto) {
  const linhas = texto.split('\n');
  return linhas
    .filter((linha) => /\d+,\d{2}/.test(linha))
    .map((linha) => {
      const match = linha.match(/(.+?)\s+(\d+,\d{2})/);
      if (!match) return null;

      return {
        nome: match[1].trim(),
        valor: parseFloat(match[2].replace(',', '.')),
      };
    })
    .filter(Boolean);
}

// Função para detectar categoria com base no nome do produto
function detectarCategoria(nome) {
  const nomeMin = nome.toLowerCase();
  if (nomeMin.includes('arroz') || nomeMin.includes('carne')) return 'Alimentação';
  if (nomeMin.includes('uber') || nomeMin.includes('gasolina') || nomeMin.includes('ônibus')) return 'Transporte';
  if (nomeMin.includes('cinema') || nomeMin.includes('netflix')) return 'Lazer';
  if (nomeMin.includes('remédio') || nomeMin.includes('farmácia')) return 'Saúde';
  if (nomeMin.includes('livro') || nomeMin.includes('escola')) return 'Educação';
  return 'Outros';
}
