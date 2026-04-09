const STORAGE_KEYS = {
  products: "vapetrip-products",
  cart: "vapetrip-cart",
  theme: "vapetrip-theme",
  reports: "vapetrip-reports",
  address: "vapetrip-address",
  contact: "vapetrip-contact",
  welcomeSeen: "vapetrip-welcome-seen"
};

const ADMIN_PASSWORD = "83404";
const MIN_ORDER_TOTAL = 500;

const TELEGRAM_CONFIG = {
  botToken: "PASTE_TELEGRAM_BOT_TOKEN_HERE",
  chatId: "PASTE_TELEGRAM_CHAT_ID_HERE",
  customMessage: "Новый заказ с сайта VapeTrip"
};

const REPORTS_CONFIG = {
  googleAppsScriptUrl: "PASTE_GOOGLE_APPS_SCRIPT_URL_HERE"
};

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

const defaultProducts = [
  {
    id: crypto.randomUUID(),
    name: "VapeTrip Mini Air",
    category: "pod-systems",
    categoryLabel: "Под-системы",
    subcategory: "under-50",
    subcategoryLabel: "до 50 ватт",
    price: 2390,
    stock: 12,
    description: "Компактная под-система на каждый день с мягкой затяжкой, быстрым USB-C и удобным экраном.",
    image: "product-images/pod-mini.svg",
    gallery: ["product-images/pod-mini.svg", "product-images/pod-plus.svg"]
  },
  {
    id: crypto.randomUUID(),
    name: "CloudRoute X70",
    category: "pod-systems",
    categoryLabel: "Под-системы",
    subcategory: "over-50",
    subcategoryLabel: "более 50 ватт",
    price: 4290,
    stock: 7,
    description: "Мощная под-система для насыщенного вкуса и плотного пара. Регулировка до 70 ватт.",
    image: "product-images/pod-max.svg",
    gallery: ["product-images/pod-max.svg", "product-images/pod-plus.svg"]
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
    description: "Одноразовая система с ярким вкусом манго и прохладой на послевкусии.",
    image: "product-images/disposable.svg",
    gallery: ["product-images/disposable.svg", "product-images/disposable-alt.svg"]
  },
  {
    id: crypto.randomUUID(),
    name: "Salt Wave Strong Berry",
    category: "liquids",
    categoryLabel: "Жидкости",
    subcategory: "strong",
    subcategoryLabel: "крепкие",
    price: 650,
    stock: 24,
    description: "Крепкая солевая жидкость с насыщенной ягодной смесью и чистым вкусом.",
    image: "product-images/liquid-strong.svg",
    gallery: ["product-images/liquid-strong.svg", "product-images/liquid-light.svg"]
  },
  {
    id: crypto.randomUUID(),
    name: "Mint Drift Light",
    category: "liquids",
    categoryLabel: "Жидкости",
    subcategory: "light",
    subcategoryLabel: "лёгкие",
    price: 590,
    stock: 16,
    description: "Лёгкая жидкость с прохладной мятой и сбалансированной сладостью.",
    image: "product-images/liquid-light.svg",
    gallery: ["product-images/liquid-light.svg", "product-images/liquid-strong.svg"]
  },
  {
    id: crypto.randomUUID(),
    name: "Core Mesh 0.8",
    category: "coils",
    categoryLabel: "Испарители",
    subcategory: "",
    subcategoryLabel: "",
    price: 420,
    stock: 35,
    description: "Сетчатый испаритель для яркой передачи вкуса и стабильной тяги.",
    image: "product-images/coil.svg",
    gallery: ["product-images/coil.svg", "product-images/coil-alt.svg"]
  },
  {
    id: crypto.randomUUID(),
    name: "Trip Cotton Pack",
    category: "other",
    categoryLabel: "Остальное",
    subcategory: "",
    subcategoryLabel: "",
    price: 320,
    stock: 11,
    description: "Органический хлопок для обслуживаемых устройств и быстрой замены намотки.",
    image: "product-images/accessory.svg",
    gallery: ["product-images/accessory.svg", "product-images/accessory-alt.svg"]
  }
];

const state = {
  products: loadFromStorage(STORAGE_KEYS.products, defaultProducts),
  cart: loadFromStorage(STORAGE_KEYS.cart, []),
  reports: loadFromStorage(STORAGE_KEYS.reports, []),
  address: loadFromStorage(STORAGE_KEYS.address, ""),
  contact: loadFromStorage(STORAGE_KEYS.contact, ""),
  currentCategory: "all",
  currentSubcategory: "all",
  searchQuery: "",
  selectedProductId: null,
  adminAuthenticated: false
};

const els = {
  overlay: document.getElementById("overlay"),
  toast: document.getElementById("toast"),
  productGrid: document.getElementById("productGrid"),
  categoryFilters: document.getElementById("categoryFilters"),
  subFilters: document.getElementById("subFilters"),
  searchInput: document.getElementById("searchInput"),
  catalogStats: document.getElementById("catalogStats"),
  heroCartBtn: document.getElementById("heroCartBtn"),
  cartCountBadge: document.getElementById("cartCountBadge"),
  productModal: document.getElementById("productModal"),
  productModalTitle: document.getElementById("productModalTitle"),
  productGallery: document.getElementById("productGallery"),
  productModalPrice: document.getElementById("productModalPrice"),
  productModalStock: document.getElementById("productModalStock"),
  productModalDescription: document.getElementById("productModalDescription"),
  productModalAddToCart: document.getElementById("productModalAddToCart"),
  cartModal: document.getElementById("cartModal"),
  cartList: document.getElementById("cartList"),
  cartTotal: document.getElementById("cartTotal"),
  cartAddressPreview: document.getElementById("cartAddressPreview"),
  cartContactPreview: document.getElementById("cartContactPreview"),
  cartWarning: document.getElementById("cartWarning"),
  addressWarning: document.getElementById("addressWarning"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  clearCartBtn: document.getElementById("clearCartBtn"),
  adminModal: document.getElementById("adminModal"),
  adminPassword: document.getElementById("adminPassword"),
  adminSubmitBtn: document.getElementById("adminSubmitBtn"),
  adminLoginView: document.getElementById("adminLoginView"),
  adminDashboard: document.getElementById("adminDashboard"),
  adminProducts: document.getElementById("adminProducts"),
  showAddProductFormBtn: document.getElementById("showAddProductFormBtn"),
  addProductForm: document.getElementById("addProductForm"),
  addProductBtn: document.getElementById("addProductBtn"),
  newProductName: document.getElementById("newProductName"),
  newProductCategory: document.getElementById("newProductCategory"),
  newProductSubcategory: document.getElementById("newProductSubcategory"),
  newProductPrice: document.getElementById("newProductPrice"),
  newProductStock: document.getElementById("newProductStock"),
  newProductImage: document.getElementById("newProductImage"),
  newProductDescription: document.getElementById("newProductDescription"),
  reportTableBody: document.getElementById("reportTableBody"),
  revenueTotal: document.getElementById("revenueTotal"),
  exportReportsBtn: document.getElementById("exportReportsBtn"),
  openSidePanel: document.getElementById("openSidePanel"),
  closeSidePanel: document.getElementById("closeSidePanel"),
  sidePanel: document.getElementById("sidePanel"),
  deliveryAddress: document.getElementById("deliveryAddress"),
  deliveryContact: document.getElementById("deliveryContact"),
  saveAddressBtn: document.getElementById("saveAddressBtn"),
  savedAddressNote: document.getElementById("savedAddressNote"),
  welcomeConfirmBtn: document.getElementById("welcomeConfirmBtn")
};

const modalIds = ["productModal", "cartModal", "adminModal", "welcomeModal"];

init();

function init() {
  applySavedTheme();
  bindEvents();
  syncAddressUi();
  renderFilters();
  renderProducts();
  renderCart();
  renderAdminProducts();
  renderReports();
  maybeShowWelcomeModal();
}

function bindEvents() {
  els.searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value.trim().toLowerCase();
    renderProducts();
  });

  els.heroCartBtn.addEventListener("click", () => openModal("cartModal"));
  document.getElementById("openCartBtn").addEventListener("click", () => openModal("cartModal"));
  document.getElementById("adminLoginBtn").addEventListener("click", openAdmin);

  els.productModalAddToCart.addEventListener("click", () => {
    const product = state.products.find((item) => item.id === state.selectedProductId);
    if (product) {
      const sourceImage = els.productGallery.querySelector("img");
      addToCart(product.id, sourceImage);
    }
  });

  els.checkoutBtn.addEventListener("click", checkout);
  els.clearCartBtn.addEventListener("click", clearCart);
  els.adminSubmitBtn.addEventListener("click", handleAdminLogin);
  els.showAddProductFormBtn.addEventListener("click", () => els.addProductForm.classList.toggle("hidden"));
  els.addProductBtn.addEventListener("click", handleAddProduct);
  els.exportReportsBtn.addEventListener("click", exportReportsToCsv);
  els.saveAddressBtn.addEventListener("click", saveAddress);
  els.welcomeConfirmBtn.addEventListener("click", () => {
    persist(STORAGE_KEYS.welcomeSeen, true);
    closeAllModals();
  });
  els.overlay.addEventListener("click", closeAllModals);

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeAllModals);
  });

  document.querySelectorAll(".theme-btn").forEach((button) => {
    button.addEventListener("click", () => setTheme(button.dataset.themeValue));
  });

  els.openSidePanel.addEventListener("click", () => els.sidePanel.classList.add("is-open"));
  els.closeSidePanel.addEventListener("click", () => els.sidePanel.classList.remove("is-open"));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
      els.sidePanel.classList.remove("is-open");
    }
  });
}

function renderFilters() {
  els.categoryFilters.innerHTML = "";
  CATEGORY_FILTERS.forEach((filter) => {
    const button = document.createElement("button");
    button.className = `filter-btn ${state.currentCategory === filter.key ? "active" : ""}`;
    button.type = "button";
    button.textContent = filter.label;
    button.addEventListener("click", () => {
      state.currentCategory = filter.key;
      state.currentSubcategory = "all";
      renderFilters();
      renderProducts();
    });
    els.categoryFilters.appendChild(button);
  });

  els.subFilters.innerHTML = "";
  const subFilterSet = SUB_FILTERS[state.currentCategory];
  if (!subFilterSet) return;

  const allButton = document.createElement("button");
  allButton.className = `filter-btn ${state.currentSubcategory === "all" ? "active" : ""}`;
  allButton.type = "button";
  allButton.textContent = "Все подфильтры";
  allButton.addEventListener("click", () => {
    state.currentSubcategory = "all";
    renderFilters();
    renderProducts();
  });
  els.subFilters.appendChild(allButton);

  subFilterSet.forEach((filter) => {
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
    card.querySelector(".product-card__stock").textContent = `Остаток: ${product.stock}`;
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
  els.cartAddressPreview.textContent = state.address ? `Адрес получения: ${state.address}` : "Адрес не указан.";
  els.cartContactPreview.textContent = state.contact ? `Контакт: ${state.contact}` : "Контакт не указан.";
  els.cartWarning.classList.toggle("hidden", !state.cart.length || total >= MIN_ORDER_TOTAL);
  els.addressWarning.classList.add("hidden");
}

function renderAdminProducts() {
  els.adminProducts.innerHTML = "";
  if (!state.products.length) {
    els.adminProducts.innerHTML = '<div class="empty-state">Товары ещё не добавлены.</div>';
    return;
  }

  state.products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "admin-card";
    card.innerHTML = `
      <div class="admin-card__body">
        <h3 class="admin-card__title">${product.name}</h3>
        <p class="muted-text">${product.categoryLabel}${product.subcategoryLabel ? ` • ${product.subcategoryLabel}` : ""}</p>
      </div>
      <div class="admin-card__controls">
        <input class="text-field" type="number" min="0" value="${product.price}" data-role="price">
        <input class="text-field" type="number" min="0" value="${product.stock}" data-role="stock">
        <textarea class="text-field textarea-field" data-role="description">${product.description}</textarea>
        <button class="secondary-btn" type="button" data-role="toggle-stock">${product.stock > 0 ? "Отметить отсутствие" : "Отметить поступление"}</button>
        <button class="danger-btn" type="button" data-role="delete-product">Удалить товар</button>
      </div>
    `;

    const priceInput = card.querySelector('[data-role="price"]');
    const stockInput = card.querySelector('[data-role="stock"]');
    const descriptionInput = card.querySelector('[data-role="description"]');
    const toggleStockBtn = card.querySelector('[data-role="toggle-stock"]');
    const deleteProductBtn = card.querySelector('[data-role="delete-product"]');

    priceInput.addEventListener("change", () => updateProduct(product.id, { price: Number(priceInput.value) || 0 }));
    stockInput.addEventListener("change", () => updateProduct(product.id, { stock: Number(stockInput.value) || 0 }));
    descriptionInput.addEventListener("change", () => updateProduct(product.id, { description: descriptionInput.value.trim() }));
    toggleStockBtn.addEventListener("click", () => {
      const nextStock = product.stock > 0 ? 0 : 10;
      updateProduct(product.id, { stock: nextStock });
    });
    deleteProductBtn.addEventListener("click", () => deleteProduct(product.id));

    els.adminProducts.appendChild(card);
  });
}

function renderReports() {
  els.reportTableBody.innerHTML = "";

  if (!state.reports.length) {
    els.reportTableBody.innerHTML = '<tr><td colspan="4">Оплаченных заказов пока нет.</td></tr>';
  } else {
    state.reports.forEach((report) => {
      const row = document.createElement("tr");
      row.className = report.status === "out_of_stock" ? "report-row--out" : "report-row--paid";
      row.innerHTML = `
        <td>${report.date}</td>
        <td>${report.orderSummary}</td>
        <td>${formatPrice(report.total)}</td>
        <td>${report.statusLabel}</td>
      `;
      els.reportTableBody.appendChild(row);
    });
  }

  const totalRevenue = state.reports
    .filter((report) => report.status === "paid")
    .reduce((sum, report) => sum + report.total, 0);
  els.revenueTotal.textContent = `Выручка: ${formatPrice(totalRevenue)}`;
  persist(STORAGE_KEYS.reports, state.reports);
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

function openProduct(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  state.selectedProductId = productId;
  els.productModalTitle.textContent = product.name;
  els.productModalPrice.textContent = formatPrice(product.price);
  els.productModalStock.textContent = `На складе: ${product.stock} шт.`;
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
  if (!product || product.stock <= 0) {
    alert("Товар отсутствует на складе.");
    return;
  }

  const existing = state.cart.find((item) => item.productId === productId);
  const currentQty = existing ? existing.quantity : 0;
  if (currentQty >= product.stock) {
    alert("Нельзя добавить больше, чем есть на складе.");
    return;
  }

  if (existing) existing.quantity += 1;
  else state.cart.push({ productId, quantity: 1 });

  renderCart();
  animateAddToCart(sourceElement, els.heroCartBtn);
  showToast(`Товар "${product.name}" добавлен в корзину`);
}

function updateCartQuantity(productId, delta) {
  const cartItem = state.cart.find((item) => item.productId === productId);
  const product = state.products.find((item) => item.id === productId);
  if (!cartItem || !product) return;

  cartItem.quantity += delta;
  if (cartItem.quantity <= 0) state.cart = state.cart.filter((item) => item.productId !== productId);
  if (cartItem.quantity > product.stock) cartItem.quantity = product.stock;
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

  const cartSnapshot = state.cart.map((item) => {
    const product = state.products.find((entry) => entry.id === item.productId);
    return product ? { product, quantity: item.quantity } : null;
  }).filter(Boolean);

  if (!cartSnapshot.length) return;

  cartSnapshot.forEach(({ product, quantity }) => {
    updateProduct(product.id, { stock: Math.max(product.stock - quantity, 0) }, false);
  });

  const depletedProducts = cartSnapshot.filter(({ product, quantity }) => product.stock - quantity <= 0);
  const orderSummary = cartSnapshot.map(({ product, quantity }) => `${product.name} ×${quantity}`).join(", ");

  const paidReport = {
    id: crypto.randomUUID(),
    date: new Date().toLocaleString("ru-RU"),
    orderSummary,
    address: state.address,
    contact: state.contact,
    total,
    status: "paid",
    statusLabel: "Оплачен"
  };

  state.reports.unshift(paidReport);
  depletedProducts.forEach(({ product }) => {
    state.reports.unshift({
      id: crypto.randomUUID(),
      date: new Date().toLocaleString("ru-RU"),
      orderSummary: product.name,
      total: 0,
      status: "out_of_stock",
      statusLabel: "Товар закончился"
    });
  });

  persist(STORAGE_KEYS.products, state.products);
  renderProducts();
  renderAdminProducts();
  renderReports();

  try {
    await Promise.all([sendOrderToTelegram(paidReport), sendOrderToGoogleSheets(paidReport)]);
  } catch (error) {
    console.error("Ошибка отправки данных:", error);
  }

  state.cart = [];
  renderCart();
  closeAllModals();
  alert("Оплата успешно обработана. Заказ сохранён и отправлен.");
}

async function sendOrderToTelegram(report) {
  if (
    !TELEGRAM_CONFIG.botToken ||
    TELEGRAM_CONFIG.botToken.includes("PASTE_") ||
    !TELEGRAM_CONFIG.chatId ||
    TELEGRAM_CONFIG.chatId.includes("PASTE_")
  ) return;

  const message = `${TELEGRAM_CONFIG.customMessage}\n\nДата: ${report.date}\nСостав: ${report.orderSummary}\nСумма: ${formatPrice(report.total)}`;
  const messageWithAddress = `${message}\nАдрес: ${report.address}\nКонтакт: ${report.contact}`;
  const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CONFIG.chatId,
      text: messageWithAddress
    })
  });
}

async function sendOrderToGoogleSheets(report) {
  if (!REPORTS_CONFIG.googleAppsScriptUrl || REPORTS_CONFIG.googleAppsScriptUrl.includes("PASTE_")) return;

  await fetch(REPORTS_CONFIG.googleAppsScriptUrl, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report)
  });
}

function handleAdminLogin() {
  if (els.adminPassword.value === ADMIN_PASSWORD) {
    state.adminAuthenticated = true;
    els.adminLoginView.classList.add("hidden");
    els.adminDashboard.classList.remove("hidden");
    renderAdminProducts();
    renderReports();
  } else {
    alert("Неверный пароль.");
  }
}

function handleAddProduct() {
  const name = els.newProductName.value.trim();
  const categoryRaw = els.newProductCategory.value.trim();
  const subcategoryRaw = els.newProductSubcategory.value.trim();
  const description = els.newProductDescription.value.trim();
  const image = els.newProductImage.value.trim() || "product-images/placeholder.svg";
  const price = Number(els.newProductPrice.value) || 0;
  const stock = Number(els.newProductStock.value) || 0;

  if (!name || !categoryRaw) {
    alert("Укажите хотя бы название и категорию.");
    return;
  }

  const product = {
    id: crypto.randomUUID(),
    name,
    category: normalizeCategoryKey(categoryRaw),
    categoryLabel: categoryRaw,
    subcategory: normalizeCategoryKey(subcategoryRaw),
    subcategoryLabel: subcategoryRaw,
    price,
    stock,
    description,
    image,
    gallery: [image]
  };

  state.products.unshift(product);
  persist(STORAGE_KEYS.products, state.products);
  renderProducts();
  renderAdminProducts();
  els.addProductForm.reset();
  els.addProductForm.classList.add("hidden");
}

function updateProduct(productId, updates, rerender = true) {
  state.products = state.products.map((product) => (
    product.id === productId ? { ...product, ...updates } : product
  ));
  persist(STORAGE_KEYS.products, state.products);
  if (rerender) {
    renderProducts();
    renderAdminProducts();
  }
}

function deleteProduct(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  const confirmed = window.confirm(`Удалить "${product.name}" из каталога?`);
  if (!confirmed) return;

  state.products = state.products.filter((item) => item.id !== productId);
  state.cart = state.cart.filter((item) => item.productId !== productId);
  persist(STORAGE_KEYS.products, state.products);
  persist(STORAGE_KEYS.cart, state.cart);
  renderProducts();
  renderCart();
  renderAdminProducts();
  showToast(`Товар "${product.name}" удалён`);
}

function openAdmin() {
  openModal("adminModal");
  if (state.adminAuthenticated) {
    els.adminLoginView.classList.add("hidden");
    els.adminDashboard.classList.remove("hidden");
  } else {
    els.adminLoginView.classList.remove("hidden");
    els.adminDashboard.classList.add("hidden");
    els.adminPassword.value = "";
  }
}

function openModal(modalId) {
  closeAllModals();
  document.getElementById(modalId).classList.remove("hidden");
  document.getElementById(modalId).setAttribute("aria-hidden", "false");
  els.overlay.classList.remove("hidden");
}

function closeAllModals() {
  modalIds.forEach((id) => {
    const modal = document.getElementById(id);
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  });
  els.overlay.classList.add("hidden");
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => {
    const product = state.products.find((entry) => entry.id === item.productId);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}

function exportReportsToCsv() {
  const rows = [
    ["date", "orderSummary", "address", "contact", "total", "status", "statusLabel"],
    ...state.reports.map((report) => [
      report.date,
      report.orderSummary,
      report.address || "",
      report.contact || "",
      report.total,
      report.status,
      report.statusLabel
    ])
  ];
  const csv = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "reports.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function setTheme(theme) {
  document.body.classList.toggle("dark-theme", theme === "dark");
  persist(STORAGE_KEYS.theme, theme);
  document.querySelectorAll(".theme-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.themeValue === theme);
  });
}

function applySavedTheme() {
  const theme = loadFromStorage(STORAGE_KEYS.theme, "light");
  setTheme(theme);
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

function normalizeCategoryKey(value) {
  return value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-я0-9-]/gi, "");
}

function escapeCsvValue(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
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

function saveAddress() {
  state.address = els.deliveryAddress.value.trim();
  state.contact = els.deliveryContact.value.trim();
  persist(STORAGE_KEYS.address, state.address);
  persist(STORAGE_KEYS.contact, state.contact);
  syncAddressUi();
  renderCart();
}

function syncAddressUi() {
  els.deliveryAddress.value = state.address;
  els.deliveryContact.value = state.contact;
  els.savedAddressNote.textContent = state.address && state.contact
    ? "Адрес и контакт сохранены и будут отправлены вместе с заказом."
    : "Для заказа нужны адрес и телефон либо Telegram.";
}

function maybeShowWelcomeModal() {
  const welcomeSeen = loadFromStorage(STORAGE_KEYS.welcomeSeen, false);
  if (!welcomeSeen) {
    openModal("welcomeModal");
  }
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
