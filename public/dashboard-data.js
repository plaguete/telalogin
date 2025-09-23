// public/dashboard-data.js (corrigido)
// Mostrar nome do usuário logado
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('user') || sessionStorage.getItem('username');
document.getElementById('loggedUser').textContent = username;

// Verificar autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('authToken');
    
    if (!token) {
        alert('Você não está autenticado. Redirecionando para a página de login.');
        window.location.href = 'index.html';
        return;
    }

    try {
        // Carregar dados privados
        const response = await fetch('/api/dashboard-data', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });

        if (response.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('username');
            window.location.href = 'index.html';
            return;
        }

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Dados privados:', data);
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
    }
});

// Logout
document.getElementById('logoutButton').addEventListener('click', () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    window.location.href = 'index.html';
});

// Alteração de senha
document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const token = sessionStorage.getItem('authToken');

    if (newPassword !== confirmPassword) {
        showMessage('As senhas não coincidem', true);
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
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
});

// Deletar conta - CÓDIGO CORRIGIDO
async function deleteAccount() {
    const password = document.getElementById('confirmPasswordDelete').value;
    const token = sessionStorage.getItem('authToken');
    const username = sessionStorage.getItem('username');

    if (!password) {
        alert("Por favor, digite sua senha para confirmar.");
        return;
    }

    if (!confirm("Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.")) {
        return;
    }

    try {
        const response = await fetch('/api/delete-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `Erro: ${response.status}`);
        }

        alert("Conta deletada com sucesso! Redirecionando...");
        
        // Limpar storage e redirecionar
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('username');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Erro ao deletar conta:', error);
        alert(`Erro ao deletar conta: ${error.message}`);
    }
}

// Adicionar event listener ao formulário de deletar conta
document.addEventListener('DOMContentLoaded', function() {
    const deleteForm = document.getElementById('deleteAccountForm');
    if (deleteForm) {
        deleteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            deleteAccount();
        });
    }
});

function showMessage(msg, isError) {
    const messageDiv = document.getElementById('passwordChangeMessage');
    messageDiv.textContent = msg;
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
}

function showDeleteMessage(msg, isError) {
    const messageDiv = document.getElementById('deleteAccountMessage');
    messageDiv.textContent = msg;
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
    messageDiv.style.display = 'block';
}

function logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    window.location.href = 'index.html';
}