function initializeSwiper() {
  const images = [
    "/assets/images/reviews/1.png",
    "/assets/images/reviews/2.png",
    "/assets/images/reviews/3.png",
    "/assets/images/reviews/4.png",
    "/assets/images/reviews/5.png",
    "/assets/images/reviews/6.png",
    "/assets/images/reviews/7.png",
    "/assets/images/reviews/8.png",
    "/assets/images/reviews/9.png",
    "/assets/images/reviews/10.png",
    "/assets/images/reviews/11.png",
    "/assets/images/reviews/12.png",
    "/assets/images/reviews/13.png",
    "/assets/images/reviews/14.png",
    "/assets/images/reviews/15.png",
  ];

  const wrapper = document.getElementById("swiper-wrapper");
  if (!wrapper || typeof Swiper === "undefined") return;

  // Clear any existing slides (in case of reinitialization)
  wrapper.innerHTML = "";

  // Add new slides
  images.forEach((src) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `<img src="${src}" class="w-full h-[200px] md:h-[450px] object-cover rounded" />`;
    wrapper.appendChild(slide);
  });

  // Now initialize Swiper
  new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 3,
    initialSlide: 1,
    loop: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

const unitPrice = 990;
const shippingPrices = {
  inside: 50,
  outside: 100,
};

function updateQuantity(change) {
  const qtyInput = document.getElementById("quantity");
  let currentQty = parseInt(qtyInput.value) || 1;
  currentQty += change;
  if (currentQty < 1) currentQty = 1;
  qtyInput.value = currentQty;
  updateTotalPrice();
}

function updateTotalPrice() {
  const qty = parseInt(document.getElementById("quantity").value);
  const delivery = document.querySelector(
    'input[name="delivery"]:checked'
  )?.value;

  const shippingCost = delivery ? shippingPrices[delivery] : 0;
  document.getElementById("shipping-cost").textContent = shippingCost;

  const total = qty * unitPrice + shippingCost;
  document.getElementById("total-price").textContent = total;
}

// Auto update when delivery selected
document.querySelectorAll('input[name="delivery"]').forEach((radio) => {
  radio.addEventListener("change", updateTotalPrice);
});

function confirmOrder() {
  const nameInput = document.querySelector('input[placeholder="নাম"]');
  const emailInput = document.querySelector('input[type="email"]');
  const phoneInput = document.querySelector('input[type="tel"]');
  const addressInput = document.querySelector("textarea");
  const deliveryInput = document.querySelector(
    'input[name="delivery"]:checked'
  );
  const quantityInput = document.getElementById("quantity");
  const totalInput = document.getElementById("total-price");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();
  const delivery = deliveryInput?.value;
  const quantity = parseInt(quantityInput.value);
  const total = parseInt(totalInput.textContent);

  if (!name || !email || !phone || !address || !delivery || quantity < 1) {
    alert("অনুগ্রহ করে সব ফিল্ড পূরণ করুন।");
    return;
  }

  console.log("অর্ডার ডিটেইলস:");
  console.log("নাম:", name);
  console.log("ইমেইল:", email);
  console.log("ফোন:", phone);
  console.log("ঠিকানা:", address);
  console.log(
    "ডেলিভারি:",
    delivery === "inside" ? "ঢাকার ভিতরে" : "ঢাকার বাহিরে"
  );
  console.log("পরিমাণ:", quantity);
  console.log("মোট মূল্য:", total);

  // Show modal
  document.getElementById("orderSuccessModal").classList.remove("hidden");

  // Reset form after short delay
  setTimeout(() => {
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    addressInput.value = "";
    quantityInput.value = "1";
    document
      .querySelectorAll('input[name="delivery"]')
      .forEach((radio) => (radio.checked = false));
    updateTotal(); // Optional: recalculate total based on reset quantity
  }, 500);
}

window.onload = () => {
  initializeSwiper();
};
