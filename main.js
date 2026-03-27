var swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: "#next",
    prevEl: "#prev",
  },
});

const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close-btn");
const cardList = document.querySelector(".card-list");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartValue = document.querySelector(".cart-value");
const checkoutBtn = document.querySelector(".checkout-btn");
const appBtn = document.querySelector(".app-btn");
const subscribeBtn = document.querySelector(".subscribe-btn");
const emailInput = document.querySelector("#email");
const modal = document.querySelector(".app-modal");
const closeModal = document.querySelector(".close-modal");
const installBtn = document.querySelector(".install-btn");

cartIcon.addEventListener("click", () =>
  cartTab.classList.add("cart-tab-active"),
);

closeBtn.addEventListener("click", () =>
  cartTab.classList.remove("cart-tab-active"),
);

let productList = [];
let cartProduct = [];

const updateTotals = () => {
  let totalPrice = 0;
  let totalQuantity = 0;

  document.querySelectorAll(".item").forEach((item) => {
    const quantity = parseInt(
      item.querySelector(".quantity-value").textContent,
    );

    const price = parseFloat(
      item.querySelector(".item-total").textContent.replace("$", ""),
    );
    totalPrice += price;
    totalQuantity += quantity;
  });
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  cartValue.textContent = totalQuantity;
};

const showCards = () => {
  productList.forEach((product) => {
    const orderCard = document.createElement("div");
    orderCard.classList.add("order-card");

    orderCard.innerHTML = `
    <div class="card-image">
      <img src="${product.image}">
    </div>
    <h4>${product.name}</h4>
    <h4 class="price">${product.price}</h4><br/>
    <a href="#" class="btn card-btn">Add to cart</a>
    `;

    cardList.appendChild(orderCard);

    const cardBtn = orderCard.querySelector(".card-btn");
    cardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(product);
    });
  });
};

const addToCart = (product) => {
  const existingProduct = cartProduct.find((item) => item.id === product.id);
  if (existingProduct) {
    alert("Item already in your cart!");
    return;
  }
  cartProduct.push(product);

  let quantity = 1;
  let price = parseFloat(product.price.replace("$", ""));

  const cartItem = document.createElement("div");
  cartItem.classList.add("item");

  cartItem.innerHTML = `
  <div class="item-image">
    <img src="${product.image}" />
  </div>

  <div class="detail">
    <h4>${product.name}</h4>
    <h4 class="item-total">${product.price}</h4>
  </div>

  <div class="quantity-box">
    <a href="#" class="quantity-btn minus">
      <i class="fa-solid fa-minus"></i>
    </a>
    <h4 class="quantity-value">${quantity}</h4>
    <a href="#" class="quantity-btn plus">
      <i class="fa-solid fa-plus"></i>
    </a>
  </div>
`;

  cartList.appendChild(cartItem);
  updateTotals();

  const plusBtn = cartItem.querySelector(".plus");
  const quantityValue = cartItem.querySelector(".quantity-value");
  const itemTotal = cartItem.querySelector(".item-total");
  const minusBtn = cartItem.querySelector(".minus");

  plusBtn.addEventListener("click", (e) => {
    e.preventDefault();
    quantity++;
    quantityValue.textContent = quantity;
    itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
    updateTotals();
  });

  minusBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (quantity > 1) {
      quantity--;
      quantityValue.textContent = quantity;
      itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
      updateTotals();
    } else {
      cartItem.classList.add("slide-out");
      setTimeout(() => {
        cartItem.remove();
        cartProduct = cartProduct.filter((item) => item.id !== product.id);
        updateTotals();
      }, 300);
    }
  });
};

const initApp = () => {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      productList = data;
      showCards();
    });
};

initApp();

const showToast = (msg) => {
  const toast = document.createElement("div");
  toast.textContent = msg;

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#212121";
  toast.style.color = "#fff";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "8px";
  toast.style.fontSize = "14px";
  toast.style.zIndex = "9999";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);

  toast.style.opacity = "0";
  toast.style.transition = "0.3s";

  setTimeout(() => {
    toast.style.opacity = "1";
  }, 10);
};

const surpriseBtn = document.querySelector(".surprise-btn");

surpriseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (productList.length === 0) return;

  const randomIndex = Math.floor(Math.random() * productList.length);
  const randomProduct = productList[randomIndex];

  addToCart(randomProduct);

  alert(`🎉 Surprise! We picked: ${randomProduct.name}`);
});

const orderBtn = document.querySelector(".order-btn");
const menuSection = document.querySelector("#menu-section");

orderBtn.addEventListener("click", (e) => {
  e.preventDefault();

  menuSection.scrollIntoView({
    behavior: "smooth",
  });
});

checkoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // If cart empty
  if (cartProduct.length === 0) {
    showToast("🛒 Your cart is empty!");
    return;
  }

  // Success message
  showToast("✅ Order placed successfully!");

  // Clear cart UI
  cartList.innerHTML = "";

  // Reset data
  cartProduct = [];

  // Reset totals
  cartTotal.textContent = "$0.00";
  cartValue.textContent = "0";

  // Close cart tab
  cartTab.classList.remove("cart-tab-active");
});

subscribeBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();

  // empty check
  if (email === "") {
    showToast("⚠️ Please enter your email");
    return;
  }

  // simple email validation
  if (!email.includes("@") || !email.includes(".")) {
    showToast("❌ Enter a valid email address");
    return;
  }

  // success
  showToast("✅ Subscribed successfully!");

  emailInput.value = ""; // clear input
});

appBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.add("active");
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
});

installBtn.addEventListener("click", (e) => {
  e.preventDefault();

  showToast("⬇️ Installing QuickPick...");

  setTimeout(() => {
    showToast("✅ App Installed!");
    modal.classList.remove("active");
  }, 1500);
});

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navlist a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ================= USER LOGIN UI =================

const navActions = document.getElementById("navActions");

// ================= USER LOGIN UI =================

const signupBtn = document.getElementById("signupBtn");
const userGreeting = document.getElementById("userGreeting");
const logoutBtn = document.getElementById("logoutBtn");

const checkUser = () => {
  const user = localStorage.getItem("quickpickUser");

  if (user) {
    signupBtn.style.display = "none";

    userGreeting.style.display = "block";
    userGreeting.textContent = `Hi, ${user} 👋`;

    logoutBtn.style.display = "inline-block";
  }
};

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("quickpickUser");
  location.reload();
});

// Run on load
checkUser();

// Re-attach cart open event
document.addEventListener("click", (e) => {
  if (e.target.closest(".cart-icon")) {
    cartTab.classList.add("cart-tab-active");
  }
});
