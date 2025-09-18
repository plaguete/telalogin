// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const changePassword = require('./api/change-password');
const login = require('./api/login');
const register = require('./api/register');
const deleteAccount = require('./api/delete-account');
const dashboardData = require('./api/dashboard-data');
const cors = require('cors');
const loginRouter = require('./api/login');

// Inicializar o app PRIMEIRO
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());
app.use(cors());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Configurar as rotas - IMPORTANTE: fazer isso DEPOIS de inicializar o app

app.post('/api/login', require('./api/login'));

// Rotas da API
app.post('/api/change-password', changePassword);
app.post('/api/register', register);
app.post('/api/delete-account', deleteAccount);
app.get('/api/dashboard-data', dashboardData);

// Rota para dashboard (para evitar erro ao acessar diretamente)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Rota padrão
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});