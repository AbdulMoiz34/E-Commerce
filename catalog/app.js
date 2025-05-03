import { getCurrentUser, logout } from "../firebase/firebase.js";
import { notyfError } from "../notyf/app.js";

const navLoggedInIcons = document.querySelector(".nav-logged-in-icons");
const logoutBtn = document.getElementById("logout-btn");
const searchInput = document.getElementById("search-input");
const productGrid = document.getElementById("product-grid");
const loader = document.querySelector(".loader");

getCurrentUser().then((user) => {
    if (user) {
        navLoggedInIcons.classList.remove("hidden");
    }
}).catch(err => notyfError(err.message));

const params = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("q");
};

let query = params();
searchInput.value = query;
searchInput.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        location.search = `q=${searchInput.value.toLowerCase()}`;
        query = params();
    }
});

logoutBtn.addEventListener("click", async () => {
    await logout();
    navLoggedInIcons.classList.add("hidden");
});
