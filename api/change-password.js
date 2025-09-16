require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  app(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Método não permitido.' });
    }

    const { username, currentPassword, newPassword } = req.body;

    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
      // Buscar usuário e senha atual
      const result = await pool.query(
        'SELECT password_hash FROM users WHERE username = $1',
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const user = result.rows[0];
      
      // Verificar senha atual
      const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
      
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Senha atual incorreta.' });
      }

      // Verificar se nova senha é diferente da atual
      const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
      
      if (isSamePassword) {
        return res.status(400).json({ message: 'A nova senha não pode ser igual à senha atual.' });
      }

      // Gerar novo hash e atualizar
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      
      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE username = $2',
        [newPasswordHash, username]
      );

      res.status(200).json({ message: 'Senha alterada com sucesso!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao alterar senha. Tente novamente.' });
    }
  });
};

// Adicione esta verificação após verificar a senha atual
const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
if (isSamePassword) {
    return res.status(400).json({ message: 'A nova senha não pode ser igual à senha atual.' });
}