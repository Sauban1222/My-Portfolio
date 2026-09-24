const STORAGE_KEY = 'pizzaHutOrders';
const menuPrices = {
  'Pepperoni Party': 18.99,
  'Supreme Delight': 22.5,
  Margherita: 17.45,
  'Garlic Bread': 7.99,
  'Fresh Soda': 3.49,
  'Buffalo Wings': 11.99
};

const orderForm = document.getElementById('customerOrderForm');
const orderMessage = document.getElementById('orderMessage');
const itemSelect = document.getElementById('itemSelect');
const urlParams = new URLSearchParams(window.location.search);
const selectedItem = urlParams.get('item');

if (selectedItem && itemSelect) {
  const matches = Array.from(itemSelect.options).some((option) => option.value === selectedItem);
  if (matches) itemSelect.value = selectedItem;
}

function getOrders() {
  const savedOrders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return Array.isArray(savedOrders) ? savedOrders : [];
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

    orderMessage.textContent = 'Your order was submitted successfully. The admin dashboard has received it.';
    orderForm.reset();
    itemSelect.value = 'Pepperoni Party';
  });
}
