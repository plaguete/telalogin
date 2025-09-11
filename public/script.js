// public/script.js

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