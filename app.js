import { getCurrentUser, logout, getSalesProducts } from "./firebase/firebase.js";
import { notyfError, notyfInfo } from "./notyf/app.js";

const navLoggedInIcons = document.querySelector(".nav-logged-in-icons");
const logoutBtn = document.getElementById("logout-btn");
const swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: false,
    },
    effect: "coverflow",
    coverflowEffect: {
        rotate: 30,
        slideShadows: false,
        depth: 100,
        stretch: 0,
        modifier: 1,
    },
});

getCurrentUser().then((user) => {
    if (user) {
        navLoggedInIcons.classList.remove("hidden");
    }
}).catch(err => notyfError(err.message));

logoutBtn.addEventListener("click", async () => {
    notyfInfo("Logging out...");
    await logout();
    navLoggedInIcons.classList.add("hidden");
});


// Flash Sale Swiper

// category slider
const categorySwiper = new Swiper('.category-swiper', {
    slidesPerView: 5,
    spaceBetween: 20,
    breakpoints: {
        320: { slidesPerView: 2 },   // Mobile
        640: { slidesPerView: 3 },   // Small screens
        768: { slidesPerView: 4 },   // Medium screens
        1024: { slidesPerView: 5 }   // Large screens and up
    }
});

// Custom Navigation
document.getElementById('prevBtn').addEventListener('click', () => {
    categorySwiper.slidePrev();
});
document.getElementById('nextBtn').addEventListener('click', () => {
    categorySwiper.slideNext();
});

const salesProducts = async () => {
    try {
        document.querySelector(".sales-products-loader").classList.remove("hidden");
        const products = await getSalesProducts();
        console.log(products);
        document.querySelector(".sales-products-loader").classList.add("hidden");
    } catch (err) {
        console.log(err);
    }
}

salesProducts();

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.abc button');
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        notyfInfo("Product added to cart");
    });
});