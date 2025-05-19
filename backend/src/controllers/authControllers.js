import pool from '../config/database.js';
import bcrypt from 'bcrypt'; // ou bcryptjs
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  // seu código atual aqui
};

export const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
