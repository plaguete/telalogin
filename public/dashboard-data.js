// public/dashboard-data.js (atualizado)
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
        // Você pode usar os dados aqui se quiser exibir algo específico
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

// Modal de deletar conta
const deleteAccountButton = document.getElementById('deleteAccountButton');
const deleteAccountModal = document.getElementById('deleteAccountModal');
const deleteAccountForm = document.getElementById('deleteAccountForm');
const deleteAccountMessage = document.getElementById('deleteAccountMessage');

// Abrir modal
deleteAccountButton.addEventListener('click', () => {
    deleteAccountModal.style.display = 'flex';
});

// Fechar modal quando clicar fora
deleteAccountModal.addEventListener('click', (e) => {
    if (e.target === deleteAccountModal) {
        deleteAccountModal.style.display = 'none';
    }
});

// Fechar modal com botão de cancelar
document.querySelector('[data-modal="deleteAccountModal"].modal-button-cancel').addEventListener('click', () => {
    deleteAccountModal.style.display = 'none';
});

// Fechar modal com botão X
document.querySelector('[data-modal="deleteAccountModal"].modal-close-button').addEventListener('click', () => {
    deleteAccountModal.style.display = 'none';
});

// Enviar formulário de deletar conta
deleteAccountForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('confirmPasswordDelete').value;
    const token = sessionStorage.getItem('authToken');

    try {
        const response = await fetch('http://localhost:3000/api/delete-account', {
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

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        showDeleteMessage(data.message, false);
        
        // Limpar storage e redirecionar
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('username');
        
        // Redirecionar para a página inicial após 2 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        console.error('Erro na requisição:', error);
        showDeleteMessage(`Erro: ${error.message}`, true);
    }
});

function showMessage(msg, isError) {
    const messageDiv = document.getElementById('passwordChangeMessage');
    messageDiv.textContent = msg;
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
}

function showDeleteMessage(msg, isError) {
    deleteAccountMessage.textContent = msg;
    deleteAccountMessage.className = `message ${isError ? 'error' : 'success'}`;
}