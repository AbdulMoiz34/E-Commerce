import { getCurrentUser, logout } from "../firebase/firebase.js";
import { notyfError, notyfInfo } from "../notyf/app.js";

const navLoggedInIcons = document.querySelector(".nav-logged-in-icons");
const logoutBtn = document.getElementById("logout-btn");

const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        550: {
            slidesPerView: 2,
        },
        0: {
            slidesPerView: 1,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});

// get current user functionality
getCurrentUser().then((user) => {
    if (user) {
        navLoggedInIcons.classList.remove("hidden");
    }
}).catch(err => notyfError(err.message));

// logout functionality
logoutBtn.addEventListener("click", async () => {
    notyfInfo("Logging out...");
    await logout();
    navLoggedInIcons.classList.add("hidden");
});