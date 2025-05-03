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

// Order Functionality
const unitPrice = 990;
const shippingPrices = {
  inside: 50,
  outside: 100,
};

let allDistricts = [];
let allUpazilas = [];

async function loadDistricts() {
  const res = await fetch("bd-districts.json");
  const data = await res.json();
  allDistricts = data?.districts || [];

  const districtSelect = document.getElementById("district");
  districtSelect.innerHTML = '<option value="">জেলা খুজুন</option>';

  allDistricts.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.bn_name;
    districtSelect.appendChild(option);
  });
}

async function loadUpazilas(districtId) {
  const upazilaSelect = document.getElementById("upazila");
  upazilaSelect.innerHTML = '<option value="">উপজেলা খুজুন</option>';

  // Disable if district is not selected
  if (!districtId) {
    upazilaSelect.disabled = true;
    return;
  }

  // Enable if a district is selected
  upazilaSelect.disabled = false;

  // Load upazilas if not already loaded
  if (allUpazilas.length === 0) {
    const res = await fetch("bd-upazilas.json");
    const data = await res.json();
    allUpazilas = data?.upazilas || [];
  }

  const filtered = allUpazilas.filter(
    (item) => item.district_id === districtId
  );

  filtered.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.bn_name;
    upazilaSelect.appendChild(option);
  });
}

function updateQuantity(change) {
  const qtyInput = document.getElementById("quantity");
  let currentQty = parseInt(qtyInput.value) || 1;
  currentQty += change;
  if (currentQty < 1) currentQty = 1;
  qtyInput.value = currentQty;
  updateTotalPrice();
}

// Auto update when delivery selected
document.querySelectorAll('input[name="delivery"]').forEach((radio) => {
  radio.addEventListener("change", updateTotalPrice);
});

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

async function confirmOrder() {
  const name = document.querySelector('input[placeholder="নাম"]').value.trim();
  const phone = document.querySelector('input[type="tel"]').value.trim();
  const address = document.querySelector("textarea").value.trim();
  const delivery = document.querySelector(
    'input[name="delivery"]:checked'
  )?.value;
  const quantity = parseInt(document.getElementById("quantity").value);
  const unitPrice = parseInt(document.getElementById("unit-price").textContent);
  const shippingCost = parseInt(
    document.getElementById("shipping-cost").textContent
  );

  const districtId = document.getElementById("district").value;
  const upazilaId = document.getElementById("upazila").value;

  const selectedDistrict = allDistricts.find((d) => d.id === districtId);
  const selectedUpazila = allUpazilas.find((u) => u.id === upazilaId);

  const districtName = selectedDistrict?.name || "";
  const upazilaName = selectedUpazila?.name || "";

  if (
    !name ||
    !phone ||
    !address ||
    !delivery ||
    quantity < 1 ||
    !districtName ||
    !upazilaName
  ) {
    alert("অনুগ্রহ করে সব ফিল্ড পূরণ করুন।");
    return;
  }

  const totalPrice = unitPrice * quantity + shippingCost;

  const payload = {
    name,
    phone,
    district: districtName,
    upazila: upazilaName,
    street: address,
    price: totalPrice,
    quantity,
    shipping_cost: shippingCost,
    coupon: "",
  };

  try {
    const res = await fetch("https://order.allergyjom.shop/api/v1/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      alert("অর্ডার ব্যর্থ হয়েছে: " + (error?.message || "অনির্দিষ্ট সমস্যা"));
      return;
    }

    // Show success modal
    document.getElementById("orderSuccessModal").classList.remove("hidden");

    // Reset form
    document.querySelector('input[placeholder="নাম"]').value = "";
    document.querySelector('input[type="email"]').value = "";
    document.querySelector('input[type="tel"]').value = "";
    document.querySelector("textarea").value = "";
    document.getElementById("quantity").value = 1;
    document.getElementById("district").selectedIndex = 0;
    document.getElementById("upazila").innerHTML =
      '<option value="">উপজেলা খুজুন</option>';
    document.getElementById("upazila").disabled = true;
    document
      .querySelectorAll('input[name="delivery"]')
      .forEach((el) => (el.checked = false));
    document.getElementById("shipping-cost").textContent = "0";
    updateTotalPrice();
  } catch (err) {
    alert("অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    console.error("Order Error:", err);
  }
}

// Faqs Functionality
async function loadFAQs() {
  try {
    const res = await fetch("faqs.json");
    const faqs = await res.json();
    const container = document.getElementById("faq-container");
    container.innerHTML = "";

    faqs.forEach((faq, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "border rounded overflow-hidden";

      wrapper.innerHTML = `
          <button onclick="toggleFAQ(${index})"
            class="w-full flex justify-between items-center text-left p-4 font-semibold bg-gray-100 hover:bg-gray-200 transition duration-300"
          >
            <span>${faq.question}</span>
            <i id="icon-${index}" class="fas fa-chevron-down transform transition-all duration-300 text-lg"></i>
          </button>
          <div id="answer-${index}" class="px-4 max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-in-out">
            <p class="py-4 text-gray-700">${faq.answer}</p>
          </div>
        `;
      container.appendChild(wrapper);
    });
  } catch (err) {
    console.error("FAQ load error:", err);
  }
}

function toggleFAQ(index) {
  const answer = document.getElementById(`answer-${index}`);
  const icon = document.getElementById(`icon-${index}`);
  const isOpen = answer.classList.contains("max-h-40");

  if (isOpen) {
    answer.classList.remove("max-h-40", "opacity-100");
    answer.classList.add("max-h-0", "opacity-0");
    icon.classList.remove("rotate-180", "scale-125");
  } else {
    answer.classList.remove("max-h-0", "opacity-0");
    answer.classList.add("max-h-40", "opacity-100");
    icon.classList.add("rotate-180", "scale-125");
  }
}

window.onload = () => {
  initializeSwiper();
  loadFAQs();
  loadDistricts();
  loadUpazilas();
};
