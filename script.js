
const dishes = [
  {
    id: 1,
    name: "مشويات مشكلة",
    category: "mixed",
    description: "كباب وكفتة وفراخ مشوية مع أرز وسلطة.",
    price: 280,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    tag: "الأكثر طلبًا"
  },
  {
    id: 2,
    name: "كباب مشوي",
    category: "kebab",
    description: "قطع لحم متبلة ومشوية على الفحم.",
    price: 150,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
    tag: ""
  },
  {
    id: 3,
    name: "ريش ضاني",
    category: "ribs",
    description: "ريش ضاني مشوية بتتبيلة مميزة.",
    price: 220,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
    tag: "مميز"
  },
  {
    id: 4,
    name: "طاووق مشوي",
    category: "tawook",
    description: "قطع دجاج متبلة ومشوية مع الخضار.",
    price: 120,
    image: "https://images.unsplash.com/photo-1532634896-26909d0d4b44?auto=format&fit=crop&w=800&q=80",
    tag: ""
  },
  {
    id: 5,
    name: "كفتة على الفحم",
    category: "kebab",
    description: "كفتة متبلة ومشوية مع الخبز والسلطة.",
    price: 135,
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=800&q=80",
    tag: ""
  },
  {
    id: 6,
    name: "نصف فرخة مشوية",
    category: "chicken",
    description: "نصف دجاجة بتتبيلة العزبي الخاصة.",
    price: 170,
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80",
    tag: ""
  },
  {
    id: 7,
    name: "شيش طاووق",
    category: "tawook",
    description: "أسياخ دجاج مع الفلفل والطماطم.",
    price: 140,
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80",
    tag: ""
  },
  {
    id: 8,
    name: "وجبة فراخ مشوية",
    category: "chicken",
    description: "فراخ مشوية مع أرز وسلطة وطحينة.",
    price: 195,
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
    tag: ""
  }
];

const menuGrid = document.getElementById("menuGrid");
const categories = document.getElementById("categories");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

let activeCategory = "all";
let cart = {};
let toastTimer;

function formatPrice(price) {
  return `${price} جنيه`;
}

function renderDishes() {
  const query = searchInput.value.trim().toLowerCase();

  const filteredDishes = dishes.filter(dish => {
    const categoryMatch =
      activeCategory === "all" ||
      dish.category === activeCategory;

    const searchMatch =
      `${dish.name} ${dish.description}`
        .toLowerCase()
        .includes(query);

    return categoryMatch && searchMatch;
  });

  menuGrid.innerHTML = filteredDishes.map(dish => `
    <article class="menu-card">
      <div class="card-image">
        <img
          src="${dish.image}"
          alt="${dish.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/800x600/24221e/f5bd24?text=Al+Azaby'"
        >
        ${dish.tag ? `<span class="card-tag">${dish.tag}</span>` : ""}
      </div>

      <div class="card-content">
        <h3>${dish.name}</h3>
        <p>${dish.description}</p>

        <div class="card-bottom">
          <span class="price">${formatPrice(dish.price)}</span>
          <button class="add-button" data-add="${dish.id}">
            + أضف للسلة
          </button>
        </div>
      </div>
    </article>
  `).join("");

  emptyState.hidden = filteredDishes.length > 0;
}

function addToCart(id, change = 1) {
  const newQuantity = (cart[id] || 0) + change;

  if (newQuantity <= 0) {
    delete cart[id];
  } else {
    cart[id] = newQuantity;
  }

  renderCart();

  if (change > 0) {
    showToast("تمت إضافة الوجبة للسلة");
  }
}

function renderCart() {
  const entries = Object.entries(cart);

  const count = entries.reduce(
    (sum, [, quantity]) => sum + quantity,
    0
  );

  const total = entries.reduce((sum, [id, quantity]) => {
    const dish = dishes.find(item => item.id === Number(id));
    return sum + dish.price * quantity;
  }, 0);

  cartCount.textContent = count;
  cartTotal.textContent = formatPrice(total);

  if (entries.length === 0) {
    cartItems.innerHTML = `
      <p class="cart-empty">
        السلة فارغة، اختار وجبتك المفضلة من المنيو.
      </p>
    `;
    return;
  }

  cartItems.innerHTML = entries.map(([id, quantity]) => {
    const dish = dishes.find(item => item.id === Number(id));

    return `
      <div class="cart-item">
        <img src="${dish.image}" alt="${dish.name}">

        <div class="cart-item-info">
          <strong>${dish.name}</strong>
          <small>${formatPrice(dish.price * quantity)}</small>

          <div class="quantity-controls">
            <button data-qty="${id}" data-change="-1">−</button>
            <span>${quantity}</span>
            <button data-qty="${id}" data-change="1">+</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function showCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function hideCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
  document.body.style.overflow = "";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

categories.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");

  if (!button) return;

  activeCategory = button.dataset.category;

  categories.querySelectorAll(".category").forEach(category => {
    category.classList.toggle("active", category === button);
  });

  renderDishes();
});

searchInput.addEventListener("input", renderDishes);

menuGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (button) {
    addToCart(Number(button.dataset.add));
  }
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-qty]");

  if (button) {
    addToCart(
      Number(button.dataset.qty),
      Number(button.dataset.change)
    );
  }
});

document.getElementById("openCart")
  .addEventListener("click", showCart);

document.getElementById("closeCart")
  .addEventListener("click", hideCart);

overlay.addEventListener("click", hideCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") hideCart();
});

document.getElementById("checkoutButton")
  .addEventListener("click", () => {
    if (Object.keys(cart).length === 0) {
      showToast("السلة فارغة");
      return;
    }

    showToast("الطلب تجريبي ولم يتم إرساله للمطعم");
  });

document.getElementById("year").textContent =
  new Date().getFullYear();

renderDishes();
renderCart();
