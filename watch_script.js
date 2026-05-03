// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
  }, 80);
});
document.querySelectorAll('button, a, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => { follower.style.width = '50px'; follower.style.height = '50px'; follower.style.opacity = '1'; });
  el.addEventListener('mouseleave', () => { follower.style.width = '32px'; follower.style.height = '32px'; follower.style.opacity = '0.6'; });
});

// ===== NAV SCROLL =====
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 80);
});

// ===== CART =====
let cart = [];
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartFooter = document.getElementById('cartFooter');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.querySelector('.cart-count');

function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('active');
}
function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('active');
}

document.querySelector('.cart-link').addEventListener('click', e => { e.preventDefault(); openCart(); });
document.getElementById('cartClose').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function renderCart() {
  cartCountEl.textContent = cart.length;
  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="cart-empty"><div class="empty-icon">⌚</div><p>Your collection is empty</p><span>Add a timepiece to begin</span></div>`;
    cartFooter.style.display = 'none';
    return;
  }
  cartFooter.style.display = 'block';
  const total = cart.reduce((s, i) => s + i.price, 0);
  cartTotalEl.textContent = '$' + total.toLocaleString();
  cartItems.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price.toLocaleString()}</p>
      </div>
      <button class="cart-item-remove" onclick="removeItem(${idx})">✕ Remove</button>
    </div>
  `).join('');
}

function removeItem(idx) {
  cart.splice(idx, 1);
  renderCart();
}

document.querySelectorAll('.quick-add').forEach(btn => {
  btn.addEventListener('click', () => {
    cart.push({ name: btn.dataset.name, price: parseInt(btn.dataset.price) });
    renderCart();
    openCart();
  });
});

// ===== FILTERS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card, .hstat').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
  observer.observe(el);
});

// ===== LIVE CLOCK HANDS =====
function updateClock() {
  const now = new Date();
  const h = now.getHours() % 12, m = now.getMinutes(), s = now.getSeconds();
  const hDeg = h * 30 + m * 0.5;
  const mDeg = m * 6;
  const sDeg = s * 6;
  const hh = document.querySelector('.hour-hand');
  const mh = document.querySelector('.minute-hand');
  const sh = document.querySelector('.second-hand');
  if (hh) hh.style.transform = `rotate(${hDeg}deg)`;
  if (mh) mh.style.transform = `rotate(${mDeg}deg)`;
  if (sh) sh.style.transform = `rotate(${sDeg}deg)`;
}
updateClock();
setInterval(updateClock, 1000);
