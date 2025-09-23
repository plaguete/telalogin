// server.js - CORRIGIDO
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API - CORRIGIDAS
app.post('/api/login', require('./api/login'));
app.post('/api/register', require('./api/register'));
app.post('/api/change-password', require('./api/change-password'));
app.post('/api/delete-account', require('./api/delete-account'));
app.get('/api/dashboard-data', require('./api/dashboard-data'));

// Rotas de páginas
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de fallback
app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});