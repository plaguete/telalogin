const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');
const clockElement = document.getElementById('clock');

const showMessage = (msg, isError = false) => {
    messageDiv.textContent = msg;
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
};

// Atualizar relógio
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    clockElement.textContent = timeStr;
}
setInterval(updateClock, 1000);
updateClock();

// Adicionar eventos aos botões da janela (apresentacionais)
document.querySelectorAll('.xp-button').forEach(button => {
    button.addEventListener('click', function() {
        if (this.classList.contains('close')) {
            alert('O botão Fechar foi clicado. Esta é apenas uma demonstração.');
        } else if (this.classList.contains('minimize')) {
            alert('O botão Minimizar foi clicado. Esta é apenas uma demonstração.');
        } else if (this.classList.contains('maximize')) {
            alert('O botão Maximizar foi clicado. Esta é apenas uma demonstração.');
        }
    });
});

// Eventos de formulário (mantidos da versão original)
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUser').value;
    const password = document.getElementById('regPass').value;

    // Simulação de registro (substituir por chamada real à API)
    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (res.ok) {
            showMessage(data.message, false);
            registerForm.reset();
        } else {
            showMessage(data.message, true);
        }
    } catch (error) {
        showMessage('Erro de conexão. Tente novamente.', true);
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    // Simulação de login (substituir por chamada real à API)
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (res.ok) {
            // Redireciona para a página de sucesso, passando o nome do usuário como parâmetro
            window.location.href = `success.html?user=${data.username}`;
        } else {
            showMessage(data.message, true);
        }
    } catch (error) {
        showMessage('Erro de conexão. Tente novamente.', true);
    }
});