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

    if (produtos.length === 0) {
      return res.status(400).json({ message: 'Nenhum produto encontrado no cupom' });
    }

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

// 🔍 Função aprimorada para extrair nome e valor, considerando linhas separadas
function extrairProdutos(texto) {
  const linhas = texto.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const produtos = [];

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];

    // Verifica se a linha tem um valor monetário, ex: "9,28"
    const valorMatch = linha.match(/(\d{1,3},\d{2})/);
    if (valorMatch) {
      const valor = parseFloat(valorMatch[1].replace(',', '.'));

      // Nome do produto: verifica se está na linha anterior ou na mesma linha
      let nome = '';

      const linhaAnterior = linhas[i - 1] || '';
      const nomeMatchAnterior = linhaAnterior.match(/[A-Za-zçÇãÃéÉíÍêÊôÔ\s]{3,}/);
      if (nomeMatchAnterior) {
        nome = nomeMatchAnterior[0].trim();
      } else {
        const nomeMatch = linha.match(/[A-Za-zçÇãÃéÉíÍêÊôÔ\s]{3,}/);
        nome = nomeMatch ? nomeMatch[0].trim() : 'Produto';
      }

      produtos.push({ nome, valor });
    }
  }

  return produtos;
}

// 🎯 Categorização simples baseada no nome
function detectarCategoria(nome) {
  const nomeMin = nome.toLowerCase();
  if (nomeMin.includes('arroz') || nomeMin.includes('carne')) return 'Alimentação';
  if (nomeMin.includes('uber') || nomeMin.includes('gasolina') || nomeMin.includes('ônibus')) return 'Transporte';
  if (nomeMin.includes('cinema') || nomeMin.includes('netflix')) return 'Lazer';
  if (nomeMin.includes('remédio') || nomeMin.includes('farmácia')) return 'Saúde';
  if (nomeMin.includes('livro') || nomeMin.includes('escola')) return 'Educação';
  return 'Outros';
}
