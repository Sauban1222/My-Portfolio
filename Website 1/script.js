const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.menu');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('active'));
  });
}
