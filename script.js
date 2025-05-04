function formatQuantity(price) {
  return new Intl.NumberFormat('bn-BD', {
    style: 'number',
    minimumFractionDigits: 2
  }).format(price);
}

function updateTotalPrice(e) {
  const qty = parseInt(document.getElementById("quantity").value);
  const shipping_cost = parseInt(e.target.value || 50)

  const total = qty * unitPrice + shipping_cost;
  document.getElementById("total-price").textContent = total;
}


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

// Auto update when shipping_cost selected
document.querySelectorAll('input[name="shipping_cost"]').forEach((radio) => {
  radio.addEventListener("change", updateTotalPrice);
});


// Auto update when shipping_cost selected
document.querySelectorAll('input[name="shipping_cost"]').forEach((radio) => {
  radio.addEventListener("change", updateTotalPrice);
});

async function confirmOrder(e) {
  e.preventDefault();

  try {
    const formData = new FormData(e.target)
    const name = formData.get("name")
    const email = formData.get("email")
    const phone = formData.get("phone")
    const shipping_cost = formData.get("shipping_cost")
    const quantity = formData.get("quantity")
    const district_id = formData.get("district")
    const upazila_id = formData.get("upazila")
    const street = formData.get("street")
    const coupon = formData.get("coupon")
    const price = 990

    const district = allDistricts.find((d) => d.id === district_id).bn_name;
    const upazila = allUpazilas.find((u) => u.id === upazila_id).bn_name;

    if (
      !name ||
      !phone ||
      !street ||
      !shipping_cost ||
      !district ||
      !upazila
    ) {
      alert("অনুগ্রহ করে সব ফিল্ড পূরণ করুন।");
      return;
    }

    try {
      const res = await fetch("https://order.allergyjom.shop/api/v1/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-User-Intent': 'true'
        },
        body: JSON.stringify({
          name,
          phone,
          district,
          upazila,
          street,
          price,
          quantity,
          shipping_cost,
          coupon,
        }),
      });

      const data = res.json()

      if (!res.ok) {
        throw new Error("অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
      }

      document.getElementById("orderSuccessModal").classList.remove("hidden")
    } catch (err) {
      console.error(err.message);
    }
  } catch (error) {
    console.log(error)
  }
}

document.getElementById("orderForm").addEventListener("submit", confirmOrder)

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
