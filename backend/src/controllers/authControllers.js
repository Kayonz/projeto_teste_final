import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

// REGISTRO DE USUÁRIO
export const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Cria usuário e retorna ID
    const result = await pool.query(
      'INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
      [nome, email, hashedPassword]
    );

    const newUser = result.rows[0];
    const newUserId = newUser.id;

    // Categorias padrão
    const categoriasPadrao = [
      "Alimentação",
      "Transporte",
      "Lazer",
      "Moradia",
      "Saúde",
      "Educação",
      "Outros"
    ];

    for (const nomeCategoria of categoriasPadrao) {
      await pool.query(
        'INSERT INTO categorias (usuario_id, nome, limite) VALUES ($1, $2, $3)',
        [newUserId, nomeCategoria, null]
      );
    }

    res.status(201).json(newUser);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// LOGIN DE USUÁRIO
export const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const user = result.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
