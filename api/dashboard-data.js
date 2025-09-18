// api/dashboard-data.js
const authMiddleware = require('./auth-middleware');

module.exports = async (req, res) => {
  // Usar o middleware de autenticação
  await authMiddleware(req, res, () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Método não permitido.' });
    }

    // Dados privados (exemplo)
    const privateData = {
      message: 'Bem-vindo ao dashboard!',
      data: 'Seus dados privados estão aqui.',
      user: req.user.username,
      lastLogin: new Date().toLocaleString()
    };

    res.status(200).json(privateData);
  });
};