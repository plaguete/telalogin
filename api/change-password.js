const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db'); // Certifique-se de que o pool está configurado corretamente
const { verifyToken } = require('../auth'); // Função para validar o token

const router = express.Router();

router.post('/change-password', async (req, res) => {
  try {
    const { token } = req.headers.authorization?.split(' ')[1] || {};
    const { username, newPassword } = req.body;

    // Verifica se o token é válido
    if (!token || !verifyToken(token)) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }

    // Verifica se o novo password foi enviado
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'A nova senha deve ter pelo menos 6 caracteres.' });
    }

    // Hash da nova senha
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha no banco de dados
    await pool.query('UPDATE users SET password_hash = $1 WHERE username = $2', [newPasswordHash, username]);

    console.log('Senha alterada com sucesso para o usuário:', username);
    res.status(200).json({ message: 'Senha alterada com sucesso!' });
  } catch (err) {
    console.error('Erro ao alterar senha:', err);
    res.status(500).json({ message: 'Erro ao alterar a senha. Tente novamente.' });
  }
});

module.exports = router;