import { getAllProducts, addProductHandler as addProduct, deleteProductHandler as deleteProduct, getProductById } from "../firebase/firebase.js";
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
        document.getElementById("total-products").textContent = `(${products.length})`;
        if (products.length === 0) {
            productsList.innerHTML = "<tr><td colspan='7' class='p-4 text-center text-lg'>No products found</td></tr>";
            return;
        }
        let tableRows = "";

        for (const product of products) {
            tableRows += `
                <tr class="hover:bg-gray-50">
                    <td class="p-4"><input type="checkbox" class="form-checkbox" /></td>
                    <td class="flex items-center gap-4 p-4">
                        <img src="${product.image}" class="w-12 h-12 rounded" alt="${product.name}" />
                        <span class="font-medium text-blue-600">${product.name}</span>
                    </td>
                    <td class="p-4 font-semibold">${product.price}</td>
                    <td class="p-4 text-gray-500">${product.brand}</td>
                    <td class="p-4 text-gray-500">${product.category}</td>
                    <td class="p-4 text-gray-500">${displayTime(product.createdAt)}</td>
                    <td class="p-4">
                    <i id="delProduct" class="mr-4 fa-solid fa-trash text-red-600 cursor-pointer" data-id="${product.id}"></i>
                    <i id="editProduct" class="fa-solid fa-pen-to-square text-blue-600 cursor-pointer" data-id="${product.id}"></i>
                    </td>
                </tr>
            `;
        }

        productsList.innerHTML = tableRows;

        // add event listeners to delete buttons
        document.querySelectorAll('#delProduct').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteProductHandler(btn.getAttribute('data-id'));
            });
        });

        // add event listeners to edit buttons
        document.querySelectorAll('#editProduct').forEach(btn => {
            btn.addEventListener('click', () => {
                editProductHandler(btn.getAttribute('data-id'));
            });
        });

    } catch (err) {
        notyfError(err.message);
    }
}

const deleteProductHandler = async (id) => {
    const isConfirm = confirm("Are you sure you want to delete this product?");
    if (!isConfirm) return;
    try {
        productsList.innerHTML = "<tr><td colspan='7' class='p-4 text-center text-lg'>Loading...</td></tr>";
        const msg = await deleteProduct(id);
        notyfSuccess(msg);
        getAllProductsHandler();
    } catch (err) {
        notyfError(err.message);
    }
}

const editProductHandler = async (id) => {
    document.getElementById("modal-title").textContent = "Edit Product";
    document.getElementById("modal-submit-btn").textContent = "Update Product";
    const btn = document.getElementById("toggle-modal");
    const name = document.getElementById("name")
    const brand = document.getElementById("brand");
    const price = document.getElementById("price");
    const category = document.getElementById("category");
    const description = document.getElementById("description");
    btn.click();
    try {
        const product = await getProductById(id);
        name.value = product.name;
        brand.value = product.brand;
        price.value = product.price;
        category.value = product.category;
        description.value = product.description;
        console.log(product);

    } catch (err) {
        notyfError(err.message);
    }

    console.log("clicked");
}

const displayTime = (timeStamp) => {
    return timeStamp.toDate().toLocaleString("en-US", {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

getAllProductsHandler();

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("admin");
    setTimeout(() => location = "login/index.html", 1000);
});

addProductForm.addEventListener("submit", () => {
    const submitBtn = document.getElementById("modal-submit-btn");
    if (submitBtn.textContent === "Update Product") {
        editProductHandler();
    } else {
        addProductHandler();
    }
});