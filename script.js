const SHIPPING_COST = 0;
const UNIT_PRICE = 700;

function formatPrice(price) {
  return new Intl.NumberFormat('en-BD', {
    // style: 'currency',
    // currency: 'BDT',
    minimumFractionDigits: 2
  }).format(price);
}

function setShippingCost(e) {
  const value = parseFloat(e.value || e.target.value);
  document.getElementById("shipping-cost").innerHTML = formatPrice(value)
}

function formatQuantity(price) {
  return new Intl.NumberFormat('bn-BD', {
    style: 'number',
    minimumFractionDigits: 2
  }).format(price);
}

function updateTotalPrice() {
  const quantity = Number(document.querySelector('[name="quantity"]:checked').value);
  console.log(quantity)

  let total = 0;
  if (quantity > 1) {
    const offerPrice = UNIT_PRICE - 150
    total = (quantity * offerPrice) + SHIPPING_COST;
  } else {
    total = (quantity * UNIT_PRICE) + SHIPPING_COST;
  }
  document.getElementById("total-price").textContent = total;
}

function initializeVideoSwiper() {
  new Swiper(".videoSwiper", {
    centeredSlides: true,
    slidesPerView: 4,
    initialSlide: 1,
    spaceBetween: 32,
    loop: true,
    pagination: {
      el: ".swiper-pagination.video",
      clickable: true,
    },
    autoplay: {
      delay: 4000, // delay in milliseconds
      disableOnInteraction: true, // keeps autoplay running even when user interacts
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 3,
      },
      // when window width is >= 1024px
      1024: {
        slidesPerView: 3,
      },
      // when window width is >= 1280px
      1280: {
        slidesPerView: 4,
      },
    },
  });
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
    slide.innerHTML = `<img src="${src}" class="w-full h-[380px] md:h-[450px] object-contain rounded" />`;
    wrapper.appendChild(slide);
  });

  // Now initialize Swiper
  new Swiper(".mySwiper", {
    centeredSlides: true,
    slidesPerView: 4,
    initialSlide: 1,
    spaceBetween: 32,
    loop: true,
    pagination: {
      el: ".swiper-pagination.reviews",
      clickable: true,
    },
    autoplay: {
      delay: 3000, // delay in milliseconds
      disableOnInteraction: true, // keeps autoplay running even when user interacts
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 3,
      },
      // when window width is >= 1024px
      1024: {
        slidesPerView: 3,
      },
      // when window width is >= 1280px
      1280: {
        slidesPerView: 4,
      },
    },
  });
}

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

function sendToGTM({ name, phone, district, upazila, street, coupon, price, quantity, shipping_cost }) {
  if (gtag) {
    gtag("event", "purchase", {
      transaction_id: "txn_" + Date.now(), // Ideally, use real order ID from backend
      value: (price * quantity + shipping_cost),
      currency: "BDT",
      items: [
        {
          item_id: "product-001", // Replace with real ID if possible
          item_name: "এলার্জির জম",
          price: price,
          quantity: quantity
        }
      ],
      customer_info: {
        name,
        phone,
        district,
        upazila,
        street,
        coupon
      }
    });
    console.log("GTAG Purchase event triggered.", window.dataLayer)
  } else {
    console.error("gtag undefined")
  }
}

function sendToFacebookPixel({ name, phone, district, upazila, street, coupon, price, quantity, shipping_cost }) {
  if (typeof fbq !== "undefined") {
    fbq('track', 'Purchase', {
      value: (price * quantity + shipping_cost),
      currency: 'BDT',
      contents: [
        {
          id: 'product-001', // Replace with actual product ID
          quantity: quantity,
          item_price: price
        }
      ],
      content_type: 'product',
      custom_data: {
        name,
        phone,
        district,
        upazila,
        street,
        coupon,
        shipping_cost
      }
    });

    console.log("FB Pixel Purchase event triggered.");
  } else {
    console.error("fbq is undefined.");
  }
}

async function confirmOrder(e) {
  e.preventDefault();

  const orderButton = document.getElementById("confirmOrder");
  if (orderButton) {
    orderButton.disabled = true;
  }
  document.getElementById("confirmOrderText").innerText = "Processing...";

  try {
    const formData = new FormData(e.target)
    const name = formData.get("name")
    const phone = formData.get("phone")
    const quantity = formData.get("quantity")
    const district = formData.get("district")
    const upazila = formData.get("upazila")
    const street = formData.get("street")
    const coupon = formData.get("coupon")
    const price = UNIT_PRICE

    // const district = allDistricts.find((d) => d.id === district_id).bn_name;
    // const upazila = allUpazilas.find((u) => u.id === upazila_id).bn_name;

    if (
      !name ||
      !phone ||
      !street ||
      !district ||
      !upazila
    ) {
      alert("অনুগ্রহ করে সব ফিল্ড পূরণ করুন।");
      return;
    }

    try {
      const payload = {
        name,
        phone,
        district,
        upazila,
        street,
        price,
        quantity,
        shipping_cost: SHIPPING_COST,
        coupon,
      }

      const res = await fetch("/api/v1/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Prevent automatic Ghost API request after form submission redirect by indicating intentional user action
          'X-User-Intent': 'true'
        },
        body: JSON.stringify(payload),
      });

      const data = res.json()

      if (!res.ok) {
        throw new Error("অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
      } else {
        localStorage.removeItem("incompleteForm");
        console.log("Completed and removed incomplete order.")

        sendToGTM(payload)
        sendToFacebookPixel(payload)

        if (orderButton) {
          orderButton.disabled = false
        }
        document.getElementById("confirmOrderText").innerText = "Confirm Order";

        const timeout = setTimeout(() => {
          location.href = "/success.html"
          clearTimeout(timeout)
        }, 500);
      }
    } catch (err) {
      console.error(err.message);
    }
  } catch (error) {
    console.log(error)
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

function incompleteOrder() {
  const form = document.getElementById("orderForm")

  if (form) {
    form.addEventListener("input", function () {
      const data = {};
      for (const element of form.elements) {
        if (element.name) {
          data[element.name] = element.value;
        }
      }
      localStorage.setItem("incompleteForm", JSON.stringify(data));
    })

    // Send data to server when tab is closing
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        const data = localStorage.getItem("incompleteForm");
        if (data) {
          const blob = new Blob([data], { type: "application/json" });
          navigator.sendBeacon("/api/v1/save-incomplete", blob);
          // Optionally clear it after sending
          console.log("Sending incomplete order to server")
          localStorage.removeItem("incompleteForm");
        }
      }
    });
  }
}

window.onload = () => {
  initializeSwiper();
  initializeVideoSwiper();
  loadFAQs();
  // loadDistricts();
  // loadUpazilas();
  updateTotalPrice();
  incompleteOrder();

  const orderForm = document.getElementById("orderForm")
  if (orderForm) {
    orderForm.addEventListener("submit", confirmOrder)
  }

  document.querySelectorAll('[name="quantity"]').forEach(e => {
    e.addEventListener("change", function () {
      updateTotalPrice();
    })
  })

  window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("shipping-cost").innerHTML = formatPrice(0)
  })
};