// api/delete-account.js
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const authMiddleware = require('./auth-middleware');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  // Usar o middleware de autenticação
  await authMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Método não permitido.' });
    }

    const { password } = req.body;
    const username = req.user.username; // Obtém o username do middleware de autenticação

    if (!password) {
      return res.status(400).json({ message: 'A senha é obrigatória.' });
    }

    try {
      // Buscar usuário e senha
      const result = await pool.query(
        'SELECT password_hash FROM users WHERE username = $1',
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const user = result.rows[0];
      
      // Verificar senha
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Senha incorreta.' });
      }

      // Deletar usuário
      await pool.query(
        'DELETE FROM users WHERE username = $1',
        [username]
      );

      res.status(200).json({ message: 'Conta deletada com sucesso!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao deletar conta. Tente novamente.' });
    }
  });
};