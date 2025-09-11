// api/login.js
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

    const { username, password } = req.body;

    try {
      const result = await pool.query('SELECT password_hash FROM users WHERE username = $1', [username]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (passwordMatch) {
        res.status(200).json({ message: 'Login bem-sucedido!', username: username });
      } else {
        res.status(401).json({ message: 'Senha incorreta.' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no login. Tente novamente.' });
    }
  });
};