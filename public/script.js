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

    // Simulação de resposta da API para fins de demonstração
    console.log("Tentando registrar:", { username, password });
    if (username && password) {
        showMessage('Usuário registrado com sucesso!', false);
        setTimeout(() => {
             document.getElementById('registerModal').style.display = 'none';
        }, 1500);
        registerForm.reset();
    } else {
        showMessage('Por favor, preencha todos os campos.', true);
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;
    
    // Simulação de resposta da API para fins de demonstração
    console.log("Tentando logar:", { username, password });
    if (username === 'user' && password === '123') {
        window.location.href = `success.html?user=${username}`;
    } else {
        showMessage('Usuário ou senha inválidos.', true);
    }
});
