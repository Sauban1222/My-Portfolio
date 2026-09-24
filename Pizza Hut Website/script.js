const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

const tabs = document.querySelectorAll('.tab');
const menuItems = document.querySelectorAll('.menu-item');

if (tabs.length && menuItems.length) {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selected = tab.dataset.filter;

      tabs.forEach((button) => button.classList.toggle('active', button === tab));

      menuItems.forEach((item) => {
        const category = item.dataset.category;
        const shouldShow = selected === 'all' || category === selected;
        item.classList.toggle('hidden', !shouldShow);
      });
    });
  });
}

const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.dataset.item || 'Pizza';
    window.location.href = `order.html?item=${encodeURIComponent(item)}`;
  });
});
