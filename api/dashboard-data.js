// Mostrar nome do usuário logado
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('user');
document.getElementById('loggedUser').textContent = username;

// Logout
document.getElementById('logoutButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Alteração de senha
document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showMessage('As senhas não coincidem', true);
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });
    
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
    
        const data = await response.json();
        showMessage(data.message, false);
        document.getElementById('changePasswordForm').reset();
    } catch (error) {
        console.error('Erro na requisição:', error);
        showMessage(`Erro: ${error.message}`, true);
     }

function showMessage(msg, isError) {
    const messageDiv = document.getElementById('passwordChangeMessage');
    messageDiv.textContent = msg;
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
}