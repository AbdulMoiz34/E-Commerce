import { getAllProducts, addProductHandler as addProduct } from "../firebase/firebase.js";
import { notyfSuccess, notyfError } from "../notyf/app.js";

const logoutBtn = document.getElementById("logout-btn");
const isLogin = localStorage.getItem("admin");
const addProductForm = document.getElementById("add-product-form");
const productsList = document.getElementById("products-list");

if (!isLogin) {
    location = "login/index.html";
}

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "productsImage");
    try {
        const res = await fetch("https://api.cloudinary.com/v1_1/moiz34/upload", {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        return data.secure_url;
    } catch (err) {
        console.log(err);
    }
}

const addProductHandler = async () => {
    event.preventDefault();
    addProductForm.querySelector("button[type='submit']").textContent = "Uploading...";
    const name = document.getElementById("name").value;
    const brand = document.getElementById("brand").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("file_input").files[0];
    try {
        const imageUrl = await uploadImage(image);
        const product = {
            name,
            brand,
            price,
            category,
            description,
            image: imageUrl

        }
        const msg = await addProduct(product);
        notyfSuccess(msg);
        location.reload();
    } catch (err) {
        notyfError(err.message);
    }
}

const getAllProductsHandler = async () => {
    try {
        productsList.innerHTML = "<tr><td colspan='7' class='p-4 text-center text-lg'>Loading...</td></tr>";
        const products = await getAllProducts();
        productsList.innerHTML = products.map((product) => `
            <tr class="hover:bg-gray-50">
                            <td class="p-4"><input type="checkbox" class="form-checkbox" /></td>
                            <td class="flex items-center gap-4 p-4">
                                <img src="${product.image}" class="w-12 h-12 rounded" alt="${product.name}" />
                                <span class="font-medium text-blue-600">${product.name}</span>
                            </td>
                            <td class="p-4 font-semibold">${product.price}</td>
                            <td class="p-4 text-gray-500">${product.brand}</td>
                            <td class="p-4 text-gray-500">${product.category}</td>
                            <td class="p-4 text-gray-500">Oct 18, 3:40 PM</td>
                            <td class="p-4">
                                <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots1"
                                    class="cursor-pointer text-gray-500 hover:text-gray-700">
                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                                    </svg>
                                </button>
                                <div id="dropdownDots1"
                                    class="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow">
                                    <ul class="py-1 text-sm text-gray-700">
                                        <li><a href="#" class="block px-4 py-2 hover:bg-gray-100">Edit</a></li>
                                        <li><a href="#" class="block px-4 py-2 hover:bg-gray-100">Delete</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
        `).join("");
    } catch (err) {
        notyfError(err.message);
    }
}

getAllProductsHandler();

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("admin");
    setTimeout(() => location = "login/index.html", 1000);
});

addProductForm.addEventListener("submit", addProductHandler);