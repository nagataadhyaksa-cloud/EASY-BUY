// Import Firebase functions (sudah di HTML)
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

let products = []; // Will be loaded from Firebase

const cart = [];
const productGrid = document.getElementById('productGrid');
const cartButton = document.getElementById('cartButton');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutButton = document.getElementById('checkoutButton');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const addToCartFromModal = document.getElementById('addToCartFromModal');

function formatPrice(value) {
  return `Rp${value.toLocaleString('id-ID')}`;
}

async function loadProducts() {
  try {
    const querySnapshot = await getDocs(collection(window.db, 'products'));
    products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Products loaded:', products);
    renderProducts();
  } catch (error) {
    console.error('Error loading products:', error);
    // Fallback to static products if Firebase fails
    products = [
      {
        id: '1',
        name: 'Sepatu Sneakers Klasik',
        description: 'Sepatu sehari-hari yang nyaman dengan desain bersih.',
        price: 900000,
        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '2',
        name: 'Tas Punggung Minimalis',
        description: 'Tas punggung modern untuk kerja, sekolah, dan perjalanan.',
        price: 600000,
        image: 'https://images.unsplash.com/photo-1519737593435-2f7f54b13f8d?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '3',
        name: 'Headphone Nirkabel',
        description: 'Suara terisolasi dari kebisingan untuk fokus dan perjalanan.',
        price: 1350000,
        image: 'https://images.unsplash.com/photo-1517325232481-1c7b0a8c31a4?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '4',
        name: 'Mug Travel',
        description: 'Membuat minuman tetap panas atau dingin saat bepergian.',
        price: 300000,
        image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
      },
    ];
    renderProducts();
  }
}

function openModal(product) {
  // Close cart drawer if open
  if (cartDrawer.classList.contains('open')) {
    closeCartDrawer();
  }
  modalImage.src = product.image;
  modalImage.alt = product.name;
  modalName.textContent = product.name;
  modalDescription.textContent = product.description;
  modalPrice.textContent = formatPrice(product.price);
  addToCartFromModal.dataset.id = product.id;
  productModal.classList.add('visible');
  overlay.classList.add('visible');
  overlay.classList.remove('hidden');
}

function closeModal() {
  productModal.classList.remove('visible');
  overlay.classList.remove('visible');
  setTimeout(() => {
    if (!overlay.classList.contains('visible')) {
      overlay.classList.add('hidden');
    }
  }, 250);
}

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <div class="product-card" data-id="${product.id}">
          <img src="${product.image}" alt="${product.name}" />
          <div class="product-details">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${formatPrice(product.price)}</p>
            <button class="add-to-cart-button" data-id="${product.id}">Tambah ke Keranjang</button>
          </div>
        </div>
      `
    )
    .join('');
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = `<p style="color: var(--muted);">Keranjang Anda kosong.</p>`;
    cartTotal.textContent = formatPrice(0);
    cartCount.textContent = '0';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">${item.quantity} × ${formatPrice(item.price)}</div>
        </div>
        <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
      </div>
    `
    )
    .join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = formatPrice(total);
  cartCount.textContent = String(count);
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  openCart();
}

function openCart() {
  // Close modal if open
  if (productModal.classList.contains('visible')) {
    closeModal();
  }
  cartDrawer.classList.add('open');
  overlay.classList.add('visible');
  overlay.classList.remove('hidden');
}

function closeCartDrawer() {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('visible');
  setTimeout(() => {
    if (!overlay.classList.contains('visible')) {
      overlay.classList.add('hidden');
    }
  }, 250);
}

productGrid.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-id]');
  if (button) {
    addToCart(Number(button.dataset.id));
    return;
  }

  const card = event.target.closest('.product-card[data-id]');
  if (card) {
    const productId = Number(card.dataset.id);
    const product = products.find((item) => item.id === productId);
    if (product) {
      openModal(product);
    }
  }
});

cartButton.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartDrawer);
overlay.addEventListener('click', () => {
  if (productModal.classList.contains('visible')) {
    closeModal();
  } else {
    closeCartDrawer();
  }
});
closeModal.addEventListener('click', closeModal);
addToCartFromModal.addEventListener('click', () => {
  const productId = Number(addToCartFromModal.dataset.id);
  addToCart(productId);
  closeModal();
});
checkoutButton.addEventListener('click', () => {
  if (cart.length === 0) return;
  alert('Terima kasih telah mencoba demo checkout!');
  cart.length = 0;
  renderCart();
  closeCartDrawer();
});

loadProducts();
renderCart();
