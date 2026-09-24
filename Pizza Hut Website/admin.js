const ADMIN_PASSWORD = 'admin123';
const AUTH_KEY = 'pizzaHutAdminAuth';
const form = document.getElementById('adminLoginForm');
const message = document.getElementById('loginMessage');
const passwordInput = document.getElementById('adminPassword');

if (localStorage.getItem(AUTH_KEY) === 'true') {
  window.location.href = 'dashboard.html';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const entered = passwordInput.value.trim();

  if (entered === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, 'true');
    window.location.href = 'dashboard.html';
    return;
  }

  message.textContent = 'Incorrect password. Please try again.';
  passwordInput.value = '';
  passwordInput.focus();
});
