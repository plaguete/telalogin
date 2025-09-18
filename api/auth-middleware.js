// api/auth-middleware.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  try {
    const result = await pool.query(
      'SELECT username FROM users WHERE auth_token = $1',
      [authHeader]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Token inválido.' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro na autenticação.' });
  }
};