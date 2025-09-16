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
        const response = await fetch('/api/change-password', {
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

        const data = await response.json();
        
        if (response.ok) {
            showMessage(data.message, false);
            document.getElementById('changePasswordForm').reset();
        } else {
            showMessage(data.message, true);
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', true);
    }
});

function showMessage(msg, isError) {
    const messageDiv = document.getElementById('passwordChangeMessage');
    messageDiv.textContent = msg;
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
}

