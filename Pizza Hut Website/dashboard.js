const STORAGE_KEY = 'pizzaHutOrders';
const AUTH_KEY = 'pizzaHutAdminAuth';

if (localStorage.getItem(AUTH_KEY) !== 'true') {
  window.location.href = 'admin.html';
}

const menuPrices = {
  'Pepperoni Party': 18.99,
  'Supreme Delight': 22.5,
  Margherita: 17.45,
  'Garlic Bread': 7.99,
  'Fresh Soda': 3.49,
  'Buffalo Wings': 11.99
};

const orderForm = document.getElementById('orderForm');
const orderList = document.getElementById('orderList');
const totalOrders = document.getElementById('totalOrders');
const pendingOrders = document.getElementById('pendingOrders');
const completedOrders = document.getElementById('completedOrders');
const itemSelect = document.getElementById('itemSelect');

const urlParams = new URLSearchParams(window.location.search);
const selectedItem = urlParams.get('item');

if (selectedItem && itemSelect) {
  const optionExists = Array.from(itemSelect.options).some((option) => option.value === selectedItem);
  if (optionExists) {
    itemSelect.value = selectedItem;
  }
}

function getOrders() {
  const savedOrders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return Array.isArray(savedOrders) ? savedOrders : [];
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function renderOrders() {
  const orders = getOrders();

  if (!orderList) return;

  if (!orders.length) {
    orderList.innerHTML = '<li class="empty-state">No orders yet.</li>';
    totalOrders.textContent = '0';
    pendingOrders.textContent = '0';
    completedOrders.textContent = '0';
    return;
  }

  const pending = orders.filter((order) => order.status === 'Pending').length;
  const completed = orders.filter((order) => order.status === 'Completed').length;

  totalOrders.textContent = orders.length;
  pendingOrders.textContent = pending;
  completedOrders.textContent = completed;

  orderList.innerHTML = orders
    .slice()
    .reverse()
    .map(
      (order) => `
        <li>
          <div class="order-meta">
            <span>${order.customerName}</span>
            <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
          </div>
          <div class="order-details">
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Item:</strong> ${order.item} x${order.quantity}</p>
            <p><strong>Size:</strong> ${order.size} • ${order.deliveryType}</p>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Notes:</strong> ${order.notes}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
          </div>
          <button class="status-toggle ${order.status === 'Completed' ? 'completed' : ''}" data-id="${order.id}">
            ${order.status === 'Pending' ? 'Mark as Completed' : 'Completed'}
          </button>
        </li>
      `
    )
    .join('');
}

function updateOrderStatus(orderId) {
  const orders = getOrders();
  const targetOrder = orders.find((order) => order.id === Number(orderId));

  if (!targetOrder) return;

  targetOrder.status = targetOrder.status === 'Pending' ? 'Completed' : 'Pending';
  saveOrders(orders);
  renderOrders();
}


if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(orderForm);
    const item = formData.get('item');
    const quantity = Number(formData.get('quantity')) || 1;
    const price = menuPrices[item] || 0;

    const newOrder = {
      id: Date.now(),
      customerName: formData.get('customerName'),
      phone: formData.get('phone'),
      item,
      quantity,
      size: formData.get('size'),
      deliveryType: formData.get('deliveryType'),
      address: formData.get('address'),
      notes: formData.get('notes') || 'No notes',
      total: Number((price * quantity).toFixed(2)),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    const orders = getOrders();
    orders.push(newOrder);
    saveOrders(orders);
    renderOrders();
    orderForm.reset();
  });
}

document.addEventListener('click', (event) => {
  const statusButton = event.target.closest('.status-toggle');
  if (!statusButton) return;

  updateOrderStatus(statusButton.dataset.id);
});

renderOrders();
