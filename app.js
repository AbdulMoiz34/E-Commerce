import { getCurrentUser, logout, getSalesProducts } from "./firebase/firebase.js";
import { notyfError, notyfInfo } from "./notyf/app.js";

const navLoggedInIcons = document.querySelector(".nav-logged-in-icons");
const logoutBtn = document.getElementById("logout-btn");
const loader = document.querySelector(".sales-products-loader");

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

// category slider
const categorySwiper = new Swiper('.category-swiper', {
    slidesPerView: 5,
    spaceBetween: 20,
    breakpoints: {
        320: { slidesPerView: 2 },
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 }
    }
});

// custom navigation functionality
document.getElementById('prevBtn').addEventListener('click', () => {
    categorySwiper.slidePrev();
});
document.getElementById('nextBtn').addEventListener('click', () => {
    categorySwiper.slideNext();
});

// sales products functionality
const salesProducts = async () => {
    const salesProductsList = document.getElementById("sales-products-list");
    try {
        loader.classList.remove("hidden");
        const products = await getSalesProducts();
        salesProductsList.innerHTML = products.map((product) => `
            <div class="flex flex-col bg-white rounded-lg overflow-hidden group">
                <div class="bg-gray-200 rounded-md relative h-64">
                    <div class="p-3 flex justify-between items-start">
                        <span class="bg-[#DB4444] text-white text-sm px-2 py-1 rounded-md">-40%</span> 
                        <button class="cursor-pointer bg-white hover:text-red-600 rounded-full w-9 h-9 flex justify-center items-center">
                            <i class="fa-regular fa-heart text-lg"></i>
                        </button>
                    </div>
                    <div class="flex justify-center">
                        <img src="${product.image}" class="h-40 object-contain" alt="flash sale">
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button class="cursor-pointer bg-black hover:bg-gray-800 text-white w-full py-3">Add To Cart</button>
                    </div>
                </div>
                <div class="p-4 flex flex-col gap-1 flex-grow">
                    <p class="text-base font-semibold">${product.name}</p>
                    <div class="flex items-center gap-2">
                        <span class="text-[#DB4444] font-semibold">$${product.discountPrice}</span>
                        <span class="line-through text-gray-500 text-sm">$${product.price}</span>
                    </div>
                    <div class="flex gap-1 text-[#FFAD33]">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                </div>
            </div>`).join("");
    } catch (err) {
        notyfError(err.message);
    } finally {
        loader.classList.add("hidden");;
    }
}

salesProducts();


// Searching functionality 

const searchInput = document.getElementById("search-navbar");
searchInput.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        location = `./catalog/index.html?q=${searchInput.value}`;
    }
});