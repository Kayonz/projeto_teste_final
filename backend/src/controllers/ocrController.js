const pool = require('../db');
const tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const processarCupom = async (req, res) => {
  const userId = req.user.id;
  const categoriaId = req.body.categoriaId;

  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
  }

  if (!categoriaId) {
    return res.status(400).json({ message: 'Categoria não selecionada.' });
  }

  const imagePath = path.resolve(req.file.path);

  try {
    const result = await tesseract.recognize(imagePath, 'por', {
      logger: (m) => console.log(m),
    });

    const textoExtraido = result.data.text;
    console.log('Texto extraído:', textoExtraido);

    // Aqui você faz a extração dos itens com base no padrão do seu cupom
    const linhas = textoExtraido.split('\n');
    const produtos = [];

    linhas.forEach((linha) => {
      const regex = /(.*?)(\d+[,.]?\d*)$/;
      const match = linha.trim().match(regex);

      if (match) {
        const nome = match[1].trim();
        const valor = parseFloat(match[2].replace(',', '.'));

        if (nome && !isNaN(valor)) {
          produtos.push({ nome, valor });
        }
      }
    });

    if (produtos.length === 0) {
      return res.status(400).json({ message: 'Nenhum produto encontrado no cupom.' });
    }

    // Inserir os produtos como gastos no banco
    for (const item of produtos) {
      await pool.query(
        'INSERT INTO gastos (usuario_id, categoria_id, descricao, valor) VALUES ($1, $2, $3, $4)',
        [userId, categoriaId, item.nome, item.valor]
      );
    }

    fs.unlinkSync(imagePath); // Apaga o arquivo após processar

    res.json({
      message: 'Cupom processado com sucesso!',
      produtos,
    });

  } catch (error) {
    console.error('Erro ao processar o cupom:', error);
    res.status(500).json({ message: 'Erro ao processar o cupom.' });
  }
};

module.exports = {
  processarCupom,
};
