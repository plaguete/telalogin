// --- CÓDIGO ADICIONADO PARA GERENCIAR A INTERFACE ---

document.addEventListener('DOMContentLoaded', () => {
    // Elementos da UI
    const loginUserCard = document.getElementById('login-user-card');
    const registerUserCard = document.getElementById('register-user-card');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeButtons = document.querySelectorAll('.modal-close-button, .modal-button-cancel');
    
    // Contêineres das mensagens
    const message = document.getElementById('message');
    const messageContainerLogin = document.getElementById('message-container-login');
    const messageContainerRegister = document.getElementById('message-container-register');

    const openModal = (modal, messageContainer) => {
        // Move a div de mensagem para o modal correto e limpa
        messageContainer.appendChild(message);
        message.textContent = '';
        message.className = 'message';
        // Exibe o modal
        modal.style.display = 'flex';
    };

    const closeModal = (modal) => {
        modal.style.display = 'none';
    };

    // Abrir modais
    loginUserCard.addEventListener('click', () => openModal(loginModal, messageContainerLogin));
    registerUserCard.addEventListener('click', () => openModal(registerModal, messageContainerRegister));

    // Fechar modais
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modalToClose = document.getElementById(modalId);
            closeModal(modalToClose);
        });
    });

    // Fechar ao clicar fora do modal
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            closeModal(loginModal);
        }
        if (event.target === registerModal) {
            closeModal(registerModal);
        }
    });
});


// --- CÓDIGO ORIGINAL (NÃO MODIFICADO) ---

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');

const showMessage = (msg, isError = false) => {
    messageDiv.textContent = msg;
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
};

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUser').value;
    const password = document.getElementById('regPass').value;

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
        showMessage(data.message, false);
        // Limpa os inputs do formulário de registro
        registerForm.reset();
    } else {
        showMessage(data.message, true);
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) { // res.ok verifica status 200-299
        // Redireciona para a página de sucesso, passando o nome do usuário como parâmetro
        window.location.href = `success.html?user=${data.username}`;
    } else {
        showMessage(data.message, true);
    }
});

async function changePassword(username, currentPassword, newPassword) {
    const res = await fetch('/api/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, currentPassword, newPassword })
    });
  
    const data = await res.json();
    return { success: res.ok, message: data.message };
  }
  
  // Função para deletar conta
  async function deleteAccount(username, password) {
    if (!confirm('Tem certeza que deseja deletar sua conta? Esta ação é irreversível.')) {
      return { success: false, message: 'Operação cancelada.' };
    }
  
    const res = await fetch('/api/delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  
    const data = await res.json();
    return { success: res.ok, message: data.message };
  }
  
  // Função para acessar dados do dashboard
  async function getDashboardData(token) {
    const res = await fetch('/api/dashboard-data', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });
  
    const data = await res.json();
    return { success: res.ok, data };
  }
  
  // Modificar o login para salvar o token
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;
  
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  
    const data = await res.json();
    if (res.ok) {
      // Salvar token no localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', data.username);
      
      // Redirecionar para o dashboard
      window.location.href = 'dashboard.html';
    } else {
      showMessage(data.message, true);
    }
  });

