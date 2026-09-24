const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const cartCount = document.querySelector('.cart-count');
const revealItems = document.querySelectorAll('.reveal');
const yearEl = document.getElementById('year');
const cartOverlay = document.querySelector('.cart-overlay');
const cartPanel = document.querySelector('.cart-panel');
const cartItemsContainer = document.querySelector('.cart-items');
const cartSubtotal = document.querySelector('.cart-subtotal');
const cartTotal = document.querySelector('.cart-total');
const cartEmpty = document.querySelector('.cart-empty');
const cartCloseButton = document.querySelector('.cart-close');
const cartButton = document.querySelector('.cart-btn');

const cartItems = [];
const checkoutModal = document.querySelector('.checkout-modal');
const checkoutCloseButton = document.querySelector('.checkout-close');
const checkoutCancelButton = document.querySelector('.checkout-cancel');
const checkoutForm = document.getElementById('checkoutForm');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function openCheckout() {
  if (checkoutModal) {
    checkoutModal.classList.add('open');
    checkoutModal.setAttribute('aria-hidden', 'false');
  }
}

function closeCheckout() {
  if (checkoutModal) {
    checkoutModal.classList.remove('open');
    checkoutModal.setAttribute('aria-hidden', 'true');
  }
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function updateCartUI() {
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  if (cartCount) {
    cartCount.textContent = String(totalItems);
  }

  if (!cartItemsContainer) return;

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    if (cartSubtotal) cartSubtotal.textContent = '$0.00';
    if (cartTotal) cartTotal.textContent = '$0.00';
    return;
  }

  if (cartEmpty) cartEmpty.remove();

  cartItemsContainer.innerHTML = cartItems
    .map(
      (item) => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-thumb">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>${formatCurrency(item.price)}</p>
            <div class="qty-row">
              <button class="qty-btn" data-action="decrease" data-id="${item.id}" type="button">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn" data-action="increase" data-id="${item.id}" type="button">+</button>
            </div>
          </div>
          <button class="remove-item" data-id="${item.id}" type="button" aria-label="Remove item">×</button>
        </div>
      `
    )
    .join('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (cartSubtotal) cartSubtotal.textContent = formatCurrency(subtotal);
  if (cartTotal) cartTotal.textContent = formatCurrency(subtotal);
}

function openCart() {
  if (cartPanel) cartPanel.classList.add('open');
  if (cartOverlay) cartOverlay.classList.add('active');
  document.body.classList.add('cart-open');
}

function closeCart() {
  if (cartPanel) cartPanel.classList.remove('open');
  if (cartOverlay) cartOverlay.classList.remove('active');
  document.body.classList.remove('cart-open');
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));

    productCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !matches);
    });
  });
});

document.addEventListener('click', (event) => {
  const addButton = event.target.closest('.add-cart');
  if (addButton) {
    const productCard = addButton.closest('.product-card');
    const name = productCard?.querySelector('h3')?.textContent?.trim() || 'Product';
    const priceText = productCard?.querySelector('.product-row strong')?.textContent?.replace('$', '') || '0';
    const image = productCard?.querySelector('img')?.src || '';
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const existingItem = cartItems.find((item) => item.id === id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cartItems.push({ id, name, price: Number(priceText), image, qty: 1 });
    }

    updateCartUI();
    openCart();

    addButton.textContent = 'Added';
    addButton.style.background = '#1d2433';
    addButton.style.color = '#fff';

    setTimeout(() => {
      addButton.textContent = 'Add to cart';
      addButton.style.background = 'linear-gradient(135deg, #f8e6dc, #f7f1ec)';
      addButton.style.color = '#1d2433';
    }, 900);
  }

  const qtyButton = event.target.closest('.qty-btn');
  if (qtyButton) {
    const { id, action } = qtyButton.dataset;
    const item = cartItems.find((cartItem) => cartItem.id === id);
    if (!item) return;

    if (action === 'increase') item.qty += 1;
    if (action === 'decrease') item.qty -= 1;

    if (item.qty <= 0) {
      const itemIndex = cartItems.findIndex((cartItem) => cartItem.id === id);
      if (itemIndex >= 0) cartItems.splice(itemIndex, 1);
    }

    updateCartUI();
  }

  const removeButton = event.target.closest('.remove-item');
  if (removeButton) {
    const id = removeButton.dataset.id;
    const itemIndex = cartItems.findIndex((item) => item.id === id);
    if (itemIndex >= 0) cartItems.splice(itemIndex, 1);
    updateCartUI();
  }

  if (event.target.closest('.cart-btn')) {
    if (cartPanel?.classList.contains('open')) {
      closeCart();
    } else {
      openCart();
    }
  }

  if (event.target.closest('.cart-close') || event.target.closest('.cart-overlay')) {
    closeCart();
  }

  if (event.target.closest('.checkout-btn')) {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add products before checkout.');
      return;
    }
    closeCart();
    openCheckout();
  }

  if (event.target.closest('.checkout-close') || event.target.closest('.checkout-cancel')) {
    closeCheckout();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    nav.style.position = 'absolute';
    nav.style.top = '80px';
    nav.style.left = '16px';
    nav.style.right = '16px';
    nav.style.flexDirection = 'column';
    nav.style.padding = '20px';
    nav.style.background = 'rgba(255,255,255,0.9)';
    nav.style.border = '1px solid rgba(0,0,0,0.06)';
    nav.style.borderRadius = '16px';
    nav.style.boxShadow = '0 24px 40px rgba(22, 15, 12, 0.08)';
  });
}

const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = newsletterForm.querySelector('button');
    const input = newsletterForm.querySelector('input');

    if (button && input) {
      button.textContent = 'Subscribed';
      button.disabled = true;
      input.value = '';
      input.placeholder = 'Thanks for joining!';
    }
  });
}

updateCartUI();
if (checkoutForm) {
  checkoutForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add products before checkout.');
      return;
    }

    const submitButton = checkoutForm.querySelector('button[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : 'Send order';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    const formData = new FormData(checkoutForm);
    const customer = Object.fromEntries(formData.entries());
    const orderSummary = cartItems
      .map((item) => `${item.name} x${item.qty} - ${formatCurrency(item.price * item.qty)}`)
      .join('\n');
    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    const message = [
      'New order received!',
      '',
      'Customer details:',
      `Name: ${customer.fullName}`,
      `Email: ${customer.email}`,
      `Phone: ${customer.phone}`,
      `City: ${customer.city}`,
      `Address: ${customer.address}`,
      `Note: ${customer.note || 'No note'}`,
      '',
      'Order items:',
      orderSummary,
      '',
      `Total: ${formatCurrency(total)}`
    ].join('\n');

    try {
      const response = await fetch('https://formsubmit.co/ajax/alisooban12@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          city: customer.city,
          address: customer.address,
          note: customer.note || 'No note',
          subject: 'New Order from Velora',
          message: message,
          _captcha: 'false'
        })
      });

      if (!response.ok) {
        throw new Error('Email sending failed');
      }

      alert('Your order has been sent successfully. We will contact you soon.');
      checkoutForm.reset();
      cartItems.length = 0;
      closeCheckout();
      updateCartUI();
    } catch (error) {
      console.error(error);
      alert('There was a problem sending your order. Please try again.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  });
}