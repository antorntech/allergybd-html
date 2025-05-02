// function intializeSwiper() {
//   if (Swiper) {
//     var swiper = new Swiper(".mySwiper", {
//       effect: "coverflow",
//       grabCursor: true,
//       centeredSlides: true,
//       slidesPerView: 3,
//       initialSlide: 1,
//       loop: true,
//       coverflowEffect: {
//         rotate: 50,
//         stretch: 0,
//         depth: 100,
//         modifier: 1,
//         slideShadows: false,
//       },
//       pagination: {
//         el: ".swiper-pagination",
//         clickable: true,
//       },
//     });
//   }
// }

// window.onload = () => {
//   intializeSwiper();
// };

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

window.onload = () => {
  initializeSwiper();
};
