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

    // Formulários
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    const showMessage = (msg, isError = false) => {
        message.textContent = msg;
        message.className = `message ${isError ? 'error' : 'success'}`;
    };

    // Registro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUser').value;
        const password = document.getElementById('regPass').value;

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                showMessage('Usuário registrado com sucesso!', false);
                setTimeout(() => {
                    closeModal(registerModal);
                }, 1500);
                registerForm.reset();
            } else {
                showMessage(data.message || 'Erro ao registrar.', true);
            }
        } catch (error) {
            console.error('Erro ao registrar:', error);
            showMessage('Erro ao registrar. Tente novamente.', true);
        }
    });

    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUser').value;
        const password = document.getElementById('loginPass').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                window.location.href = `success.html?user=${username}`;
            } else {
                showMessage(data.message || 'Usuário ou senha inválidos.', true);
            }
        } catch (error) {
            console.error('Erro ao logar:', error);
            showMessage('Erro ao logar. Tente novamente.', true);
        }
    });
});