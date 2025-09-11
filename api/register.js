// api/register.js
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

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)', [username, passwordHash]);
      res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ message: 'Este usuário já existe.' });
      }
      console.error(err);
      res.status(500).json({ message: 'Erro ao registrar. Tente novamente.' });
    }
  });
};