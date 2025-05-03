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

// async function loadDistricts() {
//   const res = await fetch("bd-districts.json");
//   const data = await res.json();
//   const districtSelect = document.getElementById("district");
//   districtSelect.innerHTML = '<option value="">জেলা খুজুন</option>';
//   data?.districts?.forEach((item) => {
//     const option = document.createElement("option");
//     option.value = item.id;
//     option.textContent = item.bn_name;
//     districtSelect.appendChild(option);
//   });
// }

// async function loadUpazilas(districtId) {
//   const upazilaSelect = document.getElementById("upazila");
//   upazilaSelect.innerHTML = '<option value="">উপজেলা খুজুন</option>';
//   const res = await fetch("bd-upazilas.json");
//   const data = await res.json();
//   const filtered = data?.upazilas?.filter(
//     (item) => item.district_id === districtId
//   );
//   filtered.forEach((item) => {
//     const option = document.createElement("option");
//     option.value = item.id;
//     option.textContent = item.bn_name;
//     upazilaSelect.appendChild(option);
//   });
// }

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

function confirmOrder() {
  const name = document.querySelector('input[placeholder="নাম"]').value.trim();
  const email = document.querySelector('input[type="email"]').value.trim();
  const phone = document.querySelector('input[type="tel"]').value.trim();
  const address = document.querySelector("textarea").value.trim();
  const delivery = document.querySelector(
    'input[name="delivery"]:checked'
  )?.value;
  const quantity = parseInt(document.getElementById("quantity").value);

  const districtId = document.getElementById("district").value;
  const upazilaId = document.getElementById("upazila").value;

  const selectedDistrict = allDistricts.find((d) => d.id === districtId);
  const selectedUpazila = allUpazilas.find((u) => u.id === upazilaId);

  const districtName = selectedDistrict?.name || "";
  const upazilaName = selectedUpazila?.name || "";

  if (
    !name ||
    !email ||
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

  console.log("অর্ডার ডিটেইলস:");
  console.log(`নাম: ${name}`);
  console.log(`ইমেইল: ${email}`);
  console.log(`ফোন নম্বর: ${phone}`);
  console.log(`ঠিকানা: ${address}`);
  console.log(`জেলা: ${districtName}`);
  console.log(`উপজেলা: ${upazilaName}`);
  console.log(`ডেলিভারি: ${delivery}`);
  console.log(`পরিমাণ: ${quantity}`);

  // Show modal
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
  document
    .querySelectorAll('input[name="delivery"]')
    .forEach((el) => (el.checked = false));
  document.getElementById("shipping-cost").textContent = "0";
  updateTotalPrice();
}

window.onload = () => {
  initializeSwiper();
  loadDistricts();
  loadUpazilas();
};
