const STORAGE_KEYS = {
  cart: "vapetrip-cart",
  theme: "vapetrip-theme",
  address: "vapetrip-address",
  contact: "vapetrip-contact",
  welcomeSeen: "vapetrip-welcome-seen"
};

const MIN_ORDER_TOTAL = 500;

const CATEGORY_FILTERS = [
  { key: "all", label: "Все" },
  { key: "pod-systems", label: "Под-системы" },
  { key: "ashki", label: "Ашки" },
  { key: "liquids", label: "Жидкости" },
  { key: "coils", label: "Испарители" },
  { key: "other", label: "Остальное" }
];

const SUB_FILTERS = {
  "pod-systems": [
    { key: "under-50", label: "до 50 ватт" },
    { key: "over-50", label: "более 50 ватт" }
  ],
  liquids: [
    { key: "strong", label: "крепкие" },
    { key: "light", label: "лёгкие" }
  ]
};

const fallbackProducts = [
  {
    id: crypto.randomUUID(),
    name: "VapeTrip Mini Air",
    category: "pod-systems",
    categoryLabel: "Под-системы",
    subcategory: "under-50",
    subcategoryLabel: "до 50 ватт",
    price: 2390,
    stock: 12,
    description: "Компактная под-система на каждый день с мягкой затяжкой и быстрым USB-C.",
    image: "product-images/pod-mini.svg",
    gallery: ["product-images/pod-mini.svg", "product-images/pod-plus.svg"]
  },
  {
    id: crypto.randomUUID(),
    name: "Neon Puff Mango Ice",
    category: "ashki",
    categoryLabel: "Ашки",
    subcategory: "",
    subcategoryLabel: "",
    price: 890,
    stock: 18,
    description: "Одноразовая система с ярким вкусом манго и прохладой.",
    image: "product-images/disposable.svg",
    gallery: ["product-images/disposable.svg", "product-images/disposable-alt.svg"]
  }
];

const state = {
  products: [],
  cart: loadFromStorage(STORAGE_KEYS.cart, []),
  address: loadFromStorage(STORAGE_KEYS.address, ""),
  contact: loadFromStorage(STORAGE_KEYS.contact, ""),
  currentCategory: "all",
  currentSubcategory: "all",
  searchQuery: "",
  selectedProductId: null
};

const els = {
  overlay: document.getElementById("overlay"),
  toast: document.getElementById("toast"),
  sidePanel: document.getElementById("sidePanel"),
  openSidePanel: document.getElementById("openSidePanel"),
  closeSidePanel: document.getElementById("closeSidePanel"),
  heroCartBtn: document.getElementById("heroCartBtn"),
  openCartBtn: document.getElementById("openCartBtn"),
  cartCountBadge: document.getElementById("cartCountBadge"),
  searchInput: document.getElementById("searchInput"),
  categoryFilters: document.getElementById("categoryFilters"),
  subFilters: document.getElementById("subFilters"),
  floatingFilters: document.getElementById("floatingFilters"),
  productGrid: document.getElementById("productGrid"),
  catalogStats: document.getElementById("catalogStats"),
  productModalTitle: document.getElementById("productModalTitle"),
  productGallery: document.getElementById("productGallery"),
  productModalPrice: document.getElementById("productModalPrice"),
  productModalDescription: document.getElementById("productModalDescription"),
  productModalAddToCart: document.getElementById("productModalAddToCart"),
  cartList: document.getElementById("cartList"),
  cartTotal: document.getElementById("cartTotal"),
  cartWarning: document.getElementById("cartWarning"),
  addressWarning: document.getElementById("addressWarning"),
  deliveryAddress: document.getElementById("deliveryAddress"),
  deliveryContact: document.getElementById("deliveryContact"),
  savedAddressNote: document.getElementById("savedAddressNote"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  clearCartBtn: document.getElementById("clearCartBtn"),
  welcomeConfirmBtn: document.getElementById("welcomeConfirmBtn")
};

const modalIds = ["productModal", "cartModal", "welcomeModal"];
let lastScrollY = window.scrollY;

init();

async function init() {
  applySavedTheme();
  bindEvents();
  syncCheckoutFields();
  renderFilters();
  renderCart();
  maybeShowWelcomeModal();
  await loadProducts();
}

function bindEvents() {
  els.searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value.trim().toLowerCase();
    renderProducts();
  });

  els.heroCartBtn.addEventListener("click", openCart);
  els.openCartBtn.addEventListener("click", openCart);

  els.productModalAddToCart.addEventListener("click", () => {
    const product = state.products.find((item) => item.id === state.selectedProductId);
    if (!product) return;
    addToCart(product.id, els.productGallery.querySelector("img"));
  });

  els.checkoutBtn.addEventListener("click", checkout);
  els.clearCartBtn.addEventListener("click", clearCart);
  els.welcomeConfirmBtn.addEventListener("click", () => {
    persist(STORAGE_KEYS.welcomeSeen, true);
    closeAllLayers();
  });

  els.deliveryAddress.addEventListener("input", saveCheckoutFields);
  els.deliveryContact.addEventListener("input", saveCheckoutFields);

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeAllLayers);
  });

  document.querySelectorAll(".theme-btn").forEach((button) => {
    button.addEventListener("click", () => setTheme(button.dataset.themeValue));
  });

  els.openSidePanel.addEventListener("click", () => {
    els.sidePanel.classList.add("is-open");
    els.overlay.classList.remove("hidden");
  });

  els.closeSidePanel.addEventListener("click", closeAllLayers);
  els.overlay.addEventListener("click", closeAllLayers);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllLayers();
  });

  window.addEventListener("scroll", handleFloatingFiltersVisibility, { passive: true });
}

async function loadProducts() {
  try {
    const response = await fetch("/.netlify/functions/products", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const products = Array.isArray(payload.products) ? payload.products : [];
    state.products = products.map(normalizeProduct).filter(Boolean);

    if (!state.products.length) {
      state.products = fallbackProducts;
      showToast("Таблица пока пуста. Показаны демо-товары.");
    }
  } catch (error) {
    console.error("Ошибка загрузки каталога:", error);
    state.products = fallbackProducts;
    showToast("Не удалось загрузить товары из Google Sheets. Показаны демо-товары.");
  }

  renderProducts();
}

function normalizeProduct(product) {
  if (!product || !product.name) return null;

  const gallery = Array.isArray(product.gallery)
    ? product.gallery
    : String(product.gallery || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const image = product.image || gallery[0] || "product-images/placeholder.svg";

  return {
    id: product.id || crypto.randomUUID(),
    name: product.name,
    category: product.category || "other",
    categoryLabel: product.categoryLabel || mapCategoryLabel(product.category || "other"),
    subcategory: product.subcategory || "",
    subcategoryLabel: product.subcategoryLabel || "",
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    description: product.description || "Описание скоро появится.",
    image,
    gallery: gallery.length ? gallery : [image]
  };
}

function renderFilters() {
  renderFilterGroup(els.categoryFilters, CATEGORY_FILTERS, false);
  renderFilterGroup(els.floatingFilters, CATEGORY_FILTERS, true);

  els.subFilters.innerHTML = "";
  const subFilterSet = SUB_FILTERS[state.currentCategory];
  if (!subFilterSet) return;

  [{ key: "all", label: "Все подфильтры" }, ...subFilterSet].forEach((filter) => {
    const button = document.createElement("button");
    button.className = `filter-btn ${state.currentSubcategory === filter.key ? "active" : ""}`;
    button.type = "button";
    button.textContent = filter.label;
    button.addEventListener("click", () => {
      state.currentSubcategory = filter.key;
      renderFilters();
      renderProducts();
    });
    els.subFilters.appendChild(button);
  });
}

function renderFilterGroup(container, filters, isFloating) {
  container.innerHTML = "";
  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.className = `filter-btn ${state.currentCategory === filter.key ? "active" : ""}`;
    button.type = "button";
    button.textContent = filter.label;
    button.addEventListener("click", () => {
      state.currentCategory = filter.key;
      state.currentSubcategory = "all";
      renderFilters();
      renderProducts();
      if (isFloating) {
        document.querySelector(".filters").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    container.appendChild(button);
  });
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  els.productGrid.innerHTML = "";
  els.catalogStats.textContent = `${filteredProducts.length} товаров`;

  if (!filteredProducts.length) {
    els.productGrid.innerHTML = '<div class="empty-state">По заданным фильтрам ничего не найдено.</div>';
    return;
  }

  const template = document.getElementById("productCardTemplate");
  filteredProducts.forEach((product) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const mediaBtn = card.querySelector(".product-card__media");
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    mediaBtn.appendChild(img);
    mediaBtn.addEventListener("click", () => openProduct(product.id));

    card.querySelector(".product-card__category").textContent = product.categoryLabel;
    card.querySelector(".product-card__title").textContent = product.name;
    card.querySelector(".product-card__price").textContent = formatPrice(product.price);
    card.querySelector(".product-card__action").addEventListener("click", () => openProduct(product.id));

    els.productGrid.appendChild(card);
  });
}

function renderCart() {
  persist(STORAGE_KEYS.cart, state.cart);
  els.cartList.innerHTML = "";
  const template = document.getElementById("cartItemTemplate");

  if (!state.cart.length) {
    els.cartList.innerHTML = '<div class="empty-state">Корзина пуста. Добавьте товары из каталога.</div>';
  } else {
    state.cart.forEach((cartItem) => {
      const product = state.products.find((item) => item.id === cartItem.productId);
      if (!product) return;

      const item = template.content.firstElementChild.cloneNode(true);
      item.querySelector(".cart-item__title").textContent = product.name;
      item.querySelector(".cart-item__meta").textContent = `${formatPrice(product.price)} за штуку`;
      item.querySelector(".qty-value").textContent = cartItem.quantity;
      item.querySelector(".cart-item__sum").textContent = formatPrice(product.price * cartItem.quantity);
      item.querySelector('[data-action="decrease"]').addEventListener("click", () => updateCartQuantity(product.id, -1));
      item.querySelector('[data-action="increase"]').addEventListener("click", () => updateCartQuantity(product.id, 1));
      els.cartList.appendChild(item);
    });
  }

  const total = getCartTotal();
  els.cartTotal.textContent = formatPrice(total);
  els.cartCountBadge.textContent = String(state.cart.reduce((sum, item) => sum + item.quantity, 0));
  els.cartWarning.classList.toggle("hidden", !state.cart.length || total >= MIN_ORDER_TOTAL);
  els.addressWarning.classList.add("hidden");
}

function openProduct(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  state.selectedProductId = productId;
  els.productModalTitle.textContent = product.name;
  els.productModalPrice.textContent = formatPrice(product.price);
  els.productModalDescription.textContent = product.description;
  els.productGallery.innerHTML = "";

  product.gallery.forEach((imagePath) => {
    const img = document.createElement("img");
    img.src = imagePath;
    img.alt = product.name;
    els.productGallery.appendChild(img);
  });

  openModal("productModal");
}

function addToCart(productId, sourceElement = null) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  const existing = state.cart.find((item) => item.productId === productId);
  if (existing) existing.quantity += 1;
  else state.cart.push({ productId, quantity: 1 });

  renderCart();
  animateAddToCart(sourceElement, els.heroCartBtn);
  showToast(`Товар "${product.name}" добавлен в корзину`);
}

function updateCartQuantity(productId, delta) {
  const cartItem = state.cart.find((item) => item.productId === productId);
  if (!cartItem) return;

  cartItem.quantity += delta;
  if (cartItem.quantity <= 0) {
    state.cart = state.cart.filter((item) => item.productId !== productId);
  }
  renderCart();
}

function clearCart() {
  state.cart = [];
  renderCart();
}

async function checkout() {
  const total = getCartTotal();
  if (total < MIN_ORDER_TOTAL) {
    els.cartWarning.classList.remove("hidden");
    return;
  }

  if (!state.address.trim() || !state.contact.trim()) {
    els.addressWarning.classList.remove("hidden");
    return;
  }

  const items = state.cart.map((item) => {
    const product = state.products.find((entry) => entry.id === item.productId);
    return product ? { name: product.name, price: product.price, quantity: item.quantity } : null;
  }).filter(Boolean);

  if (!items.length) return;

  const payload = {
    date: new Date().toLocaleString("ru-RU"),
    orderSummary: items.map((item) => `${item.name} ×${item.quantity}`).join(", "),
    address: state.address,
    contact: state.contact,
    total,
    items
  };

  try {
    const response = await fetch("/.netlify/functions/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    state.cart = [];
    renderCart();
    closeAllLayers();
    alert("Заказ успешно отправлен.");
  } catch (error) {
    console.error("Ошибка отправки заказа:", error);
    alert("Не удалось отправить заказ. Проверьте подключение и настройки сервера.");
  }
}

function getFilteredProducts() {
  return state.products.filter((product) => {
    const categoryMatches = state.currentCategory === "all" || product.category === state.currentCategory;
    const subcategoryMatches = state.currentSubcategory === "all" || product.subcategory === state.currentSubcategory;
    const textMatches = [product.name, product.description, product.categoryLabel, product.subcategoryLabel]
      .join(" ")
      .toLowerCase()
      .includes(state.searchQuery);
    return categoryMatches && subcategoryMatches && textMatches;
  });
}

function saveCheckoutFields() {
  state.address = els.deliveryAddress.value.trim();
  state.contact = els.deliveryContact.value.trim();
  persist(STORAGE_KEYS.address, state.address);
  persist(STORAGE_KEYS.contact, state.contact);
  syncCheckoutFields();
  els.addressWarning.classList.add("hidden");
}

function syncCheckoutFields() {
  els.deliveryAddress.value = state.address;
  els.deliveryContact.value = state.contact;
  els.savedAddressNote.textContent = state.address && state.contact
    ? "Адрес и контакт сохранены автоматически."
    : "Для заказа нужны адрес и телефон либо Telegram.";
}

function openCart() {
  syncCheckoutFields();
  openModal("cartModal");
}

function openModal(modalId) {
  closeAllLayers();
  document.getElementById(modalId).classList.remove("hidden");
  document.getElementById(modalId).setAttribute("aria-hidden", "false");
  els.overlay.classList.remove("hidden");
}

function closeAllLayers() {
  modalIds.forEach((id) => {
    const modal = document.getElementById(id);
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  });
  els.sidePanel.classList.remove("is-open");
  els.overlay.classList.add("hidden");
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => {
    const product = state.products.find((entry) => entry.id === item.productId);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}

function setTheme(theme) {
  document.body.classList.toggle("dark-theme", theme === "dark");
  persist(STORAGE_KEYS.theme, theme);
  document.querySelectorAll(".theme-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.themeValue === theme);
  });
}

function applySavedTheme() {
  const theme = loadFromStorage(STORAGE_KEYS.theme, "dark");
  setTheme(theme);
}

function handleFloatingFiltersVisibility() {
  const currentY = window.scrollY;
  const scrollingUp = currentY < lastScrollY;
  const passedThreshold = currentY > 420;
  els.floatingFilters.classList.toggle("hidden", !(scrollingUp && passedThreshold));
  lastScrollY = currentY;
}

function maybeShowWelcomeModal() {
  const welcomeSeen = loadFromStorage(STORAGE_KEYS.welcomeSeen, false);
  if (!welcomeSeen) openModal("welcomeModal");
}

function loadFromStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Ошибка чтения ${key}:`, error);
    return fallback;
  }
}

function persist(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatPrice(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function mapCategoryLabel(category) {
  const match = CATEGORY_FILTERS.find((item) => item.key === category);
  return match ? match.label : "Остальное";
}

function animateAddToCart(sourceElement, targetElement) {
  if (!sourceElement || !targetElement) return;

  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  if (!sourceRect.width || !sourceRect.height) return;

  const flyer = sourceElement.cloneNode(true);
  flyer.classList.add("cart-flyer");
  flyer.style.width = `${sourceRect.width}px`;
  flyer.style.height = `${sourceRect.height}px`;
  flyer.style.left = `${sourceRect.left}px`;
  flyer.style.top = `${sourceRect.top}px`;
  flyer.style.setProperty("--fly-x", `${targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2)}px`);
  flyer.style.setProperty("--fly-y", `${targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2)}px`);

  document.body.appendChild(flyer);
  targetElement.classList.add("cart-pill--pulse");

  flyer.addEventListener("animationend", () => flyer.remove(), { once: true });
  setTimeout(() => targetElement.classList.remove("cart-pill--pulse"), 520);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  requestAnimationFrame(() => els.toast.classList.add("is-visible"));

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    els.toast.classList.remove("is-visible");
    setTimeout(() => els.toast.classList.add("hidden"), 240);
  }, 2200);
}
