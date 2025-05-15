export const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const result = await pool.query(
      'INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
      [nome, email, hashedPassword]
    );

    const newUser = result.rows[0];
    const newUserId = newUser.id;

    // Cria categorias padrão com limite inicial
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
        "INSERT INTO categorias (usuario_id, nome, limite) VALUES ($1, $2, $3)",
        [newUserId, nomeCategoria, 100] // limite padrão de R$ 100
      );
    }

    res.status(201).json(newUser);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
