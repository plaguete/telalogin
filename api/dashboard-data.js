// api/dashboard-data.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  app(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Método não permitido.' });
    }

    // Verificar o token de autenticação
    const authToken = req.headers.authorization;

    if (!authToken) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    try {
      // Verificar se o token é válido
      const result = await pool.query('SELECT username FROM users WHERE auth_token = $1', [authToken]);

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Token inválido.' });
      }

      const user = result.rows[0];
      res.status(200).json({ 
        message: 'Dados do dashboard',
        data: `Olá, ${user.username}! Seus dados privados estão aqui.`
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao acessar o dashboard.' });
    }
  });
};