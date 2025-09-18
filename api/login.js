// Substitua todo o conteúdo do arquivo por:
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      'SELECT id, username, password_hash FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (passwordMatch) {
      const authToken = crypto.randomBytes(32).toString('hex');
      await client.query(
        'UPDATE users SET auth_token = $1 WHERE id = $2',
        [authToken, user.id]
      );
      
      res.status(200).json({ 
        message: 'Login bem-sucedido!', 
        username: user.username,
        token: authToken
      });
    } else {
      res.status(401).json({ message: 'Senha incorreta.' });
    }
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ 
      message: 'Erro interno no servidor.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    if (client) client.release();
  }
};