import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Registro (já tinha, não mexi)
export const registerUser = async (req, res) => {
  // seu código atual aqui
};

// Login (já tinha, só formatado)
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
    res.status(200).json({ token, user: { id: user.id, nome: user.nome, email: user.email, foto_url: user.foto_url } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Pega dados do perfil do usuário logado
export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      'SELECT id, nome, email, foto_url FROM users WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Atualiza dados do perfil do usuário logado
export const updateUserProfile = async (req, res) => {
  const userId = req.userId;
  const { nome, email, senha } = req.body;
  const fotoPerfil = req.file; // multer coloca o arquivo aqui

  try {
    let hashedSenha = null;
    if (senha) {
      hashedSenha = await bcrypt.hash(senha, 10);
    }

    // Montar query dinâmica conforme campos recebidos
    let query = 'UPDATE users SET nome = $1, email = $2';
    const params = [nome, email];
    let paramIndex = 3;

    if (hashedSenha) {
      query += `, senha = $${paramIndex}`;
      params.push(hashedSenha);
      paramIndex++;
    }

    if (fotoPerfil) {
      query += `, foto_url = $${paramIndex}`;
      params.push(fotoPerfil.filename); // salva o nome do arquivo no banco
      paramIndex++;
    }

    query += ` WHERE id = $${paramIndex} RETURNING id, nome, email, foto_url`;
    params.push(userId);

    const result = await pool.query(query, params);

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
