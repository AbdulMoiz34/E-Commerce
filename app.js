import { getCurrentUser, logout } from "./firebase/firebase.js";
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
        clickable: true,
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
    console.log(user);
}).catch(err => notyfError(err.message));

logoutBtn.addEventListener("click", async () => {
    notyfInfo("Logging out...");
    await logout();
    navLoggedInIcons.classList.add("hidden");
});